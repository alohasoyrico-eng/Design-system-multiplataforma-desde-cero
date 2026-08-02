# Agent Starter Kit

Use this path when an AI agent changes Design System.

1. Read `system.manifest.json`.
2. Treat `apps/docs` as a consumer.
3. Put canonical rules in `packages/specs`.
4. Put artifact inventory and copy in `packages/content`.
5. Put validation in `packages/audit`.
6. Put reusable prototype UI in `packages/tokens` or `packages/components`.
7. Run `npm run audit`.

Reject work that moves source-of-truth files back into the docs app or workspace root.
