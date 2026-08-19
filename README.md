# Flow

Un kit de piezas listas para armar interfaces — dashboards, formularios, tablas, mapas, chats, wizards — sin empezar de cero cada vez.

Piensa en Flow como una caja de LEGO para pantallas: cada pieza encaja con las demás, se ve bien en claro y en oscuro, y funciona en móvil y escritorio.

## Vélo corriendo en 30 segundos

```bash
git clone git@github.com:alohasoyrico-eng/Design-system-multiplataforma-desde-cero.git
cd Design-system-multiplataforma-desde-cero
npm install
npm run dev
```

Abre `localhost:5173`. Vas a ver un sidebar con 19 pantallas funcionando — dashboards con gráficas reales, tablas editables, un mapa con pins, un chat, un wizard paso a paso, y más. Todo eso está hecho con las piezas de Flow.

## Qué hay en la caja

**68 piezas** organizadas en tres niveles, de lo más simple a lo más completo:

### Piezas básicas (20)
Los ladrillos. Cada una hace una sola cosa bien.

`Button` `Input` `Select` `Checkbox` `Switch` `Radio` `Slider` `Badge` `Avatar` `Chip` `Spinner` `Skeleton` `Progress` `Divider` `Field` `Flag` `IconButton` `Textarea` `Sparkline` `FlowChart`

### Piezas compuestas (45)
Combinaciones de piezas básicas que forman cosas más útiles.

`Card` `Table` `Dialog` `Drawer` `Tabs` `Accordion` `Menu` `Tooltip` `Breadcrumb` `Pagination` `Toast` `Stepper` `Timeline` `Sidebar` `TopBar` `EmptyState` `FileUpload` `DatePicker` `GlobalSearch` `HelpCenter` `NotificationCenter` `SegmentedControl` `KanbanBoard` `MapCanvas` `ChatMessage` `ChatThread` `ChatComposer` `RoleMatrix` `BulkActionsTable` `FilterableEditableTable` `OTPInput` `OnboardingCarousel` `StatusView` `StatTile` `Donut` `Bars` `BulletChart` `ParetoChart` `ScatterPlot` `SmallMultiples` `Treemap` `GanttChart` `CircularProgress` `CardMedia` `TableTree`

### Flujos completos (3)
Pantallas que resuelven tareas reales de negocio.

`AuthForm` (login/registro) · `Settings` (ajustes con secciones) · `Wizard` (paso a paso con validación)

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

Cada pieza acepta `style` para ajustes puntuales. Las variaciones de apariencia se controlan con la prop `variant`, el tamaño con `size`.

## Colores y modo oscuro

Flow usa nombres de color en vez de códigos hexadecimales. Eso hace que el modo oscuro funcione solo:

```css
/* Así se escriben los estilos en Flow */
.miTarjeta {
  background: var(--surface-card);    /* blanco en claro, gris oscuro en oscuro */
  color: var(--text-primary);         /* negro en claro, blanco en oscuro */
  border: 1px solid var(--border-subtle);
}
```

Para activar el modo oscuro en cualquier parte de tu página:

```html
<div data-theme="dark">
  <!-- todo lo de adentro se pone oscuro -->
</div>
```

### Los nombres más usados

| Lo que necesitas | Nombre que usas |
|---|---|
| Fondo de página | `--surface-canvas` |
| Fondo de tarjeta | `--surface-card` |
| Fondo de input | `--surface-sunken` |
| Texto principal | `--text-primary` |
| Texto secundario | `--text-secondary` |
| Texto apagado | `--text-muted` |
| Borde suave | `--border-subtle` |
| Borde normal | `--border-default` |
| Color de marca | `--flow-red-500` |
| Éxito | `--status-success` |
| Advertencia | `--status-warning` |
| Error | `--status-danger` |

Todos los nombres están en `src/tokens/`. Si necesitas la lista completa, abre `CLAUDE.md`.

## Iconos

Un solo archivo de fuente. Escribes el nombre del icono y aparece:

