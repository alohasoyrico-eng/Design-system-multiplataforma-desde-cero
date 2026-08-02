# Swipe Actions

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:pattern-contracts` after changing pattern copy.

Source content:

- `packages/content/content/pattern-copy/patterns/swipe-actions/all.json`

## Purpose

Expose secondary row actions on mobile while preserving a visible, accessible alternative for users who cannot or do not swipe.

## Use When

- A list row has a small set of contextual secondary actions.
- The primary row action remains opening or selecting the item.
- Mobile interaction can reveal actions without hiding recovery.

## Do Not Use Without Review

- Actions are primary, destructive, or permissioned without confirmation.
- The row has many actions or requires form input.
- There is no explicit non-gesture alternative.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines row height, action rail width, touch targets, and list density. |
| Voice | Keeps action labels short and consequence-backed. |
| Energy | Controls selected, revealed, danger, disabled, and focus states. |
| Momentum | Uses Design System reveal timing without custom physics in documentation demos. |
| Accessibility | Requires keyboard and button alternatives to any gesture. |

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| row | MovementRow | yes | The object being acted on. |
| reveal | Button | yes | Explicit alternative to the swipe gesture. |
| actions | QuickAction[] | yes | One to three contextual actions. |
| feedback | Toast | conditional | Reports the selected action. |
| confirmation | Dialog | conditional | Required for high-risk actions. |

## Components And Primitives Used

- Movement Row
- Quick Action
- Button
- Toast

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Two actions | Current candidate | Reveal quick actions beside a Movement Row. |
| Destructive action | Required state | Danger action must confirm when risk is high. |
| Explicit controls | Required state | Reveal button exists as the accessible alternative. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Reveal | Action rail appears after user trigger with Design System motion tokens. |
| Selection | Action feedback appears after explicit action. |
| Reset | Actions can be hidden again without side effect. |

## Accessibility

- Every gesture has a visible control alternative.
- Quick actions include text labels.
- Focus stays in the row region while actions are revealed.
- Destructive action is not color-only.

## Implementation Checklist

- Declare `row`: The object being acted on.
- Declare `reveal`: Explicit alternative to the swipe gesture.
- Declare `actions`: One to three contextual actions.
- Actions are hidden by default.
- Reveal button exposes actions.
- Hide button resets the row.
- Quick action shows feedback.
- Keyboard can reach reveal and actions.

## Tests And Rejection Rules

Must test:

- Actions are hidden by default.
- Reveal button exposes actions.
- Hide button resets the row.
- Quick action shows feedback.
- Keyboard can reach reveal and actions.

Reject if:

- Actions are hidden behind gesture only.
- The pattern becomes a row menu or form.
- Primary navigation is only reachable through swipe.

## MIEL

Agents can decide:

- Use Swipe Actions for secondary row actions on mobile.
- Provide explicit reveal controls in documentation and keyboard flows.
- Limit actions to the row context.

Agents must ask:

- Action priority, destructive confirmation, or non-gesture fallback is unclear.

Agents must reject:

- Actions are hidden behind gesture only.
- The pattern becomes a row menu or form.
- Primary navigation is only reachable through swipe.

Handoff language:

> Confirm row type, action count, explicit fallback, destructive policy, and reset behavior.
