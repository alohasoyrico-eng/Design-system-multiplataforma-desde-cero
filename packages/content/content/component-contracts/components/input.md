# Input

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/input/operational-example.json`
- `packages/content/content/component-copy/components/input/anatomy.json`
- `packages/content/content/component-copy/components/input/accessibility.json`
- `packages/content/content/component-copy/components/input/variants.json`
- `packages/content/content/component-copy/components/input/states.json`
- `packages/content/content/component-copy/components/input/variant-state-behavior.json`
- `packages/content/content/component-copy/components/input/full-width.json`
- `packages/content/content/component-copy/components/input/responsive-layout-patterns.json`
- `packages/content/content/component-copy/components/input/viewport-organization.json`
- `packages/content/content/component-copy/components/input/playground.json`
- `packages/content/content/component-copy/components/input/guidelines.json`
- `packages/content/content/component-copy/components/input/api-foundations.json`
- `packages/content/content/component-copy/components/input/tests-rejection-rules.json`
- `packages/content/content/component-copy/components/input/miel.json`

## Purpose

Use Input when someone must enter or edit a short free-form value with visible guidance, validation, and recovery.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Iconography`, `Motion Curves`, `Duration`, `Density`, `Focus`, `Loading`, `Disabled`, `Message`, `Field Action`

Component dependencies: `None declared`

Token dependencies: `comp.input.*`, `sys.energy.*`, `sys.voice.*`, `sys.frame.*`, `sys.state.*`, `sys.momentum.*`, `sys.accessibility.*`, `sys.symbol.*`

Reference translation: Adapt - Adopt the reference field discipline, but express surface, typography, state, density, and motion through Design System foundations and primitives.

Gaps or review gates:

- Label is missing or only placeholder exists.
- Error state is visual only.
- Value is cleared during async validation.
- A field-local action uses one-off Icon Button styling instead of Field Action.
- Raw color, spacing, radius, or motion bypasses tokens.
- Ask before build: Validation, mask, formatter, required rule, or error copy is unknown.
- Ask before build: The value affects money, permissions, identity, compliance, or audit.
- Ask before build: The experience needs suggestions, autocomplete, scanner input, or a multi-field pattern.

## Use When

- Use Input when the value cannot be selected from a finite list.
- Configure label, placeholder, helper, value, density, icon, suffix, and visible state.
- Place the field in a form, filter, stack, or row when grouping is already clear.

## Do Not Use Without Review

- Ask before use when validation, mask, formatter, required rule, or error copy is unknown.
- Ask before use when the value affects money, permissions, identity, compliance, or audit.
- Ask before use when the experience needs suggestions, autocomplete, scanner input, or a multi-field pattern.
- Placeholder is the only label.
- Error, disabled, or loading state removes the value or explanation.
- The field is used for closed-choice data that should be Select.
- The agent invents a formatter, mask, or validation rule.
- Error is only a color.
- Value disappears during loading or validation.
- Scale bypasses Density or uses raw spacing.
- A field-local action is implemented as a one-off icon button style instead of the Field Action primitive.

## Operational Example

Use Input when someone must enter or edit a short free-form value with visible guidance, validation, and recovery.

### Why Input

- Accepts values that cannot be pre-enumerated.
- Keeps label and helper visible while typing.
- Makes validation and recovery explicit.

Scenario type: `field-group`

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Input wrapper | Groups label, input, helper, and state so the field moves as one component. | comp.input.*, sys.frame.* |
| Label | Names the value and remains visible before, during, and after input. | sys.voice.* |
| Input surface | Holds value, placeholder, focus, disabled, loading, and error styles. | sys.energy.*, sys.state.*, sys.momentum.* |
| Helper text | Explains format, source, validation, or recovery. | sys.voice.*, sys.accessibility.* |
| Affordance | Optional leading icon or non-interactive qualifier supports the value without replacing copy. | sys.iconography.*, sys.symbol.* |
| Field action | Optional reveal or clear action uses the internal Field Action primitive: icon-only, no default container, field-owned density, visible focus, and accessible state. | sys.accessibility.*, sys.iconography.*, sys.momentum.*, sys.state.* |

## Accessibility

State precedence: disabled, loading, error, focus, filled, default

- Visible label is required; placeholder cannot be the only name.
- Helper and error text are associated with the input.
- Error uses aria-invalid and gives a fix, not only a color.
- Disabled and loading states are announced and block misleading edits.
- Keyboard focus remains visible and follows document order.

## Foundations

Referenced token families:

- `comp.input.*`
- `sys.accessibility.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.iconography.*`
- `sys.momentum.*`
- `sys.state.*`
- `sys.symbol.*`
- `sys.voice.*`

The API keeps free-form input controlled, visible, and recoverable. Density owns scale; state owns behavior.

## Variants

Variants describe the capture role. State still owns default, filled, loading, error, focus, and disabled behavior.

Approved variants from demos: `text`, `email`, `password`, `currency`, `unit`, `search`

Demo labels:

- Text
- Email
- Password
- Currency
- Unit
- Search

## States

States communicate editability, progress, validation, and value condition. The field keeps its label and helper visible in every state.

Supported states from docs: `default`, `focus`, `filled`, `loading`, `error`, `disabled`

## Variant X State Behavior

