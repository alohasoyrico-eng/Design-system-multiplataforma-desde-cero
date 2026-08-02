# Pagination

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/pagination/all.json`

## Purpose

Use Pagination as a bounded component: move through discrete pages of one result set with numbered controls and ellipsis collapse.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Breakpoints`, `Focus`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.pagination.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.state.*`, `sys.momentum.*`, `sys.accessibility.*`

Gaps or review gates:

- Filtering, sorting, table ownership, search results, and infinite loading behavior belong to patterns.
- State is color-only.
- Component owns a process.
- Ask before build: The request needs orchestration, multi-step behavior, or cross-surface state.
- Ask before build: Data table, search result, sorting, and infinite loading behavior belong to patterns.
- Ask before build: Accessibility, risk, or reduced-motion expectations are unclear.

## Use When

- Use Pagination for one local UI job.
- Select variant and state from the Pagination contract.
- Keep labels, focus, state, and bounded motion visible.

## Do Not Use Without Review

- Ask before use when the request needs orchestration, multi-step behavior, or cross-surface state.
- Ask before use when data table, search result, sorting, and infinite loading behavior belong to patterns.
- Ask before use when accessibility, risk, or reduced-motion expectations are unclear.
- Filtering, sorting, table ownership, search results, and infinite loading behavior belong to patterns.
- Cursor/simple are presented as closed variants without Flow scope decision.
- Required meaning is icon-only, color-only, or motion-only.
- State is color-only.
- Required label or fallback is missing.

## Operational Example

Use Pagination as a bounded component: move through discrete pages of one result set with numbered controls and ellipsis collapse.

### Why Pagination

- Flow defines pagination state semantics: selected/current uses action-primary, with disabled and focus governed by State.
- The ZIP reference informs numbered structure, ellipsis behavior, mono numerals, chevrons, depth, and selected-page momentum.
- The color tension is resolved in favor of Flow semantics while preserving the ZIP-inspired selected-page treatment.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Surface | Owns the visible Pagination container and spacing. | comp.pagination.*, sys.frame.* |
| Primary label | Provides visible meaning and accessible name. | sys.voice.* |
| State affordance | Shows current state with action-primary color, aria-current, weight, depth, and motion. ZIP informs treatment without replacing Flow state color. | sys.state.*, sys.energy.*, sys.momentum.* |
| Supporting metadata | Keeps context short and local to the component. | sys.growth.* |
| Icon or motion cue | Supports recognition without replacing text. | sys.symbol.*, sys.iconography.* |

## Accessibility

State precedence: disabled, selected, focus, hover, default

- Provide a visible accessible label.
- Expose current state through text or ARIA where applicable.
- Keep keyboard focus visible and predictable.
- Respect reduced motion for motion-bearing variants.
- Escalate to a pattern when behavior exceeds one local component.

## Foundations

Referenced token families:

- `comp.pagination.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.growth.*`
- `sys.iconography.*`
- `sys.momentum.*`
- `sys.state.*`
- `sys.symbol.*`
- `sys.voice.*`

Pagination API exposes local props while Design System owns foundations, primitives, state precedence, momentum, and escalation rules.

## Variants

Pagination has one package-backed visual variant: numbered. Ellipsis is behavior for long ranges. Density is governed by Flow context and viewport. Cursor, simple, data loading, and infinite loading stay outside this component until Flow scopes them.

Approved variants from demos: `numbered`

Demo labels:

- Numbered
- Ellipsis
- Density sm
- Density lg

## States

Pagination states follow explicit precedence so the current page, focus, and disabled controls remain readable. The selected/current page uses Flow action-primary with ZIP-informed depth and bounded momentum.

Supported states from docs: `default`, `hover`, `focus`, `selected`, `disabled`

## Variant X State Behavior

Pagination keeps one visual variant. State controls local feedback; density controls scale; momentum gives the selected page a bounded transition. Data ownership and result-set orchestration belong to patterns.

State matrix: `default`, `hover`, `focus`, `selected`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Numbered | numbered |  |
| Density sm | numbered |  |
| Density lg | numbered |  |

## Full Width

Pagination may fill its parent when content remains readable and behavior stays local.

- Panel: layout: button-stack
- Density sm: layout: button-stack
- Density lg: layout: button-stack

## Responsive Layout Patterns

Use responsive density to preserve labels, state, and targets; do not add pattern orchestration to Pagination.

| Example | Layout | Density |
| --- | --- | --- |
| Phone | button-stack | lg |
| Desktop | simple-demo-row | md |

## Viewport Organization

Viewport rules decide density and placement while Pagination remains a component.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Use touch density only when numbered pagination remains readable. | mobile surface | lg |
| Tablet | Keep the row close to the bounded result set. | context panel | md |
| Desktop | Use small density for dense admin surfaces. | admin surface | sm |

## Playground

Use the playground to verify Pagination label, variant, state, full-width behavior, and pattern boundary.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Pagination |  |
| page | number | 4 |  |
| pageCount | number | 12 |  |
| state | select | default | default, hover, focus, selected, disabled |
| density | select | md | sm, md, lg |
| fullWidth | checkbox | false |  |

## API And Foundations

Pagination API exposes local props while Design System owns foundations, primitives, state precedence, momentum, and escalation rules.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| page | number | Yes | Current page. |
| pageCount | number | Yes | Total page count. |
| label | string | No | Accessible pagination label. |
| variant | numbered | No | Accepted for API alignment; Pagination renders the numbered variant. |
| state | default \| hover \| focus \| selected \| disabled | No | Local visual state. |
| density | sm \| md \| lg | No | Density scale. |
| fullWidth | boolean | No | Allows the row to fill its parent width. |
| disabled | boolean | No | Disables pagination controls. |
| onPageChange | (page: number) => void | No | Called when a local page request changes. |

## Implementation Checklist

- Provide `page`: Current page.
- Provide `pageCount`: Total page count.
- Visible label
- Ellipsis collapse
- Current page aria-current
- Selected/current page uses Flow action-primary with ZIP-informed depth and momentum
- Previous and next disabled boundaries
- Keyboard focus
- Responsive density
- Pattern boundary

## Tests And Rejection Rules

Must test:

- Visible label
- Ellipsis collapse
- Current page aria-current
- Selected/current page uses Flow action-primary with ZIP-informed depth and momentum
- Previous and next disabled boundaries
- Keyboard focus
- Responsive density
- Pattern boundary

Reject if:

- Filtering, sorting, table ownership, search results, and infinite loading behavior belong to patterns.
- Cursor/simple are presented as closed variants without Flow scope decision.
- State is color-only.
- Required label or fallback is missing.

## MIEL

MIEL treats Pagination as a bounded component. Agents may place it when the job is local; humans confirm state, accessibility, content, and whether escalation to a pattern is required.

Agents can decide:

- Use Pagination for one local UI job.
- Select variant and state from the Pagination contract.
- Keep labels, focus, state, and bounded motion visible.

Agents must ask:

- The request needs orchestration, multi-step behavior, or cross-surface state.
- Data table, search result, sorting, and infinite loading behavior belong to patterns.
- Accessibility, risk, or reduced-motion expectations are unclear.

Agents must reject:

- Filtering, sorting, table ownership, search results, and infinite loading behavior belong to patterns.
- Cursor/simple are presented as closed variants without Flow scope decision.
- Required meaning is icon-only, color-only, or motion-only.

Handoff language:

> I am using Pagination as a bounded component. Please confirm label, state, accessibility behavior, responsive treatment, and whether this should escalate to a pattern.
