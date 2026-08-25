import { useState, useCallback, type CSSProperties } from 'react'
import css from './NipReveal.module.css'
import { Button } from '../primitives/Button'

export interface NipRevealProps {
  digits: string
  blurLast?: boolean
  duration?: number
  warning?: string
  style?: CSSProperties
}

export function NipReveal({ digits, blurLast = true, duration = 5000, warning, style }: NipRevealProps) {
  const [visible, setVisible] = useState(false)

  const handleShow = useCallback(() => {
    setVisible(true)
    setTimeout(() => setVisible(false), duration)
  }, [duration])

  if (!visible) {
    return (
      <div className={css.root} style={style}>
        {warning && <span className={css.warning}>{warning}</span>}
        <Button variant="accent" onClick={handleShow}>Mostrar NIP</Button>
      </div>
    )
  }

  const chars = digits.split('')
  const lastIdx = chars.length - 1

  return (
    <div className={css.root} style={style}>
      <span className={css.value}>
        {chars.map((ch, i) =>
          blurLast && i === lastIdx
            ? <span key={i} className={css.blur}>{ch}</span>
            : <span key={i}>{ch}</span>
        )}
      </span>
      <span className={css.hint}>Se ocultará automáticamente</span>
    </div>
  )
}
