---
applyTo: 'src/controllers/**/*.ts,src/index.ts'
description: 'REST API conventions for Express controllers and route registration.'
---

- Keep controllers focused on parsing input, invoking services or stores, and mapping results to HTTP responses.
- Preserve the established response envelopes and status-code conventions.
- Validate route parameters and request bodies before business logic runs.
- Register asynchronous controllers through `asyncHandler`.
- Do not add business logic to route registration or expose internal implementation details.
