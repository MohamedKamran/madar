# GoValidate shared benchmark quality gates

This directory holds the shared pack-quality and answer-quality gates for committed GoValidate benchmark artifacts.

## Files

- `quality-gates.json` — named gate definitions plus the prompt text they apply to
- `verify-pack-quality.js` — deterministic verifier for persisted `graphify-ts compare` reports
- `verify-answer-quality.js` — deterministic verifier for saved `*-answer.txt` artifacts

## Usage

By gate name:

```bash
node docs/benchmarks/govalidate-suite/verify-pack-quality.js \
  --report path/to/report.json \
  --gate docs-artifact
```

By prompt text:

```bash
node docs/benchmarks/govalidate-suite/verify-pack-quality.js \
  --report path/to/report.json \
  --prompt "Explain how idea report is getting generated"
```

The verifier reads `report.pack`, checks normalized matched-node labels against the required/forbidden lists, enforces the numeric ceilings, prints a deterministic pass/fail summary, and exits non-zero on malformed input or any gate failure. Label matching lowercases and strips non-alphanumeric characters, so gate labels must still contain at least one alphanumeric character after normalization.

## Answer quality usage

By gate name:

```bash
node docs/benchmarks/govalidate-suite/verify-answer-quality.js \
  --answer path/to/graphify-answer.txt \
  --gate docs-artifact
```

By prompt text:

```bash
node docs/benchmarks/govalidate-suite/verify-answer-quality.js \
  --answer path/to/graphify-answer.txt \
  --prompt "Explain how idea report is getting generated"
```

The answer-quality verifier applies deterministic answer-term checks from `quality-gates.json`: required answer terms must appear, forbidden answer terms must stay absent, and the script exits non-zero on malformed input or failed term checks. `required_concepts`, `answer_quality_notes`, and `manual_review_notes` are printed as manual-review guidance so the rubric stays deterministic without pretending substring matching can fully grade answer quality.

CLI shape: `--answer <answer.txt>` plus exactly one of `--gate <name>` or `--prompt <text>`.

## Compare report metadata

`graphify-ts compare` reports may also include a `graphify_trace` object when the graphify-side runner emits structured Claude-style tool-use messages. The field is intentionally compact and safe: it stores only aggregate counts, tool names, and per-turn tool summaries for the graphify run. It does **not** persist raw tool inputs, prompts, or full trace payloads. Terminal compare summaries surface the same data as one short `Graphify trace:` line instead of dumping the trace body.
