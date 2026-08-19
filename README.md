# Flow Design System

Sistema de diseño multiplataforma para interfaces de flota, fintech y operaciones internas.
React + TypeScript + CSS Modules. Cero dependencias de framework de estilos.

## Inicio rápido

```bash
npm install
npm run dev        # localhost:5173 — app con todas las plantillas
npm run typecheck  # verifica tipos
npm run test       # corre vitest
npm run build      # build de producción
```

Abre `localhost:5173` y navega por el sidebar: dashboards, unidades, conductores, reportes,
ajustes, onboarding, internal tools, chat, mailings, roles, wizard.

## Cómo está organizado

Todo vive en `src/`. La arquitectura tiene 5 capas. Las dependencias solo van hacia abajo:

```
src/
├── tokens/          ← colores, tipografía, espaciado, forma, motion (CSS custom properties)
├── ui/
│   ├── primitives/  ← controles atómicos: Button, Input, Badge, Avatar, Select...
│   │   └── shells/  ← carcasas reutilizables (ControlShell, OverlayShell, DataGrid...)
│   ├── components/  ← composiciones de interfaz: Card, Table, Dialog, KanbanBoard, MapCanvas...
│   └── patterns/    ← flujos de dominio: AuthForm, Settings, Wizard
├── pages/           ← plantillas completas (templates): cada archivo es una pantalla
├── layout/          ← estructura de página: sidebar, header, layout shell
├── data/            ← tipos, mocks, API hooks (TanStack Query + MSW)
└── styles.css       ← entry point de tokens (importa todo tokens/*.css)
```

### La regla de las capas

| Capa | Qué entra | Puede importar de |
|---|---|---|
| **tokens** | Decisiones de diseño sin JSX: color, tipo, espacio, forma, motion | nada |
| **primitives** | Controles atómicos. Un archivo = un control. Dueño de su carcasa | tokens, shells |
| **components** | Composiciones que nombran un concepto de **interfaz** (Table, Dialog, Tabs) | primitives |
| **patterns** | Resuelven una tarea de **negocio** (AuthForm, Settings, Wizard) | components |
| **templates** | Pantallas reales con datos finales. Se copian, no se importan | patterns |

**Si dudas entre component y pattern**: ¿nombra un concepto de interfaz o de negocio?
`Select` y `Dialog` son de interfaz → component. `AuthForm` y `PaymentCard` son de negocio → pattern.

## Inventario actual

### Primitives (20)

Avatar, Badge, Button, Checkbox, Chip, Divider, Field, Flag, FlowChart, IconButton,
Input, Progress, Radio, Select, Skeleton, Slider, Sparkline, Spinner, Switch, Textarea

**Shells (6):** ControlShell, DataGrid, Listbox, OverlayShell, Popover, ToggleControl

### Components (45)

Accordion, Bars, Breadcrumb, BulkActionsTable, BulletChart, Card, CardMedia,
ChatComposer, ChatMessage, ChatThread, CircularProgress, DatePicker, Dialog, Donut,
Drawer, EmptyState, FileUpload, FilterableEditableTable, GanttChart, GlobalSearch,
HelpCenter, KanbanBoard, MapCanvas, Menu, NotificationCenter, OTPInput,
OnboardingCarousel, Pagination, ParetoChart, RoleMatrix, ScatterPlot, SegmentedControl,
Sidebar, SmallMultiples, StatTile, StatusView, Stepper, Table, TableTree, Tabs,
Timeline, Toast, Tooltip, TopBar, Treemap

### Patterns (3)

AuthForm, Settings, Wizard

### Templates (19 pantallas)

**Dashboards (6):** Overview, Combustible, Mantenimiento, Electromovilidad, Peaje, Finanzas
**Fleet:** Unidades, Conductores, Reportes
**Internal Tools (7):** Resumen, Tickets, Cuentas, Pricing, Casos, Back-office, Growth
**Flows:** Onboarding, Auth, Settings, Wizard, Config Roles, Agent Chat, Mailings

## Cómo usar un componente

Cada componente exporta su interfaz de props con TypeScript. VS Code autocompleta todo:

```tsx
import { Button } from './ui/primitives/Button'
import { Card } from './ui/components/Card'
import { StatTile } from './ui/components/StatTile'

<Card>
  <StatTile label="Unidades activas" value="128" icon="local_taxi" />
  <Button variant="accent" icon="add">Agregar unidad</Button>
</Card>
```

### Barrel imports

Cada capa tiene un `index.ts` que re-exporta todo:

```tsx
import { Button, Input, Badge, Avatar } from './ui/primitives'
import { Card, Table, Dialog, KanbanBoard } from './ui/components'
import { AuthForm, Settings } from './ui/patterns'
```

