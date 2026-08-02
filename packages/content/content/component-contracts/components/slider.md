# Slider

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/slider/all.json`

## Purpose

Use Slider when users adjust a bounded numeric value and need immediate visual feedback.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Breakpoints`, `Focus`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.slider.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.state.*`, `sys.momentum.*`, `sys.accessibility.*`

Gaps or review gates:

- No bounds
- Hidden value
- Raw visual values
- Ask before build: The range affects money, compliance, or permissions.
- Ask before build: Min, max, step, or unit is unknown.
- Ask before build: The value must be exact rather than approximate.

## Use When

- Use Slider for bounded settings and filters.
- Use visible formatted value.
- Use Input alongside Slider when exact entry matters.

## Do Not Use Without Review

- Ask before use when the range affects money, compliance, or permissions.
- Ask before use when min, max, step, or unit is unknown.
- Ask before use when the value must be exact rather than approximate.
- The range has no defined bounds.
- The value is hidden.
- The agent invents business thresholds.
- Value is not visible.
- Range is unbounded.
- Exact financial entry has no text alternative.
- Raw visual values are used.

## Operational Example

Use Slider when users adjust a bounded numeric value and need immediate visual feedback.

### Why Slider

- Slider is efficient for bounded values where exact typing is not the primary need.
- The ZIP reference uses a sunken track, accent fill, white thumb, mono value, and thumb scale/glow on drag.
- Use Input when precise numeric entry is required.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Label | Names the numeric control. | comp.slider.*, sys.voice.* |
| Value | Shows current value in readable numeric format. | sys.voice.*, sys.measurement.* |
| Track | Shows available range. | sys.energy.*, sys.frame.* |
| Fill | Shows selected portion. | sys.energy.*, sys.state.* |
| Thumb | Drag target with focus and active feedback. | sys.accessibility.*, sys.momentum.* |

## Accessibility

State precedence: disabled, dragging, focus, error, complete, default

- Use native range semantics or equivalent aria-valuenow, aria-valuemin, and aria-valuemax.
- Keep value visible outside the thumb.
- Support keyboard increments.
- Do not use Slider for unbounded values.
- Pair with Input when exact entry is required.

## Foundations

Referenced token families:

- `comp.slider.*`
- `sys.accessibility.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.measurement.*`
- `sys.momentum.*`
- `sys.state.*`
- `sys.voice.*`

Slider API exposes value, min, max, step, label, format, disabled, and state while Design System foundations own range semantics, motion, focus, and measurement copy.

## Variants

Slider variants describe numeric behavior: continuous, stepped, bounded, threshold, and paired value.

Approved variants from demos: `continuous`, `stepped`, `bounded`, `threshold`, `paired-value`

Demo labels:

- Continuous
- Stepped
- Bounded
- Threshold
- Paired value

## States

Slider states communicate default, focus, dragging, disabled, error, and completed value.

Supported states from docs: `default`, `focus`, `dragging`, `disabled`, `error`, `complete`

## Variant X State Behavior

Variant defines the range model; state defines interaction and availability.

State matrix: `default`, `focus`, `dragging`, `disabled`, `error`, `complete`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Continuous | continuous |  |
| Stepped | stepped |  |
| Threshold | threshold |  |

## Full Width

Slider may fill its container, but label and value remain visible.

- Mobile filter: layout: stack
- Desktop control: layout: row
- Threshold: layout: row

## Responsive Layout Patterns

Use larger density on touch devices and preserve visible value in every layout.

| Example | Layout | Density |
| --- | --- | --- |
| Phone setting | simple-demo-row | lg |
| Desktop filter | simple-demo-row | sm |

## Viewport Organization

Use Slider in settings, filters, and bounded adjustments. Use Input for precision.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Use comfortable touch target and visible value. | setting row | lg |
| Tablet | Use alongside explanatory copy. | filter panel | md |
| Desktop | Use compact sliders in filters with numeric labels. | toolbar filter | sm |

## Playground

Use the playground to verify label, value, min, max, step, variant, and state.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Search radius |  |
| value | number | 12 |  |
| variant | select | continuous | continuous, stepped, bounded, threshold, paired-value |
| state | select | default | default, focus, dragging, disabled, error, complete |

## API And Foundations

Slider API exposes value, min, max, step, label, format, disabled, and state while Design System foundations own range semantics, motion, focus, and measurement copy.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | Yes | Visible slider label. |
| value | number | No | Current numeric value. |
| min | number | No | Lower bound. |
| max | number | No | Upper bound. |
| step | number | No | Keyboard and drag increment. |
| disabled | boolean | No | Disables the slider. |
| name | string | No | Input name. |
| valueLabel | string | No | Initial display label for the current value. |
| onValueChange | (value: number) => void | No | Called when the local value changes. |
| formatValue | (value: number) => string | No | Formats the visible value. |
| variant | "continuous" \| "stepped" \| "bounded" \| "threshold" \| "paired-value" | No | Range behavior variant. |
| state | "default" \| "focus" \| "dragging" \| "disabled" \| "error" \| "complete" | No | Local interaction or validation state. |
| density | "sm" \| "md" \| "lg" | No | Context density for touch target and spacing. |
| unit | string | No | Suffix appended to numeric value when no formatter is supplied. |

## Implementation Checklist

- Provide `label`: Visible slider label.
- Range semantics
- Keyboard input
- Visible value
- Focus ring
- Disabled state
- Touch target

## Tests And Rejection Rules

Must test:

- Range semantics
- Keyboard input
- Visible value
- Focus ring
- Disabled state
- Touch target

Reject if:

- Value is not visible.
- Range is unbounded.
- Exact financial entry has no text alternative.
- Raw visual values are used.

## MIEL

MIEL treats Slider as bounded adjustment: agents may configure ranges when limits are known, but humans confirm units, risk, and precision needs.

Agents can decide:

- Use Slider for bounded settings and filters.
- Use visible formatted value.
- Use Input alongside Slider when exact entry matters.

Agents must ask:

- The range affects money, compliance, or permissions.
- Min, max, step, or unit is unknown.
- The value must be exact rather than approximate.

Agents must reject:

- The range has no defined bounds.
- The value is hidden.
- The agent invents business thresholds.

Handoff language:

> I am using Slider for bounded adjustment. Please confirm min, max, step, unit, and whether exact input is required.
