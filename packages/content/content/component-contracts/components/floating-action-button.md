# Floating Action Button

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/floating-action-button/all.json`

## Purpose

Use Floating Action Button for one primary contextual action that belongs to the current surface.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Breakpoints`, `Focus`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.floating-action-button.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.state.*`, `sys.momentum.*`, `sys.accessibility.*`

Gaps or review gates:

- FAB opens a speed dial.
- FAB contains more than one command.
- The icon has no accessible label.
- The button covers critical content.
- Ask before build: There are multiple competing actions.
- Ask before build: The surface has bottom navigation, sheets, or map controls that may be covered.
- Ask before build: The action has financial, safety, or irreversible consequences.

## Use When

- Use FAB for create, add movement, center map, scan receipt, or start route when it is the sole primary action.
- Use extended FAB when the label prevents ambiguity.
- Use loading only for the invoked action.

## Do Not Use Without Review

- Ask before use when there are multiple competing actions.
- Ask before use when the surface has bottom navigation, sheets, or map controls that may be covered.
- Ask before use when the action has financial, safety, or irreversible consequences.
- FAB opens a speed dial.
- FAB contains more than one command.
- The icon has no accessible label.
- The button covers critical content.

## Operational Example

Use Floating Action Button for one primary contextual action that belongs to the current surface.

### Why Floating Action Button

- Use Floating Action Button for one primary contextual action that belongs to the current surface.
- Floating Action Button does not fill containers; extended mode may grow to fit a concise label while preserving a single action.
- Use extended labels when ambiguity is risky, mini only in dense contexts, and avoid covering critical content on small screens.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Button surface | Circular or extended action target above the current surface. | sys.frame.*, comp.floating-action-button.* |
| Icon | Communicates the single action. | sys.symbol.* |
| Optional label | Clarifies extended actions without replacing aria-label. | sys.voice.* |
| Elevation | Separates the action from underlying content. | sys.depth.* |
| Focus and state | Shows keyboard focus, loading, pressed, and disabled states. | sys.state.*, sys.accessibility.* |

## Accessibility

State precedence: disabled, loading, pressed, focus, hover, default

- Provide a visible accessible label for the control.
- Expose current state and relationship through ARIA where applicable.
- Support keyboard focus and expected dismissal or selection keys.
- Do not rely on color alone for selected, warning, loading, or disabled state.
- Escalate to a pattern when orchestration exceeds one component.

## Foundations

Referenced token families:

- `comp.floating-action-button.*`
- `sys.accessibility.*`
- `sys.depth.*`
- `sys.frame.*`
- `sys.state.*`
- `sys.symbol.*`
- `sys.voice.*`

Floating Action Button API exposes label, icon, variant, state, position, and loading while Design System owns elevation, focus, and target size.

## Variants

Floating Action Button variants tune prominence and label treatment for one action; action sets and speed dials are patterns.

Approved variants from demos: `primary`, `accent`, `extended`, `mini`

Demo labels:

- Primary
- Accent
- Extended
- Mini

## States

Floating Action Button states communicate focus, pressed, loading, and disabled for a single command.

Supported states from docs: `default`, `hover`, `focus`, `pressed`, `loading`, `disabled`

## Variant X State Behavior

Variant defines action prominence; state defines readiness without expanding into multiple commands.

State matrix: `default`, `hover`, `focus`, `pressed`, `loading`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Primary | primary |  |
| Accent | accent |  |
| Extended | extended |  |

## Full Width

Floating Action Button does not fill containers; extended mode may grow to fit a concise label while preserving a single action.

- Form row: layout: button-stack
- Dense panel: layout: button-stack
- Mobile surface: layout: button-stack

## Responsive Layout Patterns

Use extended labels when ambiguity is risky, mini only in dense contexts, and avoid covering critical content on small screens.

| Example | Layout | Density |
| --- | --- | --- |
| Phone | button-stack | lg |
| Desktop | simple-demo-row | md |

## Viewport Organization

Viewport rules place the action where it is reachable and non-obstructive; they do not add secondary actions.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Use touch-safe targets and avoid covering critical content. | touch surface | lg |
| Tablet | Keep the component close to the surface it controls. | contextual panel | md |
| Desktop | Use compact density only when labels and focus remain visible. | work surface | sm |

## Playground

Use the playground to verify icon, label, variant, state, and whether the action remains single-purpose.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Floating Action Button |  |
| variant | select | primary | primary, accent, extended, mini |
| state | select | default | default, hover, focus, pressed, loading, disabled |
| fullWidth | checkbox | false |  |

## API And Foundations

Floating Action Button API exposes label, icon, variant, state, position, and loading while Design System owns elevation, focus, and target size.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | Yes | Accessible action label. |
| icon | IconName | No | Single action symbol. |
| variant | FloatingActionButtonVariant | No | Visual prominence and label treatment. |
| state | FloatingActionButtonState | No | Local interaction state. |
| density | "sm" \| "md" \| "lg" | No | Responsive target scale. |
| loading | boolean | No | Shows busy state for the invoked action. |
| type | "button" \| "submit" \| "reset" | No | Native button type. |
| extended | boolean | No | Shows the label beside the icon. |
| disabled | boolean | No | Disables the action. |

## Implementation Checklist

- Provide `label`: Accessible action label.
- Accessible label
- Target size
- Focus ring
- Loading state
- Safe-area placement
- Overlap check

## Tests And Rejection Rules

Must test:

- Accessible label
- Target size
- Focus ring
- Loading state
- Safe-area placement
- Overlap check

Reject if:

- FAB opens a speed dial.
- FAB contains more than one command.
- The icon has no accessible label.
- The button covers critical content.

## MIEL

MIEL treats Floating Action Button as one contextual high-prominence action. Agents may place it when the primary action is obvious, while humans confirm placement, label, overlap, and whether multiple actions require a pattern.

Agents can decide:

- Use FAB for create, add movement, center map, scan receipt, or start route when it is the sole primary action.
- Use extended FAB when the label prevents ambiguity.
- Use loading only for the invoked action.

Agents must ask:

- There are multiple competing actions.
- The surface has bottom navigation, sheets, or map controls that may be covered.
- The action has financial, safety, or irreversible consequences.

Agents must reject:

- FAB opens a speed dial.
- FAB contains more than one command.
- The icon has no accessible label.
- The button covers critical content.

Handoff language:

> I am using Floating Action Button for one contextual action. Please confirm label, icon, placement, safe-area overlap, loading behavior, and whether this should be a Quick Action pattern.
