# Flow — reglas de arquitectura

Claude Code lee este archivo en cada sesión. La regla está presente cuando se escribe el código,
no cuando ya se mandó a revisión.

## La cascada

`foundations → primitives → components → patterns → templates`

**Antes de crear un archivo, decide su capa. Las dependencias solo van hacia abajo.**
Nunca importes de una capa superior ni de tu propia capa. Si necesitas algo que está al lado,
bájalo a la capa que ambos comparten — no lo copies.

| Capa | Entra si | Puede importar |
|---|---|---|
| foundations | Es una decisión expresable sin JSX (color, tipo, espacio, forma, motion). Cadena ref→sys obligatoria. | nada |
| primitives | **Átomo UI.** Un solo concepto visual, una sola responsabilidad. No importa nada del sistema salvo tokens (foundations). Hoja del grafo. | foundations |
| components | **Molécula UI.** Concepto de **interfaz** compuesto — coordina múltiples sub-conceptos (paneles, estados, sub-áreas) O envuelve interacción compleja (focus trap, scroll virtual, drag). *Debe* componer primitives cuando existe uno que cubra una de sus partes. | primitives |
| patterns | **Receta de dominio.** Nombra un concepto de **negocio**, no de interfaz. *Debe* componer desde components o primitives — si no importa nada de la cascada, le falta composición o le sobra capa. | components |
| templates | **Pantalla ensamblada.** Importa patterns como unidad principal. Si el ratio directo/patterns es >5:1, le faltan patterns intermedios. No crea clases CSS reutilizables — si una clase se repite en 2+ templates, debe promoverse. No declara @keyframes. Inline styles solo para valores runtime. | patterns |

Dos criterios que resuelven casi todas las dudas:

- **¿Nombra un concepto de interfaz o de negocio?** `Select`, `Dialog`, `Table` son components. `PaymentCard`, `RoleMatrix`, `BulkActions` son patterns.
- **¿Cambia la apariencia de los mismos datos, o agrega estado y flujo de trabajo?** Lo primero es una prop. Lo segundo es un pattern.

## Las cuatro reglas

- **R1 — hacia abajo.** Una dependencia externa (una librería de charts, tiles de mapa) no reclasifica la capa: R1 mira el grafo del sistema.
- **R2 — una variante no es un componente.** Un archivo nuevo por cada variación es lo que produce sistemas con catorce copias del mismo borde. Si es la misma cosa con otra piel, es una prop.
- **R3 — una carcasa, un dueño.** Nada redeclara borde+foco+radio de control, backdrop fijo, ni sus propios `@keyframes`. Las animaciones usan transiciones con tokens de motion, no keyframes.
- **R4 — la composición no se filtra a la API.** Que `Select` esté hecho de `Popover` + `Listbox` es asunto interno. Ninguna prop pública nombra sus partes.

## Al escribir componentes

- **Tokens semánticos siempre**, nunca hex ni valores mágicos. Rompe esto y se rompe el modo oscuro.
- **Target de 44px** en cualquier cosa que se toque, incluida la etiqueta.
- **Foco visible** en todo elemento operable.
- **El estado final del render no depende de que corra un frame de animación.** En un iframe en segundo plano, una pestaña oculta o un preview, el componente debe verse completo. Si algo arranca en su frame cero —una barra de altura 0, un panel sin foco— y espera un `requestAnimationFrame` que nunca llega, se ve roto y nadie lo nota en una pestaña activa.
- **Un control no dibuja nada encima de su propia área.** Contadores, iconos y accesorios van en `leading`, `trailing` o `footer` de la carcasa.

---

## Receta: crear un componente nuevo

Estos son los pasos exactos. No te saltes ninguno.

### 1. Decide la capa

¿Es un concepto de interfaz (Table, Dialog)? → `src/ui/components/`
¿Es un concepto de negocio (PaymentCard, AuthForm)? → `src/ui/patterns/`
¿Es un control atómico que no compone nada del sistema? → `src/ui/primitives/`

### 2. Crea el archivo .tsx

```
src/ui/components/MiComponente.tsx
```

Estructura mínima:

