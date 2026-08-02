# Audit Event

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/audit-event/all.json`

## Purpose

Use Audit Event for one traceable event inside an operational surface: who changed what, when it happened, and the resulting status. Use Timeline or an audit table pattern when events become a sequence, filterable history, or investigation flow.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Breakpoints`, `Focus`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.audit-event.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.state.*`, `sys.momentum.*`, `sys.accessibility.*`

Gaps or review gates:

- The component becomes a timeline, audit table, approval flow, or investigation workflow.
- A business-specific variant is added.
- Status is color-only.
- Docs render a non-package audit event instance.
- Ask before build: The request needs an ordered history, filtering, approval rules, or investigation.
- Ask before build: The event status changes business process state.
- Ask before build: Accessibility, risk, or reduced-motion expectations are unclear.

## Use When

- Use Audit Event for one local record.
- Select tone, state, density, timestamp, and status text from the component API.
- Keep event meaning readable without color.

## Do Not Use Without Review

- Ask before use when the request needs an ordered history, filtering, approval rules, or investigation.
- Ask before use when the event status changes business process state.
- Ask before use when accessibility, risk, or reduced-motion expectations are unclear.
- The component becomes a timeline, audit table, or workflow.
- Required meaning is icon-only, color-only, or motion-only.
- A business variant is introduced instead of using tone/state.
- Business-specific variants are added to the component.
- A timeline connector or ordered event list is built into Audit Event.
- Status is color-only.
- Docs render a non-package audit event instance.

## Operational Example

Use Audit Event for one traceable event inside an operational surface: who changed what, when it happened, and the resulting status. Use Timeline or an audit table pattern when events become a sequence, filterable history, or investigation flow.

### Why Audit Event

- The ZIP timeline reference informs marker size, compact title hierarchy, mono timestamp, and secondary description rhythm.
- Flow governs color semantics, density, focus, radius, typography, and state precedence.
- One event stays a component; ordered history, filtering, approvals, and investigation belong to patterns.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Event marker | Identifies the event type without replacing text. | sys.symbol.*, sys.iconography.*, sys.state.* |
| Event text | Names actor/action/result in a compact readable title and description. | sys.voice.* |
| Metadata | Shows actor, source, or timestamp as supporting context only. | sys.growth.*, sys.voice.* |
| Status badge | Shows status with text plus semantic tone; never color-only. | sys.state.*, sys.energy.* |
| Surface | Provides local row framing without becoming a timeline container. | comp.audit-event.*, sys.frame.* |

## Accessibility

State precedence: disabled, critical, warning, verified, focus, hover, default

- Keep the event label visible and descriptive.
- Do not rely on icon or color alone for status.
- Use timestamp text when time is important; do not hide it in title attributes.
- Keep focus visible for interactive wrappers owned by a parent pattern.
- Escalate to Timeline or Table when the user must compare, filter, or investigate multiple events.

## Foundations

Referenced token families:

- `comp.audit-event.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.growth.*`
- `sys.iconography.*`
- `sys.state.*`
- `sys.symbol.*`
- `sys.voice.*`

Audit Event API exposes one atomic event. Flow owns typography, tone, density, radius, motion, and accessibility; parent patterns own event lists and workflow.

## Variants

Audit Event has one structural variant. Use tone and state for local event status; do not create business variants such as permission, vehicle, card, or finance inside the component.

Approved variants from demos: `standard`

Demo labels:

- Logged
- Verified
- Review

## States

Audit Event state controls local feedback and status tone. Process state and event ordering stay outside the component.

Supported states from docs: `default`, `hover`, `focus`, `verified`, `warning`, `critical`, `disabled`

## Variant X State Behavior

Structural variant is fixed. The matrix verifies that state and tone remain readable without turning Audit Event into a timeline pattern.

State matrix: `default`, `verified`, `warning`, `critical`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Logged | standard |  |
| Verified | standard | verified |
| Review | standard | warning |

## Full Width

Audit Event may fill a parent row or panel when the parent owns layout. It should not own list sequencing.

- Panel row: layout: button-stack
- Dense table aside: layout: button-stack
- Review row: layout: button-stack

## Responsive Layout Patterns

Density changes spacing, marker size, and title scale. The parent surface decides whether events stack, scroll, or become a timeline/table pattern.

| Example | Layout | Density |
| --- | --- | --- |
| Compact desktop | simple-demo-row | sm |
| Default panel | simple-demo-row | md |
| Touch review | button-stack | lg |

## Viewport Organization

Use Audit Event where one event needs context. Use Timeline, Table, or an approval pattern when the viewport needs comparison or workflow.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Panel | Use a single event near the object it explains. | inline row | md |
| Dense desktop | Use compact density in sidebars or detail panes only when status stays readable. | compact row | sm |
| Escalate | If there is ordering, connectors, filtering, or investigation, use a pattern. | timeline/table pattern | md |

## Playground

Use the playground to verify Audit Event label, tone, state, density, timestamp, and pattern boundary.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Fuel limit changed |  |
| description | text | MX-4821 policy updated. |  |
| status | text | Logged |  |
| tone | select | neutral | neutral, info, success, warning, danger, action |
| state | select | default | default, hover, focus, verified, warning, critical, disabled |
| density | select | md | sm, md, lg |
| timestamp | text | 09:42 |  |

## API And Foundations

Audit Event API exposes one atomic event. Flow owns typography, tone, density, radius, motion, and accessibility; parent patterns own event lists and workflow.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | Yes | Event label describing actor/action/result. |
| description | string | No | Short supporting event detail. |
| meta | string | No | Actor, source, or audit context. |
| timestamp | string | No | Visible time string for the event. |
| status | string | No | Visible status label. |
| icon | IconName | No | Decorative event marker icon. |
| tone | AuditEventTone | No | Semantic tone for marker and status badge. |
| state | AuditEventState | No | Local visual state for docs/previews. |
| density | "sm" \| "md" \| "lg" | No | Responsive event density. |

## Implementation Checklist

- Provide `label`: Event label describing actor/action/result.
- Package factory renders article root
- Visible label and status text
- Tone/state/density datasets
- Desktop and compact layout fit
- Dark mode contrast
- Pattern boundary

## Tests And Rejection Rules

Must test:

- Package factory renders article root
- Visible label and status text
- Tone/state/density datasets
- Desktop and compact layout fit
- Dark mode contrast
- Pattern boundary

Reject if:

- Business-specific variants are added to the component.
- A timeline connector or ordered event list is built into Audit Event.
- Status is color-only.
- Docs render a non-package audit event instance.

## MIEL

MIEL treats Audit Event as one atomic record. Agents may place it when the job is local; humans confirm whether multiple records require Timeline, Table, or workflow patterns.

Agents can decide:

- Use Audit Event for one local record.
- Select tone, state, density, timestamp, and status text from the component API.
- Keep event meaning readable without color.

Agents must ask:

- The request needs an ordered history, filtering, approval rules, or investigation.
- The event status changes business process state.
- Accessibility, risk, or reduced-motion expectations are unclear.

Agents must reject:

- The component becomes a timeline, audit table, or workflow.
- Required meaning is icon-only, color-only, or motion-only.
- A business variant is introduced instead of using tone/state.

Handoff language:

> I am using Audit Event as one atomic record. Please confirm whether this remains a single event or should escalate to Timeline/Table/workflow pattern.
