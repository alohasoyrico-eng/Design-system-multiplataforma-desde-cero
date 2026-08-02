# Progress Indicator

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/progress-indicator/all.json`

## Purpose

Use Progress Indicator when the system is working and users need to understand wait, advancement, sync, upload, import, or setup completion without losing task context.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Iconography`, `Motion Curves`, `Duration`, `Breakpoints`, `Focus`, `Disabled`, `Loading`

Component dependencies: `None declared`

Token dependencies: `comp.progress-indicator.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.state.*`, `sys.momentum.*`, `sys.accessibility.*`

Gaps or review gates:

- Label missing
- Fake percentage
- Color-only state
- Raw visual values
- Component becomes navigation
- Progress Indicator is used for compact circular waiting instead of Spinner
- Ask before build: Progress changes navigation, setup sequence, or completion criteria.
- Ask before build: The system cannot explain what is happening in plain language.
- Ask before build: Failure, retry, cancellation, or undo behavior is required.

## Use When

- Use linear progress for row, card, upload, import, or section-level work.
- Use indeterminate linear progress when value is unknown and hide fake percentages.
- Use full-width progress when the owning row or section needs edge-to-edge status.

## Do Not Use Without Review

- Ask before use when progress changes navigation, setup sequence, or completion criteria.
- Ask before use when the system cannot explain what is happening in plain language.
- Ask before use when failure, retry, cancellation, or undo behavior is required.
- Progress replaces recovery, completion, or error messaging.
- A percentage is invented for unknown work.
- The indicator has no visible label or accessible range.
- Progress appears without a visible operation label.
- Unknown work shows a fake percentage.
- Progress is the only error or completion message.
- Raw color, spacing, or motion values are used.
- The component becomes step navigation instead of status.

## Operational Example

Use Progress Indicator when the system is working and users need to understand wait, advancement, sync, upload, import, or setup completion without losing task context.

### Why Progress Indicator

- It makes system work visible without turning progress into a blocking message.
- Determinate progress exposes completion; indeterminate progress communicates activity when value is unknown.
- The label, value, and busy state remain readable for humans and agents.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Label | Names the operation in product language. | sys.voice.*, sys.tone.* |
| Track | Shows the available progress range. | comp.progress-indicator.*, sys.energy.*, sys.frame.* |
| Fill | Shows completed progress or active indeterminate movement. | comp.progress-indicator.*, sys.energy.*, sys.momentum.* |
| Value | Exposes percentage or hidden machine-readable value when known. | sys.accessibility.*, sys.state.* |
| Status | Connects active, paused, complete, error, disabled, and indeterminate states. | sys.state.*, sys.growth.* |

## Accessibility

State precedence: disabled, error, paused, complete, active, indeterminate, default

- Use role progressbar when progress has a range.
- Expose aria-valuenow, aria-valuemin, and aria-valuemax for determinate progress.
- Do not expose fake values for indeterminate progress.
- Keep a visible label near the indicator.
- Use reduced motion for indeterminate movement.

## Foundations

Referenced token families:

- `comp.progress-indicator.*`
- `sys.accessibility.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.growth.*`
- `sys.momentum.*`
- `sys.state.*`
- `sys.tone.*`
- `sys.voice.*`

Progress Indicator API exposes label, variant, value, max, state, tone, and full-width behavior while Design System owns geometry, state semantics, motion, reduced-motion behavior, and accessible range.

## Variants

Progress Indicator variants are linear determinate progress and linear indeterminate progress. Circular loading belongs to Spinner, and ordered setup progress belongs to Stepper or a system pattern.

Approved variants from demos: `linear`, `indeterminate`

Demo labels:

- Card import
- Verification complete
- Waiting for network
- Syncing rules

## States

Progress states describe whether work is active, unknown, paused, complete, failed, or disabled while preserving the label and accessible range.

Supported states from docs: `default`, `active`, `indeterminate`, `paused`, `complete`, `error`, `disabled`

## Variant X State Behavior

