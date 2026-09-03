#!/usr/bin/env node
/**
 * check-tokens-parity — el medidor del cableo del Style Dictionary (D6).
 * Compara los tokens RESUELTOS (alias var() expandidos, por modo) entre:
 *   - la verdad actual: src/tokens/*.css (+ ref/), escritos a mano
 *   - la salida del diccionario: generated/tokens/css/*.css
 *
 * Llego a cero el 2026-09-03 (arranco en 527) y desde entonces ES la reja:
 * corre en CI y bloquea cualquier edicion de un lado sin el otro. El paso
 * final del cableo — generar src/tokens desde el diccionario — es seguro
 * mientras esto se mantenga en cero.
 *
 *   node scripts/check-tokens-parity.mjs [--json] [--verbose]
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { resolve as rp, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = rp(dirname(fileURLToPath(import.meta.url)), '..')
const strip = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/@media[^{]*\{[\s\S]*?\}\s*\}/g, '') // los bloques @media (reduced-motion) no son la escala base

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
  // Dos pasadas: primero la base (bloques claros), luego los overrides dark.
  // El orden de los archivos no puede decidir quien pisa a quien.
  const base = {}, darkOv = {}
  for (const f of files) {
    if (!existsSync(f)) continue
    for (const b of bloques(readFileSync(f, 'utf8'))) {
      if (/data-density|data-product/.test(b.sel) || /@media|prefers/.test(b.sel)) continue
      Object.assign(/data-mode="dark"/.test(b.sel) ? darkOv : base, b.decls)
    }
  }
  return modo === 'dark' ? { ...base, ...darkOv } : base
}

const srcDir = join(root, 'src/tokens')
const manoFiles = [
  ...readdirSync(join(srcDir, 'ref')).filter((f) => f.endsWith('.css')).map((f) => join(srcDir, 'ref', f)),
  ...readdirSync(srcDir).filter((f) => f.endsWith('.css')).map((f) => join(srcDir, f)),
]
const genDir = join(root, 'generated/tokens/css')
// compat-eone.css emite los nombres VIEJOS de eOne a proposito: es puente de
// migracion, no parte del par de verdad diccionario↔CSS.
const genFiles = existsSync(genDir)
  ? readdirSync(genDir).filter((f) => f.endsWith('.css') && f !== 'compat-eone.css').map((f) => join(genDir, f))
  : []

const resolver = (v, map, guard = 0) => {
  if (v == null || guard > 12) return v
  const next = v.replace(/var\((--[\w-]+)[^)]*\)/g, (all, n) => map[n] ?? all)
  return next === v ? v : resolver(next, map, guard + 1)
}
const norm = (v) => String(v).trim().toLowerCase().replace(/['"]/g, '').replace(/\s+/g, ' ').replace(/,\s/g, ',').replace(/0\./g, '.') // comillas: CSS-equivalentes

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
  console.log(total === 0
    ? `\nparidad: diccionario y CSS dicen exactamente lo mismo (${informe.light.iguales} tokens por modo).`
    : `\nparidad rota: ${total} pendientes. El diccionario y src/tokens deben editarse juntos.`)
}
process.exit((informe.light.distintas.length + informe.dark.distintas.length +
  informe.light.soloMano.length + informe.dark.soloMano.length +
  informe.light.soloDiccionario.length + informe.dark.soloDiccionario.length) ? 1 : 0)
