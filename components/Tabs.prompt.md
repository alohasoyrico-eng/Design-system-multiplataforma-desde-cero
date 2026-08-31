Tabs con indicador que se desliza por resorte. `pill` (segmentado) para vistas; `underline` para secciones de página.

```jsx
<Tabs value={tab} onChange={setTab} items={[
  {value:'todas',label:'Todas',count:128},
  {value:'ruta',label:'En ruta',icon:'navigation',count:96},
  {value:'taller',label:'Taller',count:9},
]} />
```

Flechas ←/→ navegan entre tabs.
