import { useState } from 'react'
import type { CSSProperties } from 'react'
import css from './Avatar.module.css'

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'
export type AvatarStatus = 'online' | 'busy' | 'offline'

export interface AvatarProps {
  name?: string
  size?: AvatarSize
  status?: AvatarStatus
  src?: string
  style?: CSSProperties
}

const COLORS = [
  'var(--avatar-1)', 'var(--avatar-2)', 'var(--avatar-3)',
  'var(--avatar-4)', 'var(--avatar-5)', 'var(--avatar-6)',
]

const SIZES: Record<AvatarSize, number> = { sm: 28, md: 36, lg: 44, xl: 56 }

const STATUS_COLORS: Record<AvatarStatus, string> = {
  online: 'var(--status-success)',
  busy: 'var(--status-danger)',
  offline: 'var(--avatar-offline)',
}

function hashName(name: string): number {
  let h = 0
  for (let i = 0; i < name.length; i++) h = ((h << 5) - h + name.charCodeAt(i)) | 0
  return Math.abs(h)
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const STATUS_TEXT: Record<string, string> = { online: 'en línea', busy: 'ocupado', offline: 'desconectado' }

export function Avatar({ name = '', size = 'md', status, src, style }: AvatarProps) {
  const [broken, setBroken] = useState(false)
  const dim = SIZES[size]
  const bg = COLORS[hashName(name) % COLORS.length]
  const fs = dim < 32 ? 11 : dim < 48 ? 13 : 18
  const dotSize = dim < 32 ? 8 : 10
  const dotOffset = dim < 32 ? -1 : 0

  return (
    <div
      className={css.root}
      style={{ '--_size': `${dim}px`, ...style } as CSSProperties}
    >
      {src && !broken ? (
        <img src={src} alt={name} className={css.img} onError={() => setBroken(true)} />
      ) : (
        <div
          className={css.initials}
          aria-label={name}
          style={{ '--_bg': bg, '--_fs': `${fs}px` } as CSSProperties}
        >
          {initials(name)}
        </div>
      )}
      {status && <span className={css.srOnly}>{STATUS_TEXT[status] ?? status}</span>}
      {status && (
        <span
          aria-hidden="true"
          className={css.status}
          style={{
            '--_status-color': STATUS_COLORS[status],
            bottom: dotOffset,
            right: dotOffset,
            width: dotSize,
            height: dotSize,
          } as CSSProperties}
        />
      )}
    </div>
  )
}
