import { useIntl, type IntlShape } from 'react-intl'

/** useIntl sin exigir provider: los primitives no pueden imponer FlowIntlProvider
    a toda app por un aria-label. Sin provider, cae al defaultMessage (es). */
export function useSafeIntl(): IntlShape | null {
  try {
    // La regla ve el try como condicional, pero useIntl se llama SIEMPRE en el
    // mismo orden: el try solo captura su throw cuando no hay provider (D5).
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useIntl()
  } catch {
    return null
  }
}

/* i18n-2: los valores viajan POR formatMessage, nunca por .replace() encima
   del resultado — formatear «Buscar en {caption}» sin la variable revienta
   con FORMAT_ERROR en consola (cazado en eOne: 100+ errores por render del
   DataTable). Sin provider, la interpolación cae al reemplazo simple. */
export function useT() {
  const intl = useSafeIntl()
  return (id: string, defaultMessage: string, values?: Record<string, string | number>) => {
    if (intl) return intl.formatMessage({ id, defaultMessage }, values)
    if (!values) return defaultMessage
    return Object.entries(values).reduce(
      (message, [key, value]) => message.replaceAll(`{${key}}`, String(value)),
      defaultMessage,
    )
  }
}
