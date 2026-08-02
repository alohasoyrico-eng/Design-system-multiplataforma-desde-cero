# Icon Button

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/icon-button/operational-example.json`
- `packages/content/content/component-copy/components/icon-button/anatomy.json`
- `packages/content/content/component-copy/components/icon-button/accessibility.json`
- `packages/content/content/component-copy/components/icon-button/variants.json`
- `packages/content/content/component-copy/components/icon-button/states.json`
- `packages/content/content/component-copy/components/icon-button/variant-state-behavior.json`
- `packages/content/content/component-copy/components/icon-button/full-width.json`
- `packages/content/content/component-copy/components/icon-button/responsive-layout-patterns.json`
- `packages/content/content/component-copy/components/icon-button/viewport-organization.json`
- `packages/content/content/component-copy/components/icon-button/playground.json`
- `packages/content/content/component-copy/components/icon-button/guidelines.json`
- `packages/content/content/component-copy/components/icon-button/api-foundations.json`
- `packages/content/content/component-copy/components/icon-button/tests-rejection-rules.json`
- `packages/content/content/component-copy/components/icon-button/miel.json`

## Purpose

Use Icon Button for compact topbar utilities with a clear accessible name, fixed hit area, and explicit state when the utility is a toggle.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Density`, `Focus`, `Loading`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.icon-button.*`, `sys.energy.*`, `sys.frame.*`, `sys.state.*`, `sys.symbol.*`, `sys.momentum.*`, `sys.accessibility.*`

Reference translation: Adapt - The ZIP reference gives the visual benchmark: circular icon-only control, 36/44/52px density scale, selected glyph fill, tonal surface, badge dot, hover/press scale, and spring motion. Design System keeps ownership of tokens, foundations, state precedence, accessibility, and documentation rules.

Gaps or review gates:

- It has no ariaLabel.
- Selected state is not exposed as aria-pressed.
- A Switch setting is implemented as Icon Button.
- A multi-option SegmentedControl is treated as one Icon Button.
- Icon, badge, or state changes resize the hit area.
- Ask before build: The icon meaning, accessible name, or action consequence is unclear.
- Ask before build: The toolbar has more actions than the viewport can support.
- Ask before build: The request tries to turn search, navigation menus, or multi-option controls into Icon Button examples.

## Use When

- Use Icon Button for language, grid, or contrast when the accessible name is known.
- Use selected when grid or contrast toggles an interface state.
- Keep language as an action unless product logic defines a real pressed state.

## Do Not Use Without Review

- Ask before use when the icon meaning, accessible name, or action consequence is unclear.
- Ask before use when the toolbar has more actions than the viewport can support.
- Ask before use when the request tries to turn search, navigation menus, or multi-option controls into Icon Button examples.
- The button has no accessible name.
- Selected state is not machine-readable as aria-pressed.
- The request documents search input as Icon Button.
- The action depends on an unapproved icon or color-only state.
- The control has no ariaLabel.
- Selected is visual only.
- Search is documented or implemented as Icon Button.
- A Switch setting is implemented as Icon Button.
- The icon or badge changes hit area size.

## Operational Example

Use Icon Button for compact topbar utilities with a clear accessible name, fixed hit area, and explicit state when the utility is a toggle.

### Why Icon Button

- The topbar utilities need compact controls with stable hit areas.
- Grid and contrast use selected only when they expose a real on/off interface state.
- Language is a compact action, not a toggle, so it keeps an accessible action name without aria-pressed.

Scenario type: `toolbar`

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Accessible name | Names the action because the visible control has no text. | comp.icon-button.a11y.*, sys.accessibility.*, sys.tone.*, sys.voice.* |
| Circular surface | Keeps a fixed square hit area with full radius across variants and states. | comp.icon-button.surface.*, sys.frame.*, sys.energy.* |
| Symbol | Uses one approved icon that inherits currentColor from the button state. | comp.icon-button.icon.*, sys.symbol.*, sys.iconography.* |
| Selected state | Fills the glyph and exposes aria-pressed only when the button is a toggle. | comp.icon-button.selected.*, sys.state.*, sys.energy.* |
| Badge | Shows status as a small indicator without changing the control size. | comp.icon-button.badge.*, sys.energy.status.*, sys.momentum.* |

## Accessibility

State precedence: disabled, focus, pressed, selected, hover, badged, default

- Use a native button or equivalent platform role.
- Provide ariaLabel for every instance.
- Expose selected/toggle behavior with aria-pressed.
- Keep focus visible around the circular hit area.
- Do not let badge or icon choice replace the accessible name.

## Foundations

Referenced token families:

- `comp.icon-button.*`
- `sys.accessibility.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.iconography.*`
- `sys.momentum.*`
- `sys.state.*`
- `sys.symbol.*`
- `sys.tone.*`
- `sys.voice.*`

Icon Button API stays compact: one icon, one accessible action name, one emphasis variant, Density-owned scale, and explicit selected state only when the action is a toggle.

## Variants

Variants set emphasis for one compact topbar utility. Selected is state, not a variant, and appears only when the utility behaves like a toggle.

Approved variants from demos: `ghost`, `tonal`, `primary`, `accent`

Demo labels:

- Ghost
- Tonal
- Primary
- Accent

## States

States communicate availability, focus, press, toggle selection, and hover feedback while the circular hit area stays stable.

Supported states from docs: `default`, `hover`, `pressed`, `selected`, `badged`, `focus`, `disabled`

## Variant X State Behavior

Variant x state behavior keeps emphasis and state separate: variant chooses the surface, state chooses interaction, selected exposes toggle behavior, and disabled wins.

State matrix: `default`, `hover`, `pressed`, `selected`, `badged`, `focus`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Language action |  |  |
| Grid toggle |  |  |
| Contrast toggle |  |  |

## Full Width

Icon Button does not stretch its own control. Layout may distribute the topbar cluster, but each circular action keeps a fixed hit area.

- Natural width: layout: natural
- Topbar cluster: layout: cluster
- Responsive containers: layout: container

## Responsive Layout Patterns

Responsive demos keep topbar utilities legible by limiting the cluster to language, grid, and contrast while preserving circular target size.

| Example | Layout | Density |
| --- | --- | --- |
| Phone utilities | icon-button-toolbar | lg |
| Desktop toolbar | icon-button-toolbar | md |
| Compact topbar | icon-button-toolbar | sm |

## Viewport Organization

Viewport organization prioritizes the topbar utility cluster by task value: language, grid, and contrast remain compact while search stays an input.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone topbar | Keep language, grid, and contrast compact beside the open search input. |  | lg |
| Docs toolbar | Use selected state only for utilities that are actually on, such as grid or contrast. |  | md |
| Dense tools | Preserve icon legibility and target size before adding more utilities. |  | sm |

## Playground

Use the playground to confirm icon, accessible name, variant, selected/toggle state, badge, density, and disabled behavior before placing language, grid, or contrast in the topbar.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| icon | select | grid_view | language, grid_view, contrast |
| ariaLabel | text | Show grid |  |
| variant | select | tonal | ghost, tonal, primary, accent |
| selected | checkbox | true |  |
| badge | checkbox | false |  |
| state | select | selected | default, hover, pressed, selected, badged, focus, disabled |
| density | select | md | sm, md, lg |

## API And Foundations

Icon Button API stays compact: one icon, one accessible action name, one emphasis variant, Density-owned scale, and explicit selected state only when the action is a toggle.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| icon | string | yes | Approved symbol name. |
| ariaLabel | string | yes | Accessible action name. |
| variant | 'ghost' \| 'tonal' \| 'primary' \| 'accent' | no | Visual emphasis. |
| density | 'sm' \| 'md' \| 'lg' | no | Design System Density context for the fixed circular hit area. |
| selected | boolean | no | Toggle state exposed as aria-pressed. |
| badge | boolean | no | Small status indicator. |
| disabled | boolean | no | Blocks action. |
| onClick | () => void | yes | Runs the action when enabled. |

## Implementation Checklist

- Provide `icon`: Approved symbol name.
- Provide `ariaLabel`: Accessible action name.
- Provide `onClick`: Runs the action when enabled.
- Accessible name is present
- Selected state exposes aria-pressed
- Focus ring is visible
- Disabled does not trigger onClick
- Badge remains visible without resizing the control
- Density changes target size consistently
- Icon inherits currentColor

## Tests And Rejection Rules

Must test:

- Accessible name is present
- Selected state exposes aria-pressed
- Focus ring is visible
- Disabled does not trigger onClick
- Badge remains visible without resizing the control
- Density changes target size consistently
- Icon inherits currentColor

Reject if:

- The control has no ariaLabel.
- Selected is visual only.
- Search is documented or implemented as Icon Button.
- A Switch setting is implemented as Icon Button.
- The icon or badge changes hit area size.

## MIEL

MIEL treats Icon Button as a compact topbar utility with strict naming and state rules: agents may configure language, grid, and contrast controls when intent is explicit, but humans own toolbar priority.

Agents can decide:

- Use Icon Button for language, grid, or contrast when the accessible name is known.
- Use selected when grid or contrast toggles an interface state.
- Keep language as an action unless product logic defines a real pressed state.

Agents must ask:

- The icon meaning, accessible name, or action consequence is unclear.
- The toolbar has more actions than the viewport can support.
- The request tries to turn search, navigation menus, or multi-option controls into Icon Button examples.

Agents must reject:

- The button has no accessible name.
- Selected state is not machine-readable as aria-pressed.
- The request documents search input as Icon Button.
- The action depends on an unapproved icon or color-only state.

Handoff language:

> I am using Icon Button for the topbar utility cluster: language, grid, and contrast. I need confirmation on the accessible name, which controls are true toggles, and whether the visible cluster still fits this viewport.
