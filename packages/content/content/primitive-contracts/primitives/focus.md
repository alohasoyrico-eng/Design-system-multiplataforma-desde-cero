# Focus

Generated portable primitive contract for Design System.

The JSON spec and primitive copy remain the editable source of truth. Regenerate this file with `npm run build:primitive-contracts` after changing primitive copy or spec.

Source content:

- `packages/specs/specs/unison-system/artifacts/primitives/focus.json`
- `packages/content/content/primitive-copy.json`

## Purpose

Turn Accessibility and State focus rules into implementation-ready focus rings, order, restore, trap, skip, and roving behavior.

Focus sits between foundations and components.
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

Governing foundations: `Accessibility`, `State`, `Frame`

Foundation inputs: `sys.accessibility.*`, `sys.state.*`, `sys.frame.*`

Coordinates primitives: `None declared`

Token dependencies: `sys.a11y.focus.*`, `sys.state.focus.*`, `focus.*`

## Roles

| Role | Token | Use |
| --- | --- | --- |
| visible | focus.visible | Keyboard-visible focus ring. |
| restore | focus.restore | Return focus after dialogs, sheets, menus. |
| trap | focus.trap | Modal and blocking surfaces. |
| roving | focus.roving | Menus, tabs, grids, table-like controls. |
| skip | focus.skip | Skip navigation and map/list fallback. |

## Product Examples

- Dialog: Focus enters dialog, traps, escapes, and restores to trigger.
- Tabs: Roving focus moves tabs without losing selected state.
- Map: Map trap has escape and fallback list.

## API

Props: `mode`, `restoreTo`, `trap`, `roving`, `skipTarget`

Outputs: `focusRing`, `keyboardMap`, `restorePolicy`

## States

- visible
- focused
- trapped
- restored
- skipped

## Responsibilities

- Render Focus through semantic foundation roles.
- Expose a small API that maps to foundations and token aliases.
- Work across density, responsive, keyboard, touch, screen reader, contrast, and reduced-motion requirements when relevant.
- Prevent raw visual values or duplicated implementation decisions.

## Token Dependencies

- sys.a11y.focus.*
- sys.state.focus.*
- focus.*

## Agent Instructions

- Define keyboard map before styling.
- Never suppress focus because hover/selected exists.
- Restore focus after temporary surfaces close.

## Reject If

- Focus invisible.
- Focus trapped without escape.
- Dialog closes without restoring focus.
- Map has no keyboard fallback.

## Prevents

Hardcoded focus values and one-off implementation behavior.

## Demo Evidence

Type: `focus`

Initial: `visible`

Choices:

- visible: visible
- restore: restore
- trap: trap
- skip: skip
