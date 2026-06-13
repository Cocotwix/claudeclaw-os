# LandOS Active Plans

Sprint tracking. No property-specific data.

---

## Active: LandOS Foundation Sprint v1

**Status:** In progress (2026-06-13)

**Goal:** Establish LandOS memory, skill, and department-agent foundation on top of the existing dashboard/agent architecture.

**Scope:**
- LandOS memory loop docs (Current State, Build Rules, Project Memory, Active Plans, sessions/)
- LandOS skill registry doc
- Core department agent shells: Strategy, Marketing, Dispositions, Transaction Coordination, Finance, Security, AI Watcher
- Claude Code slash commands: landos-start, landos-done, landos-status
- Agent department index doc
- Build and test verification

**Outcomes:**
1. LandOS memory loop v1 exists
2. LandOS skill registry v1 exists
3. Core department agent shells exist
4. Agents are lightweight dashboard-first coordinators
5. Future sessions can start from repo-tracked LandOS current-state docs
6. No property-specific work product in repo
7. No secrets touched

**Files expected to change:**
- `docs/landos/` -- 6 new docs + sessions/ folder
- `.claude/commands/` -- 3 new slash commands
- `landos-agents/` -- 7 new department shell folders

---

## Next: Duke Runtime-Mode Refactor

**Status:** Planned, not started

**Problem:** Duke's CLAUDE.md is ~1,000 lines. Every session loads the full file regardless of mode. This is the root cause of the timeout failures on address-only smoke tests.

**Goal:** Refactor Duke to a lightweight runtime-mode architecture.

**Planned scope:**
- Slim down Duke's CLAUDE.md to identity, voice, boundaries, and mode-selection logic only
- Extract report modes into separate skill files: fast-default, full-report, area-only, unconfirmed-parcel
- Duke selects the correct skill at runtime based on input type
- Runtime mode selection happens in the first 1-2 tool calls, not by scanning 1,000 lines
- Confirm 2-minute SLA on address-only smoke test after refactor

**Prerequisite:** Foundation Sprint v1 merged and server restarted.

---

## Next: Agent View Read-Only Inspection Workflow

**Status:** Planned, not started

**Goal:** Add a dashboard workflow that lets Tyler inspect any agent's current loaded state, skill registry, and recent run history without needing to ask a build session.

**Scope TBD.** Tyler opens this block when ready.

---

## Future: Optional Kimi Coding Lane

**Status:** Idea only, not scoped

A sandboxed non-secret coding lane using Kimi. Not a runtime dependency. Not a current blocker. Will be evaluated later as an optional enhancement for non-secret coding tasks.

---

## Future: Sandboxed Code Execution

**Status:** Idea only, not scoped

Sandboxed execution environment for generated code or scripts. Not in scope for any current sprint.
