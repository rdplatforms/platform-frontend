# Architecture Decision Records

Each ADR captures a decision, the context that drove it, and the accepted
tradeoffs — so a future contributor can tell the difference between "this
was deliberate" and "this was never revisited." To change a decision,
add a new ADR that supersedes it; don't edit history.

| ADR                                                | Decision                                                                                     |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| [0001](0001-pnpm-monorepo.md)                      | pnpm workspace monorepo, no build step for internal packages                                 |
| [0002](0002-business-resolver-strategy-pattern.md) | BusinessResolver as an ordered list of pure strategies                                       |
| [0003](0003-static-json-behind-services-layer.md)  | Static JSON as a temporary data source, fully behind a services abstraction                  |
| [0004](0004-data-driven-theme-engine.md)           | Data-driven theme engine instead of per-business stylesheets                                 |
| [0005](0005-config-driven-sections.md)             | Config-driven page sections via `SectionRenderer`                                            |
| [0006](0006-admin-as-separate-app.md)              | Admin as a separate app/deployment, not a `/admin` route                                     |
| [0007](0007-per-business-owner-dashboard.md)       | Per-business owner dashboard as a route in `apps/website`, localStorage-backed               |
| [0008](0008-per-business-bilingual-content.md)     | Per-business bilingual content via `LocalizableText`, additive to single-language businesses |
