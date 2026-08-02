# Select Option Layer

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:pattern-contracts` after changing pattern copy.

Source content:

- `packages/content/content/pattern-copy/patterns/select-option-layer/all.json`

## Purpose

Coordinate grouped options, unavailable choices, stale data, permission reasons, keyboard movement, and responsive popover-to-sheet behavior for Select-based choice flows.

## Use When

- A Select needs grouped, disabled, permissioned, or explanatory options.
- Changing a choice affects policy, billing, routing, or visibility.
- The option layer needs a responsive fallback beyond a native dropdown.

## Do Not Use Without Review

- A simple Select with a short static list is sufficient.
- Unavailable option reasons are unknown.
- The option layer duplicates a full form or process.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines layer width, option grouping, row density, and mobile sheet fallback. |
| Voice | Owns option labels, group labels, disabled reasons, and helper copy. |
| Energy | Controls selected, highlighted, disabled, and warning states. |
| Depth | Option layer separates from page content without losing field context. |
| State | Closed, open, selected, disabled, loading, stale, and invalid states are explicit. |
| Accessibility | Requires labelled field, keyboard option movement, and disabled reason text. |

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| field | Select | yes | Selected value and trigger. |
| groups | OptionGroup[] | conditional | Groups related choices. |
| option | Option | yes | Label, value, metadata, selected, disabled, and reason. |
| validation | InlineValidation | conditional | Explains required or stale state. |
| fallback | BottomSheet \| Popover | conditional | Responsive layer when native select is insufficient. |

## Components And Primitives Used

- Select
- Card
- Inline Validation
- Button
- Badge

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Grouped options | Current candidate | Choice set with helper copy and selected state. |
| Permissioned option | Required state | Disabled option explains why it is unavailable. |
| Mobile sheet | Candidate | Complex choices move to sheet when viewport is constrained. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Open layer | Layer opens from the field after user action. |
| Option update | Selection updates field and helper state without layout jump. |
| Fallback sheet | Mobile fallback uses system sheet motion and reduced-motion behavior. |

## Accessibility

- Select has a programmatic label.
- Disabled options include text reason.
- Selected value is announced.
- Keyboard users can move through options.
- Mobile fallback has a close path.

## Implementation Checklist

- Declare `field`: Selected value and trigger.
- Declare `option`: Label, value, metadata, selected, disabled, and reason.
- Changing value updates selected state.
- Disabled option reason is visible.
- Invalid state shows Inline Validation.
- Mobile fallback keeps field context.
- Escape or cancel closes without changing value.

## Tests And Rejection Rules

Must test:

- Changing value updates selected state.
- Disabled option reason is visible.
- Invalid state shows Inline Validation.
- Mobile fallback keeps field context.
- Escape or cancel closes without changing value.

Reject if:

- The option list is a disguised form.
- Disabled reasons are missing.
- Selection consequence is unclear.

## MIEL

Agents can decide:

- Use Select Option Layer when a choice needs disabled reasons or grouped context.
- Use Bottom Sheet fallback for complex mobile option sets.

Agents must ask:

- Permission rules, stale option policy, or consequences of changing value are unclear.

Agents must reject:

- The option list is a disguised form.
- Disabled reasons are missing.
- Selection consequence is unclear.

Handoff language:

> Confirm option source, grouping, disabled reasons, mobile fallback, and selection consequence.