```tsx
import type { CSSProperties, ReactNode } from 'react'
import css from './MiComponente.module.css'

export interface MiComponenteProps {
  // props aquí
  style?: CSSProperties
}

export function MiComponente({ style }: MiComponenteProps) {
  return (
    <div className={css.root} style={style}>
      {/* contenido */}
    </div>
  )
}
```

### 3. Crea el archivo .module.css (si necesita estilos propios)

```
src/ui/components/MiComponente.module.css
```

```css
.root {
  /* usa tokens, nunca valores crudos */
  background: var(--surface-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
}
```

Componentes que son wrappers finos (como Table que envuelve DataGrid) no necesitan `.module.css`.

### 4. Exporta la interfaz de props

La interfaz **debe** tener `export` delante:

```tsx
export interface MiComponenteProps {  // ← export obligatorio
```

### 5. Agrega al barrel export

Abre `src/ui/components/index.ts` (o `primitives/index.ts` o `patterns/index.ts` según la capa) y agrega:

```tsx
export { MiComponente, type MiComponenteProps } from './MiComponente'
```

### 6. Verifica

```bash
npm run typecheck   # cero errores
```

---

## Convenciones de props

Estos son los nombres estándar. Úsalos tal cual — no inventes sinónimos.

| Prop | Tipo | Para qué |
|---|---|---|
| `variant` | string union | Variación visual. Ej: `'primary' \| 'secondary' \| 'ghost' \| 'danger'` |
| `size` | `'sm' \| 'md' \| 'lg'` | Tamaño. Default `'md'` |
| `tone` | `'default' \| 'success' \| 'warning' \| 'danger' \| 'info'` | Color semántico (Badge, StatTile) |
| `icon` | `string` | Nombre del icono Material Symbol. Va a la izquierda |
| `iconTrailing` | `string` | Icono a la derecha |
| `disabled` | `boolean` | Inhabilita interacción |
| `loading` | `boolean` | Muestra spinner |
| `style` | `CSSProperties` | Override inline. Casi todo componente lo acepta |
| `children` | `ReactNode` | Contenido. Solo si el componente es contenedor |
| `className` | — | **No lo uses.** Los estilos van en `.module.css` |

### Props de interacción

| Prop | Tipo | Patrón |
|---|---|---|
| `onClick` | `() => void` | Acción primaria |
| `onChange` | `(value: T) => void` | Valor controlado. El tipo depende del componente |
| `onClose` | `() => void` | Para overlays (Dialog, Drawer, BottomSheet) |
| `open` | `boolean` | Controla visibilidad de overlays |
| `value` | `T` | Valor controlado del input/select |

### Props de layout (leading/trailing/footer)

| Prop | Patrón |
|---|---|
| `leading` | Contenido a la izquierda (icono, avatar) |
| `trailing` | Contenido a la derecha (botón, badge) |
| `footer` | Contenido al pie |

---

## Arquitectura de tokens: ref → sys → comp

Los tokens siguen una cadena de tres niveles. Las capas que no son density-sensitive (colores, sombras, motion) se quedan planas.

```
ref (valores crudos)  →  sys (decisiones de UI + density)  →  comp (overrides por componente, opcional)
```

| Capa | Vive en | Qué contiene | Quién la toca |
|---|---|---|---|
| **ref** | `src/tokens/ref/` | Escala cruda: `--ref-space-100: 4px`, `--ref-radius-100: 8px`, `--ref-type-size-14: 14px` | Solo el equipo de foundations |
| **sys** | `src/tokens/spacing.css`, `shape.css`, `typography.css` | Aliases semánticos: `--space-1: var(--ref-space-100)`. Density overrides viven aquí | Foundations + quien agregue densidades |
| **comp** | (futuro) En el `.module.css` del componente | Override puntual: `--button-radius: var(--radius-pill)` | El dueño del componente |

### Density

`data-density` se pone en cualquier nodo del DOM. Los tokens density-sensitive se redefinen para ese subárbol.

```html
<div data-density="compact"><!-- todo aquí es más apretado --></div>
<div data-density="comfortable"><!-- todo aquí es más holgado --></div>
```

**Density-sensitive** (cambian con `data-density`): spacing, radius, sizing/heights, typography, padding/gap.

