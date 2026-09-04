# Flow

Un design system multiplataforma listo para armar interfaces — dashboards, formularios, tablas, mapas, chats, wizards — sin empezar de cero cada vez.

Piensa en Flow como una caja de LEGO para pantallas: cada pieza encaja con las demás, se ve bien en claro y en oscuro, y funciona en React (web/desktop) y Flutter (móvil).

## Empieza aquí: tu primera pantalla con Flow

Este es el camino de cualquier colaborador que construye producto: instalar el paquete y ver algo renderizado antes de escribir la primera línea propia.

### React

Flow se publica en GitHub Packages (binarios precompilados). Una sola vez por proyecto, crea un `.npmrc`:

```
@alohasoyrico-eng:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

(`GITHUB_TOKEN` es un personal access token con permiso `read:packages` — cualquiera del equipo lo genera en GitHub → Settings → Developer settings.)

```bash
npm install @alohasoyrico-eng/flow-react
```

Tu primera pantalla (en un proyecto Vite + React):

```tsx
// src/main.tsx
import { createRoot } from 'react-dom/client'
import { Button, Card, StatTile } from '@alohasoyrico-eng/flow-react'
import '@alohasoyrico-eng/flow-react/styles.css'

createRoot(document.getElementById('root')!).render(
  <Card>
    <StatTile label="Unidades activas" value="128" icon="local_taxi" />
    <Button variant="primary" icon="add">Agregar unidad</Button>
  </Card>,
)
```

`npm run dev` y ya estás viendo Flow renderizado. A partir de aquí: el catálogo completo vive en el sitio de docs y cada pieza se importa igual que estas tres.

<details>
<summary>Alternativa sin registry: instalar desde git</summary>

```bash
npm install github:alohasoyrico-eng/Design-system-multiplataforma-desde-cero
```

Funciona igual, pero el build de librería corre en tu máquina al instalar (hook `prepare`).
</details>

Dos cosas más en tu `index.html` para que la tipografía e iconos carguen:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;600;700&display=swap" rel="stylesheet" />
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,300..600,0..1,0&display=swap" rel="stylesheet" />
```

Y copia la fuente de marca (self-hosted) a tu carpeta pública:

```bash
cp node_modules/@alohasoyrico-eng/flow-react/public/fonts/*.woff2 public/fonts/
```

`react` y `react-dom` (>=18) son peer dependencies: los pone tu proyecto. `echarts`, `react-intl` y `flag-icons` son dependencias del paquete y npm las instala solo — pero **solo pagas lo que importas**: el paquete se distribuye como un módulo por componente con `sideEffects` declarado, así que `echarts` solo entra a tu bundle si usas una gráfica y el CSS de `flag-icons` solo si usas `Flag`.

#### El proveedor de i18n es obligatorio

Los patterns (TopBar, Wizard, Settings, GlobalSearch…) leen sus textos de `react-intl`. Sin un provider en el árbol, el render revienta con `Could not find required intl object`. El paquete exporta el suyo:

```tsx
import { FlowIntlProvider } from '@alohasoyrico-eng/flow-react'

<FlowIntlProvider locale="es">
  <App />
</FlowIntlProvider>
```

Si tu aplicación ya monta un `IntlProvider` de `react-intl`, también sirve.

#### Reset global: opt-in

`styles.css` trae tokens y componentes, **nada más**: ningún selector de elemento desnudo. El reset (`box-sizing`, `margin: 0`, `body`, `font: inherit` en controles) vive aparte y lo carga la aplicación que lo quiera:

```tsx
import '@alohasoyrico-eng/flow-react/reset.css'   // opcional
import '@alohasoyrico-eng/flow-react/styles.css'
```

Una app 100% Flow importa los dos. Una app en **migración gradual** — conviviendo con otro design system u otro reset (Tailwind preflight, normalize) — importa solo `styles.css` y conserva el suyo: los componentes de Flow solo asumen `box-sizing: border-box`, que cualquier reset moderno ya pone. La clase de iconos es `flow-symbol`, con prefijo propio para no chocar con sistemas anteriores.

