import { useState, useEffect, createContext, useContext, type ReactNode } from 'react'
import { Link, Outlet, useMatchRoute } from '@tanstack/react-router'
import { Toast, ToastStack } from '../ui/components/Toast'
import { Avatar } from '../ui/primitives/Avatar'
import { Select } from '../ui/primitives/Select'
import { EmptyState } from '../ui/components/EmptyState'
import { ThemeToggle } from '../components/ThemeToggle'
import { ROLES, NAV, type RoleId } from '../pages/internal-tools/data'
import css from './InternalToolsLayout.module.css'

const RoleContext = createContext<{ role: RoleId; setRole: (r: RoleId) => void }>({
  role: 'admin' as RoleId,
  setRole: () => {},
})

export function useRole() {
  return useContext(RoleContext)
}

const ITToastContext = createContext<(msg: string) => void>(() => {})
export function useITToast() {
  return useContext(ITToastContext)
}

export function InternalToolsLayout() {
  const [role, setRoleState] = useState<RoleId>('admin')
  const [toast, setToast] = useState<string | null>(null)
  const matchRoute = useMatchRoute()

  useEffect(() => {
    const saved = localStorage.getItem('flow-it-role')
    if (saved && ROLES.some(r => r.value === saved)) {
      setRoleState(saved as RoleId)
    }
  }, [])

  const setRole = (r: RoleId) => {
    setRoleState(r)
    localStorage.setItem('flow-it-role', r)
  }

  const notify = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const visibleNav = NAV.filter(n => (n.roles as readonly string[]).includes(role))
  const roleLabel = ROLES.find(r => r.value === role)?.label ?? 'Admin'

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      <ITToastContext.Provider value={notify}>
        <div className={css.shell}>
          <nav aria-label="Internal Tools" className={css.sidebar}>
            <Link to="/" className={css.logo}>
              <img src="/assets/flow-logo.svg" alt="Flow" className={css.logoImg} />
            </Link>
            <div className={css.brand}>INTERNAL TOOLS</div>

            <div className={css.roleSection}>
              <div className={css.roleLabel}>VIENDO COMO</div>
              <Select
                value={role}
                onChange={(v) => setRole(v as RoleId)}
                options={ROLES.map(r => ({ value: r.value, label: r.label }))}
              />
            </div>

            {visibleNav.map(n => {
              const active = !!matchRoute({ to: n.path })
              return (
                <Link
                  key={n.id}
                  to={n.path}
                  className={css.navItem}
                  data-active={active || undefined}
                >
                  <span
                    className={'flow-icon' + (active ? ' flow-icon--fill' : '')}
                    aria-hidden="true"
                    style={{ fontSize: 20 }}
                  >
                    {n.icon}
                  </span>
                  {n.label}
                </Link>
              )
            })}

            <div className={css.sidebarFooter}>
              <Avatar name={roleLabel} size="sm" status="online" />
              <div className={css.userName}>{roleLabel}</div>
              <ThemeToggle />
            </div>
          </nav>

          <main className={css.main}>
            <Outlet />
          </main>

          {toast && (
            <ToastStack>
              <Toast tone="success" message={toast} onDismiss={() => setToast(null)} />
            </ToastStack>
          )}
        </div>
      </ITToastContext.Provider>
    </RoleContext.Provider>
  )
}

export function Guard({ allowed, children }: { allowed: string[]; children: ReactNode }) {
  const { role } = useRole()
  if (allowed.includes(role)) return <>{children}</>
  const roleLabel = ROLES.find(r => r.value === role)?.label ?? role
  return (
    <EmptyState
      icon="lock"
      title="Sin permiso para esta sección"
      description={`Tu rol actual ("${roleLabel}") no tiene acceso a este módulo. Cambia de rol en la barra lateral para explorarlo.`}
    />
  )
}
