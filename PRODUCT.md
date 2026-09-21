# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Five people use this product and none of them sees the same thing. The roles
come from the WBS's own role column, not from a guess about seniority.

- **Borrower** — someone filing an immigration application with USCIS who
  cannot cover the filing fee up front. They start the application, pick the
  USCIS form and application type (which sets the loan size), invite a
  co-borrower, sign, and repay.
- **Co-borrower** — a person the borrower invites by email when the rules
  require one. The role is **per application, not a property of a person**:
  whoever starts an application is its borrower, whoever they invite is its
  co-borrower, and the same person can be both on different applications. A
  co-borrower may sponsor up to 3 borrowers.
- **Underwriter** — reviews applications the automated pipeline could not
  decide. Approves, declines, overrides an automated decision, requests more
  information, and may reduce the requested amount before approving.
- **Admin** — manages internal accounts, borrower records, the DO NOT LOAN
  list, and acquisition sources, partners and campaigns.
- **OPA Staff** — reads. Explicitly read-only on application and loan
  information, "cannot modify application data or perform business actions".
  The two exceptions the WBS grants them: adding a borrower to DO NOT LOAN,
  and exporting application data.

## Product Purpose

OPA lends the money for **USCIS immigration filing fees** and pays the fee
directly, rather than handing the borrower cash. An approved loan issues a
**virtual payment card** (USIO) restricted to that purpose; the borrower then
repays in monthly instalments at **1% APR**, due on the 1st, beginning within
45 days of approval.

Success is a filing that happens on time for somebody who could not otherwise
have afforded it, repaid without the borrower falling into default.

## Positioning

**Undecided.** The designer's instruction was to record it as undecided rather
than infer it. Future work must not invent a mission, a funding model, or a
market claim for OPA.

What is factual and may be relied on: the rate is 1% APR, the loan is
restricted to a USCIS filing fee by the card that carries it, and the WBS
provides for referral partners, acquisition sources and marketing campaigns.

## Operating Context

- **The scope is a signed-off WBS**, not an open brief. Every screen exists
  because a story names it. Work proceeds **one epic at a time**: Authentication
  and profile → Users management → Loan application → Loan decisioning →
  Manage loan → Manage payments → Notifications → Reporting & audit →
  Integrations → Acquisition, referrals and campaigns.
- **Interfaces are built in code, skipping the mockup stage.** The designer
  works in Design Mode of a Design-in-Code kit; review happens against the
  running app and Storybook, not against static comps.
- **Two languages throughout**, English and Spanish, from one dictionary where
  English is the source of truth.
- **Third parties own several moments of the flow, and the handover has to stay
  visible:** LexisNexis InstantID (identity, OFAC), Equifax (credit report and
  payment reporting), DocuSign (signatures), Repay (card tokenisation and
  repayment), USIO (virtual card issuance), Microsoft Entra ID (internal
  sign-in), Twilio/SendGrid (email and SMS), Microsoft Fabric (analytics).
- **Card data never reaches OPA.** Repay and USIO are "black boxes": the
  product stores a token, a brand, four digits and an expiry, and nothing else.

## Capabilities and Constraints

These are hard constraints on how the interface may be built. They are not
preferences and they outrank any design guidance, including this skill's.

- **Ant Design only.** Every UI element composes from Ant Design and
  `@ant-design/icons`. Nothing that antd provides may be hand-rolled: ESLint's
  `react/forbid-elements` fails the build on `<button>`, `<input>`, `<table>`,
  `<ul>`, `<h1>`–`<h6>`, `<p>`, `<a>`, `<img>`, `<form>` and their families.
  `<div>` and `<span>` are the only escape hatch, for layout mechanics antd has
  no component for.
- **No second styling system.** No styled-components, emotion, CSS modules,
  Tailwind, or a second component library. Component style objects live in a
  co-located `ComponentName.styles.ts` as typed `CSSProperties`, token-aware
  through `getStyles(token)`.
- **Colour comes from theme tokens.** `theme.useToken()` at the point of use;
  `src/theme/tokens.ts` is the only file in the repo permitted a raw hex, and
  ESLint errors on any other hex literal.
- **One approved exception:** hand-drawn SVG illustration components, because
  antd has no illustration primitive. Every colour in them still comes from a
  token.
- **Design Mode boundaries.** Presentation and navigable flows only:
  `src/shared/ui`, `src/features/*/ui`, `src/flows`, `src/theme`,
  `src/stories`. No data fetching, no global state, no routing logic (loaders,
  guards, redirects) — those belong to the integration role in `src/app` and
  `src/features/*/{api,controllers,store,models}`. `.workflow-mode` stays
  `designer`.
