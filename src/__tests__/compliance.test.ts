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

// Also scan layout and app-level component CSS
const layoutDir = join(ROOT, 'layout')
const componentsDir = join(ROOT, 'app')
try { allCss.push(...walk(layoutDir, '.module.css')) } catch {}
try { allCss.push(...walk(componentsDir, '.module.css')) } catch {}

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

  it('nobody outside growth/adapters imports an analytics SDK — the adapter is the only door', () => {
    const allSrc = [
      ...walk(join(ROOT, 'ui'), '.tsx'),
      ...walk(join(ROOT, 'ui'), '.ts'),
      ...walk(join(ROOT, 'pages'), '.tsx'),
      ...walk(join(ROOT, 'layout'), '.tsx'),
      ...walk(join(ROOT, 'app'), '.tsx'),
      ...walk(join(ROOT, 'growth'), '.tsx'),
      ...walk(join(ROOT, 'growth'), '.ts'),
    ].filter(f => !f.includes('/adapters/'))
    const hits = grepFiles(
      allSrc,
      /from\s+['"](mixpanel|firebase|amplitude|posthog|@segment|@amplitude|@mixpanel)/,
    )
    expect(
      hits,
      `SDKs de analytics solo dentro de growth/adapters/ — bypasear el adapter mata la portabilidad:\n${formatHits(hits)}`,
    ).toHaveLength(0)
  })

  it('the cascade never imports growth — measurement is wired at product level', () => {
    const allUi = [
      ...walk(join(UI, 'primitives'), '.tsx'),
      ...walk(join(UI, 'components'), '.tsx'),
      ...walk(join(UI, 'patterns'), '.tsx'),
    ]
    const hits = grepFiles(allUi, /from\s+['"].*\/growth/)
    expect(
      hits,
      `La cascada no trackea sola — growth se conecta en templates/producto:\n${formatHits(hits)}`,
    ).toHaveLength(0)
  })

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
    )
      .filter(h => !h.text.includes('.module.css') && !h.text.includes('.css\''))
      // Archivos kebab-case son wiring interno del layer (contextos, helpers),
      // no patterns: solo un import de otro Pattern (PascalCase) viola R1.
      .filter(h => /from\s+['"]\.\/[A-Z]/.test(h.text))
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

  const INTERNAL_FILES: Record<string, string[]> = {
    primitives: ['ToggleControl', 'Listbox'],
  }

  for (const layer of layers) {
    it(`every ${layer.name}/*.tsx is exported from index.ts`, () => {
      const indexPath = join(layer.dir, 'index.ts')
      let indexContent: string
      try { indexContent = readFileSync(indexPath, 'utf-8') } catch {
        throw new Error(`${layer.name}/index.ts not found`)
      }

      const internal = INTERNAL_FILES[layer.name] ?? []
      const tsxFiles = readdirSync(layer.dir)
        .filter((f: string) => f.endsWith('.tsx') && f !== 'index.tsx')
        .map((f: string) => basename(f, '.tsx'))
        .filter((name: string) => !internal.includes(name))

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

// ── 12. No @keyframes outside motion.css ──────────────────────

describe('Animation ownership', () => {
  it('no @keyframes in any CSS module (use motion.css)', () => {
    const hits = grepFiles(allCss, /@keyframes/)
    expect(hits, `@keyframes outside motion.css:\n${formatHits(hits)}`).toHaveLength(0)
  })
})

// ── 13. Token tiers: ref → sys chain ────────────────────────────────

describe('Token tiers', () => {
  const TOKENS = join(ROOT, 'tokens')
  const REF = join(TOKENS, 'ref')

  it('ref layer files exist', () => {
    const expected = ['spacing.css', 'radius.css', 'sizing.css', 'typography.css']
    for (const file of expected) {
      try {
        statSync(join(REF, file))
      } catch {
        expect.fail(`Missing ref token file: tokens/ref/${file}`)
      }
    }
  })

  it('ref tokens use only raw values (no var() references)', () => {
    let files: string[]
    try { files = readdirSync(REF).filter(f => f.endsWith('.css')).map(f => join(REF, f)) } catch { files = [] }
    const hits = grepFiles(files, /var\(/, /\/\*/)
    expect(hits, `Ref tokens must not reference other tokens:\n${formatHits(hits)}`).toHaveLength(0)
  })

  it('sys spacing tokens alias ref tokens', () => {
    const spacingFile = join(TOKENS, 'spacing.css')
    const content = readFileSync(spacingFile, 'utf-8')
    expect(content).toContain('var(--ref-space-')
    expect(content).toContain('var(--ref-size-')
  })

  it('sys shape tokens alias ref tokens', () => {
    const shapeFile = join(TOKENS, 'shape.css')
    const content = readFileSync(shapeFile, 'utf-8')
    expect(content).toContain('var(--ref-radius-')
  })

  it('sys typography tokens reference ref tracking', () => {
    const typFile = join(TOKENS, 'typography.css')
    const content = readFileSync(typFile, 'utf-8')
    expect(content).toContain('var(--ref-tracking-')
  })

  it('density overrides exist for compact and comfortable', () => {
    const spacingContent = readFileSync(join(TOKENS, 'spacing.css'), 'utf-8')
    const shapeContent = readFileSync(join(TOKENS, 'shape.css'), 'utf-8')
    const typContent = readFileSync(join(TOKENS, 'typography.css'), 'utf-8')

    for (const content of [spacingContent, shapeContent, typContent]) {
      expect(content, 'Missing compact density override').toContain('[data-density="compact"]')
      expect(content, 'Missing comfortable density override').toContain('[data-density="comfortable"]')
    }
  })

  it('styles.css imports ref layer before sys layer', () => {
    const stylesContent = readFileSync(join(ROOT, 'styles.css'), 'utf-8')
    const refPos = stylesContent.indexOf('tokens/ref/')
    const sysPos = stylesContent.indexOf('tokens/fonts.css')
    expect(refPos, 'ref imports must come before sys imports').toBeLessThan(sysPos)
  })
})

// ── 14. No inline fontSize in UI layer ─────────────────────────────

describe('Icon sizes — no inline fontSize', () => {
  const ECHARTS_EXEMPTIONS = [
    'FlowChart.tsx',
    'ScatterPlot.tsx',
    'CircularProgress.tsx',
  ]

  it('no inline fontSize in UI tsx (use icon size classes or CSS Module)', () => {
    const hits = grepFiles(
      tsxFiles.filter(f => !ECHARTS_EXEMPTIONS.some(e => f.endsWith(e))),
      /fontSize:/,
      /\/\//
    )
    expect(hits, `Inline fontSize in UI layer:\n${formatHits(hits)}`).toHaveLength(0)
  })

  it('no inline fontSize in page tsx (use icon size classes or CSS Module)', () => {
    const pageTsx = walk(join(ROOT, 'pages'), '.tsx')
    const hits = grepFiles(pageTsx, /fontSize:/, /\/\//)
    expect(hits, `Inline fontSize in pages:\n${formatHits(hits)}`).toHaveLength(0)
  })
})

// ── 15. No hardcoded font-size in CSS (use typography tokens) ───────

describe('Typography tokens in CSS', () => {
  const FONT_SIZE_EXCEPTIONS = [
    'FlowChart.module.css',
    'Specimen.module.css',
  ]

  it('no hardcoded font-size > 10px in UI CSS without token', () => {
    const hits = grepFiles(
      cssModules.filter(f => !FONT_SIZE_EXCEPTIONS.some(e => f.includes(e))),
      /font-size:\s*\d+px/,
      /var\(|\/\*/
    ).filter(h => {
      const match = h.text.match(/font-size:\s*(\d+)px/)
      return match && parseInt(match[1]) > 10
    })
    expect(hits, `Hardcoded font-size in UI CSS:\n${formatHits(hits)}`).toHaveLength(0)
  })
})
