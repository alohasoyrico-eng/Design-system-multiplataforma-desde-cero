# Flow Design System

Design system multiplataforma construido desde cero con arquitectura por capas al nivel de
Material Design / Carbon: **foundations → primitives → components → patterns → templates**, con una
cadena de tokens de tres niveles `ref → sys → comp` y **cero valores hardcodeados** (verificado por CI).

Dirección visual **Flow**: lienzo arena cálido, rojo `#FF3617` quirúrgico, geometría muy redondeada,
motion de resorte. Tres temas por `data-theme` — **Canvas** (claro, por defecto), **Asphalt** (oscuro)
y **Brutal** (monocromo, Archivo, esquinas duras) — y tres densidades por `data-density`. Ningún
componente cambia de estructura entre temas: solo cambian los tokens.

## Arquitectura

```
packages/
├── tokens/       L0/L1 · fuente DTCG (ref/sys/comp) + compilador → CSS·JSON·SCSS·Dart·TS
├── primitives/   L2   · Surface, Text, Stack/Inline/Grid, FlowIcon
├── components/   L3   · Button, IconButton, Field, Input, Checkbox, Card, Badge, StatTile, Divider, Tabs, Dialog
├── patterns/     L4   · FlowLoginForm (composición de componentes)
├── templates/    L5   · AuthScreen (página completa)
└── flow/         umbrella @flowds/design-system — re-exporta todo + ./styles
apps/docs/        showcase con selector de tema/densidad (Vite + React)
```

Dependencias en DAG estricto: `tokens → primitives → components → patterns → templates → flow`.

## Cadena de tokens (una sola fuente de verdad)

`packages/tokens/tokens/*.json` (formato W3C DTCG) es el **master**. `build.mjs` genera todo:

- **`ref`** — primitivos; único lugar con valores absolutos (hex, px, ms).
- **`sys`** — semántico, sensible a tema + densidad; referencia solo `ref`.
- **`comp`** — por componente; referencia solo `sys`.

Salidas en `packages/tokens/dist/`: `tokens.css` (los 3 temas + densidad + reduced-motion),
`tokens.json`, `index.js`/`index.d.ts`, `scss/_flow.scss` (Angular), `flutter/flow_tokens.dart`.

Los componentes consumen **solo** `var(--comp-*)` / `var(--sys-*)`; nunca valores crudos. La capa `comp`
se emite bajo cada scope de tema/densidad para que se recalcule al aplicar `[data-theme]`/`[data-density]`
en cualquier subárbol.

```sh
npm install
npm run tokens:build   # genera dist/*
npm run dev            # levanta apps/docs
```

## Uso

```tsx
import { FlowButton, AuthScreen } from "@flowds/design-system";
import "@flowds/design-system/styles";

<div data-theme="asphalt" data-density="compact">
  <FlowButton variant="accent" size="lg">
    Iniciar sesión
  </FlowButton>
</div>;
```

## Reglas duras (verificadas por CI)

- **Cero hardcode**: Stylelint (`color-no-hex`, sin `z-index`/duraciones literales) + `scripts/audit-hardcoded.mjs`
  (sin hex/rgb/px mágicos y sin reach-through de `--ref-*` desde components/patterns/templates).
- **A11y**: ESLint `jsx-a11y`, `ariaLabel` obligatorio en IconButton, focus-ring siempre visible,
  hit targets ≥44px, y tests de **contraste ≥4.5:1** en los 3 temas (vitest) + axe por componente.
- **Copy**: español neutro, tuteo, sentence case; datos en JetBrains Mono; API/props en inglés.

```sh
npm run verify   # tokens:build + lint + lint:css + audit + typecheck + test
```

## Multiplataforma

Los componentes se implementan en React (web); el pipeline de tokens genera además Angular SCSS y
Flutter Dart, y los contratos `packages/components/contracts/*.contract.d.ts` mapean 1:1 a `@Input()`
de Angular y props de widgets Flutter.

## Estado

Primera entrega: **arquitectura completa + rebanada vertical** (pipeline de tokens, foundations,
primitives, un componente por dominio, 1 pattern, 1 template) que prueba el sistema de punta a punta.
El molde escala llenando el inventario restante (resto de componentes, data-viz, fintech, y más
templates) sin cambiar la arquitectura.
