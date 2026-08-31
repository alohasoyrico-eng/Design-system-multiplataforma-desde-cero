# Flow Design System

**Flow** es el design system de una plataforma de movilidad con tres productos:

1. **Drivers App** — app móvil para conductores: conectarse a turno, aceptar viajes, ver ganancias. Oscuro-friendly, uso con una mano, al sol y de noche.
2. **Fleet Manager Dashboard** — web densa para gestores de flota: mapa vivo, telemetría, CRUD de unidades y conductores, reportes.
3. **Internal Tools** — CRM interno para administrar los servicios de los otros dos productos: soporte (tickets), cuentas (flotas y conductores), pricing (tarifas/comisiones), casos (fraude/disputas) y back-office (aprobación de documentos). Shell propia, distinta de Fleet Manager, con roles y permisos.

Multiplataforma por contrato: la referencia canónica vive aquí (tokens CSS + componentes React); `platforms/` lleva los mismos tokens a **Angular (SCSS)**, **Flutter (Dart)** y **JSON W3C** para agentes y pipelines. Documentación bilingüe: prosa en español, nombres de API en inglés.

**Dirección visual elegida: "Canvas" (opción 1a)** — claro y aireado, neutros arena cálidos, rojo quirúrgico (solo acción y estado vivo), geometría muy redondeada, micro-interacciones con resorte. Modo oscuro incluido vía `[data-mode="dark"]`.

Fuente del logo: `assets/flow-logo.png` (proporcionado por el usuario). No existen más assets de marca; no se han inventado.

---

## CONTENT FUNDAMENTALS

- **Idioma**: español neutro para producto; términos técnicos de API en inglés. Docs bilingües.
- **Tono**: directo, humano, en movimiento. Frases cortas. Verbos de acción primero: "Iniciar viaje", "Asignar unidad", "Conectarme".
- **Trato**: tuteo ("tu flota", "tus ganancias"). Nunca "usted", nunca pasiva corporativa.
- **Casing**: Sentence case en todo — títulos, botones, labels ("Ver flota", no "Ver Flota"). MAYÚSCULAS solo en overlines de datos (`ACTIVAS`, `EN TALLER`).
- **Números**: protagonistas y en mono (JetBrains Mono): placas, IDs, KPIs, tarifas. "+1.8× tarifa", "Llega en 6 min".
- **Emoji**: no se usan en UI. La expresividad viene del color y el movimiento.
- **Errores**: qué pasó + qué hacer, sin culpa: "No pudimos asignar la unidad. Reintenta o elige otra."
- **Ejemplos canónicos**: "Todo tu día, en movimiento." · "La ciudad es tu turno." · "Unidad 214 · en ruta" · "Demanda alta cerca de ti".
- El separador " · " (middot con espacios) encadena metadatos.

## VISUAL FOUNDATIONS

