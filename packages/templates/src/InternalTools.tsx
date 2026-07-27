import { useState } from "react";
import { Grid, Stack, Text } from "@flowds/primitives";
import {
  FlowStatTile,
  FlowCard,
  FlowTable,
  FlowBadge,
  FlowAvatar,
  FlowTimeline,
  FlowKanbanBoard,
  FlowRoleMatrix,
  FlowSelect,
  FlowStatusView,
  type TableColumn,
  type BadgeTone,
} from "@flowds/components";
import { FlowSidebar, FlowTopbar, type SidebarItem } from "@flowds/patterns";
import "../css/InternalTools.css";

type Role = "admin" | "soporte" | "growth";

const NAV: SidebarItem[] = [
  { id: "resumen", label: "Resumen", icon: "dashboard" },
  { id: "tickets", label: "Tickets", icon: "support_agent" },
  { id: "growth", label: "Growth", icon: "trending_up" },
  { id: "config", label: "Config", icon: "admin_panel_settings" },
];

const ACCESS: Record<Role, string[]> = {
  admin: ["resumen", "tickets", "growth", "config"],
  soporte: ["resumen", "tickets"],
  growth: ["resumen", "growth"],
};

interface Ticket {
  id: string;
  asunto: string;
  estado: "abierto" | "en curso" | "resuelto";
  agente: string;
}

const TICKETS: Ticket[] = [
  { id: "T-1042", asunto: "No puedo conectar mi unidad", estado: "abierto", agente: "Ana Ruiz" },
  { id: "T-1041", asunto: "Cobro duplicado", estado: "en curso", agente: "Beto Lara" },
  { id: "T-1038", asunto: "Cambio de tarifa", estado: "resuelto", agente: "Caro Díaz" },
];

const TICKET_TONE: Record<Ticket["estado"], BadgeTone> = {
  abierto: "danger",
  "en curso": "warning",
  resuelto: "success",
};

const ROLES = ["Admin", "Soporte", "Pricing", "Growth"];
const PERMISSIONS = [
  { label: "Ver tickets", allowed: [true, true, false, false] },
  { label: "Editar pricing", allowed: [true, false, true, false] },
  { label: "Gestionar roles", allowed: [true, false, false, false] },
  { label: "Ver growth", allowed: [true, false, false, true] },
];

/** InternalTools — CRM shell with role-gated modules (Resumen, Tickets, Growth, Config). */
export function InternalTools() {
  const [nav, setNav] = useState("resumen");
  const [role, setRole] = useState<Role>("admin");
  const canAccess = ACCESS[role].includes(nav);

  const ticketColumns: TableColumn<Ticket>[] = [
    { key: "id", header: "ID", mono: true },
    { key: "asunto", header: "Asunto" },
    {
      key: "estado",
      header: "Estado",
      render: (t) => <FlowBadge tone={TICKET_TONE[t.estado]}>{t.estado}</FlowBadge>,
    },
    {
      key: "agente",
      header: "Agente",
      render: (t) => (
        <span className="crm-agent">
          <FlowAvatar name={t.agente} size="sm" /> {t.agente}
        </span>
      ),
    },
  ];

  return (
    <div className="flow-crm">
      <FlowSidebar
        items={NAV}
        activeId={nav}
        onSelect={setNav}
        brand={
          <>
            <span className="flow-icon flow-icon--fill">bolt</span>
            <Text variant="title-sm" as="span">
              Internal Tools
            </Text>
          </>
        }
      />
      <div className="flow-crm__body">
        <FlowTopbar
          title={NAV.find((n) => n.id === nav)?.label ?? ""}
          actions={
            <div className="flow-crm__role">
              <FlowSelect
                value={role}
                onChange={(v) => setRole(v as Role)}
                options={[
                  { value: "admin", label: "Admin" },
                  { value: "soporte", label: "Soporte" },
                  { value: "growth", label: "Growth" },
                ]}
              />
            </div>
          }
        />
        <main className="flow-crm__content">
          {!canAccess ? (
            <FlowStatusView
              tone="info"
              icon="lock"
              title="Sin acceso"
              message="Tu rol no tiene permiso para ver este módulo."
            />
          ) : nav === "resumen" ? (
            <Stack gap="6">
              <Grid columns="repeat(auto-fit, minmax(var(--sys-grid-col-sm), 1fr))" gap="4">
                <FlowStatTile label="Tickets abiertos" value="18" detail="−3" />
                <FlowStatTile label="Cuentas nuevas" value="42" detail="+12" />
                <FlowStatTile label="Casos" value="5" detail="fraude" />
                <FlowStatTile label="Activación" value="68%" detail="+4%" />
              </Grid>
              <FlowCard>
                <Stack gap="4">
                  <Text variant="title-sm" as="h2">
                    Actividad reciente
                  </Text>
                  <FlowTimeline
                    items={[
                      {
                        title: "Ticket T-1042 abierto",
                        time: "08:14",
                        description: "Ana Ruiz reportó un problema de conexión.",
                      },
                      {
                        title: "Tarifa Norte actualizada",
                        time: "07:50",
                        description: "Pricing subió la tarifa 1.2×.",
                      },
                      {
                        title: "Conductor activado",
                        time: "07:20",
                        description: "Beto Lara completó su primer viaje.",
                      },
                    ]}
                  />
                </Stack>
              </FlowCard>
            </Stack>
          ) : nav === "tickets" ? (
            <FlowTable
              caption="Cola de tickets"
              columns={ticketColumns}
              rows={TICKETS}
              rowKey={(t) => t.id}
            />
          ) : nav === "growth" ? (
            <FlowKanbanBoard
              ariaLabel="Embudo de activación"
              columns={[
                {
                  id: "registro",
                  title: "Registro",
                  cards: [
                    { id: "c1", title: "Dani Sosa", meta: "Hace 2 h" },
                    { id: "c2", title: "Eva Mora", meta: "Hace 5 h" },
                  ],
                },
                {
                  id: "docs",
                  title: "Documentos",
                  cards: [{ id: "c3", title: "Fito Paz", meta: "Falta INE", tone: "warning" }],
                },
                {
                  id: "primer",
                  title: "Primer viaje",
                  cards: [{ id: "c4", title: "Gaby Ríos", meta: "En riesgo", tone: "danger" }],
                },
                {
                  id: "activo",
                  title: "Activo",
                  cards: [{ id: "c5", title: "Hugo Vela", meta: "12 viajes" }],
                },
              ]}
            />
          ) : (
            <FlowRoleMatrix caption="Permisos por rol" roles={ROLES} permissions={PERMISSIONS} />
          )}
        </main>
      </div>
    </div>
  );
}
