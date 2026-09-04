#!/usr/bin/env node
/**
 * Sincroniza la fuente de verdad del DS hacia el repo de docs:
 *   - src/data/items.json          (contratos)
 *   - src/growth/events.json       (diccionario de eventos)
 *
 * Los tokens y componentes YA NO se sincronizan: docs los consume del
 * paquete @alohasoyrico-eng/flow-react (npm update para traer lo nuevo).
 *
 * Uso:
 *   npm run sync:docs           # copia
 *   npm run sync:docs:check     # solo verifica; exit 1 si hay drift
 *
 * El path del repo de docs se toma de FLOW_DOCS_PATH o ../flow-docs.
 */
import { cpSync, existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const docsRoot = resolve(root, process.env.FLOW_DOCS_PATH ?? '../flow-docs')
const checkOnly = process.argv.includes('--check')

if (!existsSync(docsRoot)) {
  console.error(`✗ No encuentro el repo de docs en ${docsRoot}`)
  console.error('  Clónalo al lado de este repo o define FLOW_DOCS_PATH.')
  process.exit(1)
}

/** Pares [origen relativo al DS, destino relativo a docs]. */
const targets = [
  ['packages/flow-react/src/data/items.json', 'src/data/items.json'],
  ['packages/flow-react/src/growth/events.json', 'src/data/growth-events.json'],
]

function* filesUnder(path) {
  if (statSync(path).isFile()) { yield path; return }
  for (const entry of readdirSync(path)) yield* filesUnder(join(path, entry))
}

let drift = 0
for (const [from, to] of targets) {
  const src = join(root, from)
  const dst = join(docsRoot, to)
  for (const srcFile of filesUnder(src)) {
    const dstFile = join(dst, srcFile.slice(src.length))
    const same = existsSync(dstFile) &&
      readFileSync(srcFile, 'utf8') === readFileSync(dstFile, 'utf8')
    if (same) continue
    drift++
    if (checkOnly) {
      console.log(`drift: ${dstFile.slice(docsRoot.length + 1)}`)
    } else {
      cpSync(srcFile, dstFile)
      console.log(`sync:  ${dstFile.slice(docsRoot.length + 1)}`)
    }
  }
}

if (drift === 0) {
  console.log('✓ Sin drift — docs está sincronizado con el DS.')
} else if (checkOnly) {
  console.error(`✗ ${drift} archivo(s) con drift. Corre: npm run sync:docs`)
  process.exit(1)
} else {
  console.log(`✓ ${drift} archivo(s) sincronizados.`)
}
