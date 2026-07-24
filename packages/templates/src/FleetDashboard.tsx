import { useState } from "react";
import { Grid, Stack, Text } from "@flow/primitives";
import {
  FlowStatTile,
  FlowTable,
  FlowAvatar,
  FlowBadge,
  FlowSwitch,
  FlowIconButton,
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

/** FleetDashboard — dense product screen (Fleet Manager). Nav shell + KPI row + units table. */
export function FleetDashboard({ kpis, units }: FleetDashboardProps) {
  const [nav, setNav] = useState("unidades");
  const [live, setLive] = useState(true);

  const columns: TableColumn<FleetUnit>[] = [
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
          title="Unidades"
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
          <Stack gap="6">
            <Grid columns="repeat(auto-fit, minmax(180px, 1fr))" gap="4">
              {kpis.map((k) => (
                <FlowStatTile key={k.label} label={k.label} value={k.value} detail={k.detail} />
              ))}
            </Grid>
            <FlowTable
              caption="Unidades de la flota"
              columns={columns}
              rows={units}
              rowKey={(u) => u.id}
            />
          </Stack>
        </main>
      </div>
    </div>
  );
}
