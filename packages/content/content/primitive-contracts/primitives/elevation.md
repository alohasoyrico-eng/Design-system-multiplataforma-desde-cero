# Elevation

Generated portable primitive contract for Design System.

The JSON spec and primitive copy remain the editable source of truth. Regenerate this file with `npm run build:primitive-contracts` after changing primitive copy or spec.

Source content:

- `packages/specs/specs/unison-system/artifacts/primitives/elevation.json`
- `packages/content/content/primitive-copy.json`

## Purpose

Turn Depth foundation roles into implementation-ready elevation, overlay, and stacking primitives.

Elevation sits between foundations and components.
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

Governing foundations: `Depth`, `Frame`, `Accessibility`

Foundation inputs: `sys.depth.*`, `sys.frame.*`, `sys.accessibility.*`

Coordinates primitives: `None declared`

Token dependencies: `ref.depth.*`, `sys.depth.*`, `elevation.*`

## Roles

| Role | Token | Use |
| --- | --- | --- |
| level0 | elevation.0 | Canvas and sunken areas. |
| level1 | elevation.1 | Cards and low raised surfaces. |
| level2 | elevation.2 | Floating controls and contextual panels. |
| level3 | elevation.3 | Overlays, sheets, dialogs. |
| level4 | elevation.4 | Critical blocking feedback. |

## Product Examples

- Bottom sheet: Sheet elevation separates station detail from the map.
- Menu: Menu floats above toolbar but below modal confirmation.
- Toast: Toast has high stacking but does not trap focus.

## API

Props: `level`, `overlay`, `zRole`, `modal`

Outputs: `boxShadow`, `zIndex`, `overlayToken`, `focusPolicy`

## States

- rest
- hover
- floating
- overlay
- modal

## Responsibilities

- Render Elevation through semantic foundation roles.
- Expose a small API that maps to foundations and token aliases.
- Work across density, responsive, keyboard, touch, screen reader, contrast, and reduced-motion requirements when relevant.
- Prevent raw visual values or duplicated implementation decisions.

## Token Dependencies

- ref.depth.*
- sys.depth.*
- elevation.*

## Agent Instructions

- Use named levels, never arbitrary shadows.
- Pair overlay with focus and escape behavior.
- Choose stacking order from Depth roles.

## Reject If

- Hardcoded z-index or shadow.
- Modal lacks focus trap or escape.
- Elevation used as decoration only.

## Prevents

Hardcoded elevation values and one-off implementation behavior.

## Demo Evidence

Type: `elevation`

Initial: `1`

Choices:

- 0: Level 0
- 1: Level 1
- 2: Level 2
- 3: Level 3
- 4: Level 4
