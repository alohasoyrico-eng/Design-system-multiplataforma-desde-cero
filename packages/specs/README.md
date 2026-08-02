# @design-system/specs

Machine-readable Design System contracts live here.

The docs app may render these contracts, but it does not own them. Any new foundation, primitive, component, pattern, template, gate, or source-of-truth rule must be represented in `specs/unison.system.json` or rejected by the audit package.

`specs/unison.system.json` is an index over sharded machine contracts. Keep edits in the relevant shard so Design System can scale without recreating a spec monolith.