#### Instalación local (sin registry)

Para probar el paquete sin publicarlo, empaquétalo y instala el `.tgz`:

```bash
npm pack                      # en el repo de Flow → alohasoyrico-eng-flow-react-x.y.z.tgz
npm install ../ruta/al.tgz    # en tu proyecto
```

Evita `file:` a la carpeta: npm no instala las dependencias de un enlace a directorio; con el `.tgz` sí.

#### Entornos con CSP (sin Google Fonts)

Si tu red corporativa bloquea `fonts.googleapis.com`, los iconos se pintan como texto (`expand_more`). El paquete trae las tres familias self-hosted:

```bash
cp -r node_modules/@alohasoyrico-eng/flow-react/public/fonts public/
```

```html
<link rel="stylesheet" href="/fonts/selfhost.css" />
```

Eso sustituye a los `<link>` de Google Fonts (Ubuntu, IBM Plex Mono y Material Symbols Rounded; ~3.3 MB una vez, cacheable). La fuente de marca Edenred viaja en la misma carpeta.

---

## Migración desde Flow 1.x (eOne)

La ruta pantalla-a-pantalla, con los puentes que trae el paquete:

1. **Convivencia**: importa solo `styles.css` (sin `reset.css`) — la hoja no trae selectores desnudos y la clase de iconos es `flow-symbol`, así que no pisa al 1.x. Migra pantalla por pantalla.
2. **Variables viejas**: añade `@alohasoyrico-eng/flow-react/compat-eone.css` — las 56 custom properties que tu CSS propio consume (`--sys-energy-*`, `--ref-frame-*`, `--edenred-brand-official`…) quedan apuntando a los tokens nuevos. Retírala al terminar.
3. **Iconos**: los nombres estilo Feather se traducen con el mapa empaquetado:
   ```ts
   import { mapEoneIcon } from '@alohasoyrico-eng/flow-react'
   <Button icon={mapEoneIcon('refresh-cw')} />   // → 'refresh'
   ```
   Los dos nombres inválidos del 1.x también resuelven (`x`→`close`, `navigation` existe).
4. **Theming**: `FlowThemeProvider`/`useFlowTheme` se sustituyen por `FlowModeProvider`/`useFlowMode` (administra `data-mode` en `<html>`, resuelve `system` y expone `toggle`).
5. **Componentes renombrados o absorbidos**:
   - `FlowButton variant="outlined"` → `variant="secondary"` (codemod de búsqueda y reemplazo); `variant="link"` ya existe.
   - `FlowTag` → `StatusPill` (tonos `success|warning|danger|info|neutral`); el `variant=code` es `InlineCode`.
   - `FlowKPICard` → `StatTile` · `FlowDataTable` → `Table` + `Pagination` + `ActiveFilters` · `FlowMultiSelect` → `Select multiple` · `FlowFullscreenSheet` → `BottomSheet fullscreen`.
   - `DateRangePicker` sigue exportado como alias deprecado de `DatePicker mode="range"`.
6. **Text (×841)**: el DS no tiene componente Text a propósito — la tipografía son roles `--type-*` consumidos con `font:`. El puente es un shim en eOne (capa de la app) que mapea variantes a roles: `caption`→`--type-data-sm`, `label-s`→`--type-label-sm`, `heading-*`→`--type-title-*`, `code`→`--type-data`.
7. **i18n**: envuelve la app con `FlowIntlProvider` (o tu propio `IntlProvider` de react-intl).

### Flutter

```yaml
# pubspec.yaml
dependencies:
  flow_ds:
    git:
      url: https://github.com/alohasoyrico-eng/Design-system-multiplataforma-desde-cero.git
      path: flutter
```

```dart
import 'package:flow_ds/flow_ds.dart';

FlowTheme(
  scheme: FlowScheme.light,
  child: FlowButton(label: 'Agregar', variant: FlowButtonVariant.primary),
)
```

