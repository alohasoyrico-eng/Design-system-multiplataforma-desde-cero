# Accordion

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/accordion/all.json`

## Purpose

Use Accordion to reveal secondary detail inside the same context without changing view or route.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Breakpoints`, `Focus`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.accordion.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.depth.*`, `sys.momentum.*`, `sys.state.*`, `sys.accessibility.*`

Gaps or review gates:

- Critical content hidden by default
- Triggers are not buttons
- Nested accordions required
- Raw visual or motion values
- Ask before build: The hidden content is required to complete the task.
- Ask before build: The section is primary navigation.
- Ask before build: Multiple open sections may create long, hard-to-scan pages.

## Use When

- Use for secondary detail inside the same object.
- Use metadata when collapsed rows need summary.
- Use single-open behavior by default.

## Do Not Use Without Review

- Ask before use when the hidden content is required to complete the task.
- Ask before use when the section is primary navigation.
- Ask before use when multiple open sections may create long, hard-to-scan pages.
- Critical actions are hidden.
- Nested accordions are needed.
- Keyboard and aria-expanded behavior is undefined.
- Critical content is hidden by default.
- Triggers are not real buttons.
- Nested accordions are required.
- Chevron does not match state.
- Raw visual or motion values are used.

## Operational Example

Use Accordion to reveal secondary detail inside the same context without changing view or route.

### Why Accordion

- Accordion keeps secondary information available without making every section visible at once.
- The ZIP reference defines card surface, 56px triggers, meta text, chevron spring, and height animation.
- Use it for detail inside profiles, drawers, settings, and help content; not for primary navigation.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Container | Groups related disclosure rows in one card-like surface. | comp.accordion.*, sys.energy.*, sys.depth.*, sys.frame.* |
| Trigger | Button row with title, optional icon, optional meta, and expanded state. | sys.accessibility.*, sys.state.*, sys.voice.* |
| Chevron | Shows disclosure direction and rotates with spring motion. | sys.symbol.*, sys.iconography.*, sys.momentum.* |
| Content region | Animates height and keeps collapsed content out of tab order. | sys.frame.*, sys.momentum.*, sys.accessibility.* |
| Dividers | Separate rows without turning each row into a separate card. | sys.energy.*, sys.frame.* |

## Accessibility

State precedence: disabled, open, focus, default, closed

- Use button triggers with aria-expanded.
- Connect trigger and content when implementation exposes IDs.
- Collapsed content must not receive keyboard focus.
- Enter and Space toggle the active trigger.
- Do not hide critical required content by default.

## Foundations

Referenced token families:

- `comp.accordion.*`
- `sys.accessibility.*`
- `sys.depth.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.iconography.*`
- `sys.momentum.*`
- `sys.state.*`
- `sys.symbol.*`
- `sys.voice.*`

Accordion API exposes items, default open row, multiple mode, disabled rows, and disclosure state while Design System foundations own surface, spacing, motion, iconography, and accessibility.

## Variants

Accordion variants describe disclosure behavior: single, multiple, metadata, icon-led, and compact.

Approved variants from demos: `single`, `multiple`, `metadata`, `icon-led`, `compact`

Demo labels:

- Single open
- Multiple open
- Metadata
- Icon led
- Compact

## States

Accordion states describe availability, disclosure, focus, disabled behavior, and closed rows.

Supported states from docs: `default`, `open`, `closed`, `focus`, `disabled`

## Variant X State Behavior

Variant sets disclosure model; state controls whether each row is open, closed, focused, disabled, or default.

State matrix: `open`, `focus`, `disabled`, `default`, `closed`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Single | single |  |
| Metadata | metadata |  |
| Multiple | multiple |  |

## Full Width

Accordion may fill its container, but each row keeps stable trigger height and content rhythm.

- Profile section: layout: full container
- Settings group: layout: full container
- Closed group: layout: full container

## Responsive Layout Patterns

Accordion stacks naturally on all viewports. On phones, keep titles short and avoid hiding required actions.

| Example | Layout | Density |
| --- | --- | --- |
| Phone profile | simple-demo-row | lg |
| Desktop settings | simple-demo-row | sm |

## Viewport Organization

Use Accordion where detail belongs to the same object. Use Tabs for parallel views and Drawer for larger workspace expansion.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Use short titles and one open section. | stacked disclosure | lg |
| Tablet | Use metadata to summarize hidden detail. | card group | md |
| Desktop | Use for secondary detail in panels and profiles. | contained group | sm |

## Playground

Use the playground to verify title, content, metadata, disclosure model, state, and icon behavior.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Documents |  |
| description | text | Driver license, insurance, and vehicle inspection are ready for review. |  |
| variant | select | single | single, multiple, metadata, icon-led, compact |
| state | select | open | open, focus, disabled, default, closed |

## API And Foundations

Accordion API exposes items, default open row, multiple mode, disabled rows, and disclosure state while Design System foundations own surface, spacing, motion, iconography, and accessibility.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| items | AccordionItem[] | Yes | Rows with title, content, id, and open state. |
| multiple | boolean | No | Allows more than one open row. |
| onExpandedChange | (expandedIds: string[]) => void | No | Called when local expanded sections change. |
| density | "sm" \| "md" \| "lg" | No | Disclosure density: sm, md, or lg. |

## Implementation Checklist

- Provide `items`: Rows with title, content, id, and open state.
- Button trigger semantics
- aria-expanded changes
- Collapsed content not tabbable
- Keyboard toggle
- Chevron motion
- Phone overflow

## Tests And Rejection Rules

Must test:

- Button trigger semantics
- aria-expanded changes
- Collapsed content not tabbable
- Keyboard toggle
- Chevron motion
- Phone overflow

Reject if:

- Critical content is hidden by default.
- Triggers are not real buttons.
- Nested accordions are required.
- Chevron does not match state.
- Raw visual or motion values are used.

## MIEL

MIEL treats Accordion as secondary disclosure: agents can use it to organize related detail, but humans confirm whether hidden content is safe to collapse.

Agents can decide:

- Use for secondary detail inside the same object.
- Use metadata when collapsed rows need summary.
- Use single-open behavior by default.

Agents must ask:

- The hidden content is required to complete the task.
- The section is primary navigation.
- Multiple open sections may create long, hard-to-scan pages.

Agents must reject:

- Critical actions are hidden.
- Nested accordions are needed.
- Keyboard and aria-expanded behavior is undefined.

Handoff language:

> I am using Accordion for secondary detail. Please confirm which content can be collapsed, default open row, metadata, and whether multiple rows may stay open.
