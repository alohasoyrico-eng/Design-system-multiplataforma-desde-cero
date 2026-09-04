#!/usr/bin/env node
// Flow · check-targets — porte del chequeo canonico: ningun objetivo operable
// declara un alto o ancho literal por debajo de --hit-target-min (44px).
// El repo separa estilos en CSS Modules, asi que se escanean dos superficies:
//   - .tsx: estilos inline y tablas de tamanos, con contexto operable
//   - .module.css: bloques que declaran cursor:pointer (algo que se toca)
// Sin dependencias. Node 18+.
//   node scripts/check-targets.mjs [--json]
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const MINIMO = 44

// Excepciones declaradas: una excepcion sin motivo escrito es un defecto sin registrar.
const EXCEPCIONES = [
  { archivo: 'src/ui/components/OTPInput.module.css', motivo: 'Las casillas son pintura aria-hidden; el objetivo real es el input oculto que las cubre.' },
  { archivo: 'src/ui/primitives/Switch.module.css', motivo: 'La pista visual mide 28x*; el objetivo es el ToggleControl de 44 que la envuelve.' },
  { archivo: 'src/ui/primitives/Checkbox.module.css', motivo: 'La caja visual es chica; el target lo pone ToggleControl con la etiqueta clickeable.' },
  { archivo: 'src/ui/primitives/Radio.module.css', motivo: 'Mismo caso que Checkbox: el circulo es pintura, el target es ToggleControl.' },
]

const OPERABLE = /<button|<input|role="?(button|tab|menuitem|option|switch|slider)"?|onClick|type: '(button|submit)'/
const TABLA = /\b(sm|md|lg)\s*:\s*\{?[^}\n]*?\b(d|h|height|size)\s*:\s*(\d+(?:\.\d+)?)/g

function fuentes(dir, exts) {
  const out = []
  const rec = (d) => {
    for (const n of readdirSync(d)) {
      const p = join(d, n)
      if (statSync(p).isDirectory()) { if (!/__tests__/.test(n)) rec(p) }
      else if (exts.some((e) => n.endsWith(e))) out.push(p)
    }
  }
  try { rec(join(ROOT, dir)) } catch {}
  return out
}

const hallazgos = []
const rel = (p) => relative(ROOT, p).split('\\').join('/')

// it-6 (internal-tools-t): el template tambien se mide — sus controles no
// pueden esconder medidas chicas en el layout ni en las paginas.
const RAICES = ['src/ui', 'src/layout', 'src/pages/internal-tools']

// ── .tsx: inline + tablas, como el canon ──
for (const abs of RAICES.flatMap((r) => fuentes(r, ['.tsx']))) {
  const r = rel(abs)
  if (EXCEPCIONES.some((e) => e.archivo === r)) continue
  const lineas = readFileSync(abs, 'utf8').split('\n')
  lineas.forEach((linea, i) => {
    const code = linea.replace(/\/\/.*$/, '')
    for (const m of code.matchAll(TABLA)) {
      const v = parseFloat(m[3])
      if (v >= 20 && v < MINIMO) hallazgos.push({ archivo: r, linea: i + 1, prop: 'tabla ' + m[1] + '.' + m[2], valor: v })
    }
    if (/<img|<svg/.test(code)) return
    const ctx = lineas.slice(Math.max(0, i - 6), i + 3).join(' ')
    if (!OPERABLE.test(ctx)) return
    const dims = [...code.matchAll(/\b(minHeight|height|minWidth|width)\s*:\s*(\d+(?:\.\d+)?)\b/g)]
    const esAdorno = dims.some((x) => parseFloat(x[2]) < 20)
    for (const m of dims) {
      const v = parseFloat(m[2])
      if (v >= 20 && v < MINIMO && !esAdorno) hallazgos.push({ archivo: r, linea: i + 1, prop: m[1], valor: v })
    }
  })
}

// ── .module.css: bloques que se tocan (cursor: pointer) ──
for (const abs of RAICES.flatMap((r) => fuentes(r, ['.module.css']))) {
  const r = rel(abs)
  if (EXCEPCIONES.some((e) => e.archivo === r)) continue
  const css = readFileSync(abs, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const cuerpo = m[2]
    if (!/cursor:\s*pointer/.test(cuerpo)) continue
    const dims = [...cuerpo.matchAll(/(?:^|;|\s)(min-height|height|min-width|width)\s*:\s*(\d+(?:\.\d+)?)px/g)]
    const esAdorno = dims.some((x) => parseFloat(x[2]) < 20)
    if (esAdorno) continue
    for (const d of dims) {
      const v = parseFloat(d[2])
      if (v >= 20 && v < MINIMO) {
        const linea = css.slice(0, m.index).split('\n').length
        hallazgos.push({ archivo: r, linea, prop: d[1] + ' (' + m[1].trim().split('\n').pop().trim() + ')', valor: v })
      }
    }
  }
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ ok: !hallazgos.length, total: hallazgos.length, minimo: MINIMO, hallazgos, excepciones: EXCEPCIONES }, null, 2))
} else if (!hallazgos.length) {
  console.log('objetivos: ninguna medida literal por debajo de ' + MINIMO + 'px. ' + EXCEPCIONES.length + ' excepciones declaradas.')
} else {
  console.log('a11y-2 — ' + hallazgos.length + ' objetivo(s) por debajo de ' + MINIMO + 'px:')
  for (const h of hallazgos) console.log('  ' + h.archivo + ':' + h.linea + '  ' + h.prop + ': ' + h.valor)
  console.log('\nUsa var(--hit-target-min). El glifo puede seguir siendo pequeno; el area no.')
}
process.exit(hallazgos.length ? 1 : 0)
