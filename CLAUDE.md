# Reglas de trabajo en este proyecto

## Método: nunca borrar para poder escribir

El guardián de truncamiento del editor —«refusing to commit: would shrink an existing file to under half its prior size»— **es la revisión, no un trámite**. Si se dispara, la regeneración está incompleta hasta que se demuestre lo contrario.

Borrar el archivo para que la escritura pase convierte una advertencia en una pérdida silenciosa. Ya pasó una vez en este proyecto: se fueron 41 entradas de `registry-patterns.js` y su prosa de diseño no se pudo reconstruir.

**Para cualquier operación masiva o destructiva: copiar → verificar → borrar.** Escribir el estado nuevo en una ruta nueva, comprobarlo, y sólo entonces quitar el viejo. El peor caso pasa a ser duplicación temporal, que el chequeo detecta, en vez de datos perdidos.

Aplica en especial a la fase 1 de la arquitectura (mover ~120 archivos a carpetas por capa).

## No afirmar números sin medirlos

En este proyecto las cifras dichas al pasar han estado mal casi siempre: «los ui_kits están llenos de estilos inline» (eran 9 casos nombrables), «cobertura 7 de 106» (eran 14 contratos, con uno huérfano), «los siete de data-viz son los que más se usan» (aparecen una vez cada uno; `StatTile` tiene 37 usos). Medir cuesta un script; equivocarse esconde trabajo pendiente.

## Verificar midiendo, no mirando

Los defectos de esta sesión —foco que no entra al modal, filas comprimidas a 41px, gráficas con ejes y cero datos, `aria-activedescendant` nunca emitido— se encontraron **midiendo el DOM montado y contando píxeles**, no leyendo código ni viendo la pantalla. Tres intentos consecutivos se vieron idénticos a ojo.

## La arquitectura

Cascada de cinco capas con dependencias sólo hacia abajo. El contrato está en `architecture.json`, la revisión en `platforms/check-layers.mjs` (R1-R4, P1-P7), y los contratos por ítem en `contracts/`.

Regla de oro del criterio de capa: **si el chequeo no lo puede recomputar desde el artefacto, no se puede sostener y va a derivar.** Por eso el dominio es un campo (`domain`) y no una capa.

## Antes de documentar, comprobar que se usa

Un ítem sin consumidor no tiene cómo estar bien: nadie ha descubierto qué le falta. Antes de escribirle prosa de diseño, contar sus usos en `ui_kits/`. Si son cero, la pregunta es si sobra, si le falta pantalla, o —como pasó con `KanbanBoard`— si la pantalla existe y lo está esquivando porque el componente está mal especificado.
