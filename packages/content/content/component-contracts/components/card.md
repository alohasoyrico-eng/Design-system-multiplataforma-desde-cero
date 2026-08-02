# Card

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/card/operational-example.json`
- `packages/content/content/component-copy/components/card/anatomy.json`
- `packages/content/content/component-copy/components/card/accessibility.json`
- `packages/content/content/component-copy/components/card/variants.json`
- `packages/content/content/component-copy/components/card/states.json`
- `packages/content/content/component-copy/components/card/variant-state-behavior.json`
- `packages/content/content/component-copy/components/card/full-width.json`
- `packages/content/content/component-copy/components/card/responsive-layout-patterns.json`
- `packages/content/content/component-copy/components/card/viewport-organization.json`
- `packages/content/content/component-copy/components/card/playground.json`
- `packages/content/content/component-copy/components/card/guidelines.json`
- `packages/content/content/component-copy/components/card/api-foundations.json`
- `packages/content/content/component-copy/components/card/tests-rejection-rules.json`
- `packages/content/content/component-copy/components/card/miel.json`
- `packages/content/content/component-copy/components/card/reference-compositions.json`

## Purpose

Show what the card helps someone scan or decide: object, value, state, and next available action.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Density`, `Focus`, `Loading`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.card.*`, `sys.energy.*`, `sys.voice.*`, `sys.frame.*`, `sys.depth.*`, `sys.state.*`, `sys.momentum.*`, `sys.accessibility.*`, `sys.symbol.*`

Reference translation: Adapt - Use ZIP base variants default, minimal, elevated, and ghost. Use composition for stats, compact, and media card anatomy; keep KPI Tile for dashboard metric ownership beyond Card.

Gaps or review gates:

- Card is used as a decorative wrapper.
- Nested decorative cards are required.
- Product sequencing is hidden inside the base component.
- State is color-only or recovery text is missing.
- Ask before build: The whole surface triggers navigation, opens a process, or changes data.
- Ask before build: The card includes forms, menus, charts, grouped actions, or repeated decisions.
- Ask before build: The content hierarchy, risk, or empty/error recovery cannot be inferred.

## Use When

- Use Card when information needs a bounded surface for scanning, comparison, or selection.
- Choose default, interactive, selected, muted, loading, error, or disabled state from the documented role.
- Arrange title, value, detail, and icon without adding nested cards or local visual rules.

## Do Not Use Without Review

- Ask before use when the whole surface triggers navigation, opens a process, or changes data.
- Ask before use when the card includes forms, menus, charts, grouped actions, or repeated decisions.
- Ask before use when the content hierarchy, risk, or empty/error recovery cannot be inferred.
- Card is used as a decorative wrapper for unrelated UI.
- Cards are nested to create layout instead of using Frame and layout rules.
- A process is hidden inside the base component instead of moving to a pattern.
- State relies only on color or has no recovery path.
- Card is used as a decorative wrapper.
- Nested decorative cards are required.
- Product sequencing is hidden inside the base component.
- State is color-only or recovery text is missing.

## Operational Example

Show what the card helps someone scan or decide: object, value, state, and next available action.

### Why Card

- Each surface frames one object or decision for quick scanning.
- Title, value, detail, icon, and state stay visible together.
- The parent layout decides grid behavior; Card owns the surface contract.

Scenario type: `card-grid`

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| surface | Owns border, radius, shadow, padding, and surface role. | comp.card.*, sys.energy.*, sys.depth.* |
| icon slot | Optional semantic Material Symbol supports recognition without replacing text. | sys.symbol.* |
| title | Short object or decision label remains available to assistive tech. | sys.voice.* |
| value | Optional prominent datum or status wraps safely. | sys.voice.*, sys.frame.* |
| description | Explains scan value, state, or next action. | sys.voice.* |
| state layer | Hover, focus, selected, loading, error, disabled, and muted resolve before styling. | sys.state.*, sys.momentum.*, sys.accessibility.* |

## Accessibility

State precedence: disabled, loading, error, selected, focus, hover, muted, interactive, default

- Surface has a clear name from title and supporting text.
- Interactive cards expose keyboard focus and activation.
- Selected, loading, error, and disabled states are not color-only.
- Nested actions keep their own accessible names and focus order.
- Long localized content wraps without hiding recovery text.

## Foundations

Referenced token families:

- `comp.card.*`
- `sys.accessibility.*`
- `sys.depth.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.momentum.*`
- `sys.state.*`
- `sys.symbol.*`
- `sys.voice.*`

Card owns the surface contract. Slots may contain components; product sequencing belongs to patterns.

## Variants

Card variants map the ZIP reference to Flow without turning every reference wrapper into a base variant. Default, elevated, minimal, and ghost are surface variants; interactive is behavior, compact/media are compositions, and stats maps to KPI Tile.

Approved variants from demos: `default`, `minimal`, `elevated`, `ghost`

Demo labels:

- Default
- Minimal
- Elevated
- Ghost

## States

Card state changes surface, text, icon, and recovery path together. Disabled and error states cannot rely on muted styling alone.

Supported states from docs: `default`, `interactive`, `hover`, `focus`, `selected`, `loading`, `error`, `disabled`, `muted`

## Variant X State Behavior

Variant controls surface treatment. State controls behavior, feedback, and accessibility without becoming a new surface variant.

State matrix: `default`, `hover`, `focus`, `loading`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Default surface |  |  |
| Interactive state |  |  |
| Selected state |  |  |

## Full Width

Full-width Card is for mobile stacks, detail sheets, and constrained containers. Desktop dashboards should use grid width from the parent layout.

- Natural width: layout: stack-natural
- Mobile sheet: layout: stack
- Responsive containers: layout: container

## Responsive Layout Patterns

Mobile cards prioritize one scan value and next action. Desktop cards can support comparison and scan grids.

| Example | Layout | Density |
| --- | --- | --- |
| Driver mobile | single | lg |
| Fleet desktop | mini-grid | sm |

## Viewport Organization

Reorganize card content by context. Do not shrink a dashboard card and call it mobile.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Smartphones + phablets | Stack cards and prioritize one scan value plus one next action. |  | lg |
| Tablets + laptops | Use two-column comparison when card content remains readable. |  | md |
| Desktops + TV | Use scan grids with larger targets and explicit state labels. |  | lg |

## Playground

Inspect how role, state, title, value, and description resolve into the Card contract.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| title | text | Wallet balance |  |
| value | text | $8,412.50 |  |
| description | text | Card active · last movement 14:32 |  |
| role | select | interactive | surface, interactive, selectable, summary |
| state | select | interactive | default, interactive, hover, focus, selected, loading, error, disabled, muted |

## API And Foundations

Card owns the surface contract. Slots may contain components; product sequencing belongs to patterns.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| title | string | yes | Visible title and accessible name source. |
| value | string | no | Prominent value, status, or object summary. |
| unit | string | no | Optional unit prefix for stats composition values. |
| detail | string | no | Supporting text that explains scan value or recovery. |
| status | string | no | Short visible status label. |
| trend | up \| down \| neutral | no | Trend tone for stats composition status. |
| icon | IconName | no | Optional approved symbol for recognition. |
| media | string | no | Optional media URL for media composition. |
| mediaAlt | string | no | Accessible alt text when the media carries meaning. |
| variant | default \| minimal \| elevated \| ghost | no | Surface treatment governed by Flow tokens. |
| composition | standard \| stats \| compact \| media | no | Card anatomy composition informed by the ZIP reference without changing the surface variant API. |
| state | default \| hover \| focus \| selected \| loading \| error \| disabled \| muted \| interactive | no | Resolved UI state before styling. |
| density | sm \| md \| lg | no | Density context from Flow. |
| fullWidth | boolean | no | Allows the Card to fill its owning layout. |
| interactive | boolean | no | Makes the whole surface keyboard/actionable when no nested actions exist. |
| selected | boolean | no | Marks the surface as selected and syncs aria-pressed when interactive. |
| disabled | boolean | no | Removes whole-surface activation and applies disabled state. |
| loading | boolean | no | Shows loading state and aria-busy. |
| actions | (ButtonProps \| IconButtonProps & { iconOnly?: boolean })[] | no | Nested Flow Button or IconButton actions; disables whole-card button behavior. |
| onAction | event | no | Whole-surface action handler when Card is interactive. |

## Implementation Checklist

- Provide `title`: Visible title and accessible name source.
- Renders semantic surface with title, description, optional icon, and state.
- Interactive Card is keyboard reachable and preserves focus visibility.
- Default, hover, focus, selected, loading, error, disabled, and muted states remain distinct.
- Mobile stack, desktop grid, and dense dashboard layouts do not overflow.
- Surface, border, radius, padding, elevation, motion, icon, and text resolve through Design System tokens.

## Tests And Rejection Rules

Must test:

- Renders semantic surface with title, description, optional icon, and state.
- Interactive Card is keyboard reachable and preserves focus visibility.
- Default, hover, focus, selected, loading, error, disabled, and muted states remain distinct.
- Mobile stack, desktop grid, and dense dashboard layouts do not overflow.
- Surface, border, radius, padding, elevation, motion, icon, and text resolve through Design System tokens.

Reject if:

- Card is used as a decorative wrapper.
- Nested decorative cards are required.
- Product sequencing is hidden inside the base component.
- State is color-only or recovery text is missing.

## MIEL

MIEL treats Card as a scannable surface contract: the agent can configure content, state, and role, while the human decides hierarchy, action meaning, and when the surface becomes a pattern.

Agents can decide:

- Use Card when information needs a bounded surface for scanning, comparison, or selection.
- Choose default, interactive, selected, muted, loading, error, or disabled state from the documented role.
- Arrange title, value, detail, and icon without adding nested cards or local visual rules.

Agents must ask:

- The whole surface triggers navigation, opens a process, or changes data.
- The card includes forms, menus, charts, grouped actions, or repeated decisions.
- The content hierarchy, risk, or empty/error recovery cannot be inferred.

Agents must reject:

- Card is used as a decorative wrapper for unrelated UI.
- Cards are nested to create layout instead of using Frame and layout rules.
- A process is hidden inside the base component instead of moving to a pattern.
- State relies only on color or has no recovery path.

Handoff language:

> I am using Card because the user needs to scan an object, value, and state. I need confirmation on whether the surface is purely informational or should escalate to a pattern.
