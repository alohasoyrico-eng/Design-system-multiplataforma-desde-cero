Dispersión con umbrales para detectar outliers de eficiencia (costo/km vs km recorridos) en flotas grandes sin desplegar una tabla de cientos de filas.

```jsx
<ScatterPlot points={units.map(u=>({id:u.id,x:u.km,y:u.costoKm,label:u.plate}))}
  xLabel="Km recorridos" yLabel="Costo/km" xThreshold={5000} yThreshold={2.5} onSelect={openUnit} />
```
