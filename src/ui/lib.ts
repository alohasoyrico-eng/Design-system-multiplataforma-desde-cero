/* Superficie pública de Flow React: los tres barrels de la cascada.
   Este archivo es la fuente de los tipos del paquete — no importa CSS. */
export * from './primitives'
export * from './components'
export * from './patterns'
export * from '../growth'
export { useReveal } from '../hooks/useReveal'
/* Los patterns usan react-intl: sin un IntlProvider en el árbol revientan.
   Se exporta el proveedor del sistema para que el consumidor no tenga que
   montar el suyo (aunque puede: cualquier IntlProvider de react-intl vale). */
export { FlowIntlProvider, useFlowIntl, type FlowLocale } from '../i18n'
