# Density

Generated portable primitive contract for Design System.

The JSON spec and primitive copy remain the editable source of truth. Regenerate this file with `npm run build:primitive-contracts` after changing primitive copy or spec.

Source content:

- `packages/specs/specs/unison-system/artifacts/primitives/density.json`
- `packages/content/content/primitive-copy.json`

## Purpose

Declare surface-level scale and coordinate spacing, typography, iconography, focus, loading, disabled, and breakpoint behavior before components render.

Density sits between foundations and components.
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

Governing foundations: `Frame`, `Accessibility`, `Voice`

Foundation inputs: `sys.frame.*`, `sys.accessibility.*`, `sys.voice.*`

Coordinates primitives: `Spacing`, `Typography`, `Iconography`, `Focus`, `Loading`, `Disabled`, `Breakpoints`

Token dependencies: `sys.frame.*`, `sys.voice.*`, `sys.a11y.*`, `density.sm/md/lg`

## Roles

| Role | Token | Use |
| --- | --- | --- |
| sm | density.sm | Dense operations and data tables with efficient rhythm, readable type, clear grouping, and protected targets. |
| md | density.md | Standard product rhythm. |
| lg | density.lg | Touch-heavy mobile, high-focus review, TV-like dashboards, and distance-friendly reading. |

## Product Examples

- Data table: SM density increases information per viewport while preserving readable labels, focus, and target minimums.
- Mobile driver: LG density protects touch targets.
- Dashboard overview: LG density increases spacing, type rhythm, and hierarchy for touch, review, and distance contexts.

## API

Props: `density`, `context`, `viewport`, `surface`

Outputs: `spacingRemap`, `typeRemap`, `iconRemap`, `controlHeightRemap`, `focusRemap`, `loadingRemap`, `disabledRemap`, `breakpointDecision`

## States

- sm
- md
- lg

## Responsibilities

- Declares sm, md, or lg at the page or surface level.
- Coordinates Spacing, Typography, Iconography, Focus, Loading, Disabled, and Breakpoints.
- Gives components their scale defaults before variant, intent, and state are applied.
- Prevents public component size overrides and local compact or comfortable hacks.

## Token Dependencies

- sys.frame.*
- sys.voice.*
- sys.a11y.*
- density.sm/md/lg

## Agent Instructions

- Declare density at page or surface level.
- Do not shrink below touch/accessibility constraints.
- Change rhythm and grouping before sacrificing readability.
- Let components inherit density.
- Do not expose public component size controls when Density owns scale.

## Reject If

- Component invents local density.
- Component exposes public size as an independent scale decision.
- Compact mode breaks focus or touch target.
- SM density reduces type below readable system roles.
- Density changes only spacing but not type, icon, focus, loading, disabled, breakpoint, and control rhythm.

## Prevents

Public component size props, local compact/comfortable flags, and density that changes spacing without type, icon, focus, loading, disabled, and breakpoint behavior.

## Demo Evidence

Type: `stack`

Initial: `md`

Choices:

- sm: SM
- md: MD
- lg: LG

Items:

- Dashboard row
- Mobile action
- Inspector panel
