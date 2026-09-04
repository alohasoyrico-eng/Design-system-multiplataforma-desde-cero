import { useRef, useEffect, type ReactNode, type CSSProperties } from 'react'
import { ChatMessage } from '../primitives/ChatMessage'
import { EmptyState } from '../primitives/EmptyState'
import css from './ChatThread.module.css'

interface ToolChip {
  label: string
  icon?: string
  status?: 'running' | 'done'
}

export interface ChatMsg {
  id: string
  role: 'user' | 'agent'
  text?: string
  tool?: ToolChip
  streaming?: boolean
  content?: ReactNode
  timestamp?: string
}

export interface ChatThreadProps {
  messages: ChatMsg[]
  emptyState?: ReactNode
  style?: CSSProperties
}

export function ChatThread({ messages = [], emptyState, style }: ChatThreadProps) {
  const ref = useRef<HTMLDivElement>(null)
  const userScrolledUp = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => {
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40
      userScrolledUp.current = !atBottom
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (ref.current && !userScrolledUp.current) {
      ref.current.scrollTop = ref.current.scrollHeight
    }
  }, [messages.length, messages[messages.length - 1]?.text])

  // cth-3: con la lista vacia muestra su estado vacio, no un hueco.
  if (messages.length === 0) {
    return <>{emptyState ?? <EmptyState icon="forum" title="Sin mensajes" description="Escribe abajo para empezar." />}</>
  }

  return (
    <div ref={ref} className={css.root} style={style} aria-live="polite" aria-relevant="additions">
      {messages.map(m => (
        <ChatMessage
          key={m.id}
          role={m.role}
          text={m.text}
          tool={m.tool}
          streaming={m.streaming}
          timestamp={m.timestamp}
        >
          {m.content}
        </ChatMessage>
      ))}
    </div>
  )
}
