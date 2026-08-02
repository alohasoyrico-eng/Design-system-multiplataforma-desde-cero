# Color

Generated portable primitive contract for Design System.

The JSON spec and primitive copy remain the editable source of truth. Regenerate this file with `npm run build:primitive-contracts` after changing primitive copy or spec.

Source content:

- `packages/specs/specs/unison-system/artifacts/primitives/color.json`
- `packages/content/content/primitive-copy.json`

## Purpose

Turn Energy foundation roles into implementation-ready semantic color primitives for action, status, feedback, surface, border, chart, and map usage.

Color sits between foundations and components.
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

Governing foundations: `Energy`, `State`, `Tone`, `Accessibility`

Foundation inputs: `sys.energy.*`, `sys.state.*`, `sys.tone.*`, `sys.a11y.*`

Coordinates primitives: `None declared`

Token dependencies: `ref.energy.*`, `sys.energy.*`, `color.*`, `comp.*.energy aliases`

## Roles

| Role | Token | Use |
| --- | --- | --- |
| action | color.action | Primary and secondary product actions. |
| status | color.status.* | Success, warning, error, pending, stale, and disabled states. |
| surface | color.surface.* | Page, card, panel, sheet, table, map overlay. |
| border | color.border.* | Controls, separators, selected rows, focus-adjacent structures. |
| text | color.text.* | Primary, secondary, tertiary, inverse, status copy. |
| data | color.data.* | Charts, maps, route lines, threshold bands with accessible alternatives. |

## Product Examples

- Button states: Primary, danger, warning, disabled, and loading states consume Energy through Color.
- Dashboard charts: Threshold and status series use color plus text summary and shape/position.
- Routes map: Pins, selected station, route line, and fallback list map to semantic roles.
- Inline validation: Error color never appears without repair copy and state semantics.

## API

Props: `role`, `tone`, `state`, `surface`, `contrastMode`

Outputs: `cssCustomProperties`, `semanticAliases`, `accessibleTextPairing`

## States

- default
- hover
- pressed
- focus
- selected
- loading
- disabled
- success
- warning
- error

## Responsibilities

- Render Color through semantic foundation roles.
- Expose a small API that maps to foundations and token aliases.
- Work across density, responsive, keyboard, touch, screen reader, contrast, and reduced-motion requirements when relevant.
- Prevent raw visual values or duplicated implementation decisions.

## Token Dependencies

- ref.energy.*
- sys.energy.*
- color.*
- comp.*.energy aliases

## Agent Instructions

- Start from Energy role, then choose Color primitive role.
- Never introduce a one-off tint in component CSS.
- For charts and maps, pair color with accessible labels or non-color encoding.

## Reject If

- A component uses hex directly.
- Color is chosen by taste instead of semantic role.
- Status color appears without state or copy.
- Charts/maps rely only on color.

## Prevents

Raw hex values, decorative color choices, and status color used without meaning.

## Demo Evidence

Type: `swatch`

Initial: `action`

Choices:

- action: Action
- success: Success
- warning: Warning
- danger: Danger
- surface: Surface
