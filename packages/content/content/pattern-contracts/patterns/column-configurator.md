# Column Configurator

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:pattern-contracts` after changing pattern copy.

Source content:

- `packages/content/content/pattern-copy/patterns/column-configurator/all.json`

## Purpose

Let users show, hide, reorder, and persist table columns without breaking scanability, exports, or saved views.

## Use When

- A dense desktop table has optional columns.
- Users need to adapt a table to role, process, or saved view.
- Column changes affect export, persistence, or dashboard modules.

## Do Not Use Without Review

- The table has only a few fixed columns.
- Required columns, export rules, or saved-view ownership are unclear.
- Reordering would hide compliance, financial, or identity context.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines panel width, checklist density, table preview, and responsive overflow. |
| Voice | Owns column labels, required-column copy, reset copy, and saved-view language. |
| Energy | Controls selected columns, required state, focus, and disabled treatment. |
| State | Default, dirty, applied, required, disabled, loading, and error states are explicit. |
| Depth | Column controls can appear in Menu, Dialog, or Drawer without replacing the Table component. |
| Accessibility | Column toggles, required columns, order, count, reset, and apply are keyboard reachable. |

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| table | Table | yes | Preview or target table using package Table. |
| columns | Checkbox[] | yes | Column visibility controls with required column handling. |
| actions | Button[] | yes | Apply, reset, save view, or cancel. |
| feedback | Badge \| Toast \| InlineValidation | conditional | Dirty count, saved state, or invalid configuration feedback. |
| surface | Menu \| Dialog \| Drawer | conditional | Where the configuration controls live. |

## Components And Primitives Used

- Table
- Checkbox
- Button
- Badge
- Toast
- Inline Validation
- Menu
- Dialog
- Drawer

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Visibility | Required | Users can show/hide optional columns while required columns remain protected. |
| Saved view | Candidate | Applied columns can persist as a named view. |
| Reset | Required state | Default columns can be restored without losing table data. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Column update | Preview updates after user action without changing focus unexpectedly. |
| Dirty state | Count and apply state update instantly. |
| Surface reveal | Menu/Dialog/Drawer uses Design System overlay motion and reduced-motion fallback. |

## Accessibility

- Every column control has a visible or programmatic label.
- Required columns cannot be hidden silently.
- Applied column count is text-backed.
- Keyboard users can apply and reset without losing table context.

## Implementation Checklist

- Declare `table`: Preview or target table using package Table.
- Declare `columns`: Column visibility controls with required column handling.
- Declare `actions`: Apply, reset, save view, or cancel.
- Optional column can be hidden and restored.
- Required column remains available.
- Apply updates table preview and count.
- Reset restores default columns.

## Tests And Rejection Rules

Must test:

- Optional column can be hidden and restored.
- Required column remains available.
- Apply updates table preview and count.
- Reset restores default columns.

Reject if:

- The pattern hides required context.
- The table is not using Design System Table.
- Apply/reset behavior is missing.

## MIEL

Agents can decide:

- Use Column Configurator when a table has optional columns and persistence rules.
- Keep required identity or compliance columns protected.
- Use package Table for the visible table.

Agents must ask:

- Required columns, export behavior, saved-view scope, or persistence policy is unclear.
- Columns expose financial, identity, compliance, or regulated information.

Agents must reject:

- The pattern hides required context.
- The table is not using Design System Table.
- Apply/reset behavior is missing.

Handoff language:

> Confirm required columns, optional columns, default view, persistence, export impact, saved views, and reset behavior.
