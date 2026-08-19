import { useState } from 'react'
import { Outlet } from '@tanstack/react-router'
import { Toast, ToastStack } from '../ui/components/Toast'
import { FleetSidebar } from './FleetSidebar'
import { NotifyProvider } from '../components/NotifyContext'
import css from '../App.module.css'

export function AppLayout() {
  const [toast, setToast] = useState<string | null>(null)

  const notify = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 4000)
  }

  return (
    <NotifyProvider value={notify}>
      <div className={css.app}>
        <FleetSidebar />
        <main className={css.main}>
          <Outlet />
        </main>
        {toast && (
          <ToastStack>
            <Toast tone="success" message={toast} onDismiss={() => setToast(null)} />
          </ToastStack>
        )}
      </div>
    </NotifyProvider>
  )
}