**Density-independent** (se quedan planos): colores, sombras, motion, dataviz, font families.

### Archivos ref

| Archivo | Tokens |
|---|---|
| `ref/spacing.css` | `--ref-space-100` … `--ref-space-1600` |
| `ref/radius.css` | `--ref-radius-100` … `--ref-radius-pill` |
| `ref/sizing.css` | `--ref-size-target`, `--ref-size-control`, `--ref-size-bar`, layout sizes |
| `ref/typography.css` | `--ref-type-size-*`, `--ref-type-lh-*`, `--ref-type-wt-*`, tracking |

---

## Referencia de tokens

Usa estos tokens en los estilos. Nunca valores crudos.

### Superficies

| Token | Cuándo usarlo |
|---|---|
| `--surface-canvas` | Fondo de la página completa |
| `--surface-card` | Fondo de cards, modals, drawers, popovers |
| `--surface-sunken` | Fondo hundido: inputs, áreas de drop, columnas de kanban |
| `--surface-inverse` | Fondo oscuro para contraste (tooltips, toasts) |
| `--surface-accent-subtle` | Fondo con tinte de acento (filas seleccionadas, highlights) |
| `--surface-backdrop` | Overlay semitransparente detrás de modals |

### Texto

| Token | Cuándo usarlo |
|---|---|
| `--text-primary` | Texto principal: títulos, body, valores |
| `--text-secondary` | Texto secundario: descripciones, subtítulos |
| `--text-muted` | Texto terciario: placeholders, hints, metadata |
| `--text-on-accent` | Texto sobre fondo de acento azul |
| `--text-on-inverse` | Texto sobre fondo inverse |
| `--text-accent` | Texto con color de acento azul (labels activos) |
| `--text-link` | Links. Azul acento |

### Bordes

| Token | Cuándo usarlo |
|---|---|
| `--border-subtle` | Bordes suaves: cards, divisores, filas de tabla |
| `--border-default` | Bordes normales: inputs en reposo |
| `--border-strong` | Bordes enfáticos: hover en inputs, separadores activos |
| `--border-focus` | Borde de foco (azul acento) |

### Estado

| Token | Cuándo usarlo |
|---|---|
| `--status-success` / `-text` / `-bg` | Éxito, completado, activo |
| `--status-warning` / `-text` / `-bg` | Advertencia, pendiente, riesgo |
| `--status-danger` / `-text` / `-bg` | Error, rechazado, peligro |
| `--status-info` / `-text` / `-bg` | Informativo, en progreso |

### Paleta base (Edenred Foundation Core)

| Ramp | Uso | Rango |
|---|---|---|
| `--flow-grey-*` | Neutros (cool slate) | 50–900 |
| `--flow-red-*` | Rojo marca Edenred #F72717 (identidad, NO CTAs) | 50–900 |
| `--flow-blue-*` | Azul acento #0060df (links, foco, info) | 50–900 |
| `--flow-green-*` | Éxito | 50–900 |
| `--flow-orange-*` | Advertencia | 50–900 |
| `--flow-danger-*` | Error/peligro (rojo funcional, NO marca) | 50–700 |

El rojo NO se usa para CTAs ni acciones: el de marca es identidad y el funcional (`--status-danger`) es solo para estados. Las acciones usan `--action-primary` (tinta); el azul (`--action-accent`) queda para links, foco e info. No existe variante `accent` en Button — se eliminó.

### Overlay alpha

| Token | Valor |
|---|---|
| `--alpha-white-5` a `--alpha-white-70` | rgba blanco con opacidades 0.06–0.70 |
| `--alpha-black-5` a `--alpha-black-50` | rgba negro con opacidades 0.06–0.50 |

### Forma

| Token | Valor | Uso |
|---|---|---|
| `--radius-xs` | 8px | Checkboxes, chips pequeños |
| `--radius-sm` | 12px | Inputs interiores, menu items |
| `--radius-md` | 16px | Inputs, selects, cards pequeños |
| `--radius-lg` | 20px | Cards, secciones |
| `--radius-xl` | 28px | Modals, page shells |
| `--radius-pill` | 999px | Buttons, chips, badges |

