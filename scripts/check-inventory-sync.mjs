#!/usr/bin/env node
/**
 * check-inventory-sync — el inventario vive en dos registros del MISMO repo:
 * el catálogo de la implementación (packages/flow-react/src/data/items.json, rama main) y la
 * referencia canónica (architecture.json, rama canonical). Ya derivaron dos
 * veces: 37 contratos sin registrar en un sentido, 41 fichas sin contrato en
 * el otro, y 29 capas discordantes. Este chequeo bloquea la tercera.
 *
 *   node scripts/check-inventory-sync.mjs [--json]
 *
 * Lee architecture.json de la rama canonical vía git (origin/canonical o
 * canonical local). Si la ref no existe (checkout superficial sin fetch),
 * avisa y sale 0: en CI el workflow hace fetch explícito antes.
 *
 * Reglas:
 *   S1  toda ficha real del catálogo existe en la referencia con la misma capa
 *       (real = ni stub, ni proposed, ni deprecated: eso es backlog o migración)
 *   S2  todo ítem de la referencia existe como ficha en el catálogo
 *   S3  los shells del canon aparecen como primitives en el catálogo
 */
import { readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const catalogo = JSON.parse(readFileSync(resolve(root, 'packages/flow-react/src/data/items.json'), 'utf8'))

let arqRaw = null
for (const ref of ['origin/canonical', 'canonical']) {
  try {
    arqRaw = execSync(`git show ${ref}:architecture.json`, { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] }).toString()
    break
  } catch {}
}
if (!arqRaw) {
  console.log('inventory-sync: la rama canonical no está disponible localmente — chequeo omitido (haz `git fetch origin canonical`).')
  process.exit(0)
}
const arq = JSON.parse(arqRaw)
const refItems = new Map(arq.items.map((i) => [i.id, i.layer]))
const shells = new Set(arq.shells || [])

// Excepciones declaradas: una excepción sin motivo escrito es un defecto sin registrar.
const EXENTAS = {
  growth: 'Instrumentación de medición y experimentos: vive en el repo, no es una foundation de diseño del canon.',
}

const hallazgos = []
const F = (regla, msg) => hallazgos.push({ regla, msg })

for (const [id, v] of Object.entries(catalogo)) {
  if (v.stub || v.status === 'proposed' || v.status === 'deprecated') continue
  if (EXENTAS[id]) continue
  if (shells.has(id)) {
    if (v.layer !== 'primitives') F('S3', `"${id}" es shell del canon y el catálogo lo declara ${v.layer}; los shells son primitives`)
    continue
  }
  const rl = refItems.get(id)
  if (!rl) F('S1', `"${id}" (${v.layer}) está en el catálogo sin contrato registrado en la referencia`)
  else if (rl !== v.layer) F('S1', `"${id}": el catálogo dice ${v.layer} y la referencia ${rl}`)
}

for (const [id, layer] of refItems) {
  if (!(id in catalogo)) F('S2', `"${id}" (${layer}) está en la referencia y no tiene ficha en el catálogo`)
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ ok: !hallazgos.length, total: hallazgos.length, hallazgos }, null, 2))
} else if (!hallazgos.length) {
  console.log(`inventory-sync: ${refItems.size} ítems de la referencia y ${Object.keys(catalogo).length} fichas coherentes (backlog y deprecados exentos).`)
} else {
  for (const h of hallazgos) console.log(`  ✗ [${h.regla}] ${h.msg}`)
  console.log(`\n${hallazgos.length} hallazgo(s).`)
}
process.exit(hallazgos.length ? 1 : 0)
