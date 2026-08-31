Pareto (80/20) para encontrar culpables: el subconjunto de unidades/entidades que concentra la mayor parte del gasto.

```jsx
<ParetoChart data={units.map(u=>({label:u.plate,value:u.gasto}))} format={(v)=>'$'+v+'k'} />
```
Úsalo cuando la pregunta es "¿en qué debo enfocarme?", no "¿cómo se comparan todos?".
