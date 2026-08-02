# Search

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:pattern-contracts` after changing pattern copy.

Source content:

- `packages/content/content/pattern-copy/patterns/search/all.json`

## Purpose

Let users find drivers, vehicles, cards, stations, movements, and settings with scoped results, empty recovery, and clear submission behavior.

## Use When

- A task needs direct lookup across a known entity set.
- Results need scope, recent context, or no-result recovery.
- Search should stay visible as part of a page, toolbar, or shell surface.

## Do Not Use Without Review

- The field is only decorative and does not return useful results.
- The result source, scope, or privacy policy is unclear.
- A small fixed choice set would be better as Select.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines field width, result density, empty state placement, and responsive stacking. |
| Voice | Owns label, placeholder, result labels, recovery copy, and scope language. |
| Energy | Controls focus, selected result, action priority, and status tone. |
| State | Idle, typing, results, no results, loading, disabled, and error states are explicit. |
| Momentum | Result updates avoid jumpy layout and respect reduced motion. |
| Accessibility | Requires programmatic label, keyboard access, result count feedback, and no color-only state. |

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| input | Input | yes | Typed search term with label and placeholder. |
| scope | Select \| SegmentedControl | conditional | Narrows result domain when more than one source exists. |
| results | List \| Card[] | yes | Result set with label, metadata, and action. |
| emptyState | EmptyState | yes | Recovery when no result matches. |
| feedback | InlineValidation \| Toast | conditional | Reports invalid query or selected result. |

## Components And Primitives Used

- Input
- Select
- List
- Empty State
- Inline Validation
- Button

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Scoped search | Current candidate | Search with entity scope and filtered results. |
| No results | Required state | Empty state gives recovery and broader scope option. |
| Invalid query | Candidate | Inline validation explains minimum query or unsupported input. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Result update | Filtering updates rows without changing focus. |
| Empty transition | Empty state replaces results without decorative motion. |
| Selection feedback | Selected result reports state without interrupting navigation. |

## Accessibility

- Search input has a visible or programmatic label.
- Result count changes are available to assistive tech.
- Keyboard users can move from input to results.
- Empty and invalid states are text-backed.
- Scope changes do not clear typed input without confirmation.

## Implementation Checklist

- Declare `input`: Typed search term with label and placeholder.
- Declare `results`: Result set with label, metadata, and action.
- Declare `emptyState`: Recovery when no result matches.
- Typing filters results.
- No-result query shows Empty State.
- Scope changes preserve query and result count.
- Invalid short query shows Inline Validation.
- Selecting a result gives feedback or routes intentionally.

## Tests And Rejection Rules

Must test:

- Typing filters results.
- No-result query shows Empty State.
- Scope changes preserve query and result count.
- Invalid short query shows Inline Validation.
- Selecting a result gives feedback or routes intentionally.

Reject if:

- The field does not search anything.
- No-result recovery is missing.
- Result scope is ambiguous.

## MIEL

Agents can decide:

- Use Search when users need entity lookup.
- Choose scope labels from existing product vocabulary.
- Show Empty State when no result matches.

Agents must ask:

- Result source, privacy, analytics, permissions, or cross-tenant visibility is unclear.
- Search affects regulated, financial, or identity data.

Agents must reject:

- The field does not search anything.
- No-result recovery is missing.
- Result scope is ambiguous.

Handoff language:

> Confirm searchable entities, result source, privacy boundaries, scope labels, empty state, and selection behavior.
