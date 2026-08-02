# Skeleton

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/skeleton/all.json`

## Purpose

Use Skeleton when content structure is known but data is still loading, refreshing, or hydrating. Skeleton preserves layout expectation without pretending the data is ready.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Motion Curves`, `Duration`, `Breakpoints`, `Density`, `Loading`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.skeleton.*`, `sys.energy.*`, `sys.frame.*`, `sys.momentum.*`, `sys.state.*`, `sys.accessibility.*`

Gaps or review gates:

- Unknown future structure
- Fake progress
- Persistent after loaded or error
- Focusable bones
- Raw visual values
- Ask before build: The system knows real progress value or remaining steps.
- Ask before build: Loading can fail, be retried, cancelled, or recover.
- Ask before build: The future layout is unknown or still being designed.

## Use When

- Use Skeleton for unknown-duration loading with known layout structure.
- Match variant to future content: text, row, card, media, chart, or table.
- Remove shimmer under reduced motion.

## Do Not Use Without Review

- Ask before use when the system knows real progress value or remaining steps.
- Ask before use when loading can fail, be retried, cancelled, or recover.
- Ask before use when the future layout is unknown or still being designed.
- Skeleton replaces error, empty, or recovery messaging.
- Placeholder shapes do not match the future content.
- Decorative bones become focusable or announced as real content.
- Skeleton appears without a known future structure.
- A real progress value exists but Skeleton is used instead.
- The placeholder remains after content loads.
- Loading failure keeps showing Skeleton.
- Raw color, spacing, or motion values are used.

## Operational Example

Use Skeleton when content structure is known but data is still loading, refreshing, or hydrating. Skeleton preserves layout expectation without pretending the data is ready.

### Why Skeleton

- It keeps the expected layout stable while data arrives.
- It communicates loading without inventing content or fake progress.
- The loading state stays tied to the surface that will receive real content.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Container | Matches the future content area without becoming a card style by itself. | comp.skeleton.*, sys.frame.*, sys.state.* |
| Bone | Represents a title, row, media block, metric, or control placeholder. | comp.skeleton.*, sys.energy.* |
| Rhythm | Uses spacing and proportions from the real layout. | sys.frame.*, sys.growth.* |
| Motion | Uses subtle shimmer only while loading and respects reduced motion. | sys.momentum.*, sys.accessibility.* |
| Label | Exposes loading context for assistive technologies when the parent region is busy. | sys.voice.*, sys.accessibility.* |

## Accessibility

State precedence: disabled, loaded, paused, stale, loading, default

- Use aria-busy on the region that owns the loading content.
- Do not expose decorative bones as separate controls.
- Keep reduced-motion fallback for shimmer.
- Replace Skeleton with real content as soon as content is available.
- Use Progress Indicator instead when a real progress value exists.

## Foundations

Referenced token families:

- `comp.skeleton.*`
- `sys.accessibility.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.growth.*`
- `sys.momentum.*`
- `sys.state.*`
- `sys.voice.*`

Skeleton API exposes variant, lines, rows, columns, state, label, and full-width behavior while Design System owns shimmer, reduced motion, layout rhythm, density, and loading semantics.

## Variants

Skeleton variants describe the exact content structure being reserved: text, title, circle, card, pill, row, media, chart, and table. Use the smallest bone that matches the future content, then compose it inside Card, List, Table, or a parent pattern.

Approved variants from demos: `text`, `title`, `circle`, `card`, `pill`, `row`, `media`, `chart`, `table`

Demo labels:

- Text
- Card title
- Circle
- Card
- Pill
- Row
- Media
- Chart
- Table

## States

Skeleton states describe loading availability: default, loading, stale, paused, loaded, disabled. Error should replace Skeleton with recovery messaging.

Supported states from docs: `default`, `loading`, `stale`, `paused`, `loaded`, `disabled`

## Variant X State Behavior

Variant defines the shape of the future content. State defines whether the placeholder is actively loading, stale, paused, loaded, or unavailable.

State matrix: `loading`, `stale`, `paused`, `loaded`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Text | text |  |
| Row | row |  |
| Card | card |  |

## Full Width

Skeleton should fill the same width as the content it reserves. Full-width skeletons are useful for rows, modules, and cards; compact skeletons should remain compact.

- Table loading: layout: stack
- Dashboard module: layout: stack
- Map panel: layout: stack

## Responsive Layout Patterns

Responsive skeletons keep the future layout stable. On small screens, stack bones vertically; on wider screens, preserve row and card rhythm.

| Example | Layout | Density |
| --- | --- | --- |
| Phone card | button-stack | lg |
| Desktop list | simple-demo-row | md |

## Viewport Organization

Use Skeleton where real content will appear. If the wait has measurable progress, use Progress Indicator. If loading fails, replace Skeleton with recovery.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Stack skeleton bones inside the same card or row that will receive content. | stacked card | lg |
| Tablet | Preserve card rhythm and avoid layout shift during data hydration. | module card | md |
| Desktop | Use row or table skeletons for dense work queues; use table where the container preserves column width. | table row | sm |

## Playground

Use the playground to verify variant, line count, state, full-width behavior, reduced motion, and whether Skeleton is still the right component instead of Progress Indicator.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Wallet card loading |  |
| variant | select | card | text, title, circle, card, pill, row, media, chart, table |
| lines | range | 3 |  |
| state | select | loading | default, loading, stale, paused, loaded, disabled |
| fullWidth | checkbox | true |  |

## API And Foundations

Skeleton API exposes variant, lines, rows, columns, state, label, and full-width behavior while Design System owns shimmer, reduced motion, layout rhythm, density, and loading semantics.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | Yes | Loading context for the owning region. |
| variant | SkeletonVariant | No | Future content structure. |
| lines | number | No | Number of text or row bones. |
| rows | number | No | Number of table rows when variant is table. |
| columns | number | No | Number of table columns when variant is table. |
| busy | boolean | No | Sets aria-busy for the loading region. |
| state | SkeletonState | No | Maps loading, stale, paused, loaded, and disabled state treatment. |
| fullWidth | boolean | No | Lets the placeholder fill the owning region when the future content is full-width. |
| width | string \| number | No | Optional placeholder width for direct structural bones. |
| height | string \| number | No | Optional placeholder height for direct structural bones. |

## Implementation Checklist

- Provide `label`: Loading context for the owning region.
- Owning region can expose aria-busy
- Decorative bones are not focusable
- Reduced motion removes shimmer
- Variant matches future content
- Skeleton is replaced on loaded or error
- Full-width layout works on mobile

## Tests And Rejection Rules

Must test:

- Owning region can expose aria-busy
- Decorative bones are not focusable
- Reduced motion removes shimmer
- Variant matches future content
- Skeleton is replaced on loaded or error
- Full-width layout works on mobile

Reject if:

- Skeleton appears without a known future structure.
- A real progress value exists but Skeleton is used instead.
- The placeholder remains after content loads.
- Loading failure keeps showing Skeleton.
- Raw color, spacing, or motion values are used.

## MIEL

MIEL treats Skeleton as structural loading: agents can use it when future content shape is known but data is missing, while humans confirm whether the wait needs progress, recovery, or a larger loading pattern.

Agents can decide:

- Use Skeleton for unknown-duration loading with known layout structure.
- Match variant to future content: text, row, card, media, chart, or table.
- Remove shimmer under reduced motion.

Agents must ask:

- The system knows real progress value or remaining steps.
- Loading can fail, be retried, cancelled, or recover.
- The future layout is unknown or still being designed.

Agents must reject:

- Skeleton replaces error, empty, or recovery messaging.
- Placeholder shapes do not match the future content.
- Decorative bones become focusable or announced as real content.

Handoff language:

> I am using Skeleton because content structure is known but data is loading. I need confirmation on future layout, loading ownership, reduced motion, and when to replace it with content, progress, or recovery.
