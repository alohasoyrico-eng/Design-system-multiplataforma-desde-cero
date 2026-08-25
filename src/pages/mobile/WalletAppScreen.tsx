import { useState, useRef } from 'react'
import css from './WalletAppScreen.module.css'
import { PhoneFrame } from './PhoneFrame'
import { PaymentCard } from '../../ui/components/PaymentCard'
import { CardCarousel } from '../../ui/patterns/CardCarousel'
import { QuickActionBar } from '../../ui/patterns/QuickActionBar'
import { TransactionRow } from '../../ui/components/TransactionRow'
import { TabBar } from '../../ui/components/TabBar'
import { BottomSheet } from '../../ui/components/BottomSheet'
import { QuickAction } from '../../ui/components/QuickAction'
import { MapCanvas } from '../../ui/components/MapCanvas'
import { Card } from '../../ui/components/Card'
import { FilterBar } from '../../ui/components/FilterBar'
import { LimitBar } from '../../ui/components/LimitBar'
import { NavBar } from '../../ui/components/NavBar'
import { NipReveal } from '../../ui/components/NipReveal'
import { PeekSheet } from '../../ui/components/PeekSheet'
import { RouteBanner } from '../../ui/components/RouteBanner'
import { TransactionGroup } from '../../ui/components/TransactionGroup'
import { Button } from '../../ui/primitives/Button'
import { Avatar } from '../../ui/primitives/Avatar'
import { Badge } from '../../ui/primitives/Badge'
import { IconButton } from '../../ui/primitives/IconButton'
import { Chip } from '../../ui/primitives/Chip'
import { EmptyState } from '../../ui/components/EmptyState'
import { ProfileMenu } from '../../ui/patterns/ProfileMenu'
import { CardMedia } from '../../ui/components/CardMedia'
import { SheetBody } from '../../ui/components/SheetBody'
import { DetailRow } from '../../ui/primitives/DetailRow'
import { SectionHeader } from '../../ui/primitives/SectionHeader'

const TABS = [
  { id: 'home', label: 'Inicio', icon: 'home' },
  { id: 'cards', label: 'Tarjetas', icon: 'credit_card' },
  { id: 'activity', label: 'Actividad', icon: 'receipt_long' },
  { id: 'rutas', label: 'Rutas', icon: 'map' },
]

const CARDS = [
  { holder: 'RICARDO MORALES', last4: '4921', variant: 'fuel' as const, label: 'COMBUSTIBLE', icon: 'local_gas_station', expires: '08/28', key: 'fuel', balance: '$12,470.00' },
  { holder: 'RICARDO MORALES', last4: '7833', variant: 'ev' as const, label: 'ELECTROMOVILIDAD', icon: 'bolt', expires: '12/27', key: 'ev', balance: '$5,340.00' },
  { holder: 'RICARDO MORALES', last4: '3156', variant: 'maintenance' as const, label: 'MANTENIMIENTO', icon: 'build', expires: '03/29', key: 'maintenance', balance: '$3,840.00' },
  { holder: 'RICARDO MORALES', last4: '8702', variant: 'toll' as const, label: 'CASETAS', icon: 'toll', expires: '11/28', key: 'toll', balance: '$3,200.00' },
]


const BENEFITS = [
  { icon: 'local_gas_station', title: 'Combustible', desc: 'Ahorra hasta 8% en cada carga', product: 'fuel' },
  { icon: 'bolt', title: 'Electromovilidad', desc: 'Carga tu EV con tarifa preferencial', product: 'ev' },
  { icon: 'toll', title: 'Casetas', desc: 'Pasa sin detenerte con TAG integrado', product: 'toll' },
  { icon: 'build', title: 'Mantenimiento', desc: 'Descuentos en red de talleres', product: 'maintenance' },
]

const TRANSACTIONS = [
  { category: 'fuel' as const, title: 'Gasolinera Pemex #412', subtitle: 'Hoy, 14:23', amount: -850.00, card: 'fuel', day: 'HOY' },
  { category: 'fuel' as const, title: 'Gasolinera G500 Roma', subtitle: 'Hoy, 09:10', amount: -620.00, card: 'fuel', day: 'HOY' },
  { category: 'toll' as const, title: 'Caseta Zapotlanejo', subtitle: 'Hoy, 11:05', amount: -195.00, card: 'toll', day: 'HOY' },
  { category: 'toll' as const, title: 'Caseta Palmillas', subtitle: 'Ayer, 16:40', amount: -280.00, card: 'toll', day: 'AYER' },
  { category: 'service' as const, title: 'Carga EV Condesa', subtitle: 'Ayer, 18:30', amount: -340.00, card: 'ev', day: 'AYER' },
  { category: 'service' as const, title: 'Mantenimiento preventivo', subtitle: 'Ayer, 09:15', amount: -3200.00, pending: true, card: 'maintenance', day: 'AYER' },
]