### Contratos (para tooling y agentes)

Los 182 contratos que alimentan la documentación también se exportan del paquete:

```ts
import contracts from '@alohasoyrico-eng/flow-react/contracts'
```

## Qué hay en la caja

**121 piezas React** + **93 widgets Flutter**, organizadas en cuatro niveles:

### Primitives (49)

Los ladrillos. Cada una hace una sola cosa bien.

`AutoGrid` `Avatar` `Badge` `Breadcrumb` `Button` `Calendar` `ChartLegend` `ChatMessage` `Checkbox` `Chip` `ChipGroup` `CircularProgress` `ControlShell` `DetailRow` `Divider` `EmptyState` `Field` `Flag` `FlowChart` `FlowLogo` `IconButton` `InlineCode` `Input` `LimitBar` `Listbox` `OverlayShell` `PageFrame` `Pagination` `Popover` `Progress` `Radio` `SectionBar` `SectionHeader` `Select` `SheetBody` `Skeleton` `Slider` `Sparkline` `Specimen` `Spinner` `StatusPill` `StatusView` `Stepper` `Switch` `TabBar` `Textarea` `Timeline` `Toast` `ToggleControl`

### Components (41)

Combinan primitives para resolver necesidades de interfaz.

**Layout y navegación** — `Accordion` `BottomSheet` `Card` `CardCarousel` `CardMedia` `CodeBlock` `DataGrid` `Dialog` `Drawer` `Menu` `NavBar` `PeekSheet` `QuickAction` `QuickActionBar` `SectionRule` `SegmentedControl` `Sidebar` `Table` `TableTree` `Tabs` `Tooltip`

**Formularios y entrada** — `ChatComposer` `DatePicker` `DateRangePicker` `FileUpload` `FilterBar` `KanbanBoard` `OTPInput`

**Dataviz** — `Bars` `BulletChart` `ChatThread` `Donut` `GanttChart` `MapCanvas` `ParetoChart` `ScatterPlot` `SmallMultiples` `StatTile` `Treemap`

**Comunicación** — `HelpCenter` `NotificationCenter`

### Patterns (31)

Resuelven tareas recurrentes de negocio.

`AnatomyView` · `AuthForm` · `BalanceDisplay` · `BiometricPrompt` · `BulkActionsTable` · `DocFooter` · `DocHero` · `DownloadCard` · `FilterableEditableTable` · `GlobalSearch` · `GuidanceCard` · `InputAmount` · `InputPhone` · `InstallCard` · `NavCard` · `NipReveal` · `OnboardingCarousel` · `PageHeader` · `PasscodeKeypad` · `PaymentCard` · `PlaygroundCanvas` · `ProfileMenu` · `ProposalCard` · `RoleMatrix` · `RouteBanner` · `Settings` · `StateGrid` · `TopBar` · `TransactionGroup` · `TransactionRow` · `Wizard`

### Templates

Pantallas completas funcionando en la app demo:

**Desktop** — `Dashboard` (5 vistas: Overview, Combustible, Mantenimiento, Electromovilidad, Finanzas) · `Units` · `Drivers` · `Reports` · `Agent Chat` · `Mailings` · `Config Roles` · `Settings` · `Wizard` · `Auth` · `Onboarding` · `Wallet` · `Primitives Showcase` · `TopBar Demo` · `Component Detail` (parametrizado, alimentado por 182 contratos)

**Internal Tools (CRM)** — `Resumen` · `Cuentas` · `Casos` · `Tickets` · `Pricing` · `Growth` · `Backoffice`

**Mobile** — `Wallet App` (4 tabs) · `Drivers App` · `Onboarding Driver` · `Auth OTP` · `Rutas`

## Cómo se usa una pieza

Importa, pasa props, listo. VS Code te autocompleta todo:

