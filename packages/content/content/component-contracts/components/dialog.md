# Dialog

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/dialog/all.json`

## Purpose

Use Dialog when the user must confirm, review risk, or complete a focused decision before returning to the task.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Breakpoints`, `Focus`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.dialog.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.depth.*`, `sys.momentum.*`, `sys.state.*`, `sys.accessibility.*`

Gaps or review gates:

- Passive feedback
- Fake controls
- No focus restoration
- Unclear consequence
- Raw visual values
- Ask before build: The action can be canceled by overlay or Escape.
- Ask before build: The decision may be handled inline or in a Drawer instead.
- Ask before build: The content requires form fields or complex review.

## Use When

- Use Dialog for required confirmation.
- Use destructive tone for irreversible or high-risk changes.
- Keep one primary and one safe secondary action.

## Do Not Use Without Review

- Ask before use when the action can be canceled by overlay or Escape.
- Ask before use when the decision may be handled inline or in a Drawer instead.
- Ask before use when the content requires form fields or complex review.
- Dialog is passive feedback.
- Actions are fake or ambiguous.
- Focus, Escape, close, or reduced-motion behavior is undefined.
- Dialog is used for passive feedback.
- The close or action controls do not work.
- The panel stretches like a page section.
- Copy hides the consequence.
- Raw color, radius, shadow, or duration values are used.

## Operational Example

Use Dialog when the user must confirm, review risk, or complete a focused decision before returning to the task.

### Why Dialog

- Dialog blocks the background only when the next decision changes risk, access, money, or data.
- The surface, overlay, close affordance, and motion follow the ZIP overlay reference while Design System owns tokens.
- Demos must close and reopen so the documentation does not show fake actions.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Overlay | Dims and blurs the task behind a required decision. | comp.dialog.*, sys.depth.*, sys.momentum.* |
| Surface | Centers the focused decision with radius, padding, border, and shadow. | comp.dialog.*, sys.frame.*, sys.energy.* |
| Title and message | Name the decision and consequence in direct language. | sys.voice.*, sys.tone.* |
| Icon | Signals severity or event type without replacing the title. | sys.symbol.*, sys.iconography.*, sys.energy.* |
| Actions | Expose one primary outcome, one safe secondary path, and optional close. | sys.state.*, sys.accessibility.* |

## Accessibility

State precedence: closing, open, focus, default, closed

- Use role dialog with aria-modal true and an accessible title.
- Move focus into the dialog when it opens and restore focus to the trigger when it closes.
- Escape and overlay click may dismiss only when the action is safe to cancel.
- Keep primary and secondary actions reachable by keyboard.
- Never use Dialog for passive feedback; use Toast or Alert Strip instead.

## Foundations

Referenced token families:

- `comp.dialog.*`
- `sys.accessibility.*`
- `sys.depth.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.iconography.*`
- `sys.momentum.*`
- `sys.state.*`
- `sys.symbol.*`
- `sys.tone.*`
- `sys.voice.*`

Dialog API exposes title, description, tone, variant, lifecycle, close behavior, and actions while Design System foundations own overlay, surface, motion, voice, focus, and state.

## Variants

Dialog variants describe the decision job: confirmation, destructive confirmation, form, review, and success acknowledgement.

Approved variants from demos: `confirmation`, `destructive`, `form`, `review`, `success`

Demo labels:

- Freeze card?
- Delete rule?
- Invite driver
- Review changes
- Rules applied

## States

Dialog states track lifecycle and focus: closed is unmounted, open is blocking, focus shows keyboard position, closing exits with motion, and default is ready but not shown.

Supported states from docs: `open`, `focus`, `closing`, `closed`, `default`

## Variant X State Behavior

Variant defines the decision job; state defines lifecycle and keyboard behavior. Dialog should stay scarce and intentional.

State matrix: `open`, `focus`, `closing`, `default`, `closed`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Confirmation | confirmation |  |
| Form | form |  |
| Review | review |  |

## Full Width

Dialog uses a full-screen overlay while the decision surface keeps a readable width. Do not stretch the panel to the page.

- Centered decision: layout: overlay center
- Review decision: layout: overlay center
- Safe closed state: layout: trigger only

## Responsive Layout Patterns

Dialog remains centered on roomy viewports and becomes a near-full-width decision surface on phones while actions stack.

| Example | Layout | Density |
| --- | --- | --- |
| Phone confirmation | simple-demo-row | lg |
| Desktop review | simple-demo-row | sm |

## Viewport Organization

Use Dialog only when the task must pause. If the user can continue working, choose Drawer, Toast, or Inline Validation.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Use a near-full-width surface and stack actions. | centered modal | lg |
| Tablet | Keep the panel centered and leave overlay breathing room. | centered modal | md |
| Desktop | Use compact width and clear focus restoration. | focused overlay | sm |

## Playground

Use the playground to verify title, consequence copy, tone, lifecycle, icon, and whether close behavior is safe.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Freeze card? |  |
| description | text | The driver will not be able to use this card until it is reactivated. |  |
| tone | select | danger | neutral, info, success, danger |
| variant | select | confirmation | confirmation, destructive, form, review, success |
| state | select | open | open, focus, closing, default, closed |

## API And Foundations

Dialog API exposes title, description, tone, variant, lifecycle, close behavior, and actions while Design System foundations own overlay, surface, motion, voice, focus, and state.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | Yes | Dialog title. |
| description | string | No | Dialog description. |
| triggerLabel | string | No | Dialog trigger label. |
| actions | Action[] | No | Dialog actions. |
| open | boolean | No | Initial or controlled open state. |
| tone | DialogTone | No | Dialog tone. |
| id | string | No | Stable dialog id. |
| onOpenChange | (open: boolean) => void | No | Called when local open state changes. |
| onAction | (action: Action) => void | No | Called when an action is selected. |
| variant | DialogVariant | No | Decision job: confirmation, destructive, form, review, or success. |
| state | DialogState | No | Lifecycle state: open, focus, closing, default, or closed. |
| density | sm \| md \| lg | No | Inherited Flow density for trigger, close, actions, panel, and fields. |
| icon | string | No | Optional Material Symbol override for the tone icon. |
| fields | InputProps[] | No | Optional short form fields rendered with Input inside the dialog body. |

## Implementation Checklist

- Provide `label`: Dialog title.
- Role dialog and aria-modal
- Initial focus and focus restoration
- Escape and close behavior
- Keyboard access to actions
- Reduced motion
- Phone action stacking

## Tests And Rejection Rules

Must test:

- Role dialog and aria-modal
- Initial focus and focus restoration
- Escape and close behavior
- Keyboard access to actions
- Reduced motion
- Phone action stacking

Reject if:

- Dialog is used for passive feedback.
- The close or action controls do not work.
- The panel stretches like a page section.
- Copy hides the consequence.
- Raw color, radius, shadow, or duration values are used.

## MIEL

MIEL treats Dialog as a required decision surface: agents can propose it for risk, access, money, or destructive moments while humans confirm the consequence and exit rules.

Agents can decide:

- Use Dialog for required confirmation.
- Use destructive tone for irreversible or high-risk changes.
- Keep one primary and one safe secondary action.

Agents must ask:

- The action can be canceled by overlay or Escape.
- The decision may be handled inline or in a Drawer instead.
- The content requires form fields or complex review.

Agents must reject:

- Dialog is passive feedback.
- Actions are fake or ambiguous.
- Focus, Escape, close, or reduced-motion behavior is undefined.

Handoff language:

> I am using Dialog because the process must pause for a decision. Please confirm consequence copy, close rules, primary action, and focus restoration.
