# Flow — plantilla retirada (4-sep-2026)

Esta plantilla duplicaba el `CLAUDE.md` del repo de implementación y derivaba
en silencio — llegó a predicar `flow-icon` (clase muerta) y una batería de
verificación de tres comandos cuando la real tiene trece rejas.

**La fuente viva es el `CLAUDE.md` de la rama `main`** de este mismo repo:
reglas de cascada, receta contrato-primero (paso 0), convenciones de props,
el pacto del shell (foco/Escape/Tab), la referencia de tokens y la batería
completa. Un repo nuevo que implemente Flow lo copia de ahí, no de aquí.

Lo normativo de esta rama (`canonical`) son `contracts/`, `architecture.json`
y los chequeos de `platforms/` — eso no se copia: se obedece vía
`check:api-drift`, `check:inventory` y `check:conformance`.
