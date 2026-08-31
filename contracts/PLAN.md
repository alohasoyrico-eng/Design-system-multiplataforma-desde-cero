# Plan de remediación de contratos

Estado medido (2026-08-17): **104 de 104 ítems con contrato**, más los 6 shells y `_base`: 110 archivos. Las cinco capas están completas y la reja está puesta.

> El número lo venía incrementando a mano turno a turno y había derivado: decía 89 y eran 82. Los siete de foundations tenían su archivo escrito y nunca se habían enlazado al ítem en `architecture.json`, así que contaban dos veces en la suma manual y cero en el enlace. Ahora `contractCoverage.written` se recomputa contando ítems con `contract` enlazado, y `files` cuenta los archivos aparte, porque los 6 shells son archivos y no ítems de documentación. Segunda vez en la sesión que una cifra dicha al paso estaba mal: la primera fueron los 81 colores literales que llamé tres. Hechas las fases 0, 1 y 2, y en la fase 3 la rebanada vertical, los que componen un shell, data-viz y nueve de superficie y navegacion.

| Capa | Con contrato | Total | Ítems con contrato |
|---|---|---|---|
| foundations | 7 | 7 | color, typography, spacing, shape, motion, icons, a11y |
| primitives | 20 | 20 | completa |

El sistema pasó de 106 ítems a 104: dos de ellos eran variantes y se absorbieron (ver fase 1).
| components | 54 | 54 | completa | table, dialog, chart-kanban, payment-card, map-canvas, datepicker, tabs, menu, tooltip, toast, accordion, pagination, fileupload, notification-center |
| patterns | 8 | 8 | completa |
| templates | 15 | 15 | completa |
| shells | 6 | 6 | control-shell, data-grid, listbox, overlay-shell, popover, toggle-control |

El esquema no es el problema: `_schema.json > allOf` ya distingue por capa — templates exigen `content` y prohíben `api`, patterns exigen `conformance` y prohíben `api`, foundations exigen `tokens` y prohíben `api`. Falta escribir los archivos.

---

## Las dos mitades de un contrato cuestan distinto

Antes del orden, la economía del trabajo, porque decide si esto es viable o si muere en el ítem 30.

**`api` no se escribe: se deriva.** Casi todos los ítems de primitives y components ya tienen su `.d.ts`, y ese archivo *es* el bloque `api` en otra sintaxis. Se extrae con un script: nombre, kind, tipo, default, required. Lo que el `.d.ts` no distingue —`prop` vs `event` vs `slot` vs `renderProp`— se infiere del tipo (`on*` y firma de función → event; `ReactNode` → slot; `render*` → renderProp) y se revisa a mano solo donde la inferencia dude.

**`conformance` sí se escribe, y midiendo.** Es el bloque que no existe en ningún otro archivo del proyecto, y el único que no se puede derivar. La regla del proyecto aplica aquí sin excepción: los criterios se escriben **midiendo el DOM montado**, no leyendo el `.jsx`. Un criterio escrito desde el código describe lo que el autor creyó hacer.

Consecuencia práctica: el coste de un contrato no depende de la capa sino de cuánto comportamiento propio tiene el ítem. Un `Badge` hereda `_base` y añade uno o dos criterios. Un `DatePicker` son seis criterios de teclado y foco que hay que provocar y medir uno por uno.

---

## Fase 0 — foundations (7)

Primero porque todo lo demás hereda de aquí, y porque `_base.json` ya promete cosas que nadie ha verificado a nivel de token: `base-1` (nada escrito a mano) y `base-4` (4.5:1 en claro y oscuro) son afirmaciones sobre foundations, comprobadas hoy en ningún sitio.

Los siete —color, typography, spacing, shape, motion, icons, a11y— no tienen `api`: tienen `tokens` y `conformance`. Sus criterios son los más automatizables del sistema, porque son aserciones sobre una tabla de valores:

- Todo token semántico de color tiene contrapartida en modo oscuro. Sin excepciones sin declarar.
- Todo par texto/superficie del sistema pasa 4.5:1, en claro y en oscuro.
- La escala está completa: ningún hueco en spacing, ningún peso tipográfico usado y no declarado.
- Ningún token semántico apunta a un valor absoluto que no esté en la capa de referencia.

Salida esperada: 7 contratos y un script que verifique sus criterios sobre `tokens/*.css`. Ese script es lo que convierte `base-1` y `base-4` de intención en reja.

### Hecho, y lo que encontró

Los 7 contratos están escritos y `platforms/check-foundations.mjs` los verifica sin dependencias (`node platforms/check-foundations.mjs`, con `--json` para CI). Pasan espaciado (todo múltiplo de 4, hit target 44px), forma (radios 8 < 12 < 16 < 20 < 28) y motion (100, 160, 240, 400ms, con reduced-motion cubriendo las siete variables de duración y transform).

Falló lo que tenía que fallar. Los tres defectos están corregidos y el chequeo pasa limpio; queda el registro de qué eran y cómo se resolvieron:

**col-2 — contraste, 3 pares por debajo de 4.5:1**

| Par | Claro | Oscuro |
|---|---|---|
| `--text-on-accent` sobre `--action-accent` | **3.63** | **3.63** |
| `--status-success-text` sobre `--status-success-bg` | **3.95** | 7.05 |
| `--status-warning-text` sobre `--status-warning-bg` | **3.76** | 6.79 |

**Resuelto oscureciendo el fondo del CTA.** El rojo de marca `#FF3617` (`--flow-red-500`) no se toca: sigue siendo el color de texto de acento, enlaces, estado vivo y foco. Lo que cambió es el fondo de acción: `--flow-red-600` pasa de `#E62D10` a `#DE2409` (4.81:1 con blanco) y entra `--flow-red-700: #CC1F04` para el hover (5.58:1). El valor viejo de red-600 daba 4.42 — fallaba por poco y nadie lo había medido.

