# Checkbox

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/checkbox/operational-example.json`
- `packages/content/content/component-copy/components/checkbox/anatomy.json`
- `packages/content/content/component-copy/components/checkbox/accessibility.json`
- `packages/content/content/component-copy/components/checkbox/variants.json`
- `packages/content/content/component-copy/components/checkbox/states.json`
- `packages/content/content/component-copy/components/checkbox/variant-state-behavior.json`
- `packages/content/content/component-copy/components/checkbox/full-width.json`
- `packages/content/content/component-copy/components/checkbox/responsive-layout-patterns.json`
- `packages/content/content/component-copy/components/checkbox/viewport-organization.json`
- `packages/content/content/component-copy/components/checkbox/playground.json`
- `packages/content/content/component-copy/components/checkbox/guidelines.json`
- `packages/content/content/component-copy/components/checkbox/api-foundations.json`
- `packages/content/content/component-copy/components/checkbox/tests-rejection-rules.json`
- `packages/content/content/component-copy/components/checkbox/miel.json`

## Purpose

Use Checkbox when someone needs to turn one independent choice on or off, or show that a group is partially selected.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Iconography`, `Motion Curves`, `Duration`, `Density`, `Focus`, `Disabled`, `Message`

Component dependencies: `None declared`

Token dependencies: `comp.checkbox.*`, `sys.energy.*`, `sys.voice.*`, `sys.frame.*`, `sys.state.*`, `sys.momentum.*`, `sys.symbol.*`, `sys.iconography.*`, `sys.accessibility.*`

Reference translation: Adapt - The ZIP reference gives the visual benchmark: compact square control, clear selected accent, indeterminate support, and spring-like feedback. Design System keeps ownership of color, type, density, state, icon, motion, and accessibility rules.

Gaps or review gates:

- It has no visible label.
- Indeterminate is styled as checked without mixed semantics.
- Disabled removes contrast below accessibility thresholds.
- A group of mutually exclusive choices is built with checkboxes.
- Ask before build: The choice affects consent, money, permissions, identity, compliance, or legal wording.
- Ask before build: The difference between unchecked and indeterminate is not defined.
- Ask before build: The row belongs to a mutually exclusive set that may require Radio instead.

## Use When

- Use Checkbox for one independent yes/no choice or a select-all aggregate.
- Set checked, unchecked, indeterminate, focus, error, and disabled when product logic is explicit.
- Place rows in settings, filters, tables, or permission groups when grouping already exists.

## Do Not Use Without Review

- Ask before use when the choice affects consent, money, permissions, identity, compliance, or legal wording.
- Ask before use when the difference between unchecked and indeterminate is not defined.
- Ask before use when the row belongs to a mutually exclusive set that may require Radio instead.
- The checkbox has no visible label.
- Mixed state is decorative or not backed by child selections.
- The control replaces Radio for mutually exclusive choices.
- Disabled state hides why the choice cannot change.
- Mixed state is only visual.
- The box changes size across states.
- The row becomes a radio group replacement.
- Disabled copy removes the reason for lockout.

## Operational Example

Use Checkbox when someone needs to turn one independent choice on or off, or show that a group is partially selected.

### Why Checkbox

- Each row is an independent boolean choice.
- Indeterminate communicates partial selection without pretending the value is final.
- Labels and support text keep operational consequences visible.

Scenario type: `selection-list`

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Choice label | Write the choice as the outcome of checking the box. | comp.checkbox.label.*, sys.voice.*, sys.energy.text.* |
| Control box | Keep the square stable across checked, unchecked, focus, error, and disabled states. | comp.checkbox.box.*, sys.frame.*, sys.state.*, sys.momentum.*, sys.accessibility.* |
| Indicator icon | Use check for selected and remove for mixed; never use decorative icons inside the box. | comp.checkbox.indicator.*, sys.iconography.*, sys.symbol.* |
| Support text | Explain consequence, policy, or recovery only when the label is not enough. | comp.checkbox.support.*, sys.voice.*, sys.energy.status.* |

## Accessibility

State precedence: disabled, error, focus, indeterminate, checked, unchecked

- Associate every checkbox with a visible label.
- Support keyboard focus and Space toggling.
- Expose indeterminate as mixed, not checked.
- Keep focus visible around the control box.
- Associate error text with the checkbox when validation is present.
- Do not rely on color alone to communicate checked, mixed, or error states.

## Foundations

