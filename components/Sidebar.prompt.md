Nav lateral persistente de shells desktop. Secciones colapsables (un nivel de anidado), item activo en `--surface-accent-subtle`, y modo `collapsed` de 60px solo-iconos con tooltip al hover.

El estado de navegacion es del contenedor: `activeId`, `collapsed` y `expandedSections` son controlados.

```jsx
const [expanded, setExpanded] = React.useState(new Set(['dashboards']));
const toggle = (id) => setExpanded(s => {
  const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n;
});

<Sidebar
  activeId="overview"
  collapsed={collapsed}
  expandedSections={expanded}
  onToggleSection={toggle}
  onNavigate={(id) => go(id)}
  headerContent={<img src="/assets/flow-logo.png" alt="Flow" style={{height:16}} />}
  footerActions={<IconButton icon="logout" ariaLabel="Salir" size="sm" />}
  items={[
    {id:'overview', label:'Resumen', icon:'space_dashboard', href:'/'},
    {id:'dashboards', label:'Dashboards', icon:'insights', children:[
      {id:'flota', label:'Flota', icon:'local_shipping', href:'/flota'},
      {id:'rutas', label:'Rutas', icon:'route', href:'/rutas'},
    ]},
  ]}
/>
```

**Reglas**
- Maximo un nivel de anidado. Mas profundidad pide Breadcrumb, no mas arbol.
- Un solo item activo a la vez; `aria-current="page"`.
- El acento aqui es estado, no decoracion: no pintes el item hover de rojo.
- En movil no se usa colapsado: se convierte en Drawer, o TabBar si son ≤5 destinos.
- Ancho por defecto 240px; collapsed 60px. La transicion de ancho usa `--ease-spring`.
