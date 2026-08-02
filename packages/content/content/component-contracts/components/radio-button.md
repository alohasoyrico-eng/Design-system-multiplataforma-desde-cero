# Radio Button

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/radio-button/operational-example.json`
- `packages/content/content/component-copy/components/radio-button/anatomy.json`
- `packages/content/content/component-copy/components/radio-button/accessibility.json`
- `packages/content/content/component-copy/components/radio-button/variants.json`
- `packages/content/content/component-copy/components/radio-button/states.json`
- `packages/content/content/component-copy/components/radio-button/variant-state-behavior.json`
- `packages/content/content/component-copy/components/radio-button/full-width.json`
- `packages/content/content/component-copy/components/radio-button/responsive-layout-patterns.json`
- `packages/content/content/component-copy/components/radio-button/viewport-organization.json`
- `packages/content/content/component-copy/components/radio-button/playground.json`
- `packages/content/content/component-copy/components/radio-button/guidelines.json`
- `packages/content/content/component-copy/components/radio-button/api-foundations.json`
- `packages/content/content/component-copy/components/radio-button/tests-rejection-rules.json`
- `packages/content/content/component-copy/components/radio-button/miel.json`

## Purpose

Use Radio Button when one option belongs to an exclusive decision and the option itself needs a visible label, state, and optional support text.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Iconography`, `Motion Curves`, `Duration`, `Density`, `Focus`, `Disabled`, `Message`

Component dependencies: `None declared`

Token dependencies: `comp.radio-button.*`, `sys.energy.*`, `sys.voice.*`, `sys.frame.*`, `sys.state.*`, `sys.momentum.*`, `sys.accessibility.*`

Reference translation: Adapt - The ZIP reference gives the visual benchmark: 22px circular control, 11px selected dot, 1.5px border, spring dot entry, hover scale, and focus ring. Design System keeps ownership of color, type, density, state, motion, and accessibility rules.

Gaps or review gates:

- It has no visible label.
- It is used as an independent toggle.
- Group behavior is hidden inside the atomic component.
- Selection depends only on color or raw motion.
- Ask before build: The parent question, option set, or default selection is unknown.
- Ask before build: The decision affects money, permissions, compliance, routing, or policy.
- Ask before build: The request needs shared validation, arrow-key orchestration, layout rules, or group analytics.

## Use When

- Use Radio Button for one option in a mutually exclusive choice set.
- Set selected, unselected, focus, error, or disabled when product logic is explicit.
- Write option labels and support text when the parent question already exists.

## Do Not Use Without Review

- Ask before use when the parent question, option set, or default selection is unknown.
- Ask before use when the decision affects money, permissions, compliance, routing, or policy.
- Ask before use when the request needs shared validation, arrow-key orchestration, layout rules, or group analytics.
- Radio Button is used for an independent boolean setting.
- The option has no visible label.
- The agent hides Radio Group behavior inside the atomic component.
- The state is decorative or not machine-readable.
- Radio Button is used as a standalone toggle.
- Parent group behavior is implemented inside the atomic option.
- Selection depends only on color.
- Focus, error, or disabled state changes the control size.

## Operational Example

Use Radio Button when one option belongs to an exclusive decision and the option itself needs a visible label, state, and optional support text.

### Why Radio Button

- Each row is one option in a mutually exclusive decision.
- The selected dot makes the current choice visible without hiding the label.
- Group orchestration belongs to a future Radio Group pattern, not the atomic control.

Scenario type: `choice-list`

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Option label | Names the option in plain language and remains visible in every state. | comp.radio-button.label.*, sys.voice.*, sys.energy.text.* |
| Control circle | Keeps a fixed circular shape across selected, unselected, focus, error, and disabled states. | comp.radio-button.control.*, sys.frame.*, sys.state.* |
| Selection dot | Scales in only when the option is selected. | comp.radio-button.dot.*, sys.energy.*, sys.momentum.* |
| Support text | Explains consequence, scope, or recovery only when the label is not enough. | comp.radio-button.support.*, sys.voice.*, sys.accessibility.* |

## Accessibility

State precedence: disabled, error, focus, selected, unselected

- Use a native radio input or equivalent platform role.
- Keep a visible label associated with the control.
- Expose checked state to assistive technology.
- Do not hide group question, validation, or keyboard orchestration inside the atomic control.
- Disabled options remain readable and do not change value.

## Foundations

Referenced token families:

