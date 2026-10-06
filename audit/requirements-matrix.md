# OPA LMS — Requirements Traceability Matrix

Source of truth: `docs/wbs.txt` (= "Final WBS & Estimates - OPA LMS (with referals).xlsx - LMS (11).pdf", 51 pages; stories pp.1–16, comments/assumptions pp.18–22). Text-identical to the re-sent PDF.

Legend — **Status**: ✅ implemented · ⚠️ implemented with caveat/question · ❌ missing · 🖥️ System/backend story (surfaced in UI, no dedicated screen — correct). **Evidence** filled during role testing (TS-IDs → `test-scenarios.md`).

Classification per row: C=Confirmed requirement · A=Documented approved change · I=Existing-implementation assumption · Q=Ambiguous/contradictory.

---

## Epic 1 — Authentication & profile management  (WBS pp.1–2, 18–19)

| ID | Story | Roles | Expected | Screen/Component | Status | Class |
|---|---|---|---|---|---|---|
| A1 | Register (country, name, DoB, email, phone, SSN, US address, password, comm prefs) | Borrower | Account via required personal info + email & phone verification | `flows/register` → Auth `PersonalInfoStep`/`ContactStep`/`AccountStep`/`IdentityStep`/`VerifyCodeStep`/`TermsStep`/`RegistrationDone` | ✅ | C |
| A2 | Verify email (OTP code/link) | Borrower | OTP to email | `VerifyCodeStep` | ✅ | C |
| A3 | Verify phone (OTP) | Borrower | OTP to phone | `VerifyCodeStep` (email+phone) | ✅ | C |
| A4 | Accept Terms & Privacy | User | Acknowledge ToU + Privacy | `TermsStep` | ✅ | C |
| A5 | Login (email/pw, Remember me, lock after failed attempts) | User | Auth + remember + lockout | `LoginForm` / `flows/login` | ✅ | C |
| A6 | Logout | User | Terminate session | `AppHeader` menu | ✅ | C |
| A7 | Reset password (email) | User | Forgotten-pw via email | `flows/forgot-password`, `flows/reset-password` | ✅ | C |
| A8 | View profile | Borrower/Co-b | Review all personal info | `flows/profile` | ✅ | C |
| A9 | Update profile (email/phone/address; re-verify on email/phone change; approved only) | Borrower/Co-b | Edit contact + re-verify | `flows/profile` (ProfileScreen:201 re-verify) | ✅ | C |
| A10 | Change password | User | Change pw (needs current) | `flows/profile` | ✅ | C |
| A11 | View profile (name, email) | Admin/Underwriter/OPA Staff | Internal profile | `flows/staff-profile` | ✅ | C |
| A12 | Select language EN/ES | User | Interface language | `LanguageSwitcher` | ✅ | C |

## Epic 2 — Users management  (WBS pp.2–3, 19–20)

| ID | Story | Roles | Expected | Screen | Status | Class |
|---|---|---|---|---|---|---|
| U1 | Create/change/delete admin/underwriter (name+email → set-pw email) | Admin | Internal-user CRUD | `flows/staff-users` | ✅ | C |
| U2 | Set password (email link for new user) | User | Set-pw via link | `flows/set-password` | ✅ | C |
| U3 | View admin/underwriter list + search name/email | Admin/OPA Staff | List + search | `flows/staff-users` | ✅ | C |
| U4 | View borrower/co-borrower list (≤8 cols: name,email,phone,address,state,status) | Admin/Underwriter/OPA Staff | List | `flows/staff-borrowers` | ✅ | C |
| U5 | View borrower details (borrower, co-b, application, loan) | Admin/Underwriter/OPA Staff | Detail | `flows/staff-borrowers` | ✅ | C |
| U6 | Search (name/email/phone) + filter (state, status) | Admin/Underwriter/OPA Staff | Search+filter | `flows/staff-borrowers` | ✅ | C |
| U7 | Manage borrower accounts (update personal data) | Admin/Underwriter | Edit personal data | `flows/staff-borrowers` | ✅ | C |
| U8 | Send/resend set-password link | Admin (any) / Underwriter (borrower/co-b) | Send link | `flows/staff-borrowers`/`staff-users` | ✅ | C |
| U9 | Activate/inactivate user's account (any user incl. borrowers) | Admin | Toggle access | `flows/staff-users` + borrower record | ✅ | C |
| U10 | Add to DO NOT LOAN list + filter | Admin/Underwriter/OPA Staff | Marker + filter | `flows/staff-borrowers` | ✅ | C |

