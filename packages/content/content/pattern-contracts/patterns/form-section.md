# Form Section

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:pattern-contracts` after changing pattern copy.

Source content:

- `packages/content/content/pattern-copy/patterns/form-section/all.json`

## Purpose

Structure related form fields into a titled, validated, saveable group without turning every field group into a full process.

## Use When

- A form needs a clear section boundary with helper copy.
- Fields share validation, disabled state, or save behavior.
- Users need to understand which data belongs together before submitting.

## Do Not Use Without Review

- The section is only decorative spacing.
- The grouped fields do not share purpose or validation.
- The section hides a multi-step process or complex permissions.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines section spacing, field rhythm, action placement, and responsive stacking. |
| Voice | Owns section title, helper copy, validation text, and save labels. |
| Energy | Controls focus, dirty, invalid, disabled, and action states. |
| State | Default, dirty, valid, invalid, disabled, saving, and saved states are explicit. |
| Accessibility | Requires labelled fields, associated validation, keyboard submission, and status feedback. |

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| header | Card \| Text | yes | Names the section and explains purpose. |
| fields | Input \| TextArea[] | yes | Related form controls. |
| validation | InlineValidation | conditional | Explains blocked or invalid state. |
| actions | Button[] | conditional | Save, reset, or secondary actions. |
| feedback | Toast | conditional | Confirms save or draft state. |

## Components And Primitives Used

- Card
- Input
- Text Area
- Inline Validation
- Button
- Toast

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Editable section | Current candidate | Grouped fields with explicit save behavior. |
| Invalid section | Required state | Inline validation appears after user action. |
| Saved section | Candidate | Toast or status confirms persistence. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Validation reveal | Validation appears inline without shifting focus away from the field. |
| Save feedback | Save confirmation is transient and non-blocking. |

## Accessibility

- Every field has a label.
- Validation text is not color-only.
- Save action is reachable by keyboard.
- Saved state is announced as feedback.
- Disabled fields explain why when needed.

## Implementation Checklist

- Declare `header`: Names the section and explains purpose.
- Declare `fields`: Related form controls.
- Empty required field shows Inline Validation after save.
- Editing field marks the section dirty.
- Save reports success when required fields are present.
- Responsive viewport stacks fields without overlap.

## Tests And Rejection Rules

Must test:

- Empty required field shows Inline Validation after save.
- Editing field marks the section dirty.
- Save reports success when required fields are present.
- Responsive viewport stacks fields without overlap.

Reject if:

- The grouping is decorative only.
- Fields are unrelated.
- Validation has no text recovery.

## MIEL

Agents can decide:

- Use Form Section for related fields with shared purpose.
- Use Inline Validation for section-level blocking errors.
- Use Toast for save confirmation.

Agents must ask:

- Required fields, persistence, ownership, or validation timing is unclear.

Agents must reject:

- The grouping is decorative only.
- Fields are unrelated.
- Validation has no text recovery.

Handoff language:

> Confirm section purpose, required fields, validation timing, save behavior, and success feedback.
