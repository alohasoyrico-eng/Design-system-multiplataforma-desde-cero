/**
 * Flow Design System — Compliance Tests
 *
 * Automated verification of CLAUDE.md rules across the entire codebase.
 * Each test scans real files and fails on violations, printing the exact
 * file:line so the fix is obvious. Add exceptions only when the violation
 * is intentional and documented.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, basename, extname } from 'node:path'
import { describe, it, expect } from 'vitest'

// ── Helpers ──────────────────────────────────────────────────────────

const ROOT = join(__dirname, '..')
const UI = join(ROOT, 'ui')

interface FileLine { file: string; line: number; text: string }

function walk(dir: string, ext: string): string[] {
  const results: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      if (entry === '__tests__' || entry === 'node_modules') continue
      results.push(...walk(full, ext))
    } else if (full.endsWith(ext)) {
      results.push(full)
    }
  }
  return results
}

function grepFiles(files: string[], pattern: RegExp, exclude?: RegExp): FileLine[] {
  const hits: FileLine[] = []
  for (const file of files) {
    const lines = readFileSync(file, 'utf-8').split('\n')
    for (let i = 0; i < lines.length; i++) {
      const text = lines[i]
      if (pattern.test(text) && (!exclude || !exclude.test(text))) {
        hits.push({ file: relative(ROOT, file), line: i + 1, text: text.trim() })
      }
    }
  }
  return hits
}

function formatHits(hits: FileLine[]): string {
  return hits.map(h => `  ${h.file}:${h.line}  ${h.text}`).join('\n')
}

// ── File lists ───────────────────────────────────────────────────────

const cssModules = walk(UI, '.module.css')
const tsxFiles = walk(UI, '.tsx')
const pageCss = walk(join(ROOT, 'pages'), '.module.css')
const allCss = [...cssModules, ...pageCss]

// Also scan App.module.css and layout CSS
const layoutDir = join(ROOT, 'layout')
const appCss = join(ROOT, 'App.module.css')
try { if (statSync(appCss).isFile()) allCss.push(appCss) } catch {}
try { allCss.push(...walk(layoutDir, '.module.css')) } catch {}

// ── 1. Token compliance: no hardcoded colors ─────────────────────────

describe('Token compliance — colors', () => {
  // Exceptions: PaymentCard rgba tints (computed from card color),
  // MailingsPage email preview bg, PhoneFrame dark casing
  const COLOR_EXCEPTIONS = [
    'PaymentCard.module.css',
    'MailingsPage.module.css',
    'PhoneFrame.module.css',
  ]

  it('no hardcoded hex colors in CSS modules', () => {
    const hits = grepFiles(
      allCss.filter(f => !COLOR_EXCEPTIONS.some(e => f.includes(e))),
      /#[0-9a-fA-F]{3,8}\b/,
      /var\(|\/\*|\/\//  // exclude var() refs and comments
    )
    expect(hits, `Hardcoded hex colors found:\n${formatHits(hits)}`).toHaveLength(0)
  })

  it('no hardcoded rgba() in CSS modules', () => {
    const hits = grepFiles(
      allCss.filter(f => !COLOR_EXCEPTIONS.some(e => f.includes(e))),
      /rgba?\s*\(/,
      /var\(|\/\*|\/\//
    )
    expect(hits, `Hardcoded rgba() found:\n${formatHits(hits)}`).toHaveLength(0)
  })
})

// ── 2. Token compliance: border-radius ───────────────────────────────

describe('Token compliance — border-radius', () => {
  // Exceptions: sub-token values (1-5px) for fine visual adjustment,
  // 50% for circles, data-viz components (BulletChart, GanttChart)
  const RADIUS_EXCEPTIONS = [
    'BulletChart.module.css',
    'GanttChart.module.css',
  ]

  it('no hardcoded border-radius > 5px without token', () => {
    const hits = grepFiles(
      allCss.filter(f => !RADIUS_EXCEPTIONS.some(e => f.includes(e))),
      /border-radius:\s*\d+px/,
      /var\(|50%|[1-5]px|\/\*/
    )
    expect(hits, `Hardcoded border-radius found:\n${formatHits(hits)}`).toHaveLength(0)
  })
})

// ── 3. Token compliance: box-shadow ──────────────────────────────────

