Botón de acción pill; úsalo para toda acción clickeable con texto — 'accent' (rojo) máximo una vez por vista para la acción principal.

```jsx
<Button variant="accent" icon="bolt" onClick={go}>Iniciar viaje</Button>
<Button variant="secondary" size="sm">Ver flota</Button>
<Button variant="danger" loading>Eliminando…</Button>
```

Variantes: primary (tinta, default) · accent (rojo marca) · secondary (outline) · ghost · danger. Tamaños sm 36 / md 44 / lg 52 (hit target ≥44 en touch: usa md+). Micro-interacción integrada: hover 1.04, press 0.96, glow en accent.
