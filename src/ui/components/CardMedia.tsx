import { useState, type CSSProperties } from 'react'

export interface CardMediaProps {
  image?: string
  title?: string
  description?: string
  interactive?: boolean
  onClick?: () => void
  style?: CSSProperties
}

export function CardMedia({ image, title, description, interactive = false, onClick, style }: CardMediaProps) {
  const [hover, setHover] = useState(false)
  const lift = interactive && hover
  const Tag = interactive ? 'button' : 'div'

  return (
    <Tag
      onClick={interactive ? onClick : undefined}
      type={interactive ? 'button' : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'block', width: interactive ? '100%' : undefined, textAlign: 'left' as const, boxSizing: 'border-box' as const,
        overflow: 'hidden', borderRadius: 'var(--radius-lg)',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        cursor: interactive ? 'pointer' : 'default',
        boxShadow: lift ? 'var(--shadow-float)' : 'var(--shadow-rest)',
        transform: lift ? 'var(--lift-hover)' : 'none',
        transition: 'transform var(--dur-fast) var(--ease-spring), box-shadow var(--dur-fast) var(--ease-out)',
        outline: 'none',
        ...style,
      }}
    >
      {image && (
        <div style={{
          width: '100%', height: 200, background: `url(${image})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
      )}
      <div style={{ padding: 'var(--pad-card)' }}>
        {title && <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h3>}
        {description && (
          <p style={{ margin: title ? '8px 0 0 0' : 0, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
            {description}
          </p>
        )}
      </div>
    </Tag>
  )
}
