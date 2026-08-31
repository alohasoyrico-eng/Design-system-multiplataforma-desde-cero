Pantalla de estado para cuando el producto se conecta a un servicio (API, base de datos, pasarela de pago, GPS, biométricos). `loading` gira; `success`/`error` con feedback de resorte; `offline` para sin conexión. `fullScreen` centra en el alto disponible del contenedor.

```jsx
<StatusView status="error" title="No pudimos conectar con el servidor"
  description="Revisa tu conexión e intenta de nuevo."
  primaryAction={<Button variant="accent" fullWidth onClick={retry}>Reintentar</Button>}
  secondaryAction={<Button variant="ghost" fullWidth onClick={goBack}>Volver</Button>}
  fullScreen
/>
```

Distinto de `EmptyState` (sin datos que mostrar) y de `Toast` (transitorio): `StatusView` ocupa la pantalla completa mientras se resuelve una operación crítica.
