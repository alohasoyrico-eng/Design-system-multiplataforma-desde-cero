# Movement Row

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/movement-row/all.json`

## Purpose

Use Movement Row for one transaction record: category icon, merchant/context, signed amount, and visible status. Receipt detail, support, dispute, export, and grouped timelines remain patterns.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Breakpoints`, `Focus`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.movement-row.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.state.*`, `sys.momentum.*`, `sys.accessibility.*`

Gaps or review gates:

- Row contains receipt detail process.
- Support, dispute, or export actions live inside the component.
- Amount or status disappears on mobile.
- Status is color-only.
- Ask before build: The user needs receipt detail, dispute, export, support, or audit history.
- Ask before build: Amount formatting, currency, or source status is unclear.
- Ask before build: Rows need grouping, sticky dates, or timeline orchestration.

## Use When

- Use Movement Row for card activity, fuel purchases, refunds, declined movements, and pending transactions.
- Keep the row to one record with one amount and one visible status.
- Use compact variant in dense mobile sheets when amount remains visible.

## Do Not Use Without Review

- Ask before use when the user needs receipt detail, dispute, export, support, or audit history.
- Ask before use when amount formatting, currency, or source status is unclear.
- Ask before use when rows need grouping, sticky dates, or timeline orchestration.
- Row contains receipt detail process.
- Support, dispute, or export actions live inside the component.
- Amount or status disappears on mobile.
- Status is color-only.

## Operational Example

Use Movement Row for one transaction record: category icon, merchant/context, signed amount, and visible status. Receipt detail, support, dispute, export, and grouped timelines remain patterns.

### Why Movement Row

- The ZIP TransactionRow is a list row, not a pill button; Flow now follows that anatomy.
- Category color is support only; title, meta, signed amount, and status stay visible as text.
- Movement detail, support, dispute, export, and day grouping escalate to patterns.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Row surface | One tappable or readable movement record. | sys.frame.*, comp.movement-row.* |
| Icon | Communicates movement category. | sys.symbol.* |
| Primary text | Merchant or movement title. | sys.voice.* |
| Metadata | Date, station, vehicle, or card context. | sys.growth.* |
| Amount and status | Shows value and approval state with text. | sys.state.* |

## Accessibility

State precedence: disabled, error, pending, focus, hover, default

- Provide a visible accessible label for the component.
- Expose status and state in text, not color alone.
- Keep keyboard focus and touch targets predictable.
- Protect sensitive or operational data from overexposure.
- Escalate to a pattern when actions, grouping, or detail flows exceed one component.

## Foundations

Referenced token families:

- `comp.movement-row.*`
- `sys.frame.*`
- `sys.growth.*`
- `sys.state.*`
- `sys.symbol.*`
- `sys.voice.*`

Movement Row API exposes label, meta, amount, status, icon, variant, and state while Design System owns row geometry, focus, and state precedence.

## Variants

Movement Row variants adjust transaction type and density; movement detail and support flows remain patterns.

Approved variants from demos: `standard`, `refund`, `declined`, `compact`

Demo labels:

- Standard
- Refund
- Declined
- Compact

## States

Movement Row states communicate hover, focus, pending, error, and disabled behavior for one record. Completed transactions do not need an extra approved label.

Supported states from docs: `default`, `hover`, `focus`, `pending`, `error`, `disabled`

## Variant X State Behavior

Variant controls transaction emphasis; state controls processing or risk without adding detail system behavior.

State matrix: `default`, `hover`, `focus`, `pending`, `error`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Standard | standard |  |
| Refund | refund |  |
| Declined | declined |  |

## Full Width

Movement Row can fill list containers and sheets while keeping each row to one record.

- Mobile sheet: layout: button-stack
- Dense panel: layout: button-stack
- Admin surface: layout: button-stack

## Responsive Layout Patterns

On phones, stack amount below content when needed; do not hide status or amount.

| Example | Layout | Density |
| --- | --- | --- |
| Phone | button-stack | lg |
| Desktop | simple-demo-row | md |

## Viewport Organization

Viewport rules protect scanability for one record and do not create grouped timeline behavior.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Use touch-safe targets and preserve key text. | mobile surface | lg |
| Tablet | Keep the component close to its related card or movement context. | context panel | md |
| Desktop | Use compact density only when scanability remains intact. | admin surface | sm |

## Playground

Use the playground to verify title, metadata, amount, status, variant, and state for one movement.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Movement Row |  |
| variant | select | standard | standard, refund, declined, compact |
| state | select | default | default, hover, focus, pending, error, disabled |
| fullWidth | checkbox | false |  |

## API And Foundations

Movement Row API exposes label, meta, amount, status, icon, variant, and state while Design System owns row geometry, focus, and state precedence.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | Yes | Movement title. |
| meta | string | No | Movement metadata. |
| amount | string | No | Display-safe signed amount. |
| status | MovementStatus | No | Visible row status. |
| category | fuel \| charge \| toll \| food \| transfer \| income | No | Category icon and support tone. |
| variant | standard \| refund \| declined \| compact | No | Movement emphasis. |
| state | default \| hover \| focus \| pending \| error \| disabled | No | Row state. |
| density | sm \| md \| lg | No | Inherited Flow density. |
| fullWidth | boolean | No | Fill list container. |
| disabled | boolean | No | Disables row interaction. |

## Implementation Checklist

- Provide `label`: Movement title.
- Long label wrapping
- Amount visibility
- Status text visible
- Keyboard focus
- Pending state
- Mobile stacked layout

## Tests And Rejection Rules

Must test:

- Long label wrapping
- Amount visibility
- Status text visible
- Keyboard focus
- Pending state
- Mobile stacked layout

Reject if:

- Row contains receipt detail process.
- Support, dispute, or export actions live inside the component.
- Amount or status disappears on mobile.
- Status is color-only.

## MIEL

MIEL treats Movement Row as one list record. Agents may place it inside movement lists, while humans confirm status language, amount formatting, and whether detail/support behavior belongs to a pattern.

Agents can decide:

- Use Movement Row for card activity, fuel purchases, refunds, declined movements, and pending transactions.
- Keep the row to one record with one amount and one visible status.
- Use compact variant in dense mobile sheets when amount remains visible.

Agents must ask:

- The user needs receipt detail, dispute, export, support, or audit history.
- Amount formatting, currency, or source status is unclear.
- Rows need grouping, sticky dates, or timeline orchestration.

Agents must reject:

- Row contains receipt detail process.
- Support, dispute, or export actions live inside the component.
- Amount or status disappears on mobile.
- Status is color-only.

Handoff language:

> I am using Movement Row for one transaction record. Please confirm amount format, status copy, metadata, tap target behavior, and whether detail/support belongs to a movement-detail pattern.
