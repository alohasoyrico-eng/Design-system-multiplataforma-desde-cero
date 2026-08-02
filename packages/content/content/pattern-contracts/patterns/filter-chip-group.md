# Filter Chip Group

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:pattern-contracts` after changing pattern copy.

Source content:

- `packages/content/content/pattern-copy/patterns/filter-chip-group/all.json`

## Purpose

Expose active filters as removable chips with reset, count, overflow, keyboard behavior, and empty recovery.

## Use When

- Users need to review and remove active filters quickly.
- Filters are applied outside the current viewport or from multiple controls.
- A query needs clear count, reset, and empty state feedback.

## Do Not Use Without Review

- There are no active filters to review.
- Removing filters has unclear persistence or side effects.
- The chips become the only way to discover available filters.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines chip wrapping, overflow, reset placement, and compact behavior. |
| Voice | Owns filter labels, count copy, reset label, and empty copy. |
| Energy | Controls selected, removable, disabled, and focus states. |
| State | Empty, active, overflow, dirty, applied, and cleared states are explicit. |
| Accessibility | Requires removable button semantics and count feedback. |

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| chips | Chip[] | yes | Active filter values. |
| count | Badge | conditional | Total active filters. |
| reset | Button | conditional | Clears all filters. |
| emptyState | EmptyState | conditional | Shown when no filters are active. |
| feedback | Toast | conditional | Reports cleared or applied filters. |

## Components And Primitives Used

- Chip
- Badge
- Button
- Empty State
- Toast

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Active filters | Current candidate | Removable chips with count and clear action. |
| Empty filters | Required state | Empty state appears after clearing. |
| Overflow filters | Candidate | Excess filters collapse or wrap with clear count. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Remove chip | Chip disappears without moving keyboard focus unpredictably. |
| Clear all | Empty state replaces chips after user action. |

## Accessibility

- Removable chips include filter names.
- Count is text-backed.
- Clear all is keyboard reachable.
- Empty state is announced when all filters are cleared.

## Implementation Checklist

- Declare `chips`: Active filter values.
- Removing one chip updates count.
- Clear all hides chips and shows Empty State.
- Toast reports reset feedback.
- Keyboard users can remove filters.

## Tests And Rejection Rules

Must test:

- Removing one chip updates count.
- Clear all hides chips and shows Empty State.
- Toast reports reset feedback.
- Keyboard users can remove filters.

Reject if:

- Chips are static labels with no removal behavior.
- Count is color-only.
- Clearing filters has no feedback.

## MIEL

Agents can decide:

- Use Filter Chip Group for active filters already applied.
- Use Badge for active count.
- Show Empty State when all filters are removed.

Agents must ask:

- Filter persistence, query side effects, or reset behavior is unclear.

Agents must reject:

- Chips are static labels with no removal behavior.
- Count is color-only.
- Clearing filters has no feedback.

Handoff language:

> Confirm filter source, removal behavior, reset policy, count copy, and empty state.
