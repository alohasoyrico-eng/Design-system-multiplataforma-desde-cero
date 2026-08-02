# Combobox

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/combobox/all.json`

## Purpose

Use Combobox when people need to type, narrow, and choose one known operational value without leaving the field context.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Density`, `Focus`, `Disabled`

Component dependencies: `input`, `select`

Token dependencies: `comp.input.*`, `comp.select.*`, `sys.energy.*`, `sys.voice.*`, `sys.frame.*`, `sys.depth.*`, `sys.momentum.*`, `sys.state.*`, `sys.accessibility.*`

Reference translation: Adapt - The ZIP includes SelectCombo and Combobox. Flow promotes the ARIA/HTML convention name Combobox and translates the reference look, option layer, clear action, and chevron motion through Design System foundations and primitives.

Gaps or review gates:

- Owns global search
- Allows multiple selected values
- Empty state is hidden
- Raw color, spacing, motion, or typography values are used
- Ask before build: Options load remotely, affect URL/query state, or trigger side effects.
- Ask before build: The user can select multiple values.
- Ask before build: The search behaves like global navigation, commands, or support lookup across systems.

## Use When

- Use Combobox for one known entity list with typed narrowing.
- Use Select instead when typing is unnecessary.
- Keep option metadata short and text-backed.

## Do Not Use Without Review

- Ask before use when options load remotely, affect URL/query state, or trigger side effects.
- Ask before use when the user can select multiple values.
- Ask before use when the search behaves like global navigation, commands, or support lookup across systems.
- Combobox becomes a command palette, global search, or multi-select.
- The option layer lacks visible empty-state copy.
- Selected value and active option are not machine-readable.
- Combobox owns global search or command execution.
- Options are visual-only.
- Empty results are silent.
- It allows multiple selected values.
- Raw color, spacing, motion, or typography values are used.

## Operational Example

Use Combobox when people need to type, narrow, and choose one known operational value without leaving the field context.

### Why Combobox

- It covers the SelectCombo and Combobox references without expanding base Select.
- It owns one editable field, filtered options, active option, empty state, clear action, and keyboard selection.
- Global search, command palettes, async query policy, and multi-select remain patterns or separate components.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Field shell | Owns visible label, helper, density, validation, and disabled state. | comp.input.*, sys.voice.*, sys.frame.* |
| Editable input | Accepts typed filtering while preserving the selected option as text. | comp.input.*, sys.accessibility.* |
| Leading icon | Signals search or entity type without replacing label text. | sys.iconography.*, sys.symbol.* |
| Clear action | Clears local selection/value as a field action. | comp.input.*, sys.state.* |
| Option layer | Shows filtered known options, metadata, selected state, and empty feedback. | comp.select.*, sys.depth.*, sys.momentum.* |

## Accessibility

State precedence: disabled, error, open, focus, empty, filled, default

- Use a visible label associated with the editable combobox input.
- Expose aria-autocomplete=list, aria-expanded, aria-controls, and aria-activedescendant.
- Keep option text and metadata available as text, not icon-only.
- Show visible empty-state copy when filtering has no matches.
- Return focus to the input after selecting or clearing.

## Foundations

Referenced token families:

- `comp.input.*`
- `comp.select.*`
- `sys.accessibility.*`
- `sys.depth.*`
- `sys.frame.*`
- `sys.iconography.*`
- `sys.momentum.*`
- `sys.state.*`
- `sys.symbol.*`
- `sys.voice.*`

Combobox API exposes one editable selection field. Design System owns field shell, option layer, state, accessibility, density, and motion; product code owns option data and search policy beyond local filtering.

## Variants

Combobox has one base variant for editable single selection. Entity-specific filtering changes option content, not component anatomy.

Approved variants from demos: `default`

Demo labels:

- Vehicle lookup
- Driver lookup
- Fleet lookup
- Owner lookup

## States

Combobox states communicate typed filtering, open options, selected value, empty results, error, and disabled behavior.

Supported states from docs: `default`, `filled`, `focus`, `open`, `empty`, `error`, `disabled`

