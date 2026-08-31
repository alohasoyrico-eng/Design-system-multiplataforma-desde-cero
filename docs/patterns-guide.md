# Flow Design System — Patterns & Composition Guide

## Introducción

Este documento organiza los **patrones avanzados** del sistema Flow: composiciones complejas, flujos de usuario, y guías de uso combinado de componentes.

---

## 1. PATRONES DE FORMULARIOS

### 1.1 Formulario de registro (onboarding)
**Componentes**: FieldEmail, FieldPassword, FieldPhone, Checkbox, Button
**Flujo**: 
- Email con validación en vivo
- Contraseña con indicador de fortaleza
- Teléfono con máscara
- Aceptación de términos
- CTA deshabilitado hasta completar

**Principios**:
- Una sección por cada tema (identidad → contacto → permisos)
- Error y help text contextualizados
- Confirmación de éxito con Toast

### 1.2 Formulario de filtrado (búsqueda avanzada)
**Componentes**: Select (searchable), Select (multiple), DatePicker, Button, Badge
**Flujo**:
- Filtros persistentes en estado
- Número de resultados visible
- Botón "Limpiar" solo si hay filtros activos
- Estado guardado en URL (si es necesario)

**Principios**:
- Los filtros nunca bloquean: siempre hay un reset
- Feedback visual (Badge con contador)
- Búsqueda en tiempo real sin botón "buscar"

### 1.3 Formulario de pago
**Componentes**: Field + InputAmount, Select (searchable + renderOption), DatePicker, Checkbox, Button
**Flujo**:
- Monto con validación de rango
- País → código +XX automático
- Fecha de vencimiento con calendario
- Condiciones de pago
- Confirmación explícita con resum

---

## 2. PATRONES DE DATOS (TABLES)

### 2.1 List densa (operativo)
**Tabla**: TableDense
**Uso**: dashboards en tiempo real, KPIs, monitoreo
**Densidad**: 8px padding, 12px font
**Interacción**: hover subtle, sin expandables

### 2.2 List expandible (detalles)
**Tabla**: TableExpandable
**Uso**: listados de órdenes, transacciones, reportes
**Densidad**: 14px padding (estándar)
**Interacción**: click en fila → detail row con más info

### 2.3 Hierarchy/Tree (estructura)
**Tabla**: TableTree
**Uso**: categorías, departamentos, flujos jerárquicos
**Densidad**: 14px padding
**Interacción**: chevron de expansión con nesting visual (offset 24px/nivel)

### 2.4 Timeline (eventos/hitos)
**Tabla**: TableTimeline
**Uso**: historial de estados, milestones, changelog
**Densidad**: vertical, 24px gap
**Interacción**: punto en línea con color de estado, hover scale

### 2.5 Bulk Actions (gestión multi)
**Tabla**: BulkActionsTable
**Uso**: operaciones masivas (delete, export, assign)
**Interacción**:
- Checkbox cabecera = select all
- Toolbar slide-in con acciones (delete, export, assign)
- Contador en header
- Presión ESC cierra toolbar

**Principios**:
- Estado acumulado en Set
- Acciones confirmadas (Dialog) si son destructivas
- Feedback visual clara del cambio

### 2.6 Filtrable + Editable
**Tabla**: FilterableEditableTable
**Uso**: configuración, administración, ajustes
**Interacción**:
- Filtro inline arriba (por cada col `filterable: true`)
- Doble-click = entrada editable
- Enter guarda, ESC cancela
- Botón "Limpiar" visible solo si hay filtros

**Principios**:
- Sin guardar automático; siempre explícito (onUpdate)
- Validación en cliente (si aplica)
- Hover muestra icon edit

---

## 3. PATRONES DE TARJETAS

### 3.1 Card Media (hero/featured)
Uso: destacado, resumen visual
Estructura: imagen (200px) + título + descripción

### 3.2 Card Minimal (lightweight)
Uso: listas compactas, microcopy
Estructura: ícono + title + desc, sin borde/sombra

### 3.3 Card Elevated (acción)
Uso: CTAs destacadas, recomendaciones
Estructura: borde color + sombra prominente

### 3.4 Card Ghost (overlay/subtle)
Uso: overlays, modales semi-transparentes
Estructura: fondo 40% opaco, borde sutil

### 3.5 Card Interactive (tappable)
Uso: opciones navegables, decisiones
Estructura: title + desc + hover icons de acción

### 3.6 Card Stats (métrica)
Uso: KPIs, valores resumen
Estructura: label + valor grande (mono) + cambio % + trend icon

### 3.7 Card Compact (row)
Uso: listas densas, nav secundaria
Estructura: icon + title + badge, 12px padding, sin borde

---

## 4. PATRONES DE VISUALIZACIÓN DE DATOS

### 4.1 Gantt Chart (timeline)
Uso: roadmaps, planificación de proyectos
Estructura: nombre tarea (120px) + barra horizontal + progreso
Duración: visualización proporcional en 100%

### 4.2 Waterfall Chart (acumulativo)
Uso: descomposición de cambios, presupuestos, análisis
Estructura: barras verticales positivo/negativo, línea base central

### 4.3 Polar Chart (multidimensional)
Uso: perfiles, habilidades, comparativas 360
Estructura: polígono con ejes radiales, leyenda abajo
Datos: [label, value, color]