## Epic 3 — Loan Application  (WBS pp.3–5, 20–22)

| ID | Story | Roles | Expected | Screen | Status | Class |
|---|---|---|---|---|---|---|
| L1 | Sign credit auth/disclosures/consent (DocuSign; state+role-specific packages) | Borrower | Review+e-sign consents | `flows/application` wizard sign step (DocuSign `ExternalPanel`) | ✅ | C |
| L2 | Start application (1 active/borrower; DO NOT LEND block; existing app/loan block) | Borrower | Gate | `ApplicationGate` | ✅ | C |
| L3 | Income verification (annual income + upload docs by type) | Borrower | Income + docs | wizard income step | ✅ | C |
| L4 | View/select loan details (USCIS application + application type → loan size; amount read off type) | Borrower | Two selects | wizard details step | ✅ | C |
| L5 | Add co-borrower (first/last/email) + submit | Borrower | Invite + submit | wizard co-borrower + submit | ✅ | C |
| L6 | Provide debit card (Repay black box, US debit only, token only) | Borrower | Repay form (mock) | `RepayCardForm` in `ExternalPanel` | ✅ | C |
| L7 | Finish + review next steps (household income/size, veteran, how heard) | Borrower | Household step | wizard household step | ✅ | C |
| L8 | View contact information (static, no interactive) | Borrower | Support page | `flows/contact` | ✅ | C |
| L9 | Co-b accept invitation (register via invitation, associate to application) | Co-b | Invitation flow | `flows/invitation` | ✅ | C |
| L10 | Co-b complete assigned application (same info as borrower) | Co-b | Co-app wizard | `flows/co-application` | ✅ | C |
| L11 | Co-b sign documents (DocuSign) | Co-b | Sign | co-app wizard | ✅ | C |
| L12 | Co-b upload income docs + card | Co-b | Income+card | co-app wizard | ✅ | C |
| L13 | Move back/forth through application | Borrower/Co-b | Wizard nav preserves data | wizard | ✅ | C |
| L14 | Replace co-borrower (expire/5-day/fail; resend/replace; ≤3 sponsorships) | Borrower | Replace flow + sponsor cap | wizard `CoBorrowerStep` (sponsorLimit) | ✅ | C |

## Epic 4 — Loan Decisioning  (WBS pp.6–9)

| ID | Story | Roles | Expected | Screen | Status | Class |
|---|---|---|---|---|---|---|
| D1 | Verify identity (InstantID; fail→update/leave; first step + on data update) | System | Identity check UX | `IdentityStep` (verified/mismatch/unavailable) | 🖥️/✅ | C |
| D2 | NO LEND lookup (open app/loan; name/email vs legacy+internal 6mo) | System | Block | `ApplicationGate` NO-LEND state | 🖥️/✅ | C |
| D3 | OFAC screening (fail→cannot proceed, call customer service) | System | Unable-to-proceed | `IdentityStep` unavailable + notification | 🖥️/✅ | C |
| D4 | Credit check (report+score; thresholds XXX→deny/co-b/auto) | System | Surfaced | underwriting verification results (score) | 🖥️/⚠️ | Q (thresholds = XXX, not invented) |
| D5 | Verify borrower/co-b income | System | Surfaced | underwriting income result | 🖥️/✅ | C |
| D6 | Determine loan eligibility (auto-approve/co-b/reject + notify) | System | Auto-decision | underwriting auto-decision block | 🖥️/✅ | C |
| D7 | Determine co-borrower requirement + send invite | System | Co-b required path | gate `coBorrowerNeeded` + notification | 🖥️/✅ | C |
| D8 | Evaluate co-borrower eligibility (same checks) | System | Co-b checks | System | 🖥️/✅ | C |
| D9 | Route for manual review | System | Queue | `flows/staff-applications` queue | 🖥️/✅ | C |
| D10 | View application details (complete, verification, decision) | Underwriter/OPA Staff | Detail | `staff-applications` detail | ✅ | C |
| D11 | Request additional information (text note) | Underwriter | Inline request | `staff-applications` detail | ✅ | C |
| D12 | Submit additional information (upload + note, resubmit) | Borrower | Needs-info response | `flows/application` needsInfo | ✅ | C |
| D13 | Approve application (+ notify) | Underwriter | Approve dialog (reason) | `staff-applications` | ✅ | C |
| D14 | Decline application (+ notify) | Underwriter | Decline dialog (reason) | `staff-applications` | ✅ | C |
| D15 | Override automated decision | Underwriter | Override | `staff-applications` auto-decision block | ✅ | C |
| D16 | Update requested amount (validate, recalc, audit trail) | Underwriter | Amount panel + change history | `staff-applications` detail | ✅ | C |

