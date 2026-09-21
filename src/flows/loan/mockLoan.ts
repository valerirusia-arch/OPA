// src/flows/loan/mockLoan.ts
//
// What the borrower's Loan tab shows, in each of the states the WBS names.
// Mock data only — nothing is fetched.
//
// One record per lifecycle stage, because the screen is the same page wearing
// different states and a single happy example would leave five of them
// unreviewable.

import type { ApplicationSummary } from "../../features/Loan/ui/types";
import { loanSchedule } from "../payments/mockPayments";

// The Type column comes off the wireframe. The values are the WBS's document
// names rather than invented labels, in the snake_case the wireframe uses for
// the generated ones.
const documents = (executed = false) => [
  { id: "d1", name: "Pay stub - June.pdf", type: "income", on: "Sep 03, 2026" },
  { id: "d2", name: "Credit authorization.pdf", type: "consent", on: "Sep 05, 2026", executed: true },
  { id: "d3", name: "Electronic communications consent.pdf", type: "consent", on: "Sep 05, 2026", executed: true },
  { id: "d4", name: "Privacy notice.pdf", type: "disclosure", on: "Sep 05, 2026", executed: true },
  ...(executed
    ? [{ id: "d5", name: "Loan agreement.pdf", type: "loan_agreement", on: "Sep 12, 2026", executed: true }]
    : []),
];

// THE APR IS 1%, from the WBS's own words. It appears once, in the late-fee
// story's acceleration clause: "the full remaining loan balance including
// interest and outstanding fees must be paid within 30 days... THE APR REMAINS
// AT 1%." That is the only figure the WBS gives, so it is the figure every
// record below shows. It was 0% here once, which was invented.

/**
 * The repayment schedule, from the payments mock.
 *
 * It was six hand-written rows here against a "12 months" term, which is a
 * loan that pays off half of itself. Epic 6 builds the schedule the loan
 * actually comes to and both pages now read that one, so the loan page and
 * the payments page cannot disagree about what is owed.
 */
const schedule = loanSchedule;

/**
 * The same twelve lines with nothing paid yet.
 *
 * A funded loan whose card has not been used has a schedule and no history —
 * see the note on `mockFresh` in mockPayments. Derived rather than written
 * out, so the two pages cannot disagree about what is owed.
 */
const freshSchedule = schedule.map((row) => ({ ...row, status: "scheduled" as const }));

/**
 * The next thing owed, read off the schedule rather than typed out again.
 *
 * The wireframe's Repayment card leads on this figure and the payments page
 * derives it the same way, so the two cannot drift.
 */
const nextDue = schedule.find((row) => row.status !== "paid") ?? schedule[0];

/**
 * The package that comes back after approval, for the person who has to sign
 * it.
 *
 * WBS, Manage Loan story 1: "Documents are generated dynamically based on
 * BORROWER ROLE (Borrower/Co-borrower), state-specific disclosure
 * requirements and loan product configuration." The application's own package
 * already varies that way (see `useDocumentPackage`); this one used to be a
 * single flat list handed to whoever opened the page, which said the two
 * people sign the same paper. They do not.
 *
 * What they share is the loan: the agreement they are both obligated under,
 * the Truth in Lending disclosure, and the authorization to take repayments
 * from their own card. What the co-borrower gets on top is the notice that
 * says what co-signing means — it exists precisely because a co-signer is
 * agreeing to somebody else's debt, so it is the one document a borrower
 * cannot be shown.
 *
 * The state-specific half stays with the application package: this is the
 * shape Dev replaces with the real configuration.
 */
const loanDocuments = [
  { id: "p1", name: "Loan agreement.pdf", type: "loan_agreement", on: "Sep 12, 2026" },
  { id: "p2", name: "Truth in Lending disclosure.pdf", type: "disclosure", on: "Sep 12, 2026" },
  { id: "p3", name: "Payment authorization.pdf", type: "consent", on: "Sep 12, 2026" },
];

export const loanPackageFor = (role: "borrower" | "coBorrower") =>
  role === "coBorrower"
    ? [
        ...loanDocuments,
        { id: "p4", name: "Notice to co-signer.pdf", type: "disclosure", on: "Sep 12, 2026" },
      ]
    : loanDocuments;

