# Card Summary

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/card-summary/all.json`

## Purpose

Use Card Summary as a single-card snapshot: identity, masked number, visible status, and one or two local metrics. Wallet carousels, lifecycle actions, and card detail flows remain patterns.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Breakpoints`, `Focus`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.card-summary.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.state.*`, `sys.momentum.*`, `sys.accessibility.*`

Gaps or review gates:

- Full card number is exposed.
- Card Summary owns freeze, replace, dispute, or wallet flows.
- Multiple cards are managed inside one component.
- Status is color-only.
- Ask before build: The card surface needs lifecycle actions, support, dispute, replacement, or spending controls.
- Ask before build: Sensitive card data, compliance copy, or account ownership is unclear.
- Ask before build: Multiple cards need comparison or wallet-level behavior.

## Use When

- Use Card Summary for wallet header, driver card preview, admin card row expansion, or mobile card sheet header.
- Keep identifiers masked and metrics limited to one or two values.
- Use frozen or warning state only with visible copy.

## Do Not Use Without Review

- Ask before use when the card surface needs lifecycle actions, support, dispute, replacement, or spending controls.
- Ask before use when sensitive card data, compliance copy, or account ownership is unclear.
- Ask before use when multiple cards need comparison or wallet-level behavior.
- Full card number is exposed.
- Card Summary owns freeze, replace, dispute, or wallet flows.
- Multiple cards are managed inside one component.
- Status is color-only.

## Operational Example

Use Card Summary as a single-card snapshot: identity, masked number, visible status, and one or two local metrics. Wallet carousels, lifecycle actions, and card detail flows remain patterns.

### Why Card Summary

- The ZIP PaymentCard reference drives the default anatomy: fixed card ratio, top label/status, chip/contactless zone, masked number with expiry, and holder metadata.
- CardCompact informs only the compact row variant; it is not the default visual model.
- Balance, limit, wallet carousel, quick actions, and card detail flows remain outside the default card summary and escalate to limit variant or patterns.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Surface | One card-level container for a single payment instrument. | sys.frame.*, comp.card-summary.* |
| Identity | Card name, driver, or vehicle context. | sys.voice.* |
| Masked number | Displays safe card identifier without sensitive data. | sys.accessibility.* |
| Status badge | Shows active, frozen, warning, or disabled state. | sys.state.* |
| Metrics | Shows one or two summary values only. | sys.growth.* |

## Accessibility

State precedence: disabled, frozen, warning, active, focus, hover, default

- Provide a visible accessible label for the component.
- Expose status and state in text, not color alone.
- Keep keyboard focus and touch targets predictable.
- Protect sensitive or operational data from overexposure.
- Escalate to a pattern when actions, grouping, or detail flows exceed one component.

## Foundations

Referenced token families:

- `comp.card-summary.*`
- `sys.accessibility.*`
- `sys.frame.*`
- `sys.growth.*`
- `sys.state.*`
- `sys.voice.*`

Card Summary API exposes label, metadata, masked number, status, metrics, variant, state, density, and icon while Flow owns visual composition and privacy boundaries.

## Variants

Card Summary variants change the emphasis of one payment instrument without adding wallet behavior.

Approved variants from demos: `physical`, `virtual`, `compact`, `limit`

Demo labels:

- Physical
- Virtual
- Compact
- Limit

## States

Card Summary states expose status through Badge text and Flow state styling; they do not trigger card-management actions.

Supported states from docs: `default`, `hover`, `focus`, `active`, `warning`, `frozen`, `disabled`

## Variant X State Behavior

Variant controls which card facts are emphasized; state controls availability without adding actions or processs.

State matrix: `default`, `hover`, `focus`, `active`, `warning`, `frozen`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Physical | physical |  |
| Virtual | virtual |  |
| Compact | compact |  |

## Full Width

Card Summary can fill mobile sheets and detail headers while staying a single-card summary.

- Mobile sheet: layout: button-stack
- Dense panel: layout: button-stack
- Admin surface: layout: button-stack

## Responsive Layout Patterns

Use compact density on phones, but move control clusters and lifecycle actions to card-detail patterns.

| Example | Layout | Density |
| --- | --- | --- |
| Phone | button-stack | lg |
| Desktop | simple-demo-row | md |

## Viewport Organization

Viewport rules decide density and metric visibility; they do not add wallet navigation or card management.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Use touch-safe targets and preserve key text. | mobile surface | lg |
| Tablet | Keep the component close to its related card or movement context. | context panel | md |
| Desktop | Use compact density only when scanability remains intact. | admin surface | sm |

## Playground

Use the playground to verify masked number, status, variant, state, and summary metrics for one card.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Card Summary |  |
| variant | select | physical | physical, virtual, compact, limit |
| state | select | default | default, hover, focus, active, warning, frozen, disabled |
| fullWidth | checkbox | false |  |

## API And Foundations

Card Summary API exposes label, metadata, masked number, status, metrics, variant, state, density, and icon while Flow owns visual composition and privacy boundaries.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | Yes | Card summary label. |
| meta | string | No | Short account or product metadata. |
| number | string | No | Masked or display-safe card number. |
| expires | string | No | Display-safe expiry label. |
| status | CardSummaryStatus | No | Visible card status composed with Badge. |
| metrics | CardSummaryMetric[] | No | One or two local card metrics. |
| variant | physical \| virtual \| compact \| limit | No | Single-card visual emphasis. |
| state | default \| hover \| focus \| active \| warning \| frozen \| disabled | No | Component state. |
| density | sm \| md \| lg | No | Inherited Flow density. |
| icon | string | No | Supporting system icon. |
| fullWidth | boolean | No | Fill a sheet or header surface. |
| disabled | boolean | No | Maps to disabled state. |

## Implementation Checklist

- Provide `label`: Card summary label.
- Masked number only
- Status text visible
- Metric truncation
- Focus ring when interactive
- Frozen state
- Mobile compact layout

## Tests And Rejection Rules

Must test:

- Masked number only
- Status text visible
- Metric truncation
- Focus ring when interactive
- Frozen state
- Mobile compact layout

Reject if:

- Full card number is exposed.
- Card Summary owns freeze, replace, dispute, or wallet flows.
- Multiple cards are managed inside one component.
- Status is color-only.

## MIEL

MIEL treats Card Summary as one safe payment-card snapshot. It can choose physical, virtual, compact, or limit emphasis, but must escalate wallet controls and card lifecycle actions to patterns.

Agents can decide:

- Use Card Summary for wallet header, driver card preview, admin card row expansion, or mobile card sheet header.
- Keep identifiers masked and metrics limited to one or two values.
- Use frozen or warning state only with visible copy.

Agents must ask:

- The card surface needs lifecycle actions, support, dispute, replacement, or spending controls.
- Sensitive card data, compliance copy, or account ownership is unclear.
- Multiple cards need comparison or wallet-level behavior.

Agents must reject:

- Full card number is exposed.
- Card Summary owns freeze, replace, dispute, or wallet flows.
- Multiple cards are managed inside one component.
- Status is color-only.

Handoff language:

> I am using Card Summary for one card snapshot. Please confirm masking, status copy, visible metrics, privacy constraints, and whether actions should move to a card-detail pattern.
