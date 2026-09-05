import { useState } from 'react'
import css from './MobilePage.module.css'
import { OnboardingDriverScreen } from './OnboardingDriverScreen'
import { WalletAppScreen } from './WalletAppScreen'
import { AuthOTPScreen } from './AuthOTPScreen'

const TEMPLATES = [
  { value: 'onboarding', label: 'Onboarding' },
  { value: 'wallet', label: 'Wallet' },
  { value: 'auth', label: 'Auth' },
]

const SCREENS: Record<string, { component: React.ComponentType; desc: string }> = {
  onboarding: { component: OnboardingDriverScreen, desc: 'Propuesta de valor, alta completa (correo, OTP, teléfono, tarjeta, passcode), biométricos y autenticación.' },
  wallet: { component: WalletAppScreen, desc: 'App completa — inicio con saldo y carrusel, tarjetas con detalle, actividad y mapa de estaciones. Perfil vía avatar.' },
  auth: { component: AuthOTPScreen, desc: 'Autenticación por capas: biométrico, passcode con intentos contados y OTP por SMS de respaldo.' },
}

export function MobilePage() {
  const [active, setActive] = useState('onboarding')
  const Screen = SCREENS[active].component

  return (
    <div className={css.page}>
      <h1 className={css.title}>Mobile Templates</h1>
      <p className={css.desc}>
        2 demos mobile del producto Flow. Cada una es un flujo completo
        que compone los componentes del sistema de diseño en pantallas reales.
      </p>

      <div className={css.nav}>
        {TEMPLATES.map((t) => (
          <button
            key={t.value}
            type="button"
            className={css.navBtn}
            data-active={active === t.value || undefined}
            onClick={() => setActive(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <p className={css.screenDesc}>{SCREENS[active].desc}</p>

      <div className={css.phoneWrap}>
        <Screen />
      </div>
    </div>
  )
}
