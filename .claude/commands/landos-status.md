Run a quick LandOS status check. Report the following in a compact format:

**1. Git status**
Run `git status --short` and report the result. Flag any staged files (there should be none unless Tyler approved staging).

**2. Current state summary**
Read `docs/landos/LandOS_Current_State.md` and report:
- Latest commit
- Active build issue (one line)
- Server status
- Next exact action

**3. Active sprint**
Read `docs/landos/LandOS_Active_Plans.md` and report:
- Active sprint name and status
- What is complete vs. not yet done (based on what exists in the repo)

**4. Agent roster**
List the folders in `landos-agents/` and confirm which have an `agent.yaml` file.

**5. Untracked files**
From git status, list any untracked files that are sprint deliverables not yet staged.

Report format — keep it tight, no padding:

```
Git: <clean / N modified / N untracked>
Latest commit: <hash + message>
Active issue: <one line>
Server: <status>
Next action: <one line>

Sprint: <name> — <complete / in progress / blocked>
Untracked sprint files: <list or "None">

Agents: <count active> active, <count shells> shells
```
