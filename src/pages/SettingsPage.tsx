import { useState } from 'react'
import { Tabs } from '../ui/components/Tabs'
import { Card } from '../ui/components/Card'
import { Button } from '../ui/primitives/Button'
import { Input } from '../ui/primitives/Input'
import { Switch } from '../ui/primitives/Switch'
import { Select } from '../ui/primitives/Select'
import { Field } from '../ui/primitives/Field'
import { Dialog } from '../ui/components/Dialog'
import { Settings, SettingsSection, SettingsRow, SettingsDangerZone, SettingsDangerRow } from '../ui/patterns/Settings'
import { PageHeader } from '../layout/PageHeader'
import { useNotify } from '../components/NotifyContext'

const TABS = [
  { value: 'general', label: 'General', icon: 'tune' },
  { value: 'notifications', label: 'Notificaciones', icon: 'notifications' },
  { value: 'security', label: 'Seguridad', icon: 'shield' },
]

export function SettingsPage() {
  const notify = useNotify()
  const [tab, setTab] = useState('general')

  const [orgName, setOrgName] = useState('Transportes Vidal')
  const [timezone, setTimezone] = useState('America/Mexico_City')
  const [language, setLanguage] = useState('es')
  const [autoAssign, setAutoAssign] = useState(true)
  const [maintenanceAlerts, setMaintenanceAlerts] = useState(true)

  const [emailNotifs, setEmailNotifs] = useState(true)
  const [pushNotifs, setPushNotifs] = useState(false)
  const [weeklyReport, setWeeklyReport] = useState(true)
  const [alertSound, setAlertSound] = useState('default')
  const [tripUpdates, setTripUpdates] = useState(true)
  const [driverAlerts, setDriverAlerts] = useState(true)

  const [twoFactor, setTwoFactor] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState('30')
  const [ipRestriction, setIpRestriction] = useState(false)

  const [deleteDialog, setDeleteDialog] = useState(false)
  const [exportDialog, setExportDialog] = useState(false)

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Flota' }, { label: 'Ajustes' }]}
        title="Ajustes"
      />

      <Tabs items={TABS} value={tab} onChange={setTab} style={{ marginBottom: 24 }} />

      <Card>
        {tab === 'general' && (
          <Settings>
            <SettingsSection title="Organización">
              <SettingsRow
                label="Nombre de la organización"
                description="Se muestra en reportes y documentos exportados."
                control={
                  <Input
                    value={orgName}
                    onChange={(v) => { setOrgName(v); notify('Nombre actualizado') }}
                    style={{ width: 240 }}
                  />
                }
              />
              <SettingsRow
                label="Zona horaria"
                description="Afecta los horarios en reportes y programaciones."
                control={
                  <Select
                    options={[
                      { value: 'America/Mexico_City', label: 'Ciudad de México (GMT-6)' },
                      { value: 'America/Bogota', label: 'Bogotá (GMT-5)' },
                      { value: 'America/Santiago', label: 'Santiago (GMT-4)' },
                      { value: 'America/Buenos_Aires', label: 'Buenos Aires (GMT-3)' },
                      { value: 'Europe/Madrid', label: 'Madrid (GMT+1)' },
                    ]}
                    value={timezone}
                    onChange={(v) => { setTimezone(v as string); notify('Zona horaria actualizada') }}
                    style={{ width: 240 }}
                  />
                }
              />
              <SettingsRow
                label="Idioma"
                description="Cambia el idioma de toda la interfaz."
                control={
                  <Select
                    options={[
                      { value: 'es', label: 'Español' },
                      { value: 'en', label: 'English' },
                      { value: 'pt', label: 'Português' },
                    ]}
                    value={language}
                    onChange={(v) => { setLanguage(v as string); notify('Idioma actualizado') }}
                    style={{ width: 240 }}
                  />
                }
              />
            </SettingsSection>

            <SettingsSection title="Operación">
              <SettingsRow
                label="Asignación automática"
                description="Asigna conductores a unidades disponibles cuando inician turno."
                control={
                  <Switch
                    checked={autoAssign}
                    onChange={(v) => { setAutoAssign(v); notify(v ? 'Asignación automática activada' : 'Asignación automática desactivada') }}
                  />
                }
              />
              <SettingsRow
                label="Alertas de mantenimiento"
                description="Notifica cuando una unidad alcanza su próximo servicio programado."
                control={
                  <Switch
                    checked={maintenanceAlerts}
                    onChange={(v) => { setMaintenanceAlerts(v); notify(v ? 'Alertas activadas' : 'Alertas desactivadas') }}
                  />
                }
              />
            </SettingsSection>

            <SettingsDangerZone>
              <SettingsDangerRow
                description="Exportar todos los datos de la organización en formato CSV."
                action={<Button variant="secondary" onClick={() => setExportDialog(true)}>Exportar datos</Button>}
              />
              <SettingsDangerRow
                description="Eliminar la organización y todos sus datos. Esta acción no se puede deshacer."
                action={<Button variant="danger" onClick={() => setDeleteDialog(true)}>Eliminar organización</Button>}
              />
            </SettingsDangerZone>
          </Settings>
        )}

        {tab === 'notifications' && (
          <Settings>
            <SettingsSection title="Canales">
              <SettingsRow
                label="Correo electrónico"
                description="Recibe notificaciones importantes por email."
                control={
                  <Switch
                    checked={emailNotifs}
                    onChange={(v) => { setEmailNotifs(v); notify(v ? 'Notificaciones por email activadas' : 'Notificaciones por email desactivadas') }}
                  />
                }
              />
              <SettingsRow
                label="Notificaciones push"
                description="Recibe alertas en tiempo real en tu dispositivo."
                control={
                  <Switch
                    checked={pushNotifs}
                    onChange={(v) => { setPushNotifs(v); notify(v ? 'Push activadas' : 'Push desactivadas') }}
                  />
                }
              />
              <SettingsRow
                label="Sonido de alerta"
                description="Sonido que se reproduce cuando llega una alerta crítica."
                control={
                  <Select
                    options={[
                      { value: 'default', label: 'Predeterminado' },
                      { value: 'chime', label: 'Campanada' },
                      { value: 'urgent', label: 'Urgente' },
                      { value: 'none', label: 'Sin sonido' },
                    ]}
                    value={alertSound}
                    onChange={(v) => { setAlertSound(v as string); notify('Sonido actualizado') }}
                    style={{ width: 200 }}
                  />
                }
              />
            </SettingsSection>

            <SettingsSection title="Tipos de notificación">
              <SettingsRow
                label="Actualizaciones de viajes"
                description="Inicio, fin y cambios de estado en viajes activos."
                control={
                  <Switch
                    checked={tripUpdates}
                    onChange={(v) => { setTripUpdates(v); notify(v ? 'Activadas' : 'Desactivadas') }}
                  />
                }
              />
              <SettingsRow
                label="Alertas de conductores"
                description="Velocidad excesiva, desvíos de ruta y tiempo sin actividad."
                control={
                  <Switch
                    checked={driverAlerts}
                    onChange={(v) => { setDriverAlerts(v); notify(v ? 'Activadas' : 'Desactivadas') }}
                  />
                }
              />
              <SettingsRow
                label="Reporte semanal"
                description="Resumen de operaciones enviado cada lunes por la mañana."
                control={
                  <Switch
                    checked={weeklyReport}
                    onChange={(v) => { setWeeklyReport(v); notify(v ? 'Reporte semanal activado' : 'Reporte semanal desactivado') }}
                  />
                }
              />
            </SettingsSection>
          </Settings>
        )}

        {tab === 'security' && (
          <Settings>
            <SettingsSection title="Autenticación">
              <SettingsRow
                label="Autenticación de dos factores"
                description="Añade una capa extra de seguridad al iniciar sesión."
                control={
                  <Switch
                    checked={twoFactor}
                    onChange={(v) => { setTwoFactor(v); notify(v ? '2FA activado' : '2FA desactivado') }}
                  />
                }
              />
              <SettingsRow
                label="Tiempo de sesión"
                description="Minutos de inactividad antes de cerrar la sesión automáticamente."
                control={
                  <Select
                    options={[
                      { value: '15', label: '15 minutos' },
                      { value: '30', label: '30 minutos' },
                      { value: '60', label: '1 hora' },
                      { value: '120', label: '2 horas' },
                    ]}
                    value={sessionTimeout}
                    onChange={(v) => { setSessionTimeout(v as string); notify('Tiempo de sesión actualizado') }}
                    style={{ width: 200 }}
                  />
                }
              />
              <SettingsRow
                label="Restricción por IP"
                description="Permite el acceso solo desde direcciones IP autorizadas."
                control={
                  <Switch
                    checked={ipRestriction}
                    onChange={(v) => { setIpRestriction(v); notify(v ? 'Restricción por IP activada' : 'Restricción por IP desactivada') }}
                  />
                }
              />
            </SettingsSection>
          </Settings>
        )}
      </Card>

      <Dialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        title="Eliminar organización"
        tone="danger"
        description="Esta acción eliminará todos los datos de la organización: unidades, conductores, viajes y reportes. No se puede deshacer."
        actions={
          <>
            <Button variant="ghost" onClick={() => setDeleteDialog(false)}>Cancelar</Button>
            <Button variant="danger" onClick={() => { setDeleteDialog(false); notify('Organización eliminada') }}>Eliminar</Button>
          </>
        }
      />

      <Dialog
        open={exportDialog}
        onClose={() => setExportDialog(false)}
        title="Exportar datos"
        description="Se generará un archivo CSV con todos los datos de la organización. Recibirás un correo cuando esté listo."
        actions={
          <>
            <Button variant="ghost" onClick={() => setExportDialog(false)}>Cancelar</Button>
            <Button variant="accent" onClick={() => { setExportDialog(false); notify('Exportación iniciada — recibirás un correo') }}>Exportar</Button>
          </>
        }
      />
    </>
  )
}
