# List

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/list/all.json`

## Purpose

Use List to scan comparable records when each row leads to detail, action, or review.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Breakpoints`, `Focus`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.list.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.state.*`, `sys.momentum.*`, `sys.accessibility.*`

Gaps or review gates:

- No visible row label
- Table comparison hidden as List
- Color-only state
- Raw values
- Ask before build: Rows need bulk actions or column comparison.
- Ask before build: A row action changes money, permissions, or status.
- Ask before build: Selection changes downstream filters or process.

## Use When

- Use List for movements, notifications, audit snippets, and support queues.
- Use compact density for logs with short metadata.
- Use status rows when risk or availability changes the row meaning.

## Do Not Use Without Review

- Ask before use when rows need bulk actions or column comparison.
- Ask before use when a row action changes money, permissions, or status.
- Ask before use when selection changes downstream filters or process.
- The list hides required row labels.
- The agent uses List where Table is needed.
- Row state is color-only.
- Rows have no visible label.
- List is used for tabular comparison.
- Selection is color-only.
- Raw visual values are used.

## Operational Example

Use List to scan comparable records when each row leads to detail, action, or review.

### Why List

- List keeps repeated operational items scannable before a table is needed.
- Rows keep icon, label, metadata, and value aligned without inventing a card per item.
- Use Table when comparison needs columns, sorting, or bulk action.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Container | Owns grouping, width, border, and row rhythm. | comp.list.*, sys.frame.*, sys.energy.* |
| Row | Carries one navigable or readable record. | sys.state.*, sys.accessibility.* |
| Icon | Supports record type without replacing the label. | sys.symbol.*, sys.iconography.* |
| Label and metadata | Use concise name and secondary context. | sys.voice.*, sys.tone.* |
| Value | Optional aligned amount or status value. | sys.voice.*, sys.energy.* |

## Accessibility

State precedence: disabled, loading, error, selected, hover, default

- Use list semantics for non-tabular records.
- Use buttons or links when rows navigate or act.
- Keep visible labels; icons are never the only row name.
- Expose selected state when row selection changes behavior.
- Do not rely on color alone for error or selected state.

## Foundations

Referenced token families:

- `comp.list.*`
- `sys.accessibility.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.iconography.*`
- `sys.state.*`
- `sys.symbol.*`
- `sys.tone.*`
- `sys.voice.*`

List API exposes item data, variant, state, selection, and action model while Design System owns row rhythm and semantics.

## Variants

List variants describe row density and job: standard records, compact logs, action rows, status rows, and media rows.

Approved variants from demos: `standard`, `compact`, `action`, `status`, `media`

Demo labels:

- Standard
- Compact
- Action
- Status
- Media

## States

List states communicate availability, selection, loading, error, hover, and default readability.

Supported states from docs: `default`, `hover`, `selected`, `loading`, `error`, `disabled`

## Variant X State Behavior

Variant defines the row job; state defines interaction and feedback without changing the list structure.

State matrix: `default`, `hover`, `selected`, `loading`, `error`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Standard | standard |  |
| Action | action |  |
| Status | status |  |

## Full Width

List can fill its parent when used in sheets, cards, and detail panes.

- Sheet list: layout: button-stack
- Detail pane: layout: button-stack
- Compact log: layout: button-stack

## Responsive Layout Patterns

Use one column across viewports; density changes row rhythm, not the information order.

| Example | Layout | Density |
| --- | --- | --- |
| Phone | button-stack | lg |
| Desktop | button-stack | sm |

## Viewport Organization

List works best where records need vertical scanning before comparison.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Use one comfortable column with strong labels. | single column | lg |
| Tablet | Use in panels or sheets with visible metadata. | panel list | md |
| Desktop | Use compact lists for logs; switch to Table for comparison. | compact log | sm |

## Playground

Use the playground to verify variant, state, interactivity, visible value, and row icon behavior.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Fuel movement approved |  |
| meta | text | Ana Sosa · Today |  |
| variant | select | standard | standard, compact, action, status, media |
| state | select | default | default, hover, selected, loading, error, disabled |

## API And Foundations

List API exposes item data, variant, state, selection, and action model while Design System owns row rhythm and semantics.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| items | ListItem[] | Yes | Records to render. |
| variant | standard \| compact \| action \| status \| media | No | Row job and visual emphasis. |
| state | default \| hover \| selected \| loading \| error \| disabled | No | List-wide fallback state for demos or controlled examples. |
| interactive | boolean | No | Renders rows as buttons when a row acts or navigates. |
| label | string | No | Accessible list label. |
| density | sm \| md \| lg | No | Row density from Flow density context. |
| onSelect | (key: string) => void | No | Called when an interactive row is selected. |

## Implementation Checklist

- Provide `items`: Records to render.
- List semantics
- Keyboard row access
- Selected state
- Error row copy
- Responsive wrapping
- Icon-only rejection

## Tests And Rejection Rules

Must test:

- List semantics
- Keyboard row access
- Selected state
- Error row copy
- Responsive wrapping
- Icon-only rejection

Reject if:

- Rows have no visible label.
- List is used for tabular comparison.
- Selection is color-only.
- Raw visual values are used.

## MIEL

MIEL treats List as repeated record structure: agents may place it for scan-first records, but humans confirm navigation, selection, and when Table is required.

Agents can decide:

- Use List for movements, notifications, audit snippets, and support queues.
- Use compact density for logs with short metadata.
- Use status rows when risk or availability changes the row meaning.

Agents must ask:

- Rows need bulk actions or column comparison.
- A row action changes money, permissions, or status.
- Selection changes downstream filters or process.

Agents must reject:

- The list hides required row labels.
- The agent uses List where Table is needed.
- Row state is color-only.

Handoff language:

> I am using List for repeated records. Please confirm row action, selection behavior, metadata priority, and whether this should become Table.
