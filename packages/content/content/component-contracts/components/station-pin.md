# Station Pin

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/station-pin/all.json`

## Purpose

Use Station Pin to represent one actionable map marker value without turning map behavior into a component.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Breakpoints`, `Focus`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.station-pin.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.state.*`, `sys.momentum.*`, `sys.accessibility.*`

Gaps or review gates:

- No visible value
- Color-only unavailable state
- Map logic in component
- Tiny tap target
- Ask before build: Pin selection changes route or spending decisions.
- Ask before build: Many pins need filtering, zoom, or clustering.
- Ask before build: Station value or status source is unclear.

## Use When

- Use Station Pin for one fuel, EV, service, or cluster marker.
- Use selected for the active route or station detail.
- Use unavailable only when the pin cannot be chosen.

## Do Not Use Without Review

- Ask before use when pin selection changes route or spending decisions.
- Ask before use when many pins need filtering, zoom, or clustering.
- Ask before use when station value or status source is unclear.
- The pin has no visible value.
- The pin owns map layout rules.
- Unavailable is color-only.
- Pin has no visible value.
- The component owns map clustering logic.
- The target is too small for mobile.

## Operational Example

Use Station Pin to represent one actionable map marker value without turning map behavior into a component.

### Why Station Pin

- Station Pin keeps the map marker value compact and legible over map surfaces.
- The accessible name carries station identity, price or value, and short status.
- Use patterns when pins require clustering rules, filters, route drawing, or station detail sheets.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Marker | Carries the icon or cluster count inside the pin. | comp.station-pin.*, sys.symbol.* |
| Value | Shows the short price, count, or station value visible on the map. | sys.voice.*, sys.energy.* |
| Pointer | Anchors the pin to a map coordinate without owning map positioning. | sys.frame.* |
| Focus target | Uses button semantics only when the pin opens detail or route action. | sys.accessibility.* |

## Accessibility

State precedence: disabled, unavailable, selected, focus, hover, default

- Use a button only when the pin opens detail or route action.
- Expose station name, visible value, and status in the accessible name.
- Do not rely on the marker icon as the only meaning.
- Keep focus ring outside the pill marker shape.
- Represent unavailable stations with text in the accessible name and disabled behavior.

## Foundations

Referenced token families:

- `comp.station-pin.*`
- `sys.accessibility.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.symbol.*`
- `sys.voice.*`

Station Pin API exposes station identity, visible marker value, type, state, count, and action while the Design System owns marker shape, contrast, focus, depth, and motion.

## Variants

Station Pin variants represent station type or cluster behavior while preserving a single marker contract.

Approved variants from demos: `fuel`, `ev`, `service`, `cluster`

Demo labels:

- Fuel price
- EV rate
- Service
- Cluster

## States

Station Pin states communicate availability, selection, hover, focus, and disabled behavior on map surfaces.

Supported states from docs: `default`, `hover`, `focus`, `selected`, `unavailable`, `disabled`

## Variant X State Behavior

Variant identifies the station type; state tells whether the pin is available, selected, or blocked.

State matrix: `default`, `hover`, `focus`, `selected`, `unavailable`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Fuel | fuel |  |
| EV | ev |  |
| Cluster | cluster |  |

## Full Width

Station Pin should not stretch its marker; full-width demos preserve map context while the pin target stays stable.

- Map preview: layout: button-stack
- Selected station: layout: button-stack
- Cluster preview: layout: button-stack

## Responsive Layout Patterns

Keep pins large enough to tap on phones and avoid dense marker groups before a map pattern owns clustering.

| Example | Layout | Density |
| --- | --- | --- |
| Phone | button-stack | lg |
| Desktop | simple-demo-row | md |

## Viewport Organization

Station Pin stays a marker component; viewport rules decide touch target, label visibility, and cluster escalation.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Keep the tap target generous while the visible value stays compact. | tap target | lg |
| Tablet | Show the selected value with stronger depth when route context is visible. | map preview | md |
| Desktop | Escalate dense groups to map patterns that own filtering and zoom. | cluster cue | sm |

## Playground

Use the playground to verify marker type, state, accessible label, and whether the pin should be interactive.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Pemex Polanco |  |
| value | text | $23.4 |  |
| meta | text | 1.8 km - 24 h |  |
| variant | select | fuel | fuel, ev, service, cluster |
| state | select | default | default, hover, focus, selected, unavailable, disabled |

## API And Foundations

Station Pin API exposes station identity, visible marker value, type, state, count, and action while the Design System owns marker shape, contrast, focus, depth, and motion.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | Yes | Accessible station or cluster name. |
| value | string | No | Short visible marker value, such as price or rate. |
| meta | string | No | Short status included in the accessible name. |
| icon | IconName | No | Marker icon. |
| count | number | No | Optional marker or cluster count. |
| variant | "fuel" \| "ev" \| "service" \| "cluster" | No | Station type or cluster marker treatment. |
| state | "default" \| "hover" \| "focus" \| "selected" \| "unavailable" \| "disabled" | No | Pin interaction and availability state. |
| density | "sm" \| "md" \| "lg" | No | Flow density inherited from viewport or context. |
| selected | boolean | No | Convenience flag that maps to selected state. |
| unavailable | boolean | No | Convenience flag that maps to unavailable state. |
| disabled | boolean | No | Disables the marker. |

## Implementation Checklist

- Provide `label`: Accessible station or cluster name.
- Accessible name includes station identity and value
- Focus ring
- Disabled behavior
- Selected state
- Touch target
- Contrast on map context
- Pointer geometry

## Tests And Rejection Rules

Must test:

- Accessible name includes station identity and value
- Focus ring
- Disabled behavior
- Selected state
- Touch target
- Contrast on map context
- Pointer geometry

Reject if:

- Pin has no visible value.
- Unavailable is color-only.
- The component owns map clustering logic.
- The target is too small for mobile.

## MIEL

MIEL treats Station Pin as one compact map marker. Agents can choose it for a known location, but humans confirm value source, status meaning, action, and whether a map pattern should own clustering.

Agents can decide:

- Use Station Pin for one fuel, EV, service, or cluster marker.
- Use selected for the active route or station detail.
- Use unavailable only when the pin cannot be chosen.

Agents must ask:

- Pin selection changes route or spending decisions.
- Many pins need filtering, zoom, or clustering.
- Station value or status source is unclear.

Agents must reject:

- The pin has no visible value.
- The pin owns map layout rules.
- Unavailable is color-only.

Handoff language:

> I am using Station Pin for one actionable location. Please confirm value source, status source, accessible label, and whether clustering belongs in a map pattern.
