import { useRef, useState, useEffect, useCallback, type CSSProperties } from 'react'
import css from './MapCanvas.module.css'

export interface MapPin {
  id: string
  lat: number
  lon: number
  label?: string
  subtitle?: string
  color?: string
  icon?: string
}

export interface MapCanvasProps {
  center: [number, number]
  zoom?: number
  pins?: MapPin[]
  selectedPin?: string | null
  onPinClick?: (id: string) => void
  route?: [number, number][]
  routeColor?: string
  /** El fondo es lienzo: en mono (default) los tiles van en escala de grises y
      el color queda reservado a pins y ruta — el matiz es del dato, no del mapa. */
  tone?: 'mono' | 'color'
  style?: CSSProperties
}

const TILE = 256

function lon2x(lon: number, z: number) { return ((lon + 180) / 360) * Math.pow(2, z) }
function lat2y(lat: number, z: number) {
  const r = (lat * Math.PI) / 180
  return ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * Math.pow(2, z)
}

function getTokenValue(token: string, fallback: string): string {
  if (typeof document === 'undefined') return fallback
  const v = getComputedStyle(document.documentElement).getPropertyValue(token).trim()
  return v || fallback
}

function resolveColor(c: string): string {
  return /^var\(/.test(c) ? getTokenValue(c.slice(4, -1), c) : c
}

/* ── Pin animation ─────────────────────────────────────── */

interface PinAnim {
  scale: number
  shadowBlur: number
  shadowY: number
  glowAlpha: number
}

const ANIM_REST:   PinAnim = { scale: 1.0,  shadowBlur: 4,  shadowY: 1,  glowAlpha: 0 }
const ANIM_HOVER:  PinAnim = { scale: 1.08, shadowBlur: 14, shadowY: 4,  glowAlpha: 0.12 }
const ANIM_SELECT: PinAnim = { scale: 1.18, shadowBlur: 22, shadowY: 6,  glowAlpha: 0.25 }

const BASE_RADIUS = 24
const ICON_BASE = 20
const HIT_RADIUS = 28
const BORDER_W = 3.5
const LERP = 0.14
const SNAP = 0.01

function lerpVal(a: number, b: number): number {
  const d = b - a
  return Math.abs(d) < SNAP ? b : a + d * LERP
}

function lerpAnim(cur: PinAnim, tgt: PinAnim): { val: PinAnim; done: boolean } {
  const val: PinAnim = {
    scale:      lerpVal(cur.scale, tgt.scale),
    shadowBlur: lerpVal(cur.shadowBlur, tgt.shadowBlur),
    shadowY:    lerpVal(cur.shadowY, tgt.shadowY),
    glowAlpha:  lerpVal(cur.glowAlpha, tgt.glowAlpha),
  }
  const done =
    val.scale === tgt.scale &&
    val.shadowBlur === tgt.shadowBlur &&
    val.shadowY === tgt.shadowY &&
    val.glowAlpha === tgt.glowAlpha
  return { val, done }
}

/* ── Component ─────────────────────────────────────────── */

function useDataMode() {
  // El canvas no participa del cascade de CSS: hay que redibujar cuando el
  // atributo data-mode cambia en el html.
  const [mode, setMode] = useState(() => document.documentElement.dataset.mode ?? '')
  useEffect(() => {
    const obs = new MutationObserver(() => setMode(document.documentElement.dataset.mode ?? ''))
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode'] })
    return () => obs.disconnect()
  }, [])
  return mode
}

export function MapCanvas({
  center, zoom: zoomProp = 13, pins = [], selectedPin,
  onPinClick, route, routeColor, style,
  tone = 'mono',
}: MapCanvasProps) {
  const dataMode = useDataMode()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 600, h: 400 })
  const [zoom, setZoom] = useState(zoomProp)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [hoveredPin, setHoveredPin] = useState<string | null>(null)

  const dragRef = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null)
  const tileCache = useRef<Map<string, HTMLImageElement>>(new Map())
  const pinAnimRef = useRef<Map<string, PinAnim>>(new Map())
  const rafRef = useRef(0)
  const drawRef = useRef<(() => void) | undefined>(undefined)

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
    img.onload = () => drawRef.current?.()
    tileCache.current.set(key, img)
    return null
  }, [])

  /* ── Main render + animation effect ─────────────────── */
  useEffect(() => {
    let alive = true

    const drawFrame = () => {
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

      // El contrato del sistema es data-mode: sin el atributo, el tema es claro.
      // Caer a prefers-color-scheme pintaba el mapa oscuro dentro de una app clara.
      const dark = document.documentElement.dataset.mode === 'dark'

      /* ─ Tiles ─ */
      const tileCount = Math.pow(2, zoom)
      const startTX = Math.max(0, Math.floor(-originX / TILE))
      const endTX = Math.min(tileCount - 1, Math.floor((-originX + size.w) / TILE))
      const startTY = Math.max(0, Math.floor(-originY / TILE))
      const endTY = Math.min(tileCount - 1, Math.floor((-originY + size.h) / TILE))

      ctx.fillStyle = getTokenValue('--surface-canvas', dark ? '#1a1a2e' : '#e8e8e8')
      ctx.fillRect(0, 0, size.w, size.h)

      // OSM estandar, como declara el contrato del canon (deps.network con
      // atribucion obligatoria). Carto empezo a estampar API KEY REQUIRED.
      const tileBase = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
      // Los filtros viven solo en los tiles: pins y ruta conservan su color.
      // mono: escala de grises (claro) o grises invertidos (oscuro).
      // color: tiles originales, con la inversion clasica en oscuro.
      const FILTROS = {
        mono: dark ? 'grayscale(1) invert(1) brightness(0.85) contrast(0.95)' : 'grayscale(1) contrast(0.95) brightness(1.03)',
        color: dark ? 'invert(1) hue-rotate(180deg) brightness(0.92) contrast(0.9)' : 'none',
      }
      ctx.filter = FILTROS[tone]

      for (let tx = startTX; tx <= endTX; tx++) {
        for (let ty = startTY; ty <= endTY; ty++) {
          const key = `osm/${zoom}/${tx}/${ty}`
          const src = tileBase
            .replace('{z}', String(zoom))
            .replace('{x}', String(tx))
            .replace('{y}', String(ty))
          const img = loadTile(key, src)
          if (img) ctx.drawImage(img, originX + tx * TILE, originY + ty * TILE, TILE, TILE)
        }
      }
      ctx.filter = 'none'

      /* ─ Resolve tokens ─ */
      const cardBg       = getTokenValue('--surface-card', dark ? '#131D30' : '#FFFFFF')
      const textPrimary  = getTokenValue('--text-primary', dark ? '#F1F5F9' : '#0F172A')
      const borderSubtle = getTokenValue('--border-subtle', dark ? '#1E293B' : '#E2E8F0')
      const accentColor  = getTokenValue('--viz-accent', '#F72717')
      const infoColor    = getTokenValue('--viz-1', '#2E7CF6')
      const fontBody     = getTokenValue('--font-body', 'Ubuntu, system-ui, sans-serif')
      const fontMono     = getTokenValue('--font-mono', '"IBM Plex Mono", monospace')

      /* ─ Route ─ */
      if (route && route.length >= 2) {
        ctx.beginPath()
        route.forEach(([lat, lon], i) => {
          const px = originX + lon2x(lon, zoom) * TILE
          const py = originY + lat2y(lat, zoom) * TILE
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py)
        })
        ctx.strokeStyle = routeColor ? resolveColor(routeColor) : infoColor
        ctx.lineWidth = 4
        ctx.lineJoin = 'round'
        ctx.lineCap = 'round'
        ctx.stroke()
        ctx.setLineDash([8, 6])
        ctx.strokeStyle = dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.15)'
        ctx.lineWidth = 4
        ctx.stroke()
        ctx.setLineDash([])
      }

      /* ─ Pins (z-sorted: rest → hovered → selected) ─ */
      const sorted = [...pins].sort((a, b) => {
        const za = a.id === selectedPin ? 2 : a.id === hoveredPin ? 1 : 0
        const zb = b.id === selectedPin ? 2 : b.id === hoveredPin ? 1 : 0
        return za - zb
      })

      sorted.forEach(pin => {
        const px = originX + lon2x(pin.lon, zoom) * TILE
        const py = originY + lat2y(pin.lat, zoom) * TILE
        const isSelected = selectedPin === pin.id
        const color = resolveColor(pin.color || (isSelected ? accentColor : infoColor))
        const anim = pinAnimRef.current.get(pin.id) || { ...ANIM_REST }
        const r = BASE_RADIUS * anim.scale

        ctx.save()

        /* Glow ring — Depth: accent glow */
        if (anim.glowAlpha > 0.005) {
          ctx.beginPath()
          ctx.arc(px, py, r + 10, 0, Math.PI * 2)
          const a = Math.round(anim.glowAlpha * 255).toString(16).padStart(2, '0')
          ctx.fillStyle = color + a
          ctx.fill()
        }

        /* Shadow — Depth: rest → raised → float */
        ctx.shadowColor = dark ? 'rgba(0,0,0,0.5)' : 'rgba(15,23,42,0.18)'
        ctx.shadowBlur = anim.shadowBlur
        ctx.shadowOffsetY = anim.shadowY

        /* White border ring — Frame: --surface-card */
        ctx.beginPath()
        ctx.arc(px, py, r + BORDER_W, 0, Math.PI * 2)
        ctx.fillStyle = cardBg
        ctx.fill()

        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0
        ctx.shadowOffsetY = 0

        /* Color fill */
        ctx.beginPath()
        ctx.arc(px, py, r, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()

        /* Icon glyph — Voice: Material Symbols */
        if (pin.icon) {
          const iconSz = Math.round(ICON_BASE * anim.scale)
          ctx.font = `${iconSz}px "Material Symbols Rounded"`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillStyle = '#FFFFFF'
          ctx.fillText(pin.icon, px, py)
        }

        ctx.restore()

        /* ─ Tooltip (hover or selected) ─ */
        if (pin.label && (isSelected || hoveredPin === pin.id)) {
          const gap = 8
          const tipAnchor = py - r - BORDER_W - gap
          const hasSubtitle = !!pin.subtitle

          const idFont = `300 13px ${fontMono}`
          const subFont = `400 12px ${fontBody}`
          ctx.font = idFont
          const idW = ctx.measureText(pin.label).width
          let contentW = idW
          if (hasSubtitle) {
            ctx.font = subFont
            const subW = ctx.measureText(pin.subtitle!).width
            contentW = Math.max(idW, subW)
          }

          const padH = 14
          const padV = hasSubtitle ? 10 : 8
          const tipW = contentW + padH * 2
          const lineH = hasSubtitle ? 36 : 16
          const tipH = lineH + padV * 2
          const tipR = 10
          const tipX = px - tipW / 2
          const tipTop = tipAnchor - tipH
          const arrowW = 6

          ctx.save()

          /* Tooltip shadow — Depth: --shadow-float */
          ctx.shadowColor = dark ? 'rgba(0,0,0,0.45)' : 'rgba(15,23,42,0.1)'
          ctx.shadowBlur = 16
          ctx.shadowOffsetY = 4

          /* Background — Frame: --surface-card + --radius-sm */
          ctx.fillStyle = cardBg
          ctx.beginPath()
          ctx.roundRect(tipX, tipTop, tipW, tipH, tipR)
          ctx.fill()

          ctx.shadowColor = 'transparent'

          /* Border — Frame: --border-subtle */
          ctx.strokeStyle = borderSubtle
          ctx.lineWidth = 1
          ctx.stroke()

          /* Arrow */
          ctx.fillStyle = cardBg
          ctx.beginPath()
          ctx.moveTo(px - arrowW, tipTop + tipH)
          ctx.lineTo(px, tipTop + tipH + arrowW)
          ctx.lineTo(px + arrowW, tipTop + tipH)
          ctx.fill()

          ctx.strokeStyle = borderSubtle
          ctx.beginPath()
          ctx.moveTo(px - arrowW, tipTop + tipH - 0.5)
          ctx.lineTo(px, tipTop + tipH + arrowW)
          ctx.lineTo(px + arrowW, tipTop + tipH - 0.5)
          ctx.stroke()

          ctx.fillStyle = cardBg
          ctx.fillRect(px - arrowW + 1, tipTop + tipH - 1, (arrowW - 1) * 2, 2)

          ctx.restore()

          if (hasSubtitle) {
            const textSecondary = getTokenValue('--text-secondary', dark ? '#94A3B8' : '#475569')
            ctx.font = subFont
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillStyle = textSecondary
            ctx.fillText(pin.subtitle!, px, tipTop + padV + 10)

            ctx.font = idFont
            ctx.fillStyle = isSelected ? color : textPrimary
            ctx.fillText(pin.label, px, tipTop + padV + 28)
          } else {
            ctx.font = idFont
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillStyle = isSelected ? color : textPrimary
            ctx.fillText(pin.label, px, tipTop + tipH / 2)
          }
        }
      })

      /* ─ Attribution ─ */
      ctx.font = `500 9px ${fontBody}`
      ctx.fillStyle = dark ? 'rgba(200,200,200,0.5)' : 'rgba(0,0,0,0.4)'
      ctx.textAlign = 'right'
      ctx.fillText('© OpenStreetMap contributors', size.w - 6, size.h - 6)
    }

    drawRef.current = drawFrame

    /* ─ Animation loop — Energy: spring-like lerp per frame ─ */
    const pinIds = new Set(pins.map(p => p.id))
    for (const id of pinAnimRef.current.keys()) {
      if (!pinIds.has(id)) pinAnimRef.current.delete(id)
    }

    const tick = () => {
      if (!alive) return
      let moving = false

      pins.forEach(pin => {
        const isSelected = selectedPin === pin.id
        const isHovered = hoveredPin === pin.id
        const target = isSelected ? ANIM_SELECT : isHovered ? ANIM_HOVER : ANIM_REST
        const cur = pinAnimRef.current.get(pin.id) || { ...ANIM_REST }
        const { val, done } = lerpAnim(cur, target)
        pinAnimRef.current.set(pin.id, val)
        if (!done) moving = true
      })

      drawFrame()
      if (moving) rafRef.current = requestAnimationFrame(tick)
    }

    tick()

    return () => {
      alive = false
      cancelAnimationFrame(rafRef.current)
    }
  }, [cx, cy, zoom, size, pins, selectedPin, hoveredPin, route, routeColor, loadTile, dataMode, tone])

  /* ── Event handlers ──────────────────────────────────── */

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
    setDragging(true)
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    if (canvasRef.current) canvasRef.current.style.cursor = ''
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragRef.current) {
      setOffset({
        x: dragRef.current.ox + (e.clientX - dragRef.current.sx),
        y: dragRef.current.oy + (e.clientY - dragRef.current.sy),
      })
      return
    }

    const canvas = canvasRef.current
    if (!canvas || pins.length === 0) {
      if (hoveredPin) setHoveredPin(null)
      return
    }

    const rect = canvas.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    const originX = size.w / 2 - cx
    const originY = size.h / 2 - cy

    let found: string | null = null
    let minDist = HIT_RADIUS
    for (const pin of pins) {
      const ppx = originX + lon2x(pin.lon, zoom) * TILE
      const ppy = originY + lat2y(pin.lat, zoom) * TILE
      const d = Math.hypot(mx - ppx, my - ppy)
      if (d < minDist) { minDist = d; found = pin.id }
    }

    if (found !== hoveredPin) setHoveredPin(found)
    canvas.style.cursor = found ? 'pointer' : ''
  }

  const handlePointerUp = () => {
    dragRef.current = null
    setDragging(false)
  }

  const handlePointerLeave = () => {
    if (hoveredPin) setHoveredPin(null)
  }

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
    let minDist = HIT_RADIUS
    for (const pin of pins) {
      const ppx = originX + lon2x(pin.lon, zoom) * TILE
      const ppy = originY + lat2y(pin.lat, zoom) * TILE
      const d = Math.hypot(mx - ppx, my - ppy)
      if (d < minDist) { minDist = d; closest = pin }
    }
    if (closest) onPinClick(closest.id)
  }

  return (
    <div
      ref={containerRef}
      className={css.root}
      data-dragging={dragging || undefined}
      style={style}
    >
      <canvas
        ref={canvasRef}
        className={css.canvas}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
      />
      {/* mc-2: cada pin es un boton real, enfocable por teclado, con lugar y
          valor en su nombre. Inerte al puntero: el raton sigue siendo del
          canvas (pan y hit-test); Enter/Espacio disparan la seleccion. */}
      {pins.length > 0 && (
        <div className={css.pinLayer} aria-label="Puntos en el mapa" role="group">
          {pins.map(pin => {
            const px = size.w / 2 - cx + lon2x(pin.lon, zoom) * TILE
            const py = size.h / 2 - cy + lat2y(pin.lat, zoom) * TILE
            if (px < -22 || py < -22 || px > size.w + 22 || py > size.h + 22) return null
            return (
              <button
                key={pin.id}
                type="button"
                className={css.pinTarget}
                style={{ left: px, top: py }}
                aria-label={`${pin.label ?? pin.id}${pin.subtitle ? `, ${pin.subtitle}` : ''}`}
                aria-pressed={selectedPin != null ? pin.id === selectedPin : undefined}
                onClick={() => onPinClick?.(pin.id)}
                onFocus={() => setHoveredPin(pin.id)}
                onBlur={() => setHoveredPin(h => (h === pin.id ? null : h))}
              />
            )
          })}
        </div>
      )}
      <div className={css.controls}>
        <button
          type="button"
          className={css.zoomBtn}
          aria-label="Acercar"
          onClick={() => setZoom(z => Math.min(18, z + 1))}
        >+</button>
        <button
          type="button"
          className={css.zoomBtn}
          aria-label="Alejar"
          onClick={() => setZoom(z => Math.max(2, z - 1))}
        >-</button>
      </div>
    </div>
  )
}
