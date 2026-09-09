# Changelog — @alohasoyrico-eng/flow-react

Formato: [Keep a Changelog](https://keepachangelog.com/es/1.1.0/) · versionado [SemVer](https://semver.org/lang/es/).
La regla de la casa: toda prop nace en el contrato canónico antes que en el código; lo que aparece aquí ya pasó por esa puerta.

## [0.6.35] — 2026-09-09

### Añadido
- **AuthForm: modo `sso` — el traspaso a un proveedor (auth-1)** — el patrón cubría ingreso, registro y recuperación: las tres cajas que RECOGEN credenciales. Una pantalla que delega en un IdP no tenía cómo usarlo —o pintaba campos que no puede tener, o se escribía a mano—, y eso es la forma en que entra media empresa (cazado en eOne, cuyo único acceso es un traspaso a Edenred Connect bajo el contrato de que la app nunca ve la contraseña). En `sso` la caja se queda sin campos, no hay nada que validar y el botón de envío ES el traspaso; `submitIcon` le pone su candado. El segundo factor sigue fuera a propósito: es `OTPInput` o `BiometricPrompt` compuestos en la misma carcasa, como dice el canon.

## [0.6.34] — 2026-09-08

### Añadido
- **StatTile sin tarjeta (stt-8)** — `bare` pinta la cifra con su rótulo y su nota, pero SIN la superficie del Card, para composiciones que ya tienen la suya: una fila de cifras dentro de un panel, una ficha dentro de una lámina. Sin esta salida el consumidor tenía dos caminos malos —anidar tarjeta dentro de tarjeta, o copiar a mano rótulo+cifra+nota—, y eOne tomó el segundo cinco veces en su organigrama y otras tantas en la ficha de estación, calcando declaración por declaración lo que ya vivía aquí. Mismo escape que `LimitBar.bare`.

## [0.6.33] — 2026-09-08

### Arreglado
- **SegmentedControl: la píldora sigue a su casilla (sgc-1)** — la medida se tomaba una sola vez por cambio de valor o de número de casillas, y la geometría cambia por más motivos: reetiquetar (otro idioma, una cifra viva en la etiqueta) mueve el ancho sin mover la cuenta, y el contenedor puede estrecharse o la tipografía cargar tarde. La píldora se quedaba con la medida vieja y desbordaba sobre la casilla vecina (cazado en eOne, migrando Conductores: indicador de 119 px sobre una casilla de 98). Ahora un `ResizeObserver` sobre la casilla activa y la raíz la mantiene medida.

## [0.6.32] — 2026-09-08

### Cambiado
- **Pagination: el bloque de páginas se centra (pag-9)** — con el nav estirado, las páginas quedaban pegadas al selector de tamaño; ahora el espacio libre se reparte por igual a ambos lados y el bloque queda centrado entre el contador y el selector. En uso compacto los autos colapsan y nada cambia. Pedido por el dueño de eOne para el directorio de estaciones.

## [0.6.31] — 2026-09-08

### Arreglado
- **Pagination: la cifra grande era el contador de rango (pag-8 corregido)** — en 0.6.30 la subida a `--type-data-md` cayó en los números de página; el dueño se refería al contador «X–Y de Z». Los numerales regresan a su talla de control (`--type-data`) y el rango pasa a dato grande en mono: es LA cifra del pie. Las 5 páginas por extremo se quedan como estaban.

## [0.6.30] — 2026-09-08

### Cambiado
- **Pagination: 5 páginas por extremo y numerales en cifra grande (pag-8)** — la elipsis ya no desemboca en un número suelto: los DOS extremos enseñan 5 páginas (ventana constante de 15 casillas; con 15 páginas o menos se ven todas). Y los números de página suben a `--type-data-md` — son solo numerales, la voz mono a 20px los hace legibles de un vistazo. Pedido por el dueño de eOne para el directorio de estaciones.

## [0.6.29] — 2026-09-08

### Cambiado
- **Pagination: ventana de ancho constante (pag-7)** — la vecindad `±1 + extremos` encogía la fila en los bordes (en la página 1 de 582 quedaban solo «1 2 … 582»). Ahora la ventana son SIEMPRE 7 casillas cuando hay más de 7 páginas: cerca de los bordes la vecindad se ensancha en vez de encoger, así la fila no cambia de ancho ni las flechas se mueven bajo el cursor al navegar.

### Añadido
- **Pagination: primera/última página (pag-7)** — botones de salto a los extremos (`first_page`/`last_page`), solo cuando la lista se trunca: con todos los números visibles el salto ya está a un clic y las flechas extra estorban. Pedido por el dueño de eOne para el directorio de estaciones.

## [0.6.28] — 2026-09-08

### Añadido
- **DataTable usa la Paginación completa (dtb-7)** — el pie pasa de páginas peladas al contrato entero que Pagination ya tenía: rango «X–Y de Z», páginas y selector de tamaño (`pageSizeOptions`). El nav se estira al ancho del pie y el rango empuja a la izquierda — páginas y selector cierran por la derecha; en uso compacto nada cambia. Pedido por el dueño de eOne para el directorio de estaciones.

## [0.6.27] — 2026-09-08

### Arreglado
- **MapCanvas: el zoom conserva el lugar (mpc-5)** — el offset del paneo vive en píxeles de mundo y el mundo duplica su tamaño por nivel: los botones ± cambiaban de nivel sin reescalarlo y la rueda además reseteaba el paneo a cero, así que zoomear estando paneado «teletransportaba» (cazado en eOne: «el zoom está súper buggy»). Ahora todo cambio de nivel reescala el offset y el lugar bajo el cursor se queda donde estaba.

### Añadido
- **MapCanvas: botón de centrar (mpc-5)** — junto al zoom, vuelve al encuadre: del conjunto de `fitBounds` si lo hay, del centro declarado si no. El pan y el zoom manual siempre tienen regreso.

## [0.6.26] — 2026-09-08

### Añadido
- **MapCanvas: el tooltip lista sus atributos y el punto lleva glifo (mpc-4)** — `MapPin.details` pinta los atributos como LISTA en la burbuja (una fila por dato; `subtitle` queda como forma corta de una fila), y el modo punto acepta `icon`: el glifo a escala del punto, como textura de identidad. Pedido por el dueño de eOne para las estaciones de su red.

## [0.6.25] — 2026-09-08

### Cambiado
- **MapCanvas: el pin es una GOTA y el tooltip habla el idioma del sistema (mpc-3)** — el pin chip pasa a la anatomía clásica de «aquí»: cabeza circular con su icono y cola que toca la coordenada exacta (el círculo flotante tapaba el lugar que decía señalar); aro `--surface-card`, halo y sombra como estaban. Y el tooltip del mapa deja la tarjeta blanca con mono: es la burbuja INVERSA del sistema —`surface-inverse`, texto claro, `radius-sm`, `shadow-float`—, la misma voz que el Tooltip de UI y los tooltips de las gráficas. Pedido por el dueño de eOne para su red de afiliados.

## [0.6.24] — 2026-09-08

### Arreglado
- **ScaleLegend: el icono grande antes de su etiqueta** — icono→texto en los dos extremos, no en espejo (dueño de eOne, 8-sep): «$ Más barato … $ Más caro».

## [0.6.23] — 2026-09-08

### Añadido
- **MapCanvas: encuadre y centro controlado (mpc-2)** — `fitBounds` recibe los puntos a encuadrar: cuando el conjunto cambia, el mapa se centra y elige el zoom que los contiene con margen; entre cambios, el pan del usuario manda. Y el `center` pasa a ser controlado de verdad: al cambiarlo, el mapa va ahí y suelta el pan acumulado — sin esto, seguir una selección tras un encuadre sumaba el desplazamiento viejo y centraba en otro sitio. Cazado en eOne: al filtrar por estado el mapa viaja a ese estado, al soltar el filtro vuelve al país. Era la pérdida asumida del 0.6.21 (el fitBounds de Leaflet); dejó de ser asumible cuando el dueño la pidió.

## [0.6.22] — 2026-09-08

### Añadido
- **ScaleLegend (scl-1)** — la leyenda de una ESCALA: un rango continuo cortado en tramos, de menor a mayor. Tres decisiones de nacimiento (dueño de eOne, la escala de precio de su red de afiliados): tonos de un mismo color y no un semáforo —verde→rojo dice bueno/malo y un rango no juzga—; la geometría CRECE con el valor, así la dirección se lee sin distinguir tonos; iconografía de refuerzo opcional, chica en el mínimo y grande en el máximo. La casilla de ausencia de dato va aparte: «sin dato» no es un tramo del rango.
- **Tokens `--viz-scale-1..5`** — escala de color para rangos SOBRE IMAGEN (azules claro→oscuro): la rampa gris de heatmaps desaparece sobre los tiles grises de un mapa. En oscuro evita los extremos que se funden con el fondo.

## [0.6.21] — 2026-09-08

### Añadido
- **MapCanvas: modo de red densa (mpc-1)** — `MapPin.size` pinta el pin como PUNTO: relleno + aro fino, sin sombra ni halo, y SIN botón DOM propio (miles de marcas de dato harían el grupo intransitable a teclado; su superficie accesible es la tabla que las lista, como en una gráfica). El punto elegido u hovered crece y gana aro de tinta; su tooltip de label/subtitle sigue vivo. Cazado en eOne: 6 977 estaciones ahogaban el chip de 24px y sus 6 977 botones.
- **MapCanvas: la ruta acepta TRAMOS (mpc-1)** — `route` admite `[lat,lon][][]` además de la polilínea simple. Una ruta real llega a menudo como MultiLineString con tramos que no se tocan (el ruteo del INEGI); unirlos trazaría rectas que cruzan un golfo y que nadie puede conducir.
- **DataTable: `searchable` (dtb-6)** — `false` oculta el buscador, para tablas cuyo dueño ya filtra aguas arriba: dos cajas de búsqueda pegadas confunden sobre cuál filtra qué (cazado en eOne: el directorio de estaciones ya tiene «Buscar estación» en los filtros de la pantalla).

## [0.6.20] — 2026-09-08

### Eliminado
- **Muere el modo por niveles de RoleMatrix (rmx-1, 0.6.19)** — vivió un día. Nació para acomodar el vocabulario compuesto del RBAC legado de eOne (completo/lectura/gestión con nota por celda) y el dueño lo señaló como lo que era: preferir el legado antes que adoptar Flow. Un «nivel» no pide celdas nuevas: pide DESCOMPONERSE en las acciones booleanas que concede —ver, escribir, administrar—, cada una en su fila, que es exactamente lo que la matriz booleana ya expresaba. `Permission.hint` sobrevive como rmx-2: el matiz bajo el nombre del permiso es anatomía legítima de la fila, no herencia del legado.

## [0.6.19] — 2026-09-08

### Añadido
- **RoleMatrix por niveles (rmx-1)** — una matriz de permisos no siempre es booleana: un RBAC real concede NIVELES (completo, lectura, gestión…) con un alcance por celda. Con `levels` declarado, la celda es `{ level, note? }` y se pinta como badge del tono del nivel con su nota; la celda vacía es una denegación explícita y se dice con «—», no con hueco. `Permission.hint` lleva el matiz bajo el nombre («módulo pendiente de construcción»). Cazado en eOne: la matriz de ADR-001, la fuente de verdad de su control de acceso.

## [0.6.18] — 2026-09-08

### Arreglado
- **i18n: los valores viajan por `formatMessage`, no por `.replace()` (i18n-2)** — `useT` acepta valores y DataTable, Pagination, CardCarousel y BulkActionsTable los usan. Formatear «Buscar en {caption}» sin la variable revienta con `FORMAT_ERROR` en consola en cada render (cazado en eOne: 100+ errores al abrir el desglose del ranking de consumos). Sin provider, la interpolación cae al reemplazo simple.

## [0.6.17] — 2026-09-08

### Cambiado
- **La familia title pasa a Edenred Black** — `--type-title-lg` y `--type-title-md` suben de Bold/Regular a Black 900 (decisión del dueño, análisis de jerarquía en eOne): un título de sección o de card debe pesar MÁS que el contenido destacado que vive dentro, y en regular el título de card competía —y perdía— contra los `body-md-strong` del cuerpo. Entra `--ref-type-wt-black` (900) al catálogo de pesos y el corte real `edenred_black-webfont.woff2` a `public/fonts` (existía en eOne; el DS solo había vendoreado Regular y Bold — nada de bold sintético).

## [0.6.16] — 2026-09-07

### Arreglado
- **Popover/Select: el control ya convive en fila (pp-4)** — `.root[data-fill]` llevaba `width: 100%`, y un flex item con width 100% dentro de una fila que envuelve se queda SIEMPRE su línea entera: ningún Select podía sentarse junto a un botón. En flujo de bloque un `display: block` llena su contenedor igual, así que los formularios no cambian. Cazado en eOne (la cabecera del organigrama partía selector y botón en dos filas); el grid de su barra de filtros era un workaround de este mismo defecto y el diagnóstico anotado entonces —«el panel oculto infla el max-content»— era incorrecto: el panel vive en portal desde pp-1.

## [0.6.15] — 2026-09-07

### Añadido
- **`TableTree.defaultExpanded` (tt-1)** — claves abiertas al montar. Un árbol que nace todo colapsado no puede enseñar su primer nivel ni revelar una selección restaurada. Cazado en eOne: la vista de organigrama abre con las divisiones a la vista, y el nodo elegido en una sesión anterior no puede quedar escondido tras un chevron.
- **`TableTreeRow` y `TableTreeColumn` salen al barrel** — un consumidor con filas tipadas (celdas compuestas vía `render`) no podía nombrar el tipo que ya usaba.

## [0.6.14] — 2026-09-07

### Añadido
- **FlowChart `bar`: superposición de línea (fc-6)** — una serie que declara `type: 'line'` se pinta como línea del sistema sobre las barras, con sus extras respetados (el mismo mecanismo que scatter). Nació de eOne: la línea de «ayer a esta hora» sobre las barras de consumo — sin ella, «hemos consumido 18 000 L» no dice si es mucho o poco.

### Arreglado
- **FlowChart `bar`: la barra negativa redondea su extremo libre (fc-6)** — el remate redondeado quedaba contra la línea de cero y la barra parecía rota. Cazado en eOne: los litros de un tramo salen negativos cuando los abonos superan a las cargas, y ese tramo es justo el que no se puede esconder.

## [0.6.13] — 2026-09-07

### Arreglado
- **Input `type="number"`: muere el stepper nativo** — el spinner del navegador (▲▼) aparecía al enfocar, cromo del sistema operativo sin diseñar dentro de un control que el DS promete poseer (cazado en eOne: el diálogo de objetivos con foco y sin foco no eran el mismo control). `appearance: textfield` + supresión webkit.

## [0.6.12] — 2026-09-07

### Añadido
- **`StatTile.action`**: acción de la tarjeta en la esquina del encabezado — un IconButton (ajustar, abrir detalle). Nació de eOne: sus objetivos editables se disuelven en StatTiles con el engrane a la vista, en la misma familia que el resto de sus KPIs.

## [0.6.11] — 2026-09-07

### Arreglado
- **CardMedia compone Card** — dibujaba su propia superficie con el híbrido borde+sombra que no existe en el vocabulario del Card (el mismo retirado de StatTile en 0.6.8). El modo `interactive` (foco, teclado, hover lift) también pasa a ser del Card (crd-1). Hallazgo de la auditoría de superficies pedida por el dueño de eOne al inventariar la familia de tarjetas.
- Pendiente anotado de la misma auditoría: **NavCard** usa surface-card+radius-lg sin sombra ni borde — desviación menor en pieza de docs; se decidirá con su pantalla.

## [0.6.10] — 2026-09-07

### Arreglado
- **WidgetFrame compone Card — muere la cuarta superficie.** La pieza llegó PORTADA del registro de eOne con su piel legada (radius-md + borde, sin sombra), que no existe en el vocabulario del Card (elevated/outlined/inverse, todas radius-lg). El dueño de eOne lo cazó comparando tarjetas vecinas: el marco de widget desentonaba con todo Card/StatTile por construcción. Mismo tratamiento que StatTile en 0.6.8; el banco hereda el cambio (widgets pasan de borde+16 a sombra+20).

## [0.6.9] — 2026-09-07

### Añadido
- **`WidgetFrame.actions`**: acciones del widget en su cabecera, a la derecha del título y antes del toggle de personalización. Nació de eOne: sus widgets con escritura (Objetivos del periodo — Ajustar/Restaurar) necesitan actuar desde el marco, no inventarse una cabecera propia dentro del cuerpo.

## [0.6.8] — 2026-09-07

### Arreglado
- **StatTile compone Card — una sola superficie de tarjeta en el sistema.** Dibujaba la suya propia con un híbrido que no existe en el vocabulario del Card (borde Y sombra; elevated es sombra sin borde, outlined es borde sin sombra), así que cualquier Card vecino desentonaba por construcción (cazado en eOne: sus tarjetas-medidor en Card real nunca podían igualar a los StatTile). Cambio visible: el StatTile pierde el borde de 1px y pasa al padding del Card (--pad-card, sensible a densidad).

## [0.6.7] — 2026-09-07

### Añadido
- **`LimitBar.bare`**: solo la pista, sin encabezado — para composiciones que ya dicen etiqueta y valores en su propio lenguaje. Conserva `kind` y el estado over/met del relleno. (Las tarjetas-medidor de eOne hablan en el idioma del StatTile — cabecera con icono y numerales en familia de dato grande — y la pista es el refuerzo.)

## [0.6.6] — 2026-09-07

### Añadido
- **`StatTile.deltaArrow`** (default `true`): permite retirar el glifo de tendencia del delta. Con `deltaTone` en juego, `trending_up` (culturalmente «mejora») junto a un danger rojo manda dos señales opuestas — cazado en eOne: «↗ +325 %» en rojo leía como contradicción. El signo del texto ya dice la dirección (stt-2 se cumple con texto); sin glifo quedan signo = dirección y color = juicio.

## [0.6.5] — 2026-09-07

### Añadido
- **`LimitBar.stacked`**: etiqueta arriba y valores abajo, en dos filas — para tarjetas estrechas donde la fila única envolvía ambos lados en un dos-columnas apretado. En apilada, los valores hablan a tamaño de estadística (`--type-data-md`, en primary; over/met conservan su color).

### Arreglado
- **LimitBar: las cifras entran a la familia de dato** (`--type-data-sm`, tabular) — iban en `body-md`, fuera del idioma numérico del sistema (stt-1 lo exige para StatTile; la misma regla vale aquí). Cazado en eOne: sus tarjetas-medidor desentonaban con los KPIs vecinos.

## [0.6.4] — 2026-09-07

### Añadido
- **`StatTile.deltaTone`**: el color del delta deja de deducirse SOLO del signo. «+» pintaba success siempre — y en un KPI de gasto o consumo, subir es malo (cazado en eOne: «+330 % de gasto» en verde). La flecha sigue diciendo la dirección; `deltaTone` dice si es buena. Sin la prop, el comportamiento de siempre.

## [0.6.3] — 2026-09-07

### Añadido
- **`LimitBar.kind`** (`cap` | `goal`): cruzar el 100% de un techo es danger; cruzar un OBJETIVO es la meta cumplida — success. La pieza solo conocía techos y el objetivo de unidades de eOne (≥ 92%) pintaba danger justo al cumplirse. El «en peligro» de V1, completado por la segunda pantalla que lo pidió.

## [0.6.2] — 2026-09-07

### Añadido
- **`LimitBar.format`**: los valores del encabezado aceptan formateador propio — el default sigue siendo moneda con `$` (el origen wallet de la pieza), pero un techo de litros o un objetivo en % ya no se disfrazan de dinero (cazado en eOne: «$70.952,8» para 70 952,8 L).

### Arreglado
- **LimitBar: el relleno se acota al 100%** — sin tope, un 111% desbordaba la pista redondeada. Pasarse del límite ahora se dice con color (`data-over`: relleno y valores en danger), no saliéndose del carril — el «en peligro» que V1 dejaba pendiente de pantalla, decidido por la primera pantalla que lo pidió.

## [0.6.1] — 2026-09-07

### Arreglado
- **Calendar: la última columna desbordaba el panel** — el ancho de `.root` era un 20rem a mano que dejaba 296px útiles para 308px de celdas (7 × hit-target); la banda de rango sangraba por el borde derecho. El ancho ahora se calcula del contenido, y el hueco horizontal del grid muere: la continuidad del rango la da el contacto entre celdas, no el desborde accidental.
- **Anillo de foco doblado en triggers-span** (Select, DatePicker): el supresor del anillo interior de ControlShell solo cubría `input/textarea/button`; los spans con `tabindex` recibían el anillo global ENCIMA del `focus-within` de la carcasa. El `:where()` gana `[tabindex]`. (Ambos cazados en la migración de eOne.)

## [0.6.0] — 2026-09-05

### Añadido
- **Demos móviles homogéneas**: los 8 CTAs de flujo que quedaban en md (Aceptar/Pasar/Finalizar del Driver, Disputar/Cerrar de Wallet y CardDetail, el submit de Auth) pasan a lg — y una reja nueva del banco lo vigila (todo Button fullWidth de pages/mobile declara lg).
- **`InputPhone.size` gana `lg`**: las pantallas de alta hablan lg — un campo md entre controles lg desentona. El paso de teléfono del onboarding queda homogéneo (Select lg + InputPhone lg, 52px medidos iguales).
- **Select**: lo elegido no pierde su cara — en single, el trigger viste el valor con el mismo `renderOption` de las filas (la bandera del país sigue ahí tras elegir; en multiple resume con texto).
- **`InputPhone.prefix` admite ReactNode**: bandera compacta + lada como adorno de la carcasa, sincronizada al selector de país — sigue fuera del valor y no borrable (tel-1). El onboarding del banco ahora usa la pieza real (antes un Input genérico con la lada al lado equivocado). Specimen `input-phone` registrado (ratchet 37).

- **`Card.selected`** (decisión 5-sep): anillo inset `--border-focus` + superficie `--surface-accent-subtle` — seleccionado legible sin color (crd-3, ahora automated). `aria-pressed` cuando la tarjeta es operable.
- **NotificationCenter**: estado vacío real («Sin notificaciones — todo al día») en vez de panel en blanco (ntf-6).
- 7 especímenes más (DataTable, ToastHost, Sidebar con grupos, TransactionGroup, DocumentViewer, HelpCenter, NotificationCenter) — ratchet spm-1 en 36.

### Arreglado (cierre visual, 5-sep)
- **Las banderas no pintaban — en ninguna parte, desde 0.4.0**: el `@import` de flag-icons vivía dentro de un CSS Module y lightningcss hasheaba sus clases (`.Xxx_fi-mx`) mientras el componente ponía las globales (`fi fi-mx`). Ahora entra global desde `styles.css` (SVGs inlineados como data-URI en `flow.css`, +~1.7 MB autocontenidos) y hay test de regresión que lo vigila.
- **DataTable**: la zona de filas ancla su altura a la de una página completa — la última página corta ya no encoge la tabla (dtb-5).
- **Card**: la franja de `status` ya no la pisa el borde de la piel outlined (cascada corregida).
- **TransactionGroup**: el label de fecha va en mono como manda trg-1.
- **Banco**: la cola casera de toasts (AppLayout) reemplazada por ToastHost/useToast; receta de país con bandera en el onboarding (pai-p1..p4, sin componente nuevo — pai-p5); pantallas Driver y Rutas ruteadas.

- **Registro de especímenes** (`@alohasoyrico-eng/flow-react/specimens`): la tercera pata de cada pieza — el contrato promete, la ficha describe, el specimen demuestra. 29 piezas con render vivo y sus variantes, typechequeado contra las interfaces reales (spm-1), como entry propio que el principal no arrastra (spm-2, verificado en dist), consumido genéricamente por Component Detail (spm-3). Contrato canónico `specimen-registry` nuevo.

### Arreglado (pasada visual, 5-sep)
- **ChipGroup** apaga el borde individual de los chips hijos (cg-1).
- **Breadcrumb** colapsa rutas largas por el medio conservando el primero y el actual (brc-3).
- **Calendar** en rango: los extremos redondean solo por su lado exterior (dp-6).
- **`MarkLineComponent` de ECharts nunca estuvo registrado**: toda línea de referencia (`markLine`) del sistema era invisible en silencio. Registrado; con ello el Pareto dibuja su umbral (prt-3, nueva prop `threshold` de FlowChart) y el scatter sus cuadrantes (sct-2, ahora en tinta `--viz-label` distinguible de la rejilla).
- **Treemap**: la etiqueta de un nodo demasiado pequeño para ella ya no se trunca («Manten…») — se oculta y el tooltip la conserva (tmp-2).
- **Flag**: anillo interior `--border-subtle` — una bandera con blanco al borde ya no se desvanece (flag-2).
- **TabBar**: respeta `env(safe-area-inset-bottom)` (tbr-5).
- **Banco**: el passcode fallido dice cuántos intentos quedan y la pantalla de Auth quedó ruteada como tercer demo móvil (ao-3).

## [0.5.0] — 2026-09-04

### Añadido
- **DataTable** (patrón nuevo): búsqueda, orden y paginación coordinados sobre Table — la consulta filtra, el orden se aplica al conjunto filtrado completo y la paginación recorta al final; buscar devuelve a la primera página y el recuento se anuncia en `aria-live` (dtb-1..dtb-5).
- **Table / DataGrid** `caption`: la tabla se nombra para el lector con `<caption>` visualmente oculto (tb-5).
- **StatTile** `description` (contexto bajo el delta) y `loading` (esqueleto con `aria-busy`, sin cifras falsas) (stt-6, stt-7).
- **Sidebar**: grupos con `caption: true` — rótulo no interactivo con hijos siempre listados; colapsado se reduce a separador (sbr-6).
- **Tooltip**: el disparador recibe `aria-describedby` hacia el globo mientras está visible (tip-6).
- **Card** `status` ('success' | 'warning' | 'danger' | 'info'): franja de estado con tokens `--status-*` (crd-6) — y escala de `padding` ('none' | 'sm' | 'md' | 'lg'); el valor libre sigue aceptado como puente de migración.
- **Pagination** `total` + `pageSize` (rótulo «X–Y de Z»), `pageSizeOptions` + `onPageSizeChange` (selector de tamaño; cambiar el tamaño emite `onChange(1)`) (pag-6).
- **SectionHeader** `description`: bajada en muted fuera del heading — el outline queda limpio (sh-3).
- **Escala de capas** `--z-*` en tokens (base/sticky/header/overlay/popover/toast/tooltip): los diez z-index globales de la librería salen de la escala; el diccionario y el CSS mantienen paridad (398/398).

### Añadido (shells)
- **ToastHost + useToast**: la cola de avisos vive una sola vez — apila con tope FIFO (`max`, default 3), `show()` devuelve id, `dismiss(id)` retira, la acción del aviso también lo retira, y cada aviso vive su `duration` propia (default 5000 ms, `null` = persistente). `useToast` fuera del host truena con mensaje claro (th-1..th-3).
- **D5 (i18n)**: los strings hardcodeados de Calendar («Mes anterior/siguiente»), Select («Limpiar»), ChatMessage («Escribiendo»), Toast y Drawer («Cerrar») pasan por intl con default en español — sin provider nada cambia.
- **Popover en portal** con colisión completa (pp-1/pp-2): ningún overflow o transform del ancestro lo recorta; voltea al lado opuesto solo si allí cabe mejor, se recorta contra la ventana con 8px en el eje cruzado y, si no cabe en ningún lado, limita su altura con scroll interno en vez de deslizarse sobre el ancla. Sigue al ancla en scroll/resize y el origen de la animación sale del lado real.
- **OverlayShell en portal** + `dismissOnBackdrop` (false para diálogos que exigen decisión).
- **Listbox**: `aria-activedescendant` en la lista, Home/End y typeahead (lb-2/lb-3).
- **ControlShell** `invalid` (canónico; `error` queda como alias `@deprecated`) + `filled` documentado.
- Los cinco contratos de shells (control-shell, listbox, overlay-shell, popover, toggle-control) entran a la arquitectura del canon y sus 24 criterios automatizados quedan medidos.

### Añadido (deuda saldada)
- **Barrido i18n completo**: los ~25 aria-labels y textos en español duro que quedaban (TopBar, Sidebar, BulkActionsTable, FilterableEditableTable, GlobalSearch, MapCanvas, PasscodeKeypad, KanbanBoard, CardCarousel, NipReveal, Breadcrumb, PageHeader, HelpCenter, ChatComposer, NavBar, RouteBanner, Treemap, CodeBlock…) pasan por intl con default en español. `CodeBlock` ahora dice «Copiar código» (antes «Copy code»).
- **Banco documental con dientes**: 13 criterios automatizados nuevos para las piezas de documentación (AnatomyView, BalanceDisplay, CardCarousel, DocFooter, DownloadCard, GuidanceCard, InstallCard, NipReveal, PageHeader, PlaygroundCanvas, ProfileMenu, ProposalCard) + `nr-1` promovido de manual a automated. El id `tg-1` de transaction-group pasa a `trg-1` (colisión con toggle-control).
- **GanttChart**: cada tarea dice sus fechas en texto («14 ago – 17 ago») bajo su nombre (gnt-1 — antes solo geometría).
- **Auditoría visual con acta** (`docs/audits/visual-2026-09-04.md`): recorrido del banco contra los 181 criterios `visual`; 46 verificados, 2 defectos corregidos (gnt-1 y el treemap de Finanzas que pintaba por categoría en vez de por desvío, tmp-1), y la cola restante enumerada con causa.

### Cambiado
- El contrato canónico de `data-grid` deja de ser huérfano: reescrito al API real del primitivo, registrado en la arquitectura y medido (dg-1/2/3/9/10). Selección masiva, edición y árbol siguen en sus propias piezas, como decide el paquete.
- El nombre accesible de Pagination es «Paginación» (antes «Paginacion»), y sus textos pasan por `useT` (caen a español sin provider).
- Popover ahora se apila por encima del backdrop de overlay (`--z-popover` > `--z-overlay`): un popover abierto dentro de un modal ya no queda debajo.

## [0.4.0] — 2026-09-04

### Añadido
- Primera publicación en **GitHub Packages**; la instalación por git queda retirada (registry o `.tgz` de respaldo vía `npm pack -w packages/flow-react`).
- `docs/USUARIO.md` viaja en el paquete: las reglas del repo consumidor para humanos y agentes.
- Servidor MCP con `get_contract` y `get_user_guide` (además de inventario, APIs, tokens y reglas de arquitectura).
- `Toast.duration` con pausa en hover/foco — el timeout deja de ser de la app (tst-2).
- FileUpload valida `accept` también al soltar, y su zona es botón (teclado ✓).
- Teclado sobre canvas: MapCanvas con pines-botón; ScatterPlot/Treemap con listbox paralelo (`aria-activedescendant`).

### Cambiado
- El repo es workspace: `packages/flow-react` (publicable) + `apps/banco` (banco de plantillas, privado). El tarball no lleva banco.
- `Input.invalid` es el nombre canónico; `error` queda como alias `@deprecated` hasta 1.0.
- ToggleControl se reescribe a composición por children (Radio queda fuera a propósito).

## [0.3.0] — 2026-09-04

### Añadido
- Programa de conformance completo: 355/355 criterios automatizados del canon citados por test o check (`check:conformance` con ratchet).
- Triángulo de API cerrado: `check:api-drift` (canon ↔ ficha) en cero, sin divergencias declaradas.
- Rejas de CI: catálogo, inventario, foundations, targets, color, iconos, a11y estática, paridad de tokens.
- Lazy ECharts con degradación; ~60 defectos reales corregidos (anillo de foco global, Escape por capas, trampa de Tab en diálogos, sparklines NaN, AuthForm sin autocomplete, entre otros).

## [0.1.0] — 2026-09-02

- Arranque del paquete: 126 piezas (50 primitives, 59 components, 17 patterns), tokens ref→sys→comp con Style Dictionary, catálogo con fichas (`items.json`).
