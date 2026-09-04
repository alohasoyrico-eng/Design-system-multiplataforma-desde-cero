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

export function useT() {
  const intl = useSafeIntl()
  return (id: string, defaultMessage: string) =>
    intl ? intl.formatMessage({ id, defaultMessage }) : defaultMessage
}
