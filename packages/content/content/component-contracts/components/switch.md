# Switch

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/switch/operational-example.json`
- `packages/content/content/component-copy/components/switch/anatomy.json`
- `packages/content/content/component-copy/components/switch/accessibility.json`
- `packages/content/content/component-copy/components/switch/variants.json`
- `packages/content/content/component-copy/components/switch/states.json`
- `packages/content/content/component-copy/components/switch/variant-state-behavior.json`
- `packages/content/content/component-copy/components/switch/full-width.json`
- `packages/content/content/component-copy/components/switch/responsive-layout-patterns.json`
- `packages/content/content/component-copy/components/switch/viewport-organization.json`
- `packages/content/content/component-copy/components/switch/playground.json`
- `packages/content/content/component-copy/components/switch/guidelines.json`
- `packages/content/content/component-copy/components/switch/api-foundations.json`
- `packages/content/content/component-copy/components/switch/tests-rejection-rules.json`
- `packages/content/content/component-copy/components/switch/miel.json`

## Purpose

Use Switch when a setting turns on or off immediately and the new state persists.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Density`, `Focus`, `Disabled`, `Message`

Component dependencies: `None declared`

Token dependencies: `comp.switch.*`, `sys.energy.*`, `sys.voice.*`, `sys.frame.*`, `sys.depth.*`, `sys.state.*`, `sys.momentum.*`, `sys.accessibility.*`

Reference translation: Adapt - The ZIP reference defines the visual benchmark: 48 by 28 track, expanding thumb on press, clear on/off color, and spring feedback. Design System owns color, type, density, state, motion, and accessibility semantics.

Gaps or review gates:

- It has no visible label.
- The value does not persist or has no immediate effect.
- It replaces Checkbox in multi-select lists.
- Motion or color bypasses Design System tokens.
- Ask before build: The setting affects money, permissions, compliance, automatic approvals, or notifications.
- Ask before build: The effect is delayed, requires Save, or does not persist.
- Ask before build: The label needs legal, policy, risk, or operational wording.

## Use When

- Use Switch when a setting persists immediately after it changes.
- Set off, on, focus, pressed, error, and disabled when product logic is explicit.
- Place rows in settings, configuration, or inspector surfaces when the setting group already exists.

## Do Not Use Without Review

- Ask before use when the setting affects money, permissions, compliance, automatic approvals, or notifications.
- Ask before use when the effect is delayed, requires Save, or does not persist.
- Ask before use when the label needs legal, policy, risk, or operational wording.
- Switch is used for a one-time action instead of a persistent setting.
- The value does not persist or needs a separate submit action.
- The control replaces Checkbox for multi-select or consent.
- Disabled or error state lacks explanation.
- The switch has no visible label.
- The value does not persist.
- It replaces Checkbox in multi-select lists.
- The track or thumb changes size unpredictably.
- Motion bypasses Momentum tokens.

## Operational Example

Use Switch when a setting turns on or off immediately and the new state persists.

### Why Switch

- The setting has a persistent on/off value.
- The label describes what becomes active.
- The thumb motion confirms direct manipulation.

Scenario type: `settings-list`

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Setting label | Names the active outcome of the setting. | comp.switch.label.*, sys.voice.*, sys.energy.text.* |
| Track | Shows on/off, focus, error, and disabled state without changing size. | comp.switch.track.*, sys.energy.*, sys.state.*, sys.frame.* |
| Thumb | Moves with spring and stretches on press to show direct manipulation. | comp.switch.thumb.*, sys.momentum.*, sys.depth.* |
| Support text | Explains consequence, policy, or recovery only when needed. | comp.switch.support.*, sys.voice.*, sys.accessibility.* |

## Accessibility

State precedence: disabled, error, pressed, focus, on, off

- Use role switch and expose checked state.
- Associate every switch with a visible label.
- Support keyboard focus and Space toggling.
- Keep focus visible around the track.
- Do not rely on color alone for on/off state.
- Associate error or policy text when present.

## Foundations

Referenced token families:

