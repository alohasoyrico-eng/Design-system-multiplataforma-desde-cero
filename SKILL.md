# Flow Design System — SKILL

Design system para productos de movilidad (Drivers App, Fleet Dashboard, Internal Tools). Dirección visual **Canvas**: claro y aireado, arenas cálidas, rojo `#FF3617` quirúrgico (solo acción/estado vivo/foco), geometría muy redondeada, micro-interacciones de resorte. Un solo tema. El **modo oscuro** (`data-mode="dark"` en `<html>` o cualquier subtree) son los mismos tokens semánticos con otros valores, en `tokens/dark.css`.

## Arquitectura

Cascada en cinco capas: **foundations → primitives → components → patterns → templates**, con las dependencias solo hacia abajo. Cada frontera es una propiedad estructural, recomputable desde el artefacto: foundations no lleva JSX; primitives es hoja del grafo (solo tokens y shells); components exporta un componente con contrato de props; **un pattern no tiene una sola API** (es una receta con estado a través de pasos); un template nombra una pantalla real con contenido final. El **dominio no decide la capa**: es el campo `domain`.

Contrato legible por máquina en `architecture.json`, revisión en `platforms/check-layers.mjs`, el porqué en `Arquitectura de capas.dc.html`, y los contratos por ítem en `contracts/`.

## Cómo consumir (agentes)

1. **Lee `readme.md`** — content fundamentals (tono, casing, copy canónico) y visual foundations (reglas de color, motion, elevación).
2. **Carga los tokens**: `<link rel="stylesheet" href="styles.css">` (importa todo `tokens/`). Usa SIEMPRE las custom properties semánticas (`var(--text-primary)`, `var(--surface-card)`, `var(--radius-lg)`…), nunca hex directos — así el dark theme es gratis.
3. **Usa los primitives React** de `components/<grupo>/<Nombre>.jsx`. Cada componente trae:
   - `<Nombre>.d.ts` — contrato de props (fuente de verdad multiplataforma)
   - `<Nombre>.prompt.md` — uso, ejemplo y reglas
4. **Composición de páginas**: parte de los templates en `ui_kits/` — desktop: fleet-dashboard, dashboards/ (6 dashboards con shell compartido), config (RoleMatrix + altas/bajas), auth, auth-otp, onboarding-fm, settings, wizard; mobile (marco iPhone `ios-frame.jsx`): drivers-app, onboarding-driver (2 journeys de alta), wallet (tarjetas/movimientos/quick actions), rutas (MapCanvas OSM); Internal Tools (CRM, shell propia en `internal-tools/`, ver `shell.jsx`): Resumen, Tickets, Cuentas, Pricing, Casos, Back-office, Growth · Onboarding (kanban) — con roles y permisos (`Admin`, `Agente de soporte`, `Pricing/Finanzas`, `Ops/Back-office`, `Growth/Producto`).
5. **Otras plataformas**: `platforms/flow.tokens.json` (W3C), `platforms/angular/_flow-tokens.scss`, `platforms/flutter/flow_tokens.dart`. Los contratos `.d.ts` mapean 1:1 a `@Input()`s de Angular y props de widgets Flutter.

## Reglas duras

- **Rojo con moderación**: `accent` máximo 1 CTA por vista. Danger usa `#D92D20`, NO el rojo marca.
- **Motion**: resorte (`--ease-spring`) para lo que se toca; `--ease-out` para lo que aparece; 100–400ms; respeta `prefers-reduced-motion`.
- **A11y**: foco visible (`--focus-ring`) siempre; hit targets ≥44px; texto ≥4.5:1; `ariaLabel` obligatorio en IconButton; sentence case.
- **Datos en mono** (JetBrains Mono): placas, IDs, KPIs, montos.
- **Iconos**: Material Symbols Rounded únicamente (clase `.flow-symbol`; `--fill` para activo). Nada de emoji ni SVG a mano.
- **Superficies planas**: sin gradientes; jerarquía por superficie + sombra suave.

## Inventario de componentes

