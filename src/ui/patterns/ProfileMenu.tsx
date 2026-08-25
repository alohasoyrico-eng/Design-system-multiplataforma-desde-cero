import type { CSSProperties, ReactNode } from 'react'
import css from './ProfileMenu.module.css'
import { Avatar } from '../primitives/Avatar'
import { Badge } from '../primitives/Badge'

export interface ProfileMenuItem {
  icon: string
  label: string
  onClick?: () => void
}

export interface ProfileMenuProps {
  name: string
  avatarName: string
  role: string
  badge?: ReactNode
  items: ProfileMenuItem[]
  style?: CSSProperties
}

export function ProfileMenu({ name, avatarName, role, badge, items, style }: ProfileMenuProps) {
  return (
    <div className={css.root} style={style}>
      <div className={css.header}>
        <Avatar name={avatarName} size="lg" status="online" />
        <span className={css.name}>{name}</span>
        <span className={css.role}>{role}</span>
        {badge}
      </div>
      <div className={css.items}>
        {items.map(item => (
          <button key={item.label} type="button" className={css.item} onClick={item.onClick}>
            <span className={`flow-icon ${css.itemIcon}`} aria-hidden="true">{item.icon}</span>
            <span className={css.itemLabel}>{item.label}</span>
            <span className={`flow-icon ${css.itemChevron}`} aria-hidden="true">chevron_right</span>
          </button>
        ))}
      </div>
    </div>
  )
}
