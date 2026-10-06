# OPA LMS — Open Questions (business rules & ambiguities)

Each: the exact question, affected flow, current prototype behavior, consequence. **Do not invent answers.**

## From the WBS itself (OPA to confirm)
| # | Question | Affected flow | Current behavior | Consequence |
|---|---|---|---|---|
| OQ1 | Credit-score thresholds are `XXX` in the WBS (below XXX → deny; between → co-b required; above → auto-approve). | Loan Decisioning (credit check → eligibility) | No numeric thresholds shown; prototype simulates the three outcomes abstractly. | Cannot validate automated decision bands. **Not invented.** |
| OQ2 | "Confirmation page with contact details ???" — the WBS flags its own uncertainty. | After submit (Finish application) | Confirmation screen exists (goes to /loan). | Low — confirm the exact content OPA wants. |
| OQ3 | No password policy anywhere in the WBS. | Register / Set password / Change password | Prototype uses an invented 8/1/1 rule. | Must be confirmed; currently invented. |
| OQ4 | "Lock account after consecutive unsuccessful attempts" — count not specified. | Login | `LoginForm` shows attempts-remaining/locked; the threshold is a placeholder. | Confirm the N and lockout duration. |
| OQ5 | Late fee "$5.00 or 5% of unpaid installment, whichever is **less**" (WBS wording). | Apply late fees | To verify the prototype uses "less", not "greater". | Financial correctness. |
| OQ6 | OFAC/identity failure wording: WBS has contradictory lines ("paused and moved to manual review" struck through by "NO, user unable to proceed, call customer service"). | Decisioning / IdentityStep | Prototype uses the final reading: unable-to-proceed, contact CS. | Confirm which reading is authoritative. |

## Prototype scope limits (production gaps, not bugs)
- No backend → no real authorization, no server validation, no real integrations (LexisNexis/Equifax/DocuSign/Repay/USIO/Twilio/Entra/Fabric all **simulated**).
- Role switching is a dev tool (`viewerRole.ts`), not real sessions → URL/identifier tamper protection unverifiable here.
- State persistence is in-memory (`useSyncExternalStore` module stores), reset on reload → persistence across sessions not implemented (by design for the prototype).

## To raise only if testing surfaces them
- (filled during audit)
