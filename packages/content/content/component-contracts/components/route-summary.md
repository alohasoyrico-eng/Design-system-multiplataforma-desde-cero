# Route Summary

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/route-summary/all.json`

## Purpose

Use Route Summary for one visible route option or active ETA banner before map routing, station detail, and route orchestration move into patterns.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Breakpoints`, `Focus`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.route-summary.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.state.*`, `sys.momentum.*`, `sys.accessibility.*`

Gaps or review gates:

- No visible title
- Icon-only metrics
- Ranking logic in component
- Color-only warning
- Ask before build: The route affects money, safety, or compliance.
- Ask before build: Multiple route options need ranking or filtering.
- Ask before build: Metrics source or freshness is unclear.

## Use When

- Use Route Summary for one route option.
- Use compact when the route appears inside a constrained panel.
- Use warning when policy or availability changes the decision.

## Do Not Use Without Review

- Ask before use when the route affects money, safety, or compliance.
- Ask before use when multiple route options need ranking or filtering.
- Ask before use when metrics source or freshness is unclear.
- The route has no visible title.
- Metrics are icon-only.
- Route comparison is hidden inside the component.
- Route has no title.
- Comparison logic lives inside the component.
- Warning is color-only.

## Operational Example

Use Route Summary for one visible route option or active ETA banner before map routing, station detail, and route orchestration move into patterns.

### Why Route Summary

- The ZIP Rutas template shows this as an active route ETA banner over a map.
- Flow keeps the component to one route option with destination, distance, ETA, and a local action.
- Map tiles, selected station sheets, filters, routing state, and route calculation stay in patterns or templates.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Container | Frames a single route option with stable responsive width. | comp.route-summary.*, sys.frame.* |
| Title | Names the route decision in plain operational language. | sys.voice.* |
| Metrics | Expose ETA, distance, fuel, tolls, or policy status as text. | sys.voice.*, sys.energy.* |
| Actions | Provide route start or compare only when the user can act. | sys.state.*, sys.accessibility.* |
| Tone | Marks warning or error routes without replacing the route name. | sys.tone.* |

## Accessibility

State precedence: disabled, warning, selected, focus, hover, default

- Use article or group semantics for one route option.
- Expose route metrics as text, not only icons.
- Keep action buttons named and keyboard reachable.
- Use warning copy for policy or route risks.
- Keep focus visible on both card and actions.

## Foundations

Referenced token families:

- `comp.route-summary.*`
- `sys.accessibility.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.state.*`
- `sys.tone.*`
- `sys.voice.*`

Route Summary API exposes route identity, metrics, variant, state, and actions while Design System owns metric rhythm and accessibility.

## Variants

Route Summary variants separate the active ETA banner from metric cards: compact mirrors the Rutas template banner, standard exposes one route option, compare supports adjacent route units, and policy marks route risk.

Approved variants from demos: `compact`, `standard`, `compare`, `policy`

Demo labels:

- Hacia G500 Roma Norte
- Fast route
- Lowest cost
- Restricted route

## States

Route Summary states show selection, attention, focus, hover, error, and disabled behavior without hiding route metrics.

Supported states from docs: `default`, `hover`, `focus`, `selected`, `warning`, `disabled`

## Variant X State Behavior

Variant defines the route summary job; state defines route availability or attention with the same metric structure.

State matrix: `default`, `hover`, `focus`, `selected`, `warning`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Standard | standard |  |
| Compact | compact |  |
| Compare | compare |  |

## Full Width

Route Summary can fill drawers, cards, and route panels while metrics keep readable wrapping.

- Route drawer: layout: button-stack
- Compare panel: layout: button-stack
- Compact row: layout: button-stack

## Responsive Layout Patterns

Use one route summary per row on phones and let metric groups wrap before reducing text size.

| Example | Layout | Density |
| --- | --- | --- |
| Phone | button-stack | lg |
| Desktop | button-stack | md |

## Viewport Organization

Route Summary should stay readable before maps and route patterns decide sequencing or comparison.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Stack metrics and preserve primary action access. | single summary | lg |
| Tablet | Use alongside map previews when both remain legible. | route panel | md |
| Desktop | Compare summaries in patterns, not inside the component. | comparison unit | sm |

## Playground

Use the playground to verify route title, ETA, variant, state, metric wrapping, and action clarity.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Fast route |  |
| meta | text | 18 min |  |
| variant | select | standard | standard, compact, compare, policy |
| state | select | default | default, hover, focus, selected, warning, disabled |

## API And Foundations

Route Summary API exposes route identity, metrics, variant, state, and actions while Design System owns metric rhythm and accessibility.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | Yes | Route summary label. |
| description | string | No | Route summary description. |
| metrics | RouteMetric[] | No | Local route metrics. |
| actions | Action[] | No | Local route actions. |
| variant | standard \| compact \| compare \| policy | No | Route summary presentation variant. |
| state | default \| hover \| focus \| selected \| warning \| disabled | No | Visual and semantic route state. |
| density | sm \| md \| lg | No | Flow density scale. |
| tone | neutral \| info \| warning | No | Semantic route tone. |
| selected | boolean | No | Marks the route as selected. |
| disabled | boolean | No | Disables route actions and communicates unavailable state. |
| fullWidth | boolean | No | Lets the route summary fill a parent route panel. |
| icon | IconName | No | Leading route icon, usually navigation for the active ETA banner. |

## Implementation Checklist

- Provide `label`: Route summary label.
- Metric text visibility
- Action focus order
- Warning state
- Disabled state
- Responsive metric wrapping
- No raw colors

## Tests And Rejection Rules

Must test:

- Metric text visibility
- Action focus order
- Warning state
- Disabled state
- Responsive metric wrapping
- No raw colors

Reject if:

- Route has no title.
- Metrics are icon-only.
- Comparison logic lives inside the component.
- Warning is color-only.

## MIEL

MIEL treats Route Summary as one route option. Agents may place it when route metrics are known, but humans confirm decision impact, policy risk, and pattern composition.

Agents can decide:

- Use Route Summary for one route option.
- Use compact when the route appears inside a constrained panel.
- Use warning when policy or availability changes the decision.

Agents must ask:

- The route affects money, safety, or compliance.
- Multiple route options need ranking or filtering.
- Metrics source or freshness is unclear.

Agents must reject:

- The route has no visible title.
- Metrics are icon-only.
- Route comparison is hidden inside the component.

Handoff language:

> I am using Route Summary for one route option. Please confirm metric source, action behavior, policy risk, and whether route comparison belongs in a pattern.
