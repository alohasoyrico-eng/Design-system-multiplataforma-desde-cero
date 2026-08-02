# Unison Design OS Architecture

Unison is now a documentation product for a fleet and driver ecosystem. It covers driver mobile flows, fleet manager desktop flows, cards, movements, routes, nearby stations, dashboards, authentication, roles, permissions, drivers, vehicles, and configuration.

## Product Scope

Included templates:

- Driver Mobile App
- Fleet Manager Desktop
- Driver Card Wallet
- Routes and Stations
- Fleet Dashboard Suite
- Configuration Console

Excluded generic templates:

- CRM
- Mobile Banking
- Healthcare
- Insurance
- Retail
- Travel
- Education
- Government
- Analytics
- Automotive
- TV

## Layer Contract

1. Foundation defines philosophy and decision rules.
2. Primitive turns foundation rules into semantic raw material.
3. Component packages primitives into accessible, testable behavior.
4. Pattern solves a user goal by selecting components and sequencing behavior.
5. Template proves patterns in a complete product domain.
6. Product ships the template with telemetry, governance, and migration history.

Nothing skips a layer. If a dashboard needs a new visualization behavior, the chart primitive and chart component contract come first. If a route system needs new map behavior, the map primitive and map components come first.

## Detail Page Model

Every Foundation, Primitive, Component, Pattern, and Template has its own detail route. Each page includes audience-aware tabs for product designers, developers, PMs, content designers, researchers, and service designers.

Detail tabs are structured by layer:

- Foundations: overview, teams, rules, decision tree, tokens, agent spec.
- Primitives: overview, teams, token model, usage, engineering, agent spec.
- Components: overview, teams, anatomy, states, accessibility, engineering, agent spec.
- Patterns: overview, teams, journey, screens, metrics, research, engineering, agent spec.
- Templates: overview, teams, product context, IA, flows, data and permissions, implementation, agent spec.

## Stack Contract

Libraries are governed primitives, not random dependencies.

- Motion: primary UI microinteraction engine.
- dotLottie: illustrative animation for onboarding, empty states, OTP, biometric, success, and route moments.
- GSAP: optional editorial/documentation motion only.
- Material Symbols: icon raw material governed by the Symbol foundation.
- Apache ECharts: dashboard visualization engine.
- MapLibre GL or Mapbox: station and route map engine.
- Edenred: display and titles.
- Ubuntu: body, captions, subtitles, labels, tables, and code.

## Repository Architecture

Design System is a distributed design system platform. The docs site is a consumer, not the owner of system truth.

- `/system.manifest.json`: platform ownership map and Architecture Gate contract.
- `/apps/docs`: the documentation product.
- `/packages/specs`: canonical machine-readable contracts.
- `/packages/content`: artifact inventory, human-facing copy, examples, fixtures, i18n shell copy, and template blueprints.
- `/packages/audit`: architecture and quality gates.
- `/packages/tokens`: prototype-ready semantic tokens.
- `/packages/components`: prototype-ready Button, Select, and Card.
- `/examples/prototyping`: small runnable examples for consuming Design System without opening the docs app.
- `/docs`: architecture and token strategy.
- `/agents`: role-specific instructions for coding and review agents.
- `/prompts`: reusable prompts for authoring, review, migration, and validation.

## Anti-Monolith Rules

The docs app must not contain canonical specs, artifact inventory, content fixtures, release gates, package contracts, or package ownership rules. It can render and explain Design System, but Design System itself lives in packages.

Blocked root-level ownership:

- `/index.html`
- `/styles.css`
- `/app.js`
- `/specs`
- `/content`
- `/scripts/audit-system.js`

The Architecture Gate runs from the workspace root:

```sh
node packages/audit/scripts/audit-system.js
```

The gate must fail if source-of-truth files move back into the root docs shape or if `system.manifest.json` declares the docs app as the owner of canonical truth.

## Visual Benchmark Migration

Design System may use the external Canvas-style ZIP as a benchmark for visual quality, interaction richness, product specificity, and template coverage. It must not become the source of truth for foundations, primitives, raw tokens, typography, color, component APIs, charts, or maps.

Migration order remains:

1. Foundations.
2. Primitives.
3. Components.
4. Patterns.
5. Templates.
6. Product.

Components copied from the ZIP must be rewritten into Design System contracts. Patterns from the ZIP must be translated into Design System pattern specs before they appear in templates.
