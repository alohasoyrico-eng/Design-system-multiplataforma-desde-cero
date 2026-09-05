import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

const lib = (p: string) => fileURLToPath(new URL('../../packages/flow-react/' + p, import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@alohasoyrico-eng/flow-react/styles.css', replacement: lib('src/styles.css') },
      { find: '@alohasoyrico-eng/flow-react/reset.css', replacement: lib('src/reset.css') },
      { find: '@alohasoyrico-eng/flow-react/contracts', replacement: lib('src/data/items.json') },
      { find: '@alohasoyrico-eng/flow-react/specimens', replacement: lib('src/specimens/index.tsx') },
      { find: '@alohasoyrico-eng/flow-react', replacement: lib('src/ui/lib.ts') },
    ],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test-setup.ts',
    css: { modules: { classNameStrategy: 'non-scoped' } },
  },
})
