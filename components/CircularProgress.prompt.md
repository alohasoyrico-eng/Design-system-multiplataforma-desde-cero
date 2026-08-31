Ring de progreso. Úsalo en tiles de dashboard (batería, cuota de viajes, sincronización) donde `Progress` (barra) ocuparía demasiado ancho.

```jsx
<CircularProgress value={72} showValue label="Batería" tone="success" />
```

`size` en px controla todo (incluye grosor del valor mono). Para progreso indeterminado usa `Spinner`, no este componente.
