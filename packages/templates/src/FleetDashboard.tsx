import { useState } from "react";
import { Grid, Stack, Text } from "@flow/primitives";
import {
  FlowStatTile,
  FlowTable,
  FlowAvatar,
  FlowBadge,
  FlowSwitch,
  FlowIconButton,
  FlowBarChart,
  FlowLineChart,
  FlowMapCanvas,
  FlowCard,
  type TableColumn,
  type BadgeTone,
} from "@flow/components";
import { FlowSidebar, FlowTopbar, type SidebarItem } from "@flow/patterns";
import "../css/FleetDashboard.css";

export interface FleetUnit {
  id: string;
  plate: string;
  driver: string;
  status: "activo" | "taller" | "fuera";
  route: string;
  earnings: string;
}

export interface FleetKpi {
  label: string;
  value: string;
  detail?: string;
}

export interface FleetDashboardProps {
  kpis: FleetKpi[];
  units: FleetUnit[];
}

const NAV: SidebarItem[] = [
  { id: "resumen", label: "Resumen", icon: "dashboard" },
  { id: "unidades", label: "Unidades", icon: "local_shipping" },
  { id: "conductores", label: "Conductores", icon: "group" },
  { id: "rutas", label: "Rutas", icon: "map" },
  { id: "reportes", label: "Reportes", icon: "bar_chart" },
];

const STATUS_TONE: Record<FleetUnit["status"], BadgeTone> = {
  activo: "success",
  taller: "warning",
  fuera: "danger",
};

const CHART_CATS = ["Lun", "Mar", "Mié", "Jue", "Vie"];

/** FleetDashboard — dense product screen. The sidebar switches real modules. */
export function FleetDashboard({ kpis, units }: FleetDashboardProps) {
  const [nav, setNav] = useState("unidades");
  const [live, setLive] = useState(true);

  const unitColumns: TableColumn<FleetUnit>[] = [
    { key: "plate", header: "Placa", mono: true },
    {
      key: "driver",
      header: "Conductor",
      render: (u) => (
        <span className="fleet-driver">
          <FlowAvatar
            name={u.driver}
            size="sm"
            presence={u.status === "activo" ? "online" : "offline"}
          />
          {u.driver}
        </span>
      ),
    },
    {
      key: "status",
      header: "Estado",
      render: (u) => (
        <FlowBadge tone={STATUS_TONE[u.status]} live={u.status === "activo" && live}>
          {u.status}
        </FlowBadge>
      ),
    },
    { key: "route", header: "Ruta" },
    { key: "earnings", header: "Ingresos", mono: true, align: "end" },
  ];

  const drivers = units.map((u) => ({ ...u }));
  const driverColumns: TableColumn<FleetUnit>[] = [
    {
      key: "driver",
      header: "Conductor",
      render: (u) => (
        <span className="fleet-driver">
          <FlowAvatar
            name={u.driver}
            size="sm"
            presence={u.status === "activo" ? "online" : "offline"}
          />
          {u.driver}
        </span>
      ),
    },
    {
      key: "status",
      header: "Disponibilidad",
      render: (u) => (
        <FlowBadge tone={STATUS_TONE[u.status]}>
          {u.status === "activo" ? "en línea" : u.status}
        </FlowBadge>
      ),
    },
    { key: "plate", header: "Unidad", mono: true },
    { key: "earnings", header: "Ingresos hoy", mono: true, align: "end" },
  ];

  return (
    <div className="fleet">
      <FlowSidebar
        items={NAV}
        activeId={nav}
        onSelect={setNav}
        brand={
          <>
            <span className="flow-icon flow-icon--fill">bolt</span>
            <Text variant="title-sm" as="span">
              Flow
            </Text>
          </>
        }
      />
      <div className="fleet__body">
        <FlowTopbar
          title={NAV.find((n) => n.id === nav)?.label ?? ""}
          actions={
            <>
              <FlowSwitch
                label="En vivo"
                checked={live}
                onChange={(e) => setLive(e.target.checked)}
              />
              <FlowIconButton icon="notifications" ariaLabel="Notificaciones" badge />
              <FlowAvatar name="Ana Ruiz" size="sm" presence="online" />
            </>
          }
        />
        <main className="fleet__content">
          {nav === "resumen" && (
            <Stack gap="6">
              <Grid columns="repeat(auto-fit, minmax(180px, 1fr))" gap="4">
                {kpis.map((k) => (
                  <FlowStatTile key={k.label} label={k.label} value={k.value} detail={k.detail} />
                ))}
              </Grid>
              <FlowCard>
                <FlowBarChart
                  title="Viajes por día y turno"
                  categories={CHART_CATS}
                  series={[
                    { name: "Día", values: [120, 145, 132, 160, 178] },
                    { name: "Noche", values: [80, 92, 100, 88, 120] },
                  ]}
                />
              </FlowCard>
            </Stack>
          )}

          {nav === "unidades" && (
            <FlowTable
              caption="Unidades de la flota"
              columns={unitColumns}
              rows={units}
              rowKey={(u) => u.id}
            />
          )}

          {nav === "conductores" && (
            <FlowTable
              caption="Conductores"
              columns={driverColumns}
              rows={drivers}
              rowKey={(u) => u.id}
            />
          )}

          {nav === "rutas" && (
            <FlowMapCanvas
              ariaLabel="Rutas activas de la flota"
              route={[
                { x: 12, y: 78 },
                { x: 42, y: 58 },
                { x: 70, y: 64 },
                { x: 88, y: 32 },
              ]}
              pins={[
                { x: 30, y: 42, label: "1.8×", accent: true },
                { x: 68, y: 66, label: "U-214" },
                { x: 88, y: 32, label: "Meta" },
              ]}
            />
          )}

          {nav === "reportes" && (
            <Grid columns="repeat(auto-fit, minmax(320px, 1fr))" gap="6">
              <FlowCard>
                <FlowBarChart
                  title="Viajes por día y turno"
                  categories={CHART_CATS}
                  series={[
                    { name: "Día", values: [120, 145, 132, 160, 178] },
                    { name: "Noche", values: [80, 92, 100, 88, 120] },
                  ]}
                />
              </FlowCard>
              <FlowCard>
                <FlowLineChart
                  title="Ingresos de la semana (miles)"
                  categories={CHART_CATS}
                  formatValue={(n) => `$${n}k`}
                  series={[
                    { name: "Centro", values: [8, 12, 10, 14, 18] },
                    { name: "Norte", values: [5, 7, 9, 8, 11] },
                  ]}
                />
              </FlowCard>
            </Grid>
          )}
        </main>
      </div>
    </div>
  );
}
