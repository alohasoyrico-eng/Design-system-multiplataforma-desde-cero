# Flow — guía del usuario

Reglas para quien usa Flow **desde su propio repo** — humano o agente. La instalación
paso a paso vive en el README; esta página es el contrato de uso: lo que el sistema
te da resuelto y lo que espera de ti a cambio. Viaja en el paquete
(`node_modules/@alohasoyrico-eng/flow-react/docs/USUARIO.md`) para que tu agente
la lea sin salir de tu repo.

## Lo mínimo que tu app monta

```tsx
import '@alohasoyrico-eng/flow-react/styles.css'   // tokens + componentes
import '@alohasoyrico-eng/flow-react/reset.css'    // opcional: solo si Flow es tu único DS
import { FlowIntlProvider } from '@alohasoyrico-eng/flow-react'

<FlowIntlProvider locale="es">
  <App />
</FlowIntlProvider>
```

Sin el provider de i18n, los patterns revientan con `Could not find required intl object`.
Fuentes e iconos: los `<link>` de Google Fonts del README, o las self-hosted para redes con CSP.

## Las siete reglas del usuario

### 1. Tokens sí, hex no — también en TU CSS

Todo estilo propio que conviva con Flow usa los tokens semánticos
(`var(--surface-card)`, `var(--text-primary)`, `var(--space-4)`). El pago es
inmediato: modo oscuro gratis. Un hex tuyo se ve bien en claro y se rompe en
`data-mode="dark"`.

```html
<html data-mode="dark">   <!-- ese atributo ES el contrato de theming -->
<div data-density="compact">   <!-- y este el de densidad -->
```

`FlowModeProvider`/`useFlowMode` administran `data-mode` por ti (resuelven
`system` y exponen `toggle`).

### 2. Busca antes de construir

Hay **127 piezas**. Antes de escribir un componente propio, pregunta si ya existe:
`list_inventory` y `get_contract` en el MCP, o el sitio de docs. Una pieza que te
falte de verdad es una petición al equipo del DS (demanda medida = prioridad), no
una copia local.

### 3. No toques los interiores

Los class names de los CSS Modules de Flow son privados y cambian sin aviso.
Extender es: la prop `style` para el ajuste puntual, los tokens para el theming,
y `variant`/`size`/`tone` para lo previsto. Un selector tuyo contra `.flow-*` o
contra un hash de módulo es deuda que revienta en cualquier versión.

### 4. Overlays y foco vienen resueltos — no los reimplementes

`Dialog`, `Drawer`, `BottomSheet`, `Menu`, `Popover` traen el pacto completo:
foco que entra y vuelve al disparador, Tab atrapado dentro, Escape que cierra
solo la capa más alta. Un modal casero pierde las tres cosas y ningún test tuyo
lo va a notar. Compón los de Flow.

### 5. Formularios con nombre y autorrelleno

- `Field` etiqueta: su `htmlFor` apunta al `id` **real** del control (un
  `htmlFor` sin `id` es una etiqueta rota que se ve perfecta).
- El estado inválido se llama **`invalid`** en todo el sistema. En `Input`,
  `error` aún funciona como alias deprecado — migra: se retira en 1.0.
- Pasa `autoComplete` (`email`, `current-password`, `tel`): sin eso, el gestor
  de contraseñas de tus usuarios no funciona.

### 6. No hay componente Text — a propósito

La tipografía son roles consumidos con `font:` en CSS:

```css
.miTitulo { font: var(--type-title-lg); }
.miDato   { font: var(--type-data); }      /* horas, IDs, montos: familia de dato */
```

Si migras desde un sistema con `<Text>`, el puente es un shim **en tu app** que
mapea variantes a roles — no le pidas el componente al DS.

### 7. Gráficas por FlowChart, iconos por ligadura

- Nunca ECharts directo: `FlowChart` (o `Donut`, `Bars`, `ScatterPlot`,
  `Treemap`, `GanttChart`…) — traen carga perezosa, estados vacíos con texto,
  modo oscuro y teclado resueltos.
- Iconos: `<span className="flow-symbol" aria-hidden="true">nombre_snake</span>`.
  Nombres legacy estilo Feather: `mapEoneIcon('refresh-cw')`.

## Antipatrones que vemos y cómo se llaman

| Lo que hiciste | Por qué duele |
|---|---|
| `color: #0F172A` en tu CSS | Se rompe en dark. Usa `--text-primary` |
| `<div onClick>` como botón | Ni teclado ni lector. Usa `Button`/`IconButton` o `role`+`tabIndex` completos |
| Modal propio con `position: fixed` | Sin trampa de foco ni Escape por capas. Usa `Dialog` |
| Sobrescribir `.flow-symbol { font-size: 13px }` | La escala es 16/20/24. Usa las clases de tamaño |
| `error={...}` en Input nuevo | Alias deprecado. Es `invalid` |
| Copiar una pieza de Flow para "ajustarla" | Pide la variante al DS: una copia local queda huérfana de cada arreglo futuro |

## Para agentes

1. Conecta el **MCP server** (sección del README) y consulta antes de escribir:
   `get_contract("bottom-sheet")` te da la API con descripciones, cuándo usarla
   y cuándo no, y su madurez por plataforma.
2. Las 190 fichas también viajan en el paquete:
   `import contracts from '@alohasoyrico-eng/flow-react/contracts'`.
3. Versionado: 0.x — la API puede moverse entre minors; los deprecados
   (`error`, `DateRangePicker`) anuncian su retiro en 1.0.
4. Si un componente de Flow parece incumplir su contrato, no lo parches en tu
   repo: repórtalo — hay 395 criterios de conformance con test del lado del DS.

## Migración desde Flow 1.x

La ruta completa (convivencia, `compat-eone.css`, mapa de iconos, renombres)
está en el README del paquete, sección «Migración desde Flow 1.x».
