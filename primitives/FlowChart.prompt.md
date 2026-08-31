Un solo componente para toda la data-viz de dashboards. Envuelve ECharts y **lee los tokens de Flow en runtime**, asi que el claro y el oscuro salen del mismo codigo — no hay nada que configurar, y cambiar `data-mode` re-pinta el chart.

```jsx
<FlowChart
  type="area"
  labels={['Ene','Feb','Mar','Abr','May','Jun']}
  series={[
    { label: 'Diesel', values: [420, 455, 398, 512, 486, 540] },
    { label: 'Gasolina', values: [180, 172, 195, 210, 198, 205] },
  ]}
  format={(v) => '$' + v.toLocaleString('es-MX')}
  legend
  highlight="Diesel"
  height={280}
  ariaLabel="Gasto de combustible por mes, dos series"
/>
```

**Tipos**

| `type` | Para |
|---|---|
| `line` `area` | Tendencia en el tiempo |
| `bar` `stackedBar` | Comparar categorias; `horizontal` cuando las etiquetas son largas |
| `stacked100` | Composicion relativa — el total no importa, la mezcla si |
| `donut` `pie` | Reparto de un total. Maximo 5-6 rebanadas |
| `scatter` | Correlacion entre dos medidas |
| `heatmap` | Densidad por dos dimensiones (hora × dia) |
| `radar` | Perfil multidimensional comparable |
| `waterfall` | Como se llego de A a B (P&L, presupuesto) |
| `pareto` | Pocas causas, mucho efecto — barras + acumulado |
| `gauge` | Un valor contra su limite |
| `funnel` | Caida etapa por etapa |
| `treemap` | Jerarquia por tamano |
| `boxplot` | Distribucion y dispersion |

**Color**
- Con 1-3 series el default NO es la paleta categorica: es **tinta + accent** (`palette="auto"`). Ocho colores es un default de libreria; dos es una decision. La categorica entra sola con 4+ series, o forzada con `palette="categorical"`.
- Las series usan `--viz-1..8`, una paleta categorica que NO incluye el rojo de marca.
- `highlight="Diesel"` pinta esa serie en `--viz-accent`. Una sola serie enfatizada, o el enfasis deja de significar algo.
- Heatmaps y treemaps usan la rampa secuencial `--viz-ramp-1..6`, no la categorica.

**Geometria y tipografia**
- Barras en pill: el radio es la mitad del ancho, como el Switch y el Progress. Las apiladas van rectas — la composicion se lee como una cinta continua.
- Sin lineas de eje: solo horizontales punteadas en `--viz-grid`. Menos rejilla, mas aire.
- Toda cifra en mono, tambien dentro del tooltip: etiqueta en Sora, numero en JetBrains Mono. El gauge usa `--type-data-lg`, el mismo token que los KPIs.

**Animacion de montaje**
- Las barras crecen desde la base escalonadas 36ms; las lineas se dibujan de izquierda a derecha, cada serie 160ms detras de la anterior; el donut barre como un reloj.
- `animate={false}` la desactiva; `prefers-reduced-motion` tambien.

**Reglas**
- `format` siempre en datos monetarios o con unidad: aplica a eje, tooltip y etiquetas de una vez.
- `ariaLabel` describiendo la conclusion, no el tipo de chart: «Gasto de combustible sube 28% en seis meses», no «grafica de lineas».
- `showValues` solo con pocas barras. Con muchas, el tooltip.
- ECharts se carga del CDN una sola vez y se comparte; `loadEcharts()` lo precarga si te importa el primer paint.
- Sin datos renderiza un vacio con causa, no un lienzo en blanco. Si ECharts no carga, degrada a un mensaje — nunca a un hueco.
- Respeta `prefers-reduced-motion`: sin animacion de entrada.
- `option` hace merge profundo sobre lo generado. Es el escape hatch, no el camino normal: si lo usas en todos los charts, falta un tipo.