```tsx
import { Button, Card, StatTile } from '@alohasoyrico-eng/flow-react'

<Card>
  <StatTile label="Unidades activas" value="128" icon="local_taxi" />
  <Button variant="primary" icon="add">Agregar unidad</Button>
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
<div data-mode="dark"><!-- todo lo de adentro se pone oscuro --></div>
```

### Tokens más usados

| Superficie | Texto | Borde | Estado |
|---|---|---|---|
| `--surface-canvas` | `--text-primary` | `--border-subtle` | `--status-success` |
| `--surface-card` | `--text-secondary` | `--border-default` | `--status-warning` |
| `--surface-sunken` | `--text-muted` | `--border-strong` | `--status-danger` |
| `--surface-inverse` | `--text-accent` | `--border-focus` | `--status-info` |

### Sistema de tokens (20 archivos, 3 capas)

Los tokens siguen una cadena `ref → sys → comp`:

```
ref (valores crudos)  →  sys (decisiones de UI)  →  comp (overrides por componente)
```

**Ref** (`src/tokens/ref/`): escala cruda platform-agnostic — `colors` · `elevation` · `iconography` · `motion` · `radius` · `sizing` · `spacing` · `typography`

**Sys** (`src/tokens/`): aliases semánticos + density — `a11y` · `colors` · `dark` · `dataviz` · `elevation` · `fonts` · `iconography` · `motion` · `products` · `shape` · `spacing` · `typography`

### Density

Tres densidades que ajustan spacing, radios, sizing y tipografía:

```html
<div data-density="compact"><!-- tabla densa, data-heavy --></div>
<div data-density="comfortable"><!-- lectura relajada --></div>
<!-- sin atributo = default -->
```

La referencia completa está en `CLAUDE.md`.

## Growth: medición y experimentos

Flow trae un foundation de growth agnóstico de proveedor — Mixpanel, Firebase o lo que exista en 5 años son adapters de ~15 líneas, nunca una dependencia:

```tsx
import { FlowGrowthProvider, useTrack, consoleAdapter } from '@alohasoyrico-eng/flow-react'

// En la raíz (consoleAdapter para dev; tu adapter real en prod):
<FlowGrowthProvider adapter={consoleAdapter}>...</FlowGrowthProvider>

// En un template — por hook:
const track = useTrack()
track('report_exported', { format: 'csv', range_days: 30 })
```

O declarativo — cualquier pieza se vuelve medible sin tocarla:

```tsx
<div data-growth-event="unit_added" data-growth-source="manual">
  <Button icon="add">Agregar unidad</Button>
</div>
```

**Governance (research):** todo evento vive en `src/growth/events.json` antes de dispararse (`proposed` → `approved`, CODEOWNERS exige su review). Dispara un evento no aprobado y la consola te lo dice en dev. Los experimentos usan `useExperiment(id, fallback)`. La regla de arquitectura: **la cascada nunca trackea sola** — primitives, components y patterns no saben que growth existe (hay compliance test); el tracking se cablea en templates y productos. Diccionario navegable en el sitio de docs (`/growth`).

## Iconos

Material Symbols. Escribes el nombre y aparece:

```tsx
<span className="flow-symbol">dashboard</span>
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

FlowButton(label: 'Agregar', variant: FlowButtonVariant.primary, icon: Icons.add)
```

El theme se provee con el widget `FlowTheme` y un esquema: `FlowTheme(scheme: FlowScheme.light, child: ...)` — o `FlowScheme.dark` para modo oscuro. Los widgets lo leen con `FlowTheme.of(context)`.

---

## Arquitectura

Las piezas solo pueden usar piezas más simples que ellas:

```
foundations  →  tokens: colores, tamaños, tiempos, forma, motion (sin JSX)
primitives  →  controles atómicos (Button, Input, Badge...)
components  →  combinan primitives (Card, Table, Dialog...)
patterns    →  resuelven tareas de negocio (AuthForm, PaymentCard, TopBar...)
templates   →  pantallas completas (se copian, no se importan)
```

Un `Card` (component) puede usar `Button` (primitive). Pero un `Button` no puede usar `Card`. Si necesitas que dos piezas del mismo nivel compartan algo, baja eso compartido al nivel de abajo.

