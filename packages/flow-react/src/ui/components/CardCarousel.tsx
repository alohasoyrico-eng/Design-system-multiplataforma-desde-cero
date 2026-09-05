import { Children, useState, useRef, useEffect, useCallback, type ReactNode, type CSSProperties } from 'react'
import { useT } from '../../i18n/useSafeIntl'
import css from './CardCarousel.module.css'

export interface CardCarouselProps {
  children: ReactNode[]
  activeIndex?: number
  onChange?: (index: number) => void
  style?: CSSProperties
}

export function CardCarousel({ children, activeIndex, onChange, style }: CardCarouselProps) {
  const t = useT()
  const items = Children.toArray(children)
  const [internal, setInternal] = useState(0)
  const idx = activeIndex ?? internal
  const trackRef = useRef<HTMLDivElement>(null)
  const scrolling = useRef(false)

  const goTo = useCallback((i: number) => {
    setInternal(i)
    onChange?.(i)
  }, [onChange])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const child = el.children[idx] as HTMLElement | undefined
    if (!child) return
    scrolling.current = true
    const targetLeft = child.offsetLeft - (el.clientWidth - child.offsetWidth) / 2
    el.scrollTo?.({ left: targetLeft, behavior: 'smooth' })
    const timer = setTimeout(() => { scrolling.current = false }, 350)
    return () => clearTimeout(timer)
  }, [idx])

  const handleScroll = useCallback(() => {
    if (scrolling.current) return
    const el = trackRef.current
    if (!el) return
    const center = el.scrollLeft + el.clientWidth / 2
    let closest = 0
    let minDist = Infinity
    for (let i = 0; i < el.children.length; i++) {
      const child = el.children[i] as HTMLElement
      const childCenter = child.offsetLeft + child.offsetWidth / 2
      const dist = Math.abs(center - childCenter)
      if (dist < minDist) { minDist = dist; closest = i }
    }
    if (closest !== idx) goTo(closest)
  }, [idx, goTo])

  return (
    <div className={css.root} style={style}>
      <div
        ref={trackRef}
        className={css.track}
        onScroll={handleScroll}
      >
        {items.map((child, i) => (
          <div key={i} className={css.slide} data-active={i === idx || undefined}>
            {child}
          </div>
        ))}
      </div>
      {items.length > 1 && (
        <div className={css.dots} role="tablist">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              className={css.dot}
              data-active={i === idx || undefined}
              role="tab"
              aria-selected={i === idx}
              aria-label={t('carousel.card', 'Tarjeta {n}').replace('{n}', String(i + 1))}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
