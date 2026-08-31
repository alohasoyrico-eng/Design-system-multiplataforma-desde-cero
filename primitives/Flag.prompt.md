Bandera de pais en SVG, desde [flag-icons](https://github.com/lipis/flag-icons). Reemplaza al emoji: el emoji cambia de dibujo en cada sistema operativo, no se puede recortar ni alinear, y el DS lo prohibe en UI.

```jsx
<Flag country="MX" size={20} />                       {/* decorativa: el texto ya dice el pais */}
<Flag country="MX" size={20} label="México" />         {/* sola: necesita nombre accesible */}
<Flag country="BR" size={16} shape="rounded" />
```

Usa la variante cuadrada (1:1) de la libreria, asi que la mascara circular recorta parejo — con la apaisada el recorte se come el centro del dibujo.

**Reglas**
- Circular por defecto. `rounded` sigue `--radius-xs`; `square` solo en contextos tabulares densos.
- `label` solo cuando la bandera va sola. Junto al nombre del pais es decorativa: sin label queda `aria-hidden` y el lector no lee el pais dos veces.
- El anillo interior (`ring`) no es decoracion: sin el, JP y PL desaparecen sobre `--surface-card`. Quitalo solo sobre fondo oscuro.
- Nunca la bandera como unico indicador de idioma o moneda — pais e idioma no son lo mismo.
- La hoja de estilos se inyecta una vez por documento; `ensureFlagCss()` la precarga.
