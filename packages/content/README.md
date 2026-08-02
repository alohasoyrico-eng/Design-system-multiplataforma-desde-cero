# @design-system/content

Human-facing copy, examples, fixtures, artifact inventory, and template blueprints live here.

Content can explain Design System contracts, but it cannot introduce states, props, variants, foundations, rejection rules, or template behavior that contradicts `packages/specs/specs/unison.system.json`.

- `content/catalog.json`: rendered artifact inventory for foundations, primitives, components, patterns, templates, and stack decisions.
- `content/component-*.json`: gold component documentation structure and copy.
- `content/fixtures/prototyping.json`: reusable prototype data for examples and agents.
- `content/template-blueprints.json`: product template fixtures.
- `content/i18n/ui.json`: localized shell copy.
- `content/component-contracts/`: portable Markdown contracts for agents and other Design System consumers. These files summarize the same component rules exposed in docs; JSON remains the editable source of truth.

Large content files are sharded by domain/entity. The docs app consumes a generated bundle for runtime speed, but the shards remain the editable source of truth.
