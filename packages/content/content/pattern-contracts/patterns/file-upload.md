# File Upload

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:pattern-contracts` after changing pattern copy.

Source content:

- `packages/content/content/pattern-copy/patterns/file-upload/all.json`

## Purpose

Upload documents, invoices, vehicle files, or evidence with progress, validation, retry, removal, and completion feedback.

## Use When

- A process needs evidence, invoices, documents, or vehicle files.
- File type, size, progress, and retry policy must be visible.
- Users need to remove or replace a selected file before submitting.

## Do Not Use Without Review

- Upload destination, file policy, or retention rules are unclear.
- The upload contains regulated, legal, identity, or payment data without review.
- A simple link or existing document selector would be sufficient.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines upload surface, progress placement, file summary, and mobile stacking. |
| Voice | Owns file policy, validation, retry, remove, and success copy. |
| Energy | Controls focus, progress, error, success, and destructive remove states. |
| State | Empty, selected, uploading, invalid, retry, complete, and removed states are explicit. |
| Accessibility | Requires labelled trigger, validation text, progress announcement, and keyboard removal. |

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| trigger | Button | yes | Starts file selection after user action. |
| summary | Tag \| Card | conditional | Selected file name or policy summary. |
| progress | ProgressIndicator | conditional | Upload progress. |
| validation | InlineValidation | conditional | File type, size, or upload error. |
| emptyState | EmptyState | conditional | Shown before a file is selected. |
| feedback | Toast | conditional | Reports upload completion or removal. |

## Components And Primitives Used

- Button
- Progress Indicator
- Inline Validation
- Tag
- Empty State
- Toast

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Empty upload | Current candidate | Button and policy copy before selection. |
| Uploading | Required state | Progress indicator appears after user action. |
| Invalid file | Required state | Inline validation explains policy. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Progress update | Progress changes without layout jump. |
| Completion | Toast reports success and keeps file summary visible. |
| Remove | Removing a file returns to empty state. |

## Accessibility

- Upload trigger has clear label.
- File restrictions are text-backed.
- Progress is visible and announced.
- Invalid files provide recovery copy.
- Remove action is keyboard reachable.

## Implementation Checklist

- Declare `trigger`: Starts file selection after user action.
- Choose file shows file summary and progress.
- Invalid file shows Inline Validation.
- Remove returns to Empty State.
- Completion shows Toast.
- Progress remains readable on mobile.

## Tests And Rejection Rules

Must test:

- Choose file shows file summary and progress.
- Invalid file shows Inline Validation.
- Remove returns to Empty State.
- Completion shows Toast.
- Progress remains readable on mobile.

Reject if:

- File restrictions are missing.
- Progress or completion feedback is missing.
- Remove or retry behavior is undefined.

## MIEL

Agents can decide:

- Use File Upload when a process needs user-provided files.
- Use Progress Indicator for upload state.
- Use Inline Validation for file policy errors.

Agents must ask:

- Destination, retention, accepted file types, file size, privacy, or legal policy is unclear.

Agents must reject:

- File restrictions are missing.
- Progress or completion feedback is missing.
- Remove or retry behavior is undefined.

Handoff language:

> Confirm destination, file policy, retention, progress behavior, retry/remove behavior, and validation.
