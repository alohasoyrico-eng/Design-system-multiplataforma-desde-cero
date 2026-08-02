# Kpi Tile

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/kpi-tile/all.json`
- `packages/content/content/component-copy/components/kpi-tile/operational-example.json`
- `packages/content/content/component-copy/components/kpi-tile/anatomy.json`
- `packages/content/content/component-copy/components/kpi-tile/accessibility.json`
- `packages/content/content/component-copy/components/kpi-tile/variants.json`
- `packages/content/content/component-copy/components/kpi-tile/states.json`
- `packages/content/content/component-copy/components/kpi-tile/variant-state-behavior.json`
- `packages/content/content/component-copy/components/kpi-tile/full-width.json`
- `packages/content/content/component-copy/components/kpi-tile/responsive-layout-patterns.json`
- `packages/content/content/component-copy/components/kpi-tile/viewport-organization.json`
- `packages/content/content/component-copy/components/kpi-tile/playground.json`
- `packages/content/content/component-copy/components/kpi-tile/guidelines.json`
- `packages/content/content/component-copy/components/kpi-tile/api-foundations.json`
- `packages/content/content/component-copy/components/kpi-tile/tests-rejection-rules.json`
- `packages/content/content/component-copy/components/kpi-tile/miel.json`

## Purpose

Use KPI Tile to summarize one operational metric with value, trend, threshold, and optional local drill-in affordance.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Breakpoints`, `Focus`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.kpi-tile.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.state.*`, `sys.momentum.*`, `sys.accessibility.*`

Gaps or review gates:

- No label
- Color-only risk
- Multiple metrics
- Formula ownership hidden inside component
- Dashboard grouping implemented inside KPI Tile
- Ask before build: Metric formula or data source is unknown.
- Ask before build: Threshold affects operations or finance.
- Ask before build: Tile drill-in changes navigation or permissions.

## Use When

- Use KPI Tile for one dashboard metric.
- Use warning or danger only when threshold meaning is known.
- Use sparkline only as secondary trend support.

## Do Not Use Without Review

- Ask before use when metric formula or data source is unknown.
- Ask before use when threshold affects operations or finance.
- Ask before use when tile drill-in changes navigation or permissions.
- The agent invents metric formulas.
- Risk is color-only.
- The tile contains multiple unrelated metrics.
- Metric has no label.
- Tone is decorative.
- Sparkline is the only trend signal.
- The tile contains multiple metrics.
- Dashboard composition is hidden inside KPI Tile.

## Operational Example

Use KPI Tile to summarize one operational metric with value, trend, threshold, and optional local drill-in affordance.

### Why KPI Tile

- KPI Tile gives dashboards a repeatable metric contract before chart or table detail.
- Numerals use Voice roles instead of arbitrary display sizing.
- Tone is reserved for threshold meaning, not decoration.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Metric label | Names the metric in a short scan label. | sys.voice.* |
| Value | Prominent numeral or concise value. | sys.voice.numeral.* |
| Delta | Explains movement, threshold, or comparison. | sys.tone.*, sys.energy.* |
| Sparkline | Optional non-essential trend hint. | sys.energy.*, sys.accessibility.* |
| Tile surface | Defines dashboard grouping and drill-in affordance. | comp.kpi-tile.*, sys.frame.*, sys.depth.* |
| Metric label | Names the metric in a short scan label. | sys.voice.* |
| Value | Prominent numeral or concise value. | sys.voice.numeral.* |
| Delta | Explains movement, threshold, or comparison. | sys.tone.*, sys.energy.* |
| Sparkline | Optional non-essential trend hint. | sys.energy.*, sys.accessibility.* |
| Tile surface | Defines dashboard grouping and drill-in affordance. | comp.kpi-tile.*, sys.frame.*, sys.depth.* |

## Accessibility

State precedence: disabled, loading, risk, selected, focus, hover, default

- Expose label, value, and delta as text.
- Do not rely on sparkline or color alone for trend.
- Use button or link semantics when the tile drills in.
- Keep numeral and delta order logical for screen readers.
- Risk tone must include visible threshold copy.

## Foundations

Referenced token families:

- `comp.kpi-tile.*`
- `sys.accessibility.*`
- `sys.depth.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.tone.*`
- `sys.voice.*`

KPI Tile API exposes metric content and state while Design System owns numeral role, tone, surface, and responsive density.

## Variants

KPI Tile variants describe local metric anatomy. Dashboard groups, formulas, chart pairings, and drill-down ownership are pattern concerns.

Approved variants from demos: `standard`, `delta`, `threshold`, `sparkline`, `drill-in`

Demo labels:

- Standard
- Delta
- Threshold
- Sparkline
- Drill-in

## States

KPI Tile states communicate default, hover, selected, loading, risk, and disabled conditions without changing metric semantics.

Supported states from docs: `default`, `hover`, `focus`, `selected`, `loading`, `risk`, `disabled`

## Variant X State Behavior

Variant defines metric content; state defines interaction and threshold feedback.

State matrix: `default`, `hover`, `focus`, `selected`, `loading`, `risk`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Standard | standard |  |
| Delta | delta |  |
| Threshold | threshold | risk |
| Sparkline | sparkline |  |
| Standard | standard |  |
| Delta | delta |  |
| Threshold | threshold | risk |
| Sparkline | sparkline |  |

## Full Width

KPI Tile can fill a dashboard grid column; the grid owns column count and rhythm.

- Dashboard column: layout: button-stack
- Wide metric: layout: button-stack
- Risk card: layout: button-stack

## Responsive Layout Patterns

Use fewer columns on smaller viewports; never miniaturize values to force more tiles.

| Example | Layout | Density |
| --- | --- | --- |
| Phone | button-stack | lg |
| Desktop | simple-demo-row | sm |
| Phone | button-stack | lg |
| Desktop | simple-demo-row | sm |

## Viewport Organization

KPI Tile is a dashboard unit; layout decides how many tiles can fit without shrinking values.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Stack tiles and keep numerals readable. | single column | lg |
| Tablet | Use two columns only when values stay readable. | two-column grid | md |
| Desktop | Use dashboard grid with controlled tile count. | dashboard grid | sm |
| Phone | Stack tiles and keep numerals readable. | single column | lg |
| Tablet | Use two columns only when values stay readable. | two-column grid | md |
| Desktop | Use dashboard grid with controlled tile count. | dashboard grid | sm |

## Playground

Use the playground to verify label, value, delta, tone, and sparkline behavior.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Fuel spend |  |
| value | text | $84.2k |  |
| delta | text | +12% vs last week |  |
| variant | select | standard | standard, delta, threshold, sparkline, drill-in |
| state | select | default | default, hover, focus, selected, loading, risk, disabled |
| tone | select | info | neutral, info, success, warning, danger |
| label | text | Fuel spend |  |
| value | text | $84.2k |  |
| delta | text | +12% vs last week |  |
| variant | select | standard | standard, delta, threshold, sparkline, drill-in |
| state | select | default | default, hover, focus, selected, loading, risk, disabled |
| tone | select | info | neutral, info, success, warning, danger |

## API And Foundations

KPI Tile API exposes metric content and state while Design System owns numeral role, tone, surface, and responsive density.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | Yes | KPI label. |
| value | string | Yes | Primary KPI value. |
| delta | string | No | Short change indicator. |
| trend | up \| down \| flat | No | Delta icon state. |
| tone | neutral \| info \| success \| warning \| danger | No | Semantic threshold tone. |
| icon | IconName | No | Decorative KPI icon. |
| variant | standard \| delta \| threshold \| sparkline \| drill-in | No | Local anatomy variant. |
| state | default \| hover \| focus \| selected \| loading \| risk \| disabled | No | Local state. |
| density | sm \| md \| lg | No | Density scale. |
| values | number[] | No | Decorative sparkline values. |
| href | string | No | Link destination for drill-in. |
| selected | boolean | No | Selected local state. |
| disabled | boolean | No | Disables interaction. |
| loading | boolean | No | Shows loading placeholder. |
| ariaLabel | string | No | Accessible name override for interactive tiles. |
| onSelect | (metric: KpiTileMeta) => void | No | Local selection callback for button-style drill-in. |
| label | string | Yes | KPI label. |
| value | string | Yes | Primary KPI value. |
| delta | string | No | Short change indicator. |
| trend | up \| down \| flat | No | Delta icon state. |
| tone | neutral \| info \| success \| warning \| danger | No | Semantic threshold tone. |
| icon | IconName | No | Decorative KPI icon. |
| variant | standard \| delta \| threshold \| sparkline \| drill-in | No | Local anatomy variant. |
| state | default \| hover \| focus \| selected \| loading \| risk \| disabled | No | Local state. |
| density | sm \| md \| lg | No | Density scale. |
| values | number[] | No | Decorative sparkline values. |
| href | string | No | Link destination for drill-in. |
| selected | boolean | No | Selected local state. |
| disabled | boolean | No | Disables interaction. |
| loading | boolean | No | Shows loading placeholder. |
| ariaLabel | string | No | Accessible name override for interactive tiles. |
| onSelect | (metric: KpiTileMeta) => void | No | Local selection callback for button-style drill-in. |

## Implementation Checklist

- Provide `label`: KPI label.
- Provide `value`: Primary KPI value.
- Value contrast
- Tone meaning
- Delta text
- Sparkline optionality
- Interactive semantics
- Disabled/loading states
- Responsive density

## Tests And Rejection Rules

Must test:

- Value contrast
- Tone meaning
- Delta text
- Sparkline optionality
- Interactive semantics
- Disabled/loading states
- Responsive density

Reject if:

- Metric has no label.
- Tone is decorative.
- Sparkline is the only trend signal.
- The tile contains multiple metrics.
- Dashboard composition is hidden inside KPI Tile.

## MIEL

MIEL treats KPI Tile as metric evidence: agents may propose it for one value, but humans confirm metric definition, owner, threshold, and drill-in.

Agents can decide:

- Use KPI Tile for one dashboard metric.
- Use warning or danger only when threshold meaning is known.
- Use sparkline only as secondary trend support.

Agents must ask:

- Metric formula or data source is unknown.
- Threshold affects operations or finance.
- Tile drill-in changes navigation or permissions.

Agents must reject:

- The agent invents metric formulas.
- Risk is color-only.
- The tile contains multiple unrelated metrics.

Handoff language:

> I am using KPI Tile for a dashboard metric. Please confirm formula, threshold, owner, drill-in destination, and whether trend is required.
