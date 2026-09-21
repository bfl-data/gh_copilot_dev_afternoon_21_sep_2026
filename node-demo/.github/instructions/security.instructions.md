---
applyTo: 'src/controllers/auth-controller.ts,src/config.ts,src/middleware/**/*.ts'
description: 'Authentication, secret handling, and input-safety rules.'
---

- Hash and verify passwords with `bcrypt`; never store, compare, or return plaintext passwords.
- Keep authentication failures generic so account existence is not revealed.
- Never log passwords, password hashes, tokens, authorization headers, or other secrets.
- Read configuration values through `src/config.ts`; do not access `process.env` elsewhere.
- Validate untrusted input before using it in authentication or authorization decisions.
