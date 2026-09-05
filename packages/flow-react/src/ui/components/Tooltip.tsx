import { useState, useRef, useEffect, useCallback, useId, isValidElement, cloneElement, type ReactNode, type ReactElement, type CSSProperties } from 'react'
import css from './Tooltip.module.css'

export interface TooltipProps {
  content: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  children: ReactNode
  style?: CSSProperties
}

export function Tooltip({ content, position = 'top', children, style }: TooltipProps) {
  const [show, setShow] = useState(false)
  const tipId = useId()
  const anchorRef = useRef<HTMLSpanElement>(null)
  const bubbleRef = useRef<HTMLSpanElement>(null)
  const [coords, setCoords] = useState({ top: 0, left: 0 })

  const updatePosition = useCallback(() => {
    const anchor = anchorRef.current
    if (!anchor) return
    const rect = anchor.getBoundingClientRect()
    const offset = 8

    let top = 0
    let left = 0

    switch (position) {
      case 'bottom':
        top = rect.bottom + offset
        left = rect.left + rect.width / 2
        break
      case 'left':
        top = rect.top + rect.height / 2
        left = rect.left - offset
        break
      case 'right':
        top = rect.top + rect.height / 2
        left = rect.right + offset
        break
      default:
        top = rect.top - offset
        left = rect.left + rect.width / 2
    }

    setCoords({ top, left })
  }, [position])

  useEffect(() => {
    if (!show) return
    updatePosition()
  }, [show, updatePosition])

  useEffect(() => {
    if (!show) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShow(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [show])

  const getTransform = () => {
    switch (position) {
      case 'bottom': return 'translateX(-50%)'
      case 'left': return 'translateX(-100%) translateY(-50%)'
      case 'right': return 'translateY(-50%)'
      default: return 'translateX(-50%) translateY(-100%)'
    }
  }

  return (
    <span
      ref={anchorRef}
      className={css.wrapper}
      style={style}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {/* tip-6: el disparador queda descrito mientras el globo está visible */}
      {isValidElement(children)
        ? cloneElement(children as ReactElement<{ 'aria-describedby'?: string }>, {
            'aria-describedby': show ? tipId : undefined,
          })
        : children}
      {show && (
        <span
          ref={bubbleRef}
          id={tipId}
          role="tooltip"
          className={css.bubble}
          style={{
            top: coords.top,
            left: coords.left,
            transform: getTransform(),
          }}
        >
          {content}
        </span>
      )}
    </span>
  )
}
