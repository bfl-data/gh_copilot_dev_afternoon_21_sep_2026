---
applyTo: 'src/config.ts'
description: 'Centralized environment configuration and safe-default rules.'
---

- Keep all `process.env` access in `src/config.ts`.
- Export configuration through the existing `config` object or established module API.
- Provide sensible local-development defaults only where they are safe.
- Fail clearly for required production configuration that is missing or invalid.
- Never include secrets or secret values in logs, errors, or committed files.
