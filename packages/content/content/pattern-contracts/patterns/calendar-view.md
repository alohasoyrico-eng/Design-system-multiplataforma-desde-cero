# Calendar View

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:pattern-contracts` after changing pattern copy.

Source content:

- `packages/content/content/pattern-copy/patterns/calendar-view/all.json`

## Purpose

Represent scheduled maintenance, renewals, billing, route windows, and operational events with accessible date navigation and recovery states.

## Use When

- Users need to scan events by day, week, or month.
- Events have status, owner, route, renewal, or maintenance context.
- Date navigation affects dashboards, planning, or operational commitments.

## Do Not Use Without Review

- A single date selection is enough.
- Timezone, event source, recurrence, or ownership is unclear.
- Calendar data affects financial, compliance, or legal deadlines without review.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines calendar grid/list density, header controls, and responsive fallback. |
| Voice | Owns date labels, event titles, empty days, and timezone copy. |
| Energy | Controls today, selected, warning, disabled, and event status. |
| State | Today, selected, loaded, loading, empty, filtered, warning, and error states are explicit. |
| Depth | Event detail uses Popover/Drawer without hiding calendar context. |
| Accessibility | Date navigation, event labels, and selected state are text-backed. |

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| dateControl | DatePicker | yes | Selected date or period anchor. |
| events | List \| Card[] | yes | Events for the selected period. |
| detail | Popover \| Tooltip | conditional | Event detail and status. |
| state | EmptyState \| Skeleton | yes | No events or loading states. |
| actions | Button[] | conditional | Create, export, or review schedule. |

## Components And Primitives Used

- Date Picker
- List
- Card
- Popover
- Tooltip
- Empty State
- Skeleton
- Button
- Badge

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Maintenance calendar | Required | Events shown by selected period. |
| Renewal deadlines | Candidate | Warning states for upcoming deadlines. |
| Empty period | Required state | Empty State explains no scheduled events. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Period change | Updates events without page jump. |
| Detail reveal | Popover/Tooltip uses Design System overlay motion. |
| Reduced motion | Removes decorative calendar movement. |

## Accessibility

- Date control has label.
- Events are available as text list.
- Selected/today state is not color-only.
- Event detail is keyboard reachable.

## Implementation Checklist

- Declare `dateControl`: Selected date or period anchor.
- Declare `events`: Events for the selected period.
- Declare `state`: No events or loading states.
- Date change updates events.
- Empty period shows Empty State.
- Event detail opens after user action.
- Narrow viewport keeps date and events readable.

## Tests And Rejection Rules

Must test:

- Date change updates events.
- Empty period shows Empty State.
- Event detail opens after user action.
- Narrow viewport keeps date and events readable.

Reject if:

- Single Date Picker is enough.
- Events are color-only.
- Timezone or ownership is ambiguous.

## MIEL

Agents can decide:

- Use Calendar View for scheduled operational events.
- Use Date Picker for date anchor and List/Card for events.
- Use Empty State for no scheduled items.

Agents must ask:

- Timezone, recurrence, event source, owner, or deadline policy is unclear.
- Calendar affects billing, compliance, legal, maintenance, or route commitments.

Agents must reject:

- Single Date Picker is enough.
- Events are color-only.
- Timezone or ownership is ambiguous.

Handoff language:

> Confirm date range, timezone, event source, ownership, recurrence, status, detail action, and empty/error behavior.
