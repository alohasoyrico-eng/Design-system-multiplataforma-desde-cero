# Radius

Generated portable primitive contract for Design System.

The JSON spec and primitive copy remain the editable source of truth. Regenerate this file with `npm run build:primitive-contracts` after changing primitive copy or spec.

Source content:

- `packages/specs/specs/unison-system/artifacts/primitives/radius.json`
- `packages/content/content/primitive-copy.json`

## Purpose

Turn Frame shape roles into implementation-ready primitives for controls, cards, sheets, pills, map pins, table rows, and permission panels.

Radius sits between foundations and components.
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

Governing foundations: `Frame`, `Depth`, `State`

Foundation inputs: `sys.frame.*`, `sys.depth.*`, `sys.state.*`

Coordinates primitives: `None declared`

Token dependencies: `ref.frame.radius.*`, `sys.frame.radius.*`, `radius.*`

## Roles

| Role | Token | Use |
| --- | --- | --- |
| control | radius.control | Buttons, fields, selects, chips, compact actions. |
| container | radius.container | Cards, panels, popovers, dashboard modules. |
| surface | radius.surface | Sheets, dialogs, large product surfaces. |
| pill | radius.full | Badges, filter chips, status tags. |

## Product Examples

- Mobile quick actions: Control radius stays stable across enabled, pressed, and disabled states.
- Station detail sheet: Sheet radius communicates layered surface while map remains behind it.
- Dashboard filters: Filter chips use pill radius, not generic card radius.

## API

Props: `role`, `density`, `surface`, `state`

Outputs: `cssCustomProperties`, `shapeRole`, `focusSafeOutline`

## States

- default
- focus
- selected
- disabled

## Responsibilities

- Render Radius through semantic foundation roles.
- Expose a small API that maps to foundations and token aliases.
- Work across density, responsive, keyboard, touch, screen reader, contrast, and reduced-motion requirements when relevant.
- Prevent raw visual values or duplicated implementation decisions.

## Token Dependencies

- ref.frame.radius.*
- sys.frame.radius.*
- radius.*

## Agent Instructions

- Choose radius by surface role, not visual taste.
- Do not invent one-off curves for a component.
- Keep focus ring and hit target compatible with shape.

## Reject If

- Raw border-radius appears outside tokens.
- Shape suggests interactivity when the element is static.
- Pill shape is used for large content panels.

## Prevents

Hardcoded radius values and one-off implementation behavior.

## Demo Evidence

Type: `radius`

Initial: `control`

Choices:

- control: control
- card: card
- sheet: sheet
- pill: pill
