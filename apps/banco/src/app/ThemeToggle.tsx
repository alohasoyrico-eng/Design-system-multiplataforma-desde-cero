import { useState } from 'react'
import { IconButton } from '@alohasoyrico-eng/flow-react'

function getInitialMode(): boolean {
  return document.documentElement.getAttribute('data-mode') === 'dark'
}

export function ThemeToggle() {
  const [dark, setDark] = useState(getInitialMode)
  const toggle = () => {
    const next = !dark
    setDark(next)
    const mode = next ? 'dark' : 'light'
    document.documentElement.setAttribute('data-mode', mode)
    localStorage.setItem('flow-theme', mode)
  }
  return <IconButton icon={dark ? 'light_mode' : 'dark_mode'} ariaLabel="Cambiar modo" onClick={toggle} />
}
