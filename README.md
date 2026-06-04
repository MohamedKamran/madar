# Madar

**Stop Claude Code, Cursor, Codex, and Copilot from wasting tokens rediscovering the same large TypeScript/Node repo.**

Madar compiles a task-aware local context pack from **the execution paths and structures relevant to this task**. That first pass is usually a much smaller execution slice or structural subset, with inline snippets and citations, so the agent can start from evidence before it starts searching the repo by hand.

Madar builds a local graph of your TypeScript/Node repo, then gives agents like Claude Code, Cursor, Codex, Copilot, Gemini, Aider, and OpenCode a task-aware context pack for the question you are asking.

Madar is deterministic local context compilation. It complements agents and IDE indexing; it is **not another generic codebase index**.

It helps agents spend less time rediscovering the same files, routes, imports, and flows.

[![npm](https://img.shields.io/npm/v/%40lubab%2Fmadar)](https://www.npmjs.com/package/@lubab/madar)
[![node >=20](https://img.shields.io/badge/node-%E2%89%A520-3c873a)](https://nodejs.org/)
[![local first](https://img.shields.io/badge/local--first-no%20cloud%20required-0f766e)](#privacy)
[![No API keys](https://img.shields.io/badge/API%20keys-none%20required-111827)](#trust--limitations)
[![license MIT](https://img.shields.io/badge/license-MIT-16a34a)](https://github.com/mohanagy/madar/blob/main/LICENSE)

## Why

On large repos, coding agents often burn context before they can answer:

- broad searches across unrelated folders
- repeated file discovery every session
- wrong-file edits because the first context was too shallow

Madar gives the agent a smaller, repo-grounded starting point.

It does not replace the agent. It helps the agent start from better evidence.

## Who Madar is for

- Teams using AI coding agents on medium-to-large TypeScript/Node repos where broad exploration creates cost, latency, privacy, or wrong-file-edit risk.
- Explain, review, and impact workflows where a bounded first pass is more useful than a broad repo crawl.

## Who Madar is not for

- Tiny repos, throwaway scripts, or one-off prompts where full-repo search is already cheap.
- Hosted-dashboard-first buyers or teams that need broad cross-language parity before the TypeScript/Node proof deepens.

## Madar vs Repomix vs Context7

| Tool | Best first use | Where it stops |
| --- | --- | --- |
| **Madar** | Task-scoped local repo evidence for explain, review, and impact work on large TypeScript/Node repos | Not a hosted knowledge base or broad cross-language parity tool today |
| **Repomix** | Exporting or sharing a broad repo snapshot/prompt bundle | Not a task-aware local retrieval layer, PR-impact surface, or agent install flow |
| **Context7** | Pulling external library/framework docs into prompts | Not a local codebase analysis, PR-impact, or graph-backed repository context tool |

Capability/scope summary only. See the [claims-and-evidence map](https://github.com/mohanagy/madar/blob/main/docs/claims-and-evidence.md#competitive-positioning) before turning this into a stronger claim.

## Install

```bash
npm install -g @lubab/madar
```

Madar requires Node.js 20 or newer.

## Quick Start

Run this inside your repo:

```bash
madar try "how does auth work?"
```

That command builds or reuses the local graph, prints a first context-pack result, and suggests the next install command.

For the manual flow:

```bash
madar generate .
madar summary
madar doctor
madar status
```

Want a tiny reproducible workspace? Start with [`examples/sample-workspace/`](https://github.com/mohanagy/madar/tree/main/examples/sample-workspace/) and the [sample workspace tutorial](https://github.com/mohanagy/madar/blob/main/docs/tutorials/sample-workspace.md).

Want the broader first-run walkthrough with install verification, one pack, and a safe compare smoke check? Use the [getting started tutorial](https://github.com/mohanagy/madar/blob/main/docs/tutorials/getting-started.md).

Then connect an agent:

```bash
madar claude install
```

Now ask your agent normal repo questions:

```text
How does auth work?
Where is the report generated?
Add telemetry to this flow.
Why does this endpoint return 403?
```

The agent can ask Madar for relevant files, symbols, snippets, and relationships before doing raw repo search.

## Choose your agent

```bash
madar claude install
madar codex install
madar cursor install
madar copilot install
madar gemini install
madar aider install
madar opencode install
```

After you generate `out/graph.json`, `madar doctor` and `madar status` check the local install wiring for Claude Code, Cursor, Gemini CLI, and GitHub Copilot CLI. They also lint the AGENTS-based Madar instruction profiles for Codex CLI, OpenCode, and Aider; if a profile drifts, they mark the agent as `partial` and suggest the matching reinstall command.

Install details, generated files, profiles, uninstall behavior, and verified copy/paste quickstarts live in the [CLI and MCP reference](https://github.com/mohanagy/madar/blob/main/docs/reference/cli-and-mcp.md), the [compatibility guide](https://github.com/mohanagy/madar/blob/main/docs/integrations/compatibility.md), the [agent quickstarts](https://github.com/mohanagy/madar/blob/main/docs/tutorials/agent-quickstarts.md), and the [launch checklist](https://github.com/mohanagy/madar/blob/main/docs/launch-checklist.md) for proof-first release/distribution copy.

## Use Without MCP

You can also generate context directly from the CLI:

```bash
madar pack "how does auth work?" --task explain --format text
```

Create an agent-ready prompt:

```bash
madar prompt "how does auth work?" --provider claude
```

Create a share-safe handoff for another coding tool:

```bash
madar handoff "add auth telemetry" --task implement --consumer copilot
```

`madar prompt` stays local. `madar pack` stays the richer local/full-context surface. `madar handoff` is the share-safe remote/background-agent artifact for cloud or async workers. Note: compare and benchmark flows can spend paid model tokens when you point them at a real model CLI.

The MCP equivalents include `context_pack`, `context_prompt`, and follow-up expansion through stable session refs. `context_pack` and `context_prompt` accept both `require_fresh_context` and `require_fresh_graph` for the same scoped-vs-global strictness choices. For follow-ups, reuse the same `session_id` with `context_prompt` when a conversation continues; `session_diagnostics` tells you whether the turn reused, added, updated, or invalidated prior context. Expect the biggest reuse gains with a mostly stable retrieved graph context. First turns and heavily changed retrieved context naturally show little or no reuse.

## What It Builds

Madar analyzes your local repo and creates a graph of files, imports, exports, symbols, routes, handlers, call relationships, dependency relationships, framework metadata, and task-relevant snippets.

The graph is stored locally in your project output folder.

## Fit

Madar is most useful when:

- your repo is medium or large
- the project is TypeScript or Node.js
- agents keep opening too many files
- you ask architecture, flow, review, or impact questions
- you want more task-aware context before edits
- token usage, latency, or local repo privacy matter

It helps less when:

- the repo is small
- the task is obvious from one file
- the question needs live runtime behavior
- the code relies heavily on dynamic patterns static analysis cannot see
- the generated graph is stale after large repo changes

If the repo changed a lot, regenerate:

```bash
madar generate .
```

## Freshness

Madar records graph freshness so agents can tell whether context still matches the repo. On git workspaces, freshness is tied to the graph build commit plus the working-tree diff, so unrelated changes do not have to block a focused task by default.

```bash
madar pack "how does auth work?" --require-fresh-context
madar pack "how does auth work?" --require-fresh-graph
```

Use `--require-fresh-context` when the selected files must be fresh. Use `--require-fresh-graph` when the whole graph must match the current repo.

## When To Use `--spi`

`--spi` is still opt-in in `0.27.9`. Use it when your repo is framework-heavy TypeScript/JavaScript and you want extra framework-shaped metadata plus disk cache behavior.

It is usually worth it for NestJS, Next.js App Router, Prisma, tRPC, Hono, Fastify, and similar repos where users ask storage-oriented prompts, client/server boundary questions, or request-flow questions. The default pipeline is still fine for simpler repos, non-JS/TS workspaces, or first runs where you do not need the extra framework detail yet.

## Evidence

On one verified GoValidate backend explain task, Madar reduced:

| Metric | Without Madar | With Madar |
| --- | ---: | ---: |
| Tool calls | 28 | 7 |
| Input tokens | 2,366,946 | 498,688 |
| Wall-clock latency | 158,995 ms | 72,420 ms |
| Cost | $2.6595 | $0.9728 |

This is not a universal benchmark claim. It is one repo, one prompt, one agent runtime, and one verified install path.

The public evidence map tracks what is proven, what is mixed, and what should not be claimed yet: [claims and evidence](https://github.com/mohanagy/madar/blob/main/docs/claims-and-evidence.md).

Published benchmark cells run in isolation mode. Your local numbers may differ if your Claude Code config differs.

Current evidence also includes a public benchmark suite with per-repo spread, initial fixture-proxy implement/review/impact rows, and workflow-outcome receipts. There is still no single-number cross-repo headline. Mixed evidence and counterexamples are tracked openly, including [docs/benchmarks/2026-05-25-founder-command-center-auth-flow/](https://github.com/mohanagy/madar/tree/main/docs/benchmarks/2026-05-25-founder-command-center-auth-flow/).

## Privacy

Madar runs locally. Generating a graph does not require an API key or a cloud service. Your code does not leave your machine through Madar graph generation.

Your coding agent may still send prompts or selected file context to its own model provider, depending on how that agent is configured.

Treat every local MCP install, hook, or agent profile as part of your local trust boundary. The threat model is documented here: [MCP threat model](https://github.com/mohanagy/madar/blob/main/docs/security/mcp-threat-model.md).

## Trust + Limitations

Everything stays local by default. No cloud upload, no API key required. Your code never crosses an HTTP boundary unless you explicitly invoke a model or remote system you configured yourself.

Treat every Madar MCP install, plugin, hook, or AGENTS profile as a local trust boundary. Only enable it for repositories and local agent runtimes you trust. Prefer `--profile strict` when you only need the lean core MCP tools. `--profile strict` keeps the lean core MCP tools but still uses one bounded `context_pack` call per task before broader exploration.

Limitations to know:

1. Cold-start sessions add a one-time MCP/tool-schema cost. Core profile is about ~3,200 bytes / ~800 tokens, down about 25% from the original surface.
2. Deep extraction is still best on JS/TS. Python has conservative cross-file import/call resolution, FastAPI router composition, and first-pass Django URL-conf route-to-view mapping. Python and Go are still not near JS/TS parity.
3. Static analysis cannot resolve every dynamic runtime behavior.
4. Token reduction depends on project and task.
5. Some workflows still need full file reads, tests, and review.

## Telemetry

Telemetry is disabled unless you explicitly enable it.

```bash
madar telemetry status
madar telemetry enable
madar telemetry disable
madar telemetry clear
madar telemetry report

MADAR_ENABLE_TELEMETRY=1 madar generate .
```

It does not record prompt text, answer text, source paths, source content, or repository names. Full controls: [docs/telemetry.md](https://github.com/mohanagy/madar/blob/main/docs/telemetry.md).

## What's New

Current version: `0.27.9`.

This release includes the stable next-track adoption bundle: the one-command `madar try` flow, opt-in telemetry, verified agent quickstarts, public benchmark-suite work, freshness improvements, and Windows Claude workflow fixes.

Read the full notes in the [0.27.9 changelog](https://github.com/mohanagy/madar/blob/main/CHANGELOG.md#0279---2026-06-04).

Recent highlights:

- `0.27.9` makes the whole next-track rollout stable: the public benchmark suite and language fixtures, one-command `madar try` proof flow, opt-in telemetry funnel, verified agent quickstarts, design-partner loop, and the proof-first launch/distribution checklist now ship on `main`.
- The larger **What's new in 0.23.0** additions remain central: `madar summary`, the core MCP `graph_summary` tool, runtime `execution_slice` output, share-safe `report.share-safe.json` compare artifacts, and `compare --baseline-mode pack_only`.
- Public proof workflows are organized under [docs/proof-workflows.md](https://github.com/mohanagy/madar/blob/main/docs/proof-workflows.md), [docs/claims-and-evidence.md](https://github.com/mohanagy/madar/blob/main/docs/claims-and-evidence.md), [docs/benchmarks/suite/](https://github.com/mohanagy/madar/tree/main/docs/benchmarks/suite/), and [docs/launch-checklist.md](https://github.com/mohanagy/madar/blob/main/docs/launch-checklist.md).

## Docs

| Need | Link |
| --- | --- |
| First run | [Getting started](https://github.com/mohanagy/madar/blob/main/docs/tutorials/getting-started.md) |
| Small demo repo | [Sample workspace](https://github.com/mohanagy/madar/blob/main/docs/tutorials/sample-workspace.md) |
| Agent setup | [Agent quickstarts](https://github.com/mohanagy/madar/blob/main/docs/tutorials/agent-quickstarts.md) |
| CLI and MCP tools | [CLI and MCP reference](https://github.com/mohanagy/madar/blob/main/docs/reference/cli-and-mcp.md) |
| Install matrix | [Compatibility guide](https://github.com/mohanagy/madar/blob/main/docs/integrations/compatibility.md) |
| Context-pack model | [Context packs](https://github.com/mohanagy/madar/blob/main/docs/concepts/context-packs.md) |
| Claims and limits | [Claims and evidence](https://github.com/mohanagy/madar/blob/main/docs/claims-and-evidence.md) |
| Proof workflows | [Proof workflows](https://github.com/mohanagy/madar/blob/main/docs/proof-workflows.md) |
| Design partner program | [Design partners](https://github.com/mohanagy/madar/blob/main/docs/design-partners.md) |
| Team and enterprise offer | [Team and enterprise offer](https://github.com/mohanagy/madar/blob/main/docs/team-enterprise-offer.md) |
| Benchmarks | [Benchmark suite](https://github.com/mohanagy/madar/blob/main/docs/benchmarks/suite/README.md) |
| Roadmap | [Roadmap](https://github.com/mohanagy/madar/blob/main/docs/roadmap.md) |
| Telemetry | [Telemetry guide](https://github.com/mohanagy/madar/blob/main/docs/telemetry.md) |
| Changelog | [Changelog](https://github.com/mohanagy/madar/blob/main/CHANGELOG.md) |

## Contributing

The most useful contributions right now are:

- testing Madar on real TypeScript and Node.js repos
- reporting cases where the context pack misses important files
- improving Windows, WSL, and MCP setup reliability
- adding framework detection for common repo patterns
- improving docs with real setup examples

For active development, open issues or PRs against the `next` branch.

Before opening a PR, run:

```bash
npm test
npm run build
npm run release:verify
```

See the full contributor graph on [GitHub contributors](https://github.com/mohanagy/madar/graphs/contributors).

## Contributors

Thanks to everyone shaping Madar. The list below is regenerated automatically on every push to `main`.

<!-- readme: contributors -start -->
<table>
	<tbody>
		<tr>
            <td align="center">
                <a href="https://github.com/mohanagy">
                    <img src="https://avatars.githubusercontent.com/u/11216054?v=4" width="80;" alt="mohanagy"/>
                    <br />
                    <sub><b>mohanagy</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/Gunselheli">
                    <img src="https://avatars.githubusercontent.com/u/125200242?v=4" width="80;" alt="Gunselheli"/>
                    <br />
                    <sub><b>Gunselheli</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/qorexdevs">
                    <img src="https://avatars.githubusercontent.com/u/277760369?v=4" width="80;" alt="qorexdevs"/>
                    <br />
                    <sub><b>qorexdevs</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/zhengjynicolas">
                    <img src="https://avatars.githubusercontent.com/u/32067765?v=4" width="80;" alt="zhengjynicolas"/>
                    <br />
                    <sub><b>zhengjynicolas</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/jamemackson">
                    <img src="https://avatars.githubusercontent.com/u/7982720?v=4" width="80;" alt="jamemackson"/>
                    <br />
                    <sub><b>jamemackson</b></sub>
                </a>
            </td>
		</tr>
	</tbody>
</table>
<!-- readme: contributors -end -->

Special thanks to [@jamemackson](https://github.com/jamemackson) for [#54](https://github.com/mohanagy/madar/pull/54), the first community-contributed feature in Madar.

## License

MIT. Use it, fork it, ship it.
