Jerarquía con drill-down por click; tamaño = gasto, color = desvío vs presupuesto. Para organizaciones multientidad con cientos de unidades.

```jsx
<Treemap nodes={[{id:'cdmx',label:'CDMX',value:812,deviation:0.12,children:[...]}]} format={(v)=>'$'+v+'k'} onDrill={trackDrill} />
```
