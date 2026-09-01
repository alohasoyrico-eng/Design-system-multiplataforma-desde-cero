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
      entry: 'src/ui/lib-entry.ts',
      formats: ['es'],
      fileName: 'index',
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
    },
  },
})
