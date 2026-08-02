# Badge

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/badge/all.json`

## Purpose

Use Badge when a compact count or status marker must make pending work, exceptions, or freshness visible without becoming the main action.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Iconography`, `Density`, `Focus`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.badge.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.accessibility.*`

Gaps or review gates:

- Standalone action
- Color-only meaning
- No source count
- Layout overflow
- Ask before build: The badge changes legal, financial, safety, or permission meaning.
- Ask before build: The parent accessible name is unknown.
- Ask before build: The marker might be mistaken for an action.

## Use When

- Use Badge for counts, freshness, status, or pending work attached to a parent.
- Select tone when the semantic meaning is explicit.
- Use overflow when counts can exceed available space.

## Do Not Use Without Review

- Ask before use when the badge changes legal, financial, safety, or permission meaning.
- Ask before use when the parent accessible name is unknown.
- Ask before use when the marker might be mistaken for an action.
- Badge is requested as a standalone button.
- Color is the only signal for warning or danger.
- The count or status has no source of truth.
- Badge replaces text label.
- Badge is clickable alone.
- Dot status has no accessible equivalent.
- Count overflows layout.
- Risk depends only on color.

## Operational Example

Use Badge when a compact count or status marker must make pending work, exceptions, or freshness visible without becoming the main action.

### Why Badge

- The marker is secondary to a surrounding component.
- Counts and statuses stay compact enough for tabs, chips, cards, and tables.
- Tone communicates operational meaning without replacing visible labels.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Container | Owns pill or dot shape, minimum size, and alignment. | comp.badge.*, sys.frame.* |
| Value | Shows a short count, word, or indicator with no wrapping. | sys.voice.*, sys.energy.text.* |
| Tone | Maps info, success, warning, danger, or neutral meaning to system energy. | sys.energy.*, sys.tone.* |
| Association | Belongs to a parent control or object and does not own navigation alone. | sys.accessibility.* |

## Accessibility

State precedence: disabled, hidden, focus, hover, overflow, default

- Expose the count or status through the parent accessible name.
- Do not rely on color alone for warning or danger badges.
- Keep dot badges decorative unless the parent name announces the status.
- Cap large numbers with an overflow label such as 99+.
- Hide empty badges instead of rendering a meaningless zero.

## Foundations

Referenced token families:

- `comp.badge.*`
- `sys.accessibility.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.tone.*`
- `sys.voice.*`

Badge API exposes compact marker content, tone, variant, and accessibility label while Design System foundations own shape, color, and state.

## Variants

Badge variants describe marker shape and content density. Tone carries semantic meaning while the parent component owns the action.

Approved variants from demos: `count`, `dot`, `status`, `icon`

Demo labels:

- 18
- Unread
- New
- !

## States

Badge states communicate visibility, overflow, focus association, and disabled parent context without changing the parent component.

Supported states from docs: `default`, `hover`, `focus`, `overflow`, `hidden`, `disabled`

## Variant X State Behavior

Variant sets the badge shape; state controls visibility and parent context. Overflow and hidden states prevent misleading counts.

State matrix: `default`, `hover`, `focus`, `overflow`, `hidden`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Count | count |  |
| Status | status |  |
| Dot | dot |  |

## Full Width

Badge never stretches to full width. The parent surface may stretch, but the marker keeps intrinsic size and alignment.

- Tab count: layout: row
- Card status: layout: row
- Toolbar dot: layout: row

## Responsive Layout Patterns

Responsive layouts keep badges close to their parent label and avoid crowding dense mobile headers.

| Example | Layout | Density |
| --- | --- | --- |
| Mobile tabs | simple-demo-row | lg |
| Desktop tables | simple-demo-row | sm |

## Viewport Organization

Use fewer badges in narrow viewports and reserve danger or warning markers for operational signals that need immediate scan value.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Show one count beside the most important label. | inline | lg |
| Tablet | Pair count and status when labels still fit. | inline pair | md |
| Desktop | Use badges in tables, tabs, and cards without replacing text. | dense inline | sm |

## Playground

Use the playground to test short labels, tone, state, and overflow before placing Badge inside tabs, chips, cards, or table rows.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | 18 |  |
| variant | select | count | count, dot, status, icon |
| tone | select | danger | info, success, warning, danger, neutral, accent |
| state | select | default | default, hover, focus, overflow, hidden, disabled |

## API And Foundations

Badge API exposes compact marker content, tone, variant, and accessibility label while Design System foundations own shape, color, and state.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | No | Short visible count or status. |
| tone | BadgeTone | No | Semantic tone. |
| variant | BadgeVariant | No | Marker shape and content density. |
| state | BadgeState | No | Local display state: default, hover, focus, overflow, hidden, or disabled. |
| hidden | boolean | No | Hides the badge when the parent state requires it. |
| live | boolean | No | Announces badge changes politely. |
| icon | IconName | No | Approved icon name for the icon badge variant. |
| ariaLabel | string | No | Accessible meaning when visible text is not enough. |

## Implementation Checklist

- Set `label` as a documented control.
- Set `variant` as a documented control. Options: count, dot, status, icon.
- Set `tone` as a documented control. Options: info, success, warning, danger, neutral, accent.
- Set `state` as a documented control. Options: default, hover, focus, overflow, hidden, disabled.
- Accessible meaning exists
- Overflow renders
- Hidden removes empty marker
- Tone contrast passes
- Parent association remains clear

## Tests And Rejection Rules

Must test:

- Accessible meaning exists
- Overflow renders
- Hidden removes empty marker
- Tone contrast passes
- Parent association remains clear

Reject if:

- Badge replaces text label.
- Badge is clickable alone.
- Dot status has no accessible equivalent.
- Count overflows layout.
- Risk depends only on color.

## MIEL

MIEL treats Badge as a compact marker attached to another component: the agent can choose count, tone, and overflow, while the human confirms meaning and risk.

Agents can decide:

- Use Badge for counts, freshness, status, or pending work attached to a parent.
- Select tone when the semantic meaning is explicit.
- Use overflow when counts can exceed available space.

Agents must ask:

- The badge changes legal, financial, safety, or permission meaning.
- The parent accessible name is unknown.
- The marker might be mistaken for an action.

Agents must reject:

- Badge is requested as a standalone button.
- Color is the only signal for warning or danger.
- The count or status has no source of truth.

Handoff language:

> I am using Badge as a compact marker attached to a parent component. I need confirmation on the source count, semantic tone, and accessible wording.
