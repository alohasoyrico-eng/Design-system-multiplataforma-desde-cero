# Tooltip

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/tooltip/all.json`

## Purpose

Use Tooltip for short contextual help that clarifies an icon, metric, disabled control, or unfamiliar operational term without moving the user away from the current task.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Breakpoints`, `Focus`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.tooltip.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.depth.*`, `sys.momentum.*`, `sys.state.*`, `sys.accessibility.*`

Gaps or review gates:

- Interactive content inside tooltip
- Required task instruction hidden in tooltip
- Pointer-only access
- Raw visual values
- Ask before build: The explanation is required for task completion.
- Ask before build: The layer needs actions, destinations, fields, images, or multiple paragraphs.
- Ask before build: The trigger has no stable accessible name or the placement could collide with critical UI.

## Use When

- Use Tooltip for one-sentence clarification of icons, metrics, disabled controls, and unfamiliar terms.
- Keep Tooltip non-interactive and anchored to one trigger.
- Prefer top or bottom placement unless the viewport gives enough side space.

## Do Not Use Without Review

- Ask before use when the explanation is required for task completion.
- Ask before use when the layer needs actions, destinations, fields, images, or multiple paragraphs.
- Ask before use when the trigger has no stable accessible name or the placement could collide with critical UI.
- Tooltip contains interactive content.
- Tooltip replaces inline helper text, validation, Toast, Popover, or Dialog.
- Tooltip is only available to pointer users.
- Tooltip copy is required to complete the task.
- Tooltip appears without a visible or focusable trigger.
- Tooltip uses raw color, shadow, spacing, or motion values.

## Operational Example

Use Tooltip for short contextual help that clarifies an icon, metric, disabled control, or unfamiliar operational term without moving the user away from the current task.

### Why Tooltip

- Tooltip clarifies a nearby object without becoming navigation or a decision surface.
- The trigger keeps the accessible name; the tooltip adds description.
- The message stays short enough to disappear safely on blur, escape, or pointer leave.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Trigger | Owns focus, hover, and aria-describedby connection. | sys.accessibility.*, sys.state.*, comp.tooltip.* |
| Bubble | Contains short explanatory text only. | comp.tooltip.*, sys.energy.*, sys.voice.*, sys.depth.* |
| Arrow | Points to the trigger when space allows and never replaces placement logic. | comp.tooltip.*, sys.frame.* |
| Placement | Positions the bubble near the trigger while avoiding viewport edges. | sys.frame.*, sys.growth.* |
| Motion | Uses a quick fade and lift that respects reduced motion. | sys.momentum.*, sys.state.* |

## Accessibility

State precedence: disabled, dismissed, open, focus, hover, default

- Connect the trigger and tooltip with aria-describedby when the tooltip is visible.
- Show on focus and hover; dismiss on blur, pointer leave, Escape, or scroll context changes.
- Keep tooltip content non-interactive; use Popover when the layer contains controls.
- Do not hide required instructions exclusively inside a tooltip.
- Keep the trigger accessible name independent from the tooltip copy.

## Foundations

Referenced token families:

- `comp.tooltip.*`
- `sys.accessibility.*`
- `sys.depth.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.growth.*`
- `sys.momentum.*`
- `sys.state.*`
- `sys.voice.*`

Tooltip API exposes trigger association, copy, placement, variant, state, delay, and optional icon while Design System foundations own layer color, motion, proximity, dismissal, and accessible description.

## Variants

Tooltip variants describe why the explanation appears: default helper copy, icon-only clarification, metric definitions, and disabled-control rationale.

Approved variants from demos: `default`, `icon-help`, `metric`, `disabled-help`

Demo labels:

- Shows expected fuel usage.
- Grid toggles layout columns.
- Cost per km includes toll and fuel movement data.
- Driver assignment is unavailable until a driver exists.

## States

Tooltip states are ephemeral. Default is hidden, hover and focus open the bubble, disabled-help explains unavailable controls, and reduced motion removes lift without removing clarity.

Supported states from docs: `default`, `hover`, `focus`, `open`, `disabled`, `dismissed`

## Variant X State Behavior

Variant defines the explanation purpose; state defines whether the bubble is visible. Tooltip never holds selection, input, or navigation state.

State matrix: `default`, `hover`, `focus`, `open`, `disabled`, `dismissed`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Default | default |  |
| Icon help | icon-help |  |
| Disabled help | disabled-help |  |

## Full Width

Tooltip does not stretch. The trigger follows its parent layout, while the bubble keeps a readable max width and wraps short copy.

- Inline icon help: layout: row
- Metric label: layout: row
- Disabled action: layout: row

## Responsive Layout Patterns

Responsive tooltip use depends on input mode: desktop can rely on hover and focus, while touch contexts need a visible trigger and may escalate to Popover for longer help.

| Example | Layout | Density |
| --- | --- | --- |
| Mobile explicit help | simple-demo-row | lg |
| Desktop toolbar help | simple-demo-row | sm |

## Viewport Organization

Keep tooltips close to the trigger and away from edges. When small viewports cannot guarantee readable placement, promote the explanation to inline helper text or Popover.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Use explicit help triggers and bottom placement when the anchor is near the topbar. | single anchored helper | lg |
| Tablet | Keep bubbles short and allow side placement only when the column has room. | anchored side helper | md |
| Desktop | Use hover and focus for dense toolbars, icon buttons, table headers, and metric definitions. | toolbar helpers | sm |

## Playground

Use the playground to verify short copy, trigger label, placement, variant, and visibility state before placing Tooltip in dense UI.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| trigger | text | Grid |  |
| label | text | Show layout columns. |  |
| placement | select | top | top, right, bottom, left |
| variant | select | icon-help | default, icon-help, metric, disabled-help |
| state | select | open | default, hover, focus, open, disabled, dismissed |

## API And Foundations

Tooltip API exposes trigger association, copy, placement, variant, state, delay, and optional icon while Design System foundations own layer color, motion, proximity, dismissal, and accessible description.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| triggerLabel | string | Yes | Trigger button label. |
| content | string | Yes | Tooltip content. |
| id | string | No | Stable tooltip id. |
| placement | TooltipPlacement | No | Tooltip placement. |
| onOpenChange | (open: boolean) => void | No | Called when local open state changes. |
| variant | TooltipVariant | No | Purpose variant: default, icon-help, metric, or disabled-help. |
| density | sm \| md \| lg | No | Controls trigger and bubble scale for sm, md, and lg contexts. |
| state | TooltipState | No | Visibility state for default, hover, focus, open, disabled, or dismissed. |
| disabled | boolean | No | Disables the trigger while keeping optional help visible when appropriate. |

## Implementation Checklist

- Provide `triggerLabel`: Trigger button label.
- Provide `content`: Tooltip content.
- Trigger has accessible name
- Tooltip is connected with aria-describedby when visible
- Hover and focus open the bubble
- Escape or blur dismisses the bubble
- Placement does not create viewport overflow
- Reduced motion removes lift animation

## Tests And Rejection Rules

Must test:

- Trigger has accessible name
- Tooltip is connected with aria-describedby when visible
- Hover and focus open the bubble
- Escape or blur dismisses the bubble
- Placement does not create viewport overflow
- Reduced motion removes lift animation

Reject if:

- Tooltip contains interactive content.
- Tooltip copy is required to complete the task.
- Tooltip appears without a visible or focusable trigger.
- Tooltip uses raw color, shadow, spacing, or motion values.

## MIEL

MIEL treats Tooltip as short contextual explanation attached to a trigger: agents can add it when the object is already understandable, while humans confirm whether the help should be visible inline, moved to Popover, or removed.

Agents can decide:

- Use Tooltip for one-sentence clarification of icons, metrics, disabled controls, and unfamiliar terms.
- Keep Tooltip non-interactive and anchored to one trigger.
- Prefer top or bottom placement unless the viewport gives enough side space.

Agents must ask:

- The explanation is required for task completion.
- The layer needs actions, destinations, fields, images, or multiple paragraphs.
- The trigger has no stable accessible name or the placement could collide with critical UI.

Agents must reject:

- Tooltip contains interactive content.
- Tooltip replaces inline helper text, validation, Toast, Popover, or Dialog.
- Tooltip is only available to pointer users.

Handoff language:

> I am using Tooltip for short contextual help. I need confirmation that the copy is optional, the trigger is accessible, and the message does not need a Popover or inline helper treatment.
