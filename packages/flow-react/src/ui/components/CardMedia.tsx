import type { ReactNode, CSSProperties } from 'react'
import { Card } from './Card'
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
  const mediaContent = media ?? (image ? (
    <div className={css.image} style={{ backgroundImage: `url(${image})` }} />
  ) : null)

  /* La SUPERFICIE es del Card — una sola tarjeta en el sistema. Esta pieza
     dibujaba la suya propia con el híbrido borde+sombra que no existe en el
     vocabulario del Card (el mismo que se retiró de StatTile en 0.6.8).
     El comportamiento operable (foco, teclado, rol) también es del Card
     (crd-1); aquí quedan medios, cuerpo y el recorte de esquinas. */
  return (
    <Card
      padding="none"
      interactive={interactive}
      onClick={interactive ? onClick : undefined}
      style={style}
    >
      <div className={css.root}>
        {mediaContent && <div className={css.media}>{mediaContent}</div>}
        {(title || description || children) && (
          <div className={css.body}>
            {title && <h3 className={css.title}>{title}</h3>}
            {description && <p className={css.description}>{description}</p>}
            {children}
          </div>
        )}
      </div>
    </Card>
  )
}
