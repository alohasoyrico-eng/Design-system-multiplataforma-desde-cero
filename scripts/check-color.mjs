#!/usr/bin/env node
// Flow · check-color — porte del chequeo canonico (col-1): ningun color
// literal ni alcance a la capa de referencia fuera de src/tokens/.
// Superficies del repo: .tsx (estilos inline) y .module.css.
// Sin dependencias. Node 18+.
//   node scripts/check-color.mjs [--json]
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

// Excepciones declaradas. Una excepcion sin motivo escrito es un defecto sin registrar.
const EXCEPCIONES = [
  {
    archivo: 'src/ui/primitives/FlowChart.tsx',
    motivo: 'Lee los tokens del DOM en runtime para pasarlos a ECharts, que no entiende var(). ' +
      'Los literales son el ultimo recurso de cada lectura y las sombras del lienzo: si el token existe, gana.',
  },
  {
    archivo: 'src/ui/patterns/PaymentCard.tsx',
    motivo: 'Color de artefacto: una tarjeta fisica no cambia con el modo. Los valores viven en tokens --card-*.',
  },
  {
    archivo: 'src/ui/components/PaymentCard.tsx',
    motivo: 'Color de artefacto: una tarjeta fisica no cambia con el modo. Los valores viven en tokens --card-*.',
  },
  {
    archivo: 'src/ui/components/PaymentCard.module.css',
    motivo: 'La hoja del artefacto: brillo del chip y velos de la tarjeta fisica.',
  },
  {
    archivo: 'src/ui/components/MapCanvas.tsx',
    motivo: 'Canvas: el contexto 2D no entiende var(); el componente resuelve tokens del DOM y estos literales ' +
      'son fallback de esa lectura, mas el trazo de atribucion.',
  },
]

const HEX = /#[0-9a-fA-F]{3,8}\b/g
const FUNC = /\b(rgba?|hsla?)\s*\(/g
const REF = /var\(\s*(--(?:ref|flow)-[\w-]+)/g

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
for (const abs of [...fuentes('src/ui', ['.tsx', '.module.css'])]) {
  const rel = relative(ROOT, abs).split('\\').join('/')
  if (EXCEPCIONES.some((e) => e.archivo === rel)) continue
  const src = readFileSync(abs, 'utf8')
  src.split('\n').forEach((linea, i) => {
    const code = linea.replace(/\/\/.*$/, '').replace(/\/\*.*?\*\//g, '')
    const pos = (m, tipo) => hallazgos.push({ regla: 'col-1', tipo, archivo: rel, linea: i + 1, valor: m })
    for (const m of code.matchAll(HEX)) pos(m[0], 'hex')
    for (const m of code.matchAll(FUNC)) pos(m[1] + '()', 'func')
    for (const m of code.matchAll(REF)) pos(m[1], 'ref')
  })
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ ok: !hallazgos.length, total: hallazgos.length, hallazgos, excepciones: EXCEPCIONES }, null, 2))
} else if (!hallazgos.length) {
  console.log('color: ningun literal fuera de src/tokens/. ' + EXCEPCIONES.length + ' excepciones declaradas.')
} else {
  const porTipo = {}
  for (const h of hallazgos) (porTipo[h.tipo] ||= []).push(h)
  for (const [tipo, hs] of Object.entries(porTipo)) {
    console.log('\n' + tipo + ' — ' + hs.length)
    for (const h of hs.slice(0, 40)) console.log('  ' + h.archivo + ':' + h.linea + '  ' + h.valor)
  }
  console.log('\n' + hallazgos.length + ' hallazgo(s).')
}
process.exit(hallazgos.length ? 1 : 0)
