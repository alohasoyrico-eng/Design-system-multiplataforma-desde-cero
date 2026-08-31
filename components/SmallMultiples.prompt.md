Grid de mini-tendencias con la MISMA escala Y — compara forma entre decenas de entidades sin un solo gráfico saturado.

```jsx
<SmallMultiples items={regions.map(r=>({id:r.id,label:r.name,values:r.last8weeks}))}
  isOutlier={(it)=>Math.max(...it.values) > budget} onSelect={openRegion} />
```
