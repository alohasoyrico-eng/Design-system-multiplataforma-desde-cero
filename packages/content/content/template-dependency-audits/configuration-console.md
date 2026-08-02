# Configuration Console Dependency Audit

Status key: `ready`, `partial`, `wrong layer`, `missing`, `blocked`.

This audit is the working reference for rebuilding the Configuration Console template from Design System dependencies instead of local demo-only markup. Design System governs naming, tokens, foundations, primitives, components, patterns, and template composition. The reference zip is used only for look and feel, density, motion, and functional parity checks.

## Template Functional Baseline

Configuration Console must behave like an administrative product surface, not a static component demo.

- Navigate between Roles, Drivers, Vehicles, and Audit.
- Search and filter admin records.
- Change role mode: admin, approver, audit viewer.
- Edit permissions and expose pending changes.
- Confirm sensitive permission and lifecycle actions.
- Apply driver and vehicle lifecycle actions.
- Record audit evidence after meaningful actions.
- Show loading, empty, error, permission, and offline states.

## Component Dependencies

| Resource | Status | Notes |
| --- | --- | --- |
| Button | ready | Atomic action component is usable. |
| Badge | ready | Count/status metadata is usable. |
| Avatar | ready | Identity primitive is usable; account behavior belongs to Topbar/Menu. |
| Card | ready | Surface is usable; templates must not create local card substitutes. |
| KPI Tile | ready | Atomic metric is usable; KPI bands belong to KPI Card pattern. |
| Checkbox | ready | Atomic selection is usable; permission matrix behavior belongs to Roles and Permissions. |
| Switch | partial | Component exists, but permission dependency and audit behavior belong to pattern. |
| Table | partial | Component exists, but sorting/filtering/pagination/row processs belong to Virtual Data Table. |
| Dialog | partial | Modal surface exists, but action policy belongs to Confirmation Dialog. |
| Menu | partial | Component exists, but account/action routing belongs to Topbar or admin patterns. |
| Drawer | partial | Component exists, but responsive shell and editing lifecycle belong to patterns. |
| Input | ready | Remediated: package API, docs adapter, specs, generated contract, density, icon, suffix, mono, error/loading, describedby, and state behavior now align. Scoped results and no-result recovery remain Search pattern scope. |
| Icon Button | ready | Remediated: package API, docs adapter, specs, generated contract, density context, selected state, badge support, and motion now align. |
| Segmented Control | ready | Local mutually exclusive mode switching is usable. |
| Audit Event | ready | Atomic audit event is usable; ordered audit trail belongs to Timeline. |
| Toast | ready | Non-blocking feedback is usable. |
| Error Panel | ready | Local warning/error recovery is usable. |
| Inline Validation | ready | Field-level validation is usable. |
| Empty State | ready | Empty recovery component is usable. |
| Skeleton | ready | Loading component is usable. |
| Pagination | ready | Bounded paging component is usable. |

## Pattern Dependencies

| Resource | Status | Notes |
| --- | --- | --- |
| Topbar | partial | Must consume real Icon Button, Search/Input, Badge, Avatar, Menu, and Drawer behavior. |
| Sidebar | partial | Must validate responsive drawer, focus, motion, and active state in template context. |
| Search | partial | Must provide scope, results, empty recovery, and submission behavior. |
| Toolbar | partial | Must replace local admin toolbar compositions. |
| Roles and Permissions | partial | Must cover role matrix, locks, dependencies, approval gates, validation, confirmation, and audit evidence. |
| Driver and Vehicle Administration | partial | Must cover CRUD/lifecycle, search, row actions, assignment, confirmation, pagination, and states. |
| Virtual Data Table | partial | Must govern dense tables with sort, filter, pagination, loading, empty, and row processs. |
| Timeline | partial | Must replace local audit trail composition. |
| Confirmation Dialog | blocked | Contract/copy exists, but renderer/demo connection is missing for template use. |
| KPI Card | partial | Must wrap KPI Tile with owner, source, drill-in, stale/loading/error states. |

## Reference Zip Checks For This Template

Use `ui_kits/config/index.html` from `Design system multiplataforma desde cero.zip` for direct comparison:

- Functional state: `tab`, `vals`, `confirm`, `invite`, `email`, `role`, `reason`, `toast`.
- Admin controls: RoleMatrix, Table, Input, Combobox, Select, Textarea, Dialog, Toast.
- Density: max-width near 1080px, page padding around 32px 28px 64px, recurring gaps near 12px, 14px, 16px, and 24px.
- Motion: hover/press feedback, dialog/toast transitions, and panel changes should use Design System Momentum, not raw one-off effects.

## Current Remediation Order

1. Input.
2. Menu.
3. Table.
4. Dialog.
5. Switch.
6. Topbar and Search only after shell components are ready.