- `comp.radio-button.*`
- `sys.accessibility.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.momentum.*`
- `sys.state.*`
- `sys.voice.*`

Radio Button API stays atomic. Parent patterns provide group question, shared name, arrow-key orchestration, validation summary, and option list state.

## Variants

Variants describe how much context one radio option carries. They never replace the parent question or group behavior.

Approved variants from demos: `default`, `descriptive`, `compact`, `critical`

Demo labels:

- Default
- Descriptive
- Compact
- Critical

## States

States communicate whether the option is available, selected, focused, invalid, or unavailable without changing the circle size.

Supported states from docs: `unselected`, `selected`, `focus`, `error`, `disabled`

## Variant X State Behavior

Variant and state behavior stays atomic: selected state changes the dot, error changes border and support text, and disabled blocks interaction.

State matrix: `unselected`, `selected`, `focus`, `error`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Default option |  |  |
| Descriptive option |  |  |
| Critical option |  |  |

## Full Width

Radio Button can fill the row when the option needs support text, but the circle keeps its fixed size and the text owns the remaining width.

- Natural width: layout: natural
- Full row: layout: natural
- Responsive containers: layout: container

## Responsive Layout Patterns

Responsive demos show the atomic option adapting to available space. Shared group layout, roving focus, and validation belong to the Radio Group pattern later.

| Example | Layout | Density |
| --- | --- | --- |
| Phone stack | button-stack | lg |
| Desktop row | card-mini-grid | md |
| Compact list | button-stack natural | sm |

## Viewport Organization

Viewport organization keeps the atomic control predictable: one fixed circle, one readable label, and optional support text that wraps without pushing the control out of alignment.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Touch rows | Use comfortable row height and wrap support text under the label. |  | lg |
| Configuration lists | Use medium density for desktop settings and inspector panels. |  | md |
| Dense tables | Use compact density only when the parent pattern keeps the question and context visible. |  | sm |

## Playground

Use the playground to confirm label, support text, selected value, density, and state before placing the option inside a Radio Group pattern.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Fastest route |  |
| checked | checkbox | true |  |
| state | select | selected | unselected, selected, focus, error, disabled |
| density | select | md | sm, md, lg |

## API And Foundations

Radio Button API stays atomic. Parent patterns provide group question, shared name, arrow-key orchestration, validation summary, and option list state.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | yes | Visible option label. |
| value | string | yes | Stable option value. |
| name | string | no | Supplied by parent pattern when rendered in a group. |
| checked | boolean | yes | Whether this option is selected. |
| description | string | no | Support text under the label. |
| disabled | boolean | no | Blocks selection and keeps the option readable. |
| error | string | no | Option-level error or policy message. |
| onChange | (value: string) => void | yes | Reports this option value when selected. |

## Implementation Checklist

- Provide `label`: Visible option label.
- Provide `value`: Stable option value.
- Provide `checked`: Whether this option is selected.
- Provide `onChange`: Reports this option value when selected.
- Visible label and native radio semantics
- Checked state announcement
- Focus ring and keyboard focus
- Disabled does not select
- Error support text association
- Density adaptation without circle resizing

## Tests And Rejection Rules

Must test:

- Visible label and native radio semantics
- Checked state announcement
- Focus ring and keyboard focus
- Disabled does not select
- Error support text association
- Density adaptation without circle resizing

Reject if:

- The option has no visible label.
- Radio Button is used as a standalone toggle.
- Parent group behavior is implemented inside the atomic option.
- Selection depends only on color.
- Focus, error, or disabled state changes the control size.

## MIEL

MIEL treats Radio Button as one atomic option in an exclusive decision: the agent can configure value and state, while the human owns the parent question, risk, and group behavior.

Agents can decide:

- Use Radio Button for one option in a mutually exclusive choice set.
- Set selected, unselected, focus, error, or disabled when product logic is explicit.
- Write option labels and support text when the parent question already exists.

Agents must ask:

- The parent question, option set, or default selection is unknown.
- The decision affects money, permissions, compliance, routing, or policy.
- The request needs shared validation, arrow-key orchestration, layout rules, or group analytics.

Agents must reject:

- Radio Button is used for an independent boolean setting.
- The option has no visible label.
- The agent hides Radio Group behavior inside the atomic component.
- The state is decorative or not machine-readable.

Handoff language:

> I am using Radio Button because this is one option in an exclusive choice set. I need confirmation on the parent question, option set, default value, and whether group behavior belongs to a pattern.
