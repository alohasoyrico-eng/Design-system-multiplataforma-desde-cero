import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Unit, Driver } from './types'
import type { NotificationItem } from '@alohasoyrico-eng/flow-react'

export function useUnits() {
  return useQuery<Unit[]>({
    queryKey: ['units'],
    queryFn: () => fetch('/api/units').then((r) => r.json()),
  })
}

export function useDeleteUnit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => fetch(`/api/units/${id}`, { method: 'DELETE' }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['units'] }),
  })
}

export function useDrivers() {
  return useQuery<Driver[]>({
    queryKey: ['drivers'],
    queryFn: () => fetch('/api/drivers').then((r) => r.json()),
  })
}

export function useNotifications() {
  return useQuery<NotificationItem[]>({
    queryKey: ['notifications'],
    queryFn: () => fetch('/api/notifications').then((r) => r.json()),
  })
}
