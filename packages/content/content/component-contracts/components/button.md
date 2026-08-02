# Button

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/button/operational-example.json`
- `packages/content/content/component-copy/components/button/anatomy.json`
- `packages/content/content/component-copy/components/button/accessibility.json`
- `packages/content/content/component-copy/components/button/variants.json`
- `packages/content/content/component-copy/components/button/states.json`
- `packages/content/content/component-copy/components/button/variant-state-behavior.json`
- `packages/content/content/component-copy/components/button/full-width.json`
- `packages/content/content/component-copy/components/button/responsive-layout-patterns.json`
- `packages/content/content/component-copy/components/button/viewport-organization.json`
- `packages/content/content/component-copy/components/button/playground.json`
- `packages/content/content/component-copy/components/button/miel.json`

## Purpose

Show the decision the button makes possible: action, consequence, loading path, and recovery context.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Density`, `Focus`, `Loading`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.button.*`, `sys.energy.*`, `sys.voice.*`, `sys.frame.*`, `sys.state.*`, `sys.momentum.*`, `sys.a11y.*`, `sys.symbol.*`, `sys.growth.*`

Reference translation: Adapt - Use the reference Button documentation model: spec, live demos, anatomy, accessibility, playground, API, guidelines, and tests. Do not copy vendor prefixes, Storybook dependency, generic examples, or unrelated naming.

Gaps or review gates:

- No visible label or accessible name.
- More than one primary action in the same decision group without rationale.
- Danger or warning action lacks clear consequence copy nearby.
- Loading state looks identical to disabled.
- Icon replaces the label.
- Raw hex, px, ms, shadow, or icon glyph appears in the public contract.
- Growth metadata changes the visual appearance of the button.
- Any foundation coverage is partial, missing, or token-only.
- Viewport adaptation relies on breakpoints without density/context rules.
- Button exposes public size as an independent scale decision.
- Icon color diverges from label color in filled danger or warning states.
- Secondary and outlined are visually indistinguishable.
- Primary Button does not use action-primary, or secondary/outlined Button uses filled blue action color.
- Ask before build: The consequence, recovery path, analytics event, or permission rule is unknown.
- Ask before build: The action is destructive, financial, irreversible, or changes access.
- Ask before build: The request needs a new system, confirmation pattern, service behavior, variant, or token.

## Use When

- Choose Button when the user is triggering one immediate action.
- Select variant, intent, icon, loading, disabled, and full-width behavior from the existing contract.
- Write verb-first labels when the action outcome is already clear.

## Do Not Use Without Review

- Ask before use when the consequence, recovery path, analytics event, or permission rule is unknown.
- Ask before use when the action is destructive, financial, irreversible, or changes access.
- Ask before use when the request needs a new system, confirmation pattern, service behavior, variant, or token.
- The label is vague, noun-only, or hides the result.
- Disabled or loading state appears without reason or recovery.
- Danger or warning is used as decoration instead of semantic risk.
- The agent invents a new variant, token, or motion rule.

## Operational Example

Show the decision the button makes possible: action, consequence, loading path, and recovery context.

### Why Button

- The main decision is explicit in the confirmation group.
- Danger intent is used because the action blocks card usage.
- Loading prevents duplicate activation while the service responds.

Scenario type: `button-decision`

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| button element | Native button with default type button. | comp.button.*, sys.energy.*, sys.frame.*, sys.momentum.*, sys.a11y.*, sys.symbol.*, sys.growth.* |
| label | Visible label remains the accessible name. | sys.voice.* |
| state layer | State resolves before visual styling. | sys.state.* |

## Accessibility

State precedence: disabled, loading, pressed, focus, hover, default

- Native button role and keyboard activation.
- Visible label is required and remains the accessible name.
- Focus-visible ring must be clear in normal and forced-colors modes.
- Loading uses aria-busy and blocks duplicate activation.
- Disabled state must explain unavailability in the surrounding UI.

## Foundations

Referenced token families:

- `comp.button.*`
- `sys.a11y.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.growth.*`
- `sys.momentum.*`
- `sys.state.*`
- `sys.symbol.*`
- `sys.voice.*`

## Variants

Variant controls hierarchy with action energy: primary is action-primary blue, secondary is white with neutral 900 outline, and outlined is white with neutral 200 outline. Intent controls semantic risk.

Approved variants from demos: `primary`, `secondary`, `tertiary`, `outlined`, `ghost`

Demo labels:

- Primary
- Secondary
- Tertiary
- Trailing icon
- Outlined
- Ghost
- Danger
- Warning

## States

States tell the user whether the system can act, is acting, rejected the action, or needs recovery.

Supported states from docs: `default`, `hover`, `focus`, `pressed`, `disabled`, `loading`

## Variant X State Behavior

Disabled and loading keep hierarchy and risk visible. They cannot collapse into a generic opacity treatment.

State matrix: `default`, `hover`, `pressed`, `disabled`, `loading`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Primary |  |  |
| Secondary |  |  |
| Outlined |  |  |
| Ghost |  |  |
| Danger |  |  |
| Warning |  |  |

## Full Width

Full-width buttons are for constrained mobile surfaces, confirmation sheets, and stacked action areas. Desktop tables and dashboards should prefer natural width or aligned action rows.

- Natural width: layout: stack-natural
- Mobile sheet: layout: stack
- Responsive containers: layout: container

## Responsive Layout Patterns

Show how actions compose in real surfaces: toolbars, step flows, and danger zones.

| Example | Layout | Density |
| --- | --- | --- |
| Fleet table toolbar | action-layout three |  |
| Onboarding step | action-layout split |  |
| Danger zone | action-layout two |  |

## Viewport Organization

Organize actions around the user's context. Do not shrink a desktop action row and call it responsive.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Smartphones + phablets | Prioritize task completion, thumb reach, stacked actions, full-width buttons, and explicit loading or disabled reasons. | One column · primary action below content · secondary action beneath or as text/ghost. | lg |
| Tablets + laptops | Use grouped action rows, preserve scanning, and keep primary/secondary relationship visible without forcing every action full-width. | Two to three columns · action rows aligned to the task group · compact state matrix remains readable. | md |
| Desktops + TV | Optimize for distance, dashboards, command surfaces, and clear hierarchy; avoid tiny controls and dense action clusters. | Wide scan · persistent toolbars · larger touch/click targets when viewed at distance. | lg |

## Playground

Inspect the Button contract through preview, DOM attributes, and warnings in one place.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Save driver |  |
| variant | select | primary | primary, secondary, tertiary, outlined, ghost |
| intent | select | default | default, danger, warning |
| state | select | default | default, hover, focus, pressed, disabled, loading |
| icon | select | save | none, save, block, route, download, warning, check_circle |
| fullWidth | checkbox | false |  |

## Implementation Checklist

- Set `label` as a documented control.
- Set `variant` as a documented control. Options: primary, secondary, tertiary, outlined, ghost.
- Set `intent` as a documented control. Options: default, danger, warning.
- Set `state` as a documented control. Options: default, hover, focus, pressed, disabled, loading.
- Set `icon` as a documented control. Options: none, save, block, route, download, warning, check_circle.
- Set `fullWidth` as a documented control.

## MIEL

MIEL turns Button into a delegable action decision: the agent can assemble hierarchy, state, and affordance, while the human owns consequence, risk, and recovery.

Agents can decide:

- Choose Button when the user is triggering one immediate action.
- Select variant, intent, icon, loading, disabled, and full-width behavior from the existing contract.
- Write verb-first labels when the action outcome is already clear.

Agents must ask:

- The consequence, recovery path, analytics event, or permission rule is unknown.
- The action is destructive, financial, irreversible, or changes access.
- The request needs a new system, confirmation pattern, service behavior, variant, or token.

Agents must reject:

- The label is vague, noun-only, or hides the result.
- Disabled or loading state appears without reason or recovery.
- Danger or warning is used as decoration instead of semantic risk.
- The agent invents a new variant, token, or motion rule.

Handoff language:

> I am using Button because this is one immediate action. I need confirmation on consequence, recovery copy, and whether the action requires audit or permission handling.
