import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { WidgetFrame } from '../WidgetFrame'

describe('WidgetFrame', () => {
  // wf-1
  it('oculto sin personalizar no renderiza; con personalizar se atenúa', () => {
    const { container, rerender } = render(
      <WidgetFrame title="Consumo" hidden><div>datos</div></WidgetFrame>,
    )
    expect(container.firstChild).toBeNull()
    rerender(
      <WidgetFrame title="Consumo" hidden customizing onToggle={() => {}}><div>datos</div></WidgetFrame>,
    )
    expect(screen.getByLabelText('Consumo')).toHaveAttribute('data-hidden')
  })

  // wf-2
  it('el control de mostrar/ocultar nombra al widget', async () => {
    const onToggle = vi.fn()
    render(
      <WidgetFrame title="Consumo" customizing onToggle={onToggle}><div>datos</div></WidgetFrame>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Ocultar: Consumo' }))
    expect(onToggle).toHaveBeenCalled()
  })
})
