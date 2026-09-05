/**
 * Conformance con el canon — tanda 3.
 * Cada test cita el id del criterio automatizado del contrato canonico que
 * verifica (el medidor check-conformance-coverage cuenta por esa cita).
 * Items: toast, tooltip, stepper, breadcrumb, pagination, accordion, drawer,
 * bottom-sheet, textarea, timeline.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { IntlProvider } from 'react-intl'
import { Toast, ToastStack } from '../ui/primitives/Toast'
import { Tooltip } from '../ui/components/Tooltip'
import { Stepper } from '../ui/primitives/Stepper'
import { Breadcrumb } from '../ui/primitives/Breadcrumb'
import { Pagination } from '../ui/primitives/Pagination'
import { Accordion } from '../ui/components/Accordion'
import { Drawer } from '../ui/components/Drawer'
import { BottomSheet } from '../ui/components/BottomSheet'
import { Textarea } from '../ui/primitives/Textarea'
import { Timeline } from '../ui/primitives/Timeline'

const cssDe = (rel: string) => readFileSync(join(__dirname, '..', 'ui', rel), 'utf8')

// ── toast ──────────────────────────────────────────────────────────────────
describe('conformance canon · toast', () => {
  it('tst-1: la pila es region aria-live polite y el mensaje aparece sin robar el foco', () => {
    const { container } = render(
      <ToastStack>
        <Toast message="Guardado" />
      </ToastStack>,
    )
    const stack = container.firstElementChild as HTMLElement
    expect(stack.getAttribute('aria-live')).toBe('polite')
    // el toast se anuncia (status = polite), no interrumpe (alert = assertive)
    expect(screen.getByRole('status')).toHaveTextContent('Guardado')
    expect(document.activeElement).toBe(document.body)
  })

  it('tst-3: cerrar y accion tienen nombre accesible y miden --hit-target-min', () => {
    render(<Toast message="Hecho" actionLabel="Deshacer" onAction={() => {}} onDismiss={() => {}} />)
    expect(screen.getByRole('button', { name: 'Deshacer' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cerrar' })).toBeInTheDocument()
    const hoja = cssDe('primitives/Toast.module.css')
    expect(hoja).toMatch(/\.action\s*\{[^}]*min-height:\s*var\(--hit-target-min\)/)
    expect(hoja).toMatch(/\.dismiss\s*\{[^}]*(height|min-height):\s*var\(--hit-target-min\)/)
  })
})

// ── tooltip ────────────────────────────────────────────────────────────────
describe('conformance canon · tooltip', () => {
  it('tip-1: aparece con foco de teclado, no solo con hover', () => {
    render(
      <Tooltip content="Ayuda contextual">
        <button>Accion</button>
      </Tooltip>,
    )
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    fireEvent.focus(screen.getByRole('button'))
    expect(screen.getByRole('tooltip')).toHaveTextContent('Ayuda contextual')
    fireEvent.blur(screen.getByRole('button'))
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('tip-2: la burbuja no recibe puntero (pointer-events: none)', () => {
    expect(cssDe('components/Tooltip.module.css')).toMatch(/\.bubble\s*\{[^}]*pointer-events:\s*none/)
  })

  it('tip-3: Escape la cierra sin mover el foco, porque nunca lo tuvo', () => {
    render(
      <Tooltip content="Ayuda">
        <button>Accion</button>
      </Tooltip>,
    )
    const btn = screen.getByRole('button')
    btn.focus()
    fireEvent.focus(btn)
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    expect(document.activeElement).toBe(btn)
  })

  it('tip-4: el texto largo envuelve dentro de un ancho maximo', () => {
    expect(cssDe('components/Tooltip.module.css')).toMatch(/\.bubble\s*\{[^}]*max-width:/)
  })

  it('tip-6: el disparador lleva aria-describedby hacia el globo mientras se ve', () => {
    render(
      <Tooltip content="Explica el boton">
        <button type="button">Accion</button>
      </Tooltip>,
    )
    const boton = screen.getByRole('button', { name: 'Accion' })
    expect(boton).not.toHaveAttribute('aria-describedby')
    fireEvent.focus(boton)
    const globo = screen.getByRole('tooltip')
    expect(boton.getAttribute('aria-describedby')).toBe(globo.id)
    fireEvent.blur(boton)
    expect(boton).not.toHaveAttribute('aria-describedby')
  })
})

// ── stepper ────────────────────────────────────────────────────────────────
describe('conformance canon · stepper', () => {
  const steps = [{ label: 'Datos' }, { label: 'Pago' }, { label: 'Confirmar' }]

  it('stp-1: el paso actual lleva aria-current y el progreso se dice en texto', () => {
    const { container } = render(<Stepper steps={steps} current={1} />)
    const actual = container.querySelector('[aria-current="step"]')
    expect(actual).not.toBeNull()
    expect(actual!.textContent).toContain('Pago')
    expect(container.textContent).toContain('Paso 2 de 3')
  })

  it('stp-3: los pasos no navegables no son botones', () => {
    render(<Stepper steps={steps} current={0} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})

// ── breadcrumb ─────────────────────────────────────────────────────────────
describe('conformance canon · breadcrumb', () => {
  const items = [
    { label: 'Inicio', href: '/' },
    { label: 'Flota', href: '/flota' },
    { label: 'Vehiculo 42', href: '/flota/42' },
  ]

  it('brc-1: es una navegacion con nombre y el ultimo item lleva aria-current y no es enlace', () => {
    render(<Breadcrumb items={items} />)
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument()
    // aunque el consumidor pase href, el sitio actual no es un enlace
    expect(screen.queryByRole('link', { name: 'Vehiculo 42' })).not.toBeInTheDocument()
    const actual = screen.getByText('Vehiculo 42')
    expect(actual.getAttribute('aria-current')).toBe('page')
    expect(screen.getAllByRole('link')).toHaveLength(2)
  })

  it('brc-2: el separador esta oculto al lector', () => {
    const { container } = render(<Breadcrumb items={items} />)
    for (const sep of container.querySelectorAll('li > span:first-child')) {
      if (sep.textContent === 'chevron_right' || sep.textContent === '/') {
        expect(sep.getAttribute('aria-hidden')).toBe('true')
      }
    }
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThanOrEqual(2)
  })

  it('brc-4: cada enlace mide --hit-target-min de alto', () => {
    expect(cssDe('primitives/Breadcrumb.module.css')).toMatch(/\.link\s*\{[^}]*min-height:\s*var\(--hit-target-min\)/)
  })
})

// ── pagination ─────────────────────────────────────────────────────────────
describe('conformance canon · pagination', () => {
  it('pag-1: navegacion con nombre; la pagina actual lleva aria-current y queda inerte', () => {
    const onChange = vi.fn()
    render(<Pagination page={3} pages={9} onChange={onChange} />)
    expect(screen.getByRole('navigation', { name: 'Paginación' })).toBeInTheDocument()
    const actual = screen.getByRole('button', { name: '3' })
    expect(actual.getAttribute('aria-current')).toBe('page')
    expect(actual).toBeDisabled()
  })

  it('pag-2: anterior y siguiente se deshabilitan en los extremos con estado real', () => {
    render(<Pagination page={1} pages={5} />)
    expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Siguiente' })).not.toBeDisabled()
  })

  it('pag-3: cada boton mide --hit-target-min', () => {
    const hoja = cssDe('primitives/Pagination.module.css')
    expect(hoja).toMatch(/min-width:\s*var\(--hit-target-min\)/)
    expect(hoja).toMatch(/min-height:\s*var\(--hit-target-min\)/)
  })

  it('pag-4: la elipsis no es un boton ni entra al orden de tabulacion', () => {
    const { container } = render(<Pagination page={5} pages={20} />)
    const gaps = container.querySelectorAll('[data-ellipsis]')
    expect(gaps.length).toBeGreaterThan(0)
    for (const gap of gaps) {
      expect(gap.tagName).not.toBe('BUTTON')
      expect(gap.getAttribute('aria-hidden')).toBe('true')
    }
    // ningun boton dice '...' o '…'
    for (const b of screen.getAllByRole('button')) {
      expect(b.textContent).not.toMatch(/\.{3}|…/)
    }
  })
})

// ── accordion ──────────────────────────────────────────────────────────────
describe('conformance canon · accordion', () => {
  const items = [
    { id: 'a', title: 'Motor', content: <p>Detalle motor</p> },
    { id: 'b', title: 'Llantas', content: <p>Detalle llantas</p> },
  ]

  it('acc-1: la cabecera es un boton con aria-expanded y aria-controls; el panel la referencia', () => {
    render(<Accordion items={items} defaultOpen="a" />)
    const cabecera = screen.getByRole('button', { name: /Motor/ })
    expect(cabecera.getAttribute('aria-expanded')).toBe('true')
    const panelId = cabecera.getAttribute('aria-controls')!
    const panel = document.getElementById(panelId)!
    expect(panel).toHaveTextContent('Detalle motor')
    expect(panel.getAttribute('aria-labelledby')).toBe(cabecera.id)
    expect(panel.getAttribute('role')).toBe('region')
  })

  it('acc-3: el contenido cerrado no es alcanzable: no esta en el arbol', () => {
    render(<Accordion items={items} defaultOpen="a" />)
    expect(screen.queryByText('Detalle llantas')).not.toBeInTheDocument()
  })

  it('acc-5: sin multiple, abrir una cierra la anterior y ambas lo anuncian por aria-expanded', async () => {
    const user = userEvent.setup()
    render(<Accordion items={items} defaultOpen="a" />)
    await user.click(screen.getByRole('button', { name: /Llantas/ }))
    expect(screen.getByRole('button', { name: /Llantas/ }).getAttribute('aria-expanded')).toBe('true')
    expect(screen.getByRole('button', { name: /Motor/ }).getAttribute('aria-expanded')).toBe('false')
    expect(screen.queryByText('Detalle motor')).not.toBeInTheDocument()
  })

  it('acc-2: la cabecera entera es el objetivo y mide --hit-target-min', () => {
    expect(cssDe('components/Accordion.module.css')).toMatch(/min-height:\s*var\(--hit-target-min\)/)
  })
})

// ── drawer ─────────────────────────────────────────────────────────────────
describe('conformance canon · drawer', () => {
  it('drw-1: el titulo nombra el panel via aria-labelledby', () => {
    render(<Drawer open title="Filtros avanzados" onClose={() => {}}>contenido</Drawer>)
    expect(screen.getByRole('dialog', { name: 'Filtros avanzados' })).toBeInTheDocument()
  })

  it('drw-3: el cuerpo desplaza dentro del panel, no la pagina detras', () => {
    expect(cssDe('components/Drawer.module.css')).toMatch(/\.body\s*\{[^}]*overflow(-y)?:\s*auto/)
  })

  it('drw-4: side no cambia la estructura ni el orden del DOM', () => {
    const estructura = (side: 'left' | 'right') => {
      const { unmount } = render(<Drawer open side={side} title="T" footer={<b>pie</b>}>cuerpo</Drawer>)
      const seq = Array.from(screen.getByRole('dialog').querySelectorAll('*')).map(e => e.tagName)
      unmount()
      return seq.join('>')
    }
    expect(estructura('left')).toBe(estructura('right'))
  })
})

// ── bottom-sheet ───────────────────────────────────────────────────────────
describe('conformance canon · bottom-sheet', () => {
  it('bsh-1: el asa es un boton con nombre accesible y objetivo de --hit-target-min', () => {
    render(<BottomSheet open onClose={() => {}}>hoja</BottomSheet>)
    expect(screen.getByRole('button', { name: 'Cerrar' })).toBeInTheDocument()
    expect(cssDe('components/BottomSheet.module.css')).toMatch(/\.handle\s*\{[^}]*min-height:\s*var\(--hit-target-min\)/)
  })
})

// ── textarea ───────────────────────────────────────────────────────────────
describe('conformance canon · textarea', () => {
  it('txa-1: el contador vive en la zona de pie de la carcasa, no encima del texto', () => {
    const { container } = render(<Textarea maxLength={10} value="hola" onChange={() => {}} />)
    const contador = screen.getByText('4/10')
    // el pie es hermano del contenido, dentro de la carcasa; nunca dentro del area de texto
    expect(contador.parentElement!.previousElementSibling!.querySelector('textarea')).not.toBeNull()
    expect(container.querySelector('[data-control-shell][data-footer]')).not.toBeNull()
  })

  it('txa-3: maxLength recorta de verdad y el contador nunca supera el limite', () => {
    const onChange = vi.fn()
    render(<Textarea maxLength={5} onChange={onChange} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'demasiado largo' } })
    expect(onChange).toHaveBeenCalledWith('demas')
    expect(screen.getByText('5/5')).toBeInTheDocument()
    expect(screen.queryByText(/15\/5/)).not.toBeInTheDocument()
  })
})

// ── timeline ───────────────────────────────────────────────────────────────
describe('conformance canon · timeline', () => {
  const eventos = [
    { title: 'Orden creada', status: 'done' as const },
    { title: 'En revision', status: 'active' as const },
  ]

  it('tml-2: es una lista en orden y la linea que une los puntos esta oculta', () => {
    const { container } = render(
      <IntlProvider locale="es">
        <Timeline items={eventos} mode="events" />
      </IntlProvider>,
    )
    const lista = container.querySelector('ol')!
    expect(lista.querySelectorAll('li')).toHaveLength(2)
    for (const punto of container.querySelectorAll('[class*="Dot"], [class*="dot"]')) {
      expect(punto.getAttribute('aria-hidden')).toBe('true')
    }
  })

  it('tml-5: en mode=events el estado se escribe con palabra propia, no se deduce del color', () => {
    render(
      <IntlProvider locale="es">
        <Timeline items={eventos} mode="events" />
      </IntlProvider>,
    )
    expect(screen.getByText('Completado')).toBeInTheDocument()
    expect(screen.getByText('En curso')).toBeInTheDocument()
  })
})
