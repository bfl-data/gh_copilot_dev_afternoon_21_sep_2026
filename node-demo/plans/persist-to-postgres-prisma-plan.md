# Plan: Migrate from in-memory storage to PostgreSQL with Prisma

## Goal
Replace the current in-memory demo stores with a durable PostgreSQL-backed persistence layer using Prisma, while preserving the current API behavior and repo architecture.

## Current state
- The app is a small Node.js + TypeScript Express API.
- Auth and user data are stored in in-memory Maps in [src/controllers/auth-controller.ts](../src/controllers/auth-controller.ts) and [src/controllers/user-controller.ts](../src/controllers/user-controller.ts).
- This is intentional demo state, not durable storage.
- The app is designed around thin controllers and lightweight services; the migration should maintain this separation.

## Target state
- PostgreSQL is the persistence layer.
- Prisma is the data-access interface.
- Controllers remain focused on HTTP validation and response mapping.
- Business logic remains in services.
- The existing endpoint contract stays stable unless a tested requirement says otherwise.

## Workstreams

### 1) Dependency and configuration setup
- [x] Install Prisma and Prisma Client.
- [x] Add a PostgreSQL connection string in configuration via [src/config.ts](../src/config.ts).
- [ ] Add any required scripts for migration and local DB startup.
- [ ] Document the dev setup for Postgres in the repo.

Acceptance criteria:
- [x] `npm install` includes the Prisma packages.
- [x] `DATABASE_URL` is read from environment variables via the centralized config module.
- [ ] Local developers can start Postgres and connect the app to it.

### 2) Database schema design
- [ ] Create a Prisma schema with a `User` model matching the app’s current user/auth needs.
- [ ] Add fields such as `id`, `email`, `passwordHash`, `displayName`, `createdAt`, and `updatedAt`.
- [ ] Enforce key constraints such as unique email addresses.
- [ ] Add a migration for the initial schema.

Acceptance criteria:
- [ ] `npx prisma migrate dev` creates the database tables successfully.
- [ ] The schema matches the application’s existing auth and profile semantics.

### 3) Service-layer migration
- [ ] Create or update service modules for registration, login, profile creation, listing, fetching, and updating.
- [ ] Replace in-memory Map logic with Prisma queries.
- [ ] Preserve the current behavior for duplicate registration, failed login, missing profile, and validation failures.
- [ ] Keep password hashing with bcrypt and store only the hash in the database.

Acceptance criteria:
- [ ] Auth registration creates a user record in Postgres.
- [ ] Login verifies the stored hash and returns the same generic invalid-credentials responses.
- [ ] User profile CRUD uses Postgres instead of memory.
- [ ] Service methods return the same semantic outcomes as before.

### 4) Controller refactor
- [ ] Update [src/controllers/auth-controller.ts](../src/controllers/auth-controller.ts) to delegate to services.
- [ ] Update [src/controllers/user-controller.ts](../src/controllers/user-controller.ts) to use the service layer for all persistence operations.
- [ ] Keep validation and response mapping in the controller layer.
- [ ] Avoid exposing database errors directly to clients.

Acceptance criteria:
- [ ] Existing endpoint routes and HTTP status codes remain consistent.
- [ ] Controllers remain thin and do not contain business logic or raw DB queries.

### 5) Local development setup
- [ ] Add a local Postgres startup option, such as Docker Compose.
- [ ] Document the commands for starting Postgres, running Prisma migrations, and starting the app.
- [ ] Explain the expected connection string and database name.

Acceptance criteria:
- [ ] A developer can set up the app locally with a working Postgres instance in a predictable way.
- [ ] Docs clearly state that app state is now durable across process restarts.

### 6) Test updates
- [ ] Review the existing tests for auth and profile flows.
- [ ] Add or update coverage for the Postgres-backed behavior, especially duplicate registration, invalid login, profile lookup, and validation edge cases.
- [ ] Keep tests deterministic and aligned with the repo’s Vitest conventions.

Acceptance criteria:
- [ ] The test suite passes.
- [ ] New tests cover the real persistence behavior rather than only mock interactions.

### 7) Validation and smoke testing
- [ ] Run the repo checks: typecheck and test suite.
- [ ] Run Prisma migration locally.
- [ ] Smoke-test the flows:
  - [ ] register a user
  - [ ] login with valid credentials
  - [ ] login with invalid credentials
  - [ ] create a profile
  - [ ] fetch a profile
  - [ ] update a profile
  - [ ] confirm data persists after restart

Acceptance criteria:
- [ ] All checks pass.
- [ ] The app behaves correctly with real Postgres storage.

## Suggested implementation order
- [x] Add Prisma and config updates.
- [ ] Create the Prisma schema and migration.
- [ ] Add services for auth + user persistence.
- [ ] Refactor controllers to use services.
- [ ] Add local Postgres startup docs.
- [ ] Update or add tests.
- [ ] Verify end-to-end behavior.

## Risks and mitigations
- Risk: hidden state leaks during the migration.
  - Mitigation: remove the in-memory Maps completely once the DB-backed flow is active.
- Risk: breaking the public API contract.
  - Mitigation: keep the same endpoint shapes and status codes as the current demo app.
- Risk: tests still validate stale in-memory behavior.
  - Mitigation: update tests to cover the Postgres-backed flows and preserve the contract.
- Risk: local setup friction.
  - Mitigation: add a simple Docker Compose and clear migration instructions.

## Definition of done
- The app uses PostgreSQL as its persistent data store.
- Prisma is the query layer.
- The API contract remains stable.
- The repo includes setup and migration instructions.
- The project passes typechecking and tests.
- The app demonstrates durable data storage rather than process-local demo state.