Como el rojo oscurecido pasa en ambos modos, `dark.css` dejó de sobrescribir el acento: los dos modos comparten la misma decisión. Los dos tokens quedan declarados en `DARK_EXEMPT` dentro del script, que es donde una excepción deliberada tiene que estar escrita.

Los otros dos pares eran de modo claro solamente; en oscuro daban 7.05 y 6.79. Se resolvieron oscureciendo el texto, no aclarando el fondo, para conservar el tinte suave de la superficie: entran `--flow-green-700: #0C7A47` y `--flow-amber-700: #995B00`, ambos a 4.83:1.

**col-3 — 7 tokens sin contrapartida en oscuro**

`--border-focus`, `--status-success`, `--status-warning`, `--status-danger`, `--status-info`, `--status-live` y `--shadow-accent-glow`. Ninguno era alias de un token que se sobrescriba, así que en oscuro conservaban su valor claro.

**Resuelto dando valor oscuro a los siete.** El foco y el estado vivo suben a `#FF6A52`; los cuatro indicadores de estado se aclaran a los mismos tonos que ya usaba el texto en oscuro (entre 6.7:1 y 9.1:1 sobre la superficie de tarjeta); el glow del acento gana opacidad, porque un fondo oscuro absorbe la sombra.

Tras los arreglos, `check-foundations` no reporta nada.

**Dos falsos positivos que descarté midiendo**, anotados para que nadie los persiga otra vez: los "duplicados" de `motion.css` son el bloque `prefers-reduced-motion` redeclarando a propósito; y los 7 tokens de cromo de chart (`--viz-grid`, `--viz-axis`, `--viz-label`, `--viz-tooltip-*`) no necesitan valor oscuro porque son alias de semánticos que sí se sobrescriben.

## Fase 1 — arreglar antes de documentar (7 ítems)

**Esta fase no escribe contratos: arregla componentes.** Documentar un ítem que esquiva su shell es escribir la desviación en piedra.

La lista de partida decía que cinco controles dibujan su propia carcasa en vez de componer `ControlShell`: combobox, datepicker, daterangepicker, fileupload y otpinput. **Tres de los cinco no eran eso.** El diagnóstico de la lista era del tipo correcto pero de la clase equivocada, y solo mirarlos uno por uno lo mostró.

Y dos que la medición de esta sesión encontró: **menu y tooltip no componen `Popover`**. Los dos se abren anclados a un disparador, y `Popover` es el shell que ya resuelve anclaje, colisión, portal y Escape. Cada uno resolvió cierre y foco por su cuenta.

Al cerrar esta fase, siete ítems pasan a heredar criterios vía `conformance.inherits` en vez de necesitar los suyos, y las infracciones de R3 bajan de 8 a 3 (quedan los `@keyframes` de Button, ChatMessage y OTPInput).

### Hecho: los keyframes bajan a foundations

Tres de los cinco controles de la lista tenían una infracción distinta a la que decía el título, y la encontró el intento de arreglarla. `OTPInput` **no debe** componer `ControlShell`: tiene un solo control —un input oculto con `autocomplete="one-time-code"`— y N casillas `aria-hidden` que pintan el valor. `ControlShell` es una carcasa por control, no una por carácter. Su infracción real de R3 eran sus propios `@keyframes`.

Y esa sí era general: `Button`, `ChatMessage` y `OTPInput` inyectaban cada uno un `<style>` con keyframes, y `OverlayShell` declaraba su familia de cinco. **Los 13 keyframes del sistema viven ahora en `tokens/motion.css`**, que es foundations. Un keyframe es una decisión de movimiento, no de componente: el componente elige cuál aplicar, no lo declara. Eso es exactamente lo que pide el criterio `mot-5` que escribí en la fase 0, y hasta ahora ningún archivo lo cumplía.

Medido en la página: los 13 keyframes resuelven desde CSS, cero etiquetas `<style>` inyectadas, y las animaciones siguen corriendo.

### Hecho: el foco visible baja a foundations

Al revisar el calendario nuevo se midió algo peor que un componente sin anillo de foco: **el sistema entero no tenía ni una regla de foco**. Cero selectores con `focus` en todas las hojas cargadas. Los controles se salvaban porque `ControlShell` pinta `--focus-ring` en la carcasa, pero cualquier cosa operable fuera de una carcasa —los días del calendario, los botones de mes, los atajos de rango, los items de menú— quedaba sin indicador.

Que cada componente se acuerde de su anillo es cómo se llega aquí. La regla vive ahora en `tokens/a11y.css`, foundations, con dos mecanismos:

- `:focus-visible` para el foco que mueve el navegador, con una excepción: el campo interior de una carcasa no dobla el anillo, porque la carcasa ya lo pinta por el control completo. Los adornos de la zona trailing sí lo llevan, porque son objetivos aparte.
- `:focus` dentro de `role="grid"`, `menu` y `listbox`, donde **el foco lo mueve nuestro propio código**. El navegador no considera «visible» un foco que movió un handler, así que `:focus-visible` no se activa justo donde más hace falta: el teclado de rejilla del calendario existe para mover el foco entre días.

También hubo que sacar del `boxShadow` inline el anillo interior de «hoy» y ponerlo en `outline`: un estilo inline le gana a la regla de `:focus-visible`, así que el día de hoy habría sido el único que nunca mostrara foco.

**Y una advertencia de medición que costó tres intentos:** en un iframe que no tiene el foco del sistema, `document.hasFocus()` es `false` y ni `:focus` ni `:focus-visible` coinciden con nada. Un anillo que no aparece ahí no prueba un defecto. Está anotado en `a11y-1`, porque el verificador de la fase 3 va a tropezar con esto y va a reportar todo el sistema como roto.

### Hecho: DateRangePicker era el modo rango de DatePicker

La misma clase de hallazgo, por otra vía. Los dos archivos duplicaban los meses, los días, `iso`, la matemática de la rejilla lunes-primero, los botones de mes, la carcasa a mano y el popover a mano. Lo único que cambiaba de verdad era **la forma del valor**: `string` contra `{from, to}`.

