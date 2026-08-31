Tabla en tarjeta redondeada; headers overline, celdas `mono` para datos, filas clickeables.

```jsx
<Table rowKey="id" onRowClick={open} selectedKey={sel}
  columns={[{key:'plate',label:'Placa',mono:true},{key:'driver',label:'Conductor'},{key:'status',label:'Estado',render:(r)=><Badge tone="success" live>En ruta</Badge>}]}
  rows={data} />
```

Ordenamiento: agrega `sortable:true` a la columna (y `sortValue` si la celda usa `render`). `defaultSort` fija el orden inicial. Ciclo: asc → desc → sin orden.
