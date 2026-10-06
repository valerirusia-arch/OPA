# OPA LMS — Role × Action Permissions Matrix

Derived from the WBS **role columns + descriptions** (not from the implementation). ✓ = allowed, — = not assigned, (ro) = read-only. "OPA Staff is NOT automatically read-only" — each action checked against its own story.

> ⚠️ Prototype caveat: this is a **design prototype with no backend**. "Permission" here means *what the UI renders / allows per role* (driven by `shared/ui/viewerRole.ts`, a dev role switch). **There is no server-side authorization** — route/ownership/state-change enforcement is Dev's (controllers/store/app), out of Design-Mode scope. URL/identifier tampering protection and real session auth are therefore **not verifiable in this prototype** and are listed as production gaps.

## Users management (Epic 2)
| Action | Admin | Underwriter | OPA Staff |
|---|---|---|---|
| Users page (internal users) | ✓ full | **— no access** | ✓ (ro) |
| Create/edit/delete internal user | ✓ | — | — |
| Activate/inactivate (any user incl. borrowers) | ✓ | — | — |
| Send/resend set-password link | ✓ any user | ✓ borrower/co-b | — |
| Borrower list / details / search / filter | ✓ | ✓ | ✓ |
| Manage borrower account (edit personal data) | ✓ | ✓ | — |
| Add to DO NOT LOAN | ✓ | ✓ | ✓ |

## Loan Decisioning (Epic 4)
| Action | Admin | Underwriter | OPA Staff |
|---|---|---|---|
| Underwriting queue (manual review) | — (no queue access per WBS) | ✓ | ✓ |
| View application details | — | ✓ | ✓ |
| Request additional information | — | ✓ | — |
| Approve / Decline | — | ✓ | — |
| Override automated decision | — | ✓ (authorized) | — |
| Update requested amount | — | ✓ | — |

## Manage Loan (Epic 5)
| Action | Admin | Underwriter | OPA Staff |
|---|---|---|---|
| View loan details (internal) | ✓ | ✓ | ✓ |
| Update loan details (add docs/comments) | ✓ | ✓ | — |

## Reporting (Epic 8)
| Export | Admin | Underwriter | OPA Staff |
|---|---|---|---|
| Credit report | ✓ | ✓ | ✓ |
| Metro II consumer credit | ✓ | ✓ | ✓ |
| Application data | ✓ | **—** (not on story) | ✓ |

## Acquisition (Epic 10)
| Action | Admin | Underwriter | OPA Staff |
|---|---|---|---|
| Manage Sources/Partners/Campaigns | ✓ | — | — |
| View acquisition info on loans | ✓ | ✓ | — |
| Search loans by acquisition | ✓ | ✓ | — |
| Analyze performance | ✓ | ✓ | — |

## Borrower vs Co-borrower (per-application relationship, not account type)
| Capability | Borrower | Co-borrower |
|---|---|---|
| Start application / pick USCIS form + type (loan size) | ✓ | — |
| Invite / replace co-borrower | ✓ | — |
| Withdraw application | ✓ | — (WBS names Borrower only) |
| Cancel loan before card used | ✓ | — (co-b can't see card) |
| View / access virtual payment card | ✓ | **— no access** |
| Income upload | ✓ (required) | ✓ (required) |
| Sign consents + loan agreement | ✓ | ✓ |
| View own repayment card only | ✓ | ✓ (own only) |
| Make payments | ✓ | ✓ |
| View application/loan/schedule/balance/history | ✓ | ✓ (assigned application only) |

## Verification tasks (to confirm by testing — see findings.md)
- [ ] Underwriter area is NOT reachable as Admin (queue) — WBS gives Admin no queue access.
- [ ] OPA Staff cannot approve/decline/request-info/override/change-amount (state-change actions hidden AND not reachable).
- [ ] Co-borrower sees `/co-application` only, not `/application`; no virtual card; own repayment card only.
- [ ] Underwriter has no Users page access.
- [ ] "Application data" export not offered to Underwriter.
