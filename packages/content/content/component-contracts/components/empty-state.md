# Empty State

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/empty-state/all.json`

## Purpose

Use Empty State when a surface has no useful content yet and the user needs context, next action, or recovery.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Iconography`, `Breakpoints`, `Focus`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.empty-state.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.state.*`, `sys.accessibility.*`

Gaps or review gates:

- Action is fake
- Absence reason vague
- Icon carries only meaning
- Raw visual values
- Ask before build: The absence may be caused by permissions, outage, or data delay.
- Ask before build: The recovery action changes data or access.
- Ask before build: The empty surface could be loading instead.

## Use When

- Use for empty lists, panels, dashboards, and search results.
- Use one recovery action when the next step is clear.
- Keep absence copy short and specific.

## Do Not Use Without Review

- Ask before use when the absence may be caused by permissions, outage, or data delay.
- Ask before use when the recovery action changes data or access.
- Ask before use when the empty surface could be loading instead.
- The action does nothing.
- The copy blames the user.
- The state hides an actual error or permission issue.
- The action is fake.
- Absence reason is vague.
- Icon carries the only meaning.
- Raw colors or spacing are used.

## Operational Example

Use Empty State when a surface has no useful content yet and the user needs context, next action, or recovery.

### Why Empty State

- Empty State explains absence instead of leaving a blank surface.
- The ZIP reference uses a centered column, 64px muted icon circle, compact title, restrained description, and optional action.
- Use it for recoverable absence, not as a replacement for loading, error detail, or marketing copy.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Container | Centers the absence message inside the owning surface. | comp.empty-state.*, sys.frame.* |
| Icon circle | Provides a quiet visual anchor without competing with primary actions. | sys.symbol.*, sys.iconography.*, sys.energy.* |
| Title | Names the absence in human language. | sys.voice.* |
| Description | Explains cause, expectation, or recovery in one short sentence. | sys.voice.*, sys.accessibility.* |
| Action | Optional direct recovery when the user can act now. | sys.state.*, sys.tone.* |

## Accessibility

State precedence: error, loading, permission, action, search-empty, default

- Use visible text for the absence; do not rely on icon meaning.
- Only render an action when it is available and useful.
- Keep the title and description close to the empty surface.
- Do not announce decorative icons as content.
- Use Inline Validation or Toast when the absence is caused by a recent user action.

## Foundations

Referenced token families:

- `comp.empty-state.*`
- `sys.accessibility.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.iconography.*`
- `sys.state.*`
- `sys.symbol.*`
- `sys.tone.*`
- `sys.voice.*`

Empty State API exposes title, description, icon, variant, state, and optional action while Design System foundations own spacing, copy hierarchy, icon treatment, and accessibility.

## Variants

Empty State variants describe the reason for absence: first use, search empty, permission, error, and maintenance.

Approved variants from demos: `first-use`, `search-empty`, `permission`, `error`, `maintenance`

Demo labels:

- No active vehicles
- No matches
- Access required
- Could not load
- Maintenance window

## States

Empty State states describe absence reason, recovery availability, and whether content is still loading.

Supported states from docs: `default`, `action`, `search-empty`, `permission`, `loading`, `error`

## Variant X State Behavior

Variant explains why content is absent; state decides whether the user can recover, wait, or ask for access.

State matrix: `default`, `action`, `search-empty`, `permission`, `loading`, `error`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| First use | first-use |  |
| Search empty | search-empty |  |
| Permission | permission |  |

## Full Width

Empty State can fill an empty surface while the message keeps a readable max width.

- Dashboard panel: layout: full surface
- Search result: layout: full surface
- Permission panel: layout: full surface

## Responsive Layout Patterns

Empty State keeps the same hierarchy across viewports: icon, title, description, optional action.

| Example | Layout | Density |
| --- | --- | --- |
| Phone empty list | simple-demo-row | lg |
| Desktop panel | simple-demo-row | sm |

## Viewport Organization

Keep Empty State inside the empty surface, not as a page hero unless the whole page has no content.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Use short copy and one clear action. | empty list | lg |
| Tablet | Keep message centered in the owning panel. | panel absence | md |
| Desktop | Use full panel width with readable copy max width. | dashboard surface | sm |

## Playground

Use the playground to verify title, description, icon, variant, state, and whether the recovery action is real.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | No active vehicles |  |
| description | text | When a vehicle connects, it will appear here. |  |
| variant | select | first-use | first-use, search-empty, permission, error, maintenance |
| state | select | default | default, action, search-empty, permission, loading, error |

## API And Foundations

Empty State API exposes title, description, icon, variant, state, and optional action while Design System foundations own spacing, copy hierarchy, icon treatment, and accessibility.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| title | string | Yes | Empty state title. |
| description | string | No | Empty state description. |
| icon | IconName | No | Decorative empty state icon. |
| action | ButtonProps | No | Single local recovery action rendered with Button. |
| variant | "first-use" \| "search-empty" \| "permission" \| "error" \| "maintenance" | No | Reason for absence. |
| state | "default" \| "action" \| "search-empty" \| "permission" \| "loading" \| "error" | No | Current absence or recovery state. |
| density | "sm" \| "md" \| "lg" | No | Flow density inherited from context. |
| fullWidth | boolean | No | Allows the message to fill the owning empty surface. |
| onAction | (key: string) => void | No | Called when the recovery action is selected. |

## Implementation Checklist

- Provide `title`: Empty state title.
- Readable title
- Decorative icon handling
- Real action behavior
- Search recovery
- Permission copy
- Phone fit

## Tests And Rejection Rules

Must test:

- Readable title
- Decorative icon handling
- Real action behavior
- Search recovery
- Permission copy
- Phone fit

Reject if:

- The action is fake.
- Absence reason is vague.
- Icon carries the only meaning.
- Raw colors or spacing are used.

## MIEL

MIEL treats Empty State as absence recovery: agents can draft the reason and next action, while humans confirm cause, permission, and business consequence.

Agents can decide:

- Use for empty lists, panels, dashboards, and search results.
- Use one recovery action when the next step is clear.
- Keep absence copy short and specific.

Agents must ask:

- The absence may be caused by permissions, outage, or data delay.
- The recovery action changes data or access.
- The empty surface could be loading instead.

Agents must reject:

- The action does nothing.
- The copy blames the user.
- The state hides an actual error or permission issue.

Handoff language:

> I am using Empty State because the surface has no content. Please confirm the cause, recovery action, and whether this is absence, loading, permission, or error.
