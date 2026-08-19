export interface Unit {
  [key: string]: unknown
  id: string
  plate: string
  driver: string
  type: string
  trips: number
  km: number
  status: string
  fuel: number
}

export interface Driver {
  [key: string]: unknown
  id: string
  name: string
  rating: number
  trips: number
  unit: string
  docs: number
  status: string
  since: string
}
