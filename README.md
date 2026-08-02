# Design System OS

Design System is a distributed design system platform for fleet, driver mobile, fleet manager desktop, cards, movements, routes, stations, dashboards, authentication, and configuration work.

The docs app is a consumer. Source of truth lives in packages.

## Start

Run the Architecture Gate:

```sh
npm run validate
```

Start the local server:

```sh
npm run serve
```

Open:

- `http://127.0.0.1:53118/apps/docs/index.html`
- `http://127.0.0.1:53118/examples/prototyping/index.html`

## Package Map

| Area | Path |
| --- | --- |
| Docs consumer | `apps/docs` |
| Machine contracts | `packages/specs` |
| Catalog, copy, fixtures, i18n | `packages/content` |
| Architecture Gate | `packages/audit` |
| Prototype tokens | `packages/tokens` |
| Prototype components | `packages/components` |
| Runnable prototypes | `examples/prototyping` |

## Architecture Boundaries

Design System is organized so the documentation site can be replaced without taking the design system with it.

- Canonical rules live in `packages/specs`.
- Canonical copy, catalog data, fixtures, and i18n live in `packages/content`.
- Reusable prototype primitives live in `packages/tokens` and `packages/components`.
- `apps/docs` renders and demonstrates Design System, but does not own system truth.
- `apps/docs/generated/docs-content.bundle.json` is generated distribution content; source shards remain canonical.
- `packages/audit/scripts/audit-system.js` is only the runner; audit rules are split by domain.

The audit blocks new monoliths: docs modules, audit modules, style modules, and source JSON shards must stay below 400 lines.

## Core Commands

```sh
npm run audit
npm test
npm run validate
```

`npm run validate` runs both the Architecture Gate and component smoke tests.

## Current Status

Design System is at `0.3.0-platform-mvp`.

It includes the platform split, manifest, Architecture Gate, starter tokens, starter components, shared prototype fixtures, release checklist, starter kits, and runnable prototype examples.

Starter components currently include Button, Icon Button, Text Field, Select, and Card.

See `START.md` for what to edit and where.

Use `MIGRATE_PRODUCT_SCREEN.md` when turning an existing product screen into Design System artifacts.
