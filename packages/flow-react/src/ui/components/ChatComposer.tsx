import { useRef, useEffect, type CSSProperties } from 'react'
import { useIntl } from 'react-intl'
import css from './ChatComposer.module.css'

export interface ChatComposerProps {
  value?: string
  onChange?: (value: string) => void
  onSend?: (value: string) => void
  placeholder?: string
  suggestions?: string[]
  disabled?: boolean
  style?: CSSProperties
}

export function ChatComposer({
  value = '',
  onChange,
  onSend,
  placeholder,
  suggestions = [],
  disabled = false,
  style,
}: ChatComposerProps) {
  const intl = useIntl()
  const resolvedPlaceholder = placeholder ?? intl.formatMessage({ id: 'chat.placeholder', defaultMessage: 'Pregunta sobre tu flota…' })
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!ref.current) return
    ref.current.style.height = 'auto'
    ref.current.style.height = Math.min(120, ref.current.scrollHeight) + 'px'
  }, [value])

  const send = () => {
    if (value.trim() && !disabled) onSend?.(value.trim())
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const canSend = !!value.trim() && !disabled

  return (
    <div className={css.root} style={style}>
      {/* ccm-3: las sugerencias desaparecen al escribir. */}
      {suggestions.length > 0 && !value && (
        <div className={css.suggestions}>
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              className={css.suggestion}
              onClick={() => onSend?.(s)}
              disabled={disabled}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className={css.inputRow}>
        <textarea
          ref={ref}
          className={css.textarea}
          value={value}
          disabled={disabled}
          rows={1}
          placeholder={resolvedPlaceholder}
          aria-label={resolvedPlaceholder}
          aria-disabled={disabled}
          onChange={e => onChange?.(e.target.value)}
          onKeyDown={onKey}
        />
        <button
          type="button"
          className={css.sendBtn}
          aria-label={intl.formatMessage({ id: 'chat.send', defaultMessage: 'Enviar' })}
          disabled={!canSend}
          data-active={canSend ? '' : undefined}
          onClick={send}
        >
          <span className="flow-symbol flow-symbol--default" aria-hidden="true">arrow_upward</span>
        </button>
      </div>
    </div>
  )
}