Eso no es una variante de piel, es un `mode` — y el esquema ya tenía el campo, con esta definición exacta: «valores de una prop enum que cambian los requisitos de entrada, no solo la piel». `DatePicker` ahora tiene `mode="single" | "range"`, y 13.900 caracteres de dos archivos se volvieron 9.800 de uno.

De paso salieron tres cosas que ninguno de los dos cumplía:

- **Objetivos táctiles.** Las celdas de día medían 34 y 32px, los botones de mes 32 y 30, los atajos de rango 26. Todos a `--hit-target-min` ahora. El calendario se toca con el dedo.
- **Blanco literal.** Los dos escribían `color: '#fff'` para el día seleccionado, y `DatePicker` además alcanzaba `--flow-ink-300`, un token de referencia, desde la capa de componentes. Ahora es `--text-on-accent` y `--text-muted`.
- **Teclado.** Ninguno tenía navegación de rejilla: se elegía día con el ratón o con veintitantos tabs. Ahora flechas mueven un día y una semana, Home y End van a los extremos del mes, PageUp y PageDown cambian de mes, y salir del mes por una flecha avanza la vista. Un solo día es tabulable; el resto se alcanza con flechas.

Medido en la página: carcasa de 46px, panel en portal, 31 días a 44px, botones de mes y atajos a 44px, el foco entra al panel, flecha derecha va del 1 al 2 de julio y flecha abajo al 9, el día seleccionado pinta blanco desde el token, Escape cierra y el foco vuelve al disparador.

Y como R2 exige declarar la absorción en un sitio legible por máquina, `contracts/datepicker.json` se escribió ya: es el contrato 24, con `supersedes: [daterangepicker, inputdate]` y siete criterios propios.

### Hecho: Combobox no era R3, era R2

`Combobox` no dibujaba una carcasa de más: **era un `Select searchable` de más.** Medido contra `Select`, el solape es total salvo un botón. `Select` ya compone los tres shells que `Combobox` reimplementaba a mano —`ControlShell`, `Popover`, `Listbox`— y además emite `aria-controls` y `aria-activedescendant`, que `Combobox` no emitía. Lo único que `Combobox` tenía y `Select` no era el botón de limpiar.

Eso es R2, que bloquea: una variante no es un ítem. Migrarlo a `ControlShell` habría dejado el duplicado en pie, mejor pintado.

La absorción, en orden seguro y solo borrando al final:

1. `Select` gana `clearable` — el botón vive en la zona trailing de la carcasa, no encima del campo.
2. `Listbox` **pinta** `hint`. Filtraba por él y no lo mostraba: un dato por el que se puede buscar y que no se ve deja al usuario adivinando por qué apareció esa fila. Era la otra mitad de lo que `Combobox` daba, con su columna `meta`.
3. El único consumidor real —`ui_kits/config/index.html`— pasa a `Select searchable clearable`. Los seis dashboards lo desestructuraban sin usarlo nunca.
4. Medido en la página antes de borrar nada: carcasa de 46px, botón de limpiar dentro de la carcasa y sin salirse, `role=combobox` con `aria-controls` y `aria-activedescendant` siguiendo al resaltado, panel en portal, hint visible, Escape cierra.
5. Y entonces sí: fuera el `.jsx`, el `.d.ts`, el `.prompt.md`, la entrada de registry, el ítem de `architecture.json` y las menciones en prosa. `combobox` queda en `supersedes` de `select.json`, que es donde R2 quiere que quede.

El sistema baja de 106 ítems a 105, y las infracciones de R3 de 8 a 4: DatePicker, DateRangePicker, SmallMultiples y BulkActionsTable.

### Hecho: Menu y Tooltip sobre Popover

Los dos ya componen el shell. Para que cupieran hubo que extender `Popover`, no doblarlo:

- **Cuatro lados.** Antes solo colocaba abajo con volteo de eje. Ahora `placement` acepta `top|bottom|left|right` más alineación `start|center|end` en el eje cruzado, voltea al lado opuesto solo si allí cabe mejor, y recorta contra la ventana con 8px de margen. Un lado a secas centra.
- **`surface="none"`.** El shell horneaba la superficie de tarjeta, que es la piel equivocada para un tooltip. Ahora puede ceder la piel sin ceder el anclaje: el tooltip pinta su burbuja inversa y sigue sin declarar keyframes propios.
- **`interactive={false}`.** Un panel que no se puede señalar no escucha clic fuera, no recibe puntero y no mueve el foco al cerrarse.
- **`autoFocus`.** Ver más abajo.

**Dos defectos que solo aparecieron midiendo el DOM montado**, y los dos eran del shell:

El foco no entraba al menú al abrirlo. La causa: el panel arranca en `visibility: hidden` para no parpadear antes de estar colocado, y **un elemento dentro de un subárbol oculto no acepta foco** — enfocar en el frame de apertura falla en silencio. Por eso el foco de entrada lo mueve ahora el shell con `autoFocus`, que es el único que sabe cuándo el panel ya está colocado, y no el consumidor.

Al cerrar con Escape, el foco se iba a `body`. El ancla de `Menu` es un `span` envolviendo un botón, y `span.focus()` no hace nada. El shell ahora busca el descendiente enfocable del ancla en vez de asumir que el ancla lo es.

Medido en la página: items de 44px, panel en portal fuera de cualquier `overflow`, flechas mueven el foco, Escape cierra y el foco vuelve al botón disparador. El tooltip: en portal, `pointer-events: none`, el panel del shell sin fondo ni borde, la burbuja con su piel propia, centrada sobre el ancla con 0.2px de desfase, y recortada a 8px del borde cuando el ancla está contra la ventana. `Select`, el otro consumidor del shell, sigue midiendo igual: ancho del campo, debajo, Escape cierra y devuelve el foco.

## Advertencias de medicion del visor

Tres artefactos del entorno de previsualizacion, no defectos, cada uno descubierto perdiendo una iteracion. Estan aqui para no volver a perseguirlos:

