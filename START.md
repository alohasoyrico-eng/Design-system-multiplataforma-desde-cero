# Start With Design System

Design System is now split into packages. Start with the package that matches the job.

## Build a Prototype

Use:

- `packages/tokens`
- `packages/components`
- `packages/content/content/fixtures/prototyping.json`
- `examples/prototyping/index.html`
- `examples/prototyping/basic.html`
- `examples/prototyping/fleet-dashboard.html`
- `examples/prototyping/driver-mobile.html`

Run:

```sh
npm run serve
```

Open:

```txt
http://127.0.0.1:53118/examples/prototyping/basic.html
```

Other starter surfaces:

```txt
http://127.0.0.1:53118/examples/prototyping/index.html
http://127.0.0.1:53118/examples/prototyping/fleet-dashboard.html
http://127.0.0.1:53118/examples/prototyping/driver-mobile.html
```

## Read the System

Use:

- `apps/docs`
- `packages/content/content/catalog.json`
- `packages/specs/specs/unison.system.json`

Open:

```txt
http://127.0.0.1:53118/apps/docs/index.html
```

## Change Design System

1. Update the canonical package first.
2. Update the docs app only as a consumer.
3. Run `npm run validate`.
4. Update `CHANGELOG.md` when behavior, package shape, or public usage changes.

For product-screen migrations, use `MIGRATE_PRODUCT_SCREEN.md`.

## What To Edit

| Need | Edit |
| --- | --- |
| Add or change a system rule | `packages/specs/specs/unison.system.json` |
| Add an artifact to navigation | `packages/content/content/catalog.json` |
| Change component documentation copy | `packages/content/content/component-copy.json` |
| Change component tab structure | `packages/content/content/component-docs.json` |
| Change prototype data | `packages/content/content/fixtures/prototyping.json` |
| Change shell labels | `packages/content/content/i18n/ui.json` |
| Change reusable prototype tokens | `packages/tokens` |
| Change reusable prototype UI | `packages/components` |
| Change component public API | `packages/components/src/contracts.js` |
| Change component behavior | `packages/components/src/index.js` and `packages/components/test/smoke.test.mjs` |
| Change the docs rendering | `apps/docs` |
| Change validation rules | the relevant `packages/audit/scripts/audit-*.js` module |
| Add release guidance | `RELEASE.md` and `CHANGELOG.md` |

## Package Map

- `apps/docs`: rendered documentation consumer.
- `packages/specs`: machine-readable system contracts.
- `packages/content`: catalog, copy, fixtures, i18n, and template blueprints.
- `packages/audit`: Architecture Gate and quality checks.
- `packages/tokens`: prototype-ready semantic tokens.
- `packages/components`: prototype-ready Button, Select, and Card.

## Guardrails

- Keep canonical rules and copy out of `apps/docs`.
- Keep docs modules, audit modules, style modules, and source JSON shards below 400 lines.
- Add validation rules to the matching audit module, not to the runner.
- Treat `audit-system.js` as orchestration only.

## Validation

```sh
npm run audit
npm test
npm run validate
```
