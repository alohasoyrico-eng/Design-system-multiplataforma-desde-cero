# Tag

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/tag/all.json`

## Purpose

Use Tag for compact metadata that labels type, platform, category, support level, or risk without implying selection, removal, or navigation.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Iconography`, `Motion Curves`, `Duration`, `Density`, `Focus`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.tag.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.state.*`, `sys.accessibility.*`

Gaps or review gates:

- Selected or removable behavior
- Standalone action replacement
- Color-only meaning
- Interactive tag without destination or action
- Ask before build: The tag should filter, navigate, or change state.
- Ask before build: The taxonomy, support level, or metadata source is unclear.
- Ask before build: The label might belong to Badge, Chip, Tabs, or Button instead.

## Use When

- Use Tag for metadata, category, platform, support level, or semantic status.
- Keep Tag static when it only describes an object.
- Use tone only when the metadata has explicit semantic meaning.

## Do Not Use Without Review

- Ask before use when the tag should filter, navigate, or change state.
- Ask before use when the taxonomy, support level, or metadata source is unclear.
- Ask before use when the label might belong to Badge, Chip, Tabs, or Button instead.
- Tag is used for selected or removable filters.
- Tag is used as a standalone action.
- Tag color carries meaning without visible text.
- Tag pretends to be selected or removable.
- Tag replaces Badge, Chip, Tabs, or Button behavior.
- Color is the only semantic signal.
- Interactive tag has no destination or action.

## Operational Example

Use Tag for compact metadata that labels type, platform, category, support level, or risk without implying selection, removal, or navigation.

### Why Tag

- Tags describe metadata without becoming a control.
- Tone supports scan value while the visible label carries meaning.
- Interactive tags are reserved for metadata that actually filters or navigates.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Container | Owns compact label shape, surface, border, density, and optional focus. | comp.tag.*, sys.frame.*, sys.energy.*, sys.state.* |
| Label | Names the metadata value in concise language. | sys.voice.* |
| Tone | Optional semantic treatment supports status or risk without replacing text. | sys.energy.*, sys.tone.* |
| Optional icon | Supports recognition only when it clarifies the label. | sys.symbol.*, sys.iconography.* |
| Interaction contract | Keeps static tags unfocusable and applies button or link semantics only when behavior exists. | sys.accessibility.*, sys.state.* |

## Accessibility

State precedence: disabled, focus, pressed, hover, default

- Render as text when Tag only describes metadata.
- Use button or link semantics only when the tag filters or navigates.
- Keep the visible label as the accessible name.
- Do not use color alone for semantic tone.
- Do not expose selected or removable behavior; use Chip when metadata becomes a token or filter.

## Foundations

Referenced token families:

- `comp.tag.*`
- `sys.accessibility.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.iconography.*`
- `sys.state.*`
- `sys.symbol.*`
- `sys.tone.*`
- `sys.voice.*`

Tag API exposes label, variant, tone, optional icon, state, and interactive behavior while Design System foundations own metadata hierarchy, tone, focus, and density.

## Variants

Tag variants describe metadata purpose: neutral labels, semantic status, platform labels, and clickable metadata when behavior is explicit.

Approved variants from demos: `metadata`, `status`, `platform`, `link`

Demo labels:

- Component
- Beta
- Mobile
- Components

## States

Tag states are intentionally limited. Static tags do not hover or press; interactive tags may expose hover, focus, pressed, and disabled.

Supported states from docs: `default`, `hover`, `pressed`, `focus`, `disabled`

## Variant X State Behavior

Variant defines metadata meaning; state exists only when the tag is interactive. Static metadata keeps default state.

State matrix: `default`, `hover`, `pressed`, `focus`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Metadata | metadata |  |
| Status | status |  |
| Link | link |  |

## Full Width

Tag keeps intrinsic width. Parent layouts may wrap tags, but a single tag does not stretch or behave like a button group.

- Metadata row: layout: row
- Status labels: layout: row
- Clickable metadata: layout: row

## Responsive Layout Patterns

Responsive tag groups wrap near the object they describe and avoid crowding mobile headers with low-value metadata.

| Example | Layout | Density |
| --- | --- | --- |
| Mobile card metadata | simple-demo-row | lg |
| Desktop catalog row | simple-demo-row | sm |

## Viewport Organization

Show only metadata that helps the user scan or decide. Move dense classification into a catalog or filter pattern.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Show one or two high-value tags close to the object title. | compact wrap | lg |
| Tablet | Allow metadata rows to wrap without pushing primary actions away. | metadata row | md |
| Desktop | Use tags for catalog metadata, support states, and classification near tables. | dense metadata | sm |

## Playground

Use the playground to confirm label length, tone, icon, and whether the tag is static metadata or a real interactive affordance.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Cross-platform |  |
| variant | select | metadata | metadata, status, platform, link |
| tone | select | neutral | neutral, info, success, warning, danger |
| state | select | default | default, hover, pressed, focus, disabled |
| interactive | checkbox | false |  |

## API And Foundations

Tag API exposes label, variant, tone, optional icon, state, and interactive behavior while Design System foundations own metadata hierarchy, tone, focus, and density.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | Yes | Tag label. |
| variant | TagVariant | No | Metadata purpose: metadata, status, platform, or link. |
| tone | TagTone | No | Semantic tone. |
| state | TagState | No | Local display state for interactive tags. |
| icon | IconName | No | Decorative leading icon. |
| interactive | boolean | No | Renders the tag as an interactive button. |
| disabled | boolean | No | Disables interactive tags. |

## Implementation Checklist

- Provide `label`: Tag label.
- Static tags are not focusable
- Interactive tags have button or link semantics
- Tone contrast passes
- Long labels wrap safely
- Tag groups wrap without layout overflow

## Tests And Rejection Rules

Must test:

- Static tags are not focusable
- Interactive tags have button or link semantics
- Tone contrast passes
- Long labels wrap safely
- Tag groups wrap without layout overflow

Reject if:

- Tag pretends to be selected or removable.
- Tag replaces Badge, Chip, Tabs, or Button behavior.
- Color is the only semantic signal.
- Interactive tag has no destination or action.

## MIEL

MIEL treats Tag as metadata, not a control by default: agents can label objects when taxonomy is explicit, while humans confirm interaction, source of truth, and whether classification belongs in a pattern.

Agents can decide:

- Use Tag for metadata, category, platform, support level, or semantic status.
- Keep Tag static when it only describes an object.
- Use tone only when the metadata has explicit semantic meaning.

Agents must ask:

- The tag should filter, navigate, or change state.
- The taxonomy, support level, or metadata source is unclear.
- The label might belong to Badge, Chip, Tabs, or Button instead.

Agents must reject:

- Tag is used for selected or removable filters.
- Tag is used as a standalone action.
- Tag color carries meaning without visible text.

Handoff language:

> I am using Tag as metadata. I need confirmation on taxonomy, source of truth, and whether any tag is truly interactive.
