# Copilot Node.js Demo

A small Express 4 service written in strict TypeScript and native ESM. It is used for Copilot training demos and provides a compact example of an HTTP API with request validation, password hashing, structured logging, async error handling, and focused Vitest unit tests.

## Why This Project Is Useful

- Runs on Node.js 20 or newer with a short, readable TypeScript codebase.
- Demonstrates health checks, registration, login, and user-profile operations.
- Validates profile input with Zod and uses bcrypt for password hashing and verification.
- Uses structured Pino logs and a centralized error handler.
- Includes small independently testable utilities and colocated Vitest tests.

This is a process-local demo service. Users and profiles are stored in memory and are lost whenever the process restarts. It is not intended for production authentication or durable data storage.

## Prerequisites

- Node.js 20 or newer
- npm

## Get Started

Install dependencies:

```bash
npm install
```

Start the service with automatic reload during development:

```bash
npm run dev
```

The service listens on `http://localhost:3000` by default. Verify it is running:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{"status":"ok","uptime":12.34}
```

### Try the API

Register a user, log in, and create a profile. Save the returned profile `id` before calling the update endpoint.

```bash
curl -X POST http://localhost:3000/auth/register \
	-H "Content-Type: application/json" \
	-d '{"email":"ada@example.com","password":"correct horse battery staple"}'

curl -X POST http://localhost:3000/auth/login \
	-H "Content-Type: application/json" \
	-d '{"email":"ada@example.com","password":"correct horse battery staple"}'

curl -X POST http://localhost:3000/users \
	-H "Content-Type: application/json" \
	-d '{"email":"ada@example.com","displayName":"Ada Lovelace"}'
```

Available routes:

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Check service health. |
| `POST` | `/auth/register` | Register an email and password. |
| `POST` | `/auth/login` | Verify credentials. |
| `POST` | `/users` | Create a validated user profile. |
| `GET` | `/users` | List profiles currently held in memory. |
| `GET` | `/users/:id` | Fetch a profile by UUID. |
| `PUT` | `/users/:id` | Replace a profile's email and display name. |

Profile requests require a valid email and a non-empty display name of up to 80 characters. Invalid profile input returns a `400` response with a `VALIDATION_FAILED` error code. Auth validation errors use the service's existing `{ "error": "..." }` response shape.

## Configuration

Configuration is read through `src/config.ts` and has safe local defaults:

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `3000` | Port used by the Express server. |
| `LOG_LEVEL` | `info` | Pino log level. |
| `NODE_ENV` | `development` | Runtime environment label used in startup logs. |

For example, on PowerShell:

```powershell
$env:PORT = "4000"
$env:LOG_LEVEL = "debug"
npm run dev
```

## Development Commands

```bash
npm run dev       # Run from TypeScript with watch mode
npm run typecheck # Check types without emitting files
npm test          # Run Vitest
npm run build     # Compile to dist/
npm start         # Run the compiled service
```

Tests live next to the source files as `*.test.ts`. The current test suite focuses on controller behavior and validation without making network calls.

## Project Layout

```text
src/
	controllers/  HTTP request handlers and response mapping
	lib/          shared infrastructure such as the Pino logger
	middleware/   Express middleware, including async error forwarding
	schemas/      Zod request schemas
	utils/        small reusable utilities
	config.ts     environment configuration
	index.ts      Express setup, routes, and global error handling
```

## Help and Documentation

Start with the source layout and the examples above. Repository-specific guidance for the Copilot training material is in [`notes/`](notes/), and the service's future service-layer notes are in [`src/services/README.md`](src/services/README.md).

For a bug or question, open an issue in the repository or contact the repository owner through the project's normal development channel. Because this is a private training demo, there is no public support forum or hosted API.

## Contributing

The repository is maintained by the Copilot training team and is intended primarily for instructional use. Contributions should keep the demo small, preserve strict TypeScript and native ESM conventions, and include focused Vitest coverage for behavior changes.

Before opening a change, run:

```bash
npm run typecheck
npm test
npm run build
```

There is currently no separate `CONTRIBUTING.md` or `LICENSE` file in the repository. Follow the repository owner's review and contribution process for proposed changes.