- **The build gates are the floor:** `npx tsc -b --noEmit` and
  `npx eslint src --max-warnings=0` must stay clean. (`npx tsc --noEmit` on the
  root config checks nothing — it is a solution file.)
- **Nothing gets invented.** A field, filter, column or screen that no WBS
  story names does not get added, however good an idea it is; it gets raised
  with the designer instead. Where the wireframes and the WBS disagree, the WBS
  wins and the conflict is reported.

## Brand Commitments

- **The incumbent prototype is the reference, and the application page is the
  benchmark within it.** The designer's words: it is comparatively refined, and
  the rest should follow it consistently — a **clean, smooth** design language.
  Treat the existing implementation as design authority to preserve and extend,
  never as an anti-reference.
- **Name:** OPA — One Percent for America. The mark is the company's own teal
  circle with a flame, `src/shared/ui/opa-symbol.png`, drawn by `Logo` inside
  an `<svg>` so it scales and stays inside the antd-only rule's SVG exception.
  It replaced an earlier lowercase "opa" wordmark. **The flame is a cut-out,
  not white paint** — the file holds only `#125A70` and `#0089A1` — so on a
  dark ground the mark needs something white behind it, which is what the
  virtual card's tile does. Nothing beyond the supplied artwork may be
  fabricated.
- **Palette and type, as set in `src/theme/tokens.ts`:** teal `#146580` is
  `colorPrimary`; burnt orange `#B85C23` is the primary Button and nothing
  else; Playfair Display sets h2/h3 and Montserrat everything else.
- **Voice, as already written across the product:** plain, direct, second
  person. It says what happens next and what something costs. It does not
  reassure, congratulate, or soften a refusal. Em dashes are not used in UI
  copy unless the sentence genuinely turns on one.

## Evidence on Hand

- **WBS and estimates (the scope authority):** `docs/WBS-OPA-LMS.pdf`, with a
  searchable `docs/wbs.txt` beside it — grep that rather than re-reading the
  PDF. 51 pages. Pages 1–17 are the stories; from about page 20 a **"Comments and
  assumptions" column** carries rules the story descriptions do not, plus the
  per-story UI/UX hour estimates, which are themselves evidence of how much
  screen a story was costed for.
- **Figma low-fidelity wireframes:** file `c0rwtzmXofsXDhk5px0DWR` ("OPA Test"),
  one section per epic. Sections can look empty in metadata while their frames
  sit on the page — check geometry, not parentage.
- **Built and reviewed so far:** Authentication and profile, Users management,
  Loan application (borrower and co-borrower), Loan decisioning, Manage loan,
  Manage payments, Notifications, Reporting, Borrowers, and Acquisition
  channels, referrals and campaigns. Plus the borrower dashboard, the contact
  page and the email templates (7 × 2 languages).
- **Absent, and not to be fabricated:** real borrower data, real partner or
  campaign names, testimonials, volumes, pricing beyond the 1% APR, and any
  claim about OPA's funding or legal status.

## Product Principles

1. **The scope is the WBS.** Design decides how something looks and reads;
   it does not decide what exists.
2. **Say the consequence.** A borrower 96 days behind is a month from owing the
   whole loan, and the page tells them so. Refusals, fees and deadlines are
   stated in the lender's own terms, not softened.
3. **Show only what the reader is entitled to.** Internal scoring, business
   rules and decision logic never reach the borrower; a borrower and a
   co-borrower never see each other's card details. Access follows the WBS's
   role column story by story, and a role that may not act is not shown a
   disabled control.
4. **Name the hand-over.** Where the flow leaves OPA — Repay, DocuSign, USIO —
   the border is visible and the company is named, because what happens to the
   data changes there.
5. **One vocabulary.** The same state is called the same thing on every screen
   and in both languages, and one figure is written one way.

## Accessibility & Inclusion

**Not yet established.** The WBS names no accessibility standard, so there is
nothing confirmed to record, and it is OPA's decision rather than the design
team's.

Two facts that bear on it, recorded so the decision is not made by default: the
users are people filing US immigration paperwork, many of them reading in a
second language, and the product is consumer financial services in the United
States. A recommendation of **WCAG 2.1 AA** is on the table and awaiting an
answer.

Already true regardless of the standard chosen: the interface is fully
bilingual (English and Spanish), and antd's own components carry keyboard and
screen-reader behaviour that the theme layer must not undo.
