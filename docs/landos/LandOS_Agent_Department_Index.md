# LandOS Agent Department Index

Quick reference for all departments and agents. No secrets, no deal data.

---

## Active Agents

| Agent ID | Persona | Department | Role |
|---|---|---|---|
| `main` | Main | Command Center | Coordination, triage, daily brief |
| `acquisition-copilot` | Ace | Acquisitions | Seller comms, call prep/analysis, follow-ups, training ingest |
| `duke-due-diligence` | Duke | Due Diligence + Comps | DD workflow, LandPortal, scoring, EV, anomaly flags |

---

## Shell Agents (Built — Not Yet Wired for Full Workflows)

| Agent ID | Persona | Department | Role |
|---|---|---|---|
| `strategy` | Strategy | Strategy | Exit strategy review, offer strategy, deal strategy playbook |
| `finance` | Finn | Finance & Risk | Deal economics, cost tracking, risk scoring, bookkeeping hooks |
| `dispositions` | Drew | Dispositions | Buyer research, exit prep, listing strategy |
| `marketing` | Mia | Marketing & Lead Gen | Campaign and lead-source performance, no live ad changes |
| `transaction-coordination` | TC | Transaction Coordination | Contract phase, closing logistics, deadlines, title tasks |
| `security` | Security | Security & AI Systems | Repo/package/MCP security reviews, secrets hygiene, MCP allowlists |
| `ai-watcher` | AI Watcher | Research — AI Evolution | Model/tool/repo monitoring, ai_change_log, recommend only |

---

## Department Structure

### Command Center
- **Active:** Main
- **Planned:** Lou (future coordination expansion)
- Handles coordination, approvals queue, and daily briefs.

### Acquisitions
- **Active:** Ace
- Seller psychology, call prep and analysis, follow-ups, offer-call framing. Seller-facing drafts only; Tyler sends.

### Due Diligence + Comps & Valuation
- **Active:** Duke
- **Planned:** Cal (future split if volume demands it)
- DD workflow, LandPortal, scoring, EV, anomaly flags, comp workflows.

### Strategy
- **Shell:** Strategy Agent
- Exit strategy selection, offer strategy review, strategy playbook maintenance. Coordinates with Duke, Finn, Drew.

### Finance & Risk
- **Shell:** Finance Agent (Finn)
- Deal economics review, cost tracking, risk scoring, bookkeeping hooks.

### Dispositions
- **Shell:** Dispositions Agent (Drew)
- Buyer research, exit prep, listing strategy.

### Marketing & Lead Gen
- **Shell:** Marketing Agent (Mia)
- Campaign and lead-source performance records. Never modifies live ads without approval.

### Transaction Coordination
- **Shell:** Transaction Coordination Agent (TC)
- Contract phase management, closing checklists, deadline tracking, title task coordination.

### Research
- **Planned:** Rex (covers Market Intel + Industry Intel + AI Evolution)
- AI Evolution sub-function runs as the `ai-watcher` shell agent until Rex is fully built.

### Security & AI Systems
- **Shell:** Security Agent
- Repo/package/MCP review checklists, secrets hygiene, MCP allowlists. Veto power via landos_security_review records.
- **Shell:** AI Watcher Agent
- Model/tool/repo monitoring and ai_change_log. Recommend only; routes to Security before Tyler action.

---

## Cross-Agent Handoff Protocol

When a task or finding belongs to a different department, flag it using this format:

```
HANDOFF → [Department / Agent]: [one-line description of what needs attention]
```

| If Topic Is | Route To |
|---|---|
| Seller motivation, call prep, follow-up language | Ace |
| Access, zoning, title, utilities, floodplain, DD gaps | Duke |
| Sold comps, APN verification, parcel data | Duke |
| Offer structure, deal economics, risk, cost estimates | Finn |
| Buyer pool, exit path, listing strategy | Drew |
| Contract timing, closing logistics, title tasks | TC |
| Campaign performance, lead source review | Mia |
| AI tool or model changes, new MCP servers | AI Watcher → Security |
| New package install, repo security review | Security |
| Market absorption, pricing trends, county outlook | Rex (when built) |

---

## Agent Boundaries Shared Across All Agents

- No agent auto-sends seller messages. Tyler sends.
- No agent calls lp_comp_report_create without Tyler's explicit approval.
- No agent modifies Land Ally systems, records, or GHL.
- No agent writes business data into the GitHub repo.
- No agent makes final decisions on zoning, legal, title, or valuation. Those require verification.
- Every agent applies fact labels: Verified / Seller stated / Assumed / Unknown / Needs verification.
- Every entity-tagged business record must carry LAND_ALLY or TY_LAND_BIZ.
