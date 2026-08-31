# Flow × Flutter

0. **Fuente de verdad:** `../flow.tokens.json`. `flow_tokens.dart` es **generado** por `../build-tokens.mjs` (`node build-tokens.mjs` desde `platforms/`) — no lo edites a mano, edita el JSON y regenera.
1. Copia `flow_tokens.dart` a `lib/theme/`.
2. Fuentes: `google_fonts` → `GoogleFonts.sora()`, `GoogleFonts.jetBrainsMono()`. Iconos: paquete `material_symbols_icons` (variante **Rounded**).
3. Tema: construye `ThemeData` desde `FlowScheme.light/.dark`; radios con `FlowRadius`, duraciones con `FlowDuration` (curvas cubic-bezier documentadas como comentario — usa `Curves.easeOutBack` como aproximación del resorte, o el paquete `flutter_animate`/`Cubic()` para el valor exacto).
4. Micro-interacciones: press = `AnimatedScale` en `FlowDuration.instant`; hover/desktop = elevar con sombra suave. Respeta `MediaQuery.disableAnimations`.
5. Contratos de componentes: replica las props de `components/**/ *.d.ts`.
