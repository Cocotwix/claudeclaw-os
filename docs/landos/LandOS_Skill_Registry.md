# LandOS Skill Registry

Reference doc for all LandOS skills available to agents. No secrets, no deal data.

Skills are modular instruction blocks agents load at runtime for a specific task.
Agents must not embed full skill logic in their CLAUDE.md; skills are loaded per task.

---

## Registry Format

| Skill ID | Trigger / When to Load | Owner Agent | Status |
|---|---|---|---|
| `duke-fast-default` | Address or APN provided, no comp request | Duke | Active |
| `duke-area-only` | City/county/region query, no parcel identity | Duke | Active |
| `duke-full-report` | Tyler explicitly requests Full Report with comp credit | Duke | Active |
| `duke-unconfirmed-parcel` | Multiple LP matches returned, waiting on parcel selection | Duke | Active |
| `ace-call-prep` | Tyler asks for call prep on a specific deal or seller | Ace | Active |
| `ace-call-analysis` | Tyler shares a transcript, call notes, or text thread | Ace | Active |
| `ace-follow-up-draft` | Tyler asks for a follow-up text, email, or voicemail | Ace | Active |
| `ace-offer-call` | Tyler preparing to make an offer on a call | Ace | Active |
| `ace-renegotiation` | Deal hit a problem requiring seller re-engagement | Ace | Active |
| `ace-training-ingest` | Tyler asks Ace to process a file from LandOS_Raw_Training | Ace | Active |
| `finn-deal-economics` | Deal needs cost tracking, risk scoring, or economics review | Finn | Shell — not yet built |
| `drew-buyer-research` | Deal needs buyer research, exit prep, or listing strategy | Drew | Shell — not yet built |
| `mia-campaign-review` | Campaign or lead-source performance review needed | Mia | Shell — not yet built |
| `rex-market-intel` | Market absorption, DOM, price-per-acre, county friendliness query | Rex | Shell — not yet built |
| `rex-industry-intel` | Public operator strategy intelligence review | Rex | Shell — not yet built |
| `rex-ai-evolution` | Model/tool/repo monitoring task for AI change log | AI Watcher | Shell — not yet built |
| `security-repo-review` | New package, MCP server, or repo needs security checklist | Security | Shell — not yet built |
| `tc-closing-task-list` | Deal entered contract phase needing closing logistics | TC | Shell — not yet built |
| `strategy-exit-review` | Deal needing exit strategy selection or offer strategy review | Strategy | Shell — not yet built |

---

## Rules

- Skills for "Shell — not yet built" agents are documented here as placeholders. Do not attempt to invoke them until the agent CLAUDE.md is built.
- When building a new skill, add its entry to this registry before using it.
- Skills replace large CLAUDE.md prompt blocks. If a CLAUDE.md section is only used for one workflow, extract it as a skill.
- Skill IDs use kebab-case. Prefix with the owning agent's short name.

---

## Duke Skills (Active)

Skill files live at: `landos-agents/duke-due-diligence/skills/`
Duke reads these at runtime using the Read tool before calling any external tool.

### `duke-fast-default`

Load when: address or APN is provided, no Full Report or comp request.

File: `skills/duke-fast-default.md`

Steps: identify search path → lp_resolve_property (address) or lp_property_data (APN/propertyid+fips) → extract parcel data → score (6-factor rubric) → EV estimate (Partial Report formula) → anomaly flags → Fast Default Report format in chat. Target under 2 minutes. 0 comp credits. Includes landos-persist block.

### `duke-area-only`

Load when: city/county/region query, no specific parcel provided or verifiable.

File: `skills/duke-area-only.md`

Steps: check 30-day MI cache → one combined web search if no valid cache → area-only output labeled "Area Only Local Market Context" → save MI note. No LP calls. No parcel verification. No scoring or valuation.

### `duke-full-report`

Load when: Tyler explicitly approves spending one LandPortal comp credit. Fast Default must have run first.

File: `skills/duke-full-report.md`

Steps: confirm comp credit in same exchange → lp_comp_report_create → lp_comp_report_get → clean comps → Full Report EV formula (50/30/20) → Exit Strategy Matrix → full 14-section report → Obsidian save → PDF generation. MUST have explicit Tyler approval before calling lp_comp_report_create. Never auto-trigger.

### `duke-unconfirmed-parcel`

Load when: lp_resolve_property returns multiple_candidates, not_verified, or ambiguous_fips.

File: `skills/duke-unconfirmed-parcel.md`

Steps: show candidates → run bounded exact-disambiguation pass → compact first-answer format → include Local Area Context if location anchor exists → ask Tyler one confirmation question. Max 2 external calls. No scoring, no valuation, no offer guidance until parcel confirmed. After Tyler confirms: switch to duke-fast-default.md.

---

## Ace Skills (Active)

See Ace CLAUDE.md sections 11–18 for full workflow definitions. Skill IDs above map to those sections.

---

## Future Skills

Skills for planned agents will be defined when those agent CLAUDE.md files are built.
Register the skill ID here first, then write the CLAUDE.md workflow block.
