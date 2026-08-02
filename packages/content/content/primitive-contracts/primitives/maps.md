# Maps

Generated portable primitive contract for Design System.

The JSON spec and primitive copy remain the editable source of truth. Regenerate this file with `npm run build:primitive-contracts` after changing primitive copy or spec.

Source content:

- `packages/specs/specs/unison-system/artifacts/primitives/maps.json`
- `packages/content/content/primitive-copy.json`

## Purpose

Turn map product rules into implementation-ready primitives for geolocation, permission, station pins, clusters, route lines, selected states, fallback lists, and errors.

Maps sits between foundations and components.
It consumes semantic tokens and exposes a narrow API.
It prevents hardcoded values, detached semantics, and inconsistent implementation.
It must be portable across React, Flutter, documentation, and agent specs.

## Definition Of Ready

Before building or auditing any artifact against this primitive, confirm:

- Design System foundations govern the primitive.
- The primitive exposes a narrow, reusable API and never a one-off component shortcut.
- Components, patterns, templates, and docs consume the primitive contract instead of redefining visual values locally.
- ZIP reference details may influence equivalence only after the primitive maps them back to system foundations.

Layer: `Primitive`

Platform: `System`

Audiences: `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents`

Required sections: `purpose`, `foundationInputs`, `roles`, `productExamples`, `api`, `tokens`, `states`, `agentInstructions`, `rejectIf`

Governing foundations: `Energy`, `Accessibility`, `Depth`, `State`

Foundation inputs: `sys.energy.*`, `sys.accessibility.*`, `sys.depth.*`, `sys.state.*`

Coordinates primitives: `None declared`

Token dependencies: `map.*`, `sys.energy.*`, `sys.depth.*`, `sys.a11y.*`

## Roles

| Role | Token | Use |
| --- | --- | --- |
| permission | map.permission.* | Granted, denied, prompt, unavailable states. |
| stationPin | map.pin.station | Station marker with status and selection. |
| routeLine | map.route.line | Route preview and alternatives. |
| cluster | map.cluster | Dense station groups. |
| fallbackList | map.fallback.list | Non-map access to same station/route information. |

## Product Examples

- Nearby stations: Map pins mirror fallback list labels, distance, status, and route action.
- Permission denied: Denied location shows manual search and station list fallback.
- Route guidance: Selected route has line, ETA, station detail, and accessible summary.

## API

Props: `permission`, `center`, `pins`, `selectedStation`, `route`, `fallbackList`

Outputs: `mapLayerModel`, `stationListModel`, `routeSummary`, `permissionState`

## States

- nearby
- selected
- route
- denied
- offline
- error

## Responsibilities

- Render Maps through semantic foundation roles.
- Expose a small API that maps to foundations and token aliases.
- Work across density, responsive, keyboard, touch, screen reader, contrast, and reduced-motion requirements when relevant.
- Prevent raw visual values or duplicated implementation decisions.

## Token Dependencies

- map.*
- sys.energy.*
- sys.depth.*
- sys.a11y.*

## Agent Instructions

- Always provide a fallback list.
- Permission denied is a first-class state.
- Map detail panels need focus and escape behavior.

## Reject If

- Map has no fallback list.
- Permission denied blocks task completion.
- Pin meaning exists only visually.
- Route summary lacks text equivalent.

## Prevents

Hardcoded maps values and one-off implementation behavior.

## Demo Evidence

Type: `map`

Initial: `nearby`

Choices:

- nearby: nearby
- selected: selected
- route: route
- denied: denied