- **Longitudes con deriva subpixel.** Una caja de 44px declarada devuelve 43.9996 en `getBoundingClientRect` y a veces tambien en el estilo computado. Un borde de 2px puede leerse como 1.39. Se compara contra el estilo declarado, no contra el rect.
- **El foco no existe.** `document.hasFocus()` es `false` en el iframe, asi que ni `:focus` ni `:focus-visible` coinciden con nada. Un anillo ausente ahi no prueba nada; se verifica leyendo las reglas cargadas y el estilo inline, que es donde vive el defecto real.
- **`:focus-visible` no se activa con `focus()` de script**, ni siquiera con el foco del sistema. Es por diseno del navegador.
- **Un rect medido a mitad de transicion no es el estado final.** El indicador de Tabs parecia desalineado 117px; sus valores de CSS (`left: 4px`, `width: 113px`) coincidian exactamente con la pestana activa. Se media el resorte en vuelo. Para el estado final se leen las propiedades declaradas, no el rect.
- **Un script de edicion que falla revierte todas sus escrituras.** Paso una vez: el arreglo de la elipsis del DatePicker se aplico y se verifico sobre la cadena en memoria, el script murio al final leyendo un archivo inexistente, y nada se escribio. La fuente parecia arreglada en el log y el archivo seguia igual. **Lo unico que lo delato fue medir el DOM montado**, donde el boton seguia sin su span. Verificar sobre lo que se acaba de escribir no vale; hay que verificar sobre lo que se monto.

## Fase 2 — primitives (17)

Se parten en dos por coste, no por carpeta:

**Presentacionales** — flag, badge, chip, avatar, skeleton, spinner, progress, divider, sparkline. Nueve contratos escritos, con cuatro o cinco criterios cada uno.

La predicción de que serían baratos falló. Escribir el criterio obligó a medirlo, y medirlo encontró cuatro defectos en dos componentes:

- **Los chips medían 36px**, no 44. Y su × era un `span role="button"` **dentro** del `<button>` del chip: contenido interactivo anidado, que ningún lector de pantalla ni teclado maneja bien. Con `onRemove`, la pastilla dejó de ser un botón y pasó a ser contenedor de dos botones hermanos. Quitar y seleccionar son dos acciones y no pueden compartir área.
- **Cinco de los seis colores de avatar fallaban el contraste** con las iniciales en blanco: el ámbar daba 2.44:1, el verde 2.62, el rojo de marca 3.63. Y la paleta era un array de seis hex dentro del componente, o sea invisible a cualquier chequeo. Ahora son `--avatar-1..6` en tokens, los seis por encima de 4.6:1.
- **El punto de presencia iba `aria-hidden` sin texto**: en línea, ocupado y desconectado se distinguían solo por color. Ahora cada uno se anuncia.
- **La foto sin `onError`**: una URL rota dejaba el icono de imagen rota del navegador en vez de caer a las iniciales.

Medido tras el arreglo: chips a 44px con `aria-pressed` correcto, × de 44×44.6 sin anidar, los cuatro avatares de la card entre 4.61 y 4.63:1, y los tres estados de presencia con nombre.

Y dos más que salieron de revisar esa misma medición, porque había medido solo la mitad fácil de dos criterios:

- **El color determinista no distinguía.** `avt-1` pedía determinismo y eso se cumplía, pero cuatro nombres cortos en español caían en dos colores: tres círculos rojos casi iguales en una fila de cuatro. La mezcla `h*31+c` con módulo 6 reparte mal cadenas cortas. Con FNV-1a y avalancha final, los cuatro nombres dan cuatro colores. El criterio ahora dice que **reparte**, no solo que es determinista, y que se verifica con una lista de nombres y no con uno.
- **`skl-2` falló el día que se escribió.** Los tres skeletons estaban correctamente ocultos al lector de pantalla y **nada anunciaba la espera**: para un lector, esa tarjeta era un hueco silencioso. Medí los consumidores antes de dar el criterio por bueno: tres en todo el sistema, ninguno con `aria-busy`. La obligación se partió en dos —`skl-2` sobre el componente, automatizable; `skl-5` sobre el contenedor que intercambia el contenido, manual— y los tres consumidores ya la cumplen.

También creció el anillo del punto de presencia con el tamaño del avatar: un punto rojo de «ocupado» sobre un avatar rojo da 1.27:1, y el anillo de `--surface-card` es lo único que lo delimita. `avt-7` lo dice explícitamente para que nadie lo adelgace luego.

Un detalle que costó una iteración: los botones interiores de una pastilla se estiran al alto de contenido, que es el de la pastilla **menos sus dos bordes**. Para que el objetivo mida 44 limpios, la pastilla suma `2 * var(--border-width)`. Los 2px extra solo los paga el chip que lleva botones dentro.

**Con comportamiento** — button, icon-button, input, field, textarea, checkbox, radio, slider. Ocho contratos, y la medición encontró cinco defectos que compartían una raíz: **el sistema dibujaba las relaciones de un formulario sin declararlas.**

- **`Field` no asociaba nada.** Si el consumidor no pasaba `htmlFor`, la etiqueta quedaba huérfana en silencio: cuatro de seis campos de la card de formularios estaban así. Ahora `Field` genera el id, lo inyecta en su hijo y hace de puente para el resto. De 2 etiquetas asociadas a 6, y cero huérfanas.
- **El error se veía pero no se anunciaba.** El campo de correo inválido tenía `aria-invalid` y el mensaje tenía `role="alert"`, pero nada los unía: para quien navega por audio, el campo estaba mal y el motivo no aparecía. Ahora `Field` referencia el mensaje con `aria-describedby`.
- **El asterisco de requerido no llegaba al control.** La etiqueta decía «Placa \*» con el asterisco correctamente oculto al lector, y el input no llevaba `required`: la única señal era visual, y estaba oculta justo a quien no la ve.
- **La descripción de un radio tampoco llegaba.** «Flotas de 10+ unidades» se leía debajo de la opción Pro y no estaba referenciada. El arreglo va en `ToggleControl`, el shell, así que Checkbox, Radio y Switch lo heredan de una vez.
- **El Slider era arrastrable en 28px** y su pulgar se pintaba con `#fff` a pelo, o sea que desaparecía en modo oscuro. Ahora el carril entero mide `--hit-target-min`, el pulgar sale de `--surface-card`, y el rango expone `aria-valuetext` con el formato: el rango nativo ya sabe decir «8», pero no «8 km».

