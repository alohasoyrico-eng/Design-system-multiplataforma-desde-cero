# Date Picker

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/date-picker/all.json`

## Purpose

Use Date Picker to capture one operational date with locale, selected value, unavailable dates, and validation states.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Breakpoints`, `Focus`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.date-picker.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.state.*`, `sys.momentum.*`, `sys.accessibility.*`

Gaps or review gates:

- The field has no visible label.
- The component owns date range behavior.
- Calendar selection is pointer-only.
- Disabled dates are color-only.
- Ask before build: The user needs a range, shortcut, or comparison window.
- Ask before build: Disabled date rules or locale are unclear.
- Ask before build: The date changes financial, safety, or compliance decisions.

## Use When

- Use Date Picker for service, document, invoice, or scheduling dates.
- Use min and max when date availability is known.
- Use warning when the date is outside policy but still visible.

## Do Not Use Without Review

- Ask before use when the user needs a range, shortcut, or comparison window.
- Ask before use when disabled date rules or locale are unclear.
- Ask before use when the date changes financial, safety, or compliance decisions.
- Date Picker owns reporting filters.
- The field has no visible label.
- Unavailable dates are color-only.
- The component owns date range behavior.
- Calendar selection is pointer-only.
- Disabled dates are color-only.

## Operational Example

Use Date Picker to capture one operational date with locale, selected value, unavailable dates, and validation states.

### Why Date Picker

- Date Picker keeps one date field, calendar affordance, and validation state together.
- It supports locale and disabled dates without becoming a reporting filter.
- Use a pattern when users choose ranges, shortcuts, comparisons, or dashboard windows.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Label | Names the date purpose in visible text. | sys.voice.* |
| Date field | Shows the selected value in readable format. | comp.date-picker.* |
| Calendar trigger | Opens date choice without replacing the label. | sys.symbol.* |
| Calendar surface | Shows month and day targets when active. | sys.frame.*, sys.depth.* |
| Selected day | Marks the current value with state and text. | sys.state.* |

## Accessibility

State precedence: disabled, error, warning, selected, focus, hover, default

- Associate the label and selected date with the input.
- Support keyboard navigation when the calendar is open.
- Expose disabled dates and unavailable reasons.
- Keep selected date visible as text.
- Do not use for date ranges or reporting windows.

## Foundations

Referenced token families:

- `comp.date-picker.*`
- `sys.depth.*`
- `sys.frame.*`
- `sys.state.*`
- `sys.symbol.*`
- `sys.voice.*`

Date Picker API exposes label, value, placeholder, min, max, density, state, invalid, disabled, and local change events while Design System owns calendar geometry, focus, locale, and accessibility.

## Variants

Date Picker has one package-owned calendar field variant for one operational date. Ranges, shortcuts, read-only summaries, and reporting windows belong in patterns or sibling components.

Approved variants from demos: `calendar`

Demo labels:

- Calendar
- With min date
- With max date
- Disabled calendar

## States

Date Picker states communicate focus, selected, warning, error, and disabled behavior without becoming Date Range Picker.

Supported states from docs: `default`, `hover`, `focus`, `selected`, `warning`, `error`, `disabled`

## Variant X State Behavior

Date Picker has one calendar field variant; state defines availability and validation while range logic stays in patterns.

State matrix: `default`, `hover`, `focus`, `selected`, `warning`, `error`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Default | calendar |  |
| Selected | calendar | selected |
| Warning | calendar | warning |
| Error | calendar | error |

## Full Width

Date Picker can fill forms and drawers while calendar targets remain usable and selected text remains visible.

- Maintenance form: layout: button-stack
- Driver document: layout: button-stack
- Drawer field: layout: button-stack

## Responsive Layout Patterns

Use large day targets on touch viewports and move ranges, presets, or comparison windows into patterns.

| Example | Layout | Density |
| --- | --- | --- |
| Phone | button-stack | lg |
| Desktop | button-stack | md |

## Viewport Organization

Date Picker stays one field; viewport rules decide target size and calendar placement, not reporting behavior.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Use large field and day targets. | single date field | lg |
| Tablet | Keep selected date and calendar close together. | form panel date | md |
| Desktop | Use standard density in admin forms unless the surrounding layout is dense. | admin form row | md |

## Playground

Use the playground to verify label, selected value, min/max, state, density, and one-date calendar behavior before composing reporting patterns.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Service date |  |
| value | text | 2026-07-18 |  |
| state | select | default | default, focus, selected, warning, error, disabled |
| density | select | md | sm, md, lg |

## API And Foundations

Date Picker API exposes label, value, placeholder, min, max, density, state, invalid, disabled, and local change events while Design System owns calendar geometry, focus, locale, and accessibility.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | Yes | Visible date label. |
| value | string | No | Selected ISO date value. |
| placeholder | string | No | Fallback copy when no date is selected. |
| helper | string | No | Helper text below the field using the shared field rhythm. |
| error | string | No | Validation message; also drives error state when present. |
| min | string | No | Minimum allowed ISO date. |
| max | string | No | Maximum allowed ISO date. |
| density | "sm" \| "md" \| "lg" | No | Maps field and day target rhythm to Design System Density. |
| state | "default" \| "hover" \| "focus" \| "selected" \| "warning" \| "error" \| "disabled" | No | Documents the visual and validation state of the one-date field. |
| invalid | boolean | No | Sets invalid semantics on the trigger for validation errors. |
| disabled | boolean | No | Disables the control. |
| onValueChange | (value: string) => void | No | Called when a date is selected. |
| onOpenChange | (open: boolean) => void | No | Called when the local calendar panel opens or closes. |

## Implementation Checklist

- Provide `label`: Visible date label.
- Label association
- Selected date text
- Keyboard navigation
- Disabled dates
- Error state
- Responsive day target

## Tests And Rejection Rules

Must test:

- Label association
- Selected date text
- Keyboard navigation
- Disabled dates
- Error state
- Responsive day target

Reject if:

- The field has no visible label.
- The component owns date range behavior.
- Calendar selection is pointer-only.
- Disabled dates are color-only.

## MIEL

MIEL treats Date Picker as one date field. Agents may place it when a single date is known, but humans confirm locale, disabled dates, validation copy, and whether the task is actually a range pattern.

Agents can decide:

- Use Date Picker for service, document, invoice, or scheduling dates.
- Use min and max when date availability is known.
- Use warning when the date is outside policy but still visible.

Agents must ask:

- The user needs a range, shortcut, or comparison window.
- Disabled date rules or locale are unclear.
- The date changes financial, safety, or compliance decisions.

Agents must reject:

- Date Picker owns reporting filters.
- The field has no visible label.
- Unavailable dates are color-only.

Handoff language:

> I am using Date Picker for one operational date. Please confirm locale, min or disabled rules, validation copy, selected value format, and whether this should be a range pattern.
