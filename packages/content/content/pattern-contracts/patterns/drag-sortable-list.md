# Drag Sortable List

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:pattern-contracts` after changing pattern copy.

Source content:

- `packages/content/content/pattern-copy/patterns/drag-sortable-list/all.json`

## Purpose

Reorder dashboard modules, route stops, rules, or settings with keyboard alternatives, undo, persistence, and reduced-motion behavior.

## Use When

- Order changes process meaning or presentation.
- Users need drag plus keyboard reorder controls.
- Reordering persists, audits, or affects routes, dashboards, or rules.

## Do Not Use Without Review

- Order is decorative.
- Persistence, constraints, or undo behavior is unclear.
- Drag is the only way to reorder.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines list density, handles, drop targets, and responsive controls. |
| Voice | Owns reorder labels, position copy, undo, and save feedback. |
| Energy | Controls grabbed, target, selected, disabled, and saved states. |
| State | Idle, grabbed, moved, dirty, saved, blocked, disabled, and error states are explicit. |
| Momentum | Movement is meaningful, bounded, and respects reduced motion. |
| Accessibility | Keyboard reorder and position announcements are required. |

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| items | List | yes | Ordered items. |
| handles | Button[] | yes | Move up/down or drag handles. |
| boundary | MotionBoundary | conditional | Reduced-motion and local motion control. |
| feedback | Toast \| Badge | conditional | Saved, dirty, or undo state. |

## Components And Primitives Used

- List
- Button
- Motion Boundary
- Toast
- Badge

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Dashboard modules | Required | Reorder dashboard cards with save/undo. |
| Route stops | Candidate | Order affects navigation and requires review. |
| Keyboard reorder | Required state | Move up/down controls work without drag. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Reorder | Motion follows system timing and is disabled by reduced motion. |
| Dirty state | Saved/dirty status updates instantly. |
| Undo | Undo restores previous order. |

## Accessibility

- Move controls are keyboard reachable.
- Position changes are announced.
- Drag is not the only input method.
- Disabled constraints are explained.

## Implementation Checklist

- Declare `items`: Ordered items.
- Declare `handles`: Move up/down or drag handles.
- Move item up/down.
- Saved order feedback appears.
- Undo restores order.
- Reduced motion removes decorative movement.

## Tests And Rejection Rules

Must test:

- Move item up/down.
- Saved order feedback appears.
- Undo restores order.
- Reduced motion removes decorative movement.

Reject if:

- Drag is the only interaction.
- Order is decorative.
- No save or undo policy exists.

## MIEL

Agents can decide:

- Use Drag Sortable List when order has product meaning.
- Provide keyboard controls.
- Use Motion Boundary for local motion behavior.

Agents must ask:

- Persistence, constraints, audit, undo, or order meaning is unclear.
- Reordering affects routes, finance, compliance, or safety.

Agents must reject:

- Drag is the only interaction.
- Order is decorative.
- No save or undo policy exists.

Handoff language:

> Confirm order meaning, constraints, persistence, keyboard controls, undo, audit, and reduced-motion behavior.
