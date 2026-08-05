# 0003: Static JSON as a Temporary Data Source Behind a Services Layer

## Status

Accepted

## Context

There is no backend yet, but the frontend must be built as if there will
be one — a Spring Boot API is planned (see
[../future-backend-contract.md](../future-backend-contract.md)) and
should be able to replace the data source without a frontend rewrite.
Components, hooks, and pages need real data to develop and demo against
today.

## Decision

Every content type gets a `*DataSource` interface
(`packages/services/src/dataSource/types.ts`) with `Promise`-returning
methods, even though the only implementation today (`JsonDataSource`) is
synchronous under the hood. A `*Service` class per content type
(`BusinessService`, `ServiceCatalogService`, etc.) depends on a
`*DataSource` via constructor injection and is the only thing components
and hooks are allowed to call. `static-data/` is its own workspace package
(`@rdplatforms/static-data`) that only `packages/services` depends on —
enforced by every other package's `package.json` simply not listing it.

## Consequences

- Nothing outside `packages/services` knows or cares that data currently
  comes from JSON. Swapping in `HttpDataSource` is a change to one file per
  content type plus the constructor argument of each service singleton —
  see [../future-backend-contract.md](../future-backend-contract.md).
- The `Promise`-based interface means every hook and component was already
  written against async data access from day one; there's no "convert
  synchronous calls to async" migration later.
- There's a small amount of ceremony (an interface, a service class, and a
  hook per content type) for what's currently a JSON lookup — accepted
  deliberately, because the alternative (components importing JSON
  directly) is exactly the tight coupling this platform can't afford at
  scale.
- Adding a business is a `static-data/` change plus one registry entry in
  `JsonDataSource.ts` (`BUSINESSES_BY_SLUG`) — that registry is explicitly
  temporary and disappears when `HttpDataSource` takes over.
