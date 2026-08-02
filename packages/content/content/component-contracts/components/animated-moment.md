# Animated Moment

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/animated-moment/all.json`

## Purpose

Use Animated Moment as a bounded component only for one controlled animated cue with label, state, and reduced-motion fallback.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Breakpoints`, `Focus`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.animated-moment.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.state.*`, `sys.momentum.*`, `sys.accessibility.*`

Gaps or review gates:

- The component is described as a real animation-player runtime without package-owned player support.
- Onboarding, education, campaign, or multi-step animation sequences belong to patterns.
- State is color-only.
- Component owns a process.
- Ask before build: The request needs a real animation asset/player contract.
- Ask before build: The request needs orchestration, multi-step behavior, or cross-surface state.
- Ask before build: Onboarding, education, campaign, or multi-step animation sequences belong to patterns.
- Ask before build: Accessibility, risk, or reduced-motion expectations are unclear.

## Use When

- Use Animated Moment for one local animated cue job.
- Select variant and state from the Animated Moment contract.
- Keep labels, focus, state, and reduced-motion fallback visible.

## Do Not Use Without Review

- Ask before use when the request needs a real animation asset/player contract.
- Ask before use when the request needs orchestration, multi-step behavior, or cross-surface state.
- Ask before use when onboarding, education, campaign, or multi-step animation sequences belong to patterns.
- Ask before use when accessibility, risk, or reduced-motion expectations are unclear.
- The component is described as a real animation-player runtime without package-owned player support.
- Required meaning is icon-only, color-only, or motion-only.
- The component becomes a process container.
- Onboarding, education, campaign, or multi-step animation sequences belong to patterns.
- State is color-only.
- Component owns multi-step system.
- Required label or fallback is missing.

## Operational Example

Use Animated Moment as a bounded component only for one controlled animated cue with label, state, and reduced-motion fallback.

### Why Animated Moment

- Render one controlled animated cue with label, state, and reduced-motion fallback without becoming onboarding, celebration, or education system.
- Animated Moment is intentionally not an animation-player runtime; add a separate player contract only when Design System needs asset playback.
- Onboarding, education, campaign, or multi-step animation sequences belong to patterns.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Surface | Owns the visible Animated Moment container and spacing. | comp.animated-moment.*, sys.frame.* |
| Primary label | Provides visible meaning and accessible name. | sys.voice.* |
| State affordance | Shows current state without relying on color only. | sys.state.* |
| Supporting metadata | Keeps context short and local to the component. | sys.growth.* |
| Icon or motion cue | Supports recognition without replacing text. | sys.symbol.*, sys.iconography.* |

## Accessibility

State precedence: disabled, reduced-motion, paused, playing, complete, idle

- Provide a visible accessible label.
- Expose current state through text or ARIA where applicable.
- Keep keyboard focus visible and predictable.
- Respect reduced motion for motion-bearing variants.
- Escalate to a pattern when behavior exceeds one local component.

## Foundations

Referenced token families:

- `comp.animated-moment.*`
- `sys.frame.*`
- `sys.growth.*`
- `sys.iconography.*`
- `sys.state.*`
- `sys.symbol.*`
- `sys.voice.*`

Animated Moment API exposes only local cue props while Design System owns foundations, primitives, state precedence, and escalation rules. It does not currently expose a package-owned animation asset/player contract.

## Variants

Animated Moment variants define local presentation only. Onboarding, education, campaign, or multi-step animation sequences belong to patterns.

Approved variants from demos: `success`, `empty`, `loading`, `celebration`

Demo labels:

- Success
- Empty
- Loading
- Celebration

## States

Animated Moment states follow explicit precedence so status remains readable and auditable.

Supported states from docs: `idle`, `playing`, `paused`, `complete`, `reduced-motion`, `disabled`

## Variant X State Behavior

Variant controls presentation; state controls local behavior. Onboarding, education, campaign, or multi-step animation sequences belong to patterns.

State matrix: `idle`, `playing`, `paused`, `complete`, `reduced-motion`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Success | success |  |
| Empty | empty |  |
| Loading | loading |  |

## Full Width

Animated Moment may fill its parent when content remains readable and behavior stays local.

- Mobile: layout: button-stack
- Panel: layout: button-stack
- Desktop: layout: button-stack

## Responsive Layout Patterns

Use responsive density to preserve labels, state, and targets; do not add pattern orchestration to Animated Moment.

| Example | Layout | Density |
| --- | --- | --- |
| Phone | button-stack | lg |
| Desktop | simple-demo-row | md |

## Viewport Organization

Viewport rules decide density and placement while Animated Moment remains a component.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Use readable labels and touch-safe targets. | mobile surface | lg |
| Tablet | Keep the component near related context. | context panel | md |
| Desktop | Use compact density only when state remains visible. | admin surface | sm |

## Playground

Use the playground to verify Animated Moment label, variant, state, full-width behavior, reduced-motion fallback, and pattern boundary.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Animated Moment |  |
| variant | select | success | success, empty, loading, celebration |
| state | select | idle | idle, playing, paused, complete, reduced-motion, disabled |
| fullWidth | checkbox | false |  |

## API And Foundations

Animated Moment API exposes only local cue props while Design System owns foundations, primitives, state precedence, and escalation rules. It does not currently expose a package-owned animation asset/player contract.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | No | Accessible animated cue label. |
| description | string | No | Short description or fallback copy. |
| variant | AnimatedMomentVariant | No | Moment treatment. |
| state | AnimatedMomentState | No | Local cue state. |
| density | sm \| md \| lg | No | Density-driven scale for halo, icon, spacing, and copy. |
| fullWidth | boolean | No | Lets the moment fill the owning region and use desktop composition when space allows. |
| icon | IconName | No | Decorative cue icon. |
| reducedMotionFallback | string | No | Fallback text or static state. |

## Implementation Checklist

- Set `label` as a documented control.
- Set `variant` as a documented control. Options: success, empty, loading, celebration.
- Set `state` as a documented control. Options: idle, playing, paused, complete, reduced-motion, disabled.
- Set `fullWidth` as a documented control.
- Visible label
- State precedence
- Keyboard focus
- Responsive layout
- Reduced motion when relevant
- Pattern boundary
- Reduced-motion fallback

## Tests And Rejection Rules

Must test:

- Visible label
- State precedence
- Keyboard focus
- Responsive layout
- Reduced motion when relevant
- Pattern boundary
- Reduced-motion fallback

Reject if:

- The component is described as a real animation-player runtime without package-owned player support.
- Onboarding, education, campaign, or multi-step animation sequences belong to patterns.
- State is color-only.
- Component owns multi-step system.
- Required label or fallback is missing.

## MIEL

MIEL treats Animated Moment as a bounded local animated cue. Agents may place it when the job is local; humans confirm state, accessibility, content, and whether escalation to a pattern or a separate animation-player contract is required.

Agents can decide:

- Use Animated Moment for one local animated cue job.
- Select variant and state from the Animated Moment contract.
- Keep labels, focus, state, and reduced-motion fallback visible.

Agents must ask:

- The request needs a real animation asset/player contract.
- The request needs orchestration, multi-step behavior, or cross-surface state.
- Onboarding, education, campaign, or multi-step animation sequences belong to patterns.
- Accessibility, risk, or reduced-motion expectations are unclear.

Agents must reject:

- The component is described as a real animation-player runtime without package-owned player support.
- Required meaning is icon-only, color-only, or motion-only.
- The component becomes a process container.

Handoff language:

> I am using Animated Moment as a bounded animated cue. Please confirm label, state, accessibility behavior, responsive treatment, and whether this should escalate to a pattern or a separate animation-player contract.
