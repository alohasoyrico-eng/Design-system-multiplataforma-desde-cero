import { createContext, useContext } from 'react'

/* Wiring interno del patterns layer: el shell (quien monte el sidebar)
   provee el toggle; PageHeader lo consume para el botón hamburguesa. */
const SidebarContext = createContext<(() => void) | null>(null)

export const SidebarProvider = SidebarContext.Provider

export function useSidebarToggle() {
  return useContext(SidebarContext)
}
