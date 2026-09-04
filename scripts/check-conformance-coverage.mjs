#!/usr/bin/env node
/**
 * check-conformance-coverage — el medidor del hueco de conformance.
 *
 * Los contratos canonicos (rama canonical) prometen comportamiento con
 * criterios verify:'automated'. El runner del canon los ejercita sobre el DOM
 * del canon; NADIE los ejecutaba contra esta implementacion. Este medidor
 * cuenta cuantos criterios automatizados tienen al menos un test del repo que
 * los referencia por id (convencion: el test cita el id — af-1, sel-7, mnu-2 —
 * en su describe/comentario, como hacen los tests de la tanda de construccion).
 *
 * Reporta y no bloquea; con --min N sale 1 si la cobertura cae de N criterios
 * cubiertos (ratchet: solo puede subir).
 *
 *   node scripts/check-conformance-coverage.mjs [--json] [--min N] [--verbose]
 */
import { readFileSync, readdirSync, statSync, mkdtempSync, rmSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { join, dirname, relative } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

// contratos desde la rama canonical, sin depender de carpetas hermanas
const tmp = mkdtempSync(join(tmpdir(), 'flow-canon-'))
let ref = null
for (const r of ['origin/canonical', 'canonical']) {
  try {
    execSync(`git archive ${r} contracts architecture.json | tar -x -C ${tmp}`, { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] })
    ref = r
    break
  } catch {}
}
if (!ref) {
  console.log('conformance: la rama canonical no esta disponible — medidor omitido (git fetch origin canonical).')
  process.exit(0)
}

const arq = JSON.parse(readFileSync(join(tmp, 'architecture.json'), 'utf8'))
const criterios = [] // { item, id, rule }
for (const it of arq.items) {
  let c
  try { c = JSON.parse(readFileSync(join(tmp, it.contract), 'utf8')) } catch { continue }
  for (const cr of (c.conformance && c.conformance.criteria) || []) {
    if (cr.verify === 'automated') criterios.push({ item: it.id, id: cr.id, rule: cr.rule })
  }
}
rmSync(tmp, { recursive: true, force: true })

// corpus de tests del repo
let corpus = ''
const rec = (d) => {
  for (const n of readdirSync(d)) {
    const p = join(d, n)
    if (statSync(p).isDirectory()) rec(p)
    else if (/\.test\.tsx?$/.test(n)) corpus += readFileSync(p, 'utf8') + '\n'
  }
}
rec(join(ROOT, 'src'))

const cubiertos = criterios.filter((c) => new RegExp('\\b' + c.id + '\\b').test(corpus))
const porItem = {}
for (const c of criterios) {
  porItem[c.item] ??= { total: 0, cubiertos: 0 }
  porItem[c.item].total++
}
for (const c of cubiertos) porItem[c.item].cubiertos++

const completos = Object.entries(porItem).filter(([, v]) => v.cubiertos === v.total && v.total > 0)
const vacios = Object.entries(porItem).filter(([, v]) => v.cubiertos === 0)

const args = process.argv.slice(2)
const min = args.includes('--min') ? parseInt(args[args.indexOf('--min') + 1], 10) : null

if (args.includes('--json')) {
  console.log(JSON.stringify({ criteriosAutomatizados: criterios.length, cubiertos: cubiertos.length, porItem }, null, 2))
} else {
  console.log(`conformance: ${cubiertos.length}/${criterios.length} criterios automatizados del canon tienen test que los cita.`)
  console.log(`  items completos: ${completos.length} · items sin un solo criterio cubierto: ${vacios.length} de ${Object.keys(porItem).length}`)
  if (args.includes('--verbose')) {
    console.log('  completos:', completos.map(([k]) => k).join(' '))
    console.log('  vacios:', vacios.map(([k]) => k).join(' '))
  }
}
if (min != null && cubiertos.length < min) {
  console.log(`\nratchet roto: la cobertura (${cubiertos.length}) cayo por debajo de ${min}.`)
  process.exit(1)
}
