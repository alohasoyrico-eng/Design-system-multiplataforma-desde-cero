# Chip

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/chip/all.json`

## Purpose

Use Chip for compact filters, attributes, or suggested values that need selection, removal, or quick recognition without becoming a full Button.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Iconography`, `Motion Curves`, `Duration`, `Density`, `Focus`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.chip.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.state.*`, `sys.accessibility.*`

Gaps or review gates:

- Primary action replacement
- Color-only selected
- Unnamed remove action
- Ask before build: The chip changes permissions, cost, compliance, or hidden filter logic.
- Ask before build: The filter grouping or source of truth is unclear.
- Ask before build: The chip might be a Button, Tab, or Select instead.

## Use When

- Use Chip for active filters, input tokens, suggestions, or compact attributes.
- Set selected and removable when product behavior is explicit.
- Choose icons only when they clarify the visible label.

## Do Not Use Without Review

- Ask before use when the chip changes permissions, cost, compliance, or hidden filter logic.
- Ask before use when the filter grouping or source of truth is unclear.
- Ask before use when the chip might be a Button, Tab, or Select instead.
- Chip is used as the primary action.
- Selected state is not machine-readable.
- Remove behavior is unclear or destructive.
- Chip replaces a Button for primary action.
- Selected is color-only.
- Remove icon has no accessible action.
- Chip group hides required filter controls.

## Operational Example

Use Chip for compact filters, attributes, or suggested values that need selection, removal, or quick recognition without becoming a full Button.

### Why Chip

- Chips keep applied criteria visible near the content they affect.
- Selected and removable states are explicit instead of hidden in a filter summary.
- Chip is compact enough for filter bars, tables, and cards.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Container | Owns pill shape, border, surface, density, and focus. | comp.chip.*, sys.frame.*, sys.energy.*, sys.state.* |
| Label | Names the filter, attribute, or suggestion in plain language. | sys.voice.* |
| Leading icon | Optional icon supports recognition without replacing the label. | sys.symbol.* |
| Remove affordance | Optional close icon removes an applied criterion and keeps a named action. | sys.accessibility.*, sys.iconography.* |

## Accessibility

State precedence: disabled, focus, pressed, selected, hover, default

- Use button semantics when Chip is interactive.
- Expose selected state with aria-pressed when it toggles.
- Give removable chips a clear remove action.
- Keep the visible label as the accessible name.
- Do not rely on color alone for selected state.

## Foundations

Referenced token families:

- `comp.chip.*`
- `sys.accessibility.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.iconography.*`
- `sys.state.*`
- `sys.symbol.*`
- `sys.voice.*`

Chip API exposes label, variant, state, selected, removable, and optional icon while Design System foundations own surface, focus, density, and motion.

## Variants

Chip variants describe whether the pill filters, displays an input token, suggests a value, or works as a compact assistive action.

Approved variants from demos: `filter`, `input`, `suggestion`, `assist`

Demo labels:

- North region
- Driver ID
- EV fleet
- Export ready

## States

Chip states communicate availability, hover, press, focus, selection, and disabled context while the pill size remains stable.

Supported states from docs: `default`, `hover`, `pressed`, `selected`, `focus`, `disabled`

## Variant X State Behavior

Variant defines chip purpose; state defines interaction. Disabled wins before focus, press, selected, hover, and default.

State matrix: `default`, `hover`, `pressed`, `selected`, `focus`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Filter | filter |  |
| Input | input |  |
| Suggestion | suggestion |  |

## Full Width

Chip keeps intrinsic width. Containers may wrap or scroll chip groups, but an individual chip does not stretch.

- Filter row: layout: row
- Input token: layout: row
- Suggestions: layout: row

## Responsive Layout Patterns

Responsive chip groups wrap in roomy layouts and scroll horizontally only when filters must stay on one line.

| Example | Layout | Density |
| --- | --- | --- |
| Mobile filters | simple-demo-row | lg |
| Desktop dashboard | simple-demo-row | sm |

## Viewport Organization

Use chips as scan-friendly filters in mobile stacks and dense dashboards, but move complex filtering into patterns.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Show the highest-value filters first and allow wrap. | wrap | lg |
| Tablet | Use grouped filter rows with clear removal. | filter row | md |
| Desktop | Use chip sets near tables or dashboards without replacing filter forms. | dense row | sm |

## Playground

Use the playground to test label length, selected state, removable affordance, icon, and variant before placing Chip in filter bars or data surfaces.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | North region |  |
| variant | select | filter | filter, input, suggestion, assist |
| state | select | selected | default, hover, pressed, selected, focus, disabled |
| removable | checkbox | true |  |

## API And Foundations

Chip API exposes label, variant, state, selected, removable, and optional icon while Design System foundations own surface, focus, density, and motion.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | Yes | Chip label. |
| interactive | boolean | No | Forces button semantics when Chip previews an interactive state. |
| state | ChipState | No | Interaction state: default, hover, pressed, selected, focus, or disabled. |
| tone | ChipTone | No | Optional semantic treatment for warning or danger filters. |
| variant | ChipVariant | No | Purpose variant: filter, input, suggestion, or assist. |
| selected | boolean | No | Marks the chip as selected. |
| disabled | boolean | No | Disables chip interaction. |
| removable | boolean | No | Shows remove affordance and enables remove behavior. |
| icon | IconName | No | Decorative leading icon. |
| onRemoveLabel | string | No | Accessible remove label. |
| onRemove | (label: string) => void | No | Called when a removable chip is removed. |
| onSelectedChange | (selected: boolean) => void | No | Called when local selection changes. |

## Implementation Checklist

- Provide `label`: Chip label.
- Label remains visible
- Selected state is exposed
- Remove affordance works
- Focus ring is visible
- Long labels wrap safely

## Tests And Rejection Rules

Must test:

- Label remains visible
- Selected state is exposed
- Remove affordance works
- Focus ring is visible
- Long labels wrap safely

Reject if:

- Chip replaces a Button for primary action.
- Selected is color-only.
- Remove icon has no accessible action.
- Chip group hides required filter controls.

## MIEL

MIEL treats Chip as a compact filter or token decision: agents can assemble labels and selected/removable states when the filter meaning is explicit, while humans own policy and grouping.

Agents can decide:

- Use Chip for active filters, input tokens, suggestions, or compact attributes.
- Set selected and removable when product behavior is explicit.
- Choose icons only when they clarify the visible label.

Agents must ask:

- The chip changes permissions, cost, compliance, or hidden filter logic.
- The filter grouping or source of truth is unclear.
- The chip might be a Button, Tab, or Select instead.

Agents must reject:

- Chip is used as the primary action.
- Selected state is not machine-readable.
- Remove behavior is unclear or destructive.

Handoff language:

> I am using Chip for compact filter or token UI. I need confirmation on filter source, selected/removable behavior, and whether a larger pattern owns the group.
