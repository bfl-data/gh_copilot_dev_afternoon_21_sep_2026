---
applyTo: 'src/lib/logger.ts,src/controllers/**/*.ts,src/index.ts'
description: 'Structured logging and observability conventions.'
---

- Use the shared Pino `logger`; do not use `console.log` or create ad hoc logger instances.
- Prefer structured context first and the message second, for example `logger.info({ userId }, 'User created')`.
- Log meaningful lifecycle events and failures at appropriate levels.
- Keep sensitive values out of log context, including passwords, tokens, and authorization headers.
- Avoid noisy logs for ordinary successful internal steps unless they help diagnose behavior.
