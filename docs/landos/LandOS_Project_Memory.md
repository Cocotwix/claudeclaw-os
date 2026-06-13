# LandOS Project Memory

Durable lessons, architecture decisions, and non-obvious constraints. Read at session start.

---

## Architecture Decisions

### ClaudeClaw stays as chassis

ClaudeClaw (Mark's system) is the technical chassis: local Node server, SQLite, dashboard at localhost:3141, agent loading, MCP, scheduling. LandOS is built as a modular layer inside the same application. Do not replace ClaudeClaw. Do not fork it into a separate app. One app, one dashboard, one database.

### LandOS is a department system, not a monolith

Departments are modules, not separate apps. Each department has a lightweight coordinator agent. Skills and resources are loaded per task. Agents are not giant all-purpose prompts.

### Dashboard is the primary workspace

Agents are dashboard-first. Telegram is an optional mobile channel. Missing Telegram tokens must never block dashboard use. Never require Telegram configuration for an agent to function in the dashboard.

### SQLite is the system of record

`store/landos.db` holds all structured LandOS business data. The OS Spine v1 tables are the foundation: entity, contact, seller, lead, property, parcel, deal, fact, task, file_ref, note, agent_run, approval, audit_log, rule, playbook, model_call, cost_record, security_review, research_item.

### Obsidian vault is human-readable work product

Reports, call prep, deal notes, and all business work product live in the Obsidian vault. Never in the repo.

---

## Durable Lessons

### Giant CLAUDE.md anti-pattern

Duke's CLAUDE.md grew to ~1,000 lines. Every session loads the full file regardless of which report mode or workflow is active. This caused a cascade of timeout issues because the model spends too many tokens processing instructions for workflows that are not in use.

**Rule:** Keep CLAUDE.md short. It should describe identity, voice, boundaries, and which skill or resource to load for each mode. Runtime mode selection happens at the start of a session, not by scanning a 1,000-line instruction file.

### Duke timeout lesson

Duke timed out four times on a real address smoke test. The root cause is the giant prompt, not a bug in the report workflow itself. Patching the report flow without fixing the prompt architecture is treating symptoms, not the disease.

**Rule:** The next Duke block must refactor Duke to a lightweight runtime-mode architecture. Duke loads only the instructions for the requested mode, not the entire instruction set every time.

### Memory-driven architecture

Agents need access to durable context that persists across sessions. Loading all context from a CLAUDE.md file each session is fragile and expensive.

**Rule:** Durable business facts, deal context, and learned rules belong in `landos.db`. Agents query the database for context, not the CLAUDE.md.

### Skill-loaded architecture

Agents should load relevant skills for a given task instead of embedding all skill logic in the main CLAUDE.md. Skills are modular, testable, and can be updated independently.

**Rule:** New agents start as coordinators. Skills and resources are added incrementally through the LandOS skill registry, not by making the CLAUDE.md larger.

### Hermes-style architecture adopted, not as a dependency

Ideas from Hermes-style multi-agent systems (lightweight coordinators, skill loading, memory persistence, runtime-mode selection) have been adopted as architecture principles. Hermes is not a runtime dependency. Do not import or depend on external agent frameworks.

### Kimi optional coding lane -- not a runtime dependency

Kimi is a potential future option for a sandboxed non-secret coding lane. It is not a current dependency. Do not wire Kimi into any runtime path. If it gets added later, it is an optional enhancement for non-secret coding tasks, never a blocker.

---

## OS Spine v1 Status

Built and pushed as of 2026-06-12. Includes:
- `store/landos.db` with 20 landos_* tables
- LandOS API routes at `/api/landos/*`
- Dashboard UI at `/landos`
- 35 passing tests
- Duke fast path (sub-2 minute Default Duke Report) verified and untouched

Remaining for full Duke integration: a hook that persists Duke's LP responses and fact labels into landos.db at runtime.

---

## Known Pre-Existing Test Failures

These failures existed before OS Spine v1 and are not caused by LandOS work:
- `src/skill-registry.test.ts` (9 failures) -- skill folder fixture behaviors
- `src/exfiltration-guard.test.ts` (2 failures) -- hex secret pattern expectations
- `src/dashboard.contract.test.ts` (1 failure) -- stale test, /api/chat/history behavior

Do not attempt to fix these in a LandOS build session unless Tyler explicitly opens that as a task.
