# Flow × Angular

0. **Fuente de verdad:** `../flow.tokens.json`. `_flow-tokens.scss` es **generado** por `../build-tokens.mjs` (`node build-tokens.mjs` desde `platforms/`) — no lo edites a mano, edita el JSON y regenera.
1. Copia `_flow-tokens.scss` a tu carpeta de estilos y `@use` donde lo necesites.
2. Importa `../../styles.css` (o copia `tokens/*.css`) en `styles.scss` global — los componentes deben leer **CSS custom properties** (`var(--text-primary)`) para que el tema oscuro (`[data-mode="dark"]` en `<html>`) funcione sin recompilar.
3. Recrea cada componente siguiendo su `*.prompt.md` y `*.d.ts` (contrato de props → `@Input()`s). Los estados hover/press usan `--ease-spring` + `--press-scale`.
4. Accesibilidad: mismos roles ARIA que la referencia React; foco visible con `--focus-ring`.
