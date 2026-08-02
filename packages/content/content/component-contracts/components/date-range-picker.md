# Date Range Picker

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/date-range-picker/all.json`

## Purpose

Use Date Range Picker to capture one bounded start and end date range with readable value, local presets, and calendar selection. ZIP reference: DateRangePicker plus combo-range header composition.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Breakpoints`, `Focus`, `Disabled`

Component dependencies: `date-picker`

Token dependencies: `comp.date-picker.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.state.*`, `sys.momentum.*`, `sys.accessibility.*`

Reference translation: Adapt - The ZIP includes DateRangePicker as a bounded control. Flow keeps reporting sync, comparison windows, URL persistence, and dashboard refresh outside the component.

Gaps or review gates:

- The component owns reporting filters.
- The range is color-only.
- Calendar selection is pointer-only.
- Presets trigger data refresh directly.
- Ask before build: The range triggers data loading, URL changes, or saved views.
- Ask before build: Comparison windows or fiscal calendars are required.
- Ask before build: Disabled date rules or locale are unclear.

## Use When

- Use Date Range Picker for reporting windows and export ranges.
- Use local presets for rolling windows.
- Keep range selection separate from dashboard refresh.

## Do Not Use Without Review

- Ask before use when the range triggers data loading, URL changes, or saved views.
- Ask before use when comparison windows or fiscal calendars are required.
- Ask before use when disabled date rules or locale are unclear.
- Date Range Picker becomes a dashboard filter pattern.
- The selected range is not text-backed.
- Preset buttons refresh data directly.
- The component owns reporting filters.
- The range is color-only.
- Calendar selection is pointer-only.
- Presets trigger data refresh directly.

## Operational Example

Use Date Range Picker to capture one bounded start and end date range with readable value, local presets, and calendar selection. ZIP reference: DateRangePicker plus combo-range header composition.

### Why Date Range Picker

- The ZIP includes a dedicated DateRangePicker and a combo-range demo. Flow keeps the field as the component and documents combo-range as composition.
- It owns only local start/end selection, presets, selected range display, and calendar state.
- Dashboard filters, comparison windows, URL persistence, and data refresh remain pattern responsibilities.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Label | Names the range purpose in visible text. | sys.voice.* |
| Range field | Shows the selected start and end dates as text. | comp.date-picker.* |
| Preset row | Offers local shortcuts without owning reporting sync. | sys.frame.*, sys.state.* |
| Calendar surface | Shows month navigation and day targets. | sys.frame.*, sys.depth.* |
| Range state | Distinguishes start, in-range, and end dates. | sys.state.*, sys.energy.* |

## Accessibility

State precedence: disabled, error, warning, selected, focus, hover, default

- Associate the label and selected range with the trigger.
- Expose the panel as a dialog with grid day semantics.
- Keep start and end values visible as text.
- Support keyboard opening, day selection, month navigation, and Escape close.
- Do not use the component to own dashboard refresh or URL persistence.

## Foundations

Referenced token families:

- `comp.date-picker.*`
- `sys.depth.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.state.*`
- `sys.voice.*`

Date Range Picker API exposes label, from/to values, presets, density, state, invalid, disabled, and local change events while Flow owns range geometry, focus, depth, and accessibility.

## Variants

Date Range Picker owns the bounded calendar-range field. ZIP combo-range is documented as a composition with another input control, not as a separate component or pattern.

Approved variants from demos: `calendar-range`

Demo labels:

- Calendar range with presets
- Calendar range only
- Open range selection
- Header combo composition

## States

Date Range Picker states communicate focus, selected, warning, error, and disabled behavior for the local range only.

Supported states from docs: `default`, `hover`, `focus`, `selected`, `warning`, `error`, `disabled`

## Variant X State Behavior

Variant defines range capture and preset availability; state defines validation and availability. Reporting behavior remains outside the component.

State matrix: `default`, `hover`, `focus`, `selected`, `warning`, `error`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Default | calendar-range |  |
| Selected | calendar-range | selected |
| Warning | calendar-range | warning |
| Error | calendar-range | error |

## Full Width

Date Range Picker can fill desktop filter panels and form rows while the selected range remains readable.

- Report filter: layout: button-stack
- Audit window: layout: button-stack
- Export range: layout: button-stack

## Responsive Layout Patterns

Use larger density on touch targets and keep reporting behavior in patterns that compose the component.

| Example | Layout | Density |
| --- | --- | --- |
| Phone | button-stack | lg |
| Desktop | button-stack | md |

## Viewport Organization

Date Range Picker stays a range field. Dashboard filters decide how the range changes data, URL state, or saved views.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Use larger day targets and keep start/end text visible. | single range field | lg |
| Tablet | Keep presets close to the range field. | filter panel | md |
| Desktop | Use standard density in dashboard toolbars. | toolbar range field | md |

## Playground

Use the playground to verify from, to, presets, state, and density before composing a dashboard filter pattern.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| from | text | 2026-07-01 |  |
| to | text | 2026-07-15 |  |
| state | select | default | default, focus, selected, warning, error, disabled |
| density | select | md | sm, md, lg |

## API And Foundations

Date Range Picker API exposes label, from/to values, presets, density, state, invalid, disabled, and local change events while Flow owns range geometry, focus, depth, and accessibility.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | Yes | Visible range label. |
| value | { from?: string; to?: string } | No | Selected ISO range value. |
| from | string | No | Start date shortcut when not passing value. |
| to | string | No | End date shortcut when not passing value. |
| placeholder | string | No | Fallback copy when no range is selected. |
| helper | string | No | Helper text below the field. |
| error | string | No | Validation message and error state. |
| density | "sm" \| "md" \| "lg" | No | Maps field and day target rhythm to Density. |
| state | "default" \| "hover" \| "focus" \| "selected" \| "warning" \| "error" \| "disabled" | No | Documents visual and validation state. |
| presets | boolean | No | Shows local quick presets; false keeps the bounded calendar field without shortcut buttons. |
| presetItems | Array<{ label: string; days: number }> | No | Local rolling-day preset options. |
| onValueChange | (range) => void | No | Called when local range changes. |
| disabled | boolean | No | Prevents opening and selection. |
| invalid | boolean | No | Forces invalid visual state when validation is owned externally. |
| onOpenChange | (open) => void | No | Called when the local calendar panel opens or closes. |

## Implementation Checklist

- Provide `label`: Visible range label.
- Label association
- Range text
- Start/end/middle states
- Preset selection
- Keyboard navigation
- Error state

## Tests And Rejection Rules

Must test:

- Label association
- Range text
- Start/end/middle states
- Preset selection
- Keyboard navigation
- Error state

Reject if:

- The component owns reporting filters.
- The range is color-only.
- Calendar selection is pointer-only.
- Presets trigger data refresh directly.

## MIEL

MIEL treats Date Range Picker as one bounded range field. Agents may place it when the product needs start/end dates, but humans confirm reporting sync, comparison rules, and data refresh pattern behavior.

Agents can decide:

- Use Date Range Picker for reporting windows and export ranges.
- Use local presets for rolling windows.
- Keep range selection separate from dashboard refresh.

Agents must ask:

- The range triggers data loading, URL changes, or saved views.
- Comparison windows or fiscal calendars are required.
- Disabled date rules or locale are unclear.

Agents must reject:

- Date Range Picker becomes a dashboard filter pattern.
- The selected range is not text-backed.
- Preset buttons refresh data directly.

Handoff language:

> I am using Date Range Picker for one bounded start/end range. Please confirm locale, preset list, disabled range rules, and the pattern that owns data refresh.
