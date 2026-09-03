// prepare condicional: construye la librería solo donde hay código fuente.
// - repo de desarrollo / instalación desde git → hay src/ui → build:lib
// - artefacto empaquetado (.tgz, registry, file: al paquete) → no hay src/ui
//   ni devDependencies → no-op. Antes esto era "prepare": "npm run build:lib"
//   a secas y reventaba cada install del paquete distribuido.
import { existsSync } from 'node:fs'
import { execSync } from 'node:child_process'

if (existsSync(new URL('../src/ui', import.meta.url))) {
  execSync('npm run build:lib', { stdio: 'inherit' })
}