function groupByDay(txs: typeof TRANSACTIONS) {
  const groups: { label: string; items: typeof TRANSACTIONS }[] = []
  for (const tx of txs) {
    const last = groups[groups.length - 1]
    if (last && last.label === tx.day) {
      last.items.push(tx)
    } else {
      groups.push({ label: tx.day, items: [tx] })
    }
  }
  return groups
}

/* Rutas data */
const ME: [number, number] = [19.4326, -99.1500]

const STATIONS = [
  {
    id: 's1', kind: 'gas' as const,
    lat: 19.4426, lon: -99.1680, label: '$23.4',
    icon: 'local_gas_station', name: 'Pemex Polanco',
    dist: '1.8 km', eta: '6 min',
    prices: [['Magna', '$23.40'], ['Premium', '$25.10'], ['Diésel', '$24.80']],
    services: ['Tienda', 'Aire y agua', 'Baños'],
    open: '24 h',
  },
  {
    id: 's2', kind: 'gas' as const,
    lat: 19.4290, lon: -99.1420, label: '$22.9',
    icon: 'local_gas_station', name: 'G500 Roma Norte',
    dist: '0.9 km', eta: '4 min',
    prices: [['Magna', '$22.90'], ['Premium', '$24.70']],
    services: ['Tienda', 'Baños'],
    open: '6:00–23:00',
  },
  {
    id: 's3', kind: 'ev' as const,
    lat: 19.4190, lon: -99.1610, label: '$4.2/kWh',
    icon: 'bolt', name: 'Electrolinera Condesa',
    dist: '1.4 km', eta: '5 min',
    prices: [['Carga rápida (150 kW)', '$4.20/kWh'], ['Carga normal (22 kW)', '$3.10/kWh']],
    services: ['4 conectores CCS', 'Café'],
    open: '24 h',
  },
  {
    id: 's4', kind: 'ev' as const,
    lat: 19.4400, lon: -99.1400, label: '$3.9/kWh',
    icon: 'bolt', name: 'EV Point Anzures',
    dist: '2.1 km', eta: '8 min',
    prices: [['Carga rápida (100 kW)', '$3.90/kWh']],
    services: ['2 conectores CCS'],
    open: '24 h',
  },
]

const ROUTES: Record<string, [number, number][]> = {
  s1: [ME, [19.4360, -99.1560], [19.4400, -99.1640], [19.4426, -99.1680]],
  s2: [ME, [19.4310, -99.1460], [19.4290, -99.1420]],
  s3: [ME, [19.4270, -99.1550], [19.4220, -99.1590], [19.4190, -99.1610]],
  s4: [ME, [19.4370, -99.1450], [19.4400, -99.1400]],
}

const MAP_FILTERS: { value: string; label: string; icon?: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'gas', label: 'Gasolina', icon: 'local_gas_station' },
  { value: 'ev', label: 'Eléctrico', icon: 'bolt' },
]

