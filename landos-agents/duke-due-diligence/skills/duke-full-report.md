# Duke Skill: Full Report (Comp Credit Upgrade)

Load when: Tyler has explicitly confirmed using 1 LandPortal comp credit in the same exchange.

This skill extends the Fast Default workflow. `duke-fast-default.md` must have run first (parcel verified, land score calculated, preliminary offer guidance delivered). This skill adds comp-supported valuation and the extended report output.

---

## Step 1: Confirm Comp Credit

Before calling any LP comp endpoint:

> "This will use 1 LandPortal comp report credit. Confirm?"

Do not call `lp_comp_report_create` until Tyler confirms in the same exchange.

If Tyler's current message already includes an explicit confirmation (e.g. "yes use the credit", "run the comp report", "confirmed"), proceed. A confirmation from a prior exchange does not carry over -- it must be in this exchange.

---

## Step 2: Pull Comp Report

Call `lp_comp_report_create`, then `lp_comp_report_get`.

If only aggregate valuation fields are returned and no individual comp rows are available, state:

> "Individual comp rows were not available from the current API response. Valuation is based on LandPortal aggregate fields, with reduced comp transparency."

If LP credits are exhausted:

> "LP credits exhausted. Approve Zillow/Redfin fallback?"

Never auto-switch to Zillow, Redfin, or any fallback source. Never call paid fallback without Tyler's explicit approval. If Tyler approves fallback comps: label fallback comps separately from LandPortal comps in every output section.

---

## Step 3: Clean Comps (if individual comp rows available)

- Keep comps within 0.5x to 2x of subject size.
- Remove landlocked comps when identifiable.
- Apply IQR outlier removal on $/acre.
- Prefer land-only comps.
- Flag improved comps if present.

If individual comp rows are not available: state that clean-comp filtering could not be fully performed from the available API response.

