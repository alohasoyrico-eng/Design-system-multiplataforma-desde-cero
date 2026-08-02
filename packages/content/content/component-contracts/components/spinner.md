# Spinner

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/spinner/all.json`

## Purpose

Use Spinner for compact indeterminate loading when an action, field, or inline control is waiting and no progress value exists.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Momentum`, `Accessibility`, `Depth`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`

Primitive dependencies: `Color`, `Spacing`, `Radius`, `Motion Curves`, `Duration`, `Density`, `Accessibility`

Component dependencies: `None declared`

Token dependencies: `comp.spinner.*`, `sys.energy.*`, `sys.frame.*`, `sys.momentum.*`, `sys.accessibility.*`

Gaps or review gates:

- Spinner exposes aria-valuenow.
- Spinner is used for measurable progress.
- A control draws a custom spinning icon instead of Spinner.
- Spinner replaces Skeleton for structured content loading.
- Ask before build: The wait can fail, retry, cancel, or block a system.
- Ask before build: The loading scope is a page, template, or data region instead of one component.
- Ask before build: The system can provide measurable progress.

## Use When

- Use Spinner for compact unknown loading in fields, buttons, selects, and inline status.
- Use decorative mode when the owner already has a loading label or disabled state.
- Use Progress Indicator when a value exists and Skeleton when content structure is loading.

## Do Not Use Without Review

- Ask before use when the wait can fail, retry, cancel, or block a system.
- Ask before use when the loading scope is a page, template, or data region instead of one component.
- Ask before use when the system can provide measurable progress.
- Spinner is used for measurable progress.
- Spinner replaces recovery, empty, or error content.
- Spinner appears without an owner or accessible label.
- Spinner exposes fake progress.
- A control uses a custom spinning icon instead of Spinner.
- Spinner replaces Skeleton for structured content loading.
- Spinner is the only recovery or error message.

## Operational Example

Use Spinner for compact indeterminate loading when an action, field, or inline control is waiting and no progress value exists.

### Why Spinner

- Spinner gives compact loading feedback without inventing a percentage.
- It can be announced with role status or stay decorative inside a labeled loading control.
- Progress Indicator owns measurable progress; Skeleton owns content placeholder structure.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Ring | SVG circular track for the loading mark. | comp.spinner.*, sys.frame.* |
| Active segment | Uses one semantic SVG stroke for the spinning arc. | sys.energy.*, sys.state.* |
| Accessible label | Names loading when the spinner stands alone. | sys.accessibility.*, sys.voice.* |
| Motion | Continuous rotation plus a breathing SVG arc communicates waiting rhythm and respects reduced motion. | sys.momentum.*, sys.state.loading |
| Size | Maps compact, default, and prominent loading contexts. | sys.frame.*, sys.density.* |

## Accessibility

State precedence: disabled, decorative, subtle, loading, default

- Use role status with an aria-label when Spinner stands alone.
- Use decorative=true or aria-hidden when Spinner appears inside an already labeled loading control.
- Do not expose aria-valuenow, aria-valuemax, or percentage text.
- Respect reduced motion.
- Do not rely on Spinner as the only error, empty, or recovery message.

## Foundations

Referenced token families:

- `comp.spinner.*`
- `sys.accessibility.*`
- `sys.density.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.momentum.*`
- `sys.state.*`
- `sys.voice.*`

Spinner API exposes label, density, tone, and decorative mode while Design System owns ring SVG geometry, spin rhythm, arc breathing, reduced motion, and accessible loading semantics.

## Variants

Spinner has one circular indeterminate variant. Size and tone adapt it to field, button, and inline contexts without making it progress.

Approved variants from demos: `circular`

Demo labels:

- Inline field loading
- Default loading
- Subtle loading
- Warning retry

## States

Spinner states describe loading ownership and accessibility mode only. The owner remains responsible for disabled, recovery, completion, and errors.

Supported states from docs: `default`, `loading`, `decorative`, `subtle`, `disabled`

## Variant X State Behavior

Spinner does not own completion or error states. Variant remains circular; the owner decides label, disabled state, retry, and recovery.

State matrix: `default`, `loading`, `decorative`, `subtle`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Standalone | circular | loading |
| Field adornment | circular | decorative |
| Dense control | circular | subtle |

## Full Width

Spinner should not stretch. Full-width loading belongs to the owning Button, field, Progress Indicator, or Skeleton region.

- Field slot: layout: simple-demo-row
- Inline status: layout: simple-demo-row
- Prominent wait: layout: simple-demo-row

## Responsive Layout Patterns

Use the same compact ring across viewports. Change the owner layout, not the Spinner geometry.

| Example | Layout | Density |
| --- | --- | --- |
| Phone field | simple-demo-row | lg |
| Desktop filter | simple-demo-row | sm |

## Viewport Organization

Spinner stays close to the control or message that owns the wait. Use Skeleton for content regions and Progress Indicator for measurable work.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Use small Spinner inside touch-safe loading controls. | field or button slot | lg |
| Tablet | Use default size for inline status messages with visible copy. | inline status | md |
| Desktop | Use small or subtle Spinner in dense filters and table controls. | dense control slot | sm |

## Playground

Use the playground to verify density, tone, label, and whether Spinner is decorative or announced.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Loading |  |
| density | select | md | sm, md, lg |
| tone | select | accent | accent, ink, success, warning, danger |
| state | select | loading | default, loading, decorative, subtle, disabled |
| decorative | checkbox | false |  |

## API And Foundations

Spinner API exposes label, density, tone, and decorative mode while Design System owns ring SVG geometry, spin rhythm, arc breathing, reduced motion, and accessible loading semantics.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | No | Accessible loading label when Spinner stands alone. |
| density | "sm" \| "md" \| "lg" | No | Maps compact field, default inline, and prominent status density. |
| tone | "accent" \| "ink" \| "success" \| "warning" \| "danger" | No | Semantic active ring tone. |
| state | "default" \| "loading" \| "decorative" \| "subtle" \| "disabled" | No | Explicit loading state for owner state mapping. |
| decorative | boolean | No | Use when the owning control already communicates loading. |

## Implementation Checklist

- Set `label` as a documented control.
- Set `density` as a documented control. Options: sm, md, lg.
- Set `tone` as a documented control. Options: accent, ink, success, warning, danger.
- Set `state` as a documented control. Options: default, loading, decorative, subtle, disabled.
- Set `decorative` as a documented control.
- Standalone role status and aria-label
- Decorative mode uses aria-hidden
- No progressbar values
- Spin rhythm and reduced motion
- Density mapping
- Field and select loading consume Spinner

## Tests And Rejection Rules

Must test:

- Standalone role status and aria-label
- Decorative mode uses aria-hidden
- No progressbar values
- Spin rhythm and reduced motion
- Density mapping
- Field and select loading consume Spinner

Reject if:

- Spinner exposes fake progress.
- A control uses a custom spinning icon instead of Spinner.
- Spinner replaces Skeleton for structured content loading.
- Spinner is the only recovery or error message.

## MIEL

MIEL treats Spinner as compact unknown loading. Agents can use it when the owner is clear; humans confirm whether the wait needs progress, structure, recovery, or a larger pattern.

Agents can decide:

- Use Spinner for compact unknown loading in fields, buttons, selects, and inline status.
- Use decorative mode when the owner already has a loading label or disabled state.
- Use Progress Indicator when a value exists and Skeleton when content structure is loading.

Agents must ask:

- The wait can fail, retry, cancel, or block a system.
- The loading scope is a page, template, or data region instead of one component.
- The system can provide measurable progress.

Agents must reject:

- Spinner is used for measurable progress.
- Spinner replaces recovery, empty, or error content.
- Spinner appears without an owner or accessible label.

Handoff language:

> I am using Spinner for compact unknown loading. Please confirm the owner, label, reduced-motion behavior, and whether this should be Progress Indicator, Skeleton, or a loading pattern instead.