Para que `Field` pudiera hacer de puente, los cuatro controles que envuelve —Input, Textarea, Select, DatePicker— reenvían ahora las props DOM estándar a su elemento de campo. Se eligió `aria-describedby` y `required` en vez de inventar un nombre propio precisamente para que no haya que mapearlo en cada control.

Medido tras el arreglo: 6 etiquetas con `for` válido y ninguna huérfana, el inválido apuntando a un mensaje que existe, `required` en el control, el radio con su descripción referenciada, y el slider con carril de 44px y `aria-valuetext` de «8 km».

Y dos más en `Button`, que no salieron en esa medición porque `Button` no aparece en la card de formularios:

- **El tamaño `sm` medía 36px.** Y el mismo hueco estaba en `ControlShell`, cuyo `sm` medía 38, con cuatro usos en pantallas de producto. Era el único objetivo del sistema por debajo de 44. Con el suelo puesto, `sm` solo puede distinguirse por padding y tipografía, y eso es correcto: la alternativa era que «sm» fuera el hueco por donde el sistema entero se salta el objetivo táctil. Queda como criterio propio de la carcasa (`cs-7`).
- **El botón en carga no estaba deshabilitado.** Quitaba el `onClick` pero dejaba el elemento habilitado, así que seguía recibiendo foco y podía enviar el formulario. Ahora `disabled: disabled || loading`; medido, dos clics seguidos disparan cero handlers.

De paso, el variant `danger` pintaba su texto con `#fff` a pelo — el mismo defecto que el pulgar del Slider y los días del calendario. Van tres.

## Hecho antes de la fase 3: el chequeo de color, y lo que encontro

Dije «van tres blancos literales». Medido: **81**. Cuarenta hex, quince funciones de color y veintiseis alcances a la capa de referencia desde primitives y components. La estimacion al paso estaba equivocada por un factor de veintisiete, y por eso el chequeo iba antes que el siguiente contrato.

`platforms/check-color.mjs` verifica `col-1` sobre primitives, components y ui_kits: hex, `rgb()/hsl()`, y `var(--flow-*)` fuera de `tokens/`. Ignora comentarios, y lleva dos excepciones **con motivo escrito**, porque una excepcion sin razon es un defecto sin registrar:

- **FlowChart** lee los tokens del DOM en runtime para pasarlos a ECharts, que no entiende `var()`. Sus dieciseis hex son el ultimo recurso de cada lectura, no decisiones de diseno.
- **PaymentCard** es color de artefacto: una tarjeta roja sigue siendo roja en modo oscuro. Alcanza `--flow-*` a proposito, y sus valores pasaron a tokens propios (`--card-fg-*`, `--card-dim-*`) para que se puedan auditar.

Los hex bajaron de 40 a 16, y los 16 son la excepcion declarada. Trece archivos cambiaron. El caso que mas importaba: **el check del Checkbox se pintaba `#fff` sobre `--action-primary`**, y en modo oscuro `--action-primary` es `#F4F3F1` — blanco sobre casi blanco. Una casilla marcada era invisible en oscuro y nadie lo habia visto. Ahora es `--text-on-inverse`, que se invierte con el modo.

Tambien salieron de aqui dos paletas escondidas en arrays de componente —la de ilustracion de OnboardingCarousel y la de la tarjeta— que ahora son tokens.

### Y un fallo que causo mi propio proceso

Regenerar el bundle a mano metio **JSX crudo** en `_ds_bundle.js` al re-emitir `TopBar.jsx` desde su fuente: el bundle es un script plano y no transpila, asi que `window.Flow` entero dejo de existir y el dashboard renderizo 23 nodos. El error aparecio como `Unexpected token '<'` a cuatro mil lineas del cambio.

Tres archivos de ochenta estaban en JSX. `TopBar` se reescribio en `React.createElement` como el resto —y de paso gano nombre accesible en su buscador y en su boton de notificaciones, objetivos de 44px y tokens de forma en vez de radios literales—. Quedan `Sidebar` y `FlowChart`.

Y el proceso manual paso a ser `platforms/build-bundle.mjs`, que **se niega a emitir JSX**. Los dos archivos que siguen en JSX se copian del bundle vigente y el generador lo avisa en cada corrida, nombrandolos: un cambio en esas dos fuentes no llega al bundle hasta reescribirlas. Es deuda visible en vez de una bomba de relojeria.

## Hecho: el chequeo de objetivos tactiles

El defecto de las pestanas a 36px no era el cuarto caso aislado: era el patron. Medido sobre las fuentes, **veintiun objetivos operables declaraban un alto o ancho literal por debajo de 44px, en catorce archivos**. Ninguno lo violaba por descuido: cada componente traia su propia tabla de medidas. El olvido no era el problema; el problema era que la altura se decidia por componente.

`platforms/check-targets.mjs` verifica `a11y-2` sobre `primitives/` y `components/`. Mira el entorno de cada medida para decidir si pertenece a algo que se toca, ignora lo que esta por debajo de 20px —un punto, una barra— y descarta la caja cuya otra dimension es minima, porque un asa de 40x5 es una linea y no un objetivo. Dos excepciones declaradas con motivo: el `width` de una columna en `DataGrid` y el cursor dibujado de `OTPInput`.

Doce componentes corregidos de una pasada: el cerrar de Dialog y Drawer (36), el asa de BottomSheet, el enviar de ChatComposer (38), la campana de NotificationCenter (40), los botones de pagina (36), los segmentos de SegmentedControl (40), las acciones masivas (36), los filtros de tabla (32), el limpiar de GlobalSearch (32), el buscador de HelpCenter (36) y las casillas de RoleMatrix (26). Todos a `--hit-target-min`, con el glifo intacto.

