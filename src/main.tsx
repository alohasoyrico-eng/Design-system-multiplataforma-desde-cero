import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FlowIntlProvider } from './i18n'
import { FlowGrowthProvider, consoleAdapter } from './growth'
import './reset.css'
import './styles.css'
import App from './App'

const queryClient = new QueryClient()

async function boot() {
  const { worker } = await import('./mocks/browser')
  await worker.start({ onUnhandledRequest: 'bypass' })

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <FlowIntlProvider locale="es">
        <QueryClientProvider client={queryClient}>
          {/* Instrumentación de referencia: en un producto real, aquí va
              el adapter del proveedor (Mixpanel, Firebase…). */}
          <FlowGrowthProvider adapter={consoleAdapter}>
            <App />
          </FlowGrowthProvider>
        </QueryClientProvider>
      </FlowIntlProvider>
    </StrictMode>,
  )
}

boot()
