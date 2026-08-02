# Error Panel

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/error-panel/all.json`

## Purpose

Use Error Panel as a bounded component: Present one blocking or recoverable error surface with action and context without owning incident, retry, or support flows.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Breakpoints`, `Focus`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.error-panel.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.state.*`, `sys.momentum.*`, `sys.accessibility.*`

Gaps or review gates:

- Incident recovery, support handoff, and multi-step remediation belong to patterns.
- State is color-only.
- Component owns a process.
- Ask before build: The request needs orchestration, multi-step behavior, or cross-surface state.
- Ask before build: Incident recovery, support handoff, and multi-step remediation belong to patterns.
- Ask before build: Accessibility, risk, or reduced-motion expectations are unclear.

## Use When

- Use Error Panel for one local UI job.
- Select variant and state from the Error Panel contract.
- Keep labels, focus, and state visible.

## Do Not Use Without Review

- Ask before use when the request needs orchestration, multi-step behavior, or cross-surface state.
- Ask before use when incident recovery, support handoff, and multi-step remediation belong to patterns.
- Ask before use when accessibility, risk, or reduced-motion expectations are unclear.
- Incident recovery, support handoff, and multi-step remediation belong to patterns.
- Required meaning is icon-only, color-only, or motion-only.
- The component becomes a process container.
- State is color-only.
- Component owns multi-step system.
- Required label or fallback is missing.

## Operational Example

Use Error Panel as a bounded component: Present one blocking or recoverable error surface with action and context without owning incident, retry, or support flows.

### Why Error Panel

- Present one blocking or recoverable error surface with action and context without owning incident, retry, or support flows.
- Incident recovery, support handoff, and multi-step remediation belong to patterns.
- Keep Error Panel small enough to validate with Design System foundations, primitives, and accessibility rules.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Surface | Owns the visible Error Panel container and spacing. | comp.error-panel.*, sys.frame.* |
| Primary label | Provides visible meaning and accessible name. | sys.voice.* |
| State affordance | Shows current state without relying on color only. | sys.state.* |
| Supporting metadata | Keeps context short and local to the component. | sys.growth.* |
| Icon or motion cue | Supports recognition without replacing text. | sys.symbol.*, sys.iconography.* |

## Accessibility

State precedence: disabled, critical, error, warning, loading, default

- Provide a visible accessible label.
- Expose current state through text or ARIA where applicable.
- Keep keyboard focus visible and predictable.
- Respect reduced motion for motion-bearing variants.
- Escalate to a pattern when behavior exceeds one local component.

## Foundations

Referenced token families:

- `comp.error-panel.*`
- `sys.frame.*`
- `sys.growth.*`
- `sys.iconography.*`
- `sys.state.*`
- `sys.symbol.*`
- `sys.voice.*`

Error Panel API exposes local props while Design System owns foundations, primitives, state precedence, and escalation rules.

## Variants

Error Panel variants define local presentation only. Incident recovery, support handoff, and multi-step remediation belong to patterns.

Approved variants from demos: `inline`, `panel`, `blocking`, `empty-recovery`

Demo labels:

- Inline
- Panel
- Blocking
- Empty Recovery

## States

Error Panel states follow explicit precedence so status remains readable and auditable.

Supported states from docs: `default`, `warning`, `error`, `critical`, `loading`, `disabled`

## Variant X State Behavior

Variant controls presentation; state controls local behavior. Incident recovery, support handoff, and multi-step remediation belong to patterns.

State matrix: `default`, `warning`, `error`, `critical`, `loading`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Inline | inline |  |
| Panel | panel |  |
| Blocking | blocking |  |

## Full Width

Error Panel may fill its parent when content remains readable and behavior stays local.

- Mobile: layout: button-stack
- Panel: layout: button-stack
- Desktop: layout: button-stack

## Responsive Layout Patterns

Use responsive density to preserve labels, state, and targets; do not add pattern orchestration to Error Panel.

| Example | Layout | Density |
| --- | --- | --- |
| Phone | button-stack | lg |
| Desktop | simple-demo-row | md |

## Viewport Organization

Viewport rules decide density and placement while Error Panel remains a component.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Use readable labels and touch-safe targets. | mobile surface | lg |
| Tablet | Keep the component near related context. | context panel | md |
| Desktop | Use compact density only when state remains visible. | admin surface | sm |

## Playground

Use the playground to verify Error Panel label, variant, state, full-width behavior, and pattern boundary.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Error Panel |  |
| variant | select | inline | inline, panel, blocking, empty-recovery |
| state | select | default | default, warning, error, critical, loading, disabled |
| fullWidth | checkbox | false |  |

## API And Foundations

Error Panel API exposes local props while Design System owns foundations, primitives, state precedence, and escalation rules.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | Yes | Error panel title. |
| description | string | No | Error explanation. |
| action | ButtonProps | No | Single local recovery action rendered with Button. |
| tone | "warning" \| "error" \| "critical" | No | Panel severity tone. |
| variant | "inline" \| "panel" \| "blocking" \| "empty-recovery" | No | Local presentation only. |
| state | "default" \| "warning" \| "error" \| "critical" \| "loading" \| "disabled" | No | Current severity or interaction state. |
| density | "sm" \| "md" \| "lg" | No | Flow density inherited from context. |
| fullWidth | boolean | No | Allows the panel to fill its owning surface. |
| icon | string | No | Decorative severity icon. |
| role | "status" \| "alert" | No | Optional ARIA role override. |
| onAction | (key: string) => void | No | Called when recovery action is selected. |

## Implementation Checklist

- Provide `label`: Error panel title.
- Visible label
- State precedence
- Keyboard focus
- Responsive layout
- Reduced motion when relevant
- Pattern boundary

## Tests And Rejection Rules

Must test:

- Visible label
- State precedence
- Keyboard focus
- Responsive layout
- Reduced motion when relevant
- Pattern boundary

Reject if:

- Incident recovery, support handoff, and multi-step remediation belong to patterns.
- State is color-only.
- Component owns multi-step system.
- Required label or fallback is missing.

## MIEL

MIEL treats Error Panel as a bounded component. Agents may place it when the job is local; humans confirm state, accessibility, content, and whether escalation to a pattern is required.

Agents can decide:

- Use Error Panel for one local UI job.
- Select variant and state from the Error Panel contract.
- Keep labels, focus, and state visible.

Agents must ask:

- The request needs orchestration, multi-step behavior, or cross-surface state.
- Incident recovery, support handoff, and multi-step remediation belong to patterns.
- Accessibility, risk, or reduced-motion expectations are unclear.

Agents must reject:

- Incident recovery, support handoff, and multi-step remediation belong to patterns.
- Required meaning is icon-only, color-only, or motion-only.
- The component becomes a process container.

Handoff language:

> I am using Error Panel as a bounded component. Please confirm label, state, accessibility behavior, responsive treatment, and whether this should escalate to a pattern.
