import { describe, it, expect } from 'vitest'
import { EONE_ICON_MAP, mapEoneIcon } from '../eoneIconMap'

describe('eoneIconMap', () => {
  it('cubre los 68 nombres del inventario, incluidos los dos inválidos', () => {
    expect(Object.keys(EONE_ICON_MAP)).toHaveLength(68)
    expect(mapEoneIcon('x')).toBe('close')
    expect(mapEoneIcon('navigation')).toBe('navigation')
    expect(mapEoneIcon('arrow-left')).toBe('arrow_back')
  })
  it('cae al nombre original si no hay entrada', () => {
    expect(mapEoneIcon('algo_nuevo')).toBe('algo_nuevo')
  })
})
