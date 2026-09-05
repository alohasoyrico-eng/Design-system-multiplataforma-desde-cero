import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Popover } from '../Popover'

describe('Popover', () => {
  it('renders trigger content', () => {
    render(
      <Popover trigger={<button>Open</button>}>
        <div>Menu content</div>
      </Popover>,
    )
    expect(screen.getByText('Open')).toBeInTheDocument()
  })

  it('does not show children by default', () => {
    render(
      <Popover trigger={<button>Open</button>}>
        <div>Hidden content</div>
      </Popover>,
    )
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument()
  })

  it('shows children when open is true', () => {
    render(
      <Popover trigger={<button>Open</button>} open>
        <div>Visible content</div>
      </Popover>,
    )
    expect(screen.getByText('Visible content')).toBeInTheDocument()
  })

  it('opens on trigger click', async () => {
    const user = userEvent.setup()
    render(
      <Popover trigger={<button>Toggle</button>}>
        <div>Popup content</div>
      </Popover>,
    )
    await user.click(screen.getByText('Toggle'))
    expect(screen.getByText('Popup content')).toBeInTheDocument()
  })

  it('calls onOpenChange when trigger is clicked', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Popover trigger={<button>Click</button>} open={false} onOpenChange={onOpenChange}>
        <div>Content</div>
      </Popover>,
    )
    await user.click(screen.getByText('Click'))
    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it('align="right" legado mapea a bottom-end', () => {
    render(
      <Popover trigger={<button>Trigger</button>} open align="right">
        <div>Aligned</div>
      </Popover>,
    )
    expect(document.querySelector('[data-side="bottom"][data-cross="end"]')).toBeInTheDocument()
  })
})

describe('Popover — posicionamiento y piel', () => {
  it('placement top-center marca lado y eje cruzado', () => {
    // jsdom mide todo 0 en (0,0): sin geometria, arriba nunca cabe y pp-2
    // voltearia. Se le da sitio real al ancla para que el lado pedido valga.
    const spy = vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue(
      { top: 400, bottom: 420, left: 100, right: 160, width: 60, height: 20, x: 100, y: 400, toJSON: () => ({}) } as DOMRect,
    )
    render(
      <Popover trigger={<button>T</button>} open placement="top-center"><div>P</div></Popover>,
    )
    expect(document.querySelector('[data-side="top"][data-cross="center"]')).toBeInTheDocument()
    spy.mockRestore()
  })

  it('surface none no lleva la piel de card', () => {
    render(
      <Popover trigger={<button>T</button>} open surface="none"><div>P</div></Popover>,
    )
    expect(document.querySelector('[data-surface="none"]')).toBeInTheDocument()
  })

  it('interactive=false hace el panel no señalable', () => {
    render(
      <Popover trigger={<button>T</button>} open interactive={false}><div>P</div></Popover>,
    )
    const drop = document.querySelector('[data-surface]') as HTMLElement
    expect(drop.hasAttribute('data-interactive')).toBe(false)
  })

  it('minWidth aplica al panel', () => {
    render(
      <Popover trigger={<button>T</button>} open minWidth={320}><div>P</div></Popover>,
    )
    expect((document.querySelector('[data-surface]') as HTMLElement).style.minWidth).toBe('320px')
  })

  it('anchorRef posiciona fixed junto al ancla externa', () => {
    const anchor = document.createElement('div')
    document.body.appendChild(anchor)
    anchor.getBoundingClientRect = () => ({ top: 100, bottom: 120, left: 40, right: 240, width: 200, height: 20 } as DOMRect)
    const ref = { current: anchor }
    render(
      <Popover open anchorRef={ref} matchAnchorWidth><div>P</div></Popover>,
    )
    const drop = document.querySelector('[data-surface]') as HTMLElement
    expect(drop.style.position).toBe('fixed')
    expect(drop.style.width).toBe('200px')
    document.body.removeChild(anchor)
  })

  it('al cerrar con Escape, el foco regresa a returnFocusRef', async () => {
    const user = userEvent.setup()
    const back = document.createElement('button')
    document.body.appendChild(back)
    render(
      <Popover trigger={<button>T</button>} open returnFocusRef={{ current: back }}><div>P</div></Popover>,
    )
    await user.keyboard('{Escape}')
    expect(document.activeElement).toBe(back)
    document.body.removeChild(back)
  })
})
