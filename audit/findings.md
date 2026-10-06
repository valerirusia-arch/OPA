# OPA LMS — Issue Register

Severity: **Critical** (access/data exposure or unusable essential lifecycle) · **High** (blocked workflow, major requirement mismatch, wrong financial/state) · **Medium** (recoverable functional/UX/responsive/a11y) · **Low** (minor copy/visual/perf).
Status: OPEN · FIXED · WONTFIX (justified) · QUESTION.
Method tag: 🌐 browser-executed · 🔎 code-verified.

## Confirmed findings
| ID | Sev | Cat | Role/Page | Expected vs Actual | Method | Status |
|---|---|---|---|---|---|---|
| F-001 | Low | UX/a11y | Borrower · /register | Submit is disabled until valid with no explicit "complete required fields" message; disabled `<button>` is not focusable/announced, so keyboard/SR users get no reason they can't proceed. Required fields are marked with `*` only. | 🌐 | OPEN (design choice — see note) |
| F-002 | Low | Perf | All · initial load | Single `index.js` ≈ 1.9 MB (gzip 580 KB), no route-level code-splitting → heavy first load. Acceptable for a prototype; a production concern. | 🔎 (build output) | OPEN (prod gap) |
| F-003 | Low | UX/copy | Borrower · /payments (default) | After paying one installment while in default, the banner still reads "This account is in default, **0 days past due**" while two installments remain Overdue. `applyPayment` sets `daysPastDue: undefined` (→ renders 0) but leaves `balance.stage` at `default`, so the banner's severity and its day-count contradict each other. Expected: either the day-count reflects the still-overdue oldest installment, or the banner steps down when the account returns to merely-overdue. | 🌐 (paid 1 of 3 overdue at "In default" stage) | OPEN |

No Critical/High defects confirmed. One Low copy/state inconsistency (F-003) found in the default→partial-payment path; financial figures themselves remained correct throughout.

## Positives verified (evidence)
| Check | Result | Method |
|---|---|---|
| WBS story coverage | ~115/115 stories present (static map, `requirements-matrix.md`); incl. system stories surfaced | 🔎 |
| Build / typecheck | `npm run build` (tsc -b + vite) ✓ clean; all card/gate SVG imports resolve | 🔎 |
| Lint | eslint `--max-warnings=0` ✓ on all changed files; pre-commit scope-check (designer mode) ✓ | 🔎 |
| Nav role-gating | Admin: Users+Acquisition, **no Review queue**; Underwriter: **Review queue(7)**, no Users, Acquisition; OPA Staff: Review queue+Users, **no Acquisition** — all match WBS role columns | 🌐 (switched all 4 roles) |
| Borrower-detail action gating | Manage account + Send set-password = Admin/Underwriter (`canEdit`); DO NOT LOAN = all three; Activate/inactivate = Admin only (`canManageAccess`) — exactly WBS | 🔎 `BorrowerDetailsScreen.tsx:122,125,362` + 🌐 |
| Role switch lands on correct home | Admin/Underwriter/OPA Staff → `/staff/borrowers`; Borrower → `/application` | 🌐 |
| SSN exposure | Masked (`·····2602`) in borrower detail; full SSN not rendered | 🌐 |
| Contact page | Static, information-only (phone/email/address as plain text, no click-to-call/mailto) — WBS "no interactive elements" | 🌐 |
| Login | Audience toggle (Borrower/Co-b vs OPA staff), Remember-me unchecked default, Forgot/Create links, show-hide password | 🌐 |
| Financial coherence | All amounts derive from one `BASE_AMOUNT`×scale (`loanRecord.ts`), so applied-for / instalment / outstanding / payoff / unused cannot contradict; payments reduce outstanding+payoff without waiving fees (WBS) | 🔎 |
| Spanish coverage | `es: Record<TranslationKey, string>` → every EN key (2702) has an ES value, **compile-enforced**; tsc passes ⇒ no missing translations | 🔎 |
| a11y baseline | aria/role/alt used across 31 UI files; full WCAG manual pass pending | 🔎 |

## Notes on F-001
The disabled-until-valid pattern is a deliberate, common UX choice and not a clear defect; flagged for the designer's call. If kept, an SR-discoverable "complete required fields to continue" hint (e.g. `aria-describedby` on the submit) would close the a11y gap without changing the pattern.