```tsx
<span className="flow-icon">dashboard</span>
<span className="flow-icon">person</span>
<span className="flow-icon">settings</span>
```

Busca iconos por nombre en [fonts.google.com/icons](https://fonts.google.com/icons?icon.set=Material+Symbols). Son miles.

## Gráficas

Una sola pieza para todas las gráficas. Dile el tipo y los datos:

```tsx
import { FlowChart } from './ui/primitives'

<FlowChart
  type="bar"
  labels={['Ene', 'Feb', 'Mar']}
  series={[{ label: 'Ventas', values: [100, 200, 150] }]}
  height={200}
/>
```

Tipos: `bar` · `line` · `area` · `pie` · `radar` · `heatmap` · `funnel` · `scatter` · `gauge` · `pareto` · `stacked` · `stacked100`

Las gráficas especializadas (`Donut`, `ScatterPlot`, `GanttChart`, etc.) son atajos con APIs más cómodas.

---

## Cómo está organizado (para cuando quieras crear piezas nuevas)

Flow tiene una regla simple: **las piezas solo pueden usar piezas más simples que ellas**.

```
tokens       →  los colores, tamaños y tiempos (sin interfaz)
primitives   →  piezas básicas (Button, Input, Badge...)
components   →  combinan primitives (Card, Table, Dialog...)
patterns     →  resuelven tareas de negocio (AuthForm, Settings...)
templates    →  pantallas completas (se copian, no se importan)
```

Un `Card` (component) puede usar `Button` (primitive). Pero un `Button` no puede usar `Card` — eso iría hacia arriba. Si necesitas que dos piezas del mismo nivel compartan algo, baja eso compartido al nivel de abajo.

### Para crear una pieza nueva

1. Decide en qué nivel va: ¿Es un control atómico? → `src/ui/primitives/`. ¿Combina controles? → `src/ui/components/`. ¿Resuelve algo de negocio? → `src/ui/patterns/`.

2. Crea dos archivos:
```
src/ui/components/MiPieza.tsx          ← el componente
src/ui/components/MiPieza.module.css   ← los estilos (opcional)
```

3. Exporta las props con `export interface`:
```tsx
export interface MiPiezaProps {
  title: string
  size?: 'sm' | 'md' | 'lg'
  style?: CSSProperties
}
```

4. Agrega la línea de exportación al índice de su nivel:
```tsx
// en src/ui/components/index.ts
export { MiPieza, type MiPiezaProps } from './MiPieza'
```

5. Verifica: `npm run typecheck`

Las reglas completas y la receta detallada están en `CLAUDE.md`.

## Verificación

```bash
npm run typecheck   # tipos de TypeScript
npm run test        # tests unitarios
npm run build       # build de producción
```

## Stack

React 19 · TypeScript · CSS Modules (sin Tailwind) · Vite · TanStack Router · TanStack Query · ECharts · Vitest · Material Symbols

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

| Preguntarle al servidor | Para qué |
|---|---|
| `list_inventory` | "¿Qué piezas hay?" |
| `get_component_api("Button")` | "¿Qué props acepta Button?" |
| `get_tokens("colors")` | "¿Cuáles son los colores?" |
| `get_architecture_rules` | "¿Cuáles son las reglas?" |
| `validate_import(from, to)` | "¿Este import está bien?" |

---

## Para agentes de IA

Si eres un agente trabajando **dentro** de este repo:

1. Lee `CLAUDE.md` antes de tocar código — tiene las reglas que debes seguir.
2. Antes de crear un archivo, decide su nivel (primitive / component / pattern).
3. Busca si ya existe una pieza que haga lo que necesitas.
4. Usa tokens de color (`var(--surface-card)`), nunca hex (`#ffffff`).
5. Corre `npm run typecheck` después de cada cambio.
6. Agrega cada pieza nueva al `index.ts` de su nivel.

Si trabajas desde **otro repo**, conecta el MCP server (sección anterior).