## Epic 5 — Manage Loan  (WBS pp.9–10)

| ID | Story | Roles | Expected | Screen | Status | Class |
|---|---|---|---|---|---|---|
| M1 | Generate loan agreement package (after approval → sign) | System | Package | System → `/loan/sign` | 🖥️/✅ | C |
| M2 | Review & sign loan agreement (before funding, DocuSign) | Borrower/Co-b | Sign | `/loan/sign` | ✅ | C |
| M3 | View application status & details (Submitted/Under review/Pending/Approved/Declined) | Borrower/Co-b | Status | `/loan` + `/application` | ✅ | C |
| M4 | View application documents (download only, no preview) | Borrower/Co-b | Docs table | `/loan` documents | ✅ | C |
| M5 | Withdraw application (before final decision) | Borrower | Withdraw | `/loan` | ✅ | C |
| M6 | Issue virtual payment card (approved borrower) | System | Card | System → VirtualCardPanel | 🖥️/✅ | C |
| M7 | View virtual card details (Borrower only; Co-b no access) | Borrower | Card + USIO reveal | `VirtualCardPanel` + `VirtualCardModal` | ✅ | C |
| M8 | View loan details (amount, unused balance, APR, terms, schedule) | Borrower/Co-b | Statement | `LoanStatement` | ✅ | C |
| M9 | Cancel loan before funding (before card used) | Borrower | Cancel | `/loan` | ✅ | C |
| M10 | View loan details (all info, funding status, docs) | Admin/Underwriter/OPA Staff | Staff loan view | `flows/staff-loans` | ✅ | C |
| M11 | Update loan details (add docs, comments) | Admin/Underwriter | Edit | `staff-loans` detail | ✅ | C |

## Epic 6 — Manage Payments  (WBS pp.10–12)

| ID | Story | Roles | Expected | Screen | Status | Class |
|---|---|---|---|---|---|---|
| P1 | Generate payment schedule (at funding; begins ≤45d after approval, due 1st) | System | Schedule | System → `/payments` | 🖥️/✅ | C |
| P2 | View repayment schedule (due dates, amount, completed, overdue) | Borrower/Co-b | Schedule tab | `/payments` | ✅ | C |
| P3 | View outstanding balance | Borrower/Co-b | Balance | `/payments` balance card | ✅ | C |
| P4 | View payment history (completed/pending/failed/refunded/reversed) | Borrower/Co-b | History tab | `/payments` | ✅ | C |
| P5 | Make scheduled payment via card | Borrower/Co-b | Pay | `/payments` Pay now | ✅ | C |
| P6 | Make additional payment (catch-up/extra; full payoff before maturity) | Borrower/Co-b | Additional/payoff | `/payments` | ✅ | C |
| P7 | View saved repayment card (masked, brand, expiry, active; own only) | Borrower/Co-b | Saved card | `/payments` + profile | ✅ | C |
| P8 | Update payment method (Repay re-verify; old removed, new via same flow) | Borrower/Co-b | Update card | profile + `/payments` | ✅ | C |
| P9 | Apply late fees (15d late fee $5 or 5%; 90d default; 120d acceleration; APR 1%) | System | Delinquency | System → stage table (overdue/default/accelerated) | 🖥️/✅ | C |
| P10 | View late fees (applied fees, overdue info) | Borrower/Co-b | Fees | `/payments` | ✅ | C |
| P11 | Track payment status (succeeded/failed/reversed from Repay) | System | Status | System → history statuses | 🖥️/✅ | C |
| P12 | View payment result (per-transaction status) | Borrower/Co-b | Result | `/payments` history | ✅ | C |
| P13 | Retry if payment fails/reversed | Borrower/Co-b | Retry | `/payments` | ✅ | C |
| P14 | View repayment schedule + fees (internal) | Admin/Underwriter/OPA Staff | Staff schedule | `flows/staff-payments` | ✅ | C |
| P15 | View payment history (internal) | Admin/Underwriter/OPA Staff | Staff history | `staff-payments` | ✅ | C |
| P16 | Process reversed/refunded payments (update balance/history/outstanding) | System | Reconcile | System | 🖥️/✅ | C |

