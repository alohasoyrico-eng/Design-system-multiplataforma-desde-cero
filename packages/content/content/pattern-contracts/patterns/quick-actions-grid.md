# Quick Actions Grid

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:pattern-contracts` after changing pattern copy.

Source content:

- `packages/content/content/pattern-copy/patterns/quick-actions-grid/all.json`

## Purpose

Group frequent mobile actions into a scannable grid with labels, permission states, confirmation, and feedback.

## Use When

- A mobile dashboard or object detail needs frequent shortcuts.
- Actions are independent and can be understood by label plus icon.
- Permission or risk states must remain visible.

## Do Not Use Without Review

- The grid duplicates primary navigation.
- Actions need long explanation, search, or form input.
- Disabled or destructive actions lack recovery copy.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines grid columns, tap target size, gap, and responsive wrapping. |
| Voice | Keeps action labels direct and explains unavailable actions. |
| Energy | Controls priority, disabled, danger, focus, and selected states. |
| Iconography | Uses icons only as reinforcement; text remains required. |
| Accessibility | Requires labels, focus order, and non-color-only status. |

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| actions | QuickAction[] | yes | Frequent independent actions. |
| hint | Tooltip | conditional | Short explanation for blocked or ambiguous actions. |
| confirmation | Dialog | conditional | Required for risky actions. |
| status | Badge | conditional | Small state count or availability marker. |
| feedback | Toast | conditional | Reports selected action result. |

## Components And Primitives Used

- Quick Action
- Tooltip
- Dialog
- Toast
- Badge

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Object shortcuts | Current candidate | Common actions for a vehicle or card. |
| Permissioned action | Required state | Disabled or blocked action explains why. |
| Danger action | Candidate | Risky shortcut opens confirmation before side effect. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Activation | Feedback appears after explicit action. |
| Confirmation | Risky action opens Dialog with Design System overlay motion. |
| Hint | Tooltip appears only on user request or focus. |

## Accessibility

- Each quick action has a text label.
- Disabled actions expose the reason.
- Grid order matches visual reading order.
- Confirmation is required for risky side effects.

## Implementation Checklist

- Declare `actions`: Frequent independent actions.
- Actions render through Quick Action components.
- Blocked action exposes Tooltip copy.
- Risky action opens Dialog after click.
- Confirmed action shows Toast.
- Small viewport keeps targets reachable.

## Tests And Rejection Rules

Must test:

- Actions render through Quick Action components.
- Blocked action exposes Tooltip copy.
- Risky action opens Dialog after click.
- Confirmed action shows Toast.
- Small viewport keeps targets reachable.

Reject if:

- The grid becomes navigation.
- Actions are icon-only.
- Disabled state has no explanation.

## MIEL

Agents can decide:

- Use Quick Actions Grid for frequent independent shortcuts.
- Use Tooltip for short blocked-state hints.
- Use Dialog for risky action confirmation.

Agents must ask:

- Action priority, permissions, destructive policy, or grid density is unclear.

Agents must reject:

- The grid becomes navigation.
- Actions are icon-only.
- Disabled state has no explanation.

Handoff language:

> Confirm action list, priority, permission states, destructive rules, grid density, and feedback.
