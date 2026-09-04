import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

const lib = (p: string) => fileURLToPath(new URL('../../packages/flow-react/' + p, import.meta.url))

// El banco consume el paquete por nombre. En dev, los alias resuelven al
// SOURCE de la lib (HMR); un consumidor externo resuelve a dist-lib.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@alohasoyrico-eng/flow-react/styles.css', replacement: lib('src/styles.css') },
      { find: '@alohasoyrico-eng/flow-react/reset.css', replacement: lib('src/reset.css') },
      { find: '@alohasoyrico-eng/flow-react/contracts', replacement: lib('src/data/items.json') },
      { find: '@alohasoyrico-eng/flow-react', replacement: lib('src/ui/lib-entry.ts') },
    ],
  },
  css: {
    transformer: 'lightningcss',
    lightningcss: { cssModules: { animation: false } },
  },
})
