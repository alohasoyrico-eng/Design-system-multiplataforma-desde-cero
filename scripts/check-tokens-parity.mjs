#!/usr/bin/env node
/**
 * check-tokens-parity — el medidor del cableo del Style Dictionary (D6).
 * Compara los tokens RESUELTOS (alias var() expandidos, por modo) entre:
 *   - la verdad actual: src/tokens/*.css (+ ref/), escritos a mano
 *   - la salida del diccionario: generated/tokens/css/*.css
 *
 * Hoy NO corre en CI: la deriva es deuda conocida y este script existe para
 * medirla y verla bajar a cero durante el cableo. Cuando llegue a cero, se
 * promueve a CI y el diccionario pasa a ser la única fuente.
 *
 *   node scripts/check-tokens-parity.mjs [--json] [--verbose]
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { resolve as rp, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = rp(dirname(fileURLToPath(import.meta.url)), '..')
const strip = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '')

// Declaraciones por bloque selector de primer nivel.
function bloques(css) {
  const out = []
  const src = strip(css)
  const re = /([^{}]+)\{([^{}]*)\}/g
  let m
  while ((m = re.exec(src))) {
    const sel = m[1].trim()
    const decls = {}
    for (const d of m[2].split(';')) {
      const mm = d.match(/(--[\w-]+)\s*:\s*(.+)/)
      if (mm) decls[mm[1]] = mm[2].trim()
    }
    if (Object.keys(decls).length) out.push({ sel, decls })
  }
  return out
}

function leerModo(files, modo) {
  const map = {}
  for (const f of files) {
    if (!existsSync(f)) continue
    for (const b of bloques(readFileSync(f, 'utf8'))) {
      const esDark = /data-mode="dark"/.test(b.sel)
      const esDensidad = /data-density/.test(b.sel)
      const esMedia = /@media|prefers/.test(b.sel)
      if (esDensidad || esMedia) continue
      if (modo === 'dark' ? true : !esDark) Object.assign(map, esDark && modo === 'light' ? {} : b.decls)
    }
  }
  return map
}

const srcDir = join(root, 'src/tokens')
const manoFiles = [
  ...readdirSync(join(srcDir, 'ref')).filter((f) => f.endsWith('.css')).map((f) => join(srcDir, 'ref', f)),
  ...readdirSync(srcDir).filter((f) => f.endsWith('.css')).map((f) => join(srcDir, f)),
]
const genDir = join(root, 'generated/tokens/css')
const genFiles = existsSync(genDir) ? readdirSync(genDir).filter((f) => f.endsWith('.css')).map((f) => join(genDir, f)) : []

const resolver = (v, map, guard = 0) => {
  if (v == null || guard > 12) return v
  const next = v.replace(/var\((--[\w-]+)[^)]*\)/g, (all, n) => map[n] ?? all)
  return next === v ? v : resolver(next, map, guard + 1)
}
const norm = (v) => String(v).trim().toLowerCase().replace(/\s+/g, ' ').replace(/,\s/g, ',').replace(/0\./g, '.')

const informe = {}
for (const modo of ['light', 'dark']) {
  const mano = leerModo(manoFiles, modo)
  const gen = leerModo(genFiles, modo)
  const mk = new Set(Object.keys(mano).filter((k) => !k.startsWith('--type-'))) // shorthands tipográficos: formato propio, se comparan aparte
  const gk = new Set(Object.keys(gen).filter((k) => !k.startsWith('--type-')))
  const distintas = []
  let iguales = 0
  for (const k of [...mk].filter((k) => gk.has(k))) {
    if (norm(resolver(mano[k], mano)) === norm(resolver(gen[k], gen))) iguales++
    else distintas.push({ k, mano: resolver(mano[k], mano), dicc: resolver(gen[k], gen) })
  }
  informe[modo] = {
    mano: mk.size, diccionario: gk.size,
    soloMano: [...mk].filter((k) => !gk.has(k)).sort(),
    soloDiccionario: [...gk].filter((k) => !mk.has(k)).sort(),
    iguales, distintas,
  }
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(informe, null, 2))
} else {
  for (const [modo, r] of Object.entries(informe)) {
    console.log(`\n══ ${modo}: ${r.mano} a mano · ${r.diccionario} en diccionario`)
    console.log(`   resueltas iguales: ${r.iguales} · distintas: ${r.distintas.length} · solo a mano: ${r.soloMano.length} · solo diccionario: ${r.soloDiccionario.length}`)
    if (process.argv.includes('--verbose')) {
      for (const d of r.distintas.slice(0, 40)) console.log(`   ≠ ${d.k}  mano=${d.mano}  dicc=${d.dicc}`)
      console.log('   solo a mano:', r.soloMano.slice(0, 40).join(' '))
      console.log('   solo diccionario:', r.soloDiccionario.slice(0, 40).join(' '))
    }
  }
  const total = informe.light.distintas.length + informe.dark.distintas.length +
    informe.light.soloMano.length + informe.dark.soloMano.length
  console.log(`\nparidad pendiente (distintas + solo-a-mano): ${total}. El cableo termina cuando esto llega a 0.`)
}