Variant sets whether the bar has a known value or unknown duration; state sets semantic feedback. Indeterminate removes fake value.

State matrix: `active`, `indeterminate`, `paused`, `complete`, `error`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Determinate | linear |  |
| Indeterminate | indeterminate | indeterminate |
| Recovery state | linear | error |

## Full Width

Progress Indicator can fill the available width when progress belongs to a row, card, upload zone, or page section.

- Upload row: layout: stack
- Dashboard refresh: layout: stack
- Verification row: layout: stack

## Responsive Layout Patterns

Responsive progress keeps labels and values readable. Linear progress works best in stacked rows and dense work queues.

| Example | Layout | Density |
| --- | --- | --- |
| Phone upload | button-stack | lg |
| Desktop sync row | simple-demo-row | md |

## Viewport Organization

Choose geometry by available space and task risk. Use labels in every viewport; use Toast only for completion or recoverable follow-up, not as the only progress surface.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Use full-width linear progress below the item that is loading. | stacked row | lg |
| Tablet | Use linear progress in cards and avoid compact loaders without visible labels. | card status | md |
| Desktop | Use determinate values for imports, exports, and setup status rows. | work queue | sm |

## Playground

Use the playground to verify label, value, max, state, full-width behavior, and whether indeterminate progress hides fake percentages.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Card import |  |
| variant | select | linear | linear, indeterminate |
| value | range | 68 |  |
| state | select | active | default, active, indeterminate, paused, complete, error, disabled |
| fullWidth | checkbox | true |  |

## API And Foundations

Progress Indicator API exposes label, variant, value, max, state, tone, and full-width behavior while Design System owns geometry, state semantics, motion, reduced-motion behavior, and accessible range.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | Yes | Accessible operation label. |
| value | number | No | Current value for determinate progress. |
| max | number | No | Range maximum. |
| indeterminate | boolean | No | Shows indeterminate progress. |
| showValue | boolean | No | Shows the calculated percentage value. |
| tone | "accent" \| "success" \| "warning" \| "danger" \| "ink" | No | Semantic fill tone. |
| state | "default" \| "active" \| "indeterminate" \| "paused" \| "complete" \| "error" \| "disabled" | No | Semantic progress state. |
| density | "sm" \| "md" \| "lg" | No | Track density from Density: sm, md, or lg. |
| fullWidth | boolean | No | Lets linear progress fill the owning row or section. |

## Implementation Checklist

- Provide `label`: Accessible operation label.
- Determinate progress exposes value
- Indeterminate progress omits fake value
- Label remains visible
- Reduced motion removes continuous movement
- Error and paused states do not look complete
- Full-width layout works on mobile

## Tests And Rejection Rules

Must test:

- Determinate progress exposes value
- Indeterminate progress omits fake value
- Label remains visible
- Reduced motion removes continuous movement
- Error and paused states do not look complete
- Full-width layout works on mobile

Reject if:

- Progress appears without a visible operation label.
- Unknown work shows a fake percentage.
- Progress is the only error or completion message.
- Raw color, spacing, or motion values are used.
- The component becomes step navigation instead of status.

## MIEL

MIEL treats Progress Indicator as visible system work: agents can choose geometry from known value and available space, while humans confirm whether progress is status, navigation, recovery, or a larger pattern.

Agents can decide:

- Use linear progress for row, card, upload, import, or section-level work.
- Use indeterminate linear progress when value is unknown and hide fake percentages.
- Use full-width progress when the owning row or section needs edge-to-edge status.

Agents must ask:

- Progress changes navigation, setup sequence, or completion criteria.
- The system cannot explain what is happening in plain language.
- Failure, retry, cancellation, or undo behavior is required.

Agents must reject:

- Progress replaces recovery, completion, or error messaging.
- A percentage is invented for unknown work.
- The indicator has no visible label or accessible range.

Handoff language:

> I am using Progress Indicator for visible system work. I need confirmation on value source, state, reduced motion, completion/error messaging, and whether this belongs to a larger loading or setup pattern.
