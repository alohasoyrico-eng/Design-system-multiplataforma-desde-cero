# Text Area

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/text-area/operational-example.json`
- `packages/content/content/component-copy/components/text-area/anatomy.json`
- `packages/content/content/component-copy/components/text-area/accessibility.json`
- `packages/content/content/component-copy/components/text-area/variants.json`
- `packages/content/content/component-copy/components/text-area/states.json`
- `packages/content/content/component-copy/components/text-area/variant-state-behavior.json`
- `packages/content/content/component-copy/components/text-area/full-width.json`
- `packages/content/content/component-copy/components/text-area/responsive-layout-patterns.json`
- `packages/content/content/component-copy/components/text-area/viewport-organization.json`
- `packages/content/content/component-copy/components/text-area/playground.json`
- `packages/content/content/component-copy/components/text-area/guidelines.json`
- `packages/content/content/component-copy/components/text-area/api-foundations.json`
- `packages/content/content/component-copy/components/text-area/tests-rejection-rules.json`
- `packages/content/content/component-copy/components/text-area/miel.json`

## Purpose

Use Text Area when someone needs to write longer operational text with visible guidance, optional character count, and recovery.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Motion Curves`, `Duration`, `Density`, `Focus`, `Disabled`, `Message`

Component dependencies: `None declared`

Token dependencies: `comp.text-area.*`, `sys.energy.*`, `sys.voice.*`, `sys.frame.*`, `sys.state.*`, `sys.momentum.*`, `sys.accessibility.*`

Reference translation: Adapt - The ZIP reference gives the visual benchmark: full-width multiline surface, 12 by 16 padding, vertical resize, optional bottom-right counter, and fast focus/error transitions. Design System owns tokens, density, state, and accessibility semantics.

Gaps or review gates:

- Label is missing or only placeholder exists.
- Counter replaces validation.
- Rich text behavior is added to the base component.
- Raw color, spacing, radius, or motion bypasses tokens.
- Ask before build: The audience, privacy, retention, or review owner is unknown.
- Ask before build: The text affects compliance, money, permissions, identity, or audit.
- Ask before build: The experience needs rich text, mentions, templates, autosave, or comment threads.

## Use When

- Use Text Area when the value is longer than a short field and may wrap across lines.
- Configure label, placeholder, helper, rows, maxLength, counter, density, and state.
- Use counter when length matters for review or downstream systems.

## Do Not Use Without Review

- Ask before use when the audience, privacy, retention, or review owner is unknown.
- Ask before use when the text affects compliance, money, permissions, identity, or audit.
- Ask before use when the experience needs rich text, mentions, templates, autosave, or comment threads.
- Placeholder is the only label.
- Counter is treated as validation.
- The agent adds rich text behavior to the base component.
- The field should be a short Input or closed-choice Select.
- Counter replaces validation.
- The base component includes rich text or mentions.
- Error or disabled hides the value.
- Rows or resize break layout on small viewports.

## Operational Example

Use Text Area when someone needs to write longer operational text with visible guidance, optional character count, and recovery.

### Why Text Area

- The value is longer than a short field and may wrap across lines.
- The helper clarifies audience, privacy, or review path.
- The counter helps control length without replacing validation.

Scenario type: `field-group`

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Field label | Names the long-form value and remains visible. | comp.text-area.label.*, sys.voice.* |
| Textarea surface | Holds multiline value, placeholder, rows, resize, focus, disabled, and error styles. | comp.text-area.surface.*, sys.energy.*, sys.frame.*, sys.state.*, sys.momentum.*, sys.accessibility.* |
| Support text | Explains purpose, privacy, format, or recovery. | comp.text-area.support.*, sys.voice.* |
| Character counter | Shows length progress when maxLength matters. | comp.text-area.counter.*, sys.voice.*, sys.energy.status.* |

## Accessibility

State precedence: disabled, loading, error, focus, filled, default

- Use a visible label associated with the textarea.
- Associate helper, counter, and error through describedby.
- Expose invalid state when validation fails.
- Keep value readable during loading and error.
- Disabled fields remain readable and block editing.

## Foundations

Referenced token families:

- `comp.text-area.*`
- `sys.accessibility.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.momentum.*`
- `sys.state.*`
- `sys.voice.*`

