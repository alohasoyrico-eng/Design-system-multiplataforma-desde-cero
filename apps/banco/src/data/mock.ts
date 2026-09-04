import type { Unit, Driver } from './types'
import type { NotificationItem } from '@alohasoyrico-eng/flow-react'

export const NOTIFS: NotificationItem[] = [
  { id: 'n1', tone: 'warning', title: 'KTR-882-A: consumo 38% sobre promedio', desc: 'Revisar antes de la siguiente ruta', time: 'hace 2 h', read: false },
  { id: 'n2', tone: 'danger', title: 'Tag de peaje por vencer', desc: 'PLQ-472-D · vence en 5 dias', time: 'hoy', read: false },
  { id: 'n3', tone: 'success', title: 'Servicio completado', desc: 'MVD-101-C salio de taller', time: 'ayer', read: true },
]

export const UNITS: Unit[] = [
  { id: 'u1', plate: 'JMX-214-B', driver: 'Ana Sosa', type: 'Sedan', trips: 12, km: 184, status: 'ruta', fuel: 72 },
  { id: 'u2', plate: 'KTR-882-A', driver: 'Luis Prieto', type: 'Van', trips: 8, km: 96, status: 'taller', fuel: 45 },
  { id: 'u3', plate: 'MVD-101-C', driver: 'Rosa Duarte', type: 'Sedan', trips: 15, km: 221, status: 'ruta', fuel: 88 },
  { id: 'u4', plate: 'PLQ-472-D', driver: 'Marco Gil', type: 'Moto', trips: 21, km: 88, status: 'ruta', fuel: 61 },
  { id: 'u5', plate: 'QRS-330-E', driver: 'Elena Ruz', type: 'Van', trips: 5, km: 64, status: 'inactiva', fuel: 100 },
  { id: 'u6', plate: 'TWN-559-F', driver: 'Pablo Mena', type: 'Sedan', trips: 11, km: 157, status: 'ruta', fuel: 39 },
]

export const DRIVERS: Driver[] = [
  { id: 'd1', name: 'Ana Sosa', rating: 4.96, trips: 1240, unit: 'JMX-214-B', docs: 3, status: 'ruta', since: '2024' },
  { id: 'd2', name: 'Luis Prieto', rating: 4.88, trips: 860, unit: 'KTR-882-A', docs: 4, status: 'taller', since: '2023' },
  { id: 'd3', name: 'Rosa Duarte', rating: 4.99, trips: 2105, unit: 'MVD-101-C', docs: 4, status: 'ruta', since: '2022' },
  { id: 'd4', name: 'Marco Gil', rating: 4.72, trips: 430, unit: 'PLQ-472-D', docs: 2, status: 'ruta', since: '2025' },
  { id: 'd5', name: 'Elena Ruz', rating: 4.91, trips: 1580, unit: 'QRS-330-E', docs: 4, status: 'inactiva', since: '2023' },
  { id: 'd6', name: 'Pablo Mena', rating: 4.85, trips: 920, unit: 'TWN-559-F', docs: 3, status: 'ruta', since: '2024' },
]
