# rdplatforms backend

Spring Boot API for the platform. See [../TASKS.md](../TASKS.md) for the
build-out plan and [../docs/future-backend-contract.md](../docs/future-backend-contract.md)
for the contract this implements against the existing frontend.

## Requirements

- Java 17
- Docker (for local Postgres, and for tests — see below)
- Nothing else to install — the project uses the Gradle wrapper (`./gradlew`), which downloads the matching Gradle version on first run.

## Running locally

Start Postgres first:

```bash
cd backend
docker compose up -d
```

This runs Postgres on **host port 5433** (not 5432 — avoids colliding with
any other local Postgres) with database/user/password all `rdplatforms`.
Then:

```bash
./gradlew bootRun
```

Starts on **port 8081** (not 8080 — chosen to avoid colliding with other
local dev tooling). Flyway migrations (`src/main/resources/db/migration/`)
run automatically on startup. Verify it's up:

```bash
curl http://localhost:8081/actuator/health
# {"groups":["liveness","readiness"],"status":"UP"}
```

## Building and testing

```bash
./gradlew build
```

**Does not need `docker compose up`** — tests use Testcontainers, which
starts its own throwaway Postgres container per test run (needs Docker
running, but not the compose stack above). Produces a runnable jar under
`build/libs/`.

## Project layout

```
backend/
├── build.gradle                        Dependencies and plugins
├── docker-compose.yml                  Local Postgres for `bootRun`
├── src/main/java/com/rdplatforms/backend/
│   └── BackendApplication.java         Entry point
├── src/main/resources/
│   ├── application.properties
│   └── db/migration/                   Flyway migrations (schema source of truth)
└── src/test/java/...                   Tests (Testcontainers-backed)
```

This will grow module-by-module as [../TASKS.md](../TASKS.md) progresses
(entities/repositories in Milestone 1, security in Milestone 2, etc.) — no
speculative structure has been added ahead of the task that needs it.
