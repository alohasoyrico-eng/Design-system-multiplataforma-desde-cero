import { http, HttpResponse, delay } from 'msw'
import { UNITS, DRIVERS, NOTIFS } from '../data/mock'

export const handlers = [
  http.get('/api/units', async () => {
    await delay(300)
    return HttpResponse.json(UNITS)
  }),

  http.delete('/api/units/:id', async ({ params }) => {
    await delay(200)
    const idx = UNITS.findIndex((u) => u.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    UNITS.splice(idx, 1)
    return HttpResponse.json({ ok: true })
  }),

  http.get('/api/drivers', async () => {
    await delay(300)
    return HttpResponse.json(DRIVERS)
  }),

  http.get('/api/notifications', async () => {
    await delay(200)
    return HttpResponse.json(NOTIFS)
  }),
]
