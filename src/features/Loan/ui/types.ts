// src/features/Loan/ui/types.ts
//
// The presentation contract for Manage Loan, taken from the WBS's own
// vocabulary. Owned by the screens that render it; Dev adapts /models onto it.

import type { ApplicationStatus } from "../../Borrowers/ui/types";
import type { Installment } from "../../Payments/ui/types";

/**
 * Where the loan itself has got to, once there is one.
 *
 * Separate from the APPLICATION's status on purpose: an application can be
 * approved while no loan exists yet, and the WBS keeps the two apart —
 * "Loan documents become available for signature only after the application
 * has been approved", and the card is issued after that again.
 */
export type LoanStage =
  /** Approved, and the package is out for signature. WBS story 2. */
  | "awaitingSignature"
  /** Signed, waiting on the money. */
  | "funding"
  /** Funded, card issued. WBS stories 7, 8, 9. */
  | "funded"
  /** The borrower cancelled it before the card was used. WBS story 9. */
  | "cancelled";

/**
 * A document on the application or the loan.
 *
 * WBS: "access all loan-related documents (download only, no in-app preview is
 * assumed)" and "Documents remain available throughout the loan lifecycle and
 * are read-only after execution". So a name, a date, a size, and one way out.
 */
export type LoanDocument = {
  id: string;
  name: string;
  /**
   * What kind of document it is, as the wireframe's Type column shows it:
   * "Income", "loan_agreement". Free text rather than an enum — the package is
   * generated from the borrower's state and their US state, so the set is not
   * ours to close.
   */
  type: string;
  /** When it was added or executed. */
  on: string;
  /** Signed and therefore frozen. */
  executed?: boolean;
  /**
   * Who put it there. The internal wireframe has an "Uploaded by" column, and
   * it distinguishes the borrower's own upload from a generated document,
   * which the mock shows as "system".
   */
  uploadedBy?: string;
  /** WBS story 11: a comment may be attached to the document it is about. */
  comment?: string;
};

export type LoanRecord = {
  stage: LoanStage;
  /** WBS story 8: "loan amount, remaining unused balance, APR, repayment terms". */
  amount: string;
  unusedBalance: string;
  apr: string;
  term: string;
  /** WBS story 8's "repayment terms": when repayment opens. */
  firstPaymentOn: string;
  /**
   * WHEN THE DECISION WAS TAKEN, and when the money moved.
   *
   * Added for the dashboard's tracker, which had a date against two of its
   * four steps and a blank against the other two. `fundedOn` was already
   * modelled on the internal loan record (`Borrowers/ui/types`), so the
   * product holds the fact; `approvedOn` is its pair and is the one genuinely
   * new field here. **Both are worth confirming with OPA** — a status tracker
   * is only as honest as the timestamps behind it.
   */
  approvedOn?: string;
  fundedOn?: string;
  /**
   * The next instalment owed, and when.
   *
   * The wireframe's Repayment card leads on it, and it is the one figure a
   * borrower checks between statements. It is read off the schedule rather
   * than invented, so the loan page and the payments page cannot disagree.
   */
  nextPayment: string;
  nextPaymentOn: string;
  /**
   * WBS Epic 5 story 8: "repayment terms and schedule".
   *
   * The same `Installment` Manage Payments renders, from the same module and
   * the same mock. Epic 5 showed the schedule and Epic 6 owns it; two types
   * for one table is how a loan page and a payments page end up disagreeing
   * about what is due.
   */
  schedule: Installment[];
  /**
   * The virtual card, as far as OPA is allowed to know it.
   *
   * WBS: "Card details are NOT stored, processed or transmitted by OPA
   * application and are accessible only via a secure embedded view/directly on
   * USIO and is working as a 'black box' for OPA application." So this is a
   * masked reference and a flag, never a number.
   */
  card?: {
    /**
     * The network USIO issued it on, if OPA has said which.
     *
     * OPTIONAL, AND EMPTY IN THE MOCK ON PURPOSE. A virtual card is still
     * issued on a network and the WBS does list a brand among the four things
     * OPA holds about a card — but it never says which network USIO issues
     * on, and the prototype briefly asserted Mastercard for no better reason
     * than that the borrower's own debit card is a Visa. That is exactly the
     * kind of invention the scope rule forbids. Without it the card face
     * prints "OPA VIRTUAL" instead, which is the thing we actually know.
     * **Ask OPA.**
     */
    brand?: string;
    last4: string;
    /**
     * MM/YY. One of the four things the modal already showed, moved onto the
     * loan itself: it was a literal typed into the screen, which meant the
     * panel and the modal could disagree about the same card.
     */
    expiry: string;
    /** Cancelling is only allowed until this turns true. WBS story 9. */
    used: boolean;
  };
};

export type ApplicationSummary = {
  id: string;
  /** WBS: "Submitted, Under Review, Pending action, Approved, declined". */
  status: ApplicationStatus;
  uscisType: string;
  amount: string;
  submittedOn: string;
  /**
   * What the borrower is told about the outcome.
   *
   * WBS: "Only customer-facing decision details are displayed. Internal
   * scoring, business rules and decision logic are NOT exposed to the
   * borrower." There is deliberately no credit score, no rule name and no
   * "which check stopped it" on this side of the product — those live on the
   * underwriter's screen and stay there.
   */
  decisionNote?: string;
  documents: LoanDocument[];
  /**
   * The co-borrower invitation on this application, while one is outstanding.
   *
   * The same fact read from two sides: the borrower's Application tab says
   * "we are waiting on them", the invited person's says "this is yours to
   * start". WBS: the invitation "expires 5 calendar days after it is sent"
   * and the system tracks Pending / Accepted / Expired, so the date is part
   * of the fact and not decoration.
   */
  invitation?: {
    /** Whose application it is — the name the invited person is told. */
    invitedBy: string;
    /** Who was asked — the name the borrower is waiting on. */
    invitee: string;
    /** …and the address it went to, which is the borrower's own record of it. */
    inviteeEmail: string;
    expiresOn: string;
  };
  /**
   * The co-borrower who joined this application, once they have.
   *
   * WBS Manage Loan story 2: the documents are signed by "the Borrower AND
   * Co-borrower… BEFORE loan funding", so whether there is a second signature
   * to wait for is a property of the application, not of who is reading it.
   * Absent means this is a one-person loan and one signature finishes it.
   */
  coBorrower?: string;
  /** Whose application it is. Named, because the co-borrower waits on them. */
  applicant?: string;
  loan?: LoanRecord;
};

/**
 * A note an internal user left on a loan. WBS story 11 — "Authorized users
 * shall be able to manually update loan details (add documents, comments)".
 *
 * Append-only: the story says ADD, and a comment somebody can quietly rewrite
 * is not a record of anything.
 */
export type LoanComment = {
  id: string;
  on: string;
  by: string;
  text: string;
};
