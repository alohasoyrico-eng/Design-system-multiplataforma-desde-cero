import { createContext, useContext } from 'react'

const NotifyContext = createContext<(msg: string) => void>(() => {})

export const NotifyProvider = NotifyContext.Provider

export function useNotify() {
  return useContext(NotifyContext)
}
