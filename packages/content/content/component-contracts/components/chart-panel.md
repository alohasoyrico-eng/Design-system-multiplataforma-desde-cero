# Chart Panel

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/chart-panel/all.json`

## Purpose

Use Chart Panel to frame one operational visualization with title, context, summary value, and actions.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Breakpoints`, `Focus`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.chart-panel.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.state.*`, `sys.momentum.*`, `sys.accessibility.*`

Gaps or review gates:

- No visible title
- Pixels-only value
- Raw values
- Dashboard logic inside component
- Ask before build: The chart changes financial or safety decisions.
- Ask before build: Multiple charts need shared filters or layout rules.
- Ask before build: The data source, unit, or comparison period is unclear.

## Use When

- Use Chart Panel for one trend, comparison, or KPI visualization.
- Choose compact only when the summary value carries the main meaning.
- Use warning or error when the metric needs operational attention.

## Do Not Use Without Review

- Ask before use when the chart changes financial or safety decisions.
- Ask before use when multiple charts need shared filters or layout rules.
- Ask before use when the data source, unit, or comparison period is unclear.
- The chart has no title.
- The chart is decorative only.
- The state is color-only.
- The chart has no readable title.
- The summary value only exists inside pixels.
- The plot is miniaturized until unreadable.
- Raw colors or motion values are used.

## Operational Example

Use Chart Panel to frame one operational visualization with title, context, summary value, and actions.

### Why Chart Panel

- Chart Panel gives one visualization a readable frame before it becomes a dashboard pattern.
- It keeps the chart title, summary, caption, and state together for humans and agents.
- Use a pattern when multiple panels need filtering, layout rules, or shared controls.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Container | Frames one chart with stable spacing, border, and responsive width. | comp.chart-panel.*, sys.frame.* |
| Header | Names the metric and provides a short context line. | sys.voice.*, sys.energy.* |
| Summary value | Exposes the main reading without forcing users to parse the chart. | sys.voice.*, sys.energy.action.primary |
| Plot area | Hosts the visualization engine while Design System owns boundaries and state. | sys.frame.*, sys.momentum.* |
| Caption | Clarifies period, unit, or comparison when the chart alone is ambiguous. | sys.voice.*, sys.tone.* |

## Accessibility

State precedence: disabled, error, warning, focus, hover, default

- Provide a readable chart title and accessible image label.
- Expose the key value in text, not only in the visualization.
- Keep warning and error states text-backed.
- Preserve focus visibility when chart actions are present.
- Respect reduced motion for animated chart reveals.

## Foundations

Referenced token families:

- `comp.chart-panel.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.momentum.*`
- `sys.tone.*`
- `sys.voice.*`

Chart Panel API exposes chart identity, summary value, variant, state, and data while Design System owns framing, motion, and accessibility.

## Variants

Chart Panel variants map the ZIP visualization families that still fit inside one self-contained panel: sparkline, bars, line, area, donut, Pareto, bullet, comparison, and compact.

Approved variants from demos: `sparkline`, `bars`, `line`, `area`, `donut`, `pareto`, `bullet`, `compact`

Demo labels:

- Sparkline
- Bars
- Line
- Area
- Donut
- Pareto
- Bullet
- Compact

## States

Chart Panel states communicate availability, attention, focus, hover, and error without changing the metric meaning.

Supported states from docs: `default`, `hover`, `focus`, `warning`, `error`, `disabled`

## Variant X State Behavior

Variant defines the visualization treatment; state defines feedback and availability without rewriting the data story.

State matrix: `default`, `hover`, `focus`, `warning`, `error`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Sparkline | sparkline |  |
| Bars | bars |  |
| Donut | donut |  |

## Full Width

Chart Panel can fill its parent in analytics layouts, but the plot keeps a useful minimum reading area.

- Dashboard band: layout: button-stack
- Detail drawer: layout: button-stack
- Comparison row: layout: button-stack

## Responsive Layout Patterns

Use one readable chart per row on small viewports and avoid shrinking plots below their useful reading width.

| Example | Layout | Density |
| --- | --- | --- |
| Phone | button-stack | lg |
| Desktop | button-stack | md |

## Viewport Organization

Chart Panel should use available width before adding more columns because dense charts lose meaning quickly.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Use compact charts with visible value and caption. | single chart | lg |
| Tablet | Use one or two panels only when both remain readable. | wide panel | md |
| Desktop | Let critical charts breathe before arranging dense grids. | analysis band | sm |

## Playground

Use the playground to verify title, summary value, variant, state, and chart readability before composing dashboards.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Fuel trend |  |
| value | text | 84% |  |
| variant | select | line | sparkline, bars, line, area, donut, pareto, bullet, comparison, compact |
| state | select | default | default, hover, focus, warning, error, disabled |

## API And Foundations

Chart Panel API exposes chart identity, summary value, variant, state, and data while Design System owns framing, motion, and accessibility.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | Yes | Panel label. |
| value | string | No | Primary displayed value. |
| caption | string | No | Short supporting caption. |
| values | number[] | No | Local chart values rendered inside the component. |
| labels | string[] | No | Optional labels for chart values, used by donut, bullet, bars, and accessible titles. |
| segments | ChartPanelSegment[] | No | Optional part-to-whole data for donut panels. |
| variant | ChartPanelVariant | No | Local visualization treatment: sparkline, bars, line, area, donut, pareto, bullet, comparison, or compact. |
| state | ChartPanelState | No | Visual state: default, focus, hover, warning, error, or disabled. |
| tone | ChartPanelTone | No | Semantic tone for value and plot emphasis. |
| density | Density | No | Controls spacing and plot height. |
| fullWidth | boolean | No | Lets the panel fill its parent grid column. |

## Implementation Checklist

- Provide `label`: Panel label.
- Chart title and accessible label
- Summary value visibility
- Reduced motion
- Warning and error contrast
- Responsive plot width
- No raw chart colors

## Tests And Rejection Rules

Must test:

- Chart title and accessible label
- Summary value visibility
- Reduced motion
- Warning and error contrast
- Responsive plot width
- No raw chart colors

Reject if:

- The chart has no readable title.
- The summary value only exists inside pixels.
- The plot is miniaturized until unreadable.
- Raw colors or motion values are used.

## MIEL

MIEL treats Chart Panel as one visualization contract. Agents may place it when the metric is known, but humans confirm data meaning, comparison period, and dashboard composition.

Agents can decide:

- Use Chart Panel for one trend, comparison, or KPI visualization.
- Choose compact only when the summary value carries the main meaning.
- Use warning or error when the metric needs operational attention.

Agents must ask:

- The chart changes financial or safety decisions.
- Multiple charts need shared filters or layout rules.
- The data source, unit, or comparison period is unclear.

Agents must reject:

- The chart has no title.
- The chart is decorative only.
- The state is color-only.

Handoff language:

> I am using Chart Panel for one operational visualization. Please confirm metric, source, period, accessible summary, and whether this belongs in a dashboard pattern.
