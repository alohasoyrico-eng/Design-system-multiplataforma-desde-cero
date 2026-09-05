import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Build de librería: npm run build:lib → dist-lib/
// El build de app (vite build → dist/) queda intacto.
export default defineConfig({
  plugins: [react()],
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      cssModules: {
        animation: false,
      },
    },
  },
  publicDir: false,
  build: {
    outDir: 'dist-lib',
    cssCodeSplit: false,
    lib: {
      entry: {
        'ui/lib-entry': 'src/ui/lib-entry.ts',
        // spm-2: entry propio — el principal no lo importa y no se paga sin querer
        'specimens/index': 'src/specimens/index.tsx',
      },
      formats: ['es'],
      cssFileName: 'flow',
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react-intl',
        /^echarts/,
        /^flag-icons/,
      ],
      output: {
        // Un módulo de salida por módulo de entrada, no un index.js único.
        // Sin esto no hay tree-shaking posible en el consumidor: importar
        // un Divider pagaba el echarts.use() top-level de FlowChart.
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
  },
})
