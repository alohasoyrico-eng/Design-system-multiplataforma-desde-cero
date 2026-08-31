Historial vertical con estado por evento. `active` resalta el paso en curso (glow rojo); `error` para pasos fallidos; `pending` en gris sin rellenar.

```jsx
<Timeline items={[
  {title:'Viaje iniciado', timestamp:'08:12', status:'done'},
  {title:'En camino a destino', timestamp:'08:14', status:'active'},
  {title:'Viaje finalizado', status:'pending'},
]} />
```

Para logs tabulares con filtros usa `TableTimeline`; este es para lectura lineal del detalle de un solo registro (viaje, ticket, sincronización).
