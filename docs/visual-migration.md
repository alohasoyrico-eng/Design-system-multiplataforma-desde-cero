# Visual Migration Plan

Design System keeps its foundations and primitives. The external ZIP is a benchmark for visual quality, product specificity, and interaction richness, not a source of raw implementation.

## Rule

Visual parity comes from behavior, hierarchy, composition, state richness, and product context. It does not come from copying raw tokens, fonts, props, inline styles, chart code, or map implementation.

## Translation Model

1. Identify the ZIP behavior or visual quality worth keeping.
2. Map it to Design System foundations.
3. Map it to Design System primitives.
4. Express it through semantic tokens and component contracts.
5. Document the component, then the pattern, then the template.
6. Add or extend audit coverage before treating the migration as stable.

## Keep From Design System

- Foundations remain the decision layer.
- Primitives remain the implementation material.
- Voice owns typography.
- Energy owns color.
- Frame, Radius, Density, and Breakpoints own scale and layout.
- Depth owns surface priority and elevation.
- Momentum owns motion purpose, timing, and reduced-motion behavior.
- Symbol and Iconography own Material Symbols usage.
- Charts owns dashboard visualization behavior and the ECharts strategy.
- Maps owns route, station, permission, fallback, attribution, and production map strategy.

## Adapt From The ZIP

- Richer component inventory.
- Stronger mobility examples.
- Wallet, route, authentication, dashboard, and configuration patterns.
- More polished hover, press, reveal, selected, loading, and empty states.
- More concrete demos and component prompts.
- Product templates that prove the system in realistic flows.

## Reject From The ZIP

- Raw colors, fonts, spacing, radius, or shadows as public API.
- Public `size` props that bypass Density.
- Inline styles as final implementation.
- Browser Babel/CDN demos as production architecture.
- Hand-written chart components replacing Design System's chart primitive and ECharts strategy.
- Direct map tile usage without Design System's Maps primitive rules.

## First Migration Slice

1. Align Button and Select to the benchmark quality while preserving existing Design System contracts.
2. Add Card, Icon Button, Badge, Chip, Field, and Input as the base batch.
3. Build the first pattern batch: Wallet overview, Card detail and quick actions, Movement detail, Nearby stations, and Route guidance.
4. Promote the matching templates only after the patterns have enough states, accessibility, recovery, and telemetry guidance.
