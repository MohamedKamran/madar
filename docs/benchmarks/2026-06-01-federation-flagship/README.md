# 2026-06-01 federation flagship

This folder publishes a **synthetic federation receipt** for the smallest reproducible **frontend/backend/shared** workflow that makes the enterprise case for `madar federate` concrete.

Why this matters: federation is an **enterprise differentiator** when a team needs one local, auditable graph for frontend, backend, and shared code instead of hopping between separate repo indexes. The checked-in fixture keeps that use case reproducible without claiming that one synthetic setup is already a broad customer benchmark.

## Included surfaces

- `tests/fixtures/federation-flagship/` — three checked-in repo-local `out/graph.json` fixtures for `frontend`, `backend`, and `shared`.
- `federation-receipt.json` — the bounded receipt for federating those three graphs with the current `madar federate` command.

## Reproduce the receipt

```bash
madar federate \
  tests/fixtures/federation-flagship/frontend/out/graph.json \
  tests/fixtures/federation-flagship/backend/out/graph.json \
  tests/fixtures/federation-flagship/shared/out/graph.json \
  --output out/federation-flagship
```

The fixture is intentionally small and synthetic. Its cross-repo edges come from **shared labels** (`SessionContract`, `UserProfile`) across the three repos, which is exactly what the current federation implementation infers today. That makes this a reproducible federation proof surface, **not a broad cross-repo benchmark headline** and not a claim that real enterprise repos will all behave the same way.

## Safe interpretation

- Treat this as a reproducible federation receipt, not a universal performance claim.
- Use it to explain why one graph across **frontend/backend/shared** repos is useful.
- Do not describe it as proof of broad cross-repo implementation outcomes or a production benchmark.
