import type { ReactNode, CSSProperties, MouseEventHandler } from 'react'
import css from './Card.module.css'

export type CardPadding = 'none' | 'sm' | 'md' | 'lg'

export interface CardProps {
  /** Escala primero ('none'/'sm'/'md'/'lg'; md = --pad-card, sensible a
      densidad). Un valor libre es puente de migración, no destino. */
  padding?: CardPadding | string | number
  surface?: 'elevated' | 'outlined' | 'inverse'
  hover?: 'lift' | 'fill' | 'none'
  interactive?: boolean
  /** Franja de estado en el borde de ataque (--status-*). Es refuerzo:
      el estado se dice también en el contenido (crd-6). */
  status?: 'success' | 'warning' | 'danger' | 'info'
  /** Seleccionada (tarjetas-lista): borde fuerte + superficie tenue,
      legible sin color (crd-3). */
  selected?: boolean
  children: ReactNode
  onClick?: MouseEventHandler<HTMLDivElement>
  style?: CSSProperties
}

const ESCALA: ReadonlySet<string> = new Set(['none', 'sm', 'md', 'lg'])

export function Card({ padding, surface = 'elevated', hover, interactive, status, selected, children, onClick, style }: CardProps) {
  const effectiveHover = hover ?? (interactive ? 'lift' : 'none')
  const enEscala = typeof padding === 'string' && ESCALA.has(padding)
  // crd-1: una tarjeta que se clickea es un elemento operable con foco y
  // teclado, no un div con onClick.
  const operable = interactive || Boolean(onClick)
  return (
    <div
      className={css.root}
      data-surface={surface}
      data-hover={effectiveHover !== 'none' ? effectiveHover : undefined}
      data-interactive={interactive || undefined}
      data-padding={enEscala ? (padding as CardPadding) : undefined}
      data-status={status}
      data-selected={selected || undefined}
      aria-pressed={operable && selected !== undefined ? selected : undefined}
      role={operable ? 'button' : undefined}
      tabIndex={operable ? 0 : undefined}
      onKeyDown={operable ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(e as never) } } : undefined}
      onClick={onClick}
      style={{
        ...(padding != null && !enEscala ? { padding } : {}),
        ...style,
      }}
    >
      {children}
    </div>
  )
}