### Espaciado

Escala: `--space-1` (4px), `--space-2` (8px), `--space-3` (12px), `--space-4` (16px), `--space-5` (20px), `--space-6` (24px), `--space-7` (28px), `--space-8` (32px), `--space-10` (40px), `--space-12` (48px), `--space-16` (64px).

### Sizing

| Token | Valor | Uso |
|---|---|---|
| `--height-control-lg` | 52px | Controles tamaño lg (Button, ControlShell, IconButton, OTPInput) |
| `--height-bar` | 56px | Barras fijas (TopBar, TabBar, PasscodeKeypad) |
| `--hit-target-min` | 44px | Mínimo de área táctil en cualquier control |

### Layout

| Token | Valor | Uso |
|---|---|---|
| `--sidebar-width` | 240px | Ancho del sidebar en layouts internos |
| `--sidebar-collapsed` | 64px | Sidebar colapsado |
| `--content-max` | 1440px | Máximo ancho de contenido |

### Component-level spacing

| Token | Valor | Uso |
|---|---|---|
| `--pad-card` | 24px | Padding interior de cards, modals, drawers |
| `--pad-section` | 32px | Padding de secciones de página |
| `--gap-inline` | 8px | Gap icon-to-label |
| `--gap-stack` | 16px | Gap vertical entre cards/secciones |

Valores sub-4px (1px, 2px, 3px) se mantienen como literal cuando son ajuste visual fino.

### Motion

| Token | Valor | Uso |
|---|---|---|
| `--dur-instant` | 100ms | Press, feedback inmediato |
| `--dur-fast` | 160ms | Hover, toggle |
| `--dur-base` | 240ms | Expand, reveal |
| `--dur-slow` | 400ms | Overlays, transiciones de página |
| `--ease-spring` | cubic-bezier(0.34,1.56,0.64,1) | Touch feedback, hover lift |
| `--ease-out` | cubic-bezier(0.22,1,0.36,1) | Enter, expand |
| `--ease-in-out` | cubic-bezier(0.65,0,0.35,1) | Move, morph |

### Sombras

`--shadow-rest` → `--shadow-raised` → `--shadow-float` → `--shadow-overlay` (de menos a más elevación).
`--shadow-accent-glow` para resaltar elementos con acento azul en hover.

### Tipografía

| Token | Fuente |
|---|---|
| `--font-display` | Edenred (self-hosted .woff2) |
| `--font-body` | Ubuntu (Google Fonts) |
| `--font-mono` | IBM Plex Mono (Google Fonts) |

Jerarquía tipográfica:

**Edenred** — todos los títulos. Bold para niveles 1-4, Regular para nivel 5 (card/dialog).
**Ubuntu** — body, labels, elementos interactivos (botones, inputs, nav).
**IBM Plex Mono Light** — todo lo numérico/código: KPIs, OTP, IDs, timestamps, badges numéricos.

| Token | Nivel | Weight Size/LH | Fuente |
|---|---|---|---|
| `--type-display-lg` | 1 · Hero | 700 48px/1.1 | Edenred Bold |
| `--type-display-md` | 2 · Hero secundario | 700 36px/1.15 | Edenred Bold |
| `--type-headline-lg` | 3 · Título de página | 700 28px/1.25 | Edenred Bold |
| `--type-title-lg` | 4 · Título de sección | 700 20px/1.3 | Edenred Bold |
| `--type-title-md` | 5 · Título de card | 400 16px/1.4 | Edenred Regular |
| `--type-body-md` | Body default | 400 16px/1.55 | Ubuntu |
| `--type-body-md-strong` | Body enfatizado | 600 16px/1.55 | Ubuntu |
| `--type-body-sm` | Metadata/hints | 400 12px/1.5 | Ubuntu |
| `--type-label-sm` | Labels/status | 700 11px/1.3 | Ubuntu |
| `--type-data` | Datos tabulares | 300 13px/1.5 | IBM Plex Mono |
| `--type-data-lg` | KPIs/balances | 300 26px/1.15 | IBM Plex Mono |

### Iconos

Material Symbols con clase `flow-icon`:

