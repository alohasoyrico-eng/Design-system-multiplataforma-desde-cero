# Autocomplete

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:pattern-contracts` after changing pattern copy.

Source content:

- `packages/content/content/pattern-copy/patterns/autocomplete/all.json`

## Purpose

Suggest valid entities while preserving typing control, loading feedback, keyboard selection, and no-result recovery.

## Use When

- Users must enter or choose a valid entity from remote or large data.
- Suggestions reduce errors without blocking free typing too early.
- Loading, no-result, and selected states need to be explicit.

## Do Not Use Without Review

- The option set is short and stable enough for Select.
- Suggestion source, validation timing, or selection persistence is unclear.
- Users can accidentally submit stale or unauthorized suggestions.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines suggestion layer width, row density, and mobile fallback. |
| Voice | Owns hint, suggestion labels, loading copy, and no-result recovery. |
| Energy | Controls focus, highlighted suggestion, and selected value. |
| Depth | Suggestion layer appears above nearby content without obscuring form context. |
| State | Idle, typing, loading, suggestions, selected, no results, and error states are explicit. |
| Accessibility | Requires labelled input, keyboard navigation, active option announcement, and Escape close. |

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| control | Combobox | yes | Typed query, filtered suggestions, selected value, and combobox/listbox semantics. |
| loading | Skeleton \| ProgressIndicator | conditional | Shown while suggestions load. |
| suggestions | Combobox listbox | yes | Selectable results with metadata inside the Combobox option layer. |
| emptyState | EmptyState | yes | Recovery for no matching suggestions. |
| validation | InlineValidation | conditional | Shown when selected value is required or stale. |

## Components And Primitives Used

- Combobox
- Skeleton
- Empty State
- Inline Validation

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Entity suggestions | Current candidate | Typed query filters suggested entities. |
| Loading | Required state | Skeleton or progress appears while remote results load. |
| No results | Required state | Empty state explains recovery. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Suggestion reveal | Layer appears after typing and closes with selection or Escape. |
| Loading swap | Skeleton resolves into suggestions without moving focus. |
| Selection | Selected suggestion updates input and validation state. |

## Accessibility

- Combobox has visible label, aria-autocomplete=list, aria-expanded, aria-controls, and active option semantics.
- Keyboard users can reach and select suggestions.
- Loading and no-result states are announced.
- Escape closes suggestions without clearing input.
- Selected value remains distinguishable from typed text.

## Implementation Checklist

- Declare `control`: Typed query, filtered suggestions, selected value, and combobox/listbox semantics.
- Declare `suggestions`: Selectable results with metadata inside the Combobox option layer.
- Declare `emptyState`: Recovery for no matching suggestions.
- Typing in Combobox opens and filters suggestions.
- Loading state appears before suggestions when configured.
- Selecting a Combobox option writes the selected value.
- No-result query shows Empty State.
- Escape closes suggestions and preserves typed input.

## Tests And Rejection Rules

Must test:

- Typing in Combobox opens and filters suggestions.
- Loading state appears before suggestions when configured.
- Selecting a Combobox option writes the selected value.
- No-result query shows Empty State.
- Escape closes suggestions and preserves typed input.

Reject if:

- A normal Select is enough.
- Suggestions are not keyboard accessible.
- Loading or no-result states are missing.

## MIEL

Agents can decide:

- Use Autocomplete for large or remote entity sets.
- Use Skeleton for async suggestion loading.
- Show Empty State when no suggestions match.

Agents must ask:

- Validation source, stale suggestion policy, permissions, or free-text fallback is unclear.

Agents must reject:

- A normal Select is enough.
- Suggestions are not keyboard accessible.
- Loading or no-result states are missing.

Handoff language:

> Confirm data source, selection policy, async behavior, free-text rules, and validation.