- **Color**: lienzo arena cálido `--surface-canvas #FAF9F7`, tarjetas blancas, tinta `#17171A`. El rojo `#FF3617` es *quirúrgico*: CTAs de acento, estado vivo (pulso), foco, links. Nunca de decoración. Semánticos: verde `#12B76A`, ámbar `#E8930C`, azul info, danger `#D92D20` (distinto del rojo marca). Modo oscuro: `#131315` + superficies `#1C1C1F`, rojo sube a `#FF6A52` en texto para contraste.
- **Tipografía**: **Sora** (geométrica) para todo display y body; **JetBrains Mono** para datos (placas, KPIs, IDs). Tracking -0.02em en display. Escala en `tokens/typography.css` (shorthands `--type-*` listos para `font:`).
- **Espaciado**: base 4px, aireado; padding de tarjeta 24, secciones 32. Hit targets ≥44px siempre.
- **Forma**: muy redondeado. Pills (999) para botones/chips/badges; 16 inputs; 20 tarjetas; 28 modales y shells. Bordes 1px sutiles; nunca esquinas rectas.
- **Elevación**: sombras suaves y cálidas, 4 niveles (`rest → raised → float → overlay`). Nada de bordes duros ni sombras negras densas. Glow rojo solo en CTAs de acento hover.
- **Fondos**: planos, sin gradientes ni texturas. La jerarquía la dan superficie (blanco sobre arena) y sombra. Sin imágenes de fondo.
- **Motion** (nivel 10, pero con reglas): resorte `cubic-bezier(.34,1.56,.64,1)` para lo que tocas (hover lift -3px, press scale .96, hover scale 1.04); `ease-out` para lo que aparece; 100–400ms. El punto rojo de "en vivo" pulsa (1.6s). `prefers-reduced-motion` anula todo (tokens en `motion.css`).
- **Hover**: elevación + lift, o oscurecer una parada la superficie. **Press**: encoger a .96. **Foco**: anillo rojo 3px translúcido (`--focus-ring`), siempre visible con teclado.
- **Transparencia/blur**: solo scrims de overlay (`rgba(23,23,26,.4)` + blur 4px en modales). No glassmorphism en superficies.
- **Tarjetas**: blanco, radio 20, borde `--border-subtle`, sombra `rest`; al hover interactivo → lift + `float`.
- **Layout**: sidebar fija en dashboard (web), tab bar inferior en móvil. Contenido máx 1200px en tools.
- **Contraste**: todo texto ≥4.5:1 sobre su superficie; el rojo marca sobre blanco solo en ≥18px bold o con `--text-accent` (#E62D10).

## ICONOGRAFÍA

- **Sistema**: [Material Symbols Rounded](https://fonts.google.com/icons) vía Google Fonts (variable: FILL, wght, GRAD, opsz). Cargado desde `tokens/fonts.css`; clase helper `.flow-icon` (outline) y `.flow-icon--fill` (relleno = estado activo/seleccionado).
- **Uso**: outline por defecto; fill para el ítem activo de navegación y estados seleccionados. Peso 400, opsz 24. Tamaños: 18 (inline), 20 (controles), 24 (nav), 32+ (empty states).
- **Nunca**: SVGs dibujados a mano, emoji como iconos, mezclar familias.
- **Logo**: `assets/flow-logo.png` (negro sobre claro; `filter: invert(1)` sobre oscuro). No hay variante isotipo — usar wordmark completo o el nombre en Sora 800.

## ÍNDICE

- `styles.css` — entry point; importa todo `tokens/`.
- `tokens/` — colors (light+dark), typography, spacing, shape, elevation, motion, fonts.
- `platforms/` — `flow.tokens.json` (W3C, para agentes), `angular/_flow-tokens.scss`, `flutter/flow_tokens.dart` (+ READMEs de adopción).
- `components/` — primitives React: `actions/` (Button, IconButton, Menu), `forms/` (Field, Input, Textarea, Select, Checkbox, Radio, Switch, Slider, DatePicker, FileUpload), `display/` (Card, Badge, Chip, Avatar, Table, Skeleton, EmptyState, Accordion, Sparkline, Bars, Divider, Timeline), `navigation/` (Tabs, Stepper, Breadcrumb, Pagination, TabBar, OnboardingCarousel), `feedback/` (Dialog, Toast, Tooltip, Progress, CircularProgress, Spinner, Drawer, StatusView). Cada uno con `.d.ts` (contrato) y `.prompt.md` (uso). `_ds_bundle.js` en la raíz es el bundle generado (window.Flow) que consumen demos y templates.
- `guidelines/` — specimen cards de foundations.
- `ui_kits/` — templates/patterns:
  - Desktop: `fleet-dashboard/` (4 módulos), `dashboards/` (6: overview, combustible, mantenimiento, electro, peaje, finanzas — con Treemap/Pareto/Scatter/SmallMultiples/Bullet y FlowChart para flotas grandes), `config/` (roles y permisos + altas/bajas), `auth/`, `auth-otp/` (login + OTP + biométricos), `onboarding-fm/`, `agent-chat/` (asistente conversacional), `settings/`, `wizard/`.
  - Mobile (marco iPhone via `ui_kits/ios-frame.jsx`): `drivers-app/`, `onboarding-driver/` (2 journeys), `wallet/` (tarjetas + movimientos + detalle con quick actions), `rutas/` (mapa OSM de estaciones).
  - Internal Tools (CRM, shell propia): `internal-tools/` — Resumen (KPIs + colas por rol), Tickets (cola + hilo), Cuentas (flotas/conductores, tabs con Timeline de actividad), Pricing (reglas + envío a aprobación), Casos (fraude/disputas, investigación con Timeline y resolución), Back-office (aprobación de documentos), Growth · Onboarding (kanban del embudo de activación de conductores, de registro a primer viaje, con riesgo de abandono). Roles (`Admin`, `Agente de soporte`, `Pricing/Finanzas`, `Ops/Back-office`, `Growth/Producto`) filtran nav y gatean módulos con `EmptyState`.
  - Email: `mailings/` — HTML de tablas (no DC) para recibo, resumen semanal, alerta OTP, invitación y bienvenida. Ver su README para restricciones.
- `assets/` — logo.
- `docs/` — sitio de documentación navegable (tabs por audiencia: Diseño/Código/Contenido/Uso).
- `SKILL.md` — punto de entrada para agentes (Claude Code y similares).

### Intentional additions
Sistema creado desde cero (sin inventario fuente); el set de componentes responde al alcance acordado con el usuario (~20+, set amplio).

Agregados tras revisión de cobertura: `TabBar` (nav inferior móvil — antes hardcodeada en `drivers-app`), `Divider`, `CircularProgress`, `Timeline` (historial vertical de un registro), `OnboardingCarousel` (bienvenida con ilustración, dots y swipe — usa un círculo geométrico de marca como ilustración por defecto, sin arte final) y `StatusView` (pantalla completa de éxito/error/pendiente/cargando/sin conexión para flujos que dependen de un servicio externo — API, base de datos, pagos, biométricos).

Tras una auditoría del alcance original (3 productos prometidos) se detectó que Internal Tools no existía como kit propio. Se construyó `ui_kits/internal-tools/` como CRM interno (ver ÍNDICE) para cerrar ese gap.
