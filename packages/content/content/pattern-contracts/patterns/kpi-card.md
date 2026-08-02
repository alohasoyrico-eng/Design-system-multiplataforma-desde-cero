# Kpi Card

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:pattern-contracts` after changing pattern copy.

Source content:

- `packages/content/content/pattern-copy/patterns/kpi-card/all.json`

## Purpose

Summarize one operational metric with value, delta, threshold tone, owner, and a clear path to investigation.

## Use When

- A dashboard needs a scannable metric that can lead to detail.
- The metric has a known calculation, cadence, and comparison period.
- Multiple KPIs must align in a dense desktop band.

## Do Not Use Without Review

- The number has no owner, source, or refresh cadence.
- The KPI is only decorative and does not inform a decision.
- The metric needs chart exploration instead of a compact summary.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines metric band density, tile min width, comparison placement, and responsive wrapping. |
| Voice | Owns metric label, delta copy, threshold explanation, and empty/loading language. |
| Energy | Controls neutral, success, warning, and danger emphasis without replacing the data. |
| State | Loaded, loading, empty, stale, warning, and selected states are explicit. |
| Depth | KPI groups remain flat in dashboard bands; depth appears only for drill-in overlays. |
| Accessibility | Value, label, delta, and tone are text-backed and readable without color. |

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| metric | KpiTile | yes | Primary label, value, delta, tone, and optional icon. |
| context | Badge \| Tag | conditional | Cadence, owner, threshold, or stale state metadata. |
| action | Button | conditional | Drill-in or investigation action when the KPI is actionable. |
| state | Skeleton \| EmptyState \| ErrorPanel | yes | Represents loading, empty, or unavailable data. |

## Components And Primitives Used

- KPI Tile
- Badge
- Tag
- Button
- Skeleton
- Empty State
- Error Panel

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Dashboard band | Required | Several KPIs align in a dense responsive row. |
| Threshold | Required state | Tone indicates risk with text-backed threshold copy. |
| Loading and stale | Required state | Skeleton or stale metadata appears without shifting layout. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Value refresh | Updated values change without decorative count-up motion. |
| Drill-in | Action feedback is immediate and keeps dashboard context. |
| Reduced motion | Any live-update emphasis is removed when reduced motion is requested. |

## Accessibility

- The metric label and value are exposed as text.
- Delta and tone are not color-only.
- Drill-in controls have explicit labels.
- Loading and stale states are announced through text.

## Implementation Checklist

- Declare `metric`: Primary label, value, delta, tone, and optional icon.
- Declare `state`: Represents loading, empty, or unavailable data.
- KPI band wraps without clipping at desktop and tablet widths.
- Risk tone has text-backed threshold copy.
- Loading state preserves tile dimensions.
- Drill-in action is keyboard reachable.

## Tests And Rejection Rules

Must test:

- KPI band wraps without clipping at desktop and tablet widths.
- Risk tone has text-backed threshold copy.
- Loading state preserves tile dimensions.
- Drill-in action is keyboard reachable.

Reject if:

- The metric has no source or owner.
- Tone is color-only.
- The tile cannot explain stale or missing data.

## MIEL

Agents can decide:

- Use KPI Card when the metric is known, owned, and action-oriented.
- Use Design System semantic tone for threshold state.
- Use Skeleton or Empty State when data is not ready.

Agents must ask:

- Metric source, calculation, cadence, threshold, or owner is unclear.
- The KPI affects financial, compliance, or regulated reporting.

Agents must reject:

- The metric has no source or owner.
- Tone is color-only.
- The tile cannot explain stale or missing data.

Handoff language:

> Confirm metric source, owner, cadence, threshold rules, drill-in destination, and loading/stale states.
