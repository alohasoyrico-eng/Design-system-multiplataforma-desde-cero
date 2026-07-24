import { useState } from "react";
import { Grid, Stack, Inline, Text } from "@flow/primitives";
import {
  FlowStatTile,
  FlowCard,
  FlowBarChart,
  FlowLineChart,
  FlowDonut,
  type ChartSeries,
} from "@flow/components";
import { FlowSidebar, FlowTopbar, type SidebarItem } from "@flow/patterns";
import "../css/DashboardOverview.css";

export interface DashboardStat {
  label: string;
  value: string;
  detail?: string;
}

export interface DashboardOverviewProps {
  stats: DashboardStat[];
  categories: string[];
  viajesSeries: ChartSeries[];
  ingresosSeries: ChartSeries[];
  /** Fleet occupancy, 0–100. */
  ocupacion: number;
}

const NAV: SidebarItem[] = [
  { id: "resumen", label: "Resumen", icon: "dashboard" },
  { id: "viajes", label: "Viajes", icon: "local_shipping" },
  { id: "ingresos", label: "Ingresos", icon: "payments" },
  { id: "ocupacion", label: "Ocupación", icon: "donut_large" },
];

/** DashboardOverview — desktop analytics. The sidebar switches between chart views. */
export function DashboardOverview({
  stats,
  categories,
  viajesSeries,
  ingresosSeries,
  ocupacion,
}: DashboardOverviewProps) {
  const [nav, setNav] = useState("resumen");

  const bar = (
    <FlowBarChart title="Viajes por día y turno" categories={categories} series={viajesSeries} />
  );
  const line = (
    <FlowLineChart
      title="Ingresos de la semana (miles)"
      categories={categories}
      formatValue={(n) => `$${n}k`}
      series={ingresosSeries}
    />
  );

  return (
    <div className="flow-dash">
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
      <div className="flow-dash__body">
        <FlowTopbar title={NAV.find((n) => n.id === nav)?.label ?? ""} />
        <main className="flow-dash__content">
          {nav === "resumen" && (
            <Stack gap="6">
              <Grid columns="repeat(auto-fit, minmax(180px, 1fr))" gap="4">
                {stats.map((s) => (
                  <FlowStatTile key={s.label} label={s.label} value={s.value} detail={s.detail} />
                ))}
              </Grid>
              <Grid columns="repeat(auto-fit, minmax(320px, 1fr))" gap="6">
                <FlowCard>{bar}</FlowCard>
                <FlowCard>{line}</FlowCard>
              </Grid>
            </Stack>
          )}

          {nav === "viajes" && <FlowCard>{bar}</FlowCard>}

          {nav === "ingresos" && <FlowCard>{line}</FlowCard>}

          {nav === "ocupacion" && (
            <FlowCard>
              <Inline gap="6" align="center">
                <FlowDonut value={ocupacion} size={140} label="Ocupación de flota" />
                <Stack gap="1">
                  <Text variant="title-sm" as="h3">
                    Ocupación de flota
                  </Text>
                  <Text variant="body" color="secondary">
                    {ocupacion}% de las unidades están en ruta ahora mismo.
                  </Text>
                </Stack>
              </Inline>
            </FlowCard>
          )}
        </main>
      </div>
    </div>
  );
}
