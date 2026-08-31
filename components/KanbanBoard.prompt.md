Tablero por etapa. El board pone columnas, movimiento y el shell del detalle; la tarjeta la dibuja la pantalla.

```jsx
<KanbanBoard
  columns={[{id:'prospecto',label:'Prospecto',limit:5},{id:'piloto',label:'Piloto'}]}
  items={cuentas}
  columnKey="etapa"
  abandonColumn={{ id:'perdida', label:'Perdida' }}
  renderCard={(c) => <><strong>{c.nombre}</strong><span>{c.dias} d en etapa</span></>}
  onMove={(id, to) => aceptar(id, to)}
  renderDetail={(c) => <Detalle cuenta={c} />}
/>
```

`onMove` puede devolver `false`: el board no mueve la tarjeta y lo anuncia. Shift+flecha mueve por teclado; la flecha sola solo mueve el foco.
