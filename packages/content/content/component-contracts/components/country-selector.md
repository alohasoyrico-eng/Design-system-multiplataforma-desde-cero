# Country Selector

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/country-selector/all.json`

## Purpose

Use Country Selector when a user must choose one country or calling-code context before another component uses that value.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Density`, `Focus`, `Disabled`

Component dependencies: `select`

Token dependencies: `comp.select.*`, `sys.energy.*`, `sys.voice.*`, `sys.frame.*`, `sys.depth.*`, `sys.momentum.*`, `sys.state.*`, `sys.accessibility.*`

Reference translation: Adapt - The ZIP includes SelectCountry. Flow keeps the country/calling-code selector as its own component and lets Phone Input consume it.

Gaps or review gates:

- Flag-only meaning
- Phone Input duplicates selector options
- Calling code is not visible text
- Keyboard cannot select country
- Ask before build: The country source must include compliance or market restrictions.
- Ask before build: The selector needs search beyond the default country list.
- Ask before build: Region, language, or currency behavior is being mixed into country selection.

## Use When

- Use Country Selector for country and calling-code selection.
- Use inline mode inside Phone Input.
- Keep country label and calling code visible.

## Do Not Use Without Review

- Ask before use when the country source must include compliance or market restrictions.
- Ask before use when the selector needs search beyond the default country list.
- Ask before use when region, language, or currency behavior is being mixed into country selection.
- The selector is represented only by flags.
- Phone Input owns duplicated selector markup.
- The component becomes a generic region filter.
- Flag is the only country signal.
- Phone Input duplicates selector logic.
- Calling code is not text.
- Keyboard cannot select an option.

## Operational Example

Use Country Selector when a user must choose one country or calling-code context before another component uses that value.

### Why Country Selector

- It owns country, flag, calling code, listbox, selected state, and keyboard selection.
- Phone Input consumes it instead of duplicating country selector behavior.
- The flag supports recognition; country label and calling code remain the source of meaning.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Trigger | Shows selected flag, calling code, and chevron. | comp.select.*, sys.frame.* |
| Flag | Provides decorative recognition only; text remains required. | sys.iconography.*, sys.symbol.* |
| Option layer | Lists country label and calling code with selected state. | comp.select.*, sys.depth.* |
| Inline mode | Allows composition inside Phone Input without changing ownership. | sys.growth.*, sys.state.* |

## Accessibility

State precedence: disabled, error, open, focus, default

- Expose combobox/listbox semantics with aria-expanded and aria-controls.
- Keep country label and calling code available as text.
- Do not use the flag as the only accessible signal.
- Return focus to the trigger after selection.

## Foundations

Referenced token families:

- `comp.select.*`
- `sys.depth.*`
- `sys.frame.*`
- `sys.growth.*`
- `sys.iconography.*`
- `sys.state.*`
- `sys.symbol.*`

Country Selector API exposes one selected country and country option data. Flow owns trigger, listbox, state, density, flag primitive, and accessibility wiring.

## Variants

Country Selector has a default standalone treatment and an inline treatment for composition inside another field.

Approved variants from demos: `default`, `inline`

Demo labels:

- Default
- Inline
- Error
- Disabled

## States

Country Selector states cover default, open, focus, error, and disabled selection behavior.

Supported states from docs: `default`, `open`, `focus`, `error`, `disabled`

## Variant X State Behavior

Variant defines whether the selector is standalone or inline; state still resolves through the same trigger and option layer.

State matrix: `default`, `open`, `focus`, `error`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Default | default |  |
| Inline | inline |  |
| Support | default |  |

## Full Width

Country Selector normally keeps intrinsic width; parent fields may stretch it only as part of a larger form composition.

- Standalone: layout: button-stack
- Inline field: layout: button-stack
- Support form: layout: button-stack

## Responsive Layout Patterns

Use comfortable density on touch surfaces and keep the option layer wide enough for country names and calling codes.

| Example | Layout | Density |
| --- | --- | --- |
| Touch standalone | button-stack | lg |
| Phone inline | button-stack | lg |
| Desktop | simple-demo-row | sm |

## Viewport Organization

Country selection stays a local selector. Phone verification, onboarding, and payment flows decide where it appears.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Use inline when paired with a telephone field. | inline selector | lg |
| Tablet | Keep enough width for label and calling code. | form control | md |
| Desktop | Use compact density inside configuration or support forms. | compact selector | sm |

## Playground

Use the playground to verify country value, inline composition, density, and state.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| value | select | MX | MX, US, CU, AR, ES |
| state | select | default | default, open, focus, error, disabled |
| density | select | md | sm, md, lg |
| inline | checkbox | false |  |

## API And Foundations

Country Selector API exposes one selected country and country option data. Flow owns trigger, listbox, state, density, flag primitive, and accessibility wiring.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| id | string | No | Stable id used to connect trigger and listbox. |
| label | string | No | Accessible selector label. |
| value | string | No | Selected country code. |
| country | string | No | Alias for the selected country code when composed by another field. |
| countries | CountryOption[] | No | Country options with label, callingCode, and nationalLength. |
| disabled | boolean | No | Prevents selection and removes trigger from tab order. |
| invalid | boolean | No | Applies the error state when validation is owned by the consuming field. |
| density | sm \| md \| lg | No | Maps selector spacing and target sizing to the density context. |
| inline | boolean | No | Uses compact composition treatment. |
| searchable | boolean | No | Shows a local country/code search field inside the option layer. |
| searchPlaceholder | string | No | Placeholder for the local search field. |
| ariaLabel | string | No | Overrides the trigger accessible name when composed in another component. |
| listboxLabel | string | No | Overrides the option layer accessible label. |
| className | string | No | Adds a consumer class for layout hooks without changing component anatomy. |
| hydrate | boolean | No | Allows a parent component to hydrate once after composing the selector. |
| onValueChange | (countryCode, country) => void | No | Emits selected country metadata. |

## Implementation Checklist

- Set `value` as a documented control. Options: MX, US, CU, AR, ES.
- Set `state` as a documented control. Options: default, open, focus, error, disabled.
- Set `density` as a documented control. Options: sm, md, lg.
- Set `inline` as a documented control.
- Combobox/listbox wiring
- Keyboard selection
- Flag plus text
- Inline composition
- Disabled and error states

## Tests And Rejection Rules

Must test:

- Combobox/listbox wiring
- Keyboard selection
- Flag plus text
- Inline composition
- Disabled and error states

Reject if:

- Flag is the only country signal.
- Phone Input duplicates selector logic.
- Calling code is not text.
- Keyboard cannot select an option.

## MIEL

MIEL treats Country Selector as a reusable country/calling-code selector. Agents may compose it into Phone Input but must not fold its ownership back into Phone Input.

Agents can decide:

- Use Country Selector for country and calling-code selection.
- Use inline mode inside Phone Input.
- Keep country label and calling code visible.

Agents must ask:

- The country source must include compliance or market restrictions.
- The selector needs search beyond the default country list.
- Region, language, or currency behavior is being mixed into country selection.

Agents must reject:

- The selector is represented only by flags.
- Phone Input owns duplicated selector markup.
- The component becomes a generic region filter.

Handoff language:

> I am using Country Selector as the reusable country and calling-code selector. Please confirm the country source, supported markets, and whether inline composition is required.