### 4.4 Kanban Board (estado)
Uso: flujo de trabajo, gestión de tareas
Estructura: 
- Columnas = estados (color dot + label + contador)
- Cards = tareas (title + prioridad dot + assignee)
- Grabbable (visual feedback en hover)

---

## 5. PATRONES AVANZADOS

### 5.1 Bulk Actions Flow
```
1. Usuario selecciona items (checkbox)
2. Toolbar aparece: slide-in animado
3. Muestra: "3 seleccionados" + botones de acción
4. Al hacer clic:
   - Si es destructiva: Dialog de confirmación
   - Si es asíncrona: Toast de progreso
   - Al completar: Toast de éxito + reset selección
```

**Componentes**: BulkActionsTable, Dialog, Toast

### 5.2 Filters + Inline Edit
```
1. Usuario abre filters (input por columna)
2. Tabla filtra en tiempo real
3. Click en celda → edición inline
4. Doble-click = entrada activa
5. Enter = guardar (onUpdate), ESC = cancelar
6. Badge muestra filtros activos
```

**Componentes**: FilterableEditableTable, Badge, Icon edit

### 5.3 Help Center
```
1. Usuario abre Help (típicamente modal o sidebar)
2. Busca término en input top
3. Si hay coincidencia: lista plana de artículos
4. Si no: navegación por categorías expandibles
5. Click → muestra contenido + tags + breadcrumb
```

**Componentes**: HelpCenter (todo-en-uno), SearchInput, CategoryNav

---

## 6. GUÍA DE COMPOSICIÓN

### Densidades estándar
- **Compacta** (UI operativa): 8px padding, 12px font → TableDense
- **Estándar** (CRUD): 14px padding, 13–14px font → Table, Card
- **Espaciada** (hero/editorial): 24–32px padding, 16px+ font → CardMedia, HelpCenter

### Paleta de colores en patrones
- **Acción**: `var(--action-accent)` (rojo marca) para CTAs, highlight, focus
- **Estado**: `var(--status-success/warning/danger)` para badges, indicadores, cambios
- **Texto**: `var(--text-primary/muted)` para jerarquía, labels, hints
- **Fondo**: `var(--surface-card/sunken)` para contraste de secciones

### Animaciones recomendadas
- **Toolbar entrada**: `flowScaleIn` (100ms ease-out)
- **Hover lift**: `var(--lift-hover)` + `shadow-float` (var(--dur-fast) ease-spring)
- **Collapse/expand**: chevron rotate 90deg (var(--dur-fast) ease-spring)
- **Cambio de estado**: fade + slide (100–200ms ease-out)

### Accesibilidad en patrones
- **Bulk select**: siempre hay un reset (botón "Deseleccionar todo")
- **Filtros**: labels visibles o aria-label
- **Edición inline**: focus ring claro, Enter/ESC manejados
- **Timeline**: color + símbolos para estados (nunca solo color)
- **Help Center**: busca case-insensitive, keywords incluidos

### Responsive
- **Móvil**: tablas dense/expandable se contraen a list stacked
- **Tablet**: 280–320px sidebar (Help), 2–3 columnas máx (Kanban)
- **Desktop**: full width sin caps, 1200px max-content

---

## 7. EJEMPLOS DE COMPOSICIÓN

### Ejemplo: Dashboard de gestión (Fleet Manager)
```
Header: Logo + User menu
Sidebar: Nav principal (Flota, Reportes, Configuración)
Content:
  - Sección 1: Stats cards (CardStats) → 4 columnas
  - Sección 2: Tabla densa de vehículos (TableDense) con filtros top
  - Sección 3: Gráfico (FlowChart type="line", o GanttChart si es timeline)
  - Sección 4: Timeline de eventos recientes (TableTimeline)
```

### Ejemplo: Onboarding de conductor
```
Screen 1: Welcome card (CardMedia) + descripción + CTA
Screen 2: Formulario (FieldEmail, FieldPhone, FieldPassword)
Screen 3: Confirmación (Dialog) → email verification
Screen 4: Bienvenida (CardMinimal) + quickstart actions
```

### Ejemplo: Configuración avanzada
```
Sidebar: Nav de secciones (Perfil, Seguridad, Notificaciones)
Content:
  - Form (FilterableEditableTable para roles/permisos)
  - Cada fila es un rol, columns son permisos
  - Doble-click para editar
  - Guardar por fila (no formulario completo)
```

---

## 8. CHECKLIST DE IMPLEMENTACIÓN

Para cada patrón nuevo:
- [ ] Componentes base definidos (Button, Input, etc.)
- [ ] Variantes documentadas (props, estados)
- [ ] Interacciones (hover, focus, active) especificadas
- [ ] Animaciones (duración, easing) alineadas
- [ ] Accesibilidad (ARIA, keyboard nav, contrast)
- [ ] Responsive (mobile/tablet/desktop)
- [ ] Ejemplos en demo
- [ ] Casos de uso descritos en prosa

---

## 9. PRÓXIMOS PASOS

- [ ] Integrar patrones en UI kits (templates reales)
- [ ] Crear demos interactivas (storybook-style)
- [ ] Documentar casos de uso por producto (Drivers, Fleet, Internal Tools)
- [ ] Validar accesibilidad WCAG 2.1 AA en todas las interacciones
