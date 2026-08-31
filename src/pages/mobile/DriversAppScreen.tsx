import { useState, useEffect, useRef } from 'react'
import css from './DriversAppScreen.module.css'
import { PhoneFrame } from './PhoneFrame'
import { TabBar } from '../../ui/primitives/TabBar'
import { StatTile } from '../../ui/components/StatTile'
import { Card } from '../../ui/components/Card'
import { BottomSheet } from '../../ui/components/BottomSheet'
import { Toast, ToastStack } from '../../ui/primitives/Toast'
import { Switch } from '../../ui/primitives/Switch'
import { Button } from '../../ui/primitives/Button'
import { Badge } from '../../ui/primitives/Badge'
import { Avatar } from '../../ui/primitives/Avatar'
import { IconButton } from '../../ui/primitives/IconButton'
import { Progress } from '../../ui/primitives/Progress'
import { ProfileMenu } from '../../ui/patterns/ProfileMenu'
import { DetailRow } from '../../ui/primitives/DetailRow'
import { SectionHeader } from '../../ui/primitives/SectionHeader'
import { SheetBody } from '../../ui/primitives/SheetBody'

const TABS = [
  { id: 'home', label: 'Inicio', icon: 'home' },
  { id: 'trips', label: 'Viajes', icon: 'route', badge: 1 },
  { id: 'earnings', label: 'Ganancias', icon: 'payments' },
  { id: 'account', label: 'Cuenta', icon: 'person' },
]

const TRIPS = [
  { id: 't1', from: 'Av. Vallarta 1200', to: 'Centro Magno', time: '09:15', amount: 145, distance: '3.8 km', duration: '14 min' },
  { id: 't2', from: 'Plaza del Sol', to: 'Aeropuerto GDL', time: '10:40', amount: 280, distance: '12.5 km', duration: '25 min' },
  { id: 't3', from: 'Tlaquepaque Centro', to: 'Andares', time: '12:30', amount: 210, distance: '8.2 km', duration: '18 min' },
]

