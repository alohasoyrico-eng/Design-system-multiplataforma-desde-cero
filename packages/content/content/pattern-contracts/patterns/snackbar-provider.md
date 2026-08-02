# Snackbar Provider

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:pattern-contracts` after changing pattern copy.

Source content:

- `packages/content/content/pattern-copy/patterns/snackbar-provider/all.json`

## Purpose

Coordinate transient feedback queues, placement, timing, undo, retry, and live-region behavior for non-blocking product events.

## Use When

- Multiple actions or system events can emit toasts/snackbars.
- Feedback needs queueing, placement, deduplication, undo, or retry policy.
- The app shell needs one consistent feedback region.

## Do Not Use Without Review

- A single local Toast is enough.
- The message asks for a required decision.
- Duration, queue behavior, severity, or undo policy is unclear.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines feedback region placement, safe area, stack spacing, and viewport behavior. |
| Voice | Owns concise event copy, undo/retry labels, and severity language. |
| Energy | Controls tone, priority, dismiss, action, and stacked emphasis. |
| State | Queued, visible, actioned, dismissed, retrying, failed, and empty states are explicit. |
| Depth | Feedback floats above content without blocking required actions. |
| Accessibility | Live region role, announcement priority, keyboard actions, and focus behavior are required. |

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| region | SnackbarRegion | yes | Shared feedback area owned by the shell or route. |
| items | Toast[] | yes | Visible queued feedback items. |
| actions | Button[] | conditional | Undo, retry, view, or dismiss actions. |
| policy | QueuePolicy | yes | Duration, dedupe, max visible count, and priority rules. |

## Components And Primitives Used

- Toast
- Button
- Badge

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Status queue | Required | Multiple non-blocking confirmations share one region. |
| Undo | Required state | Undo action is available only when product behavior exists. |
| Retry | Candidate | Recoverable system event exposes retry without blocking the page. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Queue entry | Items appear in the region with reduced-motion fallback. |
| Dismiss | Dismiss removes one item without moving focus unexpectedly. |
| Stack update | Stacking preserves safe-area and primary action access. |

## Accessibility

- Feedback uses the right live-region priority.
- Actions are keyboard reachable.
- Dismiss and undo behavior are real.
- The region does not cover required navigation or primary actions.

## Implementation Checklist

- Declare `region`: Shared feedback area owned by the shell or route.
- Declare `items`: Visible queued feedback items.
- Declare `policy`: Duration, dedupe, max visible count, and priority rules.
- Queue shows newest feedback in region.
- Dismiss removes one item.
- Undo/retry action produces a visible result.
- Stack does not cover primary actions.

## Tests And Rejection Rules

Must test:

- Queue shows newest feedback in region.
- Dismiss removes one item.
- Undo/retry action produces a visible result.
- Stack does not cover primary actions.

Reject if:

- The feedback asks for a blocking decision.
- Actions are fake.
- Queue and live-region behavior are undefined.

## MIEL

Agents can decide:

- Use Snackbar Provider when a route or shell owns multiple transient feedback events.
- Use Toast as the visible item.
- Limit actions to real undo, retry, or view behavior.

Agents must ask:

- Duration, max stack, undo policy, retry behavior, or severity priority is unclear.
- Feedback affects finance, compliance, legal, security, or identity state.

Agents must reject:

- The feedback asks for a blocking decision.
- Actions are fake.
- Queue and live-region behavior are undefined.

Handoff language:

> Confirm placement, queue limits, duration, live-region role, severity priority, undo/retry behavior, and dismiss policy.
