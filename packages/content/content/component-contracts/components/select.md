# Select

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/select/operational-example.json`
- `packages/content/content/component-copy/components/select/anatomy.json`
- `packages/content/content/component-copy/components/select/accessibility.json`
- `packages/content/content/component-copy/components/select/variants.json`
- `packages/content/content/component-copy/components/select/states.json`
- `packages/content/content/component-copy/components/select/variant-state-behavior.json`
- `packages/content/content/component-copy/components/select/full-width.json`
- `packages/content/content/component-copy/components/select/responsive-layout-patterns.json`
- `packages/content/content/component-copy/components/select/viewport-organization.json`
- `packages/content/content/component-copy/components/select/playground.json`
- `packages/content/content/component-copy/components/select/guidelines.json`
- `packages/content/content/component-copy/components/select/api-foundations.json`
- `packages/content/content/component-copy/components/select/tests-rejection-rules.json`
- `packages/content/content/component-copy/components/select/miel.json`
- `packages/content/content/component-copy/components/select/demooptions.json`

## Purpose

Select helps people narrow operational data without losing context. Show label, value, helper copy, source freshness, and recovery path.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Density`, `Focus`, `Loading`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.select.*`, `sys.energy.*`, `sys.voice.*`, `sys.frame.*`, `sys.state.*`, `sys.momentum.*`, `sys.accessibility.*`, `sys.symbol.*`

Reference translation: Adapt - Adopt the richer reference behavior for stateful selects, but translate visuals, spacing, typography, motion, and option semantics through Design System foundations and primitives.

Gaps or review gates:

- Label or helper text is missing.
- Options do not have stable value and label.
- Disabled or loading state is only visual.
- Raw color, spacing, radius, or motion bypasses tokens.
- Ask before build: The option source, freshness, permission scope, or empty state is unknown.
- Ask before build: The user needs free text, multi-select, filtering logic, or remote search beyond the existing pattern.
- Ask before build: Changing the selected value affects money, compliance, access, analytics, or saved preferences.

## Use When

- Use Select when the user must choose one value from a finite known list.
- Configure label, selected value, helper text, loading, error, disabled, and open behavior.
- Use option-layer behavior only when the existing pattern covers grouping, search, or mobile presentation.

## Do Not Use Without Review

- Ask before use when the option source, freshness, permission scope, or empty state is unknown.
- Ask before use when the user needs free text, multi-select, filtering logic, or remote search beyond the existing pattern.
- Ask before use when changing the selected value affects money, compliance, access, analytics, or saved preferences.
- Options are not stable enough to expose as label-value pairs.
- The component is being used as a search box or free-form input.
- Loading, disabled, or error is only visual and lacks helper copy.
- The agent creates multi-select behavior before a pattern exists.
- Label or helper text is missing.
- Options do not have stable value and label.
- Disabled or loading state is only visual.
- Raw color, spacing, radius, or motion bypasses tokens.

## Operational Example

Select helps people narrow operational data without losing context. Show label, value, helper copy, source freshness, and recovery path.

### Why this is a Select case

- Options come from remote operational data and can be stale, loading, or permission-filtered.
- Changing value updates dashboard filters, URL state, analytics, and table queries.
- Keyboard and screen reader users need label, active option, selected value, and listbox state.

Scenario type: `filter-console`

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| field wrapper | Owns label, helper, validation, and disabled/loading relationship. | comp.select.*, sys.frame.* |
| trigger | Native button-like control that exposes value and opens the option layer. | sys.energy.*, sys.state.*, sys.symbol.* |
| value | Visible selected option remains the accessible value summary. | sys.voice.* |
| option layer | Popover or sheet presents options, groups, disabled reasons, and active option. | sys.depth.*, sys.momentum.* |
| helper text | Explains source, freshness, validation, or recovery. | sys.voice.*, sys.accessibility.* |

## Accessibility

State precedence: disabled, loading, error, open, focus, filled, default

- Visible label remains the accessible name.
- Trigger exposes combobox state and selected value.
- Options support keyboard navigation, active option, and selected option.
- Loading, empty, error, and disabled states are announced with recovery copy.
- Desktop option layers preserve focus return and selected value.

## Foundations

Referenced token families:

- `comp.select.*`
- `sys.accessibility.*`
- `sys.depth.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.momentum.*`
- `sys.state.*`
- `sys.symbol.*`
- `sys.voice.*`

Select composes field, trigger, option surface, validation, loading, and events for one closed-choice value. Select input, country search, and multiple selection must be documented as their own system items instead of expanding this API silently.

## Variants

Select variants cover one closed-choice value. Base Select has the default trigger and an inline trigger for composition inside another field surface. Filled, open, loading, error, and disabled are states, not variants.

Approved variants from demos: `default`, `inline`

Demo labels:

- Default
- Inline

## States

Select states must be visible in both control and helper text, especially when options are loading, invalid, unavailable, or permission-blocked.

Supported states from docs: `open`, `focus`, `filled`, `loading`, `error`, `disabled`

## Variant X State Behavior

Every state must preserve the label, selected value, helper text, and recovery path.

State matrix: `default`, `open`, `focus`, `filled`, `loading`, `error`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Required |  |  |
| Optional |  |  |
| Permissioned |  |  |

## Full Width

Full-width Select is for constrained filters and form rows. Dense desktop toolbars can use aligned natural width.

- Natural width: layout: stack-natural
- Form row: layout: stack
- Responsive containers: layout: container

## Responsive Layout Patterns

Use popovers when the list is short. Use a sheet or full-screen selector when options are long, grouped, searchable, or need recovery copy.

| Example | Layout | Density |
| --- | --- | --- |
| Desktop filter bar | action-layout three |  |
| Density scale | density-scale |  |

## Viewport Organization

Adapt option access to the viewport. Select owns the field trigger and desktop option layer; modal or searchable choice flows belong to patterns.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Smartphones + phablets | Use large density and keep helper text close to the trigger; escalate long or searchable choices to a pattern. |  | lg |
| Tablets + laptops | Use inline filters and popovers while keeping labels, helper text, and source freshness visible. |  | md |
| Desktops + TV | Use larger filter surfaces or inspector panels when viewed at distance or in dashboards. |  | lg |

## Playground

Inspect how label, value, helper text, and state resolve into the Select contract.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Fleet |  |
| value | text | North Region Fleet |  |
| helper | text | 28 vehicles |  |
| state | select | open | default, filled, open, focus, loading, error, disabled |
| density | select | md | sm, md, lg |

## API And Foundations

Select composes field, trigger, option surface, validation, loading, and events for one closed-choice value. Select input, country search, and multiple selection must be documented as their own system items instead of expanding this API silently.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | yes | Visible label and accessible name source. |
| value | string | controlled | Current selected value. |
| options | Option[] | yes | Each option includes value, label, optional description, disabled reason, and metadata. |
| icon | string | no | Optional leading Material Symbol for the selected domain, matching the reference dropdown treatment. |
| placeholder | string | no | Must explain what kind of entity is expected. |
| loading | boolean | no | Shows progress and blocks misleading stale options. |
| error | string | conditional | Visible recovery copy; associate with field. |
| disabled | boolean \| reason | no | Disabled states need explanation, especially permission-blocked. |
| density | "sm" \| "md" \| "lg" | no | Maps the trigger and option rhythm to Design System Density. |
| state | "default" \| "open" \| "focus" \| "filled" \| "loading" \| "error" \| "disabled" | no | Documents visual and interaction state without changing the single-select contract. |
| onChange | (value, option) => void | yes | Emits semantic value, selected option, source, and analytics metadata. |

## Implementation Checklist

- Provide `label`: Visible label and accessible name source.
- Provide `options`: Each option includes value, label, optional description, disabled reason, and metadata.
- Provide `onChange`: Emits semantic value, selected option, source, and analytics metadata.
- Renders label, selected value, helper text, and combobox/listbox semantics.
- Opens by click, Enter, Space, and ArrowDown.
- Restores focus after selection, cancel, Escape, or outside click.
- Announces loading, empty, error, disabled, and permission-blocked states.
- Mobile fallback preserves selected value.

## Tests And Rejection Rules

Must test:

- Renders label, selected value, helper text, and combobox/listbox semantics.
- Opens by click, Enter, Space, and ArrowDown.
- Restores focus after selection, cancel, Escape, or outside click.
- Announces loading, empty, error, disabled, and permission-blocked states.
- Mobile fallback preserves selected value.

Reject if:

- Label or helper text is missing.
- Options do not have stable value and label.
- Disabled or loading state is only visual.
- Raw color, spacing, radius, or motion bypasses tokens.

## MIEL

MIEL treats Select as a closed-choice contract: the agent can configure options, value, and state, while the human owns source quality, permissions, and fallback behavior.

Agents can decide:

- Use Select when the user must choose one value from a finite known list.
- Configure label, selected value, helper text, loading, error, disabled, and open behavior.
- Use option-layer behavior only when the existing pattern covers grouping, search, or mobile presentation.

Agents must ask:

- The option source, freshness, permission scope, or empty state is unknown.
- The user needs free text, multi-select, filtering logic, or remote search beyond the existing pattern.
- Changing the selected value affects money, compliance, access, analytics, or saved preferences.

Agents must reject:

- Options are not stable enough to expose as label-value pairs.
- The component is being used as a search box or free-form input.
- Loading, disabled, or error is only visual and lacks helper copy.
- The agent creates multi-select behavior before a pattern exists.

Handoff language:

> I am using Select because the choice is closed and the value must stay visible. I need confirmation on option source, permissions, empty state, and mobile behavior.
