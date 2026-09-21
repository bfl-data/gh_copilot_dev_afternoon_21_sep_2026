---
applyTo: '**/package.json,**/package-lock.json'
description: 'Dependency selection, update, and audit conventions.'
---

- Prefer the Node.js platform and existing dependencies before adding a package.
- Choose maintained packages with TypeScript and native ESM compatibility.
- Keep runtime dependencies separate from development-only dependencies.
- Update the lockfile whenever dependency versions change.
- Run typechecking, tests, and the build after dependency changes.
- Do not introduce duplicate libraries for functionality already provided by the project.
