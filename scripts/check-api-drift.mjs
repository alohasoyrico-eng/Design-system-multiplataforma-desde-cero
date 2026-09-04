#!/usr/bin/env node
// Flow · check-api-drift — el contrato canonico y la ficha dicen la misma API.
//
// La ficha (packages/flow-react/src/data/items.json) ya esta verificada contra las interfaces por
// check-catalog (C3/C4). Este chequeo cierra el triangulo: cada miembro del
// api del contrato canonico existe en la ficha, y viceversa. Una prop que nace
// en el codigo y no llega al canon es una promesa que la documentacion no
// puede hacer; una que vive solo en el canon es una promesa que el paquete no
// cumple. Cualquiera de las dos mata la adopcion.
//
// Los contratos se leen de la rama canonical (git archive), igual que el
// medidor de conformance: tras editar el canon, git fetch origin canonical.
//   node scripts/check-api-drift.mjs [--json]
import { readFileSync, mkdtempSync, rmSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { join, dirname } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

// children/style/className los exentan las fichas a proposito (C3/C4 igual).
const EXENTAS = new Set(['children', 'style', 'className'])

// Divergencias declaradas pendientes de decision del dueno del sistema.
// (4-sep-2026: las dos que hubo — input error/invalid y el modelo de
// toggle-control — se resolvieron; la lista queda vacia y ojala se quede asi.)
const EXCEPCIONES = {}

// items que viven solo en la referencia (mismo criterio que el medidor)
const SOLO_REFERENCIA = new Set(['mailings-templates'])

const tmp = mkdtempSync(join(tmpdir(), 'flow-canon-'))
let ref = null
for (const r of ['origin/canonical', 'canonical']) {
  try {
    execSync(`git archive ${r} contracts architecture.json | tar -x -C ${tmp}`, { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] })
    ref = r
    break
  } catch {}
}
// El archive puede "salir bien" sin traer nada (refs raros, clones parciales):
// la prueba de vida es el archivo, no el exit code.
import { existsSync as __ex } from 'node:fs'
if (ref && !__ex(join(tmp, 'architecture.json'))) ref = null
if (!ref) {
  console.log('api-drift: la rama canonical no esta disponible — chequeo omitido (git fetch origin canonical).')
  process.exit(0)
}

const arq = JSON.parse(readFileSync(join(tmp, 'architecture.json'), 'utf8'))
const fichas = JSON.parse(readFileSync(join(ROOT, 'packages/flow-react/src/data/items.json'), 'utf8'))

const hallazgos = []
let comparados = 0
for (const it of arq.items) {
  if (SOLO_REFERENCIA.has(it.id)) continue
  let c
  try { c = JSON.parse(readFileSync(join(tmp, it.contract), 'utf8')) } catch { continue }
  const canonMs = (c.api && c.api.members) || []
  if (!canonMs.length) continue
  const ficha = fichas[it.id]
  if (!ficha || !ficha.members) continue
  comparados++
  const exc = EXCEPCIONES[it.id]
  const permitido = (n) => EXENTAS.has(n) || (exc && exc.nombres.includes(n))
  const canon = new Set(canonMs.map((m) => m.name))
  const doc = new Set(ficha.members.map((m) => m.n))
  for (const n of canon) {
    if (!doc.has(n) && !permitido(n)) hallazgos.push({ item: it.id, lado: 'canon-sin-ficha', prop: n })
  }
  for (const n of doc) {
    if (!canon.has(n) && !permitido(n)) hallazgos.push({ item: it.id, lado: 'ficha-sin-canon', prop: n })
  }
}
rmSync(tmp, { recursive: true, force: true })

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ ok: !hallazgos.length, comparados, hallazgos, excepciones: EXCEPCIONES }, null, 2))
} else if (!hallazgos.length) {
  console.log(`api-drift: ${comparados} items con contrato y ficha dicen la misma API. ${Object.keys(EXCEPCIONES).length} divergencias declaradas pendientes de decision.`)
} else {
  for (const h of hallazgos) console.log(`  [${h.lado}] ${h.item}: ${h.prop}`)
  console.log(`\n${hallazgos.length} hallazgo(s). Contrato-primero: la prop nace en el canon, luego el codigo, luego la ficha.`)
}
process.exit(hallazgos.length ? 1 : 0)