## Variant X State Behavior

Variant stays stable; state controls open, empty, error, selected, and disabled behavior.

State matrix: `default`, `filled`, `focus`, `open`, `empty`, `error`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Vehicle |  |  |
| Driver |  |  |
| Owner |  |  |

## Full Width

Combobox may fill form columns, filters, and drawers while the option layer follows the field width.

- Form field: layout: button-stack
- Filter row: layout: button-stack
- Support lookup: layout: button-stack

## Responsive Layout Patterns

Use roomy density for touch contexts and keep typed value, clear action, and option layer legible before placing Combobox inside a larger filter pattern.

| Example | Layout | Density |
| --- | --- | --- |
| Phone field | button-stack | lg |
| Desktop filter | simple-demo-row | sm |

## Viewport Organization

Combobox remains one editable selection field. Viewport rules decide density and option layer width; query orchestration belongs to patterns.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Use large density and avoid dense multi-column option content. | single field | lg |
| Tablet | Keep helper copy close to the field and listbox. | form column | md |
| Desktop | Use compact density in filter rows only when typed value remains readable. | filter row | sm |

## Playground

Use the playground to verify label, value, placeholder, options, empty copy, density, and state.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Vehicle |  |
| value | text | MX-4821 - Ana Gomez |  |
| placeholder | text | Search or select |  |
| state | select | filled | default, filled, focus, open, empty, error, disabled |
| density | select | md | sm, md, lg |

## API And Foundations

Combobox API exposes one editable selection field. Design System owns field shell, option layer, state, accessibility, density, and motion; product code owns option data and search policy beyond local filtering.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | Yes | Visible field label. |
| value | string | No | Selected value or current input value. |
| name | string | No | Native field name for form submission. |
| options | Array<{ label: string, value?: string, meta?: string, disabled?: boolean }> | Yes | Known options filtered locally. |
| helper | string | No | Short guidance or recovery copy. |
| icon | string | No | Leading Material Symbol. |
| placeholder | string | No | Prompt shown before typing. |
| emptyText | string | No | Visible no-results copy. |
| disabled | boolean | No | Disables the editable field. |
| density | "sm" \| "md" \| "lg" | No | Maps to field density. |
| state | "default" \| "open" \| "focus" \| "filled" \| "empty" \| "error" \| "disabled" | No | Semantic demo or controlled state. |
| onValueChange | (value, meta) => void | No | Called for typed input, selected option, and clear action. |

## Implementation Checklist

- Provide `label`: Visible field label.
- Provide `options`: Known options filtered locally.
- Label association
- aria-autocomplete and listbox wiring
- Typing filters options
- Keyboard selection
- Clear action
- Empty results
- Disabled and error states
- Responsive option layer

## Tests And Rejection Rules

Must test:

- Label association
- aria-autocomplete and listbox wiring
- Typing filters options
- Keyboard selection
- Clear action
- Empty results
- Disabled and error states
- Responsive option layer

Reject if:

- Combobox owns global search or command execution.
- Options are visual-only.
- Empty results are silent.
- It allows multiple selected values.
- Raw color, spacing, motion, or typography values are used.

## MIEL

MIEL treats Combobox as one editable selection field: agents can use it when the choices are known and local filtering is enough, while humans confirm data source, empty state, and escalation to patterns.

Agents can decide:

- Use Combobox for one known entity list with typed narrowing.
- Use Select instead when typing is unnecessary.
- Keep option metadata short and text-backed.

Agents must ask:

- Options load remotely, affect URL/query state, or trigger side effects.
- The user can select multiple values.
- The search behaves like global navigation, commands, or support lookup across systems.

Agents must reject:

- Combobox becomes a command palette, global search, or multi-select.
- The option layer lacks visible empty-state copy.
- Selected value and active option are not machine-readable.

Handoff language:

> I am using Combobox for one editable known-value selection. Please confirm option source, filtering policy, empty copy, keyboard behavior, and whether this should escalate to a pattern.