Medido tras el arreglo: cero medidas literales por debajo de 44 en las fuentes, y el boton de cerrar del dialogo montado a 43.9996 con Escape funcionando.

## Fase 3 — components (51)

El bulto. Se ordena por dependencia de shell, porque eso decide el tamaño de cada contrato:

1. **Los que ya componen un shell** — hechos. drawer, bottom-sheet, table-tree, role-matrix, input-amount, input-phone y segmented heredan de su shell y quedan cortos. `RoleMatrix` se verificó limpio: doce casillas, cada una con permiso, rol y estado en su nombre accesible, a 44×44 tras el arreglo de objetivos, y los cuatro roles bloqueados deshabilitados de verdad.

   **Y el octavo no era lo que decía su nombre.** Escribí el contrato de `table-timeline` afirmando que compone `DataGrid` con columnas. Al medirlo: no compone `DataGrid`, no tiene columnas, y su único consumidor es una demo de documentación — cero pantallas de producto. El registry ya lo marcaba como «candidata a fusionarse con Timeline» y yo le estaba escribiendo prosa de ítem estable encima.

   Su contrato quedó en `beta`, con la composición real y con la pregunta declarada en el propio archivo: `Timeline` ya resuelve el historial de un registro con estado por evento, y la única diferencia real es el eje proporcional al tiempo. Decidir si sobra no es trabajo del contrato, así que está anotado en `pendingWork` y no resuelto a la callada.
2. **Los nueve del dashboard de flota** — hechos. tabs, menu, tooltip, toast, accordion, pagination, fileupload, notification-center y datepicker ya tienen contrato, con cuatro a seis criterios cada uno.

   La medición de esta tanda dio un defecto: **las pestañas medían 36px en la variante pill y 40 en underline**. Es el mismo hallazgo que ya salió en Button, ControlShell y Chip — cuatro componentes distintos con su propio suelo por debajo de `--hit-target-min`. Ninguno lo violaba por descuido puntual: cada uno tenía su propia tabla de alturas, y ese es el patrón. Lo demás de Tabs se verificó correcto: tablist con `aria-selected`, flechas que cambian de pestaña y mueven el foco, una sola tabulable por grupo, y el indicador alineado al píxel con la activa.
3. **Data-viz** — hechos los ocho. Su `conformance` es de otra naturaleza, así que los cuatro criterios del estado degenerado son comunes a todos: sin datos, con un solo dato, con todos los valores iguales, y color que sale de la paleta de dataviz.

   Y como esos criterios no se pueden verificar leyendo el archivo, se escribió el arnés: `docs/demos/dataviz-degenerado.html` monta los ocho charts con los tres casos, cada uno dentro de un límite de error propio para que el que reviente se identifique en vez de tumbar la página.

   La primera corrida encontró **tres charts mudos sin datos**: `SmallMultiples` no dibujaba ni escribía nada —`Math.min` de un array vacío da `Infinity`—, `BulletChart` mostraba solo su leyenda «Real / Meta / Periodo anterior», que es una leyenda de nada, y `GanttChart` una tarjeta vacía. Indistinguibles de un fallo de carga. Los cinco que delegan en `FlowChart` sí traían estado vacío, porque el shell lo resuelve una vez para todos. Los tres ahora comparten ese mismo texto.

   **Y el contrato del Gantt estaba mal escrito por mí:** puse `label` donde el componente lee `name`. Con la prop equivocada dibuja sus barras con el nombre vacío y parece no renderizar — de hecho así lo midió el arnés en su primera corrida, y el defecto aparente era mío. Corregido el contrato, el Gantt dibuja sus dos tareas. Queda `gnt-4`: una tarea sin `name` debe mostrar un marcador visible, no una barra muda.

   Segundo caso del turno de afirmar composición o API sin abrir el archivo, tras `table-timeline`. Los dos salieron al medir, no al revisar.
4. **El resto** — hechos card, card-media, emptystate, stattile, breadcrumb, stepper, timeline, circular-progress y status-view. Quedan quince: chat (tres), global-search, sidebar, topbar, help-center, otpinput, passcodekeypad, transaction-row, biometric, tabbar, onboarding-carousel, bulk-actions y filters-inline-edit.

   Tercera tanda, que cierra la capa: los tres de chat, global-search, help-center, onboarding-carousel, bulk-actions-pattern y filters-inline-edit. Dos de ellos declaran en su propio contrato que son las dos infracciones de R3 que quedan —`BulkActionsTable` y `FilterableEditableTable` dibujan carcasa de control propia—, con `level: should` para que la deuda esté escrita donde se va a leer.

   Segunda tanda: tabbar, sidebar, topbar, transaction-row, otpinput, passcodekeypad y biometric. Aquí la medición salió limpia, que es lo primero que pasa en toda la fase: `TransactionRow` escribe el signo además de colorearlo y lleva el importe en mono; `OTPInput` tiene **un solo** input real con `autocomplete="one-time-code"`, teclado numérico, nombre «Codigo de 6 digitos» y las casillas ocultas al lector; `BiometricPrompt` ofrece salida a passcode.

   `PasscodeKeypad` quedó anotado como no verificado porque no aparecía en la card de fintech. **La nota era falsa:** tiene demo propia en `docs/demos/otp-input.html` y yo había medido la página equivocada. Medido ahí: 10 teclas de 72px con nombre accesible, «Borrar» nombrado, y el valor nunca legible en el DOM.

   Lo que sí faltaba era la mitad de `pkp-2`: el progreso estaba en un `role="status"` **sin `aria-live`**, o sea un texto correcto que no se anuncia al cambiar. Decía «2 de 6 digitos» a quien lo leyera al entrar y a nadie más. Añadido `aria-live="polite"`.

   La medición de la primera tanda dio tres defectos, los tres en `Breadcrumb` y `Stepper`:

   - **Los enlaces del breadcrumb medían 16px.** El chequeo de objetivos no los había cazado porque su alto no era una medida literal: salía del `padding: '4px 6px'` sobre texto de 13px. Un objetivo puede quedarse corto sin declarar ninguna cifra, y eso es un límite del chequeo que conviene tener presente.
   - **Su nombre accesible estaba en inglés**: `aria-label="Breadcrumb"` en un sistema cuya regla de copy es español neutro. El texto accesible es copy, y se le aplican las mismas reglas que a lo que se ve. Ahora es «Ruta».
   - **El Stepper no decía el progreso en texto.** Tenía `aria-current` y tres círculos, así que quien no los ve oía los nombres de los pasos sin saber en cuál está. Ahora emite «Paso 2 de 3: Conductor» para el lector.

   Y rompí el bundle otra vez, esta vez con un error de sintaxis: al insertar el texto de progreso me comí la llave que cerraba el objeto de props del `ol`. El síntoma fue «bundle no cargado» y `Unexpected token '.'` a mil líneas del cambio. La lección se repite: **medir el DOM montado es lo que detecta lo que la lectura del propio parche no ve.**

