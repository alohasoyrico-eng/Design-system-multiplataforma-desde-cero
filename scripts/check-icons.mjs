#!/usr/bin/env node
// Flow · check-icons — porte del contrato canonico de iconos (foundations).
//   ico-1  Material Symbols Rounded es la unica fuente: ningun emoji en la UI,
//          ningun set de iconos ajeno importado.
//   ico-2  Ningun icono se dibuja como SVG a mano salvo las excepciones
//          declaradas (dato o marca, no iconografia).
//   ico-3  Un span .flow-symbol es una ligadura decorativa: lleva aria-hidden
//          (o aria-label si excepcionalmente informa) en su propio tag, o vive
//          dentro de un contenedor aria-hidden inmediato.
//   ico-5  Los tamanos de icono salen de la escala --icon-*; los pasos extra
//          del repo respecto al canon quedan declarados abajo.
// Sin dependencias. Node 18+.
//   node scripts/check-icons.mjs [--json]
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

// Excepciones declaradas. Una excepcion sin motivo escrito es un defecto sin registrar.
const SVG_PERMITIDOS = [
  { archivo: 'src/ui/primitives/Sparkline.tsx', motivo: 'Dato, no icono: la linea es la visualizacion misma (excepcion del propio canon).' },
  { archivo: 'src/ui/primitives/CircularProgress.tsx', motivo: 'El anillo es la barra de progreso dibujada, no un glifo.' },
  { archivo: 'src/ui/primitives/FlowLogo.tsx', motivo: 'Marca, no icono: el logo no sale de una fuente de iconos.' },
  { archivo: 'src/ui/components/SmallMultiples.tsx', motivo: 'Visualizacion de dato en miniatura, misma especie que Sparkline.' },
]

// ico-5: el canon fija los pasos 16, 20 y 24; el repo ademas usa 14 (xs),
// 18 (md) y 28 (xl). Divergencia declarada pendiente de decision: se exige que
// todo tamano salga de la escala --icon-*, no que la escala se recorte hoy.
const PASOS_CANON = [16, 20, 24]
const PASOS_EXTRA_DECLARADOS = [14, 18, 28]

const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/u
const SETS_AJENOS = /from ['"](react-icons|lucide-react|@heroicons|@mui\/icons-material|@fortawesome)/

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

for (const abs of fuentes('src/ui', ['.tsx'])) {
  const r = rel(abs)
  const src = readFileSync(abs, 'utf8')

  // ico-1: emoji y sets ajenos
  src.split('\n').forEach((linea, i) => {
    if (EMOJI.test(linea)) hallazgos.push({ regla: 'ico-1', archivo: r, linea: i + 1, detalle: 'emoji en la fuente' })
    if (SETS_AJENOS.test(linea)) hallazgos.push({ regla: 'ico-1', archivo: r, linea: i + 1, detalle: 'set de iconos ajeno' })
  })

  // ico-2: <svg> a mano fuera de las excepciones
  if (/<svg[\s>]/.test(src) && !SVG_PERMITIDOS.some((e) => e.archivo === r)) {
    hallazgos.push({ regla: 'ico-2', archivo: r, detalle: 'dibuja SVG a mano sin excepcion declarada' })
  }

  // ico-3: cada span .flow-symbol oculto o etiquetado (tag completo, multilinea),
  // o dentro de un contenedor aria-hidden en las lineas inmediatas.
  for (const m of src.matchAll(/<span[^>]*?flow-symbol[\s\S]*?>/g)) {
    const tag = m[0]
    if (/aria-hidden|aria-label/.test(tag)) continue
    const antes = src.slice(Math.max(0, m.index - 400), m.index)
    if (/aria-hidden="true"[\s\S]{0,300}$/.test(antes)) continue
    const linea = src.slice(0, m.index).split('\n').length
    hallazgos.push({ regla: 'ico-3', archivo: r, linea, detalle: 'ligadura sin aria-hidden ni contenedor oculto' })
  }
}

// ico-5: la escala --icon-* del repo resuelve a los pasos del canon mas los declarados
const icono = readFileSync(join(ROOT, 'src/tokens/iconography.css'), 'utf8')
const refs = readFileSync(join(ROOT, 'src/tokens/ref/sizing.css'), 'utf8')
const resolver = (v) => {
  const m = refs.match(new RegExp(`${v}:\\s*(\\d+)px`))
  return m ? parseInt(m[1], 10) : null
}
const pasosValidos = new Set([...PASOS_CANON, ...PASOS_EXTRA_DECLARADOS])
for (const m of icono.matchAll(/--icon-[\w-]+:\s*var\((--ref-icon-\d+)\)/g)) {
  const px = resolver(m[1])
  if (px != null && !pasosValidos.has(px)) {
    hallazgos.push({ regla: 'ico-5', archivo: 'src/tokens/iconography.css', detalle: `paso ${px}px fuera de la escala` })
  }
}
for (const m of icono.matchAll(/--icon-[\w-]+:\s*(\d+)px/g)) {
  hallazgos.push({ regla: 'ico-5', archivo: 'src/tokens/iconography.css', detalle: `literal ${m[1]}px: la escala se define en ref` })
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ ok: !hallazgos.length, total: hallazgos.length, hallazgos, svgPermitidos: SVG_PERMITIDOS, pasosExtra: PASOS_EXTRA_DECLARADOS }, null, 2))
} else if (!hallazgos.length) {
  console.log('iconos: una sola fuente, SVG solo en ' + SVG_PERMITIDOS.length + ' excepciones de dato/marca, ligaduras ocultas, escala respetada.')
  console.log('  pasos extra declarados sobre el canon (16/20/24): ' + PASOS_EXTRA_DECLARADOS.join(', ') + 'px — pendiente de decision.')
} else {
  for (const h of hallazgos) console.log(`  [${h.regla}] ${h.archivo}${h.linea ? ':' + h.linea : ''}  ${h.detalle}`)
  console.log('\n' + hallazgos.length + ' hallazgo(s).')
}
process.exit(hallazgos.length ? 1 : 0)