Variant gives the field role; state controls behavior. State precedence wins when role and condition compete.

State matrix: `default`, `focus`, `filled`, `loading`, `error`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Default |  |  |
| Filled |  |  |
| Affordance |  |  |

## Full Width

Full-width Input is for mobile forms, sheets, and constrained containers. Desktop layouts should inherit width from their grid or form group.

- Natural width: layout: stack-natural
- Mobile form: layout: stack
- Responsive containers: layout: container

## Responsive Layout Patterns

Mobile fields stack with full labels and helper text. Wider layouts can group fields, but should not hide recovery or force crowded columns.

| Example | Layout | Density |
| --- | --- | --- |
| Driver mobile | single | lg |
| Fleet desktop | mini-grid | sm |

## Viewport Organization

Viewport behavior follows Density and Frame: one column when space is tight, grouped rows only when labels, helper text, and states remain readable.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Smartphones + phablets | Stack fields full-width with visible helper or recovery copy. |  | lg |
| Tablets + laptops | Group related fields when labels and helper text remain readable. |  | md |
| Desktops + TV | Use larger inspector fields for remote viewing or review surfaces. |  | lg |

## Playground

Use the playground to verify capture role, label, value, helper text, state, density, mono values, and qualifiers before moving the field into a form or filter.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| variant | select | text | text, email, password, number, currency, unit, search |
| label | text | Driver ID |  |
| value | text | MX-2048 |  |
| state | select | filled | default, focus, filled, loading, error, disabled |
| density | select | md | sm, md, lg |

## API And Foundations

The API keeps free-form input controlled, visible, and recoverable. Density owns scale; state owns behavior.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | Yes | Visible label and accessible name. |
| value | string | No | Input value. |
| name | string | No | Native input name. |
| placeholder | string | No | Hint only; never the only label. |
| helper | string | No | Package alias for helper text. |
| helperText | string | No | Format, source, or recovery guidance. |
| error | string | No | Visible validation message. |
| disabled | boolean | No | Blocks edits; explain with helper text. |
| loading | boolean | No | Shows lookup or validation progress. |
| required | boolean | No | Marks value as required. |
| density | "sm" \| "md" \| "lg" | No | Density-owned scale. |
| state | "default" \| "focus" \| "filled" \| "loading" \| "error" \| "disabled" | No | Preview state; behavior props win. |
| variant | "text" \| "email" \| "password" \| "number" \| "currency" \| "unit" \| "search" | No | Capture role. It sets native type/input mode defaults without changing state rules. |
| icon | string | No | Optional leading symbol. |
| prefix | string | No | Optional short qualifier before the value; avoid using it as the only currency identifier. |
| mono | boolean | No | Uses code typography for plates, IDs, card fragments, or amounts. |
| suffix | string | No | Adds a short non-interactive qualifier such as MXN, USD, EUR, kg, t, plate, or card. |
| type | string | No | Native input type override when variant defaults are not enough. |
| inputMode | string | No | Native inputmode override for keyboards. |
| autocomplete | string | No | Native autocomplete hint. |
| align | "start" \| "end" | No | Value alignment, usually end for numeric capture. |
| revealable | boolean | No | Adds the show/hide affordance for password-like values. |
| onValueChange | (value: string, meta: InputValueMeta) => void | No | Called with normalized value and display metadata for numeric, currency, and unit variants. |

## Implementation Checklist

- Provide `label`: Visible label and accessible name.
- Label, value, placeholder, helper, suffix, mono value, and error render from props.
- Focus, typing, Tab, disabled, loading, and error states work.
- Helper and error text are associated with the input.
- Field Action reveal toggles value visibility, aria-pressed, and aria-label without adding a visible button container.
- Responsive examples do not overflow at small viewports.

## Tests And Rejection Rules

Must test:

- Label, value, placeholder, helper, suffix, mono value, and error render from props.
- Focus, typing, Tab, disabled, loading, and error states work.
- Helper and error text are associated with the input.
- Field Action reveal toggles value visibility, aria-pressed, and aria-label without adding a visible button container.
- Responsive examples do not overflow at small viewports.

Reject if:

- Placeholder is the only label.
- Error is only a color.
- Value disappears during loading or validation.
- Scale bypasses Density or uses raw spacing.
- A field-local action is implemented as a one-off icon button style instead of the Field Action primitive.

## MIEL

MIEL treats Input as a short free-form value contract: the agent can place and configure the field, while the human owns meaning, validation policy, and operational risk.

Agents can decide:

- Use Input when the value cannot be selected from a finite list.
- Configure label, placeholder, helper, value, density, icon, suffix, and visible state.
- Place the field in a form, filter, stack, or row when grouping is already clear.

Agents must ask:

- Validation, mask, formatter, required rule, or error copy is unknown.
- The value affects money, permissions, identity, compliance, or audit.
- The experience needs suggestions, autocomplete, scanner input, or a multi-field pattern.

Agents must reject:

- Placeholder is the only label.
- Error, disabled, or loading state removes the value or explanation.
- The field is used for closed-choice data that should be Select.
- The agent invents a formatter, mask, or validation rule.

Handoff language:

> I am using Input because the value is short and free-form. I need confirmation on validation, risk level, and the recovery copy for invalid input.