## Fase 4 — patterns (8) — hecha

Sin `api` por esquema. Un contrato de pattern es `conformance` + `composition` + `implements`, y su trabajo real es declarar qué garantiza la receta que no garantiza ninguno de sus componentes por separado.

Eso cambió la naturaleza de los criterios: de los 40 escritos, **la mayoría son `verify: manual`**, y no por pereza. Que volver un paso del wizard conserve lo escrito, que guardar en el detalle no reordene la tabla bajo el cursor, o que el error de credenciales no revele cuál de los dos campos falla, son propiedades de un flujo con estado a lo largo de varias pantallas. No hay DOM que medir en un instante.

Los que sí son automatizables salieron de defectos ya corregidos en esta sesión, y por eso están: `dsh-p5` —la barra de herramientas del dashboard envuelve en vez de desbordar— y `dsh-p4` —los huecos de carga llevan Skeleton del tamaño final dentro de un contenedor con `aria-busy`—. Los dos son la generalización de un arreglo concreto.

Dos decisiones que merecen nota:

- **`country-select-pattern` lleva `documentsAbsorption: ["select-country"]`.** Menciona un id absorbido a propósito, y R2 exige declarar esa intención en vez de adivinarla. Su criterio `pai-p5` dice explícitamente que la receta **no** crea un componente `SelectCountry`: ese componente existió, se absorbió, y si vuelve es una variante que R2 rechaza.
- **`dataviz-flotas-grandes` es una guía de decisión, no una composición.** Su `conformance` no describe comportamiento observable sino cuándo elegir qué gráfica. Es el caso límite de la capa, y está declarado como tal en su `nonGoals`: no es un componente, no se importa.

## Fase 5 — templates (14) — hecha

`content` + `conformance`, con `fleet-dashboard-t` como modelo. Aquí `conformance` es de pantalla, y el bloque `content` es lo que sustituye al `api`: superficie, producto, viewport, modo, y un `slot` por zona con lo que la llena.

Dos plantillas obligaron a decisiones que no eran obvias:

- **`drivers-app-t` declara `theme: ["dark"]` y un criterio que dice por qué**: arranca en oscuro y se queda, porque es una app que se usa conduciendo de noche. No es una preferencia del usuario, es una decisión de producto.
- **`mailings-templates` es la única capa que no puede usar el sistema.** Su contrato lo dice en `nonGoals` y en dos criterios: HTML de tablas con estilos en línea, y **los colores escritos en hexadecimal a propósito** — es el único sitio del sistema donde eso es correcto, porque el cliente de correo no resuelve `var()`. Declararlo evita que un chequeo futuro lo persiga o que alguien lo "arregle".

## R3 llega a cero y pasa a bloquear

Las dos ultimas carcasas propias se resolvieron **componiendo, no repintando**: `BulkActionsTable` pasa sus acciones a `Button` y su cerrar a `IconButton`; `FilterableEditableTable` pasa sus filtros a `Input`, que compone `ControlShell`. Ninguno de los dos declara ya borde, radio ni anillo de foco.

Como el ratchet llego a cero, **R3 pasa de `warn-ratchet` a `block`**. Era la condicion escrita en la propia regla desde el principio.

Y al medirlo salio el quinto caso del mismo patron: **`IconButton size="sm"` medía 36px**. Van Button, ControlShell, Chip, Tabs y IconButton — cinco componentes, cada uno con su propia tabla de tamanos por debajo del suelo.

Lo importante es por que el chequeo no lo habia cazado: la medida no estaba en una declaracion de estilo sino en una **tabla de tamanos** (`{ sm: { d: 36 } }`), y `d` no es una propiedad CSS. `check-targets.mjs` ahora escanea tambien las tablas con claves `sm/md/lg`. Medido tras ampliarlo: ninguna tabla del sistema por debajo de 44.

Es la segunda vez que el escaner tiene un punto ciego —la primera fueron los enlaces del breadcrumb, cuyo alto salia del padding y no de una cifra— y las dos veces el hueco se encontro midiendo el DOM montado, no leyendo el escaner.

## Sidebar sale del JSX

`Sidebar` reescrito en `React.createElement`: era una de las dos fuentes que el generador del bundle tenia que copiar sin regenerar, o sea un cambio ahi no llegaba al bundle. Queda solo `FlowChart`, con sus 31.500 caracteres.

La reescritura arreglo tres cosas que estaban en su contrato sin cumplirse: la nav no tenia nombre, el item activo no llevaba `aria-current` y las secciones colapsables no declaraban `aria-expanded`. Y el criterio `sbr-5` cambio de sentido: decia que el archivo estaba en JSX —una nota de proceso disfrazada de criterio— y ahora dice lo que importa, que **el globo del modo colapsado es decorativo y el nombre accesible lo lleva el boton**. Un tooltip como unica fuente del nombre no existe para quien no ve.

Medido: 9 items a 44px, nav con nombre, un `aria-current`, una seccion con `aria-expanded`.

## El generador del bundle no podía correr

