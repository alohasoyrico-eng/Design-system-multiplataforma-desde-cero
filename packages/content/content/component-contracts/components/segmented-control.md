# Segmented Control

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/segmented-control/all.json`

## Purpose

Use Segmented Control to switch one local, mutually exclusive mode while keeping the user in the same task context.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Breakpoints`, `Focus`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.segmented-control.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.state.*`, `sys.momentum.*`, `sys.accessibility.*`

Gaps or review gates:

- It changes routes or pages.
- It coordinates multiple filters.
- Segments rely on icons only.
- Selected state is color-only.
- Selected/current uses non-Flow color.
- Toolbar or compact is only documented but not implemented in package styles.
- Ask before build: The control changes page route, saved view, or dashboard query.
- Ask before build: The group needs more than one selected value.
- Ask before build: Labels cannot fit in the available viewport.

## Use When

- Use Segmented Control for view mode, chart mode, local layout density, or map/list switch.
- Keep each segment as a single option with visible text.
- Use warning only when the current mode has a policy or availability caveat.

## Do Not Use Without Review

- Ask before use when the control changes page route, saved view, or dashboard query.
- Ask before use when the group needs more than one selected value.
- Ask before use when labels cannot fit in the available viewport.
- It changes routes or pages.
- It coordinates multiple filters.
- Segments rely on icons only.
- Selected state is color-only.
- Selected/current uses non-Flow color.
- Toolbar or compact is only documented but not implemented in package styles.

## Operational Example

Use Segmented Control to switch one local, mutually exclusive mode while keeping the user in the same task context.

### Why Segmented Control

- Flow defines selected/current as action-primary and keeps the control local to one mutually exclusive mode.
- The ZIP/reference direction informs the more squared outline, compact geometry, indicator motion, and icon support.
- The visual distinction from Tabs comes from outline, low radius, shared border, and local mode semantics.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Container | Groups related exclusive options and owns the shared border. | sys.frame.*, comp.segmented-control.* |
| Segment | One selectable mode with visible label. | sys.voice.* |
| Selected indicator | Shows the active mode through Flow action-primary, outline contrast, low radius, and aria-selected. | sys.state.* |
| Optional icon | Supports recognition without replacing text. | sys.symbol.* |
| Focus ring | Marks keyboard focus on the active segment. | sys.accessibility.* |

## Accessibility

State precedence: disabled, warning, selected, focus, hover, default

- Provide a visible accessible label for the control.
- Expose current state and relationship through ARIA where applicable.
- Support keyboard focus and expected dismissal or selection keys.
- Do not rely on color alone for selected, warning, loading, or disabled state.
- Escalate to a pattern when orchestration exceeds one component.

## Foundations

Referenced token families:

- `comp.segmented-control.*`
- `sys.accessibility.*`
- `sys.frame.*`
- `sys.state.*`
- `sys.symbol.*`
- `sys.voice.*`

Segmented Control API exposes items, selectedKey, variant, state, density, and ariaLabel while Design System owns focus, spacing, and state precedence.

## Variants

Segmented Control variants define the local selection surface. Outlined is the default low-radius control; toolbar is denser for tool-adjacent surfaces; compact reduces width/target scale; icon-only is reserved for compact local choices with accessible labels. Cross-page navigation and dashboard filter bars remain patterns.

Approved variants from demos: `outlined`, `toolbar`, `compact`, `icon-only`

Demo labels:

- Outlined
- Toolbar
- Compact
- Icon Only

## States

Segmented Control states clarify selected, focus, warning, and disabled behavior for one exclusive group. Selected/current uses Flow action-primary with outline and indicator motion.

Supported states from docs: `default`, `hover`, `focus`, `selected`, `warning`, `disabled`

## Variant X State Behavior

Variant defines the shell; state defines a segment condition without changing the component into tabs or filters.

State matrix: `default`, `hover`, `focus`, `selected`, `warning`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Outlined | outlined |  |
| Toolbar | toolbar |  |
| Icon Only | icon-only |  |

## Full Width

Segmented Control may fill a form row or toolbar only when every segment remains readable and the group remains a single choice.

- Form row: layout: button-stack
- Dense panel: layout: button-stack
- Mobile surface: layout: button-stack

## Responsive Layout Patterns

Stack or compact segments on small viewports; do not let responsive behavior turn the control into navigation.

| Example | Layout | Density |
| --- | --- | --- |
| Phone | button-stack | lg |
| Desktop | simple-demo-row | md |

## Viewport Organization

Viewport rules adjust density and wrapping while keeping the control local to one decision.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Use touch-safe targets and avoid covering critical content. | touch surface | lg |
| Tablet | Keep the component close to the surface it controls. | contextual panel | md |
| Desktop | Use compact density only when labels and focus remain visible. | work surface | sm |

## Playground

Use the playground to verify labels, selected value, variant, state, and full-width behavior for one exclusive mode switch.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Segmented Control |  |
| variant | select | outlined | outlined, toolbar, compact, icon-only |
| state | select | default | default, hover, focus, selected, warning, disabled |
| fullWidth | checkbox | false |  |

## API And Foundations

Segmented Control API exposes items, selectedKey, variant, state, density, and ariaLabel while Design System owns focus, spacing, and state precedence.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | Yes | Accessible group label. |
| items | Array<{ key?: string; value?: string; label: string; icon?: string }> | Yes | Visible segments with stable keys and optional icons. |
| selectedKey | string | No | Currently selected item key. |
| onValueChange | (key: string) => void | No | Called when local selection changes. |
| variant | "outlined" \| "toolbar" \| "compact" \| "icon-only" | No | Presentation variant for the local segmented surface. |
| density | "sm" \| "md" \| "lg" | No | Maps segment target sizing to Density. |

## Implementation Checklist

- Provide `label`: Accessible group label.
- Provide `items`: Visible segments with stable keys and optional icons.
- Visible labels
- aria-selected state
- Keyboard movement
- Focus ring
- Mobile wrapping
- Disabled segment
- Selected/current uses Flow action-primary
- Outlined, toolbar, compact, and icon-only variants render distinct geometry

## Tests And Rejection Rules

Must test:

- Visible labels
- aria-selected state
- Keyboard movement
- Focus ring
- Mobile wrapping
- Disabled segment
- Selected/current uses Flow action-primary
- Outlined, toolbar, compact, and icon-only variants render distinct geometry

Reject if:

- It changes routes or pages.
- It coordinates multiple filters.
- Segments rely on icons only.
- Selected state is color-only.
- Selected/current uses non-Flow color.
- Toolbar or compact is only documented but not implemented in package styles.

## MIEL

MIEL treats Segmented Control as one local exclusive choice. Agents may place it for view mode or density mode, while humans confirm whether the request is actually navigation, tabs, or a filter pattern.

Agents can decide:

- Use Segmented Control for view mode, chart mode, local layout density, or map/list switch.
- Keep each segment as a single option with visible text.
- Use warning only when the current mode has a policy or availability caveat.

Agents must ask:

- The control changes page route, saved view, or dashboard query.
- The group needs more than one selected value.
- Labels cannot fit in the available viewport.

Agents must reject:

- It changes routes or pages.
- It coordinates multiple filters.
- Segments rely on icons only.
- Selected state is color-only.

Handoff language:

> I am using Segmented Control for one local exclusive mode. Please confirm labels, selected key, keyboard movement, responsive wrapping, and that this is not navigation or a filter bar.