/** Under review: nothing decided, so withdrawing is still the borrower's. */
export const mockUnderReview: ApplicationSummary = {
  id: "A-2481",
  applicant: "Levi Ackerman",
  status: "review",
  uscisType: "I-485 · Adjust Status / Register Permanent Residence",
  amount: "$1,440.00",
  submittedOn: "Sep 05, 2026",
  documents: documents(),
};

/**
 * WAITING ON THE CO-BORROWER, which is one application seen by two people.
 *
 * Loan Decisioning: "If a co-borrower is required, the system shall send
 * co-borrower an invitation to the system", and "applications requiring a
 * co-borrower cannot proceed to underwriting until a qualified co-borrower
 * has accepted the invitation and completed all required application steps."
 * The borrower is told OPA is waiting; the invited person is told the
 * application is theirs to start, and by when.
 */
export const mockCoBorrowerNeeded: ApplicationSummary = {
  ...mockUnderReview,
  status: "coBorrower",
  invitation: {
    /* THE BORROWER OF THIS APPLICATION, and it has to be the same person the
       record's `applicant` names. It said Grace Okafor while the applicant
       was Levi Ackerman, so the invited person was told a different name from
       the one the loan belonged to. */
    invitedBy: "Levi Ackerman",
    invitee: "Daniel Okafor",
    inviteeEmail: "daniel.okafor@example.com",
    expiresOn: "Sep 16, 2026",
  },
};

/**
 * The co-borrower was reviewed and did not qualify, so the application has been
 * reset and is waiting on a different one. WBS story 14.
 *
 * The spent invitation is gone on purpose — leaving it would have the page say
 * "we are waiting on Daniel" and "Daniel did not qualify" at the same time.
 */
export const mockCoBorrowerFailed: ApplicationSummary = {
  ...mockUnderReview,
  status: "coBorrower",
  coBorrowerFailed: "Daniel Okafor",
};

/** Approved and waiting on a signature. WBS story 2. */
export const mockAwaitingSignature: ApplicationSummary = {
  ...mockUnderReview,
  status: "approved",
  /* They accepted the invitation and finished their part, which is what let
     the application reach underwriting at all — and it is why funding waits
     for two signatures rather than one. */
  coBorrower: "Daniel Okafor",
  // Customer-facing only: what it means for them, never the score or the rule.
  decisionNote: "Your application was approved. Sign the loan agreement and OPA pays the filing fee.",
  loan: {
    stage: "awaitingSignature",
    /*
     * REDUCED BY THE UNDERWRITER — the case the borrower has to be told about,
     * and the moment they meet it. WBS lets them "reduce or adjust the
     * requested loan amount to reflect the amount approved", and the revised
     * figure goes into the agreement now in front of the borrower to sign.
     * $1,440 asked, $1,300 approved.
     */
    amount: "$1,300.00",
    requestedAmount: "$1,440.00",
    unusedBalance: "$1,300.00",
    apr: "1.00%",
    term: "12 months",
    firstPaymentOn: "Oct 01, 2026",
    /* Approved between the application (Sep 05) and the agreement's own
       execution date (Sep 12). NO `fundedOn`: this loan is waiting on a
       signature, so it has not been funded, and a record carrying a funding
       date in that state is two facts that cannot both be true. `mockFunding`
       and `mockFunded` add it when it is true. */
    approvedOn: "Sep 10, 2026",
    nextPayment: nextDue.amount,
    nextPaymentOn: nextDue.due,
    schedule,
  },
};

/**
 * SIGNED, AND WAITING ON THE MONEY.
 *
 * WBS story 2 signs the package "BEFORE LOAN FUNDING", and Notifications has
 * a separate story for what happens next: "Receive loan funding notification
 * — Borrower shall receive confirmation when the loan has been funded and the
 * Virtual Payment Card is available." So there is a real gap between the
 * borrower's last act and the card existing, and `LoanStage` has always had a
 * name for it: `funding`.
 *
 * No card and no repayment yet — both arrive with the money. The documents
 * are signed, which is the one thing that changed.
 */
export const mockFunding: ApplicationSummary = {
  ...mockAwaitingSignature,
  decisionNote: undefined,
  documents: documents(true),
  loan: {
    ...mockAwaitingSignature.loan!,
    stage: "funding",
    /* The money moves here, which is what this stage IS. */
    fundedOn: "Sep 14, 2026",
    nextPayment: freshSchedule[0].amount,
    nextPaymentOn: freshSchedule[0].due,
    schedule: freshSchedule,
  },
};