Text Area API is for multiline free-form text. Rich text, mentions, templates, autosave, and comment threads belong to future patterns.

## Variants

Variants describe multiline input condition and supporting metadata. They do not introduce rich text, mentions, or comment-thread behavior.

Approved variants from demos: `default`, `filled`, `with-counter`, `error`

Demo labels:

- Default
- Filled
- With counter
- Error

## States

States communicate editability, progress, validation, and value condition while preserving the multiline value.

Supported states from docs: `default`, `focus`, `filled`, `loading`, `error`, `disabled`

## Variant X State Behavior

Variant x state behavior preserves typed content. Error changes recovery, disabled blocks editing, and loading keeps the value visible.

State matrix: `default`, `focus`, `filled`, `loading`, `error`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Driver notes |  |  |
| Dispute reason |  |  |
| Policy exception |  |  |

## Full Width

Text Area is usually full-width inside its form region. The surface fills the container while rows, resize, helper, and counter remain stable.

- Natural form width: layout: stack-natural
- Long review: layout: stack-natural
- Responsive containers: layout: container

## Responsive Layout Patterns

Responsive demos keep the label, helper, counter, and resize behavior visible without compressing the multiline value.

| Example | Layout | Density |
| --- | --- | --- |
| Phone form | button-stack | lg |
| Desktop panel | card-mini-grid | md |
| Compact note | button-stack natural | sm |

## Viewport Organization

Viewport organization protects long text: avoid narrow side-by-side fields on small screens, keep counters visible, and let the textarea fill its form region.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Mobile notes | Use full-width rows and enough visible lines for touch editing. |  | lg |
| Review panels | Use medium density and preserve helper/counter near the field. |  | md |
| Dense support | Compact rows need short helper copy and cannot hide the counter. |  | sm |

## Playground

Use the playground to verify label, value, rows, max length, counter, density, and state before moving long-form text into a system.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Driver notes |  |
| value | text | Customer requests child seat. |  |
| state | select | filled | default, focus, filled, loading, error, disabled |
| density | select | md | sm, md, lg |

## API And Foundations

Text Area API is for multiline free-form text. Rich text, mentions, templates, autosave, and comment threads belong to future patterns.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | yes | Visible label. |
| value | string | yes | Controlled multiline value. |
| placeholder | string | no | Hint, never the only label. |
| helperText | string | no | Guidance or recovery copy. |
| rows | number | no | Visible row count. |
| maxLength | number | no | Shows character counter. |
| error | string | no | Validation message. |
| disabled | boolean | no | Blocks editing. |
| onChange | (value: string) => void | yes | Reports the next value. |

## Implementation Checklist

- Provide `label`: Visible label.
- Provide `value`: Controlled multiline value.
- Provide `onChange`: Reports the next value.
- Visible label and multiline semantics
- Typing and resize behavior
- Counter updates with maxLength
- Helper and error association
- Disabled blocks editing
- Responsive width without overflow

## Tests And Rejection Rules

Must test:

- Visible label and multiline semantics
- Typing and resize behavior
- Counter updates with maxLength
- Helper and error association
- Disabled blocks editing
- Responsive width without overflow

Reject if:

- Placeholder is the only label.
- Counter replaces validation.
- The base component includes rich text or mentions.
- Error or disabled hides the value.
- Rows or resize break layout on small viewports.

## MIEL

MIEL treats Text Area as the contract for longer free-form text: the agent can configure multiline input, while the human owns audience, privacy, validation, and risk.

Agents can decide:

- Use Text Area when the value is longer than a short field and may wrap across lines.
- Configure label, placeholder, helper, rows, maxLength, counter, density, and state.
- Use counter when length matters for review or downstream systems.

Agents must ask:

- The audience, privacy, retention, or review owner is unknown.
- The text affects compliance, money, permissions, identity, or audit.
- The experience needs rich text, mentions, templates, autosave, or comment threads.

Agents must reject:

- Placeholder is the only label.
- Counter is treated as validation.
- The agent adds rich text behavior to the base component.
- The field should be a short Input or closed-choice Select.

Handoff language:

> I am using Text Area because the user needs longer free-form text. I need confirmation on audience, privacy, max length, validation, and whether richer writing behavior should become a pattern.
