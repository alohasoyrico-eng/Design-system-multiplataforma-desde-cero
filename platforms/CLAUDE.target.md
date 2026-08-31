# Flow — reglas de arquitectura

> Plantilla. Copia este archivo como `CLAUDE.md` en la raíz del repo que implementa Flow.
> Claude Code lo lee en cada sesión, así que la regla está presente cuando se escribe el código,
> no cuando ya se mandó a revisión.

## La cascada

`foundations → primitives → components → patterns → templates`

**Antes de crear un archivo, decide su capa. Las dependencias solo van hacia abajo.**
Nunca importes de una capa superior ni de tu propia capa. Si necesitas algo que está al lado,
bájalo a la capa que ambos comparten — no lo copies.

| Capa | Entra si | Puede importar |
|---|---|---|
| foundations | Es una decisión expresable sin JSX (color, tipo, espacio, forma, motion) | nada |
| primitives | No importa nada del sistema salvo tokens y shells. Es hoja del grafo y dueña de una sola carcasa | foundations, shells |
| components | Compone primitives y nombra un concepto de **interfaz**, no de negocio | primitives |
| patterns | Resuelve una tarea recurrente y **sí** conoce el dominio | components |
| templates | Nombra una pantalla real y trae contenido final. Se copia, no se importa | patterns |

Dos criterios que resuelven casi todas las dudas:

- **¿Nombra un concepto de interfaz o de negocio?** `Select`, `Dialog`, `Table` son components. `PaymentCard`, `RoleMatrix`, `BulkActions` son patterns.
- **¿Cambia la apariencia de los mismos datos, o agrega estado y flujo de trabajo?** Lo primero es una prop. Lo segundo es un pattern.

## Las cuatro reglas

- **R1 — hacia abajo.** Una dependencia externa (una librería de charts, tiles de mapa) no reclasifica la capa: R1 mira el grafo del sistema.
- **R2 — una variante no es un componente.** Un archivo nuevo por cada variación es lo que produce sistemas con catorce copias del mismo borde. Si es la misma cosa con otra piel, es una prop.
- **R3 — una carcasa, un dueño.** Fuera de los shells, nada redeclara borde+foco+radio de control, backdrop fijo, ni sus propios `@keyframes`.
- **R4 — la composición no se filtra a la API.** Que `Select` esté hecho de `Popover` + `Listbox` es asunto interno. Ninguna prop pública nombra sus partes.

## Los contratos manda sobre el código

`contracts/<id>.json` es la fuente de verdad, no el `.jsx` de referencia.

- `api` — las props públicas. Es lo único versionado: romperlo es breaking change.
- `conformance` — el comportamiento observable, obligatorio y verificable desde fuera. `_base.json` lo hereda todo ítem.
- `composition` — cómo lo construyó el sistema. Aquí es guía: si ya tienes tu propio popover, úsalo, **pero heredas la obligación de cumplir por tu cuenta los criterios que ese shell garantizaba**.

Al implementar un ítem: lee su contrato, cumple `api` y `conformance`, y **agrega su id a `adoption.adopted` en `architecture.json`**. Ahí entra a la revisión; no antes.

## Al escribir componentes

- **Tokens semánticos siempre**, nunca hex ni valores mágicos. Rompe esto y se rompe el modo oscuro.
- **Target de 44px** en cualquier cosa que se toque, incluida la etiqueta.
- **Foco visible** en todo elemento operable.
- **El estado final del render no depende de que corra un frame de animación.** En un iframe en segundo plano, una pestaña oculta o un preview, el componente debe verse completo. Si algo arranca en su frame cero —una barra de altura 0, un panel sin foco— y espera un `requestAnimationFrame` que nunca llega, se ve roto y nadie lo nota en una pestaña activa.
- **Un control no dibuja nada encima de su propia área.** Contadores, iconos y accesorios van en `leading`, `trailing` o `footer` de la carcasa.

## Revisión

```bash
node platforms/check-layers.mjs --target src
```

R1, R2 y R4 bloquean. R3 es un ratchet: su número puede bajar, nunca subir.

Verifica el comportamiento **midiendo el DOM montado**, no leyendo el código: un componente puede cumplir su contrato en el archivo e incumplirlo en la página.
