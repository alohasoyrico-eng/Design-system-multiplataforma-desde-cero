import { useId, useState, type ReactNode } from 'react'
import css from './Accordion.module.css'

export interface AccordionItem {
  id: string
  title: string
  icon?: string
  meta?: string
  content: ReactNode
}

export interface AccordionProps {
  items?: AccordionItem[]
  defaultOpen?: string
  /** Permite varios paneles abiertos a la vez. Default false (exclusivo). */
  multiple?: boolean
}

export function Accordion({ items = [], defaultOpen, multiple = false }: AccordionProps) {
  const uid = useId()
  const [openIds, setOpenIds] = useState<Set<string>>(
    () => new Set(defaultOpen ? [defaultOpen] : []),
  )

  const toggle = (id: string, isOpen: boolean) => {
    setOpenIds(prev => {
      if (multiple) {
        const next = new Set(prev)
        if (isOpen) next.delete(id)
        else next.add(id)
        return next
      }
      return isOpen ? new Set() : new Set([id])
    })
  }

  return (
    <div className={css.root}>
      {items.map((item) => {
        const isOpen = openIds.has(item.id)
        const headerId = `${uid}-${item.id}-h`
        const panelId = `${uid}-${item.id}-p`
        return (
          <div key={item.id} className={css.item}>
            <button
              id={headerId}
              className={css.trigger}
              onClick={() => toggle(item.id, isOpen)}
              aria-expanded={isOpen}
              aria-controls={panelId}
            >
              {item.icon && <span className={`flow-symbol ${css.triggerIcon}`} aria-hidden="true">{item.icon}</span>}
              <span className={css.triggerTitle}>{item.title}</span>
              {item.meta && <span className={css.triggerMeta}>{item.meta}</span>}
              <span className={`flow-symbol ${css.chevron}`} data-open={isOpen || undefined} aria-hidden="true">
                expand_more
              </span>
            </button>
            {isOpen && (
              <div id={panelId} role="region" aria-labelledby={headerId} className={css.panel}>
                {item.content}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
