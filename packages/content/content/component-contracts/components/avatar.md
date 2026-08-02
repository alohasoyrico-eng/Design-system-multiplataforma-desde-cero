# Avatar

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/avatar/all.json`

## Purpose

Use Avatar to identify a person, driver, approver, or system actor when name recognition helps the task.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Breakpoints`, `Focus`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.avatar.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.state.*`, `sys.tone.*`, `sys.accessibility.*`

Gaps or review gates:

- No accessible name
- Color-only status
- Raw visual values
- Ask before build: Presence status changes permissions, availability, or escalation.
- Ask before build: The identity is sensitive or masked.
- Ask before build: A group or overflow rule is required.

## Use When

- Use Avatar for drivers, approvers, support agents, and system actors.
- Use initials fallback when no image exists.
- Use small density in dense tables with a text label.

## Do Not Use Without Review

- Ask before use when presence status changes permissions, availability, or escalation.
- Ask before use when the identity is sensitive or masked.
- Ask before use when a group or overflow rule is required.
- The avatar replaces the visible name in a critical decision.
- Status is color-only.
- The agent invents private images.
- Identity has no accessible name.
- Presence relies only on color.
- Initials are random.
- Raw visual values are used.

## Operational Example

Use Avatar to identify a person, driver, approver, or system actor when name recognition helps the task.

### Why Avatar

- Avatar makes accountable people scannable in tables, approvals, chat, audit, and driver flows.
- The ZIP reference uses deterministic initials, circular sizing, optional image, and presence dot.
- Use text labels near Avatar when identity must be unambiguous.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Frame | Circular identity container with fixed density. | comp.avatar.*, sys.frame.*, sys.energy.* |
| Image or initials | Photo is preferred; initials are deterministic fallback. | sys.voice.*, sys.symbol.* |
| Presence dot | Optional online, busy, or offline status. | sys.state.*, sys.tone.* |
| Accessible name | Name is exposed when Avatar conveys identity. | sys.accessibility.* |

## Accessibility

State precedence: disabled, busy, online, offline, default, unknown

- Expose the person name when Avatar carries identity.
- Do not rely on initials as the only label in critical flows.
- Presence color needs text or nearby status when status matters.
- Image alt equals the represented person name.
- Decorative avatars can be aria-hidden.

## Foundations

Referenced token families:

- `comp.avatar.*`
- `sys.accessibility.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.state.*`
- `sys.symbol.*`
- `sys.tone.*`
- `sys.voice.*`

Avatar API exposes name, src, density, status, and state while Design System foundations own identity, presence, shape, tone, and accessibility.

## Variants

Avatar variants describe source and grouping: initials, image, status, group, and system.

Approved variants from demos: `initials`, `image`, `status`, `group`, `system`

Demo labels:

- Initials
- Image
- Presence
- Group member
- System actor

## States

Avatar states communicate presence, busy work, offline state, disabled identity, and default availability.

Supported states from docs: `default`, `online`, `busy`, `offline`, `disabled`, `unknown`

## Variant X State Behavior

Variant defines identity source; state defines availability and whether presence is meaningful.

State matrix: `default`, `online`, `busy`, `offline`, `disabled`, `unknown`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Initials | initials |  |
| Status | status |  |
| System | system |  |

## Full Width

Avatar never stretches full width; the containing row or card owns layout.

- Table cell: layout: row
- Profile header: layout: row
- Audit actor: layout: row

## Responsive Layout Patterns

Density changes with density, but accessible identity must stay available in nearby text.

| Example | Layout | Density |
| --- | --- | --- |
| Phone list | simple-demo-row | lg |
| Desktop table | simple-demo-row | sm |

## Viewport Organization

Use Avatar as an identity anchor inside rows, cards, chat, and approval flows.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Use comfortable density with visible name. | identity row | lg |
| Tablet | Use status only when the task needs availability. | approval row | md |
| Desktop | Use compact-density avatars in dense tables with text labels. | table cell | sm |

## Playground

Use the playground to verify identity source, density mapping, status, and disabled state.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| name | text | Ana Sosa |  |
| density | select | md | sm, md, lg, xl |
| status | select | online | none, online, busy, offline |
| state | select | default | default, online, busy, offline, disabled, unknown |

## API And Foundations

Avatar API exposes name, src, density, status, and state while Design System foundations own identity, presence, shape, tone, and accessibility.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| name | string | Yes | Person or actor name. |
| src | string | No | Image URL. |
| density | Density | No | Density-aware scale: sm, md, lg, or xl. |
| status | AvatarStatus | No | Presence marker. |
| state | AvatarState | No | Disabled or unknown state when presence is not the state source. |

## Implementation Checklist

- Provide `name`: Person or actor name.
- Initials fallback
- Image alt
- Status contrast
- Compact density legibility
- Disabled state
- Nearby name in critical flows

## Tests And Rejection Rules

Must test:

- Initials fallback
- Image alt
- Status contrast
- Compact density legibility
- Disabled state
- Nearby name in critical flows

Reject if:

- Identity has no accessible name.
- Presence relies only on color.
- Initials are random.
- Raw visual values are used.

## MIEL

MIEL treats Avatar as identity evidence: agents may place it when an actor matters, but humans confirm privacy, status meaning, and whether a name must be visible.

Agents can decide:

- Use Avatar for drivers, approvers, support agents, and system actors.
- Use initials fallback when no image exists.
- Use small density in dense tables with a text label.

Agents must ask:

- Presence status changes permissions, availability, or escalation.
- The identity is sensitive or masked.
- A group or overflow rule is required.

Agents must reject:

- The avatar replaces the visible name in a critical decision.
- Status is color-only.
- The agent invents private images.

Handoff language:

> I am using Avatar to identify an actor. Please confirm visible name, privacy level, image use, and whether presence status is meaningful.
