# Advanced Filters

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:pattern-contracts` after changing pattern copy.

Source content:

- `packages/content/content/pattern-copy/patterns/advanced-filters/all.json`

## Purpose

Compose dashboard, audit, and table filters with saved views, active chips, reset behavior, validation, and responsive overflow.

## Use When

- Users need more than one filter dimension for dashboards or data tables.
- Active filters need to remain visible and removable.
- Filters affect charts, tables, exports, or saved views.

## Do Not Use Without Review

- A single field or Select is enough.
- Filter source, default values, or reset behavior is unclear.
- Filters change regulated reports without review or audit.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines filter bar density, chip wrapping, drawer fallback, and panel spacing. |
| Voice | Owns filter labels, empty copy, reset copy, saved-view names, and validation. |
| Energy | Controls active filter emphasis, disabled state, and validation tone. |
| State | Default, dirty, applied, loading, disabled, empty, invalid, and saved states are explicit. |
| Depth | Overflow panels and mobile drawers use Design System overlay depth. |
| Accessibility | Filter labels, active count, removal, reset, and validation are keyboard accessible. |

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| controls | Select \| DatePicker \| Input | yes | Filter inputs for entity, status, date, or keyword. |
| activeFilters | Chip[] \| Badge | yes | Visible active filters with count and removal. |
| actions | Button[] | yes | Apply, reset, save view, or export actions. |
| overflow | Menu \| Drawer | conditional | Controls that do not fit in the primary bar. |
| feedback | InlineValidation \| Toast | conditional | Invalid range, saved view, or applied state feedback. |

## Components And Primitives Used

- Select
- Date Picker
- Input
- Chip
- Badge
- Button
- Menu
- Drawer
- Inline Validation
- Toast

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Dashboard filter bar | Required | Dense controls plus active filter chips. |
| Saved view | Candidate | Save/apply named filter sets after explicit action. |
| Mobile drawer | Required state | Overflow filters move to Drawer on constrained viewports. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Apply filters | Results update after explicit action or declared immediate behavior. |
| Chip removal | Removal updates count without shifting the whole toolbar. |
| Overflow reveal | Menu/Drawer uses Design System overlay motion and reduced-motion fallback. |

## Accessibility

- Every filter has a programmatic label.
- Active filter count is text-backed.
- Remove/reset controls are keyboard reachable.
- Invalid filter combinations are explained in text.

## Implementation Checklist

- Declare `controls`: Filter inputs for entity, status, date, or keyword.
- Declare `activeFilters`: Visible active filters with count and removal.
- Declare `actions`: Apply, reset, save view, or export actions.
- Apply updates active chips and count.
- Reset clears controls and chips.
- Invalid range shows Inline Validation.
- Small viewport keeps filters reachable through overflow or drawer.

## Tests And Rejection Rules

Must test:

- Apply updates active chips and count.
- Reset clears controls and chips.
- Invalid range shows Inline Validation.
- Small viewport keeps filters reachable through overflow or drawer.

Reject if:

- Active filters are invisible.
- Reset behavior is missing.
- Controls are hardcoded instead of Design System inputs.

## MIEL

Agents can decide:

- Use Advanced Filters when multiple dimensions affect dashboard or table data.
- Use active chips to show applied state.
- Move overflow into Menu or Drawer based on viewport.

Agents must ask:

- Default filters, saved-view ownership, analytics, export behavior, or audit policy is unclear.
- Filters affect financial, compliance, or regulated reporting.

Agents must reject:

- Active filters are invisible.
- Reset behavior is missing.
- Controls are hardcoded instead of Design System inputs.

Handoff language:

> Confirm filter dimensions, defaults, apply mode, saved views, reset rules, export impact, and responsive overflow.