function RideCountdown({ seconds, onExpire }: { seconds: number; onExpire: () => void }) {
  const [left, setLeft] = useState(seconds)

  useEffect(() => {
    if (left <= 0) { onExpire(); return }
    const t = setTimeout(() => setLeft(l => l - 1), 1000)
    return () => clearTimeout(t)
  }, [left, onExpire])

  return (
    <div className={css.countdown}>
      <svg viewBox="0 0 40 40" className={css.countdownRing}>
        <circle cx="20" cy="20" r="17" fill="none" stroke="var(--surface-sunken)" strokeWidth="3" opacity="0.3" />
        <circle
          cx="20" cy="20" r="17" fill="none" stroke="currentColor" strokeWidth="3"
          strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 17}`}
          strokeDashoffset={`${2 * Math.PI * 17 * (1 - left / seconds)}`}
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
      </svg>
      <span className={css.countdownNum}>{left}</span>
    </div>
  )
}

export function DriversAppScreen() {
  const [activeTab, setActiveTab] = useState('home')
  const [online, setOnline] = useState(false)
  const [showRide, setShowRide] = useState(false)
  const [rideAccepted, setRideAccepted] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [sheetTrip, setSheetTrip] = useState<typeof TRIPS[0] | null>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (online && !rideAccepted) {
      const t = setTimeout(() => setShowRide(true), 1200)
      return () => clearTimeout(t)
    }
  }, [online, rideAccepted])

  const handleAccept = () => {
    setShowRide(false)
    setRideAccepted(true)
    setToast('Viaje aceptado — dirígete al origen')
    setTimeout(() => setToast(null), 3500)
  }

  const handlePass = () => {
    setShowRide(false)
  }

  const handleFinish = () => {
    setRideAccepted(false)
    setToast('Viaje completado — $185.00')
    setTimeout(() => setToast(null), 3500)
  }

  return (
    <PhoneFrame dark>
      <div className={css.view}>
        {activeTab === 'home' && (
          <>
            <div className={css.topBar}>
              <div className={css.userInfo}>
                <Avatar name="Ricardo M." size="md" status={online ? 'online' : 'offline'} />
                <div>
                  <div className={css.userName}>Ricardo M.</div>
                  <Badge tone={online ? 'success' : 'default'} live={online}>
                    {online ? 'En línea' : 'Desconectado'}
                  </Badge>
                </div>
              </div>
              <IconButton icon="notifications" ariaLabel="Notificaciones" variant="tonal" badge />
            </div>

            <Card padding="var(--space-4)">
              <div className={css.shiftRow}>
                <div>
                  <div className={css.shiftLabel}>Turno activo</div>
                  <div className={css.shiftHint}>
                    {online ? 'Recibiendo solicitudes' : 'Activa tu turno para recibir viajes'}
                  </div>
                </div>
                <Switch checked={online} onChange={setOnline} label="Turno" />
              </div>
            </Card>

            {showRide && !rideAccepted && (
              <div className={css.rideRequest}>
                <div className={css.rideHeader}>
                  <div>
                    <span className={css.rideBadge}>NUEVO VIAJE · +1.8×</span>
                  </div>
                  <RideCountdown seconds={15} onExpire={handlePass} />
                </div>
                <div className={css.rideRoute}>
                  <div className={css.rideStop}>
                    <span className={css.rideDotOrigin} />
                    <span>Av. Chapultepec 234</span>
                  </div>
                  <div className={css.rideStop}>
                    <span className={css.rideDotDest} />
                    <span>Plaza del Sol</span>
                  </div>
                </div>
                <div className={css.rideMeta}>
                  <span>4.2 km</span>
                  <span>·</span>
                  <span>12 min</span>
                  <span className={css.ridePrice}>$185</span>
                </div>
                <div className={css.rideCtas}>
                  <Button variant="ghost" onClick={handlePass}>Pasar</Button>
                  <Button variant="primary" onClick={handleAccept}>Aceptar</Button>
                </div>
              </div>
            )}

            {rideAccepted && (
              <Card padding="var(--space-4)">
                <div className={css.tripHeader}>
                  <span className={css.tripTitle}>Viaje en curso</span>
                  <Badge tone="success">Activo</Badge>
                </div>
                <div className={css.tripRoute}>Av. Chapultepec 234 → Plaza del Sol</div>
                <div className={css.tripCta}>
                  <Button variant="primary" fullWidth onClick={handleFinish}>
                    Finalizar viaje
                  </Button>
                </div>
              </Card>
            )}

            {!showRide && !rideAccepted && (
              <>
                <div className={css.statsRow}>
                  <StatTile label="Hoy" value="$1,280" icon="today" tone="success" />
                  <StatTile label="Semana" value="$8,450" icon="date_range" tone="success" />
                </div>

                <Card padding="var(--space-4)">
                  <div className={css.goalHeader}>
                    <span className={css.goalLabel}>Meta semanal</span>
                    <span className={css.goalValue}>$8,450 / $12,000</span>
                  </div>
                  <Progress value={8450} max={12000} tone="accent" />
                </Card>

                <Card padding="var(--space-4)">
                  <div className={css.ratingRow}>
                    <div>
                      <span className={css.ratingValue}>4.94</span>
                      <span className={css.ratingLabel}>Calificación</span>
                    </div>
                    <span className={css.ratingPeriod}>últimos 30 días</span>
                  </div>
                </Card>
              </>
            )}
          </>
        )}

        {activeTab === 'trips' && (
          <>
            <SectionHeader>Viajes de hoy</SectionHeader>
            {TRIPS.map((trip) => (
              <Card
                key={trip.id}
                padding="var(--space-3)"
                interactive
                onClick={() => { triggerRef.current = document.activeElement as HTMLElement; setSheetTrip(trip) }}
              >
                <div className={css.tripRow}>
                  <div>
                    <div className={css.tripRowRoute}>{trip.from} → {trip.to}</div>
                    <div className={css.tripRowTime}>{trip.time} · {trip.distance}</div>
                  </div>
                  <span className={css.tripRowAmount}>${trip.amount}</span>
                </div>
              </Card>
            ))}
          </>
        )}

        {activeTab === 'earnings' && (
          <>
            <SectionHeader>Ganancias</SectionHeader>
            <div className={css.earningsSum}>
              <span className={css.earningsSumValue}>$1,280.00</span>
              <span className={css.earningsSumLabel}>Ganancia del día</span>
            </div>
            <div className={css.earningsGrid}>
              <StatTile label="Hoy" value="$1,280" delta="+$320 vs ayer" icon="today" tone="success" />
              <StatTile label="Esta semana" value="$8,450" delta="+12% vs semana pasada" icon="date_range" tone="success" />
              <StatTile label="Este mes" value="$32,100" delta="+8% vs mes pasado" icon="calendar_month" tone="success" />
            </div>
          </>
        )}

        {activeTab === 'account' && (
          <ProfileMenu
            name="Ricardo Morales"
            avatarName="Ricardo M."
            role="Unidad 47 · Conductor activo"
            badge={<Badge tone="success">Verificado</Badge>}
            items={[
              { icon: 'directions_car', label: 'Mi vehículo' },
              { icon: 'description', label: 'Documentos' },
              { icon: 'support_agent', label: 'Soporte' },
              { icon: 'settings', label: 'Ajustes' },
            ]}
          />
        )}
      </div>

      <div className={css.tabWrap}>
        <TabBar items={TABS} activeId={activeTab} onChange={setActiveTab} />
      </div>

      <BottomSheet
        open={!!sheetTrip}
        onClose={() => { setSheetTrip(null); triggerRef.current?.focus() }}
        title="Detalle del viaje"
        fixed={false}
      >
        {sheetTrip && (
          <SheetBody>
            {[
              ['Origen', sheetTrip.from],
              ['Destino', sheetTrip.to],
              ['Hora', sheetTrip.time],
              ['Distancia', sheetTrip.distance],
              ['Duración', sheetTrip.duration],
            ].map(([l, v]) => (
              <DetailRow key={String(l)} label={String(l)} value={String(v)} />
            ))}
            <DetailRow label="Ganancia" value={`$${sheetTrip.amount}`} mono />
          </SheetBody>
        )}
      </BottomSheet>

      {toast && (
        <div className={css.toastWrap}>
          <ToastStack>
            <Toast tone="success" message={toast} />
          </ToastStack>
        </div>
      )}
    </PhoneFrame>
  )
}
