#!/usr/bin/env node
// Flow · check-a11y — porte de los criterios estaticos de a11y y motion
// (los de DOM montado — a11y-4, a11y-5 — viven en los tests de conformance).
//   a11y-1  El anillo de foco es global (tokens/a11y.css) y la carcasa lo pinta
//           por el control completo; ningun modulo apaga el indicador sin
//           sustituirlo en el mismo bloque.
//   a11y-6  El orden de tabulacion sigue el orden visual: ningun tabindex positivo.
//   mot-3   El estado final no depende de un frame de animacion: cada @keyframes
//           termina en identidad (el ultimo frame no deja opacidad ni transform).
//   mot-5   Ningun archivo fuera de tokens/ declara @keyframes propios ni una
//           curva literal.
// Sin dependencias. Node 18+.
//   node scripts/check-a11y.mjs [--json]
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

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

// ── a11y-1: la regla global existe y la carcasa pinta el anillo ──
const a11yCss = readFileSync(join(ROOT, 'src/tokens/a11y.css'), 'utf8')
if (!/:focus-visible[\s\S]*?box-shadow:\s*var\(--focus-ring\)/.test(a11yCss)) {
  hallazgos.push({ regla: 'a11y-1', archivo: 'src/tokens/a11y.css', detalle: 'falta la regla global de foco con --focus-ring' })
}
const shellCss = readFileSync(join(ROOT, 'src/ui/primitives/ControlShell.module.css'), 'utf8')
if (!/:focus-within[\s\S]*?box-shadow:\s*var\(--focus-ring\)/.test(shellCss)) {
  hallazgos.push({ regla: 'a11y-1', archivo: 'src/ui/primitives/ControlShell.module.css', detalle: 'a11y.css suprime el anillo del campo interior contando con que la carcasa lo pinte' })
}
// Ningun bloque de foco apaga el indicador sin sustituirlo en el mismo bloque.
for (const abs of fuentes('src/ui', ['.module.css'])) {
  const css = readFileSync(abs, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (!/:focus/.test(m[1])) continue
    if (/box-shadow:\s*none/.test(m[2]) && !/outline:\s*[^n]/.test(m[2])) {
      const linea = css.slice(0, m.index).split('\n').length
      hallazgos.push({ regla: 'a11y-1', archivo: rel(abs), linea, detalle: 'apaga el anillo en foco sin sustituir el indicador' })
    }
  }
}

// ── a11y-6: ningun tabindex positivo ──
for (const abs of fuentes('src/ui', ['.tsx'])) {
  readFileSync(abs, 'utf8').split('\n').forEach((linea, i) => {
    if (/tabIndex=\{?\s*[1-9]/.test(linea) || /tabindex="[1-9]/.test(linea)) {
      hallazgos.push({ regla: 'a11y-6', archivo: rel(abs), linea: i + 1, detalle: 'tabindex positivo rompe el orden visual' })
    }
  })
}

// ── spc-3: hermanos separados con gap, no con margenes por elemento ──
// Se caza el antipatron concreto: un selector de hermanos (:not(:first/last-child)
// o combinador +/~) cuyo bloque declara margin. Un borde entre filas es legitimo.
for (const abs of fuentes('src/ui', ['.module.css'])) {
  const css = readFileSync(abs, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const esHermanos = /:not\(:(first|last)-child\)|[+~]\s*[.\w[]/.test(m[1])
    if (!esHermanos || !/(^|;|\s)margin(-\w+)?:/.test(m[2])) continue
    const linea = css.slice(0, m.index).split('\n').length
    hallazgos.push({ regla: 'spc-3', archivo: rel(abs), linea, detalle: 'hermanos separados con margen: usa gap del contenedor' })
  }
}

// ── shp-2: ningun archivo fuera de tokens/ escribe un border-radius literal ──
// (0 y 50% no son pasos de la escala: cuadrado y circulo son geometria, no forma.)
for (const abs of fuentes('src/ui', ['.module.css'])) {
  const css = readFileSync(abs, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
  css.split('\n').forEach((linea, i) => {
    const m = linea.match(/border-radius:\s*([^;]+);/)
    if (!m) return
    const v = m[1].trim()
    // valido: cualquier combinacion de tokens --radius-*, 0, 50% (circulo) e inherit
    const piezas = v.split(/\s+/)
    if (piezas.every((p) => /^var\(--radius-[\w-]+\)$/.test(p) || /^(0|50%|inherit)$/.test(p))) return
    hallazgos.push({ regla: 'shp-2', archivo: rel(abs), linea: i + 1, detalle: `border-radius literal: ${v} — usa --radius-*` })
  })
}

// ── mot-5: @keyframes y curvas literales solo en tokens/ ──
for (const abs of [...fuentes('src/ui', ['.module.css', '.tsx'])]) {
  const src = readFileSync(abs, 'utf8')
  src.split('\n').forEach((linea, i) => {
    if (/@keyframes/.test(linea)) hallazgos.push({ regla: 'mot-5', archivo: rel(abs), linea: i + 1, detalle: '@keyframes fuera de tokens/' })
    if (/cubic-bezier\(/.test(linea)) hallazgos.push({ regla: 'mot-5', archivo: rel(abs), linea: i + 1, detalle: 'curva literal: usa --ease-*' })
  })
}

// ── mot-3: cada @keyframes de tokens termina en identidad ──
// Excepcion: loops indicadores infinitos, donde el movimiento ES el contenido
// (como el spinner). No tienen estado final; reduced-motion los apaga aparte.
const LOOPS_INDICADORES = ['flowDotPulse', 'flowBlink', 'flowShimmer', 'flowSpin', 'flowPulse']
for (const abs of fuentes('src/tokens', ['.css'])) {
  const css = readFileSync(abs, 'utf8')
  for (const m of css.matchAll(/@keyframes\s+([\w-]+)\s*\{([\s\S]*?)\}\s*\}/g)) {
    if (LOOPS_INDICADORES.includes(m[1])) continue
    const frames = [...m[2].matchAll(/(from|to|[\d.]+%(?:\s*,\s*[\d.]+%)*)\s*\{([^}]*)\}/g)]
    const final = frames.find((f) => /\bto\b|100%/.test(f[1]))
    if (!final) continue
    const cuerpo = final[2]
    const opacidad = cuerpo.match(/opacity:\s*([\d.]+)/)
    const transf = cuerpo.match(/transform:\s*([^;]+)/)
    const transformaFinal = transf && !/none|scale\(1\)|translate\w*\(0(px|%)?(,\s*0(px|%)?)?\)/.test(transf[1].trim())
    if ((opacidad && parseFloat(opacidad[1]) < 1) || transformaFinal) {
      const linea = css.slice(0, m.index).split('\n').length
      hallazgos.push({ regla: 'mot-3', archivo: rel(abs), linea, detalle: `@keyframes ${m[1]} no termina en identidad: el estado final dependeria del frame` })
    }
  }
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ ok: !hallazgos.length, total: hallazgos.length, hallazgos }, null, 2))
} else if (!hallazgos.length) {
  console.log('a11y/motion estaticos: anillo global y de carcasa presentes, sin tabindex positivo, keyframes solo en tokens y terminando en identidad.')
} else {
  for (const h of hallazgos) console.log(`  [${h.regla}] ${h.archivo}${h.linea ? ':' + h.linea : ''}  ${h.detalle}`)
  console.log('\n' + hallazgos.length + ' hallazgo(s).')
}
process.exit(hallazgos.length ? 1 : 0)
