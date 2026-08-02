# Timeline

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:pattern-contracts` after changing pattern copy.

Source content:

- `packages/content/content/pattern-copy/patterns/timeline/all.json`

## Purpose

Show ordered operational, audit, route, support, or maintenance events with grouping, filtering, status, owner, and next action.

## Use When

- Users need to understand event sequence and accountability.
- Events require grouping by time, actor, entity, or status.
- The sequence supports investigation, audit, recovery, or support handoff.

## Do Not Use Without Review

- Only one event is needed; use Audit Event.
- Ordering, timezone, grouping, or source is unclear.
- The timeline implies audit/legal evidence without a confirmed source.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines event spacing, group labels, sticky context, and responsive density. |
| Voice | Owns event titles, timestamps, actor copy, status, and recovery labels. |
| Energy | Controls status tone, current event, warning, and selected state. |
| State | Loaded, loading, empty, filtered, current, warning, critical, and verified states are explicit. |
| Depth | Details and filters layer above the timeline without hiding sequence. |
| Accessibility | Event order, timestamps, status, and grouping are readable without visual position only. |

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| events | AuditEvent[] \| List | yes | Ordered events with title, description, time, and status. |
| groups | DateGroup[] | conditional | Date or phase grouping when sequence needs structure. |
| filters | Chip[] \| Button[] | conditional | Status/entity filters that preserve sequence context. |
| emptyState | EmptyState | yes | Shown when no events match. |
| actions | Button[] | conditional | View detail, retry, contact support, or export. |

## Components And Primitives Used

- Audit Event
- List
- Chip
- Button
- Empty State
- Badge

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Audit trail | Required | Ordered audit events with actor and status. |
| Route or maintenance | Candidate | Events grouped by route phase or maintenance state. |
| Filtered empty | Required state | Empty State appears when filters remove all events. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Filter update | Event list updates without losing scroll context. |
| Current event | Current marker changes without decorative motion. |
| Detail reveal | Uses Design System overlay behavior when details are needed. |

## Accessibility

- Events are ordered in DOM sequence.
- Timestamps and status are text-backed.
- Filtering preserves focus and announces empty state.
- Current event is not color-only.

## Implementation Checklist

- Declare `events`: Ordered events with title, description, time, and status.
- Declare `emptyState`: Shown when no events match.
- Events render in expected order.
- Filter changes visible event count.
- Empty state appears when no events match.
- Status and timestamp remain visible on narrow viewports.

## Tests And Rejection Rules

Must test:

- Events render in expected order.
- Filter changes visible event count.
- Empty state appears when no events match.
- Status and timestamp remain visible on narrow viewports.

Reject if:

- Only one event is needed.
- Ordering is ambiguous.
- Status is color-only.

## MIEL

Agents can decide:

- Use Timeline when sequence and accountability matter.
- Use Audit Event for each atomic event.
- Use Empty State for filtered results.

Agents must ask:

- Event source, order, timezone, audit status, or legal meaning is unclear.
- The timeline affects compliance, legal, finance, or support evidence.

Agents must reject:

- Only one event is needed.
- Ordering is ambiguous.
- Status is color-only.

Handoff language:

> Confirm event source, order, timezone, grouping, filters, status language, evidence policy, and detail actions.
