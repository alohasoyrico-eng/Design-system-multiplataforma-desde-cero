# Flow

Un design system multiplataforma listo para armar interfaces — dashboards, formularios, tablas, mapas, chats, wizards — sin empezar de cero cada vez.

Piensa en Flow como una caja de LEGO para pantallas: cada pieza encaja con las demás, se ve bien en claro y en oscuro, y funciona en React (web/desktop) y Flutter (móvil).

## Vélo corriendo en 30 segundos

```bash
git clone git@github.com:alohasoyrico-eng/Design-system-multiplataforma-desde-cero.git
cd Design-system-multiplataforma-desde-cero
npm install
npm run dev
```

Abre `localhost:5173`. Vas a ver un sidebar con 13 pantallas funcionando — dashboards con gráficas reales, tablas editables, un mapa con pins, un chat, un wizard paso a paso, una wallet móvil, y más.

## Qué hay en la caja

**92 piezas React** + **93 widgets Flutter** con paridad completa, organizadas en cuatro niveles:

### Primitives (24)

Los ladrillos. Cada una hace una sola cosa bien.

`Avatar` `Badge` `Button` `ChartLegend` `ChatMessage` `Checkbox` `Chip` `DetailRow` `Divider` `Field` `Flag` `FlowChart` `IconButton` `Input` `Progress` `Radio` `SectionHeader` `Select` `Skeleton` `Slider` `Sparkline` `Spinner` `Switch` `Textarea`

### Components (49)

Combinan primitives para resolver necesidades de interfaz.

**Layout y navegación** — `Accordion` `BottomSheet` `Breadcrumb` `Card` `CardMedia` `Dialog` `Drawer` `Menu` `NavBar` `Pagination` `PeekSheet` `RouteBanner` `SegmentedControl` `SheetBody` `Sidebar` `Stepper` `TabBar` `Table` `TableTree` `Tabs` `Timeline` `Toast` `Tooltip` `TopBar`

**Formularios y entrada** — `ChatComposer` `DatePicker` `FileUpload` `FilterBar` `GlobalSearch` `KanbanBoard` `OTPInput`

**Dataviz** — `Bars` `BulletChart` `CircularProgress` `Donut` `GanttChart` `LimitBar` `MapCanvas` `ParetoChart` `ScatterPlot` `SmallMultiples` `StatTile` `Treemap`

**Comunicación** — `ChatThread` `EmptyState` `HelpCenter` `NotificationCenter` `QuickAction` `StatusView`

### Patterns (19)

Resuelven tareas recurrentes de negocio.

`AuthForm` · `BalanceDisplay` · `BiometricPrompt` · `BulkActionsTable` · `CardCarousel` · `FilterableEditableTable` · `InputAmount` · `InputPhone` · `NipReveal` · `OnboardingCarousel` · `PasscodeKeypad` · `PaymentCard` · `ProfileMenu` · `QuickActionBar` · `RoleMatrix` · `Settings` · `TransactionGroup` · `TransactionRow` · `Wizard`

### Templates (13 páginas)

Pantallas completas funcionando: `Dashboard` (5 vistas: Overview, Combustible, Mantenimiento, Electromovilidad, Finanzas) · `Units` · `Drivers` · `Reports` · `Agent Chat` · `Mailings` · `Config Roles` · `Settings` · `Wizard` · `Auth` · `Onboarding` · `Wallet` · `Primitives Showcase`

## Cómo se usa una pieza

Importa, pasa props, listo. VS Code te autocompleta todo:

```tsx
import { Button } from './ui/primitives'
import { Card, StatTile } from './ui/components'

<Card>
  <StatTile label="Unidades activas" value="128" icon="local_taxi" />
  <Button variant="accent" icon="add">Agregar unidad</Button>
</Card>
```

Cada pieza acepta `style` para ajustes puntuales. Las variaciones de apariencia se controlan con `variant`, el tamaño con `size`.

## Tokens y modo oscuro

Flow usa tokens semánticos en vez de hex. El modo oscuro funciona solo:

```css
.miTarjeta {
  background: var(--surface-card);
  color: var(--text-primary);
  border: 1px solid var(--border-subtle);
}
```

```html
<div data-theme="dark"><!-- todo lo de adentro se pone oscuro --></div>
```

### Tokens más usados

| Superficie | Texto | Borde | Estado |
|---|---|---|---|
| `--surface-canvas` | `--text-primary` | `--border-subtle` | `--status-success` |
| `--surface-card` | `--text-secondary` | `--border-default` | `--status-warning` |
| `--surface-sunken` | `--text-muted` | `--border-strong` | `--status-danger` |
| `--surface-inverse` | `--text-accent` | `--border-focus` | `--status-info` |

### Sistema de tokens (16 archivos, 3 capas)

Los tokens siguen una cadena `ref → sys → comp`:

```
ref (valores crudos)  →  sys (decisiones de UI)  →  comp (overrides por componente)
```

**Ref** (`src/tokens/ref/`): escala cruda platform-agnostic — `spacing` · `radius` · `sizing` · `typography`

**Sys** (`src/tokens/`): aliases semánticos + density — `colors` · `dark` · `typography` · `spacing` · `shape` · `elevation` · `motion` · `dataviz` · `fonts` · `iconography` · `a11y` · `products`

### Density

Tres densidades que ajustan spacing, radios, sizing y tipografía:

```html
<div data-density="compact"><!-- tabla densa, data-heavy --></div>
<div data-density="comfortable"><!-- lectura relajada --></div>
<!-- sin atributo = default -->
```

