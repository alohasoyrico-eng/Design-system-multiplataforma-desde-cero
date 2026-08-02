# Multi Select

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:pattern-contracts` after changing pattern copy.

Source content:

- `packages/content/content/pattern-copy/patterns/multi-select/all.json`

## Purpose

Select multiple fleets, vehicles, regions, tags, permissions, or owners with clear count, removal, bulk behavior, validation, and recovery.

## Use When

- Users need to choose more than one item from a known set.
- Selection count, removable chips, or apply/cancel behavior matters.
- Choices affect filtering, permissions, notifications, or ownership.

## Do Not Use Without Review

- Only one value can be selected.
- The selection set is too large without search or grouping.
- Apply behavior, persistence, or max count is unclear.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines list density, chip wrapping, apply bar, and responsive stacking. |
| Voice | Owns labels, count copy, max selection copy, and empty recovery. |
| Energy | Controls selected, disabled, warning, and focus states. |
| State | Empty, partial, all selected, over limit, disabled, dirty, and applied states are explicit. |
| Momentum | Selection updates are stable and avoid layout jumps. |
| Accessibility | Requires checkbox semantics, count text, keyboard access, and removable selection names. |

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| trigger | Select \| Button | conditional | Opens selection surface when not inline. |
| options | Checkbox[] \| CheckboxGroup | yes | Selectable items with labels and optional descriptions. |
| selectedItems | Chip[] | conditional | Shows removable selected values. |
| apply | Button | conditional | Commits dirty selection when explicit apply is required. |
| validation | InlineValidation | conditional | Explains required, max, or unavailable selection. |

## Components And Primitives Used

- Checkbox
- Chip
- Badge
- Button
- Inline Validation
- Empty State

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Inline filters | Current candidate | Checkbox list with selected chips and apply action. |
| Max selection | Required state | Validation appears when the max count is exceeded. |
| Empty selection | Required state | Empty State or helper copy explains recovery. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Selection update | Count and chips update without moving focus. |
| Apply feedback | Commit reports selected count. |
| Validation reveal | Max selection warning appears inline without overlay. |

## Accessibility

- Every option has checkbox semantics.
- Selected count is text-backed.
- Remove controls include selected item names.
- Validation is associated with the group.
- Keyboard users can select, remove, and apply.

## Implementation Checklist

- Declare `options`: Selectable items with labels and optional descriptions.
- Selecting options updates count and chips.
- Removing a chip unchecks the option.
- Apply reports selected count.
- Max selection shows Inline Validation.
- Clearing all selections shows empty recovery.

## Tests And Rejection Rules

Must test:

- Selecting options updates count and chips.
- Removing a chip unchecks the option.
- Apply reports selected count.
- Max selection shows Inline Validation.
- Clearing all selections shows empty recovery.

Reject if:

- Only one value can be selected.
- Selected items cannot be reviewed or removed.
- Count and validation are missing.

## MIEL

Agents can decide:

- Use Multi Select when users need more than one value.
- Use chips when selected values need review or removal.
- Use explicit apply when selection affects a costly query.

Agents must ask:

- Max count, persistence, permission scope, or apply behavior is unclear.

Agents must reject:

- Only one value can be selected.
- Selected items cannot be reviewed or removed.
- Count and validation are missing.

Handoff language:

> Confirm selection source, max count, apply behavior, persistence, empty state, and validation.
