# @design-system/audit

Architecture and quality gates live here.

Run the gate from the workspace root:

```sh
node packages/audit/scripts/audit-system.js
```

The gate blocks the docs site from becoming the source of truth again.

## Module Map

`audit-system.js` is the runner only. Rules are split by domain:

- `audit-context.js`: shared paths, readers, constants, and result state.
- `audit-platform.js`: architecture, packages, release/adoption, and inventory.
- `audit-css.js`: CSS, layout, contrast, and module-size hygiene.
- `audit-spec.js`: machine-readable Design System spec.
- `audit-routes.js`: foundation and primitive route coverage.
- `audit-gold-components.js`: gold component runtime, CSS, pattern, and density guards.
- `audit-gold-copy.js`: gold component copy and fixture contracts.
- `audit-gold-docs.js`: gold component tab and section contracts.
- `audit-motion-contracts.js`: ZIP motion parameters mapped into Design System Momentum and enforced in component CSS.
- `audit-accessibility-contracts.js`: component accessibility semantics and focus contracts.
- `audit-table-contracts.js`: table semantics, sortable header alignment, and column alignment guards.
- `audit-layout-contracts.js`: documentation demo width, full-width behavior, and responsive layout guards.
- `audit-state-contracts.js`: state precedence, state demo coverage, and State foundation token guards.
- `audit-energy-contracts.js`: Energy token roles, contrast pairs, and semantic tone/status guards.
- `audit-voice-contracts.js`: Voice token roles, component typography guards, and semantic role coverage.
- `audit-docs-content.js`: templates, i18n, and docs runtime readiness.
- `audit-content-ownership.js`: content ownership and hardcoded editorial checks.

Audit modules, docs style modules, and source JSON shards must stay below 400 lines.