- `actions/` Button (primary·accent·secondary·ghost·danger × sm·md·lg, loading), IconButton (badge vivo), Menu (dropdown contextual, danger items)
- `shells/` ControlShell (carcasa de todo control: borde, altura, foco, adornos, pie), Popover (anclaje, colisión, portal, Escape), Listbox (índice activo, teclado, filtrado, ARIA), ToggleControl (target 44px, label clickeable, nativo detrás, indeterminate), OverlayShell (backdrop, scroll lock, foco atrapado y devuelto, Escape por capa, una sola familia de keyframes), DataGrid (columnas, orden con aria-sort, zebra por token, selección con indeterminate, celda editable, árbol, filas de grupo, detalle expandible) — primitivas de comportamiento, no se usan directo
- `forms/` Field, Input, Textarea (contador), Select (`multiple` · `searchable` · `creatable` · `clearable` · `renderOption` — absorbió SelectMultiple, SelectCombo, SelectWithInput, SelectCountry y Combobox), Input (`revealable` para el ojo de contraseña), InputAmount y InputPhone (controles tipados sin label: se componen con Field), Checkbox (indeterminate), Radio (description), Switch (thumb elástico) — los tres son pieles de ToggleControl, Slider (glow al arrastrar), DatePicker (el único calendario: `mode="single"` en ISO, `mode="range"` en `{from,to}` con atajos de 7/30/90 días — absorbió DateRangePicker e InputDate; teclado de rejilla), FileUpload (drag & drop + lista removible)
- `display/` Card (interactive lift), Badge (live pulse), Chip, Avatar (presencia), Table (piel de DataGrid: orden, densidad, detalle expandible), Skeleton (shimmer), EmptyState, Accordion (secciones expandibles), Sparkline + Bars (data-viz ligera, animación resorte)
- `display/` Flag (bandera SVG circular vía flag-icons — nunca emoji), FlowChart (ECharts con tema Flow: 16 tipos, tokens --viz-* en runtime, claro y oscuro sin configurar), GlobalSearch (palette ⌘K / inline, resultados agrupados, teclado)
> Tres campos desaparecieron por no ser componentes: `InputPassword` (el ojo es `revealable` en `Input`), `InputEmail` (validar no es un componente: `Input type="email"` + `error` de `Field`) e `InputDate` (duplicaba `DatePicker`, el único calendario del sistema).

> Cinco charts eran traducción pura de props y desaparecieron: `LineChart`, `StackedBars100`, `Heatmap`, `WaterfallChart` y `PolarChart` se llaman con `FlowChart type="line" | "stacked100" | "heatmap" | "waterfall" | "radar"`. Los siete que quedan **no** son adaptadores: cada uno carga una decisión analítica que `FlowChart` no modela — `Bars` destaca el máximo, `Donut` pone etiqueta central y leyenda con porcentajes, `ParetoChart` ordena y colorea por umbral 80%, `Treemap` colorea por desvío vs presupuesto, `ScatterPlot` marca umbrales de cuadrante, y `BulletChart` y `SmallMultiples` tienen dibujo propio. Son patterns de data-viz, no duplicación. Para algo nuevo usa `FlowChart` directo. `Sparkline` sigue siendo SVG a mano a propósito — 88px dentro de un KPI no justifica montar ECharts.

- `navigation/` Sidebar (secciones colapsables, modo 60px solo-iconos), TopBar (6 variantes: standard/minimal/admin/multientidad/mobile/fullscreen), Tabs (pill/underline, indicador resorte, ←/→), Stepper (check con resorte), Breadcrumb, Pagination (elipsis, mono)
- `feedback/` Dialog (sobre OverlayShell: foco atrapado, scroll lock), Toast/ToastStack, Tooltip, Progress, Spinner, Drawer (panel lateral, sobre OverlayShell), BottomSheet (sheet móvil, `fixed=false` dentro del marco), BiometricPrompt (Face/huella con fallback)
- `components/` (raíz, sin grupo) — TabBar (nav inferior móvil, 4-5 items, badge numérico o punto), StatusView (pantalla de estado al conectar con un servicio: loading/success/error/offline), OnboardingCarousel (bienvenida a pantalla completa, swipe + dots), Timeline (historial vertical con paso activo, error y pending), CircularProgress (ring para tiles donde la barra ocuparía demasiado ancho), NotificationCenter (centro de notificaciones del header), KanbanBoard (tablero por etapa; el board pone columnas y movimiento, la tarjeta la dibuja la pantalla), ChatThread + ChatMessage + ChatComposer (chat de agente: autoscroll, respuestas ricas embebidas, chip de herramienta, sugerencias)
- **Producto fintech/movilidad**: PaymentCard (tarjeta Flow: ink/accent/sand, frozen), TransactionRow (movimientos con categoría), OTPInput + PasscodeKeypad (códigos y passcode), MapCanvas (tiles OSM + pins de precio + ruta), SegmentedControl (segmentado móvil), StatTile + Donut (KPIs de dashboards), RoleMatrix (permisos × roles, sobre DataGrid con filas de grupo)

Los demos `*.card.html` de cada grupo muestran todos los estados renderizados.

## Documentación

`docs/index.html` — sitio navegable con página de detalle por ítem y tabs por audiencia (Diseño / Código / Contenido / Uso). Los patterns marcados "Planned" traen su spec completa antes de construirse.

Nota PaymentCard: define `window.FLOW_ASSET_BASE` con la ruta relativa a la raíz del DS para que cargue el logo.
