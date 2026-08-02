# Design System / Docs Repo Boundary Audit

## Current Goal

Prepare the Design System and the documentation site for a future split into two GitHub repositories without moving code prematurely.

## Proposed Repositories

### `Design-system-multiplataforma-desde-cero`

Owns the design system package surface:

- `packages/components`
- `packages/tokens`
- `packages/specs`
- component contracts and package tests
- Design System package audits

### `Docs-para-design-system-multiplataforma-desde-cero`

Owns the documentation product:

- `apps/docs`
- docs navigation, chrome, examples, interaction fixtures
- generated docs content bundle
- visual QA and docs runtime audits

## Current Docs To Design System Imports

### Current Public API Boundary

Docs now consumes Package component JavaScript through a package-boundary alias:

- `apps/docs/component-demo.js`
  - imports `#design-system/components`
  - uses `renderComponentDemo`
- `apps/docs/stateful-component-interactions.js`
  - imports `#design-system/components`
  - uses public hydrators

The alias is resolved in two places while the docs app still runs inside the monorepo:

- `package.json`
  - Node audits resolve `#design-system/components` to the Package component package entrypoint.
- `apps/docs/index.html`
  - Browser runtime resolves `#design-system/components` through an import map pointed at `apps/docs/generated/components/index.js`.

The generated JavaScript bridge is built by `scripts/build-docs-assets.mjs` from the Package component package entrypoint. The docs browser runtime no longer points at `../../packages/components`.

### CSS Boundary

Docs CSS now consumes a generated asset bridge:

- `apps/docs/styles.css`
  - imports `./generated/components.css`

The generated asset is built from the Package component CSS source:

- `scripts/build-docs-assets.mjs`
  - source: `packages/components/styles/components.css`
  - dependency: `flow` via `file:../Design-system-multiplataforma-desde-cero`
  - output: `apps/docs/generated/components.css`
  - output: `apps/docs/generated/components/`

Target after repo split:

- package install, CDN asset, or docs build step resolves `@design-system/components/styles.css` into the generated docs asset.

## Main Coupling Still Present

### Build

`scripts/build-docs-content.mjs` reads directly from:

- `#design-system/content/*`
- `#design-system/specs/system`

This is acceptable as a build-time bridge inside the monorepo. The docs runtime now reads only:

- `apps/docs/generated/docs-content.bundle.json`

Runtime fallbacks to `packages/content` or `packages/specs` are not allowed.

The aliases are backed by public package exports in:

- `@design-system/content`
- `@design-system/specs`

### Audit

The audit surface is now split into three runnable groups:

- `npm run audit:system`
  - Design System package/spec/component contract checks.
- `npm run audit:docs`
  - Docs app hygiene, content bundle consumption, generated CSS bridge, route/content ownership.
- `npm run audit:integration`
  - Cross-repo checks such as inventory counts, ZIP parity gates, docs/component alignment, and template composition.
- `npm run audit:repo-boundary`
  - Script ownership guardrail for the future repo split.

`npm run audit` remains as a whole-system runner for the monorepo, but `validate:*` no longer depends on it directly.

### Root Scripts

`npm run validate` is now only an orchestrator:

- `validate:system`
  - `audit:system`, component smoke tests, and Design System split simulation.
- `validate:docs`
  - generated docs content/assets, docs audit, docs runtime audit, split simulation.
- `validate:integration`
  - repo boundary audit, integration audit, demo registry, catalog classification, and interaction coverage.

## Extraction Manifests

The future repo package shapes are versioned as:

- `docs/repo-split/system.package.json`
- `docs/repo-split/docs.package.json`
- `docs/repo-split/system.files.json`
- `docs/repo-split/docs.files.json`
- `docs/repo-split/docs.audit-files.json`
- `docs/repo-split/integration-checks.json`
- `docs/repo-split/extraction-matrix.md`

They are audited but not active in the monorepo. The docs manifest uses package imports that resolve through the `flow` dependency so it does not duplicate Design System sources after extraction.

## Boundary Rules Before Repo Split

1. Docs may consume Design System only through package exports.
   - Status: in progress through `#design-system/*` aliases backed by package exports.
2. Docs must not import component internals such as `components/fields.js`, `registry.js`, or package CSS internals.
   - Status: done for component JS and CSS runtime.
3. Docs demos may render Package components only through public factories, public hydrators, or `renderComponentDemo`.
4. Design System package tests must run without `apps/docs`.
5. Docs runtime tests must run against a declared Design System package version.
6. Integration audits may compare docs content to Design System contracts, but they should be explicitly named as integration checks.

## Public Package Surface

- `@design-system/components`
  - JS entrypoint, contracts, and component CSS are exported.
- `@design-system/tokens`
  - JS token entrypoint and token CSS are exported.
- `@design-system/content`
  - Catalog, component docs/copy, pattern copy, implementation status, foundation/primitive/reference copy, template blueprints, i18n, backlogs, behavior contracts, and prototyping fixtures are exported.
- `@design-system/specs`
  - System spec is exported.

The monorepo uses `#design-system/*` aliases so Node scripts and the docs browser can consume the same public boundary before physical repo separation.

## Next Concrete Work

1. Add an audit that fails when `apps/docs` imports `packages/system-*` internals.
   - Status: done for Package component JavaScript imports.
2. Introduce package-style aliases for docs imports while still in the monorepo.
   - Status: done for Package component JavaScript imports through `#design-system/components`.
3. Split root validation scripts into `validate:system`, `validate:docs`, and `validate:integration`.
   - Status: done.
4. Move CSS consumption to a package-style path once the docs runtime has a bundler or asset bridge.
   - Status: done through generated asset bridge.
5. Only after those pass, plan the GitHub repo split.
6. Move `scripts/build-docs-content.mjs` to consume published content/spec artifacts or package exports when repos are physically separated.

## Split Simulation

- `npm run audit:system-split`
  - creates `/tmp/system-repo-split`
  - copies only Design System packages and Design System governance artifacts
  - runs `validate:system` without `apps/docs`
  - fails if the Design System repo simulation depends on the docs app
- `npm run audit:docs-split`
  - creates `/tmp/docs-repo-split`
  - copies only the docs app, docs build scripts, docs package metadata, and docs audit runner files; Design System sources are consumed from `Design-system-multiplataforma-desde-cero`
  - keeps the browser import map pointed at the generated component bridge
  - runs docs build, docs audit, and docs runtime audit from public aliases
  - fails if docs runtime files still reference `../../packages/`

## Extraction Plan

The concrete migration recipe lives in:

- `docs/repo-split-plan.md`
