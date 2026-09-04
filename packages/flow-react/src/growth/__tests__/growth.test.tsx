import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { FlowGrowthProvider, useTrack, useExperiment } from '../context'
import type { GrowthAdapter, EventDictionary } from '../types'
import dictionary from '../events.json'

const dict = dictionary as EventDictionary

function wrapperWith(adapter: GrowthAdapter) {
  return ({ children }: { children: ReactNode }) => (
    <FlowGrowthProvider adapter={adapter}>{children}</FlowGrowthProvider>
  )
}

describe('Growth — tracking', () => {
  it('sin provider no truena: adapter default es no-op', () => {
    const { result } = renderHook(() => useTrack())
    expect(() => result.current('auth_completed', { method: 'otp' })).not.toThrow()
  })

  it('con provider, track llega al adapter con evento y props', () => {
    const track = vi.fn()
    const { result } = renderHook(() => useTrack(), { wrapper: wrapperWith({ track }) })
    result.current('auth_completed', { method: 'otp' })
    expect(track).toHaveBeenCalledWith('auth_completed', { method: 'otp' })
  })

  it('un evento fuera del diccionario avisa en dev', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { result } = renderHook(() => useTrack(), { wrapper: wrapperWith({ track: vi.fn() }) })
    result.current('evento_inventado')
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('evento_inventado'))
    warn.mockRestore()
  })

  it('un evento proposed (no aprobado) avisa en dev', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { result } = renderHook(() => useTrack(), { wrapper: wrapperWith({ track: vi.fn() }) })
    result.current('search_performed', { query_length: 3, results_count: 7 })
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('proposed'))
    warn.mockRestore()
  })
})

describe('Growth — captura declarativa (data-growth-event)', () => {
  it('un click que burbujea hasta el nodo anotado se trackea con sus props', async () => {
    const { render } = await import('@testing-library/react')
    const { default: userEvent } = await import('@testing-library/user-event')
    const track = vi.fn()
    render(
      <FlowGrowthProvider adapter={{ track }}>
        <div data-growth-event="unit_added" data-growth-source="manual">
          <button>Agregar unidad</button>
        </div>
      </FlowGrowthProvider>,
    )
    await userEvent.click(document.querySelector('button')!)
    expect(track).toHaveBeenCalledWith('unit_added', { source: 'manual' })
  })

  it('data-growth-* camelCase se vuelve prop snake_case', async () => {
    const { render } = await import('@testing-library/react')
    const { default: userEvent } = await import('@testing-library/user-event')
    const track = vi.fn()
    render(
      <FlowGrowthProvider adapter={{ track }}>
        <button data-growth-event="report_exported" data-growth-range-days="30">Exportar</button>
      </FlowGrowthProvider>,
    )
    await userEvent.click(document.querySelector('button')!)
    expect(track).toHaveBeenCalledWith('report_exported', { range_days: '30' })
  })

  it('clicks sin anotación no trackean nada', async () => {
    const { render } = await import('@testing-library/react')
    const { default: userEvent } = await import('@testing-library/user-event')
    const track = vi.fn()
    render(
      <FlowGrowthProvider adapter={{ track }}>
        <button>Sin medir</button>
      </FlowGrowthProvider>,
    )
    await userEvent.click(document.querySelector('button')!)
    expect(track).not.toHaveBeenCalled()
  })

  it('al desmontar el provider, el listener se limpia', async () => {
    const { render } = await import('@testing-library/react')
    const { default: userEvent } = await import('@testing-library/user-event')
    const track = vi.fn()
    const { unmount } = render(
      <FlowGrowthProvider adapter={{ track }}>
        <span />
      </FlowGrowthProvider>,
    )
    unmount()
    document.body.innerHTML = '<button data-growth-event="unit_added">x</button>'
    await userEvent.click(document.querySelector('button')!)
    expect(track).not.toHaveBeenCalled()
    document.body.innerHTML = ''
  })
})

describe('Growth — experimentos', () => {
  it('sin soporte de experimentos devuelve el fallback y no reporta', () => {
    const track = vi.fn()
    const { result } = renderHook(() => useExperiment('nuevo_hero', 'control'), {
      wrapper: wrapperWith({ track }),
    })
    expect(result.current).toBe('control')
    expect(track).not.toHaveBeenCalled()
  })

  it('con variante asignada la devuelve y reporta la exposición', () => {
    const track = vi.fn()
    const adapter: GrowthAdapter = { track, variant: () => 'b' }
    const { result } = renderHook(() => useExperiment('nuevo_hero', 'control'), {
      wrapper: wrapperWith(adapter),
    })
    expect(result.current).toBe('b')
    expect(track).toHaveBeenCalledWith('experiment_exposed', {
      experiment: 'nuevo_hero',
      variant: 'b',
    })
  })
})

describe('Growth — governance del diccionario', () => {
  const SNAKE = /^[a-z][a-z0-9]*(_[a-z0-9]+)+$/

  it('research es el dueño del diccionario', () => {
    expect(dict.owner).toBe('research')
  })

  it('todo evento nombra objeto_accion en snake_case', () => {
    for (const name of Object.keys(dict.events)) {
      expect(name, `"${name}" no es snake_case objeto_accion`).toMatch(SNAKE)
    }
  })

  it('todo evento tiene descripción, status válido y superficie', () => {
    for (const [name, def] of Object.entries(dict.events)) {
      expect(def.description.length, `${name} sin descripción`).toBeGreaterThan(10)
      expect(['proposed', 'approved', 'deprecated'], `${name} status inválido`).toContain(def.status)
      expect(def.surfaces.length, `${name} sin superficie`).toBeGreaterThan(0)
    }
  })

  it('las props de eventos también son snake_case', () => {
    for (const [name, def] of Object.entries(dict.events)) {
      for (const prop of def.props) {
        expect(prop, `${name}.${prop}`).toMatch(/^[a-z][a-z0-9_]*$/)
      }
    }
  })

  it('experiment_exposed (el evento del propio foundation) está aprobado', () => {
    expect(dict.events.experiment_exposed?.status).toBe('approved')
  })
})
