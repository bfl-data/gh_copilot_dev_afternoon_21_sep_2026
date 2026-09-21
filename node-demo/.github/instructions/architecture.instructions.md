---
applyTo: 'src/**/*.ts'
description: 'Project layering and ownership rules for TypeScript source files.'
---

- Keep HTTP concerns in controllers and middleware.
- Put reusable business logic in services; services must not access `res`.
- Keep repositories, if introduced, limited to data access without business rules.
- Keep utilities small, deterministic, and independently testable.
- Preserve native ESM imports with explicit `.js` extensions and strict TypeScript compatibility.
- Treat current in-memory stores as process-local demo state, not durable persistence.
