import { useState } from 'react'
import { IconButton } from '../ui/primitives/IconButton'

export function ThemeToggle() {
  const [dark, setDark] = useState(false)
  const toggle = () => {
    const next = !dark
    setDark(next)
    document.documentElement.setAttribute('data-mode', next ? 'dark' : 'light')
  }
  return <IconButton icon={dark ? 'light_mode' : 'dark_mode'} ariaLabel="Cambiar modo" onClick={toggle} />
}
