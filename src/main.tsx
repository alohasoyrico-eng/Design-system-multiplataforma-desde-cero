import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FlowIntlProvider } from './i18n'
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
          <App />
        </QueryClientProvider>
      </FlowIntlProvider>
    </StrictMode>,
  )
}

boot()