const HERO_BLOBS: Record<string, React.CSSProperties> = {
  fuel: {
    '--blob1-color': 'rgba(100,30,220,0.6)',   '--blob1-x': '-20%', '--blob1-y': '35%',  '--blob1-size': '280px',
    '--blob2-color': 'rgba(200,40,180,0.55)',  '--blob2-x': '85%',  '--blob2-y': '-10%', '--blob2-size': '90px',
    '--blob3-color': 'rgba(30,60,220,0.5)',    '--blob3-x': '55%',  '--blob3-y': '80%',  '--blob3-size': '160px',
  } as React.CSSProperties,
  ev: {
    '--blob1-color': 'rgba(240,50,120,0.6)',   '--blob1-x': '80%',  '--blob1-y': '70%',  '--blob1-size': '100px',
    '--blob2-color': 'rgba(250,120,40,0.5)',   '--blob2-x': '-15%', '--blob2-y': '10%',  '--blob2-size': '300px',
    '--blob3-color': 'rgba(220,30,200,0.4)',   '--blob3-x': '40%',  '--blob3-y': '-20%', '--blob3-size': '180px',
  } as React.CSSProperties,
  maintenance: {
    '--blob1-color': 'rgba(250,210,30,0.6)',   '--blob1-x': '75%',  '--blob1-y': '-15%', '--blob1-size': '200px',
    '--blob2-color': 'rgba(30,220,140,0.5)',   '--blob2-x': '-20%', '--blob2-y': '75%',  '--blob2-size': '260px',
    '--blob3-color': 'rgba(80,240,200,0.35)',  '--blob3-x': '50%',  '--blob3-y': '40%',  '--blob3-size': '80px',
  } as React.CSSProperties,
  toll: {
    '--blob1-color': 'rgba(250,160,20,0.6)',   '--blob1-x': '-10%', '--blob1-y': '-15%', '--blob1-size': '320px',
    '--blob2-color': 'rgba(255,60,40,0.5)',    '--blob2-x': '90%',  '--blob2-y': '80%',  '--blob2-size': '110px',
    '--blob3-color': 'rgba(250,200,50,0.35)',  '--blob3-x': '30%',  '--blob3-y': '50%',  '--blob3-size': '140px',
  } as React.CSSProperties,
  _add: {
    '--blob1-color': 'rgba(40,220,200,0.5)',   '--blob1-x': '85%',  '--blob1-y': '-10%', '--blob1-size': '240px',
    '--blob2-color': 'rgba(240,50,140,0.45)',  '--blob2-x': '-15%', '--blob2-y': '80%',  '--blob2-size': '130px',
    '--blob3-color': 'rgba(50,100,240,0.35)',  '--blob3-x': '40%',  '--blob3-y': '30%',  '--blob3-size': '90px',
  } as React.CSSProperties,
}

