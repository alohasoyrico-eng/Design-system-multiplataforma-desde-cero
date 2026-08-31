Input de una línea; combínalo con `Field` para label/error.

```jsx
<Input icon="search" placeholder="Buscar unidad…" value={q} onChange={setQ} />
<Input mono placeholder="JMX-214-B" suffix="placa" />
```

`invalid` pinta borde danger; el foco es anillo rojo (nunca outline por defecto). `mono` para placas, IDs, montos.
