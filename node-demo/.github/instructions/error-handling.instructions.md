---
applyTo: 'src/index.ts,src/controllers/**/*.ts,src/middleware/**/*.ts'
description: 'Error propagation and HTTP error-response conventions.'
---

- Let unexpected errors reach the global error handler; do not swallow them.
- Avoid controller-level `try/catch` blocks unless the error is intentionally translated.
- Use structured error envelopes for new endpoints.
- Do not expose stack traces, internal details, credentials, or implementation data to clients.
- Preserve the established mappings for validation, authentication, missing resources, conflicts, and unexpected failures.
