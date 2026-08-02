# Action Sheet

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:pattern-contracts` after changing pattern copy.

Source content:

- `packages/content/content/pattern-copy/patterns/action-sheet/all.json`

## Purpose

Present contextual mobile actions with hierarchy, destructive treatment, cancel, and recovery without forcing a full page transition.

## Use When

- A mobile task needs a short list of contextual actions.
- Actions need hierarchy, destructive separation, or a cancel path.
- The surface should stay tied to the current object or row.

## Do Not Use Without Review

- The action list is long, searchable, or needs multi-step input.
- Actions are global rather than contextual.
- Destructive or permissioned actions lack confirmation policy.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines sheet edge, safe area, action spacing, and touch density. |
| Voice | Owns action labels, destructive copy, cancel, and object context. |
| Energy | Controls action priority, destructive tone, disabled state, and focus. |
| Depth | Sheet overlays mobile content and keeps origin context visible when possible. |
| Momentum | Uses sheet entrance/exit motion and reduced-motion fallback. |
| Accessibility | Requires labelled sheet, touch targets, Escape/back close, and focus containment. |

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| trigger | Button \| List row | yes | Object-specific entry point. |
| sheet | BottomSheet | yes | Bounded mobile action surface. |
| actions | Button[] \| Menu | yes | Prioritized contextual actions. |
| cancel | Button | yes | Closes without side effect. |
| confirmation | Dialog \| InlineConfirm | conditional | Required for destructive actions. |
| feedback | Toast | conditional | Reports selected action result. |

## Components And Primitives Used

- Button
- Menu
- Toast
- Dialog

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Object actions | Current candidate | Short contextual list with primary and secondary actions. |
| Destructive action | Required state | Separated danger action with confirmation policy. |
| Disabled action | Candidate | Explains unavailable action without hiding it. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Sheet reveal | Opens from bottom after user action; reduced motion removes decorative slide. |
| Action feedback | Selected action closes or reports progress according to policy. |
| Cancel close | Cancel/back closes without side effect. |

## Accessibility

- Sheet has an accessible title.
- Actions use full labels and reachable touch targets.
- Cancel is always available.
- Destructive action is text-backed and not color-only.
- Focus and screen reader context remain in the sheet while open.

## Implementation Checklist

- Declare `trigger`: Object-specific entry point.
- Declare `sheet`: Bounded mobile action surface.
- Declare `actions`: Prioritized contextual actions.
- Declare `cancel`: Closes without side effect.
- Trigger opens sheet after user action.
- Cancel closes with no side effect.
- Primary action reports feedback.
- Destructive action is separated and confirmed when required.
- Mobile viewport keeps actions reachable without overlap.

## Tests And Rejection Rules

Must test:

- Trigger opens sheet after user action.
- Cancel closes with no side effect.
- Primary action reports feedback.
- Destructive action is separated and confirmed when required.
- Mobile viewport keeps actions reachable without overlap.

Reject if:

- The sheet contains a long form or searchable list.
- Cancel path is missing.
- Destructive action is visually hidden or color-only.

## MIEL

Agents can decide:

- Use Action Sheet for short contextual mobile action lists.
- Choose action order when product priority is clear.
- Separate destructive actions when risk exists.

Agents must ask:

- Action ownership, destructive policy, disabled reason, or mobile back behavior is unclear.
- Actions affect money, access, compliance, identity, or irreversible state.

Agents must reject:

- The sheet contains a long form or searchable list.
- Cancel path is missing.
- Destructive action is visually hidden or color-only.

Handoff language:

> Confirm trigger object, action priority, destructive policy, cancel/back behavior, and feedback.