/**
 * Funded, card issued and untouched: cancelling is still allowed.
 *
 * NOTHING IS PAID HERE. The card has not been used, so the filing fee has not
 * been paid out of it and the first instalment has not come round — the
 * schedule exists (the WBS generates it at funding) and every line on it is
 * still ahead. It used to carry three paid instalments beside an unused card
 * and a full unused balance, which is three facts that cannot all be true.
 *
 * No decision note. It said "sign the loan agreement and OPA pays the filing
 * fee", which was true a step earlier and is stale here — the agreement is
 * signed and the money has moved. The status tags beside the heading carry the
 * state instead.
 */
export const mockFunded: ApplicationSummary = {
  ...mockAwaitingSignature,
  decisionNote: undefined,
  documents: documents(true),
  loan: {
    stage: "funded",
    amount: "$1,440.00",
    unusedBalance: "$1,440.00",
    apr: "1.00%",
    term: "12 months",
    firstPaymentOn: "Oct 01, 2026",
    /* Between the application (Sep 05) and the agreement's own execution date
       (Sep 12), and the money after it. */
    approvedOn: "Sep 10, 2026",
    fundedOn: "Sep 14, 2026",
    nextPayment: freshSchedule[0].amount,
    nextPaymentOn: freshSchedule[0].due,
    schedule: freshSchedule,
    /* NOT THE BORROWER'S 4417. This is the card USIO issues to OPA's order,
       restricted to the filing fee; `mockPayments.borrowerCard` is the debit
       card the borrower brought to repay from. They were mocked with the same
       four digits and the same expiry, which quietly told the reader they are
       one card — the single thing this product cannot let them believe, since
       the money runs opposite ways through them.

       NO NETWORK ON THIS ONE. It carried "Mastercard" for a day, chosen only
       so it differed from the borrower's Visa — which is a fact invented to
       solve a design problem, and the scope rule is that nothing gets
       invented. The WBS names no network for USIO. The face falls back to
       "OPA VIRTUAL", which is what we know. */
    card: { last4: "3094", expiry: "11/29", used: false },
  },
};

/**
 * The card has been used, so story 9's window has closed — and repayment has
 * started. The filing fee is paid, the unused balance is nil, three
 * instalments are behind, and the next one is the fourth.
 */
export const mockCardUsed: ApplicationSummary = {
  ...mockFunded,
  loan: {
    ...mockFunded.loan!,
    unusedBalance: "$0.00",
    nextPayment: nextDue.amount,
    nextPaymentOn: nextDue.due,
    schedule,
    card: { last4: "3094", expiry: "11/29", used: true },
  },
};

/**
 * Cancelled before the card was used. WBS story 9.
 *
 * Reachable in the app now, not only here: pressing "Cancel this loan" and
 * confirming it puts the screen into this state, because a confirmation that
 * changes nothing on the page cannot be judged.
 */
export const cancel = (record: ApplicationSummary): ApplicationSummary => ({
  ...record,
  loan: record.loan
    ? {
        ...record.loan,
        stage: "cancelled",
        /* The card is closed with the loan: "The card is closed and nothing is
           paid out." Nothing is left to open, so the panel goes with it. */
        card: undefined,
      }
    : undefined,
});

export const mockCancelled: ApplicationSummary = cancel(mockFunded);

/**
 * Under review, and stopped until the borrower sends something.
 *
 * WBS, Loan Decisioning story 12: an underwriter "requests additional
 * information". The status is the WBS's own "Pending action".
 */
export const mockNeedsInfo: ApplicationSummary = {
  ...mockUnderReview,
  status: "pendingAction",
};

/**
 * Repaid in full: twelve of twelve, nothing due.
 *
 * The paid-off stage used to reuse the card-in-use record, which said three
 * of twelve on a loan the borrower had finished paying.
 */
export const mockRepaid: ApplicationSummary = {
  ...mockCardUsed,
  loan: {
    ...mockCardUsed.loan!,
    schedule: schedule.map((row) => ({ ...row, status: "paid" as const })),
    nextPayment: "$0.00",
    nextPaymentOn: schedule[schedule.length - 1].due,
  },
};

/** Declined. The reason is the customer-facing one, and nothing more. */
export const mockDeclined: ApplicationSummary = {
  ...mockUnderReview,
  status: "declined",
  decisionNote: "OPA could not approve this application. Call support and somebody will go through it with you.",
};

/** No application at all. */
export const mockNone: ApplicationSummary | undefined = undefined;
