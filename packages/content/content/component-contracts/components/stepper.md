# Stepper

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/stepper/all.json`

## Purpose

Use Stepper to show progress through a short, ordered sequence with a known current step.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Breakpoints`, `Focus`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.stepper.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.state.*`, `sys.momentum.*`, `sys.accessibility.*`

Gaps or review gates:

- Parallel system
- No current step
- Too many steps
- Blocked, error, review, optional, routing, or recovery are hidden inside Stepper
- Raw visual values
- Ask before build: The order can change.
- Ask before build: Future steps are clickable.
- Ask before build: A blocked or error step needs recovery rules.

## Use When

- Use for three to five ordered steps.
- Use vertical orientation when labels need room.
- Use completed checks for finished steps.

## Do Not Use Without Review

- Ask before use when the order can change.
- Ask before use when future steps are clickable.
- Ask before use when a blocked or error step needs recovery rules.
- The system is parallel rather than sequential.
- There are too many steps for a wizard.
- The current step is not explicit.
- Routing, validation, recovery, or future-step navigation is hidden inside the component.
- Used for parallel navigation.
- Current step is ambiguous.
- Future steps are clickable without pattern rules.
- Blocked, error, review, optional, or route behavior is presented as closed component behavior.
- Raw visual values are used.

## Operational Example

Use Stepper to show progress through a short, ordered sequence with a known current step.

### Why Stepper

- Flow defines the state semantics: active/current uses action-primary and complete uses success.
- The ZIP reference informs marker shape, connector rhythm, label scale, depth, halo, and enter motion.
- The color tension is resolved in favor of Flow semantics while preserving the ZIP-inspired dimensional treatment.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Ordered list | Represents the sequence semantically. | comp.stepper.*, sys.accessibility.* |
| Step marker | Shows number, active/current action-primary treatment, or completed success check. ZIP informs depth and motion without replacing Flow state color. | sys.symbol.*, sys.iconography.*, sys.state.*, sys.depth.* |
| Connector | Shows relationship and completed progress with success state color. | sys.frame.*, sys.energy.* |
| Label | Names each step with compact text that can wrap by orientation. | sys.voice.* |
| Momentum cue | Uses bounded enter motion for the active marker and completed check. | sys.momentum.* |

## Accessibility

State precedence: active, complete, pending

- Use ordered list semantics.
- Mark the current step with aria-current step.
- Keep step labels visible.
- Do not make future steps clickable unless a pattern owns the rules.
- Use Progress Indicator instead for non-step loading.

## Foundations

Referenced token families:

- `comp.stepper.*`
- `sys.accessibility.*`
- `sys.depth.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.iconography.*`
- `sys.momentum.*`
- `sys.state.*`
- `sys.symbol.*`
- `sys.voice.*`

Stepper API exposes steps, current index, orientation, and density while Design System foundations own sequence semantics, symbols, motion, and accessibility.

## Variants

Stepper has two package-backed layout variants: horizontal and vertical. Density changes scale through Flow context. Compact, review, optional, blocked, error, routing, and recovery are not closed Stepper variants.

Approved variants from demos: `horizontal`, `vertical`

Demo labels:

- Horizontal
- Vertical
- Density sm
- Density lg

## States

Stepper state is derived from the current index: previous steps are complete with success color, the current step is active with Flow action-primary, and later steps are pending.

Supported states from docs: `pending`, `active`, `complete`

## Variant X State Behavior

Variant controls orientation, state is derived from current progress, and density controls scale. Process errors, blockers, route guards, and future-step navigation belong to patterns.

State matrix: `pending`, `active`, `complete`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Horizontal | horizontal |  |
| Vertical | vertical |  |
| Dense | horizontal |  |

## Full Width

Stepper may fill a form header, but each marker, connector, and label must keep stable geometry.

- Wizard header: layout: row
- Dense header: layout: row
- Vertical form: layout: stack

## Responsive Layout Patterns

Use horizontal Stepper for roomy screens and vertical Stepper when labels need more space.

| Example | Layout | Density |
| --- | --- | --- |
| Phone wizard | simple-demo-row | lg |
| Desktop wizard | simple-demo-row | sm |

## Viewport Organization

Use Stepper for short sequences. Use routes or templates for long processes and Tabs for parallel sections.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Prefer vertical when labels need room. | vertical sequence | lg |
| Tablet | Use horizontal for three to five steps. | wizard header | md |
| Desktop | Use small density for dense setup systems. | setup system | sm |

## Playground

Use the playground to verify current step, orientation, density, and state derivation.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Vehicle setup |  |
| current | number | 1 |  |
| orientation | select | horizontal | horizontal, vertical |
| density | select | md | sm, md, lg |

## API And Foundations

Stepper API exposes steps, current index, orientation, and density while Design System foundations own sequence semantics, symbols, motion, and accessibility.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| steps | StepperStep[] | Yes | Ordered step labels and optional descriptions. |
| current | number | Yes | Current zero-based step index. |
| label | string | No | Accessible stepper label. |
| orientation | horizontal \| vertical | No | Layout orientation. |
| density | sm \| md \| lg | No | Flow density scale. |

## Implementation Checklist

- Provide `steps`: Ordered step labels and optional descriptions.
- Provide `current`: Current zero-based step index.
- Ordered list semantics
- aria-current step
- Horizontal and vertical orientation
- Density scale
- Active/current marker uses Flow action-primary and complete marker uses Flow success
- Complete check
- Connector state
- Bounded enter motion
- Mobile label wrap

## Tests And Rejection Rules

Must test:

- Ordered list semantics
- aria-current step
- Horizontal and vertical orientation
- Density scale
- Active/current marker uses Flow action-primary and complete marker uses Flow success
- Complete check
- Connector state
- Bounded enter motion
- Mobile label wrap

Reject if:

- Used for parallel navigation.
- Current step is ambiguous.
- Future steps are clickable without pattern rules.
- Blocked, error, review, optional, or route behavior is presented as closed component behavior.
- Raw visual values are used.

## MIEL

MIEL treats Stepper as sequence governance: agents can propose it for short ordered sequences, but humans confirm whether the system is truly sequential and whether routing or recovery should escalate to a pattern.

Agents can decide:

- Use for three to five ordered steps.
- Use vertical orientation when labels need room.
- Use completed checks for finished steps.

Agents must ask:

- The order can change.
- Future steps are clickable.
- A blocked or error step needs recovery rules.

Agents must reject:

- The system is parallel rather than sequential.
- There are too many steps for a wizard.
- The current step is not explicit.
- Routing, validation, recovery, or future-step navigation is hidden inside the component.

Handoff language:

> I am using Stepper for a short ordered sequence. Please confirm steps, current index, orientation, and whether routing or recovery should escalate to a pattern.
