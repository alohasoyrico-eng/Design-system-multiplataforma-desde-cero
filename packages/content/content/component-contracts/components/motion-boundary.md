# Motion Boundary

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/motion-boundary/all.json`

## Purpose

Use Motion Boundary as a bounded component: Wrap one region with explicit enter, exit, active, and reduced-motion behavior without choreographing the whole page.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Breakpoints`, `Focus`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.motion-boundary.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.state.*`, `sys.momentum.*`, `sys.accessibility.*`

Gaps or review gates:

- Page choreography, route transition systems, and animation storytelling belong to patterns or foundations.
- Entering and exiting use the same undocumented timing.
- State is color-only or motion-only.
- Component owns multi-region sequencing.
- Ask before build: The request needs orchestration, multi-step behavior, or cross-surface state.
- Ask before build: Page choreography, route transition systems, and animation storytelling belong to patterns or foundations.
- Ask before build: Accessibility, risk, or reduced-motion expectations are unclear.

## Use When

- Use Motion Boundary for one local UI job.
- Select variant and state from the Motion Boundary contract.
- Keep labels, focus, and state visible.

## Do Not Use Without Review

- Ask before use when the request needs orchestration, multi-step behavior, or cross-surface state.
- Ask before use when page choreography, route transition systems, and animation storytelling belong to patterns or foundations.
- Ask before use when accessibility, risk, or reduced-motion expectations are unclear.
- Page choreography, route transition systems, and animation storytelling belong to patterns or foundations.
- Required meaning is icon-only, color-only, or motion-only.
- The component becomes a process container.
- Entering and exiting use the same undocumented timing.
- State is color-only or motion-only.
- Component owns multi-region sequencing.
- Required label or fallback is missing.

## Operational Example

Use Motion Boundary as a bounded component: Wrap one region with explicit enter, exit, active, and reduced-motion behavior without choreographing the whole page.

### Why Motion Boundary

- Motion Boundary wraps one region and exposes idle, entering, active, exiting, reduced-motion, and disabled states without choreographing the page.
- Entering uses Flow enter duration/easing; exiting uses Flow exit duration/easing; active uses move easing for continuity.
- Route/page choreography, storytelling, and multi-region sequencing belong to patterns or foundations, not this component.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Surface | Owns the visible Motion Boundary container and spacing. | comp.motion-boundary.*, sys.frame.* |
| Primary label | Provides visible meaning and accessible name. | sys.voice.* |
| State affordance | Shows idle, entering, active, exiting, reduced-motion, and disabled states with separate enter, move, and exit timing tokens. | sys.state.* |
| Supporting metadata | Keeps context short and local to the component. | sys.growth.* |
| Icon or motion cue | Uses a bounded cue to reveal transition direction and progress without becoming page choreography. | sys.symbol.*, sys.iconography.* |

## Accessibility

State precedence: disabled, reduced-motion, exiting, entering, active, idle

- Provide a visible accessible label.
- Expose current state through text or ARIA where applicable.
- Keep keyboard focus visible and predictable.
- Respect reduced motion for motion-bearing variants.
- Escalate to a pattern when behavior exceeds one local component.

## Foundations

Referenced token families:

- `comp.motion-boundary.*`
- `sys.frame.*`
- `sys.growth.*`
- `sys.iconography.*`
- `sys.state.*`
- `sys.symbol.*`
- `sys.voice.*`

Motion Boundary API exposes local props while Design System owns foundations, primitives, state precedence, and escalation rules.

## Variants

Motion Boundary variants define local presentation only. Fade, slide, collapse, and route change the cue treatment; they do not own page choreography or route transition systems.

Approved variants from demos: `fade`, `slide`, `collapse`, `route`

Demo labels:

- Fade
- Slide
- Collapse
- Route

## States

Motion Boundary states follow explicit precedence: disabled, reduced-motion, exiting, entering, active, idle. Entering uses Flow enter timing, exiting uses Flow exit timing, and active uses move timing.

Supported states from docs: `idle`, `entering`, `active`, `exiting`, `reduced-motion`, `disabled`

## Variant X State Behavior

Variant controls presentation; state controls local behavior. Page choreography, route transition systems, and animation storytelling belong to patterns or foundations.

State matrix: `idle`, `entering`, `active`, `exiting`, `reduced-motion`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Fade | fade |  |
| Slide | slide |  |
| Collapse | collapse |  |

## Full Width

Motion Boundary may fill its parent when content remains readable and behavior stays local.

- Mobile: layout: button-stack
- Panel: layout: button-stack
- Desktop: layout: button-stack

## Responsive Layout Patterns

Use responsive density to preserve labels, state, and targets; do not add pattern orchestration to Motion Boundary.

| Example | Layout | Density |
| --- | --- | --- |
| Phone | button-stack | lg |
| Desktop | simple-demo-row | md |

## Viewport Organization

Viewport rules decide density and placement while Motion Boundary remains a component.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Use readable labels and touch-safe targets. | mobile surface | lg |
| Tablet | Keep the component near related context. | context panel | md |
| Desktop | Use compact density only when state remains visible. | admin surface | sm |

## Playground

Use the playground to verify Motion Boundary label, variant, state, full-width behavior, and pattern boundary.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Motion Boundary |  |
| variant | select | fade | fade, slide, collapse, route |
| state | select | idle | idle, entering, active, exiting, reduced-motion, disabled |
| fullWidth | checkbox | false |  |

## API And Foundations

Motion Boundary API exposes local props while Design System owns foundations, primitives, state precedence, and escalation rules.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | No | Boundary label. |
| description | string | No | Short description for the bounded region. |
| variant | MotionBoundaryVariant | No | Transition treatment. |
| state | MotionBoundaryState | No | Motion state. |
| icon | IconName | No | Decorative transition icon. |
| reducedMotion | boolean | No | Reduced-motion mode. |

## Implementation Checklist

- Set `label` as a documented control.
- Set `variant` as a documented control. Options: fade, slide, collapse, route.
- Set `state` as a documented control. Options: idle, entering, active, exiting, reduced-motion, disabled.
- Set `fullWidth` as a documented control.
- Visible label
- State precedence
- Entering uses Flow enter timing
- Exiting uses Flow exit timing
- Active uses Flow move timing
- Reduced motion hides motion cue
- Responsive layout
- Pattern boundary

## Tests And Rejection Rules

Must test:

- Visible label
- State precedence
- Entering uses Flow enter timing
- Exiting uses Flow exit timing
- Active uses Flow move timing
- Reduced motion hides motion cue
- Responsive layout
- Pattern boundary

Reject if:

- Page choreography, route transition systems, and animation storytelling belong to patterns or foundations.
- Entering and exiting use the same undocumented timing.
- State is color-only or motion-only.
- Component owns multi-region sequencing.
- Required label or fallback is missing.

## MIEL

MIEL treats Motion Boundary as a bounded component. Agents may place it when the job is local; humans confirm state, accessibility, content, and whether escalation to a pattern is required.

Agents can decide:

- Use Motion Boundary for one local UI job.
- Select variant and state from the Motion Boundary contract.
- Keep labels, focus, and state visible.

Agents must ask:

- The request needs orchestration, multi-step behavior, or cross-surface state.
- Page choreography, route transition systems, and animation storytelling belong to patterns or foundations.
- Accessibility, risk, or reduced-motion expectations are unclear.

Agents must reject:

- Page choreography, route transition systems, and animation storytelling belong to patterns or foundations.
- Required meaning is icon-only, color-only, or motion-only.
- The component becomes a process container.

Handoff language:

> I am using Motion Boundary as a bounded component. Please confirm label, state, accessibility behavior, responsive treatment, and whether this should escalate to a pattern.
