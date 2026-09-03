import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type FlowMode = 'light' | 'dark' | 'system'

/** El DS entrega el tema con el atributo data-mode, no con un provider de
    contexto de valores (el mecanismo del canon). Este provider existe como
    puente para apps que venían de FlowThemeProvider/useFlowTheme (1.x):
    administra el atributo en <html> y expone modo y cambio. */
interface FlowModeValue {
  mode: FlowMode
  /** El modo efectivo tras resolver 'system'. */
  resolved: 'light' | 'dark'
  setMode: (mode: FlowMode) => void
  toggle: () => void
}

const Ctx = createContext<FlowModeValue | null>(null)

const systemDark = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches

export interface FlowModeProviderProps {
  defaultMode?: FlowMode
  children: ReactNode
}

export function FlowModeProvider({ defaultMode = 'system', children }: FlowModeProviderProps) {
  const [mode, setMode] = useState<FlowMode>(defaultMode)
  const [sysDark, setSysDark] = useState(systemDark)

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (!mq) return
    const onChange = () => setSysDark(mq.matches)
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])

  const resolved: 'light' | 'dark' = mode === 'system' ? (sysDark ? 'dark' : 'light') : mode

  useEffect(() => {
    const el = document.documentElement
    if (resolved === 'dark') el.setAttribute('data-mode', 'dark')
    else el.removeAttribute('data-mode')
  }, [resolved])

  const toggle = useCallback(() => {
    setMode(resolved === 'dark' ? 'light' : 'dark')
  }, [resolved])

  const value = useMemo(() => ({ mode, resolved, setMode, toggle }), [mode, resolved, toggle])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useFlowMode(): FlowModeValue {
  const v = useContext(Ctx)
  if (!v) throw new Error('useFlowMode necesita un FlowModeProvider en el árbol.')
  return v
}
