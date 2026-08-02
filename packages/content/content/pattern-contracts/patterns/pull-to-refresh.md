# Pull To Refresh

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:pattern-contracts` after changing pattern copy.

Source content:

- `packages/content/content/pattern-copy/patterns/pull-to-refresh/all.json`

## Purpose

Refresh mobile lists, cards, stations, and dashboards with explicit stale data, progress, error recovery, and reduced-motion behavior.

## Use When

- A mobile surface can refresh remote data in place.
- Users need stale-data recovery without leaving context.
- The refresh affects cards, movements, stations, routes, or notifications.

## Do Not Use Without Review

- Refresh source, cache policy, or error recovery is unclear.
- The gesture hides a required explicit refresh action.
- The refreshed data affects financial, compliance, or legal state.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines pull region, indicator placement, safe area, and scroll containment. |
| Voice | Owns stale, refreshing, updated, and failed copy. |
| Energy | Controls progress, success, warning, and disabled state. |
| State | Idle, pulling, refreshing, stale, updated, failed, offline, and disabled states are explicit. |
| Momentum | Gesture feedback respects reduced motion and never becomes decorative. |
| Accessibility | Refresh action has an explicit button alternative and live status. |

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| content | List \| Card[] | yes | Refreshable content. |
| indicator | ProgressIndicator \| AnimatedMoment | yes | Visible refresh progress. |
| fallbackAction | Button | yes | Explicit refresh action for keyboard and assistive tech. |
| feedback | Toast \| InlineValidation | conditional | Updated, failed, or offline feedback. |

## Components And Primitives Used

- List
- Progress Indicator
- Button
- Toast
- Inline Validation
- Animated Moment

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Movement refresh | Required | Updates a list while preserving scroll context. |
| Offline recovery | Required state | Shows stale data and retry. |
| Reduced motion | Required state | Uses static progress and text status. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Pull affordance | Indicator follows gesture within bounds. |
| Refresh | Progress appears after user action. |
| Reduced motion | Removes elastic or decorative animation. |

## Accessibility

- A visible refresh button exists.
- Status updates are text-backed.
- Focus is not moved after refresh.
- Offline and error states include recovery.

## Implementation Checklist

- Declare `content`: Refreshable content.
- Declare `indicator`: Visible refresh progress.
- Declare `fallbackAction`: Explicit refresh action for keyboard and assistive tech.
- Explicit refresh updates status.
- Failure shows recovery.
- Reduced-motion state avoids decorative movement.
- Content remains readable during refresh.

## Tests And Rejection Rules

Must test:

- Explicit refresh updates status.
- Failure shows recovery.
- Reduced-motion state avoids decorative movement.
- Content remains readable during refresh.

Reject if:

- No explicit non-gesture fallback exists.
- Refresh state is visual-only.
- Failure has no recovery.

## MIEL

Agents can decide:

- Use Pull to Refresh for mobile in-place refresh.
- Provide a Button fallback.
- Show stale/offline status when data is not current.

Agents must ask:

- Cache policy, source, cadence, or error recovery is unclear.
- Refresh affects regulated, financial, or audit data.

Agents must reject:

- No explicit non-gesture fallback exists.
- Refresh state is visual-only.
- Failure has no recovery.

Handoff language:

> Confirm refresh source, cache policy, stale copy, explicit fallback, failure recovery, and reduced-motion behavior.
