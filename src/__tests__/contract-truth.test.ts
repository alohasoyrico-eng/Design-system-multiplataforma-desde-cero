/**
 * Verdad contractual: items.json no puede prometer lo que el código no cumple.
 * La clase de bug que atrapó al variant `accent` — el contrato declaraba una
 * variante eliminada y README, docs y Flutter la repetían.
 *
 * Cuatro invariantes por pieza con código:
 *   1. src apunta a un archivo real
 *   2. toda variante declarada existe en el código
 *   3. todo member (prop/event) existe en la interface <Name>Props
 *   4. todo token referenciado existe en src/tokens
 */
import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import items from '../data/items.json'

const ROOT = join(__dirname, '..')

/**
 * Props fantasma heredadas, pendientes de decisión del equipo de diseño
 * (¿se borra del contrato o se implementa?). Congeladas: quitar una entrada
 * de aquí exige arreglar contrato o código — agregar nuevas está prohibido.
 */
/* Vacía desde 2026-09-01 (lotes A1-A4 completados). Si un contrato vuelve a
   prometer una prop inexistente, el fix es implementar o corregir el contrato —
   nunca agregar entradas aquí sin decisión del equipo de diseño. */
const PENDING_PHANTOM_PROPS = new Set<string>([])

interface Contract {
  name: string
  layer: string
  src?: string | string[]
  variants?: { v: string }[]
  members?: { n: string; k: string }[]
  tokens?: string[]
}

const contracts = Object.values(items) as Contract[]

function codePathFor(name: string): string | null {
  for (const layer of ['primitives', 'components', 'patterns']) {
    const p = join(ROOT, 'ui', layer, `${name}.tsx`)
    if (existsSync(p)) return p
  }
  return null
}

