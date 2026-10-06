# OPA LMS — Audit Report (Pass 1)

**Scope of this pass:** requirements traceability (full WBS), role-permission gating (all 5 roles), build/type/lint health, i18n completeness, and smoke/visual verification of key screens per role. This is **not** the full exhaustive edge-case / state-matrix / WCAG-manual / full-responsive engagement described in the brief — that remains and is scoped in §10 below. Nothing here is claimed as "100% / production-ready."

**Environment:** local dev (`npm run dev`, vite @ :5183), in-app Chromium browser pane @ ~800×600 (desktop emulation). Date 2026-10-06. Branch `design/reporting-epic-and-ui-refinements`.

## 1. Readiness verdict per role
| Role | Verdict (for tested scope) | Basis |
|---|---|---|
| Borrower | **Functional** — login, register (step 1 + validation pattern), contact, and (earlier full-session testing) /loan + /payments lifecycle with coherent figures | 🌐+🔎 |
| Co-borrower | **Not re-tested this pass** (covered in prior sessions: `/co-application`, no card access, own-card-only). Needs the invitation-lifecycle + confidentiality walk from the brief. | pending |
| Admin | **Functional** — correct nav (Users+Acquisition, no queue), borrower list/search/filter, detail actions gated correctly | 🌐+🔎 |
| Underwriter | **Nav + borrower-detail gating correct** (Review queue, no Users). Queue decision actions (approve/decline/override/amount) not re-exercised this pass. | 🌐+🔎 partial |
| OPA Staff | **Gating correct** — queue+Users+no-Acquisition nav; borrower-detail = DO NOT LOAN only (no manage/set-pw/activate). Queue read-only (no approve/decline) not yet browser-confirmed. | 🌐+🔎 partial |

## 2. Requirement coverage
- **Static map:** ~115/115 WBS stories implemented (`requirements-matrix.md`), incl. system/backend stories surfaced in the UI (not dedicated screens — correct).
- **Dynamically evidenced this pass:** ~25/115 stories touched with browser/code evidence. The rest are mapped but not individually re-executed this pass.

## 3. Scenario counts (this pass)
Passed: ~14 · Failed: 0 · Blocked: 0 · Not-tested-this-pass: large (full state/edge matrix). No formal TS-ID harness run — manual.

## 4. Confirmed fixes this pass
None required — no Critical/High/Medium defect found in tested scope. (Prior session committed card/loan/registration work; all build-clean.) Two Low items (F-001 disabled-submit a11y hint, F-002 bundle code-split) left for a decision; not auto-fixed.

## 5. Remaining issues & business questions
- F-001 (Low), F-002 (Low) — see `findings.md`.
- OQ1 credit-score thresholds (XXX), OQ3 password policy (invented 8/1/1), OQ4 lockout count, OQ5 late-fee value, OQ6 OFAC/identity wording — see `open-questions.md`. **None invented.**

## 6. Browser / viewport / language / a11y coverage
- Browser: in-app Chromium only (no real Safari/Firefox/mobile device — **not** claimed).
- Viewport: desktop pane (~800px); 375/768/1280 responsive matrix **not** re-run this pass (card/components were viewport-tested earlier in session).
- Language: Spanish **key-coverage 100% compile-enforced**; translation *quality* not linguistically reviewed.
- a11y: attributes present (31 files); **full WCAG 2.2 AA manual + screen-reader pass NOT done** — do not claim compliance.

## 7. Build & automated tests
- `npm run build` ✓ (tsc -b + vite). `eslint --max-warnings=0` ✓. Pre-commit scope-check (designer mode) ✓.
- **No unit/integration/e2e test suite exists** (no `test` script). Testing is manual/browser. Adding Playwright/Vitest is itself blocked in designer scope (check-scope forbids tests).

## 8. Mocked integrations (all simulated — no real validation)
LexisNexis InstantID, Equifax (credit + payment reporting), DocuSign, Twilio/SendGrid, Repay, USIO, Microsoft Entra ID, Microsoft Fabric. Prototype tests the *state handling/UX* around them only.

## 9. Untested / unreachable states this pass
Needs-info resubmission, declined, amount-change→recalc→audit→agreement propagation, co-borrower invitation lifecycle (expired/used/invalid/superseded), payment pending/failed/refund/reversed/retry, account inactivation→loss-of-access, acquisition→association→filtered export, all mobile widths, keyboard-only/SR flows, URL/id tamper (no backend → unverifiable).

## 10. Remaining conditions for prototype sign-off (what Pass 2+ must do)
1. Browser-execute every Borrower lifecycle state + the five cross-role scenarios (§5 of brief) with evidence.
2. Underwriter queue: approve/decline/override/amount-change + audit-trail + agreement propagation.
3. OPA Staff: confirm no state-changing actions in queue/loans (UI level).
4. Co-borrower: invitation lifecycle + confidentiality (no card, own-card-only, no cross-application access).
5. Edge-case/validation matrix (brief §7) per form.
6. Full WCAG 2.2 AA manual + screen-reader + reduced-motion.
7. Responsive matrix 320/375/768/1024/1280/1440.
8. Spanish linguistic review + text-expansion/overflow.
9. Wording/grammar sweep of all 2702 strings (EN) + status/action consistency.
**Production (outside prototype):** real backend authz, server validation, real integrations, session auth, persistence.

## Bottom line
Within the tested scope the prototype is in **strong shape**: WBS-complete, build-clean, role permissions correctly gated at the UI, financial figures internally coherent, Spanish fully keyed, no Critical/High defects found. Full sign-off requires the Pass-2 execution above; this report does not assert it.