**Comp age from Report Date (today's date):**
- 0-18 months: Preferred
- 18-24 months: Acceptable, confidence-adjusted
- 24-36 months: Thin-market context only unless otherwise supported
- Older than 36 months: Generally unusable, background context only

If only sale year is available: calculate age as an approximate range, not a specific month.

**Comp quality tier after cleaning:**

| Tier | Criteria | Action |
|---|---|---|
| Strong | 4+ sold comps, within 18 months, spread < 2x | Normal confidence |
| Workable | 2-3 comps, or 4+ with outliers removed | Flag limitation, adjusted confidence |
| Weak | Fewer than 2 sold, stale, or spread too wide | Range only, no point-value estimate |
| Unusable | No valid comps after cleaning | No valuation estimate. State comp data unavailable. |

Proxy-price comps (non-disclosure state or sold price hidden): may qualify at most as Workable, even when sale timing and acreage match well. Label each: "Pending/List Price Proxy, Not Confirmed Sold Price."

Never inflate comp quality tier to move the report forward.

---

## Step 4: Recalculate EV (Full Report Formula)

Full Report EV formula:
- 50% clean comp $/acre median x subject acres
- 30% LP platform estimate (total_our_estimation_values_base)
- 20% county/ZIP average (price_acre_county)

If an input is missing: use available inputs only, re-weight proportionally among remaining inputs, flag reduced confidence, explain which inputs were missing.

EV range: EV-low = EV x 0.95 / EV-high = EV x 1.05

Remove the PRELIMINARY label from valuation if comp support is Strong or Workable. Retain PRELIMINARY if Weak or Unusable.

---

## Step 5: Update Offer Strategy and Exit Strategy Matrix

Recalculate offer strategy with comp-supported valuation figures. Update anomaly flags if comp data surfaces new issues.

**Full offer strategy formulas:**

- FLIP: 40-60% of EV
- FLIP FAST MARKET: 45-55% of EV (5+ comps, DOM < 150 days)
- FLIP CAUTIOUS: 30-50% of EV (verdict = PURSUE WITH CAUTION)
- SUBDIVIDE: 55-65% of EV (size >= 5 acres, buildable >= 50%, wetlands < 30%, FEMA < 30%, not landlocked, verdict = PURSUE)
- DOUBLE CLOSE (IF SELLER RESISTS): EV-low minus $10,000 minimum profit
- LAND-HOME PACKAGE: projected land-home resale minus manufactured home cost, utility tie-ins, permits/site work, holding/closing/selling costs, minimum $10k profit. Qualifying: nearby manufactured/mobile home resale comps in $200k-$300k+ range confirmed.
- IMPROVED PROPERTY / MOBILE-HOME VALUE-ADD: as-is or repaired resale value minus repair/cleanup costs, holding/closing/selling costs, minimum $10k profit.
- TEARDOWN / LAND-ONLY RESALE: land-only resale value post-demolition minus estimated demo and cleanup ($10k-$20k planning estimate), holding/closing/selling costs, minimum $10k profit. Label: "Planning estimate -- needs local contractor verification."

Show dollar amounts in the report. Tyler decides the actual offer.

**Exit Strategy Matrix -- required in every Full Report:**

| Strategy | Viability | Reason | Main Blockers | Required Verification | Offer Range | Best-Use Fit |
|---|---|---|---|---|---|---|

Rows to include: Quick flip / as-is resale, Subdivide, Land-home package, Improved-property rehab / mobile-home value-add (when structure present), Teardown / land-only resale (when structure present), Pass / hold.

Viability: Strong / Possible / Weak / Not viable / Needs verification.

Offer range in the matrix: use confirmed formula for that strategy. If inputs are missing: "Formula inputs missing -- unavailable."

**Most Viable Strategy section (required immediately after matrix):**
1. Name the single most viable strategy.
2. Explain why it leads.
3. Name key conditions that must be verified before committing.
4. Note any close second strategy if applicable.

---

## Step 6: Full Report Output Format

Generate in this order:

1. Updated Land Score, verdict (PURSUE / PURSUE WITH CAUTION / PASS)
2. Parcel overview and valuation support
3. Comp source summary (tier, source, count, age range, quality notes)
4. Red flags and anomaly flags
5. Green flags
6. Data gaps
7. Acreage band
8. Exit Strategy Matrix (required)
9. STRATEGY-SPECIFIC OFFER RANGES (standalone titled section -- required, separate from Exit Strategy Matrix)
10. Most Viable Strategy (required)
11. Offer guidance (remove PRELIMINARY if comp support is Strong or Workable)
12. County call checklist (property-specific, not generic -- based on what was missing, flagged, or uncertain for this specific parcel)
13. Discovery call prep / DD handoff for Ace
14. Credit usage summary (1 comp credit used)

**Traceable Max Bid Math Block (include when presenting max bid or offer range):**

```
VALUATION BASIS
  Comp source:         [LP similars / LP comp report / Tyler-provided / Public sources]
  Comp quality tier:   [Strong / Workable / Weak / Unusable]
  Comp $/acre median:  $X  [LP] / [VERIFIED] / [ASSUMED]
  Subject acres:       X   [LP] / [VERIFIED]
  Estimated retail:    $X  = $/acre x acres

MAX BID ESTIMATE
  Target basis:             X%   [ASSUMED -- Tyler's standard unless stated]
  Retail x basis:           $X
  Adjustments:
    Access discount:        -$X  [if applicable]
    Wetlands/FEMA haircut:  -$X  [if applicable]
    Weak comp haircut:      -$X  [if comp tier is Weak]
  Estimated max bid:        $X

DATA QUALITY FLAGS
  [List every SELLER or ASSUMED input used above]
  [List every UNKNOWN that would materially change the estimate if resolved]
```

Source categories: [LP] [VERIFIED] [SELLER] [ASSUMED] [UNKNOWN]

Never present a max bid without this block. Never omit source categories.

If any material input is [SELLER] or [ASSUMED]: "This estimate requires verification of [item] before a firm offer."

---

## Step 7: Save Report Files

**Obsidian markdown save:**

File path:
```
C:\Users\tbutt\Documents\Obsidian Land OS -Land Acquisitions\02_Due_Diligence\[ENTITY]\DD_[APN-or-Address]_[County]_[State]_[ENTITY_TAG]_FIRST-PASS.md
```

Folder path: create if it does not exist.

**PDF generation (background):**

```
node "C:/Users/tbutt/claudeclaw-os/landos-agents/duke-due-diligence/scripts/gen-pdf-bg.js" <markdown-path> <pdf-path>
```

PDF file path:
```
C:\Users\tbutt\Documents\Obsidian Land OS -Land Acquisitions\02_Due_Diligence\[ENTITY]\DD_Report_[APN-or-Address]_[County]_[State]_[ENTITY_TAG]_FIRST-PASS.pdf
```

Report to Tyler after starting the script: "PDF generation started in background. Expected output path: <pdf-path>"

Do not wait for PDF to complete. Do not poll for the file. Continue immediately to delivering the chat report.

**Final chat response includes:** full report text + markdown path + expected PDF path + `[Download PDF](/api/files/report?path=ENCODED_PATH)` link + updated landos-persist block.

After delivering, close with:

> "Full report complete. 1 comp credit used."

---

## landos-persist Update for Full Report

Update the landos-persist block with:
- reportStatus: "delivered"
- Remove PRELIMINARY from summary line if comp support is Strong or Workable
- Add fileRefs:
  - `{ "kind": "markdown", "pathOrRef": "<absolute Obsidian markdown path>", "note": "Duke report markdown" }`
  - The PDF path is captured automatically by the runtime from the Download PDF link; do not duplicate it
- Add comp credit fact:
  - `{ "fact": "comp_credit_used", "value": "1", "label": "Verified", "source": "lp_comp_report_create" }`
- Update facts with comp-sourced valuation data and updated comp quality tier