La referencia completa está en `CLAUDE.md`.

## Iconos

Material Symbols. Escribes el nombre y aparece:

```tsx
<span className="flow-icon">dashboard</span>
```

Catálogo: [fonts.google.com/icons](https://fonts.google.com/icons?icon.set=Material+Symbols)

## Gráficas

`FlowChart` envuelve ECharts. Un solo componente, 12 tipos:

```tsx
<FlowChart
  type="bar"
  labels={['Ene', 'Feb', 'Mar']}
  series={[{ label: 'Ventas', values: [100, 200, 150] }]}
  height={200}
/>
```

Tipos: `bar` · `line` · `area` · `pie` · `radar` · `heatmap` · `funnel` · `scatter` · `gauge` · `pareto` · `stacked` · `stacked100`

Componentes especializados (`Donut`, `BulletChart`, `ScatterPlot`, `GanttChart`, `ParetoChart`, `Treemap`, `SmallMultiples`) ofrecen APIs más directas sobre FlowChart.

## Flutter

Paridad completa con React. 93 widgets en `flutter/`:

```bash
cd flutter
flutter pub get
```

```dart
import 'package:flow_ds/flow_ds.dart';

FlowButton(label: 'Agregar', variant: FlowButtonVariant.accent, icon: Icons.add)
```

Los tokens (`FlowTokens`) y el theme (`FlowTheme`) se aplican con `FlowTheme.light()` o `FlowTheme.dark()`.

---

## Arquitectura

Las piezas solo pueden usar piezas más simples que ellas:

```
tokens       →  colores, tamaños, tiempos (sin JSX)
shells       →  carcasas internas (borde, foco, backdrop)
primitives   →  controles atómicos (Button, Input, Badge...)
components   →  combinan primitives (Card, Table, Dialog...)
patterns     →  resuelven tareas de negocio (AuthForm, Settings...)
templates    →  pantallas completas (se copian, no se importan)
```

Un `Card` (component) puede usar `Button` (primitive). Pero un `Button` no puede usar `Card`. Si necesitas que dos piezas del mismo nivel compartan algo, baja eso compartido al nivel de abajo.

### Para crear una pieza nueva

1. Decide en qué nivel va: ¿Control atómico? → `src/ui/primitives/`. ¿Combina controles? → `src/ui/components/`. ¿Tarea de negocio? → `src/ui/patterns/`.

2. Crea el componente y sus estilos:
```
src/ui/components/MiPieza.tsx
src/ui/components/MiPieza.module.css
```

3. Exporta las props con `export interface`.

4. Agrega al barrel: `src/ui/components/index.ts`

5. Crea el test: `src/ui/components/__tests__/MiPieza.test.tsx`

6. Verifica:
```bash
npm run typecheck
npm run test
```

Las reglas completas y la receta detallada están en `CLAUDE.md`.

## Verificación

```bash
npm run typecheck   # TypeScript — cero errores
npm run test        # 670 tests — todos pasan
npm run build       # build de producción
```

## Stack

| Capa | Tecnología |
|---|---|
| UI | React 19 · TypeScript · CSS Modules |
| Routing | TanStack Router |
| Data | TanStack Query |
| Charts | ECharts (via FlowChart) |
| Icons | Material Symbols |
| Testing | Vitest · Testing Library (99 archivos, 670 tests) |
| Build | Vite |
| Mobile | Flutter · Dart |
| Styling | Tokens semánticos — sin Tailwind |

---

## Usar Flow desde otro proyecto (MCP Server)

Si trabajas en un proyecto que consume Flow y usas un agente de IA (Claude Code, Cursor, etc.), puedes conectar el servidor MCP para que tu agente consulte las piezas, tokens y reglas sin salir de tu repo.

### 1. Prepara el servidor (una vez)

```bash
cd mcp-server
npm install
npm run build
```

### 2. Conecta tu proyecto

En tu otro proyecto, crea o edita `.claude/settings.json`:

```json
{
  "mcpServers": {
    "flow-ds": {
      "command": "node",
      "args": ["/ruta/a/Flow/mcp-server/dist/server.js"]
    }
  }
}
```

### 3. Tu agente ahora puede

| Herramienta | Para qué |
|---|---|
| `list_inventory` | "¿Qué piezas hay?" |
| `get_component_api("Button")` | "¿Qué props acepta Button?" |
| `get_tokens("colors")` | "¿Cuáles son los colores?" |
| `get_architecture_rules` | "¿Cuáles son las reglas?" |
| `validate_import(from, to)` | "¿Este import está bien?" |

---

## Para agentes de IA

Si eres un agente trabajando **dentro** de este repo:

1. Lee `CLAUDE.md` antes de tocar código — tiene las reglas de arquitectura, la receta para crear componentes, y la referencia completa de tokens.
2. Antes de crear un archivo, decide su capa (primitive / component / pattern).
3. Busca si ya existe una pieza que haga lo que necesitas — hay 92.
4. Usa tokens semánticos (`var(--surface-card)`), nunca hex (`#ffffff`).
5. Corre `npm run typecheck` después de cada cambio.
6. Agrega cada pieza nueva al `index.ts` de su capa y crea su test.
7. Si el cambio toca Flutter, mantén paridad: cada widget React tiene su equivalente en `flutter/lib/src/`.

Si trabajas desde **otro repo**, conecta el MCP server (sección anterior).
