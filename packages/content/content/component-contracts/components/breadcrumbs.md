# Breadcrumbs

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/breadcrumbs/all.json`

## Purpose

Use Breadcrumbs as a bounded component: Show the current location path inside one hierarchy without owning route architecture, side navigation, or page history.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Breakpoints`, `Focus`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.breadcrumbs.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.state.*`, `sys.momentum.*`, `sys.accessibility.*`

Gaps or review gates:

- Navigation architecture, route guards, and IA decisions belong to navigation patterns.
- State is color-only.
- Component owns a process.
- Required label or fallback is missing.
- Ask before build: The request needs orchestration, multi-step behavior, or cross-surface state.
- Ask before build: Navigation architecture, route guards, and IA decisions belong to navigation patterns.
- Ask before build: Accessibility, risk, or reduced-motion expectations are unclear.

## Use When

- Use Breadcrumbs for one local UI job.
- Select variant and state from the Breadcrumbs contract.
- Keep labels, focus, and state visible.

## Do Not Use Without Review

- Ask before use when the request needs orchestration, multi-step behavior, or cross-surface state.
- Ask before use when navigation architecture, route guards, and IA decisions belong to navigation patterns.
- Ask before use when accessibility, risk, or reduced-motion expectations are unclear.
- Navigation architecture, route guards, and IA decisions belong to navigation patterns.
- Required meaning is icon-only, color-only, or motion-only.
- The component becomes a process container.
- Current page is styled as an actionable selected control.
- State is color-only.
- Component owns multi-step system.
- Required label or fallback is missing.

## Operational Example

Use Breadcrumbs as a bounded component: Show the current location path inside one hierarchy without owning route architecture, side navigation, or page history.

### Why Breadcrumbs

- The ZIP reference shows a small path trail with chevron separators, text links, and a current page label.
- Flow keeps route ownership outside Breadcrumbs; this component only renders a bounded location path.
- The current page is not an actionable selected control, so it uses text emphasis instead of action-primary.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Surface | Owns the visible Breadcrumbs container and spacing. | comp.breadcrumbs.*, sys.frame.* |
| Primary label | Provides visible meaning and accessible name. | sys.voice.* |
| State affordance | Shows the current page with text emphasis and aria-current. Action-primary is reserved for actionable ancestor hover/focus, not the current location label. | sys.state.* |
| Supporting metadata | Keeps context short and local to the component. | sys.growth.* |
| Icon or motion cue | Supports recognition without replacing text. | sys.symbol.*, sys.iconography.* |

## Accessibility

State precedence: disabled, current, collapsed, focus, hover, default

- Provide a visible accessible label.
- Expose current state through text or ARIA where applicable.
- Keep keyboard focus visible and predictable.
- Respect reduced motion for motion-bearing variants.
- Escalate to a pattern when behavior exceeds one local component.

## Foundations

Referenced token families:

- `comp.breadcrumbs.*`
- `sys.frame.*`
- `sys.growth.*`
- `sys.iconography.*`
- `sys.state.*`
- `sys.symbol.*`
- `sys.voice.*`

Breadcrumbs API exposes local props while Design System owns foundations, primitives, state precedence, and escalation rules.

## Variants

Breadcrumbs variants define local presentation only. Navigation architecture, route guards, and IA decisions belong to navigation patterns.

Approved variants from demos: `standard`, `compact`, `overflow`, `mobile`

Demo labels:

- Standard
- Compact
- Overflow
- Mobile

## States

Breadcrumbs states follow explicit precedence so location, hover, focus, collapsed, and disabled status remain readable. The current page uses Flow text emphasis because it is not an actionable selected control.

Supported states from docs: `default`, `hover`, `focus`, `collapsed`, `current`, `disabled`

## Variant X State Behavior

Variant controls presentation; state controls local behavior. Navigation architecture, route guards, and IA decisions belong to navigation patterns.

State matrix: `default`, `hover`, `focus`, `collapsed`, `current`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Standard | standard |  |
| Compact | compact |  |
| Overflow | overflow |  |
| Mobile | mobile |  |

## Full Width

Breadcrumbs may fill its parent when content remains readable and behavior stays local.

- Mobile: layout: button-stack
- Panel: layout: button-stack
- Desktop: layout: button-stack

## Responsive Layout Patterns

Use responsive density to preserve labels, state, and targets; do not add pattern orchestration to Breadcrumbs.

| Example | Layout | Density |
| --- | --- | --- |
| Phone | button-stack | lg |
| Desktop | simple-demo-row | md |

## Viewport Organization

Viewport rules decide density and placement while Breadcrumbs remains a component.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Use readable labels and touch-safe targets. | mobile surface | lg |
| Tablet | Keep the component near related context. | context panel | md |
| Desktop | Use compact density only when state remains visible. | admin surface | sm |

## Playground

Use the playground to verify Breadcrumbs label, variant, state, full-width behavior, and pattern boundary.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Breadcrumbs |  |
| variant | select | standard | standard, compact, overflow, mobile |
| state | select | default | default, hover, focus, collapsed, current, disabled |
| density | select | md | sm, md, lg |
| fullWidth | checkbox | false |  |

## API And Foundations

Breadcrumbs API exposes local props while Design System owns foundations, primitives, state precedence, and escalation rules.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| items | BreadcrumbItem[] | Yes | Ordered navigation items. |
| label | string | No | Accessible breadcrumb navigation label. |
| maxItems | number | No | Maximum visible items before overflow collapse. |
| separator | string | No | Decorative separator icon or text. |
| density | sm \| md \| lg | No | Density scale. |
| variant | standard \| compact \| overflow \| mobile | No | Local breadcrumb presentation variant. |
| state | default \| hover \| focus \| collapsed \| current \| disabled | No | Local visual state. |
| disabled | boolean | No | Disables navigable ancestors. |
| fullWidth | boolean | No | Allows the trail to fill its parent width. |

## Implementation Checklist

- Provide `items`: Ordered navigation items.
- Visible label
- State precedence
- aria-current page uses text emphasis, not action-primary selected styling
- Keyboard focus
- Responsive layout
- Reduced motion when relevant
- Pattern boundary

## Tests And Rejection Rules

Must test:

- Visible label
- State precedence
- aria-current page uses text emphasis, not action-primary selected styling
- Keyboard focus
- Responsive layout
- Reduced motion when relevant
- Pattern boundary

Reject if:

- Navigation architecture, route guards, and IA decisions belong to navigation patterns.
- Current page is styled as an actionable selected control.
- State is color-only.
- Component owns multi-step system.
- Required label or fallback is missing.

## MIEL

MIEL treats Breadcrumbs as a bounded component. Agents may place it when the job is local; humans confirm state, accessibility, content, and whether escalation to a pattern is required.

Agents can decide:

- Use Breadcrumbs for one local UI job.
- Select variant and state from the Breadcrumbs contract.
- Keep labels, focus, and state visible.

Agents must ask:

- The request needs orchestration, multi-step behavior, or cross-surface state.
- Navigation architecture, route guards, and IA decisions belong to navigation patterns.
- Accessibility, risk, or reduced-motion expectations are unclear.

Agents must reject:

- Navigation architecture, route guards, and IA decisions belong to navigation patterns.
- Required meaning is icon-only, color-only, or motion-only.
- The component becomes a process container.

Handoff language:

> I am using Breadcrumbs as a bounded component. Please confirm label, state, accessibility behavior, responsive treatment, and whether this should escalate to a pattern.
