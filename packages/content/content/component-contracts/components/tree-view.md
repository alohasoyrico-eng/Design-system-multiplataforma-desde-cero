# Tree View

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/tree-view/all.json`

## Purpose

Use Tree View as a bounded component: Display one hierarchical set of nodes with expansion, selection, and keyboard semantics without owning file management, permissions, or admin processs.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Breakpoints`, `Focus`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.tree-view.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.state.*`, `sys.momentum.*`, `sys.accessibility.*`

Gaps or review gates:

- Checkbox tree is presented as a closed component variant without Flow scope decision.
- Tree-based editors, permission configuration, drag and drop, and bulk operations belong to patterns.
- State is color-only.
- Component owns a process.
- Ask before build: The request needs orchestration, multi-step behavior, or cross-surface state.
- Ask before build: Tree-based editors, permission configuration, drag and drop, and bulk operations belong to patterns.
- Ask before build: Accessibility, risk, or reduced-motion expectations are unclear.

## Use When

- Use Tree View for one local UI job.
- Select variant and state from the Tree View contract.
- Keep labels, focus, and state visible.

## Do Not Use Without Review

- Ask before use when the request needs orchestration, multi-step behavior, or cross-surface state.
- Ask before use when tree-based editors, permission configuration, drag and drop, and bulk operations belong to patterns.
- Ask before use when accessibility, risk, or reduced-motion expectations are unclear.
- Tree-based editors, permission configuration, drag and drop, and bulk operations belong to patterns.
- Required meaning is icon-only, color-only, or motion-only.
- The component becomes a process container.
- Checkbox tree is presented as a closed component variant without Flow scope decision.
- State is color-only.
- Component owns multi-step system.
- Required label or fallback is missing.

## Operational Example

Use Tree View as a bounded component: Display one hierarchical set of nodes with expansion, selection, and keyboard semantics without owning file management, permissions, or admin processs.

### Why Tree View

- Tree View displays one hierarchical set of nodes with tree, treeitem, aria-expanded, and aria-selected semantics.
- Selection uses Flow action as a non-color-only inset indicator; expansion uses action text for disclosure state.
- Checkbox trees, permission editors, drag and drop, bulk operations, and route ownership belong to patterns until Flow scopes them explicitly.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Surface | Owns the visible Tree View container and spacing. | comp.tree-view.*, sys.frame.* |
| Primary label | Provides visible meaning and accessible name. | sys.voice.* |
| State affordance | Separates selected node state from expanded disclosure state. Selected uses aria-selected plus a Flow action inset/background; expanded uses aria-expanded and disclosure icon state. | sys.state.* |
| Supporting metadata | Keeps context short and local to the component. | sys.growth.* |
| Icon or motion cue | Supports recognition without replacing text. | sys.symbol.*, sys.iconography.* |

## Accessibility

State precedence: disabled, selected, expanded, focus, hover, default

- Provide a visible accessible label.
- Expose current state through text or ARIA where applicable.
- Keep keyboard focus visible and predictable.
- Respect reduced motion for motion-bearing variants.
- Escalate to a pattern when behavior exceeds one local component.

## Foundations

Referenced token families:

- `comp.tree-view.*`
- `sys.frame.*`
- `sys.growth.*`
- `sys.iconography.*`
- `sys.state.*`
- `sys.symbol.*`
- `sys.voice.*`

Tree View API exposes local props while Design System owns foundations, primitives, state precedence, and escalation rules.

## Variants

Tree View has one package-backed visual variant: standard hierarchical nodes. Density changes scale through Flow context. Checkbox trees, permission editors, drag and drop, and bulk operations belong to patterns until scoped explicitly.

Approved variants from demos: `standard`

Demo labels:

- Standard
- Expanded hierarchy
- Compact density
- Touch density

## States

Tree View states separate selection from disclosure: selected uses aria-selected with a Flow action inset/background, expanded uses aria-expanded and disclosure icon state, and focus/hover remain local interaction feedback.

Supported states from docs: `default`, `hover`, `focus`, `expanded`, `selected`, `disabled`

## Variant X State Behavior

Tree View keeps one visual variant. State controls selected, expanded, focus, hover, and disabled behavior; density controls scale. Tree-based editors and checkbox selection belong to patterns.

State matrix: `default`, `hover`, `focus`, `expanded`, `selected`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Standard | standard |  |
| Expanded | standard | expanded |
| Compact | standard |  |

## Full Width

Tree View may fill its parent when content remains readable and behavior stays local.

- Mobile: layout: button-stack
- Panel: layout: button-stack
- Desktop: layout: button-stack

## Responsive Layout Patterns

Use responsive density to preserve labels, state, and targets; do not add pattern orchestration to Tree View.

| Example | Layout | Density |
| --- | --- | --- |
| Phone | button-stack | lg |
| Desktop | simple-demo-row | md |

## Viewport Organization

Viewport rules decide density and placement while Tree View remains a component.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Use readable labels and touch-safe targets. | mobile surface | lg |
| Tablet | Keep the component near related context. | context panel | md |
| Desktop | Use compact density only when state remains visible. | admin surface | sm |

## Playground

Use the playground to verify Tree View label, variant, state, full-width behavior, and pattern boundary.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Tree View |  |
| variant | select | standard | standard |
| state | select | default | default, hover, focus, expanded, selected, disabled |
| fullWidth | checkbox | false |  |

## API And Foundations

Tree View API exposes local props while Design System owns foundations, primitives, state precedence, and escalation rules.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | Yes | Accessible tree label. |
| nodes | TreeNode[] | Yes | Hierarchical node data. |
| state | TreeViewState | No | Tree display state. |
| onSelect | (key: string) => void | No | Called when a node is selected. |
| onExpandedChange | (expandedKeys: string[]) => void | No | Called when node expansion changes. |
| density | "sm" \| "md" \| "lg" | No | Tree row density: sm, md, or lg. |

## Implementation Checklist

- Provide `label`: Accessible tree label.
- Provide `nodes`: Hierarchical node data.
- Visible label
- role tree/treeitem semantics
- aria-selected selection state
- aria-expanded disclosure state
- Selection and expansion remain distinct
- Keyboard focus
- Responsive layout
- Reduced motion when relevant
- Pattern boundary

## Tests And Rejection Rules

Must test:

- Visible label
- role tree/treeitem semantics
- aria-selected selection state
- aria-expanded disclosure state
- Selection and expansion remain distinct
- Keyboard focus
- Responsive layout
- Reduced motion when relevant
- Pattern boundary

Reject if:

- Checkbox tree is presented as a closed component variant without Flow scope decision.
- Tree-based editors, permission configuration, drag and drop, and bulk operations belong to patterns.
- State is color-only.
- Component owns multi-step system.
- Required label or fallback is missing.

## MIEL

MIEL treats Tree View as a bounded component. Agents may place it when the job is local; humans confirm state, accessibility, content, and whether escalation to a pattern is required.

Agents can decide:

- Use Tree View for one local UI job.
- Select variant and state from the Tree View contract.
- Keep labels, focus, and state visible.

Agents must ask:

- The request needs orchestration, multi-step behavior, or cross-surface state.
- Tree-based editors, permission configuration, drag and drop, and bulk operations belong to patterns.
- Accessibility, risk, or reduced-motion expectations are unclear.

Agents must reject:

- Tree-based editors, permission configuration, drag and drop, and bulk operations belong to patterns.
- Required meaning is icon-only, color-only, or motion-only.
- The component becomes a process container.

Handoff language:

> I am using Tree View as a bounded component. Please confirm label, state, accessibility behavior, responsive treatment, and whether this should escalate to a pattern.