## Tokens y temas

Los tokens son CSS custom properties definidos en `src/tokens/*.css`.
El modo oscuro se activa con `data-theme="dark"` en cualquier nodo del DOM:

```html
<div data-theme="dark">
  <!-- todo dentro hereda el tema oscuro -->
</div>
```

Archivos de tokens:

| Archivo | Qué controla |
|---|---|
| `colors.css` | Paleta semántica: `--surface-*`, `--text-*`, `--border-*`, `--status-*` |
| `dark.css` | Override de colores para `[data-theme="dark"]` |
| `typography.css` | Familias, escalas, pesos: `--font-body`, `--font-mono`, `--text-*` |
| `spacing.css` | Escala de espaciado: `--space-xs` a `--space-3xl` |
| `shape.css` | Radios y bordes: `--radius-sm` a `--radius-full` |
| `elevation.css` | Sombras: `--shadow-sm` a `--shadow-overlay` |
| `motion.css` | Duraciones y easings: `--dur-fast`, `--ease-out`, `--ease-spring` |
| `dataviz.css` | Paleta de visualización de datos |
| `a11y.css` | Focus ring, reduced motion |

**Regla:** los componentes usan tokens semánticos (`var(--surface-card)`, `var(--text-primary)`),
nunca hex ni valores mágicos. Esto es lo que hace que el modo oscuro funcione sin tocar componentes.

## Iconos

Usamos Material Symbols con la clase `flow-icon`:

```tsx
<span className="flow-icon">dashboard</span>
```

La fuente se carga en `tokens/fonts.css`. El catálogo completo está en
[fonts.google.com/icons](https://fonts.google.com/icons?icon.set=Material+Symbols).

## Charts

Todos los charts pasan por el primitive `FlowChart` (wrapper de ECharts).
Nunca uses ECharts directamente — FlowChart maneja temas, responsive y accesibilidad:

```tsx
import { FlowChart } from './ui/primitives/FlowChart'

<FlowChart
  type="bar"
  labels={['Ene', 'Feb', 'Mar']}
  series={[{ label: 'Ventas', values: [100, 200, 150] }]}
  height={200}
/>
```

Tipos soportados: `bar`, `line`, `area`, `stacked`, `stacked100`, `pie`, `radar`,
`heatmap`, `funnel`, `scatter`, `gauge`, `pareto`.

Los componentes de alto nivel (`Donut`, `ScatterPlot`, `BulletChart`, `ParetoChart`,
`Treemap`, `GanttChart`, `SmallMultiples`) envuelven FlowChart con APIs más específicas.

## Stack técnico

| Qué | Con qué |
|---|---|
| UI | React 19 + TypeScript 7 |
| Estilos | CSS Modules + tokens (custom properties). Sin Tailwind |
| Routing | TanStack Router (type-safe) |
| Data | TanStack Query + MSW (mocks en desarrollo) |
| Charts | ECharts vía FlowChart primitive |
| Build | Vite 8 |
| Tests | Vitest + Testing Library |
| Lint | oxlint |
| Iconos | Material Symbols (variable font) |

## Reglas para contribuir

1. **Tokens semánticos siempre.** `var(--surface-card)`, nunca `#ffffff`.
2. **Target táctil de 44px** en todo lo que se pueda tocar.
3. **Foco visible** en todo elemento operable.
4. **Una variante no es un archivo nuevo.** Si es la misma cosa con otro aspecto, es una prop.
5. **Las capas no se saltan.** Un component no importa de patterns. Un primitive no importa de components.
6. **La composición interna no se filtra a la API.** Que Select use Popover + Listbox es asunto interno.

## Estructura de un componente típico

```
src/ui/components/
├── Card.tsx          ← componente + interfaz de props exportada
└── Card.module.css   ← estilos (CSS Module, clases locales)
```

El `.tsx` exporta el componente y su interfaz de props.
El `.module.css` tiene los estilos. Componentes que son wrappers finos no lo necesitan.

## Para agentes de IA

Si eres un agente de IA (Claude, Cursor, Copilot) trabajando en este repo:

1. Lee `CLAUDE.md` — tiene las reglas de arquitectura que debes seguir.
2. Antes de crear un archivo, decide su capa (primitive / component / pattern / template).
3. Busca si ya existe un componente que hace lo que necesitas antes de crear uno nuevo.
4. Usa `npm run typecheck` para verificar que no rompiste tipos.
5. Usa tokens semánticos en los estilos. Grep por `var(--` en cualquier archivo existente para ver el patrón.
6. Los barrel exports en `src/ui/{primitives,components,patterns}/index.ts`
   necesitan incluir cualquier componente nuevo que crees.
