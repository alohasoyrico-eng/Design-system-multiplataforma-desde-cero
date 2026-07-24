# @flow/mailings

Plantillas de **correo electrónico** de Flow.

Los clientes de email (Outlook, Gmail, Apple Mail…) no soportan CSS custom properties ni la
mayoría del CSS moderno, así que estas plantillas usan **layout de tablas + estilos inline**, con
los valores de marca **inlineados**. Para que sigan siendo sistémicas, `build.mjs` lee los colores y
radios desde `packages/tokens/dist/tokens.json` (la misma fuente de verdad que la app) — nunca se
eligen a mano. Por esta razón viven **fuera del runtime de componentes** y no comparten el CSS de tokens.

## Uso

```sh
npm run tokens:build           # genera tokens.json (fuente de valores)
npm run build --workspace @flow/mailings   # o: npm run mailings:build
```

Salida en `dist/`:

- `bienvenida.html` — alta de cuenta + CTA.
- `transaccional-recibo.html` — recibo de viaje (montos en mono).
- `resumen-semanal.html` — resumen de ganancias/viajes.
- `alerta-otp.html` — código de verificación.

Re-genera tras editar los tokens para mantener los correos alineados con la marca.
