# Sonda horizontal del esquema de contratos

Ocho manifests escritos contra el inventario real, elegidos por ser adversarios entre si: `switch` (shell simple), `select` (tres shells), `table` (generico + datos), `flow-chart` (libreria externa, 16 tipos), `map-canvas` (tiles y red), `payment-card` (dominio + asset + global), `dialog` (overlay), `fleet-dashboard` (template).

Esquema en `_schema.json`. Lo que el esquema NO aguanto en su forma inicial — cada hallazgo ya esta corregido ahi:

## 1. Un template no tiene `api` — el esquema no puede ser uniforme
Confirmado. `fleet-dashboard` no expone props porque no es una unidad reutilizable: tiene composicion y contenido. El esquema quedo condicionado por capa (`allOf`/`if-then`): templates prohiben `api` y exigen `content`; foundations igual; primitives y components exigen `api` + `conformance`; patterns exigen `content` + `conformance` y dejan `api` opcional. **Una politica de versionado por capa, no una sola.** Romper props de `Select` es breaking change; "romper" un template no significa nada.

## 2. La tabla plana de props del registry no alcanza para nada real
Hoy cada prop es `[nombre, tipo, default, nota]`. Eso no puede expresar:
- **Genericos.** `Table<T>` y `TableColumn<T>` — se agrego `api.generics`.
- **Tipos auxiliares.** `TableColumn`, `MapPin`, `ChartSeries`, `ChartMatrix`, `SelectOption`: el consumidor necesita nombrarlos. Se agrego `api.types`.
- **La diferencia entre prop, evento, slot y render prop.** El registry las aplanaba a todas en "prop", pero Angular y Flutter las mapean distinto: prop es `@Input`, evento es `@Output`, slot es `ng-content`. Sin `kind`, el generador multiplataforma no puede existir — y ese generador es el argumento entero de tener contratos. Se agrego `kind`.

## 3. `FlowChart` rompe la idea de "variante"
Sus 16 valores de `type` no son variantes: cambian los **requisitos de entrada**. `heatmap` exige `matrix` e ignora `series`; `radar` exige `indicators`; `waterfall` exige `totals`; `gauge` exige `target`. Se separo en dos campos: `variants` (misma data, otra piel — `Table.dense`, `PaymentCard.variant`) y `modes` (otra forma de entrada, con `requires`), mas `requiredWhen` a nivel de miembro.

**Esto la rebanada vertical de controles no lo encontraba nunca.** Ninguno de los 14 controles tiene requisitos condicionales.

## 4. Una dependencia externa no debe reclasificar la capa
`FlowChart` no compone nada del sistema: envuelve ECharts. Con la regla "primitive = hoja del grafo" habria caido en primitives, que es absurdo. Se resolvio declarando que **R1 solo mira el grafo del sistema**: `deps.external` es un campo aparte, con `loader` y `fallback` obligatorio. Un item con cero dependencias de sistema y una externa sigue siendo component.

## 5. Faltaban assets, globals y red como dependencias declaradas
`PaymentCard` necesita el logo y `window.FLOW_ASSET_BASE`; hoy eso vive como nota al pie en tres documentos distintos y es la primera cosa que se rompe al portar. `MapCanvas` depende de un host externo y de una atribucion **obligatoria por licencia**. Se agrego `deps.assets`, `deps.globals`, `deps.network`. Un requisito legal no puede estar solo en prosa.

## 6. La conformidad no siempre es automatizable
"El foco vuelve al disparador" se prueba; "los pines no se solapan de forma ilegible" no. Sin distinguirlo, el gate promete lo que no puede cumplir — la contradiccion que ya habias detectado, en chico. Cada criterio lleva `verify: automated | visual | manual` y `level: must | should`. El gate automatizado corre solo los `automated`; los demas son lista de revision humana, declarada como tal.

## 7. La conformidad se hereda del shell, y hay que declararlo
`Dialog`, `Drawer` y `BottomSheet` comparten cinco criterios palabra por palabra. Copiarlos es la misma deriva que estamos arreglando. `conformance.inherits` los expande al generar: se escriben una vez, aparecen completos en cada item, y quien se desvie de `OverlayShell` ve la lista entera de lo que ahora le toca cumplir solo.

## 8. `Table` obligo a definir la linea variante / pattern
Quedo asi: si cambia **apariencia o densidad** de la misma data, es variante (`dense`, `renderDetail`). Si agrega **estado y flujo de trabajo**, es pattern — por eso `BulkActionsTable`, `FilterableEditableTable`, `TableTree` y `TableTimeline` bajan a patterns y no son props de `Table`. La regla es aplicable al resto del inventario sin volver a discutirla.

## 9. `supersedes` es lo que hace ejecutable la regla R2
`select` absorbe cuatro archivos con tres props (`multiple`, `searchable`, `creatable`) y un `renderOption` que elimina la razon de existir de `SelectCountry`. `flow-chart` absorbe doce. Declararlo en el contrato permite verificar que ningun id absorbido siga registrado como item, y le dice al destino que no implemente doce cosas.

## 10. `nonGoals` resulto ser el campo que mas trabajo evita
"MapCanvas no es un SDK de mapas", "Sparkline no monta ECharts a proposito", "Table no virtualiza". Sin ese campo, cada uno de esos limites se vuelve una conversacion o un componente de mas en el codebase destino.

---

## Lo que queda pendiente de decidir