Referenced token families:

- `comp.checkbox.*`
- `sys.accessibility.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.iconography.*`
- `sys.momentum.*`
- `sys.state.*`
- `sys.symbol.*`
- `sys.voice.*`

Checkbox API exposes value, mixed state, support text, validation, and disabled behavior while Design System foundations own styling.

## Variants

Variants describe the row structure around the same boolean control. They do not change selection semantics.

Approved variants from demos: `default`, `descriptive`, `select-all`, `compact`

Demo labels:

- Enable fuel card
- Descriptive
- Select all
- Compact

## States

States must make the value, mixed condition, focus, validation, and disabled behavior visible without changing the label.

Supported states from docs: `unchecked`, `checked`, `indeterminate`, `focus`, `error`, `disabled`

## Variant X State Behavior

Variant and state combine without changing precedence: disabled wins first, then error, focus, mixed, checked, and unchecked.

State matrix: `unchecked`, `checked`, `indeterminate`, `focus`, `error`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Default |  |  |
| Descriptive |  |  |
| Select all |  |  |

## Full Width

Checkbox rows may fill the available width, but the control box keeps its fixed size and the label owns the remaining space.

- Phone setting: layout: stack
- Table row: layout: natural
- Permission group: layout: container

## Responsive Layout Patterns

Responsive layout changes the row stack, not the boolean meaning or state priority.

| Example | Layout | Density |
| --- | --- | --- |
| Narrow stack | button-stack | lg |
| Wide permissions | container-demo | md |

## Viewport Organization

Organize Checkbox rows by available reading space: stack on narrow screens, align with tables on wide screens, and avoid dense clusters on touch surfaces.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Use full-width rows with large density. |  | lg |
| Tablet | Stack short groups before moving into two-column layouts. |  | md |
| Desktop | Align with table rows or permission columns, keeping labels readable. |  | sm |

## Playground

Use the playground to confirm label length, support text, density, checked value, and mixed state before using Checkbox in a system.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Enable fuel card |  |
| checked | checkbox | true |  |
| indeterminate | checkbox | false |  |
| state | select | checked | unchecked, checked, indeterminate, focus, error, disabled |
| density | select | md | sm, md, lg |

## API And Foundations

Checkbox API exposes value, mixed state, support text, validation, and disabled behavior while Design System foundations own styling.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | Yes | Visible choice text. |
| checked | boolean | Yes | Selected value. |
| indeterminate | boolean | No | Mixed value for partial selection. |
| description | string | No | Support text under the label. |
| error | string | No | Validation or policy message. |
| disabled | boolean | No | Blocks interaction. |
| required | boolean | No | Marks a required consent or setting. |
| onChange | (checked: boolean) => void | Yes | Reports the next value. |

## Implementation Checklist

- Provide `label`: Visible choice text.
- Provide `checked`: Selected value.
- Provide `onChange`: Reports the next value.
- Label association
- Keyboard Space toggles value
- Indeterminate announces mixed state
- Focus is visible
- Disabled cannot toggle
- Error message is associated

## Tests And Rejection Rules

Must test:

- Label association
- Keyboard Space toggles value
- Indeterminate announces mixed state
- Focus is visible
- Disabled cannot toggle
- Error message is associated

Reject if:

- The checkbox has no visible label.
- Mixed state is only visual.
- The box changes size across states.
- The row becomes a radio group replacement.
- Disabled copy removes the reason for lockout.

## MIEL

MIEL treats Checkbox as an explicit boolean or partial-selection contract: the agent can configure value and state, while the human owns meaning, consent, policy, and consequence.

Agents can decide:

- Use Checkbox for one independent yes/no choice or a select-all aggregate.
- Set checked, unchecked, indeterminate, focus, error, and disabled when product logic is explicit.
- Place rows in settings, filters, tables, or permission groups when grouping already exists.

Agents must ask:

- The choice affects consent, money, permissions, identity, compliance, or legal wording.
- The difference between unchecked and indeterminate is not defined.
- The row belongs to a mutually exclusive set that may require Radio instead.

Agents must reject:

- The checkbox has no visible label.
- Mixed state is decorative or not backed by child selections.
- The control replaces Radio for mutually exclusive choices.
- Disabled state hides why the choice cannot change.

Handoff language:

> I am using Checkbox because this is an independent boolean choice or partial group selection. I need confirmation on the checked outcome, policy wording, and indeterminate logic.
