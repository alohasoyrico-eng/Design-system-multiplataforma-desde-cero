# Tabs

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/tabs/all.json`

## Purpose

Use Tabs to switch between sibling content sections that share one context, such as wallet detail, movement history, settings, or dashboard views.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Iconography`, `Motion Curves`, `Duration`, `Density`, `Focus`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.tabs.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.state.*`, `sys.accessibility.*`

Gaps or review gates:

- Unrelated navigation
- Visual-only selected
- Missing keyboard behavior
- Selected/current uses non-Flow color.
- Tabs component demos render through docs-only tabs-demo instead of package Tabs.
- Ask before build: The sections are not siblings or change global navigation.
- Ask before build: The tab count, ordering, or labels are product-critical.
- Ask before build: The tabs hide a process that should become a pattern or template.

## Use When

- Use Tabs for peer sections inside one object, dashboard, or detail view.
- Use the default pill treatment unless product explicitly defines a larger navigation pattern.
- Attach Badge only when the count belongs to a tab label.

## Do Not Use Without Review

- Ask before use when the sections are not siblings or change global navigation.
- Ask before use when the tab count, ordering, or labels are product-critical.
- Ask before use when the tabs hide a process that should become a pattern or template.
- Tabs are used for unrelated routes.
- Active state is not machine-readable.
- Keyboard or panel association is missing.
- Tabs navigate unrelated destinations.
- Selected state is visual only.
- Labels truncate beyond recognition.
- Badges replace tab labels.
- Selected/current uses non-Flow color.
- Tabs component demos render through docs-only tabs-demo instead of the package Tabs.

## Operational Example

Use Tabs to switch between sibling content sections that share one context, such as wallet detail, movement history, settings, or dashboard views.

### Why Tabs

- Flow defines selected/current as action-primary and keeps Tabs scoped to sibling views in one context.
- The reference treatment informs the pill/underline structures, indicator travel, width change, and inertial feel.
- Tabs remains visually distinct from Segmented Control through pill or underline navigation treatment and panel association.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Tablist | Owns the accessible grouping and keyboard relationship. | comp.tabs.*, sys.accessibility.* |
| Tab | Names one sibling section and exposes selected state. | sys.voice.*, sys.state.* |
| Indicator | Shows active selection with Flow action-primary, inertial travel, and width change; this motion is the benchmark for selection components. | sys.energy.*, sys.frame.* |
| Optional badge | Shows compact count while tab label remains the primary name. | comp.badge.* |

## Accessibility

State precedence: disabled, focus, selected, hover, overflow, default

- Use tablist, tab, and tabpanel semantics.
- Expose exactly one selected tab in single-select tabs.
- Support arrow-key navigation between tabs.
- Keep tab labels visible and concise.
- Do not use tabs for unrelated destinations or primary navigation.

## Foundations

Referenced token families:

- `comp.badge.*`
- `comp.tabs.*`
- `sys.accessibility.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.state.*`
- `sys.voice.*`

Tabs API exposes label, items, selectedKey, onValueChange, and variant while Design System foundations own active indication, keyboard behavior, indicator momentum, and responsive layout.

## Variants

Tabs supports two approved visual treatments: default for the pill track and underline for flatter navigation surfaces. Both keep the selected indicator travel that defines Tabs momentum.

Approved variants from demos: `default`, `underline`

Demo labels:

- Default
- Underline
- With icons
- With badge

## States

Tabs states communicate active view, hover, focus, overflow, disabled, and default availability. Selected/current uses Flow action-primary while the indicator preserves inertial travel and width change.

Supported states from docs: `default`, `hover`, `selected`, `focus`, `overflow`, `disabled`

## Variant X State Behavior

Variant sets the visual treatment; state changes interaction feedback without changing tab semantics.

State matrix: `default`, `hover`, `selected`, `focus`, `overflow`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Default | default |  |
| Underline | underline |  |
| With badge | default |  |

## Full Width

Tabs may occupy container width, but each tab keeps label-driven sizing unless product chooses equal-width mobile tabs.

- Wallet detail: layout: row
- Dashboard: layout: row
- Dense settings: layout: row

## Responsive Layout Patterns

Responsive Tabs preserve section identity: show the default pill treatment with enough room to read labels, then scroll only when the item count needs it.

| Example | Layout | Density |
| --- | --- | --- |
| Mobile detail | simple-demo-row | lg |
| Desktop dashboard | simple-demo-row | md |

## Viewport Organization

Use tabs when content sections are peers. Keep the default pill treatment legible before adding more items.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Use short labels and enough width for the active pill. | default 3 items | lg |
| Tablet | Allow the tablist to breathe before adding counts or icons. | default with badge | md |
| Desktop | Use more labels only when the container provides enough room. | default 5 items | sm |

## Playground

Use the playground to confirm visual treatment, label length, active state, item count, and density before Tabs enters a template or pattern.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| ariaLabel | text | Wallet sections |  |
| variant | select | default | default, underline |
| itemCount | select | 3 | 3, 4, 5 |
| state | select | selected | default, hover, selected, focus, overflow, disabled |
| density | select | md | sm, md, lg |

## API And Foundations

Tabs API exposes label, items, selectedKey, onValueChange, and variant while Design System foundations own active indication, keyboard behavior, indicator momentum, and responsive layout.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | Yes | Accessible tablist label. |
| items | Array<{ key?: string; value?: string; label: string; icon?: string; count?: number; badge?: BadgeProps; disabled?: boolean }> | Yes | List of sibling sections with optional icon and badge metadata. |
| selectedKey | string | No | Active tab key. |
| onValueChange | (key: string) => void | No | Called when local tab selection changes. |
| variant | "default" \| "underline" | No | Visual treatment for sibling section navigation. |

## Implementation Checklist

- Provide `label`: Accessible tablist label.
- Provide `items`: List of sibling sections with optional icon and badge metadata.
- Tablist has accessible name
- One selected tab is exposed
- Keyboard navigation works
- Panel association is clear
- Overflow does not hide labels
- Selected/current uses Flow action-primary
- Indicator travels and resizes with inertial easing

## Tests And Rejection Rules

Must test:

- Tablist has accessible name
- One selected tab is exposed
- Keyboard navigation works
- Panel association is clear
- Overflow does not hide labels
- Selected/current uses Flow action-primary
- Indicator travels and resizes with inertial easing

Reject if:

- Tabs navigate unrelated destinations.
- Selected state is visual only.
- Labels truncate beyond recognition.
- Badges replace tab labels.
- Selected/current uses non-Flow color.
- Tabs component demos render through docs-only tabs-demo instead of the package Tabs.

## MIEL

MIEL treats Tabs as sibling-view navigation inside one context: agents can assemble items and active state, while humans confirm information architecture and whether the structure belongs in a pattern.

Agents can decide:

- Use Tabs for peer sections inside one object, dashboard, or detail view.
- Use the default pill treatment unless product explicitly defines a larger navigation pattern.
- Attach Badge only when the count belongs to a tab label.

Agents must ask:

- The sections are not siblings or change global navigation.
- The tab count, ordering, or labels are product-critical.
- The tabs hide a process that should become a pattern or template.

Agents must reject:

- Tabs are used for unrelated routes.
- Active state is not machine-readable.
- Keyboard or panel association is missing.

Handoff language:

> I am using Tabs for sibling content in one context. I need confirmation on section IA, default selected tab, and whether this should escalate to a pattern.
