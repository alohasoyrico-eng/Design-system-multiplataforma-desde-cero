import { useState } from 'react'
import css from './WalletPage.module.css'
import { PaymentCard } from '@alohasoyrico-eng/flow-react'
import { TransactionRow } from '@alohasoyrico-eng/flow-react'
import { InputAmount } from '@alohasoyrico-eng/flow-react'
import { InputPhone } from '@alohasoyrico-eng/flow-react'
import { TabBar } from '@alohasoyrico-eng/flow-react'
import { BottomSheet } from '@alohasoyrico-eng/flow-react'
import { BiometricPrompt } from '@alohasoyrico-eng/flow-react'
import { PasscodeKeypad } from '@alohasoyrico-eng/flow-react'
import { Button } from '@alohasoyrico-eng/flow-react'
import { Field } from '@alohasoyrico-eng/flow-react'

const TABS = [
  { id: 'home', label: 'Inicio', icon: 'home' },
  { id: 'cards', label: 'Tarjetas', icon: 'credit_card' },
  { id: 'send', label: 'Enviar', icon: 'send', badge: true as const },
  { id: 'profile', label: 'Perfil', icon: 'person' },
]

const TRANSACTIONS = [
  { category: 'fuel' as const, title: 'Gasolinera Pemex #412', subtitle: 'Hoy, 14:23', amount: -850.00 },
  { category: 'toll' as const, title: 'Caseta Zapotlanejo', subtitle: 'Hoy, 11:05', amount: -195.00 },
  { category: 'payment' as const, title: 'Transferencia recibida', subtitle: 'Ayer', amount: 12500.00 },
  { category: 'service' as const, title: 'Mantenimiento preventivo', subtitle: 'Ayer', amount: -3200.00, pending: true },
  { category: 'transfer' as const, title: 'Nómina conductor', subtitle: '15 ago', amount: -8500.00 },
]

type View = 'home' | 'cards' | 'send' | 'lock'

export function WalletPage() {
  const [activeTab, setActiveTab] = useState('home')
  const [view, setView] = useState<View>('home')
  const [sheet, setSheet] = useState(false)
  const [amount, setAmount] = useState('')
  const [phone, setPhone] = useState('')
  const [bioState, setBioState] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle')
  const [passcode, setPasscode] = useState('')
  const [passcodeInvalid, setPasscodeInvalid] = useState(false)

  const handleTabChange = (id: string) => {
    setActiveTab(id)
    if (id === 'send') setView('send')
    else if (id === 'cards') setView('cards')
    else setView('home')
  }

  const simulateBio = () => {
    setBioState('scanning')
    setTimeout(() => {
      if (Math.random() > 0.5) {
        setBioState('success')
        setTimeout(() => setBioState('idle'), 1500)
      } else {
        setBioState('error')
        setTimeout(() => setBioState('idle'), 2000)
      }
    }, 1500)
  }

  const handlePasscodeComplete = (code: string) => {
    if (code === '123456') {
      setPasscodeInvalid(false)
      setView('home')
      setPasscode('')
    } else {
      setPasscodeInvalid(true)
      setTimeout(() => setPasscodeInvalid(false), 600)
    }
  }

  return (
    <div className={css.page}>
      <h1 className={css.pageTitle}>Mobile — Wallet</h1>
      <p className={css.pageDesc}>
        8 componentes mobile: PaymentCard, TransactionRow, InputAmount, InputPhone,
        TabBar, BottomSheet, BiometricPrompt y PasscodeKeypad.
      </p>

      <div className={css.phoneFrame}>
        <div className={css.phone}>
          <div className={css.notch} />

          <div className={css.screen}>
            {view === 'home' && (
              <div className={css.homeView}>
                <div className={css.header}>
                  <span className={css.greeting}>Hola, Ricardo</span>
                  <button
                    className={css.lockBtn}
                    onClick={() => setView('lock')}
                    type="button"
                    aria-label="Bloquear"
                  >
                    <span className="flow-symbol flow-symbol--default" aria-hidden="true">lock</span>
                  </button>
                </div>

                <PaymentCard
                  holder="RICARDO MORALES"
                  last4="4921"
                  variant="accent"
                  label="FLOTA"
                  expires="08/28"
                  onClick={() => setSheet(true)}
                />

                <div className={css.section}>
                  <span className={css.sectionTitle}>Movimientos recientes</span>
                  {TRANSACTIONS.map((tx, i) => (
                    <TransactionRow key={i} {...tx} onClick={() => setSheet(true)} />
                  ))}
                </div>
              </div>
            )}

            {view === 'cards' && (
              <div className={css.cardsView}>
                <span className={css.viewTitle}>Tarjetas</span>
                <PaymentCard holder="RICARDO MORALES" last4="4921" variant="accent" label="FLOTA" expires="08/28" />
                <PaymentCard holder="RICARDO MORALES" last4="7833" variant="ink" label="PERSONAL" expires="12/27" />
                <PaymentCard holder="RICARDO MORALES" last4="0012" variant="sand" frozen label="RESERVA" expires="03/26" />
              </div>
            )}

            {view === 'send' && (
              <div className={css.sendView}>
                <span className={css.viewTitle}>Enviar dinero</span>
                <Field label="Teléfono del destinatario">
                  <InputPhone value={phone} onChange={setPhone} />
                </Field>
                <Field label="Monto a enviar">
                  <InputAmount value={amount} onChange={setAmount} />
                </Field>
                <Button variant="primary" fullWidth icon="send" onClick={() => setSheet(true)}>
                  Enviar {amount ? `$${amount}` : ''}
                </Button>
              </div>
            )}

            {view === 'lock' && (
              <div className={css.lockView}>
                <BiometricPrompt
                  method="face"
                  state={bioState}
                  title="Bienvenido"
                  description="Usa tu rostro para desbloquear"
                  onUse={simulateBio}
                  onFallback={() => setView('home')}
                />
                <div className={css.divider} />
                <PasscodeKeypad
                  value={passcode}
                  onChange={setPasscode}
                  onComplete={handlePasscodeComplete}
                  invalid={passcodeInvalid}
                  biometricIcon="face"
                  onBiometric={simulateBio}
                />
              </div>
            )}
          </div>

          <div className={css.tabBarWrap}>
            <TabBar items={TABS} activeId={activeTab} onChange={handleTabChange} />
          </div>

          <BottomSheet open={sheet} onClose={() => setSheet(false)} title="Detalle" fixed={false}>
            <p style={{ color: 'var(--text-secondary)', font: 'var(--type-body-md)' }}>
              Este es un BottomSheet. En producción mostraría el detalle del movimiento o
              la confirmación del envío.
            </p>
            <div style={{ marginTop: 'var(--space-4)' }}>
              <Button variant="primary" fullWidth onClick={() => setSheet(false)}>Cerrar</Button>
            </div>
          </BottomSheet>
        </div>
      </div>
    </div>
  )
}
