import type { ReactNode, CSSProperties } from 'react'
import css from './CardMedia.module.css'

export interface CardMediaProps {
  image?: string
  media?: ReactNode
  title?: string
  description?: string
  interactive?: boolean
  onClick?: () => void
  style?: CSSProperties
  children?: ReactNode
}

export function CardMedia({ image, media, title, description, interactive, onClick, style, children }: CardMediaProps) {
  const Tag = interactive ? 'button' : 'div'

  const mediaContent = media ?? (image ? (
    <div className={css.image} style={{ backgroundImage: `url(${image})` }} />
  ) : null)

  return (
    <Tag
      className={css.root}
      data-interactive={interactive || undefined}
      onClick={interactive ? onClick : undefined}
      type={interactive ? 'button' : undefined}
      style={style}
    >
      {mediaContent && <div className={css.media}>{mediaContent}</div>}
      {(title || description || children) && (
        <div className={css.body}>
          {title && <h3 className={css.title}>{title}</h3>}
          {description && <p className={css.description}>{description}</p>}
          {children}
        </div>
      )}
    </Tag>
  )
}
