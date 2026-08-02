# Inline Validation

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/inline-validation/all.json`

## Purpose

Use Inline Validation for field-level feedback that explains what happened, where it happened, and how to recover without leaving the form or filter context.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Iconography`, `Motion Curves`, `Duration`, `Breakpoints`, `Focus`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.inline-validation.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.state.*`, `sys.tone.*`, `sys.accessibility.*`

Gaps or review gates:

- Detached from field
- Hidden in Toast or Tooltip
- Color-only severity
- Raw visual values
- Duplicate owning field
- Ask before build: The issue belongs to multiple fields, a group, or the whole page.
- Ask before build: Validation timing could interrupt typing or create noisy announcements.
- Ask before build: The recovery copy needs product, policy, or legal approval.

## Use When

- Use Inline Validation for field-specific error, warning, success, or info feedback.
- Set aria-invalid only for error state.
- Keep message visible and tied to the field with aria-describedby; do not duplicate the owning field.

## Do Not Use Without Review

- Ask before use when the issue belongs to multiple fields, a group, or the whole page.
- Ask before use when validation timing could interrupt typing or create noisy announcements.
- Ask before use when the recovery copy needs product, policy, or legal approval.
- Inline Validation replaces Toast, Alert Strip, Dialog, or group validation.
- The message is not attached to a specific field.
- The state is only communicated by color or icon.
- Validation is detached from the field.
- Required recovery is hidden in Toast or Tooltip.
- Error copy blames the user.
- Validation appears without visible message.
- Raw color, spacing, or state values are used.
- Validation renders a second field when an owning field already exists.

## Operational Example

Use Inline Validation for field-level feedback that explains what happened, where it happened, and how to recover without leaving the form or filter context.

### Why Inline Validation

- The message stays attached to the field that needs attention.
- Tone explains severity while the copy gives recovery.
- The field, message, and machine-readable state stay connected for humans and agents.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Field anchor | Owns aria-invalid and aria-describedby connection. | sys.accessibility.*, sys.state.* |
| Message | Explains condition and recovery in concise product language. | sys.voice.*, sys.tone.* |
| Severity icon | Supports scan value without replacing visible text. | sys.symbol.*, sys.iconography.*, sys.energy.* |
| Tone | Maps error, warning, success, and info to semantic treatment. | comp.inline-validation.*, sys.energy.*, sys.tone.* |
| Layout | Keeps message near the field without shifting unrelated controls. | sys.frame.*, sys.growth.* |

## Accessibility

State precedence: disabled, error, warning, success, info, default

- Associate message and field with aria-describedby.
- Use aria-invalid only for error states.
- Keep recovery copy visible; do not rely on color or icon only.
- Do not move focus unless validation blocks submission and the field needs correction.
- Use live=true only when validation appears after user action.

## Foundations

Referenced token families:

- `comp.inline-validation.*`
- `sys.accessibility.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.growth.*`
- `sys.iconography.*`
- `sys.state.*`
- `sys.symbol.*`
- `sys.tone.*`
- `sys.voice.*`

Inline Validation API exposes field label, optional field preview value, message, state, full-width behavior, field rendering, live announcement behavior, and accessibility ids while Design System owns severity language, state mapping, focus, and recovery. Use field=false or omit value when the message attaches to an existing field.

## Variants

Inline Validation variants describe severity and purpose: error recovery, warning guidance, success confirmation, and neutral information.

Approved variants from demos: `Driver email`, `Monthly card limit`, `Vehicle ID`, `Cost center`

Demo labels:

- Driver email
- Monthly card limit
- Vehicle ID
- Cost center

## States

Inline Validation states follow severity. Default has no validation message; info and success support confirmation; warning guides; error requires recovery.

Supported states from docs: `default`, `info`, `success`, `warning`, `error`, `disabled`

## Variant X State Behavior

Variant and state are the same semantic layer for Inline Validation: the field state decides severity, copy, aria-invalid, and whether recovery is required.

State matrix: `default`, `info`, `success`, `warning`, `error`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Info |  | info |
| Warning |  | warning |
| Error |  | error |

## Full Width

Inline Validation follows the field width. In full-width form rows, the field and message span the same column so recovery stays spatially attached.

- Full-width form row: layout: stack
- Inline table filter: layout: stack
- Locked setting: layout: stack

## Responsive Layout Patterns

Responsive validation keeps the message under the field on narrow screens and inside the same form column on wider screens.

| Example | Layout | Density |
| --- | --- | --- |
| Phone form field | button-stack | lg |
| Desktop filter row | simple-demo-row | sm |

## Viewport Organization

Place validation directly under the field across viewports. When the issue belongs to a row, group, or page, escalate to group validation, Alert Strip, or Dialog.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Stack field and validation message in the same column. | field stack | lg |
| Tablet | Keep validation inside the form column and below helper text. | form column | md |
| Desktop | Use compact validation in dense filter bars only when the field stays readable. | dense field | sm |

## Playground

Use the playground to verify field label, value, message, severity, full-width behavior, and accessible association before adding validation to a form.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Driver email |  |
| value | text | ana@ |  |
| message | text | Enter a complete email address. |  |
| state | select | error | default, info, success, warning, error, disabled |
| fullWidth | checkbox | true |  |

## API And Foundations

Inline Validation API exposes field label, optional field preview value, message, state, full-width behavior, field rendering, live announcement behavior, and accessibility ids while Design System owns severity language, state mapping, focus, and recovery. Use field=false or omit value when the message attaches to an existing field.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | Yes | Associated field label. |
| value | string | No | Associated field value. |
| message | string | No | Visible validation or confirmation copy. |
| state | InlineValidationState | No | Field validation state. |
| id | string | No | Stable field id used to wire aria-describedby. |
| fullWidth | boolean | No | Lets the validation field and message fill the owning field column. |
| field | boolean | No | When true, renders a field preview; when false, renders only the attached validation message. |
| live | boolean | No | Announces dynamic validation after user action; errors use alert, non-error states use status. |

## Implementation Checklist

- Provide `label`: Associated field label.
- Field references the message id
- Error state sets aria-invalid
- Warning and success do not set aria-invalid
- Message remains visible on mobile
- Copy explains recovery
- Color is not the only severity signal
- Message-only usage does not render a duplicate field
- live=true maps error to alert and non-error states to status

## Tests And Rejection Rules

Must test:

- Field references the message id
- Error state sets aria-invalid
- Warning and success do not set aria-invalid
- Message remains visible on mobile
- Copy explains recovery
- Color is not the only severity signal
- Message-only usage does not render a duplicate field
- live=true maps error to alert and non-error states to status

Reject if:

- Validation is detached from the field.
- Required recovery is hidden in Toast or Tooltip.
- Error copy blames the user.
- Validation appears without visible message.
- Raw color, spacing, or state values are used.
- Validation renders a second field when an owning field already exists.

## MIEL

MIEL treats Inline Validation as field-level recovery: agents can add it when the issue belongs to a specific input, while humans confirm severity, timing, copy, and whether the issue belongs to a group or page-level pattern.

Agents can decide:

- Use Inline Validation for field-specific error, warning, success, or info feedback.
- Set aria-invalid only for error state.
- Keep message visible and tied to the field with aria-describedby; do not duplicate the owning field.

Agents must ask:

- The issue belongs to multiple fields, a group, or the whole page.
- Validation timing could interrupt typing or create noisy announcements.
- The recovery copy needs product, policy, or legal approval.

Agents must reject:

- Inline Validation replaces Toast, Alert Strip, Dialog, or group validation.
- The message is not attached to a specific field.
- The state is only communicated by color or icon.

Handoff language:

> I am using Inline Validation for field-level feedback. I need confirmation on severity, timing, recovery copy, field association, and whether this issue belongs to a broader pattern.