function codeVariants(name: string, codePath: string): Set<string> {
  const tsx = readFileSync(codePath, 'utf8')
  const cssPath = codePath.replace('.tsx', '.module.css')
  const css = existsSync(cssPath) ? readFileSync(cssPath, 'utf8') : ''
  const out = new Set<string>()
  for (const m of css.matchAll(/data-variant=['"]([\w-]+)['"]/g)) out.add(m[1]!)
  for (const m of tsx.matchAll(/Variant = ((?:'[\w-]+'(?:\s*\|\s*)?)+)/g))
    for (const x of m[1]!.matchAll(/'([\w-]+)'/g)) out.add(x[1]!)
  for (const m of tsx.matchAll(/variant\??:\s*((?:'[\w-]+'(?:\s*\|\s*)?)+)/g))
    for (const x of m[1]!.matchAll(/'([\w-]+)'/g)) out.add(x[1]!)
  return out
}

function realProps(name: string, codePath: string): Set<string> | null {
  const tsx = readFileSync(codePath, 'utf8')
  const im = tsx.match(new RegExp(`export interface ${name}Props(?:<[^>]+>)? \\{([\\s\\S]*?)\\n\\}`))
  if (!im) return null
  return new Set([...im[1]!.matchAll(/^\s{2}'?([\w-]+)'?\??:/gm)].map(m => m[1]!))
}

const definedTokens = (() => {
  let css = ''
  for (const dir of ['tokens', 'tokens/ref']) {
    for (const f of readdirSync(join(ROOT, dir))) {
      if (f.endsWith('.css')) css += readFileSync(join(ROOT, dir, f), 'utf8')
    }
  }
  return new Set([...css.matchAll(/(--[\w-]+)\s*:/g)].map(m => m[1]!))
})()

describe('Contract truth — items.json vs código', () => {
  it('todo src declarado apunta a un archivo real', () => {
    const dead: string[] = []
    for (const c of contracts) {
      const srcs = Array.isArray(c.src) ? c.src : c.src ? [c.src] : []
      for (const s of srcs) {
        if (!s) continue
        const candidates = [join(ROOT, 'ui', s), join(ROOT, s)]
        if (!candidates.some(existsSync)) dead.push(`${c.name}: ${s}`)
      }
    }
    expect(dead, `src muertos en contratos:\n${dead.join('\n')}`).toHaveLength(0)
  })

  it('toda variante declarada existe en el código', () => {
    const phantom: string[] = []
    for (const c of contracts) {
      const codePath = codePathFor(c.name)
      if (!codePath || !c.variants?.length) continue
      const inCode = codeVariants(c.name, codePath)
      if (inCode.size === 0) continue
      for (const v of c.variants) {
        if (!inCode.has(v.v)) phantom.push(`${c.name}: "${v.v}" (código: ${[...inCode].join(', ')})`)
      }
    }
    expect(phantom, `Variantes fantasma:\n${phantom.join('\n')}`).toHaveLength(0)
  })

  it('todo member declarado existe en la interface Props (salvo pendientes congelados)', () => {
    const phantom: string[] = []
    for (const c of contracts) {
      const codePath = codePathFor(c.name)
      if (!codePath || !c.members?.length) continue
      const props = realProps(c.name, codePath)
      if (!props) continue
      for (const m of c.members) {
        if (m.k !== 'prop' && m.k !== 'event') continue
        const key = `${c.name}.${m.n}`
        if (!props.has(m.n) && !PENDING_PHANTOM_PROPS.has(key)) phantom.push(key)
      }
    }
    expect(phantom, `Props fantasma NUEVAS (no en la lista de pendientes):\n${phantom.join('\n')}`).toHaveLength(0)
  })

  it('la lista de pendientes no acumula entradas ya resueltas', () => {
    const stillPhantom = new Set<string>()
    for (const c of contracts) {
      const codePath = codePathFor(c.name)
      if (!codePath || !c.members?.length) continue
      const props = realProps(c.name, codePath)
      if (!props) continue
      for (const m of c.members) {
        if ((m.k === 'prop' || m.k === 'event') && !props.has(m.n)) stillPhantom.add(`${c.name}.${m.n}`)
      }
    }
    const resolved = [...PENDING_PHANTOM_PROPS].filter(p => !stillPhantom.has(p))
    expect(resolved, `Ya resueltas — quítalas de PENDING_PHANTOM_PROPS:\n${resolved.join('\n')}`).toHaveLength(0)
  })

  it('el vocabulario de plataforma es la escala oficial', () => {
    const SCALE = new Set(['stable', 'beta', 'planned', 'spec', 'n/a', 'deprecated', ''])
    const bad: string[] = []
    for (const c of contracts) {
      for (const [plat, status] of Object.entries((c as { platforms?: Record<string, string> }).platforms ?? {})) {
        if (!SCALE.has(status)) bad.push(`${c.name}.${plat}: "${status}"`)
      }
    }
    expect(bad, `Estatus fuera de la escala stable|beta|planned|spec|n/a|deprecated:\n${bad.join('\n')}`).toHaveLength(0)
  })

  it('stable/beta exige código en esa plataforma — spec es para recetas', () => {
    const flutterClasses = new Set<string>()
    const flutterDir = join(ROOT, '..', 'flutter', 'lib', 'src')
    for (const f of readdirSync(flutterDir)) {
      const s = readFileSync(join(flutterDir, f), 'utf8')
      for (const m of s.matchAll(/class (Flow\w+)/g)) flutterClasses.add(m[1]!)
    }
    const hasWeb = (c: Contract) => {
      const srcs = Array.isArray(c.src) ? c.src : c.src ? [c.src] : []
      return srcs.some(s => existsSync(join(ROOT, 'ui', s)) || existsSync(join(ROOT, s)))
    }
    const viol: string[] = []
    for (const c of contracts) {
      const platforms = (c as { platforms?: Record<string, string> }).platforms ?? {}
      for (const [plat, status] of Object.entries(platforms)) {
        if (status !== 'stable' && status !== 'beta') continue
        if (plat === 'web' && !hasWeb(c)) viol.push(`${c.name}: web=${status} sin código`)
        if (plat === 'flutter' && !flutterClasses.has('Flow' + c.name.replace(/[^\w]/g, '')))
          viol.push(`${c.name}: flutter=${status} sin widget`)
      }
    }
    expect(viol, `Plataforma prometida sin implementación:\n${viol.join('\n')}`).toHaveLength(0)
  })

  it('todo token referenciado en un contrato existe', () => {
    const dead: string[] = []
    for (const c of contracts) {
      for (const t of c.tokens ?? []) {
        const s = String(t)
        // nombres completos al inicio de palabra; ignora wildcards de prosa
        // (--status-*-bg) y modificadores BEM (.flow-symbol--fill)
        for (const m of s.matchAll(/(?<![\w.-])--[a-z][\w-]*[a-z0-9]/g)) {
          const token = m[0]
          if (s.includes(token + '*') || s.includes(token + '-*')) continue
          if (!definedTokens.has(token)) dead.push(`${c.name}: ${token}`)
        }
      }
    }
    expect(dead, `Tokens inexistentes en contratos:\n${dead.join('\n')}`).toHaveLength(0)
  })
})