30 compliance tests verifican estas reglas mecánicamente — no se puede hacer merge si un primitive importa de components o un CSS module declara sus propios `@keyframes`.

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

## Para mantenedores (equipo de diseño)

Clonar y correr el repo es la ruta de quien **mantiene el sistema**, no la de quien construye producto:

```bash
git clone git@github.com:alohasoyrico-eng/Design-system-multiplataforma-desde-cero.git
cd Design-system-multiplataforma-desde-cero
npm install
npm run dev
```

Abre `localhost:5173` — la app demo con todas las pantallas (dashboards, wallet móvil, internal tools, Component Detail). El sitio de documentación vive en [su propio repo](https://github.com/alohasoyrico-eng/Docs-para-design-system-multiplataforma-desde-cero) y **lo gobierna el equipo de diseño exclusivamente**: consume este paquete y recibe los contratos vía `npm run sync:docs`.

**Publicar una versión nueva:** sube `version` en `package.json`, luego

```bash
git tag v0.1.1 && git push --tags
```

El workflow `publish.yml` corre los gates y publica a GitHub Packages solo.

## Verificación

```bash
npm run typecheck    # TypeScript — cero errores
npm run test         # 708 tests — todos pasan
npm run build        # build de la app demo
npm run build:lib    # build del paquete consumible (dist-lib/)
```

Flutter tiene sus propios gates:

```bash
cd flutter && flutter analyze && flutter test
```

CI (GitHub Actions) corre todo esto en cada push y PR — web y Flutter.

## Sincronización con el repo de docs

El sitio de documentación ([flow-docs](https://github.com/alohasoyrico-eng/Docs-para-design-system-multiplataforma-desde-cero)) consume los contratos y tokens de este repo. La copia nunca se hace a mano:

```bash
npm run sync:docs          # copia items.json + tokens a ../flow-docs
npm run sync:docs:check    # detecta drift sin copiar (exit 1 si hay)
```

Si el repo de docs vive en otra ruta: `FLOW_DOCS_PATH=/ruta npm run sync:docs`.

## Stack

| Capa | Tecnología |
|---|---|
| UI | React 19 · TypeScript · CSS Modules |
| Routing | TanStack Router |
| Data | TanStack Query |
| Charts | ECharts (via FlowChart) |
| Icons | Material Symbols |
| Flags | flag-icons (via el primitive Flag) |
| i18n | react-intl — strings con default en español; catálogo de locales planeado |
| Testing | Vitest · Testing Library (101 archivos, 708 tests, 30 compliance) |
| Build | Vite |
| Mobile | Flutter · Dart |
| Styling | Tokens semánticos ref→sys→comp — sin Tailwind |

---

## Usar Flow desde otro proyecto (MCP Server)

Si trabajas en un proyecto que consume Flow y usas un agente de IA (Claude Code, Cursor, etc.), puedes conectar el servidor MCP para que tu agente consulte las piezas, tokens y reglas sin salir de tu repo.

### 1. Prepara el servidor (una vez — requiere este repo clonado en tu máquina)

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
2. La fuente de verdad de cada pieza es su contrato en `src/data/items.json` (181 entries: API, tokens, when/notWhen, a11y, plataformas). Si cambias la API de una pieza, actualiza su contrato y corre `npm run sync:docs`.
3. Antes de crear un archivo, decide su capa (primitive / component / pattern).
4. Busca si ya existe una pieza que haga lo que necesitas — hay 121.
5. Usa tokens semánticos (`var(--surface-card)`), nunca hex (`#ffffff`).
6. Corre `npm run typecheck` después de cada cambio.
7. Agrega cada pieza nueva al `index.ts` de su capa y crea su test.
8. Si el cambio toca Flutter, mantén paridad: cada widget React tiene su equivalente en `flutter/lib/src/`.

Si trabajas desde **otro repo**, conecta el MCP server (sección anterior).
