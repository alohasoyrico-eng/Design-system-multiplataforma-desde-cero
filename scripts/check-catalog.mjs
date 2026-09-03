#!/usr/bin/env node
/**
 * check-catalog — el catálogo (src/data/items.json) es la interfaz de
 * descubrimiento del sistema, y deriva del código porque nada lo vigilaba:
 * Wizard exportado sin ficha, la ficha de Table prometiendo props que la
 * interfaz no tiene, 42 props reales sin documentar, fichas recomendando
 * componentes absorbidos. Este chequeo es la versión portada de P5/P9/P10
 * y R2 de la referencia canónica. Sin dependencias. Node 18+.
 *
 *   node scripts/check-catalog.mjs [--json]
 *
 * Reglas:
 *   C1  todo export de los barrels tiene ficha con src propio (o excepción declarada)
 *   C2  todo src declarado en una ficha existe en disco
 *   C3  toda prop documentada existe en la interfaz <Name>Props real
 *   C4  toda prop real está documentada (children/style/className exentas)
 *   C5  ninguna ficha recomienda un componente absorbido
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const items = JSON.parse(readFileSync(resolve(root, 'src/data/items.json'), 'utf8'))
const asJson = process.argv.includes('--json')
const hallazgos = []
const F = (regla, donde, msg) => hallazgos.push({ regla, donde, msg })

// Excepciones declaradas: una excepción sin motivo escrito es un defecto sin registrar.
const SIN_FICHA_OK = {
  DateRangePicker: 'alias deprecado de DatePicker mode="range"; declarado en la ficha datepicker',
  SidebarProvider: 'infraestructura del shell; documentado en la ficha sidebar',
}

// Nombres absorbidos. Fuente: contracts/ de la referencia canónica (supersedes).
const ABSORBIDOS = [
  'SelectMultiple', 'SelectCountry', 'SelectCombo', 'SelectWithInput', 'Combobox',
  'TableDense', 'TableExpandable', 'TableTimeline',
  'LineChart', 'StackedBars100', 'WaterfallChart', 'PolarChart',
  'InputPassword', 'InputEmail', 'InputDate',
]

const srcsDe = (v) => {
  const s = v.src
  if (!s) return []
  return (Array.isArray(s) ? s : [s]).filter((x) => /\.(tsx|ts)$/.test(x))
}
const rutaDe = (s) => ['src/ui/' + s, 'src/' + s].map((c) => resolve(root, c)).find((c) => existsSync(c))

// ---------- C1: barrel ↔ ficha ----------
const conSrc = new Set()
for (const v of Object.values(items)) for (const s of srcsDe(v)) conSrc.add(s.split('/').pop().replace(/\.(tsx|ts)$/, ''))
for (const barrel of ['src/ui/primitives/index.ts', 'src/ui/components/index.ts', 'src/ui/patterns/index.ts']) {
  const code = readFileSync(resolve(root, barrel), 'utf8')
  for (const m of code.matchAll(/export \{ (\w+)/g)) {
    const nombre = m[1]
    if (nombre.startsWith('use') || conSrc.has(nombre) || SIN_FICHA_OK[nombre]) continue
    F('C1', barrel, `"${nombre}" está exportado y ninguna ficha lo tiene como src: invisible en la docs`)
  }
}

// ---------- C2: src fantasma ----------
for (const [id, v] of Object.entries(items)) {
  for (const s of srcsDe(v)) if (!rutaDe(s)) F('C2', 'ficha:' + id, `src "${s}" no existe en disco`)
}

// ---------- C3 y C4: members ↔ interfaz ----------
function propsDe(path, nombre) {
  const code = readFileSync(path, 'utf8')
  const m = code.match(new RegExp('interface ' + nombre + 'Props[^{]*\\{([\\s\\S]*?)\\n\\}'))
  if (!m) return null
  const props = new Set()
  let buf = ''
  let depth = 0
  for (const linea of m[1].split('\n')) {
    const s = linea.trim()
    if (!s || s.startsWith('//') || s.startsWith('/*') || s.startsWith('*')) continue
    buf = buf ? buf + ' ' + s : s
    depth += (s.match(/[({<]/g) || []).length - (s.match(/[)}>]/g) || []).length
    if (depth <= 0 && buf) {
      const mm = buf.match(/^(\w+)\??:/)
      if (mm) props.add(mm[1])
      buf = ''
      depth = 0
    }
  }
  return props.size ? props : null
}
const EXENTAS = new Set(['children', 'style', 'className'])
for (const [id, v] of Object.entries(items)) {
  const ss = srcsDe(v)
  if (ss.length !== 1 || !(v.members || []).length) continue
  const path = rutaDe(ss[0])
  if (!path) continue
  const real = propsDe(path, String(v.name).replace(/ /g, ''))
  if (!real) continue
  const doc = new Set(v.members.map((x) => x.n))
  for (const n of doc) if (!real.has(n) && !EXENTAS.has(n)) F('C3', 'ficha:' + id, `documenta la prop "${n}" y la interfaz no la tiene`)
  for (const n of real) if (!doc.has(n) && !EXENTAS.has(n)) F('C4', 'ficha:' + id, `la prop "${n}" existe en la interfaz y no está documentada`)
}

// ---------- C5: absorbidos recomendados ----------
// Una mención que documenta la absorción ("Absorbe X", "Absorbió X") es historia
// legítima; cualquier otra es una recomendación de algo que no existe.
for (const [id, v] of Object.entries(items)) {
  const textos = JSON.stringify(v)
  for (const muerto of ABSORBIDOS) {
    const re = new RegExp('(^|[^A-Za-z])' + muerto + '($|[^A-Za-z])')
    for (const trozo of textos.split('","')) {
      if (!re.test(trozo)) continue
      if (/absorb/i.test(trozo)) continue
      F('C5', 'ficha:' + id, `recomienda "${muerto}", que fue absorbido`)
      break
    }
  }
}

if (asJson) {
  console.log(JSON.stringify({ ok: !hallazgos.length, total: hallazgos.length, hallazgos }, null, 2))
} else if (!hallazgos.length) {
  console.log(`catálogo: ${Object.keys(items).length} fichas, coherente con barrels e interfaces.`)
} else {
  for (const h of hallazgos) console.log(`  ✗ [${h.regla}] ${h.donde} — ${h.msg}`)
  console.log(`\n${hallazgos.length} hallazgo(s).`)
}
process.exit(hallazgos.length ? 1 : 0)
