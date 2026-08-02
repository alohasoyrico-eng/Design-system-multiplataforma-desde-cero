# Quick Action

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/quick-action/all.json`

## Purpose

Use Quick Action for one atomic shortcut command. The ZIP has Button/IconButton and action compositions, but no direct Quick Action component; Flow governs this component and Quick Actions Grid remains a pattern.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Breakpoints`, `Focus`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.quick-action.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.state.*`, `sys.momentum.*`, `sys.accessibility.*`

Reference translation: Adapt - The ZIP has Button/IconButton and action compositions, but no direct Quick Action component. Flow treats Quick Action as one atomic shortcut; Quick Actions Grid and grouped action behavior remain patterns.

Gaps or review gates:

- Quick Action contains more than one command.
- Multiple actions are managed inside the component.
- Label is missing or icon-only is ambiguous.
- Shortcut navigates globally without context.
- Ask before build: There are multiple related actions or ordering rules.
- Ask before build: The action is irreversible, financial, or safety-sensitive.
- Ask before build: The shortcut needs confirmation, permissions, or a fallback system.

## Use When

- Use Quick Action for freeze card, scan receipt, start route, contact support, or add note when each is a standalone command.
- Use destructive variant only with clear visible label.
- Compose several Quick Actions through a pattern, not inside this component.

## Do Not Use Without Review

- Ask before use when there are multiple related actions or ordering rules.
- Ask before use when the action is irreversible, financial, or safety-sensitive.
- Ask before use when the shortcut needs confirmation, permissions, or a fallback system.
- Quick Action contains more than one command.
- Multiple actions are managed inside the component.
- Label is missing or icon-only is ambiguous.
- Shortcut navigates globally without context.

## Operational Example

Use Quick Action for one atomic shortcut command. The ZIP has Button/IconButton and action compositions, but no direct Quick Action component; Flow governs this component and Quick Actions Grid remains a pattern.

### Why Quick Action

- ZIP reference comes from Button/IconButton/action compositions, not a direct Quick Action component.
- Quick Action can fill one cell or panel slot, but each instance owns exactly one command.
- Multiple shortcuts, ordering, blocked actions, confirmation, and feedback belong to Quick Actions Grid or workflow patterns.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Circular button control | Single circular shortcut target; the label remains external text below the circle. | sys.frame.*, comp.quick-action.* |
| Icon | Action symbol that supports the label. | sys.symbol.* |
| Label | Visible command text. | sys.voice.* |
| Optional badge | Small supporting status or count. | sys.state.* |
| State layer | Focus, loading, warning, pressed, and disabled state. | sys.accessibility.* |

## Accessibility

State precedence: disabled, loading, warning, pressed, focus, hover, default

- Provide a visible accessible label for the component.
- Expose status and state in text, not color alone.
- Keep keyboard focus and touch targets predictable.
- Protect sensitive or operational data from overexposure.
- Escalate to a pattern when actions, grouping, or detail flows exceed one component.

## Foundations

Referenced token families:

- `comp.quick-action.*`
- `sys.accessibility.*`
- `sys.frame.*`
- `sys.state.*`
- `sys.symbol.*`
- `sys.voice.*`

Quick Action renders a wrapper, a circular button control, external label text, optional badge, variant, state, density, loading, disabled, and tone while Design System owns target size, focus, Spinner loading, and state precedence.

## Variants

Quick Action variants tune risk, density, and label emphasis for a single command.

Approved variants from demos: `standard`, `destructive`, `compact`, `wide`

Demo labels:

- Standard
- Destructive
- Compact
- Wide

## States

Quick Action states communicate focus, pressed, loading, warning, and disabled behavior for one shortcut.

Supported states from docs: `default`, `hover`, `focus`, `pressed`, `loading`, `warning`, `disabled`

## Variant X State Behavior

Variant controls action tone and shape; state controls readiness without adding sibling actions.

State matrix: `default`, `hover`, `focus`, `pressed`, `loading`, `warning`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Standard | standard |  |
| Destructive | destructive |  |
| Compact | compact |  |

## Full Width

Quick Action can fill a cell or panel slot, but each instance still owns exactly one command.

- Mobile sheet: layout: button-stack
- Dense panel: layout: button-stack
- Admin surface: layout: button-stack

## Responsive Layout Patterns

On mobile, keep icon and label visible; compose multiple Quick Actions through the Quick Actions Grid pattern.

| Example | Layout | Density |
| --- | --- | --- |
| Phone | button-stack | lg |
| Desktop | simple-demo-row | md |

## Viewport Organization

Viewport rules protect target size and label fit without inventing grouped action behavior.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Use touch-safe targets and preserve key text. | mobile surface | lg |
| Tablet | Keep the component close to its related card or movement context. | context panel | md |
| Desktop | Use compact density only when scanability remains intact. | admin surface | sm |

## Playground

Use the playground to verify icon, label, variant, state, and whether the shortcut remains single-purpose.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Quick Action |  |
| variant | select | standard | standard, destructive, compact, wide |
| state | select | default | default, hover, focus, pressed, loading, warning, disabled |
| fullWidth | checkbox | false |  |

## API And Foundations

Quick Action renders a wrapper, a circular button control, external label text, optional badge, variant, state, density, loading, disabled, and tone while Design System owns target size, focus, Spinner loading, and state precedence.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | Yes | Action label. |
| icon | IconName | No | Action icon. |
| badge | string | No | Optional badge text. |
| variant | "standard" \| "destructive" \| "compact" \| "wide" | No | Shape and risk emphasis for one shortcut. |
| state | "default" \| "hover" \| "focus" \| "pressed" \| "loading" \| "warning" \| "disabled" | No | Visual state for demos and controlled previews. |
| density | "sm" \| "md" \| "lg" | No | Scales icon target and label size through Flow density. |
| loading | boolean | No | Shows package Spinner and exposes aria-busy. |
| disabled | boolean | No | Disables the action. |
| tone | "neutral" \| "danger" | No | Legacy tone shortcut; danger maps to destructive. |

## Implementation Checklist

- Provide `label`: Action label.
- Accessible label
- Density target size
- Variant and state data attributes
- Spinner loading state
- Badge composition
- Focus ring
- Disabled state

## Tests And Rejection Rules

Must test:

- Accessible label
- Density target size
- Variant and state data attributes
- Spinner loading state
- Badge composition
- Focus ring
- Disabled state

Reject if:

- Quick Action contains more than one command.
- Multiple actions are managed inside the component.
- Label is missing or icon-only is ambiguous.
- Shortcut navigates globally without context.

## MIEL

MIEL treats Quick Action as one shortcut command. Agents may place it when the command is clear and local, while humans confirm label, risk, disabled reason, and whether multiple shortcuts require a pattern.

Agents can decide:

- Use Quick Action for freeze card, scan receipt, start route, contact support, or add note when each is a standalone command.
- Use destructive variant only with clear visible label.
- Compose several Quick Actions through a pattern, not inside this component.

Agents must ask:

- There are multiple related actions or ordering rules.
- The action is irreversible, financial, or safety-sensitive.
- The shortcut needs confirmation, permissions, or a fallback system.

Agents must reject:

- Quick Action contains more than one command.
- Multiple actions are managed inside the component.
- Label is missing or icon-only is ambiguous.
- Shortcut navigates globally without context.

Handoff language:

> I am using Quick Action for one shortcut command. Please confirm label, icon, risk level, disabled reason, and whether a Quick Actions Grid pattern should compose multiple actions.