Cinco chequeos escritos y ninguno ejecutado nunca, porque aquí no hay Node. Así que replicé la lógica de `build-bundle.mjs` y la corrí contra las fuentes reales. **Falló en la primera línea:** `bundle-order.json` tenía una entrada que no es una ruta —`"primitives/Sparkline.jsx + components/Bars.jsx"`— porque en el bundle original esos dos componentes compartían una sección. El generador habría muerto intentando leer ese archivo.

Es exactamente la familia de defecto que `contracts/PROBE.md` ya documentaba: metadata con forma de ruta que no resuelve. El `src` de `checkbox` y `radio` fue el mismo caso, con el mismo separador. Reaparece porque nadie había intentado *usar* la metadata.

Partida en dos entradas reales y regenerado el bundle entero desde las fuentes: 80 secciones, 82 exports, ninguno perdido ni añadido, y las cards cargan sin error. Solo `FlowChart` se copia sin regenerar, y el generador lo avisa nombrándolo.

De paso, el dashboard de flota traía su propio botón de modo oscuro **a 32px**, escrito a mano en la plantilla en vez de con `IconButton`. Sexto caso del patrón, y el primero en una plantilla y no en un componente: el suelo de 44 se salta igual de fácil desde arriba.

## El escaner de objetivos cubria media casa

El boton de 32px del dashboard no era un descuido suelto: `check-targets.mjs` solo miraba `primitives/` y `components/`, y las plantillas son `.html` con JSX en linea. Ampliado a `ui_kits/`, aparecieron **ocho objetivos mas**: el mismo boton de modo copiado en siete plantillas —seis dashboards y config— y un «Atras» de 40px en el onboarding de conductor. Todos pasaron a `IconButton`, que ya trae el objetivo, el foco y el hover.

Y dos que el escaner marcaba mal, corregidos en el escaner y no en el codigo: el enlace del logo, donde la medida de 24 es la **imagen** y no el enlace —que ahora declara `--hit-target-min`—, asi que ignora las lineas con `<img>` o `<svg>`. Medido al final: 113 archivos escaneados, cero objetivos por debajo de 44.

Tercer punto ciego del mismo escaner, y el mas caro: los dos anteriores le costaban un componente cada uno; este ocultaba siete plantillas iguales. **Un chequeo que no cubre una capa no dice que esa capa este bien: dice que no se mira.**

## FlowChart nunca estuvo en JSX

El ultimo pendiente estructural resulto no existir. `FlowChart` **no tiene una sola linea de JSX**: las dos coincidencias que lo marcaban eran un `</span>` dentro de una cadena de tooltip de ECharts, con comillas escapadas que el limpiador de cadenas del detector no supo cerrar.

Esa deteccion equivocada lo mantuvo marcado como intocable durante toda la remediacion, y de paso me hizo escribir en tres sitios —`architecture.json`, el plan y el contrato de Sidebar— que el archivo estaba en JSX. Ninguno de los tres era verdad.

El detector ahora exige que el `<` este en **posicion de expresion**: tras `(`, `return`, `=>`, coma o ternario. Medido con la regla nueva: **cero archivos con JSX** en los 79 del bundle.

Y regenerar el bundle entero por primera vez destapo dos defectos que llevaban ahi desde el principio:

- **`ToastStack` desaparecia del namespace.** El mapa de archivos con varios exports apuntaba a `primitives/Toast.jsx` y `Toast` vive en `components/`. Como la ruta no existia, el generador emitia solo el export por defecto.
- **`loadEcharts` y `buildOption` tampoco estaban declarados**, y los exporta `FlowChart`.

Los tres se perdian **en silencio**: un export que falta no rompe nada hasta que alguien lo usa. Ahora el generador se niega a emitir un archivo que exporte un nombre no declarado, con el nombre en el mensaje. Bundle final: 79 secciones, 83 exports, ninguna seccion copiada sin regenerar.

## La reja, puesta

`platforms/check-contracts.mjs` comprueba tres cosas: que cada ítem de `architecture.json` apunte a un contrato que existe, que la capa del contrato coincida con la del ítem, y que el contrato cumpla el `allOf` de `_schema.json` —que **no** es uniforme entre capas—. Además recomputa R4 desde el propio contrato: ninguna prop pública puede repetir un nombre de `composition`. Queda como regla R5 en `architecture.json`, con severidad de bloqueo.

**El primer defecto que encontró fue mío, y de los buenos:** `payment-card.json` declaraba `layer: "patterns"` y traía siete props públicas. El esquema prohíbe `api` en un pattern precisamente porque una cosa con props es un component, y `architecture.json` ya lo tenía en components. Dos fuentes decían cosas distintas y nadie las había cruzado. Corregido a `components` con `domain: "fintech"`.

Van cinco chequeos automatizados, y los cinco salieron de un defecto que apareció más de una vez: capas, color, objetivos táctiles, foundations y contratos.

---

## La reja, al final

Cuando la cobertura llegue a 106, `platforms/check-layers.mjs` gana una regla nueva: **todo ítem de `architecture.json` tiene contrato, y todo contrato valida contra `_schema.json`**. Sin eso la cobertura vuelve a caer en la primera semana, porque nada impide añadir un ítem sin contrato.

Mientras se avanza, el número que se vigila es `contractCoverage.written`, y es un ratchet: puede subir, nunca bajar.

## Qué desbloquea qué

No hace falta terminar las seis fases para ir a Claude Code. La primera pantalla necesita:

- Fase 0 completa (7 contratos) — porque el dashboard consume tokens en cada línea.
- Fase 1 completa para menu, tooltip, fileupload y datepicker — los cuatro que usa el dashboard de flota.
- Fase 3.2, los nueve del dashboard.
- Fase 5, solo `fleet-dashboard-t`, que ya está escrito.

Eso son 16 contratos nuevos y 4 componentes arreglados. El resto puede escribirse mientras la primera pantalla ya se implementa, siempre que ningún ítem entre a `adoption.adopted` antes de tener el suyo.
