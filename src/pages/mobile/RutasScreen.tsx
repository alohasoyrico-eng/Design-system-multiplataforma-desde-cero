import { useState } from 'react'
import css from './RutasScreen.module.css'
import { PhoneFrame } from './PhoneFrame'
import { MapCanvas } from '../../ui/components/MapCanvas'
import { BottomSheet } from '../../ui/components/BottomSheet'
import { Card } from '../../ui/components/Card'
import { FilterBar } from '../../ui/components/FilterBar'
import { PeekSheet } from '../../ui/components/PeekSheet'
import { RouteBanner } from '../../ui/components/RouteBanner'
import { Badge } from '../../ui/primitives/Badge'
import { Button } from '../../ui/primitives/Button'
import { Chip } from '../../ui/primitives/Chip'
import { IconButton } from '../../ui/primitives/IconButton'
import { DetailRow } from '../../ui/primitives/DetailRow'
import { SheetBody } from '../../ui/primitives/SheetBody'

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

const FILTERS: { value: string; label: string; icon?: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'gas', label: 'Gasolina', icon: 'local_gas_station' },
  { value: 'ev', label: 'Eléctrico', icon: 'bolt' },
]

export function RutasScreen() {
  const [filter, setFilter] = useState('todas')
  const [selected, setSelected] = useState<string | null>(null)
  const [routing, setRouting] = useState(false)

  const station = STATIONS.find((s) => s.id === selected)
  const visible = STATIONS.filter((s) => filter === 'todas' || s.kind === filter)
  const visiblePins = visible.map((s) => ({
    id: s.id,
    lat: s.lat,
    lon: s.lon,
    label: s.label,
    color: s.id === selected ? 'var(--viz-accent)' : undefined,
  }))

  const handlePinClick = (id: string) => {
    setSelected(id)
    setRouting(false)
  }

  const handleFilterChange = (value: string) => {
    setFilter(value)
    if (station && value !== 'todas' && station.kind !== value) {
      setSelected(null)
      setRouting(false)
    }
  }

  return (
    <PhoneFrame fullBleed>
      <div className={css.view}>
        <MapCanvas
          center={[19.4310, -99.1530]}
          zoom={14}
          pins={visiblePins}
          selectedPin={selected}
          onPinClick={handlePinClick}
          route={routing && selected ? ROUTES[selected] : undefined}
          style={{ flex: 1, borderRadius: 0 }}
        />

        <FilterBar>
          {FILTERS.map(({ value, label, icon }) => (
            <Chip
              key={value}
              label={label}
              icon={icon}
              selected={filter === value}
              onClick={() => handleFilterChange(value)}
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

        {!selected && !routing && (
          <PeekSheet title={`${visible.length} estaciones cerca`}>
            {visible.slice(0, 3).map((s) => (
              <button
                key={s.id}
                type="button"
                className={css.stationItem}
                onClick={() => handlePinClick(s.id)}
              >
                <span className={css.stationIcon} data-kind={s.kind}>
                  <span className="flow-symbol" aria-hidden="true">{s.icon}</span>
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

      <BottomSheet
        open={!!station && !routing}
        onClose={() => setSelected(null)}
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

            <Button variant="primary" size="lg" icon="navigation" fullWidth onClick={() => setRouting(true)}>
              Cómo llegar · {station.eta}
            </Button>
          </SheetBody>
        )}
      </BottomSheet>
    </PhoneFrame>
  )
}
