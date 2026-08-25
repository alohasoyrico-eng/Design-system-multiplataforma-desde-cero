import type { ReactNode } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { IntlProvider } from 'react-intl'
import messages from './i18n/es.json'

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <IntlProvider locale="es" messages={messages} defaultLocale="es">
      {children}
    </IntlProvider>
  )
}

function renderWithIntl(ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: Wrapper, ...options })
}

export { renderWithIntl }
