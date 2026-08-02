# Table

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/table/all.json`

## Purpose

Use Table when users need to compare structured records by columns, sort values, and inspect row-level detail.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Breakpoints`, `Focus`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.table.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.depth.*`, `sys.state.*`, `sys.accessibility.*`

Gaps or review gates:

- Table used only for layout
- Sortable headers not buttons
- Rows lack stable identity
- Raw visual values
- Ask before build: Columns contain sensitive data.
- Ask before build: Bulk or destructive row actions are needed.
- Ask before build: Phone layout cannot preserve comparison.

## Use When

- Use Table for repeated records with shared fields.
- Use sortable columns for comparable metrics.
- Use expandable detail when row context is secondary.

## Do Not Use Without Review

- Ask before use when columns contain sensitive data.
- Ask before use when bulk or destructive row actions are needed.
- Ask before use when phone layout cannot preserve comparison.
- A table is used for decorative layout.
- Sort, selection, or expansion behavior is fake.
- Row identity and keyboard behavior are undefined.
- Table is used only for layout.
- Sortable headers are not buttons.
- Rows cannot be identified by stable keys.
- Raw visual values are used.

## Operational Example

Use Table when users need to compare structured records by columns, sort values, and inspect row-level detail.

### Why Table

- Table supports scanning and comparison better than cards when records share the same fields.
- The ZIP reference uses a card surface, sunken header, compact overline headers, sortable arrows, selected rows, and optional detail rows.
- Use it for structured records; use List or Card when comparison is not the main task.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Container | Wraps the table in a stable card surface. | comp.table.*, sys.energy.*, sys.depth.* |
| Header row | Names columns and exposes sort controls when sortable. | sys.voice.*, sys.state.* |
| Body rows | Show comparable records with consistent alignment. | sys.frame.*, sys.typography.* |
| Selection rail | Marks selected rows without changing column meaning. | sys.state.*, sys.energy.* |
| Detail row | Optional secondary row for row-specific detail. | sys.growth.*, sys.accessibility.* |

## Accessibility

State precedence: expanded, selected, sorted, focus, hover, default

- Use table semantics for comparable records.
- Use scope col on column headers.
- Expose aria-sort on sortable columns.
- Keep row actions keyboard reachable without making the whole table ambiguous.
- Do not use Table for layout-only grids.

## Foundations

Referenced token families:

- `comp.table.*`
- `sys.accessibility.*`
- `sys.depth.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.growth.*`
- `sys.state.*`
- `sys.typography.*`
- `sys.voice.*`

Table API exposes columns, rows, row identity, sorting, selection, expansion, and density while Design System foundations own surface, spacing, typography, focus, and accessibility.

## Variants

Table variants describe comparison density and interaction: standard, dense, sortable, selectable, and expandable.

Approved variants from demos: `standard`, `dense`, `sortable`, `selectable`, `expandable`

Demo labels:

- Standard
- Dense
- Sortable
- Selectable
- Expandable

## States

Table states communicate row focus, hover, selected records, sorted columns, expanded detail, and default availability.

Supported states from docs: `default`, `hover`, `focus`, `selected`, `sorted`, `expanded`

## Variant X State Behavior

Variant defines the table capability; state identifies the current sort, selection, focus, hover, or detail expansion.

State matrix: `default`, `hover`, `focus`, `selected`, `sorted`, `expanded`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Standard | standard |  |
| Sortable | sortable |  |
| Expandable | expandable |  |

## Full Width

Table usually fills its container so columns can breathe; avoid forcing many columns into narrow cards.

- Standard width: layout: full container
- Sortable width: layout: full container
- Expandable width: layout: full container

## Responsive Layout Patterns

Use Table where the viewport can support column comparison. On phones, reduce columns or escalate to a list pattern.

| Example | Layout | Density |
| --- | --- | --- |
| Phone reduced columns | simple-demo-row | lg |
| Desktop comparison | simple-demo-row | sm |

## Viewport Organization

Keep Table for comparison tasks. Use List on constrained phones and Drawer or Dialog for row detail when expansion becomes too heavy.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Use reduced columns or a list pattern. | reduced table | lg |
| Tablet | Keep key columns visible and move row detail behind expansion. | compact table | md |
| Desktop | Use sorting, selection, and detail rows for high-volume comparison. | data table | sm |

## Playground

Use the playground to verify variant, state, density, sort behavior, selected row, and expandable detail.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Fleet spend table |  |
| variant | select | standard | standard, dense, sortable, selectable, expandable |
| state | select | default | default, hover, focus, selected, sorted, expanded |
| dense | checkbox | false |  |

## API And Foundations

Table API exposes columns, rows, row identity, sorting, selection, expansion, and density while Design System foundations own surface, spacing, typography, focus, and accessibility.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| columns | TableColumn[] | Yes | Column definitions with label, key, align, mono, render, and sort behavior. |
| rows | TableRow[] | Yes | Comparable records. |
| rowKey | string | No | Stable row identifier. |
| label | string | No | Accessible table label. |
| variant | standard \| dense \| sortable \| selectable \| expandable | No | Table comparison capability. |
| state | default \| hover \| focus \| selected \| sorted \| expanded | No | Demo or controlled table state. |
| density | sm \| md \| lg | No | Density context. |
| dense | boolean | No | Alias for compact density. |
| sortKey | string | No | Current sorted column key. |
| sortDir | ascending \| descending | No | Current sort direction. |
| selectedKey | string | No | Current selected row key. |
| expandedKey | string | No | Current expanded row key. |
| renderDetail | (row: TableRow) => Node \| string | No | Bounded row detail content. |
| onSortChange | (sort: { key: string; direction: SortDirection }) => void | No | Called when local sort is requested. |
| onRowSelect | (key: string) => void | No | Called when a row is selected. |
| onExpandedChange | (key: string) => void | No | Called when row expansion changes. |

## Implementation Checklist

- Provide `columns`: Column definitions with label, key, align, mono, render, and sort behavior.
- Provide `rows`: Comparable records.
- Column header semantics
- aria-sort
- Keyboard focus
- Selected row visibility
- Expandable detail
- Phone reduced layout

## Tests And Rejection Rules

Must test:

- Column header semantics
- aria-sort
- Keyboard focus
- Selected row visibility
- Expandable detail
- Phone reduced layout

Reject if:

- Table is used only for layout.
- Sortable headers are not buttons.
- Rows cannot be identified by stable keys.
- Raw visual values are used.

## MIEL

MIEL treats Table as structured comparison: agents can build columns and rows when the schema is clear, while humans confirm priority, privacy, and row actions.

Agents can decide:

- Use Table for repeated records with shared fields.
- Use sortable columns for comparable metrics.
- Use expandable detail when row context is secondary.

Agents must ask:

- Columns contain sensitive data.
- Bulk or destructive row actions are needed.
- Phone layout cannot preserve comparison.

Agents must reject:

- A table is used for decorative layout.
- Sort, selection, or expansion behavior is fake.
- Row identity and keyboard behavior are undefined.

Handoff language:

> I am using Table for record comparison. Please confirm columns, row identity, sortable fields, selection rules, and what happens on constrained viewports.
