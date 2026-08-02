# Toolbar

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:pattern-contracts` after changing pattern copy.

Source content:

- `packages/content/content/pattern-copy/patterns/toolbar/all.json`

## Purpose

Group page or table actions with search, filters, export, overflow, selection count, and responsive priority.

## Use When

- A dense operational page needs repeated actions near the content they affect.
- Search, filters, export, or overflow actions need shared context.
- Action priority must remain clear across desktop and compact widths.

## Do Not Use Without Review

- Actions belong to different scopes or owners.
- The toolbar duplicates global navigation or topbar actions.
- Overflow hides destructive or required actions without policy.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines toolbar density, alignment, wrapping, and responsive overflow. |
| Voice | Owns action labels, count copy, overflow labels, and empty action copy. |
| Energy | Controls primary, secondary, disabled, selected, and danger action hierarchy. |
| State | Default, filtered, selected, loading, disabled, and overflow states are explicit. |
| Accessibility | Requires labelled controls, keyboard order, and non-color-only status. |

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| search | Input | conditional | Scopes content search. |
| actions | Button[] | yes | Visible primary and secondary commands. |
| overflow | Menu | conditional | Less frequent actions. |
| status | Badge \| Chip | conditional | Selection or filter count. |
| feedback | Toast | conditional | Reports action result. |

## Components And Primitives Used

- Input
- Button
- Menu
- Badge
- Chip
- Toast

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Table toolbar | Current candidate | Search plus export and overflow actions. |
| Filtered state | Required state | Active filter count remains visible. |
| Compact overflow | Candidate | Secondary commands move to menu. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Action feedback | Commands report state without moving the toolbar. |
| Overflow reveal | Menu opens after user action and closes with selection or Escape. |

## Accessibility

- Toolbar controls have labels.
- Selection or filter count is text-backed.
- Overflow commands remain keyboard reachable.
- Disabled actions explain unavailable state when needed.

## Implementation Checklist

- Declare `actions`: Visible primary and secondary commands.
- Search field keeps focus while filtering.
- Export action shows feedback.
- Overflow menu is present for secondary actions.
- Filter count updates visibly and programmatically.

## Tests And Rejection Rules

Must test:

- Search field keeps focus while filtering.
- Export action shows feedback.
- Overflow menu is present for secondary actions.
- Filter count updates visibly and programmatically.

Reject if:

- Actions belong to different scopes.
- Required actions are hidden in overflow.
- Count state is visual only.

## MIEL

Agents can decide:

- Use Toolbar for page-local or table-local actions.
- Move lower-priority actions to Menu at compact widths.
- Expose active filters or selected count with Badge or Chip.

Agents must ask:

- Action scope, destructive policy, overflow priority, or disabled reason is unclear.

Agents must reject:

- Actions belong to different scopes.
- Required actions are hidden in overflow.
- Count state is visual only.

Handoff language:

> Confirm action scope, priority, overflow behavior, filter/selection count, and feedback.
