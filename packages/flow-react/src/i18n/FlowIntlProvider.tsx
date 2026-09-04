import { IntlProvider, useIntl } from 'react-intl'
import type { ReactNode } from 'react'
import es from './es.json'
import en from './en.json'
import pt from './pt.json'

export type FlowLocale = 'es' | 'en' | 'pt'

const messages: Record<FlowLocale, Record<string, string>> = { es, en, pt }

export interface FlowIntlProviderProps {
  locale?: FlowLocale
  children: ReactNode
}

export function FlowIntlProvider({ locale = 'es', children }: FlowIntlProviderProps) {
  return (
    <IntlProvider locale={locale} messages={messages[locale]} defaultLocale="es">
      {children}
    </IntlProvider>
  )
}

export function useFlowIntl() {
  return useIntl()
}