export function WalletAppScreen() {
  const [activeTab, setActiveTab] = useState('home')
  const [cardIdx, setCardIdx] = useState(0)
  const [balanceHidden, setBalanceHidden] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  /* Activity */
  const [sheetTx, setSheetTx] = useState<typeof TRANSACTIONS[0] | null>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  /* Card detail */
  const [cardDetail, setCardDetail] = useState(false)
  const [frozen, setFrozen] = useState(false)
  const [showNip, setShowNip] = useState(false)
  const [showLimits, setShowLimits] = useState(false)

  /* Rutas */
  const [mapFilter, setMapFilter] = useState('todas')
  const [selectedStation, setSelectedStation] = useState<string | null>(null)
  const [routing, setRouting] = useState(false)

  const activeCard = CARDS[Math.min(cardIdx, CARDS.length - 1)]
  const filtered = TRANSACTIONS.filter((t) => t.card === activeCard.key)
  const groups = groupByDay(TRANSACTIONS)

  const openTx = (tx: typeof TRANSACTIONS[0]) => {
    triggerRef.current = document.activeElement as HTMLElement
    setSheetTx(tx)
  }

  /* Rutas helpers */
  const station = STATIONS.find((s) => s.id === selectedStation)
  const visibleStations = STATIONS.filter((s) => mapFilter === 'todas' || s.kind === mapFilter)
  const visiblePins = visibleStations.map((s) => ({
    id: s.id,
    lat: s.lat,
    lon: s.lon,
    label: s.label,
    color: s.id === selectedStation ? 'var(--viz-accent)' : undefined,
  }))

  const handlePinClick = (id: string) => {
    setSelectedStation(id)
    setRouting(false)
  }

  const handleMapFilterChange = (value: string) => {
    setMapFilter(value)
    if (station && value !== 'todas' && station.kind !== value) {
      setSelectedStation(null)
      setRouting(false)
    }
  }

  const isAddCard = cardIdx >= CARDS.length

  return (
    <PhoneFrame>
      <div className={css.app}>
        {/* ── Inicio tab ── */}
        {activeTab === 'home' && (
          <div className={css.tabContent} data-home>
            <div
              className={css.heroSection}
              data-product={isAddCard ? '_add' : activeCard.variant}
              style={HERO_BLOBS[isAddCard ? '_add' : activeCard.variant]}
            >
              <div className={css.heroBg} />
              <div className={css.blobClip}>
                <div className={css.blob} />
                <div className={css.blob} data-n="2" />
                <div className={css.blob} data-n="3" />
              </div>

              <div className={css.heroContent}>
                <div className={css.topBar}>
                  <div className={css.userInfo} onClick={() => setShowProfile(true)}>
                    <Avatar name="Ricardo M." size="md" status="online" />
                    <span className={css.greeting}>Hola, Ricardo</span>
                  </div>
                  <IconButton icon="notifications" ariaLabel="Notificaciones" variant="ghost" size="sm" />
                </div>

                <CardCarousel activeIndex={cardIdx} onChange={setCardIdx} style={{ marginInline: 'calc(-1 * var(--space-8))' }}>
                  {CARDS.map((c) => (
                    <PaymentCard key={c.key} holder={c.holder} last4={c.last4} variant={c.variant} label={c.label} icon={c.icon} expires={c.expires} balance={c.balance} hidden={balanceHidden} onToggleHidden={() => setBalanceHidden(!balanceHidden)} />
                  ))}
                  <button type="button" className={css.addCard} onClick={() => {}}>
                    <span className="flow-icon" aria-hidden="true" style={{ fontSize: 32 }}>add</span>
                    <span>Agregar tarjeta</span>
                  </button>
                </CardCarousel>

                {!isAddCard && (
                  <QuickActionBar>
                    <QuickAction icon="receipt_long" label="Estado de cuenta" onClick={() => { setActiveTab('activity') }} />
                    <QuickAction icon="password" label="Generar CVV" onClick={() => { setActiveTab('cards'); setCardDetail(true) }} />
                    <QuickAction icon="ac_unit" label="Congelar tarjeta" onClick={() => setFrozen(!frozen)} active={frozen} />
                    <QuickAction icon="delete" label="Eliminar tarjeta" onClick={() => {}} />
                  </QuickActionBar>
                )}
              </div>
            </div>

            <div className={css.movSection} data-product={isAddCard ? undefined : activeCard.variant}>
              {isAddCard ? (
                <EmptyState
                  icon="credit_card_off"
                  title="Sin movimientos"
                  description="Agrega una tarjeta para ver tus movimientos aquí"
                />
              ) : (
                <>
                  {filtered.slice(0, 3).map((tx, i) => (
                    <TransactionRow
                      key={i}
                      category={tx.category}
                      title={tx.title}
                      subtitle={tx.subtitle}
                      amount={tx.amount}
                      pending={tx.pending}
                      onClick={() => openTx(tx)}
                    />
                  ))}
                  <button type="button" className={css.movSeeAll} onClick={() => setActiveTab('activity')}>
                    Ver todo
                  </button>
                </>
              )}
            </div>

            <div className={css.benefitsSection}>
              <span className={css.benefitsLabel}>Beneficios</span>
              <div className={css.benefitsTrack}>
                {BENEFITS.map((b) => (
                  <CardMedia
                    key={b.title}
                    title={b.title}
                    description={b.desc}
                    interactive
                    onClick={() => {}}
                    media={
                      <div className={css.benefitMedia} data-product={b.product} style={{ background: 'var(--product-gradient)' }}>
                        <span className="flow-icon" aria-hidden="true">{b.icon}</span>
                      </div>
                    }
                    style={{ flex: '0 0 180px' }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Tarjetas tab ── */}
        {activeTab === 'cards' && (
          <div className={css.tabContent} data-home>
            {!cardDetail ? (
              <div
                className={css.heroSection}
                data-product={activeCard.variant}
                style={HERO_BLOBS[activeCard.variant]}
              >
                <div className={css.heroBg} />
                <div className={css.blobClip}>
                  <div className={css.blob} />
                  <div className={css.blob} data-n="2" />
                  <div className={css.blob} data-n="3" />
                </div>

                <div className={css.heroContent}>
                  <div className={css.topBar}>
                    <SectionHeader>Tarjetas</SectionHeader>
                    <IconButton icon="notifications" ariaLabel="Notificaciones" variant="ghost" size="sm" badge />
                  </div>
                  <CardCarousel activeIndex={cardIdx} onChange={setCardIdx} style={{ marginInline: 'calc(-1 * var(--space-8))' }}>
                    {CARDS.map((c) => (
                      <PaymentCard key={c.key} holder={c.holder} last4={c.last4} variant={c.variant} label={c.label} icon={c.icon} expires={c.expires} />
                    ))}
                  </CardCarousel>
                  <QuickActionBar>
                    <QuickAction icon="info" label="Detalle" onClick={() => setCardDetail(true)} />
                    <QuickAction icon="north_east" label="Enviar" onClick={() => {}} />
                    <QuickAction icon="south_west" label="Recibir" onClick={() => {}} />
                    <QuickAction icon="more_horiz" label="Más" onClick={() => {}} />
                  </QuickActionBar>
                </div>
              </div>
            ) : (
              <>
                <NavBar
                  title="Detalle"
                  onBack={() => setCardDetail(false)}
                  trailing={frozen ? <Badge tone="info" icon="ac_unit">Congelada</Badge> : undefined}
                />

                <PaymentCard
                  holder={activeCard.holder}
                  last4={activeCard.last4}
                  variant={activeCard.variant}
                  label={activeCard.label}
                  icon={activeCard.icon}
                  expires={activeCard.expires}
                  frozen={frozen}
                />

                <QuickActionBar>
                  <QuickAction
                    icon="ac_unit"
                    label={frozen ? 'Descongelar' : 'Congelar'}
                    active={frozen}
                    onClick={() => setFrozen(!frozen)}
                  />
                  <QuickAction icon="pin" label="Ver NIP" onClick={() => setShowNip(true)} />
                  <QuickAction icon="speed" label="Límites" onClick={() => setShowLimits(true)} />
                  <QuickAction icon="password" label="CVV" onClick={() => {}} />
                </QuickActionBar>

                <div>
                  <SectionHeader size="sm">Movimientos de esta tarjeta</SectionHeader>
                  {filtered.slice(0, 4).map((tx, i) => (
                    <TransactionRow key={i} category={tx.category} title={tx.title} subtitle={tx.subtitle} amount={tx.amount} pending={tx.pending} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Actividad tab ── */}
        {activeTab === 'activity' && (
          <div className={css.tabContent}>
            <div className={css.topBar}>
              <SectionHeader>Actividad</SectionHeader>
              <IconButton icon="notifications" ariaLabel="Notificaciones" variant="tonal" badge />
            </div>
            {groups.map((group) => (
              <TransactionGroup key={group.label} label={group.label}>
                {group.items.map((tx, i) => (
                  <TransactionRow
                    key={i}
                    category={tx.category}
                    title={tx.title}
                    subtitle={tx.subtitle}
                    amount={tx.amount}
                    pending={tx.pending}
                    onClick={() => openTx(tx)}
                  />
                ))}
              </TransactionGroup>
            ))}
          </div>
        )}

        {/* ── Rutas tab ── */}
        {activeTab === 'rutas' && (
          <div className={css.tabContent} data-flush>
            <div className={css.rutasView}>
              <MapCanvas
                center={[19.4310, -99.1530]}
                zoom={14}
                pins={visiblePins}
                selectedPin={selectedStation}
                onPinClick={handlePinClick}
                route={routing && selectedStation ? ROUTES[selectedStation] : undefined}
                style={{ flex: 1, borderRadius: 0 }}
              />

              <FilterBar>
                {MAP_FILTERS.map(({ value, label, icon }) => (
                  <Chip
                    key={value}
                    label={label}
                    icon={icon}
                    selected={mapFilter === value}
                    onClick={() => handleMapFilterChange(value)}
                    style={{ boxShadow: 'var(--shadow-raised)' }}
                  />
                ))}
                <IconButton
                  icon="my_location"
                  ariaLabel="Mi ubicación"
                  variant="tonal"
                  size="sm"
                  style={{ marginLeft: 'auto', boxShadow: 'var(--shadow-raised)' }}
                />
              </FilterBar>

              {routing && station && (
                <RouteBanner
                  title={`Hacia ${station.name}`}
                  subtitle={`${station.dist} · llegas en ${station.eta}`}
                  onClose={() => setRouting(false)}
                />
              )}

              {!selectedStation && !routing && (
                <PeekSheet title={`${visibleStations.length} estaciones cerca`}>
                  {visibleStations.slice(0, 3).map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={css.stationItem}
                      onClick={() => handlePinClick(s.id)}
                    >
                      <span className={css.stationIcon} data-kind={s.kind}>
                        <span className="flow-icon" aria-hidden="true">{s.icon}</span>
                      </span>
                      <div className={css.stationInfo}>
                        <span className={css.stationName}>{s.name}</span>
                        <span className={css.stationMeta}>{s.dist} · {s.eta}</span>
                      </div>
                      <span className={css.stationPrice}>{s.prices[0][1]}</span>
                    </button>
                  ))}
                </PeekSheet>
              )}
            </div>
          </div>
        )}

        <TabBar items={TABS} activeId={activeTab} onChange={(id) => { setActiveTab(id); setCardDetail(false) }} style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} />
      </div>

      {/* ── Transaction detail sheet ── */}
      <BottomSheet
        open={!!sheetTx}
        onClose={() => { setSheetTx(null); triggerRef.current?.focus() }}
        title="Detalle del movimiento"
        fixed={false}
      >
        {sheetTx && (
          <SheetBody>
            <span className={css.sheetAmount}>
              {sheetTx.amount < 0 ? '−' : '+'}${Math.abs(sheetTx.amount).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </span>
            <div className={css.sheetBadges}>
              {sheetTx.pending && <Badge tone="warning">Pendiente</Badge>}
              <Badge tone={sheetTx.amount < 0 ? 'danger' : 'success'}>
                {sheetTx.amount < 0 ? 'Cargo' : 'Abono'}
              </Badge>
            </div>
            <Card padding={16}>
              <div className={css.sheetDetails}>
                {[
                  ['Concepto', sheetTx.title],
                  ['Fecha', sheetTx.subtitle],
                  ['Tarjeta', { fuel: 'Combustible ••4921', ev: 'Electromovilidad ••7833', maintenance: 'Mantenimiento ••3156', toll: 'Casetas ••8702' }[sheetTx.card] ?? sheetTx.card],
                ].map(([l, v]) => (
                  <DetailRow key={String(l)} label={String(l)} value={String(v)} />
                ))}
              </div>
            </Card>
            <Button variant="ghost" fullWidth onClick={() => {}}>Disputar este cargo</Button>
          </SheetBody>
        )}
      </BottomSheet>

      {/* ── NIP sheet ── */}
      <BottomSheet open={showNip} onClose={() => setShowNip(false)} title="NIP de la tarjeta" fixed={false}>
        <NipReveal
          digits="4721"
          warning="Tu NIP se mostrará por 5 segundos. Asegúrate de que nadie más pueda ver tu pantalla."
        />
      </BottomSheet>

      {/* ── Limits sheet ── */}
      <BottomSheet open={showLimits} onClose={() => setShowLimits(false)} title="Límites de gasto" fixed={false}>
        <SheetBody>
          {[
            { label: 'Diario', current: 2500, max: 5000 },
            { label: 'Semanal', current: 12400, max: 25000 },
            { label: 'Mensual', current: 38200, max: 100000 },
          ].map((limit) => (
            <LimitBar key={limit.label} label={limit.label} current={limit.current} max={limit.max} />
          ))}
          <div className={css.sheetAction}>
            <Button variant="primary" fullWidth onClick={() => setShowLimits(false)}>Cerrar</Button>
          </div>
        </SheetBody>
      </BottomSheet>

      {/* ── Station detail sheet ── */}
      <BottomSheet
        open={!!station && !routing && activeTab === 'rutas'}
        onClose={() => setSelectedStation(null)}
        title={station?.name}
        fixed={false}
      >
        {station && (
          <SheetBody>
            <div className={css.badgeRow}>
              <Badge
                tone={station.kind === 'ev' ? 'success' : 'warning'}
                icon={station.icon}
              >
                {station.kind === 'ev' ? 'Electrolinera' : 'Gasolinera'}
              </Badge>
              <Badge icon="schedule">{station.open}</Badge>
              <Badge icon="near_me">{station.dist}</Badge>
            </div>

            <Card padding={16}>
              <div className={css.priceList}>
                {station.prices.map(([label, value]) => (
                  <DetailRow key={label} label={label} value={value} mono />
                ))}
              </div>
            </Card>

            <div className={css.serviceRow}>
              {station.services.map((s) => (
                <Badge key={s} tone="default">{s}</Badge>
              ))}
            </div>

            <Button variant="accent" size="lg" icon="navigation" fullWidth onClick={() => setRouting(true)}>
              Cómo llegar · {station.eta}
            </Button>
          </SheetBody>
        )}
      </BottomSheet>

      {/* ── Profile sheet ── */}
      <BottomSheet
        open={showProfile}
        onClose={() => setShowProfile(false)}
        title="Mi perfil"
        fixed={false}
      >
        <ProfileMenu
          name="Ricardo Morales"
          avatarName="Ricardo M."
          role="Conductor · Flota Norte"
          badge={<Badge tone="success">Verificado</Badge>}
          items={[
            { icon: 'credit_card', label: 'Mis tarjetas' },
            { icon: 'receipt_long', label: 'Estados de cuenta' },
            { icon: 'notifications', label: 'Notificaciones' },
            { icon: 'security', label: 'Seguridad' },
            { icon: 'help', label: 'Ayuda' },
          ]}
        />
      </BottomSheet>
    </PhoneFrame>
  )
}