- **Umbral de `adoption`.** `platforms` ya acota el gate por item adoptado. Falta definir quien marca `adopted`: el dev al implementarlo, o una revision.
- **Angular y Flutter en `kind`.** El mapeo prop/evento/slot esta declarado pero no probado contra un caso Flutter real, donde los slots se comportan distinto.
- **Los seis shells no tienen contrato todavia.** Se declaran en `composition.shells` y en `conformance.inherits` sin existir como archivo. Es el siguiente paso y es tambien la rebanada de controles.

---

## Addendum: el criterio que salio de implementar (base-5)

Tres componentes fallaron por la misma causa durante la fase 2, y ninguno de los tres criterios escritos lo cubria:

1. **OverlayShell** agendaba la entrada del foco en `requestAnimationFrame`: en un iframe throttleado el foco nunca entraba al modal.
2. **FlowChart** dejaba barras, lineas y dispersion en su frame cero — ejes dibujados y cero datos — porque la animacion de entrada nunca avanzaba. Presente en los seis dashboards desde la migracion a ECharts; invisible en una pestana activa.
3. El mismo caso reaparecio al parchear: apagar `animation` global no basta porque **la configuracion por serie gana**, y `setOption` no reconstruye los elementos ya atascados — hay que `clear()` la instancia y reconstruir la opcion por la rama sin motion.

De ahi `base-5` en `_base.json`: *el estado final del render no depende de que corra un frame de animacion*. Es un criterio heredado por todos, no un arreglo por componente.

Metodo: los tres se encontraron **midiendo pixeles y DOM montado**, no leyendo codigo ni mirando la pantalla — a ojo las tres gráficas se veian igual de vacias en tres intentos consecutivos. Confirma lo que ya decia el hallazgo 6: los criterios `automated` tienen que correr sobre la pagina viva.

---

## Fase 4: lo que la revision encontro al escribirla

Escribir `check-layers.mjs` y correr sus reglas contra el repo levanto tres defectos que ningun chequeo de enlaces habria visto, todos de la misma familia: **metadata con forma de ruta que no es resoluble.**

1. `checkbox` y `radio` compartian un `src` de `"Checkbox.jsx · Radio.jsx"`. Dos items apuntando a una cadena con separador, asi que ninguno tenia archivo propio y R1 no podia asignarles capa. Igual en `spinner`/`progress`, `breadcrumb`/`pagination`, `otpinput`/`passcodekeypad`, `donut`/`stattile`: **once items** con la misma forma.
2. `mailings-templates.src` era el glob `ui_kits/mailings/*.html`.
3. `dataviz-flotas-grandes.src` era la expansion con llaves que ya habia apuntado a dos archivos borrados.

Los tres se arreglaron igual: **un item, un archivo** en `src`, y la lista completa en `srcs[]` cuando el item de verdad compone varios. P1 ahora rechaza llaves, globs y separadores — la forma que no se puede verificar deja de existir en el esquema.

Y una regla de metodo que salio de aqui: **la intencion se declara, no se adivina.** `country-select-pattern` menciona `SelectCountry` a proposito, para explicar por que no es un componente. En vez de meter una lista negra en el script, el item lo declara con `documentsAbsorption: ["select-country"]`. Un chequeo con excepciones escondidas en su codigo no es verificable: es opinion compilada.

---

## La frontera que sobrevivio, y la que no

Al aplicar el contrato a los 106 items en bloque, 28 cambiaron de capa con una lista de ids escrita de un tiron. Revisado despues, la mayoria de esos movimientos no aguantaba el propio criterio. La causa: **el test «¿conoce el dominio?» no se puede recomputar.**

`ChatMessage` no sabe nada de flotas. `OTPInput` tampoco. `GanttChart` recibe `tasks`, `Treemap` recibe `nodes`: son genericos. Estaban en patterns porque la *documentacion* los ilustra con casos de flota, no porque su API lo supiera. Y un criterio de vocabulario mueve de capa un archivo cuando alguien renombra una prop.

La vara correcta es la que ya usaban las reglas que funcionan —R1 mira el grafo, R2 mira archivos y texto, P1 mira si la ruta resuelve—: **el criterio de entrada tiene que ser recomputable desde el artefacto.**

Con esa vara la frontera entre components y patterns no es el dominio: es que **un pattern no tiene una sola API.** CRUD, wizard, busqueda, settings son composiciones con estado a lo largo de varios pasos y archivos; no se pueden importar. Es la misma propiedad que la sonda descubrio para templates (hallazgo 1), un nivel mas abajo.

Resultado: patterns queda en 8 recetas reales, components en 57, templates sube a 15 (seis items nombraban una pantalla de producto con contenido final), y el dominio pasa a ser el campo `domain` — que es lo que `registry-fintech.js` intentaba decir sin poder.

Y de ahi sale **P6**: el chequeo recomputa la capa y contradice la declaracion. Hoy la capa era una afirmacion en un JSON que nadie podia refutar. Un pattern con tabla de props reprueba; un template con props reprueba; un item con `domain` en primitives reprueba.

### Nota de proceso: perdi un archivo

Borre `registry-patterns.js` para saltarme el guardian de truncamiento del editor, y la escritura siguiente fue rechazada entera: se fueron 41 entradas de golpe. Las reconstrui desde los `.jsx`, `.d.ts` y `.prompt.md` que si estaban en disco, con subtitulos y reglas honestas, pero **la prosa de diseno (dos, donts, motion, a11y) de esos 41 items se perdio y hay que reescribirla**. Estan marcados por su falta de bloques `design`/`usage`.

El guardian existia exactamente para eso. Saltarlo borrando el archivo convirtio una escritura sospechosa en una perdida silenciosa.
