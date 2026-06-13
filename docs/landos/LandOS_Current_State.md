# LandOS Current State

Session start reference. Update via `/landos-done` at end of each session. No property-specific data here.

---

## Latest Commit

`40c0585` Fix Duke dashboard Fast Default Report conflict

Branch: main
Origin: up to date with origin/main

---

## Active Build Issue

Duke dashboard address-only smoke test has timed out four times on a real address.
Root cause: Duke's CLAUDE.md is too large and all-purpose. Runtime mode selection is missing.
Fix path: Duke runtime-mode refactor (see LandOS_Active_Plans.md). Not in scope for Foundation Sprint v1.

---

## Server Status

ClaudeClaw runs locally at `http://localhost:3141`. Server must be restarted to pick up new `/api/landos/*` routes and new agent folders. Tyler approves restarts.

---

## Known Untracked Files (not staged)

- `landos-agents/ClaudeClaw_Mark_Install_and_Update_Workflow_Fork_Upstream_Git_Pull.txt`
- `landos-agents/acquisition-copilot/.no-avatar`
- `start.bat`

---

## Current Active Agents

| Agent ID | Display Name | Status |
|---|---|---|
| main | Main Agent (LandOS) | Active |
| acquisition-copilot | Ace Acquisition Co-Pilot | Active |
| duke-due-diligence | Duke Due Diligence Agent | Active |

---

## New Shell Departments (this sprint)

| Agent ID | Display Name | Status |
|---|---|---|
| strategy | Strategy Agent | Shell created -- agent.yaml + CLAUDE.md |
| marketing | Mia Marketing & Lead Gen | Shell created -- agent.yaml + CLAUDE.md |
| dispositions | Drew Dispositions | Shell created -- agent.yaml + CLAUDE.md |
| transaction-coordination | TC Transaction Coordination | Shell created -- agent.yaml + CLAUDE.md |
| finance | Finn Finance & Risk | Shell created -- agent.yaml + CLAUDE.md |
| security | Security Agent | Shell created -- agent.yaml + CLAUDE.md |
| ai-watcher | AI Watcher | Shell created -- agent.yaml + CLAUDE.md |

---

## Foundation Sprint v1 Status

All sprint deliverables complete (2026-06-13). Pending Tyler approval to stage and commit.

| Deliverable | Status |
|---|---|
| Memory loop docs (Current State, Build Rules, Project Memory, Active Plans) | Done |
| sessions/ folder + README | Done |
| LandOS_Skill_Registry.md | Done |
| LandOS_Agent_Department_Index.md | Done |
| 7 department shell agent folders | Done |
| 3 Claude Code slash commands (landos-start, landos-done, landos-status) | Done |
| Build verification | Passes (npm run build clean) |

---

## Next Exact Action

1. Tyler approves git staging and commit of Foundation Sprint v1 files (exact git add command in sprint final report).
2. Restart ClaudeClaw so dashboard picks up new agent folders.
3. Open next block: Duke runtime-mode refactor (lightweight prompt, runtime-mode selector, skills loaded per mode).
