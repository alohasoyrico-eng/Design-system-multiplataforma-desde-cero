import { useIntl, type IntlShape } from 'react-intl'

/** useIntl sin exigir provider: los primitives no pueden imponer FlowIntlProvider
    a toda app por un aria-label. Sin provider, cae al defaultMessage (es). */
export function useSafeIntl(): IntlShape | null {
  try {
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
