# Changelog — @alohasoyrico-eng/flow-react

Formato: [Keep a Changelog](https://keepachangelog.com/es/1.1.0/) · versionado [SemVer](https://semver.org/lang/es/).
La regla de la casa: toda prop nace en el contrato canónico antes que en el código; lo que aparece aquí ya pasó por esa puerta.

## [0.5.0] — 2026-09-04

### Añadido
- **DataTable** (patrón nuevo): búsqueda, orden y paginación coordinados sobre Table — la consulta filtra, el orden se aplica al conjunto filtrado completo y la paginación recorta al final; buscar devuelve a la primera página y el recuento se anuncia en `aria-live` (dtb-1..dtb-5).
- **Table / DataGrid** `caption`: la tabla se nombra para el lector con `<caption>` visualmente oculto (tb-5).
- **StatTile** `description` (contexto bajo el delta) y `loading` (esqueleto con `aria-busy`, sin cifras falsas) (stt-6, stt-7).
- **Sidebar**: grupos con `caption: true` — rótulo no interactivo con hijos siempre listados; colapsado se reduce a separador (sbr-6).
- **Tooltip**: el disparador recibe `aria-describedby` hacia el globo mientras está visible (tip-6).
- **Card** `status` ('success' | 'warning' | 'danger' | 'info'): franja de estado con tokens `--status-*` (crd-6) — y escala de `padding` ('none' | 'sm' | 'md' | 'lg'); el valor libre sigue aceptado como puente de migración.
- **Pagination** `total` + `pageSize` (rótulo «X–Y de Z»), `pageSizeOptions` + `onPageSizeChange` (selector de tamaño; cambiar el tamaño emite `onChange(1)`) (pag-6).
- **SectionHeader** `description`: bajada en muted fuera del heading — el outline queda limpio (sh-3).
- **Escala de capas** `--z-*` en tokens (base/sticky/header/overlay/popover/toast/tooltip): los diez z-index globales de la librería salen de la escala; el diccionario y el CSS mantienen paridad (398/398).

### Añadido (shells)
- **ToastHost + useToast**: la cola de avisos vive una sola vez — apila con tope FIFO (`max`, default 3), `show()` devuelve id, `dismiss(id)` retira, la acción del aviso también lo retira, y cada aviso vive su `duration` propia (default 5000 ms, `null` = persistente). `useToast` fuera del host truena con mensaje claro (th-1..th-3).
- **D5 (i18n)**: los strings hardcodeados de Calendar («Mes anterior/siguiente»), Select («Limpiar»), ChatMessage («Escribiendo»), Toast y Drawer («Cerrar») pasan por intl con default en español — sin provider nada cambia.
- **Popover en portal** con colisión completa (pp-1/pp-2): ningún overflow o transform del ancestro lo recorta; voltea al lado opuesto solo si allí cabe mejor, se recorta contra la ventana con 8px en el eje cruzado y, si no cabe en ningún lado, limita su altura con scroll interno en vez de deslizarse sobre el ancla. Sigue al ancla en scroll/resize y el origen de la animación sale del lado real.
- **OverlayShell en portal** + `dismissOnBackdrop` (false para diálogos que exigen decisión).
- **Listbox**: `aria-activedescendant` en la lista, Home/End y typeahead (lb-2/lb-3).
- **ControlShell** `invalid` (canónico; `error` queda como alias `@deprecated`) + `filled` documentado.
- Los cinco contratos de shells (control-shell, listbox, overlay-shell, popover, toggle-control) entran a la arquitectura del canon y sus 24 criterios automatizados quedan medidos.

### Añadido (deuda saldada)
- **Barrido i18n completo**: los ~25 aria-labels y textos en español duro que quedaban (TopBar, Sidebar, BulkActionsTable, FilterableEditableTable, GlobalSearch, MapCanvas, PasscodeKeypad, KanbanBoard, CardCarousel, NipReveal, Breadcrumb, PageHeader, HelpCenter, ChatComposer, NavBar, RouteBanner, Treemap, CodeBlock…) pasan por intl con default en español. `CodeBlock` ahora dice «Copiar código» (antes «Copy code»).
- **Banco documental con dientes**: 13 criterios automatizados nuevos para las piezas de documentación (AnatomyView, BalanceDisplay, CardCarousel, DocFooter, DownloadCard, GuidanceCard, InstallCard, NipReveal, PageHeader, PlaygroundCanvas, ProfileMenu, ProposalCard) + `nr-1` promovido de manual a automated. El id `tg-1` de transaction-group pasa a `trg-1` (colisión con toggle-control).
- **GanttChart**: cada tarea dice sus fechas en texto («14 ago – 17 ago») bajo su nombre (gnt-1 — antes solo geometría).
- **Auditoría visual con acta** (`docs/audits/visual-2026-09-04.md`): recorrido del banco contra los 181 criterios `visual`; 46 verificados, 2 defectos corregidos (gnt-1 y el treemap de Finanzas que pintaba por categoría en vez de por desvío, tmp-1), y la cola restante enumerada con causa.

### Cambiado
- El contrato canónico de `data-grid` deja de ser huérfano: reescrito al API real del primitivo, registrado en la arquitectura y medido (dg-1/2/3/9/10). Selección masiva, edición y árbol siguen en sus propias piezas, como decide el paquete.
- El nombre accesible de Pagination es «Paginación» (antes «Paginacion»), y sus textos pasan por `useT` (caen a español sin provider).
- Popover ahora se apila por encima del backdrop de overlay (`--z-popover` > `--z-overlay`): un popover abierto dentro de un modal ya no queda debajo.

## [0.4.0] — 2026-09-04

### Añadido
- Primera publicación en **GitHub Packages**; la instalación por git queda retirada (registry o `.tgz` de respaldo vía `npm pack -w packages/flow-react`).
- `docs/USUARIO.md` viaja en el paquete: las reglas del repo consumidor para humanos y agentes.
- Servidor MCP con `get_contract` y `get_user_guide` (además de inventario, APIs, tokens y reglas de arquitectura).
- `Toast.duration` con pausa en hover/foco — el timeout deja de ser de la app (tst-2).
- FileUpload valida `accept` también al soltar, y su zona es botón (teclado ✓).
- Teclado sobre canvas: MapCanvas con pines-botón; ScatterPlot/Treemap con listbox paralelo (`aria-activedescendant`).

### Cambiado
- El repo es workspace: `packages/flow-react` (publicable) + `apps/banco` (banco de plantillas, privado). El tarball no lleva banco.
- `Input.invalid` es el nombre canónico; `error` queda como alias `@deprecated` hasta 1.0.
- ToggleControl se reescribe a composición por children (Radio queda fuera a propósito).

## [0.3.0] — 2026-09-04

### Añadido
- Programa de conformance completo: 355/355 criterios automatizados del canon citados por test o check (`check:conformance` con ratchet).
- Triángulo de API cerrado: `check:api-drift` (canon ↔ ficha) en cero, sin divergencias declaradas.
- Rejas de CI: catálogo, inventario, foundations, targets, color, iconos, a11y estática, paridad de tokens.
- Lazy ECharts con degradación; ~60 defectos reales corregidos (anillo de foco global, Escape por capas, trampa de Tab en diálogos, sparklines NaN, AuthForm sin autocomplete, entre otros).

## [0.1.0] — 2026-09-02

- Arranque del paquete: 126 piezas (50 primitives, 59 components, 17 patterns), tokens ref→sys→comp con Style Dictionary, catálogo con fichas (`items.json`).
