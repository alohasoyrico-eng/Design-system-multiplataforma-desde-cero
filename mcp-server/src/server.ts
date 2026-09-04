#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as ts from 'typescript'

const FLOW_ROOT = process.env.FLOW_ROOT || path.resolve(import.meta.dirname, '..', '..')

const UI_DIR = path.join(FLOW_ROOT, 'src', 'ui')
const TOKENS_DIR = path.join(FLOW_ROOT, 'src', 'tokens')
const CLAUDE_MD = path.join(FLOW_ROOT, 'CLAUDE.md')

const LAYERS = ['primitives', 'components', 'patterns'] as const
type Layer = (typeof LAYERS)[number]

// ── Helpers ──────────────────────────────────────────────────────────────────

function ok(t: string) {
  return { content: [{ type: 'text' as const, text: t }] }
}

function fail(t: string) {
  return { content: [{ type: 'text' as const, text: t }], isError: true as const }
}

function readFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8')
}

function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath)
}

interface InventoryItem {
  name: string
  layer: Layer
  hasStyles: boolean
  propsInterface: string | null
}

function parseBarrelExports(layer: Layer): InventoryItem[] {
  const indexPath = path.join(UI_DIR, layer, 'index.ts')
  if (!fileExists(indexPath)) return []

  const content = readFile(indexPath)
  const items: InventoryItem[] = []

  for (const line of content.split('\n')) {
    const match = line.match(/export\s*\{[^}]*\}\s*from\s*['"]\.\/([\w]+)['"]/)
    if (!match) continue

    const name = match[1]
    const propsMatch = line.match(/type\s+(\w+Props)/)
    const hasStyles = fileExists(path.join(UI_DIR, layer, `${name}.module.css`))

    items.push({
      name,
      layer,
      hasStyles,
      propsInterface: propsMatch ? propsMatch[1] : null,
    })
  }

  return items
}

interface PropInfo {
  name: string
  type: string
  optional: boolean
  description: string | null
}

function parseComponentProps(filePath: string, interfaceName: string): PropInfo[] {
  const content = readFile(filePath)
  const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true)
  const props: PropInfo[] = []

  function visit(node: ts.Node) {
    if (
      ts.isInterfaceDeclaration(node) &&
      node.name.text === interfaceName
    ) {
      for (const member of node.members) {
        if (ts.isPropertySignature(member) && member.name) {
          const name = member.name.getText(sourceFile)
          const optional = !!member.questionToken
          const type = member.type ? member.type.getText(sourceFile) : 'unknown'

          let description: string | null = null
          const jsDocs = ts.getJSDocCommentsAndTags(member)
          if (jsDocs.length > 0) {
            const doc = jsDocs[0]
            if (ts.isJSDoc(doc) && doc.comment) {
              description = typeof doc.comment === 'string'
                ? doc.comment
                : doc.comment.map(c => c.getText(sourceFile)).join('')
            }
          }

          props.push({ name, type, optional, description })
        }
      }
    }
    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return props
}

function findComponentFile(name: string): { filePath: string; layer: Layer } | null {
  for (const layer of LAYERS) {
    const filePath = path.join(UI_DIR, layer, `${name}.tsx`)
    if (fileExists(filePath)) return { filePath, layer }
  }
  return null
}

function formatPropsResult(
  name: string,
  layer: Layer,
  interfaceName: string,
  props: PropInfo[],
  filePath: string
) {
  const lines = [
    `# ${name}`,
    ``,
    `- **Layer:** ${layer}`,
    `- **File:** src/ui/${layer}/${name}.tsx`,
    `- **Interface:** ${interfaceName}`,
    ``,
    `## Props`,
    ``,
    `| Prop | Type | Required |`,
    `|------|------|----------|`,
  ]

  for (const p of props) {
    const req = p.optional ? 'No' : 'Yes'
    const desc = p.description ? ` — ${p.description}` : ''
    lines.push(`| ${p.name} | \`${p.type}\` | ${req} |${desc}`)
  }

  const cssPath = filePath.replace('.tsx', '.module.css')
  if (fileExists(cssPath)) {
    lines.push('')
    lines.push(`## CSS Module`)
    lines.push(``)
    lines.push(`File: src/ui/${layer}/${name}.module.css`)

    const cssContent = readFile(cssPath)
    const classes = [...cssContent.matchAll(/\.([a-zA-Z][\w-]*)/g)].map(m => m[1])
    const unique = [...new Set(classes)]
    if (unique.length > 0) {
      lines.push(`Classes: ${unique.join(', ')}`)
    }

    const variants = [...cssContent.matchAll(/\[data-(\w+)="(\w+)"\]/g)]
    if (variants.length > 0) {
      lines.push(`Variants:`)
      const grouped = new Map<string, string[]>()
      for (const [, attr, val] of variants) {
        if (!grouped.has(attr)) grouped.set(attr, [])
        grouped.get(attr)!.push(val)
      }
      for (const [attr, vals] of grouped) {
        lines.push(`  - data-${attr}: ${[...new Set(vals)].join(', ')}`)
      }
    }
  }

  return ok(lines.join('\n'))
}

// ── Server ───────────────────────────────────────────────────────────────────

const server = new McpServer({
  name: 'flow-ds',
  version: '1.0.0',
})

// Tool 1: list_inventory
server.tool(
  'list_inventory',
  'List all Flow DS primitives, components, and patterns with their prop interfaces',
  {},
  async () => {
    const inventory: Record<Layer, InventoryItem[]> = {
      primitives: parseBarrelExports('primitives'),
      components: parseBarrelExports('components'),
      patterns: parseBarrelExports('patterns'),
    }

    const lines: string[] = []
    for (const layer of LAYERS) {
      const items = inventory[layer]
      lines.push(`## ${layer} (${items.length})`)
      lines.push('')
      for (const item of items) {
        const style = item.hasStyles ? ' [CSS Module]' : ''
        const props = item.propsInterface ? ` → ${item.propsInterface}` : ''
        lines.push(`- ${item.name}${props}${style}`)
      }
      lines.push('')
    }

    return ok(lines.join('\n'))
  }
)

// Tool 2: get_component_api
server.tool(
  'get_component_api',
  'Get the full TypeScript props interface for a Flow DS component. Returns each prop with name, type, and whether it is optional.',
  { name: z.string().describe('Component name, e.g. "Button", "Card", "AuthForm"') },
  async ({ name }) => {
    const found = findComponentFile(name)
    if (!found) {
      return fail(`Component "${name}" not found. Use list_inventory to see available components.`)
    }

    const { filePath, layer } = found
    const propsName = `${name}Props`
    const props = parseComponentProps(filePath, propsName)

    if (props.length === 0) {
      const content = readFile(filePath)
      const interfaceMatch = content.match(/export\s+interface\s+(\w+Props)/)
      if (interfaceMatch) {
        const actualName = interfaceMatch[1]
        const retryProps = parseComponentProps(filePath, actualName)
        if (retryProps.length > 0) {
          return formatPropsResult(name, layer, actualName, retryProps, filePath)
        }
      }
      return ok(`Component "${name}" found at ${layer}/${name}.tsx but no props interface detected.`)
    }

    return formatPropsResult(name, layer, propsName, props, filePath)
  }
)

// Tool 3: get_tokens
server.tool(
  'get_tokens',
  'Get all Flow DS design tokens — colors, spacing, typography, shape, motion, elevation, dataviz, iconography, a11y, products. Returns the raw CSS custom properties.',
  {
    category: z.enum(['all', 'colors', 'spacing', 'typography', 'shape', 'motion', 'elevation', 'dark', 'dataviz', 'iconography', 'a11y', 'products'])
      .optional()
      .describe('Token category to retrieve. Defaults to "all".')
  },
  async ({ category }) => {
    const cat = category || 'all'

    const fileMap: Record<string, string[]> = {
      colors: ['colors.css'],
      spacing: ['spacing.css'],
      typography: ['typography.css', 'fonts.css'],
      shape: ['shape.css'],
      motion: ['motion.css'],
      elevation: ['elevation.css'],
      dark: ['dark.css'],
      dataviz: ['dataviz.css'],
      iconography: ['iconography.css'],
      a11y: ['a11y.css'],
      products: ['products.css'],
      all: ['colors.css', 'spacing.css', 'typography.css', 'fonts.css', 'shape.css', 'motion.css', 'elevation.css', 'a11y.css', 'dataviz.css', 'iconography.css', 'products.css'],
    }

    const files = fileMap[cat] || fileMap.all
    const sections: string[] = []

    for (const file of files) {
      const filePath = path.join(TOKENS_DIR, file)
      if (!fileExists(filePath)) continue

      const content = readFile(filePath)
      sections.push(`/* === ${file} === */\n${content}`)
    }

    return ok(sections.join('\n\n'))
  }
)

// Tool 3b: get_contract — la ficha completa de una pieza
server.tool(
  'get_contract',
  'Get the full documented contract (ficha) for a Flow DS piece: API members with descriptions, tokens it consumes, when/notWhen guidance, platform maturity, variants. Richer than get_component_api (which parses TypeScript only). Use the kebab-case id (e.g. "icon-button", "bottom-sheet") or the component name.',
  { id: z.string().describe('Piece id in kebab-case ("icon-button") or component name ("IconButton")') },
  async ({ id }) => {
    const itemsPath = path.join(FLOW_ROOT, 'src', 'data', 'items.json')
    if (!fileExists(itemsPath)) return fail('items.json not found.')
    const items = JSON.parse(readFile(itemsPath)) as Record<string, Record<string, unknown>>
    const kebab = id.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
    const ficha = items[id] || items[kebab]
    if (!ficha) {
      const parecidos = Object.keys(items).filter((k) => k.includes(kebab.slice(0, 5))).slice(0, 8)
      return fail(`No contract for "${id}". Similar ids: ${parecidos.join(', ') || '(none)'} — or use list_inventory.`)
    }
    return ok(JSON.stringify(ficha, null, 2))
  }
)

// Tool 3c: get_user_guide — las reglas para el repo que USA Flow
server.tool(
  'get_user_guide',
  'Get the Flow DS user guide: the rules for a product repo that consumes Flow (tokens over hex, search before building, do not touch internals, overlays/forms/charts conventions, anti-patterns, deprecations). Read this before writing UI code in a consumer repo.',
  {},
  async () => {
    const guidePath = path.join(FLOW_ROOT, 'docs', 'USUARIO.md')
    if (!fileExists(guidePath)) return fail('docs/USUARIO.md not found.')
    return ok(readFile(guidePath))
  }
)

// Tool 4: get_architecture_rules
server.tool(
  'get_architecture_rules',
  'Get the Flow DS architecture rules, cascade hierarchy, component recipe, prop conventions, and token reference from CLAUDE.md',
  {},
  async () => {
    if (!fileExists(CLAUDE_MD)) {
      return fail('CLAUDE.md not found at the expected location.')
    }

    return ok(readFile(CLAUDE_MD))
  }
)

// Tool 5: validate_import
server.tool(
  'validate_import',
  'Check whether an import between two Flow DS files respects the cascade rules (foundations → primitives → components → patterns → templates). Returns valid/invalid with explanation.',
  {
    from: z.string().describe('The file that contains the import statement, e.g. "components/Card"'),
    importing: z.string().describe('The file being imported, e.g. "primitives/Button"'),
  },
  async ({ from, importing }) => {
    const normalizeLayer = (input: string): Layer | 'foundations' | 'templates' | null => {
      const lower = input.toLowerCase()
      for (const l of [...LAYERS, 'foundations', 'templates'] as const) {
        if (lower.startsWith(l) || lower.includes(`/${l}/`)) return l
      }
      return null
    }

    const fromLayer = normalizeLayer(from)
    const importLayer = normalizeLayer(importing)

    if (!fromLayer) {
      return fail(`Cannot determine layer for "${from}". Expected format: "layer/ComponentName" (e.g. "components/Card")`)
    }

    if (!importLayer) {
      return fail(`Cannot determine layer for "${importing}". Expected format: "layer/ComponentName" (e.g. "primitives/Button")`)
    }

    const layerOrder = ['foundations', 'primitives', 'components', 'patterns', 'templates'] as const

    if (fromLayer === importLayer) {
      return ok(`INVALID — "${from}" and "${importing}" are in the same layer (${fromLayer}). Same-layer imports are not allowed. If they share logic, extract it to the layer below.`)
    }

    const fromIdx = layerOrder.indexOf(fromLayer as typeof layerOrder[number])
    const importIdx = layerOrder.indexOf(importLayer as typeof layerOrder[number])

    if (fromIdx === -1 || importIdx === -1) {
      return fail(`Cannot validate: unrecognized layer(s). Known layers: ${layerOrder.join(' → ')}`)
    }

    if (importIdx < fromIdx) {
      return ok(`VALID — "${from}" (${fromLayer}) importing from "${importing}" (${importLayer}) respects the cascade: dependencies flow downward.`)
    }

    return ok(`INVALID — "${from}" (${fromLayer}) cannot import from "${importing}" (${importLayer}). The cascade is: ${layerOrder.join(' → ')}. Dependencies only flow downward (toward foundations).`)
  }
)

// ── Start ────────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport()
await server.connect(transport)
