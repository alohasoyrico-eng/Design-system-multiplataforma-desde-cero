import { useState, useRef } from 'react'
import css from './WalletScreen.module.css'
import { PhoneFrame } from './PhoneFrame'
import { PaymentCard } from '../../ui/components/PaymentCard'
import { CardCarousel } from '../../ui/components/CardCarousel'
import { QuickActionBar } from '../../ui/components/QuickActionBar'
import { TransactionRow } from '../../ui/components/TransactionRow'
import { TabBar } from '../../ui/primitives/TabBar'
import { BottomSheet } from '../../ui/components/BottomSheet'
import { QuickAction } from '../../ui/components/QuickAction'
import { BalanceDisplay } from '../../ui/patterns/BalanceDisplay'
import { TransactionGroup } from '../../ui/patterns/TransactionGroup'
import { Card } from '../../ui/components/Card'
import { Button } from '../../ui/primitives/Button'
import { Avatar } from '../../ui/primitives/Avatar'
import { Badge } from '../../ui/primitives/Badge'
import { ProfileMenu } from '../../ui/patterns/ProfileMenu'
import { IconButton } from '../../ui/primitives/IconButton'
import { DetailRow } from '../../ui/primitives/DetailRow'
import { SectionHeader } from '../../ui/primitives/SectionHeader'
import { SheetBody } from '../../ui/primitives/SheetBody'

const TABS = [
  { id: 'home', label: 'Inicio', icon: 'home' },
  { id: 'cards', label: 'Tarjetas', icon: 'credit_card' },
  { id: 'activity', label: 'Actividad', icon: 'receipt_long' },
  { id: 'profile', label: 'Perfil', icon: 'person' },
]

const TRANSACTIONS = [
  { category: 'fuel' as const, title: 'Gasolinera Pemex #412', subtitle: 'Hoy, 14:23', amount: -850.00, card: 'fleet', day: 'HOY' },
  { category: 'toll' as const, title: 'Caseta Zapotlanejo', subtitle: 'Hoy, 11:05', amount: -195.00, card: 'fleet', day: 'HOY' },
  { category: 'payment' as const, title: 'Transferencia recibida', subtitle: 'Ayer, 18:30', amount: 12500.00, card: 'personal', day: 'AYER' },
  { category: 'service' as const, title: 'Mantenimiento preventivo', subtitle: 'Ayer, 09:15', amount: -3200.00, pending: true, card: 'fleet', day: 'AYER' },
  { category: 'transfer' as const, title: 'Nómina conductor', subtitle: '15 ago, 12:00', amount: -8500.00, card: 'fleet', day: '15 AGO' },
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

const CARDS = [
  { holder: 'RICARDO MORALES', last4: '4921', variant: 'accent' as const, label: 'FLOTA', expires: '08/28', key: 'fleet' },
  { holder: 'RICARDO MORALES', last4: '7833', variant: 'ink' as const, label: 'PERSONAL', expires: '12/27', key: 'personal' },
]

export function WalletScreen() {
  const [activeTab, setActiveTab] = useState('home')
  const [cardIdx, setCardIdx] = useState(0)
  const [balanceHidden, setBalanceHidden] = useState(false)
  const [sheetTx, setSheetTx] = useState<typeof TRANSACTIONS[0] | null>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  const cardType = CARDS[cardIdx].key
  const filtered = TRANSACTIONS.filter((t) => t.card === cardType)
  const groups = groupByDay(filtered)

  const openTx = (tx: typeof TRANSACTIONS[0]) => {
    triggerRef.current = document.activeElement as HTMLElement
    setSheetTx(tx)
  }

  return (
    <PhoneFrame>
      <div className={css.view}>
        {activeTab === 'home' && (
          <>
            <div className={css.topBar}>
              <div className={css.userInfo}>
                <Avatar name="Ricardo M." size="md" status="online" />
                <div>
                  <span className={css.greeting}>Hola, Ricardo</span>
                </div>
              </div>
              <IconButton icon="notifications" ariaLabel="Notificaciones" variant="tonal" badge />
            </div>

            <BalanceDisplay
              value="$24,850.00"
              hidden={balanceHidden}
              onToggleHidden={() => setBalanceHidden(!balanceHidden)}
            />

            <CardCarousel activeIndex={cardIdx} onChange={setCardIdx}>
              {CARDS.map((c) => (
                <PaymentCard key={c.key} holder={c.holder} last4={c.last4} variant={c.variant} label={c.label} expires={c.expires} />
              ))}
            </CardCarousel>

            <QuickActionBar>
              <QuickAction icon="north_east" label="Enviar" onClick={() => {}} />
              <QuickAction icon="south_west" label="Recibir" onClick={() => {}} />
              <QuickAction icon="credit_card" label="Detalle" onClick={() => setActiveTab('cards')} />
              <QuickAction icon="more_horiz" label="Más" onClick={() => {}} />
            </QuickActionBar>

            <div className={css.section}>
              <SectionHeader size="sm">Movimientos recientes</SectionHeader>
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
            </div>
          </>
        )}

        {activeTab === 'cards' && (
          <>
            <SectionHeader>Tarjetas</SectionHeader>
            <CardCarousel activeIndex={cardIdx} onChange={setCardIdx}>
              {CARDS.map((c) => (
                <PaymentCard key={c.key} holder={c.holder} last4={c.last4} variant={c.variant} label={c.label} expires={c.expires} />
              ))}
            </CardCarousel>
            <QuickActionBar>
              <QuickAction icon="north_east" label="Enviar" onClick={() => {}} />
              <QuickAction icon="south_west" label="Recibir" onClick={() => {}} />
              <QuickAction icon="more_horiz" label="Más" onClick={() => {}} />
            </QuickActionBar>
          </>
        )}

        {activeTab === 'activity' && (
          <>
            <SectionHeader>Actividad</SectionHeader>
            {/* spc-3: los grupos se separan con gap del contenedor, no con margen */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
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
          </>
        )}

        {activeTab === 'profile' && (
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
        )}
      </div>

      <div className={css.tabWrap}>
        <TabBar items={TABS} activeId={activeTab} onChange={setActiveTab} />
      </div>

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
                  ['Tarjeta', sheetTx.card === 'fleet' ? 'Flota ••4921' : 'Personal ••7833'],
                ].map(([l, v]) => (
                  <DetailRow key={String(l)} label={String(l)} value={String(v)} />
                ))}
              </div>
            </Card>
            <Button variant="ghost" fullWidth onClick={() => {}}>Disputar este cargo</Button>
          </SheetBody>
        )}
      </BottomSheet>
    </PhoneFrame>
  )
}