- `comp.switch.*`
- `sys.accessibility.*`
- `sys.depth.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.momentum.*`
- `sys.state.*`
- `sys.voice.*`

Switch API exposes persistent on/off value, support text, validation, and disabled behavior while Design System foundations own styling.

## Variants

Variants describe the settings row around the same on/off control. They do not change switch semantics.

Approved variants from demos: `default`, `descriptive`, `compact`, `critical`

Demo labels:

- Send driver alerts
- Balance notifications
- Offline mode
- Auto-approve fuel stops

## States

States communicate value, focus, press, validation, and disabled behavior while preserving the label.

Supported states from docs: `off`, `on`, `focus`, `pressed`, `error`, `disabled`

## Variant X State Behavior

Variant and state combine without changing precedence: disabled wins first, then error, pressed, focus, on, and off.

State matrix: `off`, `on`, `focus`, `pressed`, `error`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Default |  |  |
| Descriptive |  |  |
| Critical |  |  |

## Full Width

Switch rows may fill the available width, but the track keeps its fixed size and the label owns the remaining space.

- Phone setting: layout: stack
- Inspector row: layout: natural
- Settings group: layout: container

## Responsive Layout Patterns

Responsive layout changes the settings row, not the on/off meaning or state priority.

| Example | Layout | Density |
| --- | --- | --- |
| Narrow settings | button-stack | lg |
| Wide configuration | container-demo | md |

## Viewport Organization

Organize Switch rows by setting context: stack on narrow screens, align with configuration rows on wide screens, and keep track size stable.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Use full-width rows with large density. |  | lg |
| Tablet | Group related settings before moving into columns. |  | md |
| Desktop | Align with inspector rows and keep labels readable. |  | md |

## Playground

Use the playground to confirm label, support text, density, on/off value, and state before placing Switch in a settings system.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Send driver alerts |  |
| checked | checkbox | true |  |
| state | select | on | off, on, focus, pressed, error, disabled |
| density | select | md | sm, md, lg |

## API And Foundations

Switch API exposes persistent on/off value, support text, validation, and disabled behavior while Design System foundations own styling.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | Yes | Visible setting text. |
| checked | boolean | Yes | On/off value. |
| description | string | No | Support text under the label. |
| error | string | No | Validation or policy message. |
| disabled | boolean | No | Blocks interaction. |
| required | boolean | No | Marks a required setting. |
| onChange | (checked: boolean) => void | Yes | Reports the next value. |

## Implementation Checklist

- Provide `label`: Visible setting text.
- Provide `checked`: On/off value.
- Provide `onChange`: Reports the next value.
- Visible label and role switch
- Space toggles value
- On/off state is announced
- Focus is visible
- Disabled cannot toggle
- Error text is associated

## Tests And Rejection Rules

Must test:

- Visible label and role switch
- Space toggles value
- On/off state is announced
- Focus is visible
- Disabled cannot toggle
- Error text is associated

Reject if:

- The switch has no visible label.
- The value does not persist.
- It replaces Checkbox in multi-select lists.
- The track or thumb changes size unpredictably.
- Motion bypasses Momentum tokens.

## MIEL

MIEL treats Switch as a persistent on/off setting contract: the agent can configure state and placement, while the human owns meaning, policy, risk, and whether the effect is immediate.

Agents can decide:

- Use Switch when a setting persists immediately after it changes.
- Set off, on, focus, pressed, error, and disabled when product logic is explicit.
- Place rows in settings, configuration, or inspector surfaces when the setting group already exists.

Agents must ask:

- The setting affects money, permissions, compliance, automatic approvals, or notifications.
- The effect is delayed, requires Save, or does not persist.
- The label needs legal, policy, risk, or operational wording.

Agents must reject:

- Switch is used for a one-time action instead of a persistent setting.
- The value does not persist or needs a separate submit action.
- The control replaces Checkbox for multi-select or consent.
- Disabled or error state lacks explanation.

Handoff language:

> I am using Switch because this is a persistent setting with an immediate on/off value. I need confirmation on what on means, when it takes effect, and whether risk requires review.
