Nav inferior fija de móvil, 4-5 items máx. Icono outline por defecto, `flow-symbol--fill` + escala 1.12 en el activo. `badge` numérico (contador, tope "9+") o `true` (punto) para notificaciones.

```jsx
<TabBar activeId={tab} onChange={setTab} items={[
  {id:'home',icon:'home',label:'Inicio'},
  {id:'map',icon:'map',label:'Mapa'},
  {id:'earnings',icon:'payments',label:'Ganancias',badge:2},
  {id:'profile',icon:'person',label:'Perfil'},
]} />
```

Siempre dentro del safe-area inferior; nunca más de 5 items; para web usa `Sidebar` o `TopBar`, no `TabBar`.
