import { useRef, type CSSProperties, type ReactNode } from 'react'
import { useIntl } from 'react-intl'
import css from './OnboardingCarousel.module.css'

const PALETTE = [1, 2, 3, 4, 5, 6].map((i) => `var(--illustration-${i})`)

function DefaultIllustration({ icon, index }: { icon?: string; index: number }) {
  const color = PALETTE[index % PALETTE.length]
  return (
    <div className={css.illustration} style={{ background: `${color}1A` }}>
      <div className={css.illustrationInner} style={{ background: color, boxShadow: `0 12px 28px ${color}40` }}>
        <span className={`flow-symbol flow-symbol--fill ${css.heroIcon}`} aria-hidden="true">
          {icon || 'auto_awesome'}
        </span>
      </div>
    </div>
  )
}

export interface OnboardingSlide {
  title: string
  description?: string
  illustration?: ReactNode
  icon?: string
}

export interface OnboardingCarouselProps {
  slides: OnboardingSlide[]
  index?: number
  onIndexChange?: (index: number) => void
  onSkip?: () => void
  onDone?: () => void
  skipLabel?: string
  doneLabel?: string
  style?: CSSProperties
}

export function OnboardingCarousel({
  slides = [], index = 0, onIndexChange, onSkip, onDone,
  skipLabel, doneLabel, style,
}: OnboardingCarouselProps) {
  const intl = useIntl()
  const resolvedSkipLabel = skipLabel ?? intl.formatMessage({ id: 'onboarding.skip', defaultMessage: 'Omitir' })
  const resolvedDoneLabel = doneLabel ?? intl.formatMessage({ id: 'onboarding.done', defaultMessage: 'Empezar' })
  const continueLabel = intl.formatMessage({ id: 'common.continue', defaultMessage: 'Continuar' })
  const touch = useRef<number | null>(null)
  const go = (i: number) => onIndexChange?.(Math.max(0, Math.min(slides.length - 1, i)))
  const last = index === slides.length - 1
  const slide = slides[index] || {}

  return (
    <div
      className={css.root}
      style={style}
      onTouchStart={(e) => { touch.current = e.touches[0].clientX }}
      onTouchEnd={(e) => {
        if (touch.current == null) return
        const dx = e.changedTouches[0].clientX - touch.current
        if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1))
        touch.current = null
      }}
    >
      {onSkip && !last && (
        <div className={css.skip}>
          <button type="button" className={css.skipBtn} onClick={onSkip}>
            {resolvedSkipLabel}
          </button>
        </div>
      )}
      <div className={css.slideArea}>
        {slide.illustration || <DefaultIllustration icon={slide.icon} index={index} />}
        <div className={css.slideText}>
          <div className={css.slideTitle}>{slide.title}</div>
          {slide.description && (
            <div className={css.slideDesc}>{slide.description}</div>
          )}
        </div>
      </div>
      <div className={css.bottom}>
        <div className={css.dots}>
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              className={css.dot}
              data-active={i === index || undefined}
              aria-label={`Ir a diapositiva ${i + 1}`}
              onClick={() => go(i)}
            />
          ))}
        </div>
        <button
          type="button"
          className={css.continueBtn}
          onClick={() => last ? onDone?.() : go(index + 1)}
        >
          {last ? resolvedDoneLabel : continueLabel}
        </button>
      </div>
    </div>
  )
}
