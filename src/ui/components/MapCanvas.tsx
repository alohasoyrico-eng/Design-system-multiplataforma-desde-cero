import { useRef, useState, useEffect, useCallback, type CSSProperties } from 'react'

export interface MapPin {
  id: string
  lat: number
  lon: number
  label?: string
  color?: string
}

export interface MapCanvasProps {
  center: [number, number]
  zoom?: number
  pins?: MapPin[]
  selectedPin?: string | null
  onPinClick?: (id: string) => void
  route?: [number, number][]
  routeColor?: string
  style?: CSSProperties
}

const TILE = 256

function lon2x(lon: number, z: number) { return ((lon + 180) / 360) * Math.pow(2, z) }
function lat2y(lat: number, z: number) {
  const r = (lat * Math.PI) / 180
  return ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * Math.pow(2, z)
}

export function MapCanvas({ center, zoom: zoomProp = 13, pins = [], selectedPin, onPinClick, route, routeColor, style }: MapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 600, h: 400 })
  const [zoom, setZoom] = useState(zoomProp)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const dragRef = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null)
  const tileCache = useRef<Map<string, HTMLImageElement>>(new Map())

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      setSize({ w: Math.round(width), h: Math.round(height) })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const cx = lon2x(center[1], zoom) * TILE + offset.x
  const cy = lat2y(center[0], zoom) * TILE + offset.y

  const loadTile = useCallback((key: string, src: string): HTMLImageElement | null => {
    const cached = tileCache.current.get(key)
    if (cached?.complete) return cached
    if (cached) return null
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = src
    img.onload = () => { canvasRef.current?.getContext('2d') && draw() }
    tileCache.current.set(key, img)
    return null
  }, [zoom, offset, size])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = size.w * dpr
    canvas.height = size.h * dpr
    ctx.scale(dpr, dpr)

    const originX = size.w / 2 - cx
    const originY = size.h / 2 - cy

    const dark = window.matchMedia('(prefers-color-scheme: dark)').matches
      || document.documentElement.dataset.theme === 'dark'

    const tileCount = Math.pow(2, zoom)
    const startTX = Math.max(0, Math.floor(-originX / TILE))
    const endTX = Math.min(tileCount - 1, Math.floor((-originX + size.w) / TILE))
    const startTY = Math.max(0, Math.floor(-originY / TILE))
    const endTY = Math.min(tileCount - 1, Math.floor((-originY + size.h) / TILE))

    ctx.fillStyle = dark ? '#1a1a2e' : '#e8e8e8'
    ctx.fillRect(0, 0, size.w, size.h)

    for (let tx = startTX; tx <= endTX; tx++) {
      for (let ty = startTY; ty <= endTY; ty++) {
        const key = `${zoom}/${tx}/${ty}`
        const src = `https://tile.openstreetmap.org/${key}.png`
        const img = loadTile(key, src)
        const dx = originX + tx * TILE
        const dy = originY + ty * TILE
        if (img) {
          ctx.drawImage(img, dx, dy, TILE, TILE)
        }
      }
    }

    if (dark) {
      ctx.globalCompositeOperation = 'difference'
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, size.w, size.h)
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = 'rgba(0,80,180,0.12)'
      ctx.fillRect(0, 0, size.w, size.h)
    }

    if (route && route.length >= 2) {
      ctx.beginPath()
      route.forEach(([lat, lon], i) => {
        const px = originX + lon2x(lon, zoom) * TILE
        const py = originY + lat2y(lat, zoom) * TILE
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      })
      ctx.strokeStyle = routeColor || 'var(--status-info, #3b82f6)'
      ctx.lineWidth = 3
      ctx.lineJoin = 'round'
      ctx.stroke()
    }

    pins.forEach(pin => {
      const px = originX + lon2x(pin.lon, zoom) * TILE
      const py = originY + lat2y(pin.lat, zoom) * TILE
      const isSelected = selectedPin === pin.id
      const color = pin.color || (isSelected ? '#ef4444' : '#3b82f6')
      const r = isSelected ? 10 : 7

      ctx.beginPath()
      ctx.arc(px, py, r + 2, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255,255,255,0.9)'
      ctx.fill()
      ctx.beginPath()
      ctx.arc(px, py, r, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()

      if (pin.label) {
        ctx.font = `${isSelected ? 'bold ' : ''}11px system-ui, sans-serif`
        ctx.textAlign = 'center'
        ctx.fillStyle = dark ? '#e0e0e0' : '#1a1a1a'
        ctx.fillText(pin.label, px, py - r - 6)
      }
    })

    ctx.font = '10px system-ui, sans-serif'
    ctx.fillStyle = dark ? 'rgba(200,200,200,0.6)' : 'rgba(0,0,0,0.5)'
    ctx.textAlign = 'right'
    ctx.fillText('© OpenStreetMap contributors', size.w - 6, size.h - 6)
  }, [cx, cy, zoom, size, pins, selectedPin, route, routeColor, loadTile])

  useEffect(() => { draw() }, [draw])

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const next = Math.max(2, Math.min(18, zoom + (e.deltaY < 0 ? 1 : -1)))
    if (next !== zoom) {
      setOffset({ x: 0, y: 0 })
      setZoom(next)
    }
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    dragRef.current = { sx: e.clientX, sy: e.clientY, ox: offset.x, oy: offset.y }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return
    setOffset({
      x: dragRef.current.ox + (e.clientX - dragRef.current.sx),
      y: dragRef.current.oy + (e.clientY - dragRef.current.sy),
    })
  }

  const handlePointerUp = () => { dragRef.current = null }

  const handleClick = (e: React.MouseEvent) => {
    if (!onPinClick || pins.length === 0) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    const originX = size.w / 2 - cx
    const originY = size.h / 2 - cy

    let closest: MapPin | null = null
    let minDist = 20
    for (const pin of pins) {
      const px = originX + lon2x(pin.lon, zoom) * TILE
      const py = originY + lat2y(pin.lat, zoom) * TILE
      const d = Math.hypot(mx - px, my - py)
      if (d < minDist) { minDist = d; closest = pin }
    }
    if (closest) onPinClick(closest.id)
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative', width: '100%', height: 400, overflow: 'hidden',
        borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)',
        cursor: dragRef.current ? 'grabbing' : 'grab',
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={handleClick}
      />
      <div style={{
        position: 'absolute', bottom: 8, left: 8,
        display: 'flex', gap: 2,
      }}>
        <button
          type="button"
          aria-label="Acercar"
          onClick={() => setZoom(z => Math.min(18, z + 1))}
          style={{
            width: 28, height: 28, border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)', background: 'var(--surface-card)',
            cursor: 'pointer', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit',
          }}
        >+</button>
        <button
          type="button"
          aria-label="Alejar"
          onClick={() => setZoom(z => Math.max(2, z - 1))}
          style={{
            width: 28, height: 28, border: '1px solid var(--border-default)',
            borderRadius: '0 var(--radius-sm) var(--radius-sm) 0', background: 'var(--surface-card)',
            cursor: 'pointer', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit',
          }}
        >-</button>
      </div>
    </div>
  )
}
