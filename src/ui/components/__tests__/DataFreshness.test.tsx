import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { IntlProvider } from 'react-intl'
import { DataFreshness } from '../DataFreshness'

const wrap = (ui: React.ReactNode) => render(<IntlProvider locale="es">{ui}</IntlProvider>)

describe('DataFreshness', () => {
  // df-1: separador de la casa
  it('encadena los metadatos con el separador ·', () => {
    wrap(
      <DataFreshness
        updatedLabel="datos al miércoles 12:40"
        cadence="ingesta a día vencido"
        nextRefresh="próximo refresco en 15 min"
      />,
    )
    expect(
      screen.getByText('datos al miércoles 12:40 · ingesta a día vencido · próximo refresco en 15 min'),
    ).toBeInTheDocument()
  })

  // df-2: refreshing bloquea y muestra carga
  it('con refreshing el botón queda deshabilitado', async () => {
    const onRefresh = vi.fn()
    wrap(<DataFreshness updatedLabel="datos al 12:40" onRefresh={onRefresh} refreshing />)
    const btn = screen.getByRole('button', { name: /Actualizar/ })
    expect(btn).toBeDisabled()
    await userEvent.click(btn).catch(() => {})
    expect(onRefresh).not.toHaveBeenCalled()
  })

  it('sin refreshing el botón dispara onRefresh', async () => {
    const onRefresh = vi.fn()
    wrap(<DataFreshness updatedLabel="datos al 12:40" onRefresh={onRefresh} />)
    await userEvent.click(screen.getByRole('button', { name: 'Actualizar' }))
    expect(onRefresh).toHaveBeenCalledOnce()
  })

  // df-3: anuncio en vivo
  it('el texto de frescura vive en una región aria-live polite', () => {
    wrap(<DataFreshness updatedLabel="datos al 12:40" />)
    expect(screen.getByText('datos al 12:40')).toHaveAttribute('aria-live', 'polite')
  })

  // df-4: solo lectura sin onRefresh
  it('sin onRefresh no hay botón', () => {
    wrap(<DataFreshness updatedLabel="datos al 12:40" />)
    expect(screen.queryByRole('button')).toBeNull()
  })
})
