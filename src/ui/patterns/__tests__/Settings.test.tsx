import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithIntl } from '../../../test-utils'
import { Settings, SettingsSection, SettingsRow, SettingsDangerZone, SettingsDangerRow } from '../Settings'

describe('Settings', () => {
  it('renders children', () => {
    render(
      <Settings>
        <p>Settings content</p>
      </Settings>
    )
    expect(screen.getByText('Settings content')).toBeInTheDocument()
  })

  it('renders root element with correct class', () => {
    const { container } = render(
      <Settings>
        <span>Test</span>
      </Settings>
    )
    const root = container.querySelector('[class*="root"]')
    expect(root).toBeInTheDocument()
  })
})

describe('SettingsSection', () => {
  it('renders section title', () => {
    render(
      <SettingsSection title="General">
        <p>Content</p>
      </SettingsSection>
    )
    expect(screen.getByText('General')).toBeInTheDocument()
  })

  it('renders children inside section', () => {
    render(
      <SettingsSection title="Notificaciones">
        <p>Notification settings here</p>
      </SettingsSection>
    )
    expect(screen.getByText('Notification settings here')).toBeInTheDocument()
  })
})

describe('SettingsRow', () => {
  it('renders label and control', () => {
    render(
      <SettingsRow label="Modo oscuro" control={<button>Toggle</button>} />
    )
    expect(screen.getByText('Modo oscuro')).toBeInTheDocument()
    expect(screen.getByText('Toggle')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(
      <SettingsRow
        label="Idioma"
        description="Selecciona el idioma de la interfaz"
        control={<select><option>Español</option></select>}
      />
    )
    expect(screen.getByText('Selecciona el idioma de la interfaz')).toBeInTheDocument()
  })
})

describe('SettingsDangerZone', () => {
  it('renders default title', () => {
    renderWithIntl(
      <SettingsDangerZone>
        <p>Danger content</p>
      </SettingsDangerZone>
    )
    expect(screen.getByText('Zona peligrosa')).toBeInTheDocument()
  })

  it('renders custom title', () => {
    renderWithIntl(
      <SettingsDangerZone title="Acciones irreversibles">
        <p>Content</p>
      </SettingsDangerZone>
    )
    expect(screen.getByText('Acciones irreversibles')).toBeInTheDocument()
  })

  it('renders children', () => {
    renderWithIntl(
      <SettingsDangerZone>
        <p>Delete account section</p>
      </SettingsDangerZone>
    )
    expect(screen.getByText('Delete account section')).toBeInTheDocument()
  })
})

describe('SettingsDangerRow', () => {
  it('renders description and action', () => {
    render(
      <SettingsDangerRow
        description="Eliminar tu cuenta permanentemente"
        action={<button>Eliminar</button>}
      />
    )
    expect(screen.getByText('Eliminar tu cuenta permanentemente')).toBeInTheDocument()
    expect(screen.getByText('Eliminar')).toBeInTheDocument()
  })
})