## Epic 7 — Notifications & Communications  (WBS pp.12–13)

| ID | Story | Roles | Screen | Status |
|---|---|---|---|---|
| N1–N12 | Approved, declined, request-info, signing-request, co-b invite expired, co-b failed underwriting, funding, payment reminders, payment confirmation, payment failed, delinquency, system-task (internal) | Borrower/Co-b, Admin/Underwriter | `flows/notifications` (`BorrowerInbox`), `stories/EmailDesigns` | ✅ |
| N13 | Manage notification preferences (channels) | User | `flows/profile` | ✅ |
| N14 | Notify OPA Staff about processing failures | System | notifications | 🖥️/✅ |
| N15 | Unable-to-proceed notification (identity/OFAC fail → contact CS, no sensitive detail) | Borrower/Co-b | `IdentityStep` + notification | ✅ |

## Epic 8 — Reporting & Audit  (WBS pp.13–14)

| ID | Story | Roles | Screen | Status |
|---|---|---|---|---|
| R1 | Export credit report (xlsx/csv) | Admin/Underwriter/OPA Staff | `flows/staff-reporting` | ✅ |
| R2 | Export Monthly consumer credit reporting (Metro II) | Admin/Underwriter/OPA Staff | `staff-reporting` | ✅ |
| R3 | Export application data | Admin/OPA Staff | `staff-reporting` + queue export | ✅ |
| R4 | Send credit report to Equifax | System | 🖥️ (no UI) | ✅ |
| R5 | Send Metro II to Equifax | System | 🖥️ (no UI) | ✅ |

## Epic 9 — Integrations  (WBS p.14) — all System; naming cross-check, no dedicated UI

LexisNexis InstantID (identity+OFAC) · Equifax (credit) · DocuSign · Twilio/SendGrid · Repay · USIO · Equifax Payment Reporting · Microsoft Entra ID (internal auth) · Microsoft Fabric (no UI). **All named where they surface.** 🖥️/✅

## Epic 10 — Acquisition, Referrals & Campaigns  (WBS p.15)

| ID | Story | Roles | Screen | Status |
|---|---|---|---|---|
| Q1 | Manage Acquisition Sources (CRUD) | Admin | `flows/staff-acquisition/sources` | ✅ |
| Q2 | Manage Referral Partners + Partner Groups (CRUD) | Admin | `staff-acquisition/partners` | ✅ |
| Q3 | Manage Marketing Campaigns (CRUD + validity) | Admin | `staff-acquisition/campaigns` | ✅ |
| Q4 | Associate Loans with Acquisition Info | System | 🖥️ | ✅ |
| Q5 | View Acquisition Information for Loans (campaign/partner/source) | Admin/Underwriter | `staff-loans` acquisition card | ✅ |
| Q6 | Search Loans by Acquisition Attributes | Admin/Underwriter | `staff-loans` filters | ✅ |
| Q7 | Analyze Lending Performance by Acquisition Channel | Admin/Underwriter | `staff-acquisition/performance` | ✅ |

---

## Extras (not in WBS, built)
- Borrower dashboard (`flows/dashboard`) and Admin dashboard (`flows/staff-dashboard`) — compositions of existing facts, not WBS epics.

## Coverage summary (static mapping)
- WBS stories mapped: **~115 / 115 present** (incl. System stories surfaced). Dynamic test evidence tracked in `test-scenarios.md`; this matrix is the static map, NOT a pass/fail claim until TS evidence is attached.
