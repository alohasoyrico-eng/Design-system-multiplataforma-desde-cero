# Charts

Generated portable primitive contract for Design System.

The JSON spec and primitive copy remain the editable source of truth. Regenerate this file with `npm run build:primitive-contracts` after changing primitive copy or spec.

Source content:

- `packages/specs/specs/unison-system/artifacts/primitives/charts.json`
- `packages/content/content/primitive-copy.json`

## Purpose

Turn Energy, Accessibility, and data roles into implementation-ready ECharts primitives for series, thresholds, legends, summaries, tooltips, empty states, and drilldown.

Charts sits between foundations and components.
It consumes semantic tokens and exposes a narrow API.
It prevents hardcoded values, detached semantics, and inconsistent implementation.
It must be portable across React, Flutter, documentation, and agent specs.

## Definition Of Ready

Before building or auditing any artifact against this primitive, confirm:

- Design System foundations govern the primitive.
- The primitive exposes a narrow, reusable API and never a one-off component shortcut.
- Components, patterns, templates, and docs consume the primitive contract instead of redefining visual values locally.
- ZIP reference details may influence equivalence only after the primitive maps them back to system foundations.

Layer: `Primitive`

Platform: `System`

Audiences: `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents`

Required sections: `purpose`, `foundationInputs`, `roles`, `productExamples`, `api`, `tokens`, `states`, `agentInstructions`, `rejectIf`

Governing foundations: `Energy`, `Accessibility`, `Voice`, `State`

Foundation inputs: `sys.energy.*`, `sys.accessibility.*`, `sys.voice.*`, `sys.state.*`

Coordinates primitives: `None declared`

Token dependencies: `chart.*`, `sys.energy.*`, `sys.voice.*`, `sys.a11y.*`

## Roles

| Role | Token | Use |
| --- | --- | --- |
| series | chart.series.* | Data series color/shape/label mapping. |
| threshold | chart.threshold.* | Risk bands and operational limits. |
| legend | chart.legend.* | Toggleable, keyboard-reachable series control. |
| summary | chart.summary | Text explanation of chart meaning. |
| empty | chart.empty | No data with reason and next action. |

## Product Examples

- Fuel dashboard: Spend trend includes threshold, accessible summary, tooltip, and table fallback.
- EV dashboard: Charging availability uses color-safe encoding and legend labels.
- Finance dashboard: Anomaly chart explains risk and drilldown path.

## API

Props: `type`, `series`, `thresholds`, `summary`, `emptyState`, `drilldown`

Outputs: `echartsOption`, `textSummary`, `legendModel`, `tableFallback`

## States

- loading
- empty
- error
- stale
- interactive
- selected

## Responsibilities

- Render Charts through semantic foundation roles.
- Expose a small API that maps to foundations and token aliases.
- Work across density, responsive, keyboard, touch, screen reader, contrast, and reduced-motion requirements when relevant.
- Prevent raw visual values or duplicated implementation decisions.

## Token Dependencies

- chart.*
- sys.energy.*
- sys.voice.*
- sys.a11y.*

## Agent Instructions

- Every chart needs a text summary.
- Use ECharts option model through primitive rules.
- Do not encode meaning by color alone.

## Reject If

- Chart lacks text summary.
- Color is sole encoding.
- Empty state lacks reason/next action.
- Tooltip is pointer-only.

## Prevents

Hardcoded charts values and one-off implementation behavior.

## Demo Evidence

Type: `chart`

Initial: `bar`

Choices:

- bar: bar
- line: line
- threshold: threshold
- empty: empty
