import { useState } from 'react'
import css from './CardDetailScreen.module.css'
import { PhoneFrame } from './PhoneFrame'
import { PaymentCard } from '../../ui/patterns/PaymentCard'
import { TransactionRow } from '../../ui/patterns/TransactionRow'
import { BottomSheet } from '../../ui/components/BottomSheet'
import { QuickAction } from '../../ui/components/QuickAction'
import { QuickActionBar } from '../../ui/patterns/QuickActionBar'
import { LimitBar } from '../../ui/components/LimitBar'
import { NavBar } from '../../ui/components/NavBar'
import { NipReveal } from '../../ui/patterns/NipReveal'
import { Badge } from '../../ui/primitives/Badge'
import { Button } from '../../ui/primitives/Button'
import { SectionHeader } from '../../ui/primitives/SectionHeader'
import { SheetBody } from '../../ui/components/SheetBody'

const TRANSACTIONS = [
  { category: 'fuel' as const, title: 'Gasolinera Pemex #412', subtitle: 'Hoy, 14:23', amount: -850.00 },
  { category: 'toll' as const, title: 'Caseta Zapotlanejo', subtitle: 'Hoy, 11:05', amount: -195.00 },
  { category: 'service' as const, title: 'Lavado exterior', subtitle: 'Ayer', amount: -180.00 },
  { category: 'fuel' as const, title: 'Gasolinera BP Sur', subtitle: '17 ago', amount: -920.00 },
]

export function CardDetailScreen() {
  const [frozen, setFrozen] = useState(false)
  const [showNip, setShowNip] = useState(false)
  const [showLimits, setShowLimits] = useState(false)

  return (
    <PhoneFrame>
      <div className={css.view}>
        <NavBar
          title="Detalle"
          trailing={frozen ? <Badge tone="info" icon="ac_unit">Congelada</Badge> : undefined}
        />

        <PaymentCard
          holder="RICARDO MORALES"
          last4="4921"
          variant="accent"
          label="FLOTA"
          expires="08/28"
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
          {TRANSACTIONS.map((tx, i) => (
            <TransactionRow key={i} {...tx} />
          ))}
        </div>
      </div>

      <BottomSheet open={showNip} onClose={() => setShowNip(false)} title="NIP de la tarjeta" fixed={false}>
        <NipReveal
          digits="4721"
          warning="Tu NIP se mostrará por 5 segundos. Asegúrate de que nadie más pueda ver tu pantalla."
        />
      </BottomSheet>

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
    </PhoneFrame>
  )
}