```tsx
<span className="flow-icon" aria-hidden="true">dashboard</span>
```

Catálogo: busca por nombre en [fonts.google.com/icons](https://fonts.google.com/icons?icon.set=Material+Symbols).

### Charts

Todos los charts pasan por `FlowChart` (wrapper de ECharts en `src/ui/primitives/FlowChart.tsx`).
Nunca uses ECharts directamente. Tipos: `bar`, `line`, `area`, `stacked`, `stacked100`, `pie`, `radar`, `heatmap`, `funnel`, `scatter`, `gauge`, `pareto`.

---

## Estilos: CSS Modules

Cada componente con estilos propios tiene un `.module.css` al lado del `.tsx`.

### Reglas de CSS

1. **Solo tokens.** `color: var(--text-primary)`, nunca `color: #0F172A`.
2. **Variantes con data attributes**, no con clases extra:
   ```css
   .root[data-variant="primary"] { background: var(--action-primary); }
   .root[data-size="sm"] { padding: var(--space-2); }
   ```
3. **Hover y estados con pseudo-clases CSS**, no con JS handlers:
   ```css
   .root:hover { background: var(--surface-sunken); }
   .root:focus-visible { box-shadow: var(--focus-ring); }
   .root:disabled { opacity: 0.5; pointer-events: none; }
   ```
4. **Valores que dependen de runtime** (como el color computado de Avatar) van como inline style.
5. **No uses `@keyframes`.** Las animaciones usan transiciones con tokens de motion (`--dur-*`, `--ease-*`), no keyframes.
6. **Inline styles solo para valores runtime** (posición computada, color dinámico, width de progress) o `style={style}` pass-through. Layout, tipografía y spacing van en CSS Module con tokens. Inline `fontSize` prohibido — usar tokens de tipo.

---

## Foundation: Growth (medición y experimentos)

Vive en `src/growth/`. Es agnóstico de proveedor: Mixpanel/Amplitude/PostHog se conectan
implementando `GrowthAdapter` — Flow no depende de ningún SDK de analytics.

**Governance (dueño: research):**
- Todo evento vive en `src/growth/events.json` antes de dispararse. Nombre `objeto_accion`
  en snake_case, props snake_case, con `description`, `status` y `surfaces`.
- Solo research cambia `status`: `proposed → approved`. `useTrack` avisa en consola (dev)
  si el evento no existe o no está aprobado. Los tests validan el schema del diccionario.

**Regla arquitectónica (con compliance test):**
- **La cascada nunca trackea sola.** Ningún primitive, component ni pattern importa de
  `growth/` — el tracking y los experimentos se cablean en templates y productos:

```tsx
// En la raíz del producto:
<FlowGrowthProvider adapter={mixpanelAdapter}>...</FlowGrowthProvider>

// En un template:
const track = useTrack()
<Button onClick={() => { addUnit(); track('unit_added', { source: 'manual' }) }}>…

// Experimento sobre una variante de pieza:
const variant = useExperiment('cta_color', 'primary')
<Button variant={variant === 'b' ? 'secondary' : 'primary'}>…
```

---

## Verificación

```bash
npm run typecheck   # TypeScript sin errores
npm run test        # Vitest pasa
npm run build       # Build de producción exitoso
```

Verifica el comportamiento **midiendo el DOM montado**, no leyendo el código: un componente puede cumplir su contrato en el archivo e incumplirlo en la página.

---

## Errores comunes

- **Importar de la capa equivocada.** Un component que importa de patterns viola R1.
- **Crear un archivo nuevo en vez de agregar una prop.** Tres botones con distinto color no son tres componentes — es `variant`.
- **Usar hex en lugar de token.** `#ffffff` se ve bien en light mode. En dark mode se rompe.
- **Olvidar el barrel export.** Si no está en `index.ts`, no existe para quien use el import limpio.
- **No exportar la interfaz de props.** Sin `export interface`, el autocompletado de VS Code no funciona desde el barrel.
- **Usar `onMouseEnter`/`onMouseLeave` para hover.** Eso es un JS hover handler. Usa `:hover` en CSS.
- **Poner `className` como prop.** Los estilos van en `.module.css`, no como clases externas.