describe('Token compliance — box-shadow', () => {
  // Exceptions: PaymentCard (computed gradient shadow)
  const SHADOW_EXCEPTIONS = [
    'PaymentCard.module.css',
  ]

  it('no hardcoded box-shadow in CSS modules', () => {
    const hits = grepFiles(
      allCss.filter(f => !SHADOW_EXCEPTIONS.some(e => f.includes(e))),
      /box-shadow:/,
      /var\(|none|inherit|\/\*|\/\//
    )
    expect(hits, `Hardcoded box-shadow found:\n${formatHits(hits)}`).toHaveLength(0)
  })
})

// ── 4. Token compliance: font-family ─────────────────────────────────

describe('Token compliance — typography', () => {
  it('font-family only uses tokens or inherit', () => {
    const hits = grepFiles(
      allCss,
      /font-family:/,
      /var\(|inherit|\/\*/
    )
    expect(hits, `Hardcoded font-family found:\n${formatHits(hits)}`).toHaveLength(0)
  })
})

// ── 5. Architecture: layer imports ───────────────────────────────────

describe('Architecture — layer imports', () => {
  const primitivesTsx = walk(join(UI, 'primitives'), '.tsx')
  const componentsTsx = walk(join(UI, 'components'), '.tsx')

  it('primitives never import from components', () => {
    const hits = grepFiles(
      primitivesTsx,
      /from\s+['"].*\/components\//
    )
    expect(hits, `Primitive → component imports:\n${formatHits(hits)}`).toHaveLength(0)
  })

  it('primitives never import from patterns', () => {
    const hits = grepFiles(
      primitivesTsx,
      /from\s+['"].*\/patterns\//
    )
    expect(hits, `Primitive → pattern imports:\n${formatHits(hits)}`).toHaveLength(0)
  })

  it('components never import from patterns', () => {
    const hits = grepFiles(
      componentsTsx,
      /from\s+['"].*\/patterns\//
    )
    expect(hits, `Component → pattern imports:\n${formatHits(hits)}`).toHaveLength(0)
  })

  it('components never import from same layer (other components)', () => {
    // Exception: RouteBanner imports Card (layout container coupling, documented)
    const SAME_LAYER_EXCEPTIONS = ['RouteBanner.tsx']
    const filtered = componentsTsx.filter(f => !SAME_LAYER_EXCEPTIONS.some(e => f.endsWith(e)))
    const hits = grepFiles(
      filtered,
      /from\s+['"]\.\/(?!.*\.module\.css)/,
      /\.module\.css|\.css/
    ).filter(h => !h.text.includes('.module.css') && !h.text.includes('.css\''))
    expect(hits, `Same-layer component imports (R1 violation):\n${formatHits(hits)}`).toHaveLength(0)
  })

  it('patterns never import from same layer (other patterns)', () => {
    const patternsTsx = walk(join(UI, 'patterns'), '.tsx')
    const hits = grepFiles(
      patternsTsx,
      /from\s+['"]\.\/(?!.*\.module\.css)/,
      /\.module\.css|\.css/
    ).filter(h => !h.text.includes('.module.css') && !h.text.includes('.css\''))
    expect(hits, `Same-layer pattern imports (R1 violation):\n${formatHits(hits)}`).toHaveLength(0)
  })
})

// ── 6. Barrel exports ────────────────────────────────────────────────

describe('Barrel exports', () => {
  const layers = [
    { name: 'primitives', dir: join(UI, 'primitives') },
    { name: 'components', dir: join(UI, 'components') },
    { name: 'patterns', dir: join(UI, 'patterns') },
  ]

  for (const layer of layers) {
    it(`every ${layer.name}/*.tsx is exported from index.ts`, () => {
      const indexPath = join(layer.dir, 'index.ts')
      let indexContent: string
      try { indexContent = readFileSync(indexPath, 'utf-8') } catch {
        throw new Error(`${layer.name}/index.ts not found`)
      }

      const tsxFiles = readdirSync(layer.dir)
        .filter((f: string) => f.endsWith('.tsx') && f !== 'index.tsx')
        .map((f: string) => basename(f, '.tsx'))

      const missing = tsxFiles.filter((name: string) => !indexContent.includes(name))
      expect(missing, `Missing from ${layer.name}/index.ts: ${missing.join(', ')}`).toHaveLength(0)
    })
  }
})

// ── 7. Props interface exported ──────────────────────────────────────

describe('Props interface', () => {
  const layers = [
    join(UI, 'primitives'),
    join(UI, 'components'),
    join(UI, 'patterns'),
  ]

  it('every component exports its Props interface', () => {
    const missing: string[] = []
    for (const dir of layers) {
      const files = readdirSync(dir)
        .filter((f: string) => f.endsWith('.tsx') && f !== 'index.tsx')

      for (const file of files) {
        const name = basename(file, '.tsx')
        const content = readFileSync(join(dir, file), 'utf-8')
        if (!content.includes(`export interface ${name}Props`) && !content.includes(`export type ${name}Props`)) {
          missing.push(`${relative(ROOT, dir)}/${file}`)
        }
      }
    }
    expect(missing, `Missing exported Props:\n  ${missing.join('\n  ')}`).toHaveLength(0)
  })
})

// ── 8. No className prop ─────────────────────────────────────────────

describe('Prop conventions', () => {
  it('no component accepts className as a prop', () => {
    const hits = grepFiles(
      tsxFiles,
      /className\s*\??\s*:/,
      /\/\//  // ignore comments
    )
    expect(hits, `className prop found:\n${formatHits(hits)}`).toHaveLength(0)
  })
})

// ── 9. onMouseEnter/Leave for hover (should use CSS :hover) ──────────

describe('Hover implementation', () => {
  // Exceptions: Listbox (active index tracking, not visual hover),
  // Tooltip (show/hide state), Bars/SmallMultiples (chart hover index),
  // GlobalSearch (active result tracking), Sidebar (hover state for submenu)
  const MOUSE_EXCEPTIONS = [
    'Listbox.tsx',
    'Tooltip.tsx',
    'Bars.tsx',
    'SmallMultiples.tsx',
    'GlobalSearch.tsx',
    'Sidebar.tsx',
  ]

  it('no onMouseEnter/Leave for visual hover (use CSS :hover)', () => {
    const hits = grepFiles(
      tsxFiles.filter(f => !MOUSE_EXCEPTIONS.some(e => f.endsWith(e))),
      /onMouseEnter|onMouseLeave/,
      /\/\//
    )
    expect(hits, `JS hover handlers found (use CSS :hover):\n${formatHits(hits)}`).toHaveLength(0)
  })
})

// ── 10. Inline styles audit ──────────────────────────────────────────

describe('Inline styles', () => {
  // FlowChart is excluded: ECharts API requires JS objects, not CSS.
  // Icon fontSize is allowed: flow-icon size overrides are inline by design.
  const INLINE_STYLE_EXCEPTIONS = [
    'FlowChart.tsx',
    'HelpCenter.tsx',
  ]

  it('no hardcoded color values in inline styles', () => {
    const hits = grepFiles(
      tsxFiles.filter(f => !INLINE_STYLE_EXCEPTIONS.some(e => f.endsWith(e))),
      /style\s*=\s*\{?\{[^}]*color:\s*['"]#/,
      /\/\//
    )
    expect(hits, `Hardcoded colors in inline styles:\n${formatHits(hits)}`).toHaveLength(0)
  })

  it('no hardcoded pixel padding/margin in inline styles', () => {
    const hits = grepFiles(
      tsxFiles.filter(f => !INLINE_STYLE_EXCEPTIONS.some(e => f.endsWith(e))),
      /style\s*=\s*\{?\{[^}]*(padding|margin):\s*['"]?\d+px/,
      /\/\//
    )
    // Only flag if there are egregious cases — small px adjustments are fine
    for (const hit of hits) {
      const match = hit.text.match(/(padding|margin):\s*['"]?(\d+)px/)
      if (match && parseInt(match[2]) > 8) {
        expect.fail(`Large hardcoded ${match[1]} (${match[2]}px) at ${hit.file}:${hit.line}`)
      }
    }
  })
})

// ── 11. CSS Module pairing ───────────────────────────────────────────

describe('CSS Module pairing', () => {
  it('every component that imports a CSS module has that file', () => {
    const missing: string[] = []
    for (const file of tsxFiles) {
      const content = readFileSync(file, 'utf-8')
      const match = content.match(/import\s+\w+\s+from\s+['"]\.\/([\w.]+\.module\.css)['"]/)
      if (match) {
        const cssPath = join(file, '..', match[1])
        try { statSync(cssPath) } catch {
          missing.push(`${relative(ROOT, file)} imports ${match[1]} but file not found`)
        }
      }
    }
    expect(missing, `Missing CSS modules:\n  ${missing.join('\n  ')}`).toHaveLength(0)
  })
})

// ── 12. No @keyframes outside shells/motion.css ──────────────────────

describe('Animation ownership', () => {
  // Per R3: nothing redeclares its own @keyframes outside shells
  // Exception: RouteBanner has its own slide animation (renamed from flowIn)
  const KEYFRAME_EXCEPTIONS = [
    'RouteBanner.module.css',
    'OTPInput.module.css',
    'PeekSheet.module.css',
  ]

  it('no @keyframes in component CSS modules (use motion.css)', () => {
    const componentCss = cssModules.filter(f =>
      f.includes('/components/') &&
      !KEYFRAME_EXCEPTIONS.some(e => f.includes(e))
    )
    const hits = grepFiles(componentCss, /@keyframes/)
    expect(hits, `@keyframes outside motion.css:\n${formatHits(hits)}`).toHaveLength(0)
  })
})
