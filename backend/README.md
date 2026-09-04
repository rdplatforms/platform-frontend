# rdplatforms backend

Spring Boot API for the platform. See [../TASKS.md](../TASKS.md) for the
build-out plan and [../docs/future-backend-contract.md](../docs/future-backend-contract.md)
for the contract this implements against the existing frontend.

## Requirements

- Java 17
- Nothing else to install — the project uses the Gradle wrapper (`./gradlew`), which downloads the matching Gradle version on first run.

## Running locally

```bash
cd backend
./gradlew bootRun
```

Starts on **port 8081** (not 8080 — chosen to avoid colliding with other
local dev tooling). Verify it's up:

```bash
curl http://localhost:8081/actuator/health
# {"groups":["liveness","readiness"],"status":"UP"}
```

## Building

```bash
./gradlew build
```

Runs tests and produces a runnable jar under `build/libs/`.

## Project layout

```
backend/
├── build.gradle              Dependencies and plugins
├── src/main/java/com/rdplatforms/backend/
│   └── BackendApplication.java   Entry point
├── src/main/resources/
│   └── application.properties
└── src/test/java/...              Tests
```

This will grow module-by-module as [../TASKS.md](../TASKS.md) progresses
(entities/repositories in Milestone 1, security in Milestone 2, etc.) — no
speculative structure has been added ahead of the task that needs it.
