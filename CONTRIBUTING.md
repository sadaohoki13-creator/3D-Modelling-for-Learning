# Contributing

## Principles

Separate visual plausibility from physical validity. State units, sources, assumptions and uncertainty. Do not fabricate measured values, classroom outcomes or licensing permissions.

## Workflow

1. Discuss a scoped research, teaching or engineering change in an issue.
2. Use Node 22.12+, `npm ci`, and the root scripts.
3. Keep application work in `apps/showcase`, independent equations in `packages/vehicle-science`, and evidence/methodology in `docs`.
4. Add equation invariants and boundary tests for analytical changes. Add interaction coverage for UI changes.
5. Run `npm run format`, `npm run check`, and browser smoke tests against a running app.
6. Include reproduction steps, limitations and an updated validity matrix in the pull request.

Avoid generated builds, student data, credentials, large datasets and raw capture collections. Keep only curated, compressed demonstration images in `docs/media`. New assets require rights review and a manifest entry with hashes and attribution.

Prefer pedagogically meaningful changes to cinematic additions. A new physical claim needs a traceable source and validation appropriate to its domain. Participant studies require institutional review before recruitment.
