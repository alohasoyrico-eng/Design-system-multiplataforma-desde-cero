# Migración desde Flow 1.x

Guía para quien llega del Flow viejo (`@flow/components` / `@flow/patterns`, 1.0.0-rc.x)
al sistema actual. Su trabajo es uno solo: que nadie busque una pieza o una prop del 1.x,
no la encuentre, y crea que falta. Todo lo que no cruzó el puente está aquí, con su
veredicto y su heredero.

Fuentes: diff de uniones viejo↔nuevo (V1–V12, plan de migración eOne §0-B) y censo
completo del inventario 1.x contra el canon (7-sep-2026: 56 componentes + 36 patterns
auditados pieza por pieza).

## Renombres — mismo trabajo, otro nombre

| 1.x | Ahora |
|---|---|
| `FlowTag` (etiqueta de estado, 5 tonos) | `StatusPill` (o `Badge` con `tone` si no lleva dot); `variant="code"` → `InlineCode` |
| `FlowBadge` (contador de notificaciones) | contador de `IconButton` y `TabBar` — el contador no es pieza |
| `FlowSnackbar` | `Toast` (+ `ToastHost`/`useToast`) |
| `FlowTextInput` / `FlowTextArea` | `Input` / `Textarea` |
| `FlowPhoneInput` | `InputPhone` (prefijo `ReactNode`: bandera + lada) |
| `FlowBottomNav` | `TabBar` |
| `FlowBreadcrumbs` | `Breadcrumb` |
| `FlowToggleButton` | `ToggleControl` |
| `FlowSegmentedControl` | `Segmented` |
| `FlowTreeView` | `TableTree` |
| `FlowKPICard` / `FlowKPITrendIndicator` | `StatTile` (con `delta` y `trend`) |
| Props: Tag `status`→Badge `tone` · KPI `trend`→`tone` · Tabs `filled/line`→`pill/underline` · `iconPlacement`→`iconTrailing` · Input `inside`→`insetLabel` · Skeleton `circular/rect`→`circle/card` | |

## Absorciones — el trabajo vive dentro de otra pieza

| 1.x | Dónde vive ahora |
|---|---|
| `FlowAutocomplete` | `Select` con `searchable` |
| `FlowCommandPalette` | `GlobalSearch` (paleta con atajo, campo en línea o página) |
| `FlowConfirmationDialog` | `Dialog` (las confirmaciones son su caso, no una variante) |
| `FlowColumnConfigurator` | `DataGrid.columns` + `SavedViews` |
| `FlowSortControl` | `sort`/`onSortChange` de `Table` y `DataGrid` |
| `FlowVirtualDataTable` | `DataGrid` |
| `FlowAdvancedFilters` | `FilterBar` + `ActiveFilters` |
| `FlowFullscreenSheet` | `BottomSheet` con `fullscreen` |
| `FlowToolbar` | repartida: `BulkActionsPattern` (selección) + `FilterBar` (filtros) + `QuickActionBar` (acciones) |
| `FlowCountrySelect` | receta `country-select-pattern`: `Select searchable` + `Flag` + `renderOption`, lada sincronizada en `InputPhone` (pai-p5: el componente no vuelve) |
| `FlowInlineValidationMessage` | `Field` (inyecta `describedby`) |
| `FlowShortcutGrid` | `QuickAction` / `QuickActionBar` |

## Muertes declaradas — props y ejes (V6–V12)

- **`intent` en Button/IconButton** (V6): colapsado en `variant="danger"`. El botón-warning
  no tuvo demanda medible (×0 en eOne); si aparece, se argumenta con pantalla, no se repone.
- **`tertiary` / `outlined`** (V7): absorción documentada — `tertiary`→`ghost`,
  `outlined`→`secondary`.
- **`xl` en los controles** (V8): muere global. El caso «grande» lo da `density="comfortable"`.
- **`size` por instancia en Badge/Switch/Tooltip/EmptyState/Skeleton/Stepper/Tabs/Dialog** (V9):
  decisión de arquitectura — la escala es de densidad global, no de cada pieza.
- **`Switch.labelPosition`** (V10): ×0 uso. Muere.
- **`Avatar shape="square"` y `status="away"`** (V11): ×0 uso. Mueren.
- **`Card variant="stat"` / `padding="container"` / `status="neutral"`** (V12): restos del
  Card multiuso. `stat` es `StatTile`; la escala de padding es `none/sm/md/lg`.
- **`Chip.tone` no nace** (V2, decidido 7-sep-2026): la frontera Chip/Badge es la
  interactividad, no el color. Un chip tintado de solo lectura es `Badge` con `tone`;
  un filtro interactivo no carga color semántico. Los `variants` viejos
  (`filled/filter/outlined/tonal`) mueren con él.

## Muertes declaradas — piezas (censo 7-sep-2026)

- **`FlowFAB`**: la acción principal vive en `PageHeader` o `QuickActionBar`; un botón
  flotante pelea con la `TabBar` en mobile.
- **`FlowHoverCard`**: el hover no existe en touch. Info breve → `Tooltip`; contenido
  rico → `Popover` (click).
- **`FlowSplitPane`**: `PageFrame`/`AutoGrid`. Renace solo si un template lo exige.
- **`FlowFieldset`**: agrupar campos es composición — `SectionHeader` + `Field` dentro
  del form, no componente.
- **`FlowDragSortableList`**: muere el genérico; reordenar es capacidad de la pieza dueña
  (kanban, `DataGrid`, `WidgetLibrary`). Misma política para el swipe (trw-5).
- **`FlowColorPicker`**: fuera de dominio.
- **`FlowRichTextEditor`**: fuera de dominio (`Textarea` lo declara nonGoal).

## Nacencias pendientes — existen como `proposed`, aún sin código

Si vienes buscando una de estas, no falta: ya tiene contrato en el canon y espera su
pantalla.

- **`pull-to-refresh`** (ptr-1..3) — Wallet/Rutas mobile.
- **`transfer-list`** (trl-1..3) — asignación masiva: config-roles, fleet-assignment.
- **`avatar-group`** (avg-1..3) — extiende `avatar`; fleet-assignment.
- **Swipe en filas**: criterio trw-5 de `transaction-row` — el gesto es atajo, nunca
  única vía, y vive encapsulado en la pieza dueña.

Backlog de reintroducciones aún abierto: `Progress.tone` success/danger (V1) y
`Card.padding="xl"` (V3).
