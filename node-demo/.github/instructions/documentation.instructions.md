---
applyTo: 'README.md,src/**/*.ts,src/services/README.md'
description: 'Documentation, JSDoc, and API contract maintenance rules.'
---

- Keep README instructions aligned with the actual scripts, runtime requirements, and API behavior.
- Document exported functions and classes with concise JSDoc including parameters, returns, and thrown errors where applicable.
- Update API examples when request or response contracts change.
- Describe in-memory stores as process-local demo state; do not imply durable persistence.
- Prefer short examples that can be verified against the current implementation.
