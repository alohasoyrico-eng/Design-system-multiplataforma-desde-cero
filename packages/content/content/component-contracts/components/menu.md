# Menu

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/menu/all.json`

## Purpose

Use Menu for compact action sets attached to a trigger, especially when actions are contextual, secondary, grouped, or permission dependent.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Breakpoints`, `Focus`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.menu.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.depth.*`, `sys.momentum.*`, `sys.state.*`, `sys.accessibility.*`

Gaps or review gates:

- Forms in menu
- Hidden primary action
- Fake controls
- No keyboard close
- Raw visual values
- Ask before build: A menu item changes money, access, or legal state.
- Ask before build: The set needs more than a compact action list.
- Ask before build: The trigger is the only way to reach a primary action.

## Use When

- Use Menu for compact secondary action sets.
- Use separators when action risk or category changes.
- Escalate long or explanatory content to Drawer.

## Do Not Use Without Review

- Ask before use when a menu item changes money, access, or legal state.
- Ask before use when the set needs more than a compact action list.
- Ask before use when the trigger is the only way to reach a primary action.
- Menu contains forms, paragraphs, or complex filters.
- Danger actions are visually mixed with safe actions.
- Open, close, keyboard, or disabled behavior is undefined.
- Menu contains a form or rich content.
- Primary process action is hidden only in Menu.
- Items are not keyboard reachable.
- Trigger or items use fake buttons.
- Raw color, spacing, shadow, or motion values are used.

## Operational Example

Use Menu for compact action sets attached to a trigger, especially when actions are contextual, secondary, grouped, or permission dependent.

### Why Menu

- Menu keeps secondary actions near their object without turning every row into a toolbar.
- The ZIP reference defines the compact floating surface, item height, separators, hover state, and scale motion.
- Actions must be real buttons with menu semantics, not a visual list with fake affordances.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Trigger | Opens the contextual action list and exposes expanded state. | comp.menu.*, sys.state.*, sys.accessibility.* |
| Panel | Floats near the trigger with radius, border, shadow, motion, and compact padding. | comp.menu.*, sys.depth.*, sys.frame.*, sys.momentum.* |
| Menu item | Uses clear labels, optional icons, disabled state, and keyboard focus. | sys.voice.*, sys.iconography.*, sys.state.* |
| Separator | Groups actions only when the group changes meaning or risk. | sys.frame.*, sys.energy.* |
| Danger item | Marks destructive action with semantic tone and hover surface. | sys.energy.*, sys.tone.* |

## Accessibility

State precedence: disabled, open, focus, default, closed

- Use a trigger with aria-haspopup menu and aria-expanded.
- Use role menu and menuitem for the floating panel and actions.
- Escape closes the menu and returns focus to the trigger.
- Disabled items remain visible only when they explain unavailable actions.
- Do not place long forms, filters, or rich content inside Menu.

## Foundations

Referenced token families:

- `comp.menu.*`
- `sys.accessibility.*`
- `sys.depth.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.iconography.*`
- `sys.momentum.*`
- `sys.state.*`
- `sys.tone.*`
- `sys.voice.*`

Menu API exposes trigger, items, variant, state, alignment, disabled state, danger tone, and separators while Design System foundations own surface, motion, keyboard, icon, and tone rules.

## Variants

Menu variants describe the action model: actions, grouped actions, selection commands, danger grouping, and icon-only trigger usage.

Approved variants from demos: `actions`, `grouped`, `selection`, `danger`, `icon-trigger`

Demo labels:

- Actions
- Grouped
- Selection
- Danger
- Icon trigger

## States

Menu states cover trigger availability, panel lifecycle, keyboard focus, disabled actions, and closed state.

Supported states from docs: `closed`, `open`, `focus`, `disabled`, `default`

## Variant X State Behavior

Variant sets action grouping; state defines whether the panel is available, open, focused, disabled, or closed.

State matrix: `open`, `focus`, `disabled`, `default`, `closed`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Actions | actions |  |
| Grouped | grouped |  |
| Danger | danger |  |

## Full Width

Menu belongs to its trigger, not the full page. The available region may be full-width, but the panel stays compact.

- Row action: layout: anchored compact
- Toolbar action: layout: anchored compact
- Closed trigger: layout: trigger only

## Responsive Layout Patterns

Menu stays compact across viewports. On phones, prefer fewer items and escalate long sets to Drawer or Bottom Sheet.

| Example | Layout | Density |
| --- | --- | --- |
| Phone compact menu | simple-demo-row | lg |
| Desktop row menu | simple-demo-row | sm |

## Viewport Organization

Keep Menu near the object it controls. If the action set needs explanation, inputs, or review, use Drawer or Dialog.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Use short menus only; escalate complex sets. | compact anchored | lg |
| Tablet | Keep panels within safe margins and away from nav. | anchored panel | md |
| Desktop | Use row or toolbar triggers for dense operations. | row action | sm |

## Playground

Use the playground to verify trigger label, variant, state, alignment, danger grouping, disabled items, and close behavior.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| trigger | text | Actions |  |
| variant | select | actions | actions, grouped, selection, danger, icon-trigger |
| state | select | open | open, focus, disabled, default, closed |
| align | select | start | start, end |

## API And Foundations

Menu API exposes trigger, items, variant, state, alignment, disabled state, danger tone, and separators while Design System foundations own surface, motion, keyboard, icon, and tone rules.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| triggerLabel | string | Yes | Menu trigger label. |
| items | MenuItem[] | Yes | Menu items. |
| open | boolean | No | Initial or controlled open state. |
| label | string | No | Accessible menu label. |
| variant | actions \| grouped \| selection \| danger \| icon-trigger | No | Action model shown by the menu. |
| density | sm \| md \| lg | No | Controls trigger, panel, and item scale for sm, md, and lg contexts. |
| state | default \| closed \| open \| focus \| disabled | No | Initial demo/component state. |
| align | start \| end | No | Panel alignment relative to the trigger. |
| disabled | boolean | No | Disables the trigger. |
| onOpenChange | (open: boolean) => void | No | Called when local open state changes. |
| onSelect | (item: MenuItem) => void | No | Called when an item is selected. |

## Implementation Checklist

- Provide `triggerLabel`: Menu trigger label.
- Provide `items`: Menu items.
- aria-haspopup and aria-expanded
- role menu and menuitem
- Escape closes and restores focus
- Disabled items cannot activate
- Danger item contrast
- Panel clipping on small viewports

## Tests And Rejection Rules

Must test:

- aria-haspopup and aria-expanded
- role menu and menuitem
- Escape closes and restores focus
- Disabled items cannot activate
- Danger item contrast
- Panel clipping on small viewports

Reject if:

- Menu contains a form or rich content.
- Primary process action is hidden only in Menu.
- Items are not keyboard reachable.
- Trigger or items use fake buttons.
- Raw color, spacing, shadow, or motion values are used.

## MIEL

MIEL treats Menu as compact contextual action access: agents can use it for secondary commands while humans confirm item priority, destructive grouping, and whether a Drawer is more appropriate.

Agents can decide:

- Use Menu for compact secondary action sets.
- Use separators when action risk or category changes.
- Escalate long or explanatory content to Drawer.

Agents must ask:

- A menu item changes money, access, or legal state.
- The set needs more than a compact action list.
- The trigger is the only way to reach a primary action.

Agents must reject:

- Menu contains forms, paragraphs, or complex filters.
- Danger actions are visually mixed with safe actions.
- Open, close, keyboard, or disabled behavior is undefined.

Handoff language:

> I am using Menu for contextual secondary actions. Please confirm item order, destructive grouping, disabled behavior, alignment, and escalation rules.
