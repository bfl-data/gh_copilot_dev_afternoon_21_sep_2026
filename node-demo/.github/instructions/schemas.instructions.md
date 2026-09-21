---
applyTo: 'src/schemas/**/*.ts,src/controllers/**/*.ts'
description: 'Zod schema design and request-validation conventions.'
---

- Define reusable Zod schemas next to the domain they validate.
- Infer TypeScript types from schemas rather than duplicating request-body interfaces.
- Use `.parse()` when invalid input should reach the global error handler.
- Keep validation rules explicit and reject malformed or unexpected input.
- Preserve the repository's `VALIDATION_FAILED` error envelope for Zod failures.
