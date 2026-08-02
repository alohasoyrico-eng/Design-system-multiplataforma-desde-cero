# Popover

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/popover/all.json`

## Purpose

Use Popover for short anchored context or local actions when Tooltip is too small and Dialog is too heavy.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Breakpoints`, `Focus`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.popover.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.state.*`, `sys.momentum.*`, `sys.accessibility.*`

Gaps or review gates:

- Popover contains a multi-step process.
- Panel is detached from its trigger.
- Dismissal behavior is undefined.
- Required content is hidden without fallback.
- Ask before build: The content has multiple steps, long text, search, or complex forms.
- Ask before build: The panel affects critical financial or safety decisions.
- Ask before build: Placement may collide with navigation, maps, or sticky controls.

## Use When

- Use Popover for short contextual panels, local actions, metric explanations, and small anchored forms.
- Escalate to Bottom Sheet on mobile when content needs more space.
- Keep trigger, panel label, and dismissal rules explicit.

## Do Not Use Without Review

- Ask before use when the content has multiple steps, long text, search, or complex forms.
- Ask before use when the panel affects critical financial or safety decisions.
- Ask before use when placement may collide with navigation, maps, or sticky controls.
- Popover contains a multi-step process.
- Panel is detached from its trigger.
- Dismissal behavior is undefined.
- Required content is hidden without fallback.

## Operational Example

Use Popover for short anchored context or local actions when Tooltip is too small and Dialog is too heavy.

### Why Popover

- Use Popover for short anchored context or local actions when Tooltip is too small and Dialog is too heavy.
- Popover can align to a full-width trigger on forms, but the panel remains short, anchored, and dismissible.
- On small touch viewports, keep content short or escalate to Bottom Sheet when the panel needs room.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Trigger | Visible control that owns aria-expanded and opens the panel. | sys.accessibility.* |
| Panel | Anchored surface with short contextual content. | sys.depth.*, comp.popover.* |
| Placement | Keeps the panel visually connected to its trigger. | sys.frame.* |
| Content | Uses concise text and optional local actions only. | sys.voice.* |
| Dismissal | Closes on Escape, outside interaction, or completed local action. | sys.state.* |

## Accessibility

State precedence: disabled, warning, open, focus, hover, closed

- Provide a visible accessible label for the control.
- Expose current state and relationship through ARIA where applicable.
- Support keyboard focus and expected dismissal or selection keys.
- Do not rely on color alone for selected, warning, loading, or disabled state.
- Escalate to a pattern when orchestration exceeds one component.

## Foundations

Referenced token families:

- `comp.popover.*`
- `sys.accessibility.*`
- `sys.depth.*`
- `sys.frame.*`
- `sys.state.*`
- `sys.voice.*`

Popover API exposes trigger, open state, placement, variant, state, and dismiss behavior while Design System owns focus, depth, and responsive escalation.

## Variants

Popover variants describe anchored contextual surfaces; persistent panels, long forms, and option layers belong to other components or patterns.

Approved variants from demos: `information`, `action`, `form`, `metric`

Demo labels:

- Information
- Action
- Form
- Metric

## States

Popover states define closed, open, focus, warning, and disabled behavior around the trigger-panel pair.

Supported states from docs: `closed`, `open`, `hover`, `focus`, `warning`, `disabled`

## Variant X State Behavior

Variant controls content shape; state controls visibility and priority without creating a process.

State matrix: `closed`, `open`, `hover`, `focus`, `warning`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Information | information |  |
| Action | action |  |
| Form | form |  |

## Full Width

Popover can align to a full-width trigger on forms, but the panel remains short, anchored, and dismissible.

- Form row: layout: button-stack
- Dense panel: layout: button-stack
- Mobile surface: layout: button-stack

## Responsive Layout Patterns

On small touch viewports, keep content short or escalate to Bottom Sheet when the panel needs room.

| Example | Layout | Density |
| --- | --- | --- |
| Phone | button-stack | lg |
| Desktop | simple-demo-row | md |

## Viewport Organization

Viewport rules decide placement and escalation; Popover remains contextual, not persistent workspace.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Use touch-safe targets and avoid covering critical content. | touch surface | lg |
| Tablet | Keep the component close to the surface it controls. | contextual panel | md |
| Desktop | Use compact density only when labels and focus remain visible. | work surface | sm |

## Playground

Use the playground to verify trigger copy, variant, state, placement, and short content boundaries.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Popover |  |
| variant | select | information | information, action, form, metric |
| state | select | open | closed, open, hover, focus, warning, disabled |
| fullWidth | checkbox | false |  |

## API And Foundations

Popover API exposes trigger, open state, placement, variant, state, and dismiss behavior while Design System owns focus, depth, and responsive escalation.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| triggerLabel | string | No | Popover trigger label. |
| title | string | No | Popover title. |
| description | string | No | Popover body copy. |
| id | string | No | Stable popover id. |
| open | boolean | No | Initial or controlled open state. |
| variant | "information" \| "action" \| "form" \| "metric" | No | Contextual content shape. |
| state | "closed" \| "open" \| "hover" \| "focus" \| "warning" \| "disabled" | No | Visual and interaction state. |
| placement | "top" \| "right" \| "bottom" \| "left" | No | Panel placement relative to trigger. |
| density | "sm" \| "md" \| "lg" | No | Flow density inherited from context. |
| fullWidth | boolean | No | Allows the trigger to align to a form row while keeping the panel contextual. |
| disabled | boolean | No | Disables the trigger and panel opening. |
| actions | Array<{ label: string, variant?: string, key?: string }> | No | Optional local actions rendered with Button. |
| field | { label?: string, value?: string, placeholder?: string, helper?: string } | No | Optional one-field local edit rendered with Input. |
| onOpenChange | (open: boolean) => void | No | Called when local open state changes. |
| onAction | (key: string) => void | No | Called when a local action is selected. |

## Implementation Checklist

- Set `label` as a documented control.
- Set `variant` as a documented control. Options: information, action, form, metric.
- Set `state` as a documented control. Options: closed, open, hover, focus, warning, disabled.
- Set `fullWidth` as a documented control.
- Trigger aria-expanded
- Panel role and label
- Escape dismissal
- Focus return
- Viewport collision
- Mobile escalation

## Tests And Rejection Rules

Must test:

- Trigger aria-expanded
- Panel role and label
- Escape dismissal
- Focus return
- Viewport collision
- Mobile escalation

Reject if:

- Popover contains a multi-step process.
- Panel is detached from its trigger.
- Dismissal behavior is undefined.
- Required content is hidden without fallback.

## MIEL

MIEL treats Popover as anchored contextual disclosure. Agents may place it for short help or local actions, while humans confirm focus, dismissal, placement, and whether the content should escalate to a pattern.

Agents can decide:

- Use Popover for short contextual panels, local actions, metric explanations, and small anchored forms.
- Escalate to Bottom Sheet on mobile when content needs more space.
- Keep trigger, panel label, and dismissal rules explicit.

Agents must ask:

- The content has multiple steps, long text, search, or complex forms.
- The panel affects critical financial or safety decisions.
- Placement may collide with navigation, maps, or sticky controls.

Agents must reject:

- Popover contains a multi-step process.
- Panel is detached from its trigger.
- Dismissal behavior is undefined.
- Required content is hidden without fallback.

Handoff language:

> I am using Popover for anchored contextual content. Please confirm trigger label, placement, dismissal, focus return, mobile escalation, and that this is not a persistent detail pattern.
