# Spacing

Generated portable primitive contract for Design System.

The JSON spec and primitive copy remain the editable source of truth. Regenerate this file with `npm run build:primitive-contracts` after changing primitive copy or spec.

Source content:

- `packages/specs/specs/unison-system/artifacts/primitives/spacing.json`
- `packages/content/content/primitive-copy.json`

## Purpose

Turn Frame foundation roles into implementation-ready spacing primitives for page, section, panel, component, inline, grid, and density behavior.

Spacing sits between foundations and components.
It consumes semantic tokens and exposes a narrow API.
It prevents hardcoded values, detached semantics, and inconsistent implementation.
It must be portable across React, Flutter, documentation, and agent specs.

## Definition Of Ready

Before building or auditing any artifact against this primitive, confirm:

- Design System foundations govern the primitive.
- The primitive exposes a narrow, reusable API and never a one-off component shortcut.
- Components, patterns, templates, and docs consume the primitive contract instead of redefining visual values locally.
- ZIP reference details may influence equivalence only after the primitive maps them back to system foundations.

Layer: `Primitive`

Platform: `System`

Audiences: `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents`

Required sections: `purpose`, `foundationInputs`, `roles`, `productExamples`, `api`, `tokens`, `states`, `agentInstructions`, `rejectIf`

Governing foundations: `Frame`, `Depth`, `State`, `Accessibility`

Foundation inputs: `ref.frame.space.*`, `sys.frame.*`, `sys.depth.*`, `sys.a11y.*`

Coordinates primitives: `None declared`

Token dependencies: `ref.frame.space.*`, `sys.frame.*`, `spacing.*`, `comp.*.frame aliases`

## Roles

| Role | Token | Use |
| --- | --- | --- |
| inline | spacing.inline.* | Icon/label gaps, compact metadata, table cell internals. |
| component | spacing.component.* | Field stacks, button rows, card internals, menu options. |
| section | spacing.section.* | Major document/product sections and dashboard group rhythm. |
| page | spacing.page.* | Page rhythm and template-level breathing room. |
| grid | spacing.grid.* | Dashboard, settings, tablet, and mobile layout gutters/margins. |
| density | spacing.density.* | Compact/default/comfortable remapping by product context. |

## Product Examples

- Mobile wallet: Card, quick actions, and movements use touch-safe component spacing and page margins.
- Station detail: Map overlay, sheet header, route CTA, and fallback list use predictable section spacing.
- Dashboard: Filters, KPI tiles, chart panels, and tables align to desktop grid and section rhythm.
- Settings table: Dense rows remain scannable without sacrificing focus and touch targets.

## API

Props: `gap`, `padding`, `margin`, `density`, `columns`, `breakpoint`

Outputs: `layoutTokens`, `cssCustomProperties`, `responsiveRules`

## States

- sm
- md
- lg
- mobile
- tablet
- laptop
- desktop

## Responsibilities

- Lays out children with Frame token gaps.
- Supports semantic gaps for component, subsection, section, and page rhythm.
- Responds to density without per-component hacks.
- Prevents arbitrary margins between child elements.

## Token Dependencies

- ref.frame.space.*
- sys.frame.*
- spacing.*
- comp.*.frame aliases

## Agent Instructions

- Choose spacing by relationship and hierarchy, not visual patching.
- Declare density at surface/page level and let components inherit.
- Do not wrap content in containers that reduce useful space without hierarchy reason.
- Check navigation and tabs for unintended horizontal scroll.

## Reject If

- Raw margin, padding, gap, radius, or grid values appear outside tokens.
- A page-level wrapper compresses content without purpose.
- Spacing is fixed for one viewport only.
- Component solves layout locally instead of consuming Frame/Spacing.

## Prevents

Arbitrary margin/padding on child elements and hardcoded flex/grid gaps.

## Demo Evidence

Type: `stack`

Initial: `md`

Choices:

- sm: SM
- md: MD
- lg: LG

Items:

- Item 1
- Item 2
- Item 3
