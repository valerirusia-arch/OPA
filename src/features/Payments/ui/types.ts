// src/features/Payments/ui/types.ts
//
// The presentation contract for Manage Payments, in the WBS's own vocabulary.
//
// Two different things are called a "payment" in this epic and they are kept
// apart here, because conflating them is what makes repayment screens
// unreadable:
//
//   Installment — a line of the SCHEDULE. Something the borrower owes on a
//                 date. WBS story 1 generates them; story 2 displays them.
//   Transaction — an ATTEMPT to pay. Something that happened, with a result
//                 that can be pending, or fail, or be reversed weeks later.
//                 WBS stories 4, 11, 12, 16.
//
// One installment can have several transactions against it (story 13: "if a
// payment failed or was reversed, borrower should be able to make another
// attempt"), which is precisely why one list cannot be both.

import type { CardToken } from "../../LoanApplication/ui/types";

/**
 * The result of one attempt, as Repay reports it.
 *
 * These five and no others. WBS story 4: "all completed, pending, failed,
 * refunded and reversed payment transactions", and story 11: "the system shall
 * update the status of payment (succeeded, failed, reversed) based on the
 * status received from Repay". The status is never OPA's own opinion.
 */
export type PaymentStatus =
  | "succeeded"
  | "pending"
  | "failed"
  | "refunded"
  | "reversed";

/**
 * Where an installment stands. WBS story 2: "if a payment was completed, if a
 * payment is overdue".
 *
 * `scheduled` covers both "not due yet" and "due now" on purpose: the WBS asks
 * for completed and overdue, and inventing a third state the requirement does
 * not name would put a word on screen nobody agreed to.
 */
export type InstallmentStatus = "paid" | "scheduled" | "overdue";

export type Installment = {
  id: string;
  /** 1-based, so the borrower can see 3 of 12 without counting rows. */
  number: number;
  /** WBS story 1: "payments due on the 1st of each month". */
  due: string;
  /** WBS story 2: "amount to pay". */
  amount: string;
  status: InstallmentStatus;
  /**
   * Whose installment it is.
   *
   * Only the back-office list needs it: the wireframe for the internal
   * payments page is a table ACROSS borrowers with a Borrower column and a
   * "Filter by borrower" box, so a row there has to know whose it is. The
   * borrower's own page never sets it.
   */
  borrower?: string;
  /**
   * The late fee charged against THIS installment, if one was.
   *
   * WBS story 9: "$5.00 or 5% of the unpaid installment amount, whichever is
   * less. ONLY ONE late fee will be charged for each missed payment" — which
   * is why this is a single value on the installment and not a list.
   * Story 14 puts it in the internal view too: "any fees applied".
   */
  fee?: string;
};

/**
 * One attempt to pay, and how it ended.
 *
 * WBS story 12: "view the status of each payment transaction". The reference
 * is what support asks for on the phone; it is Repay's, not OPA's.
 */
export type PaymentTransaction = {
  id: string;
  /** When it was attempted. */
  on: string;
  /** Same as on the installment: the internal list spans borrowers. */
  borrower?: string;
  amount: string;
  status: PaymentStatus;
  /** Masked, from the token. Never a number. */
  cardLast4: string;
  /**
   * Which of the two people paid.
   *
   * WBS story 7: "THEY CANNOT SEE EACH OTHERS CARD INFORMATION." The saved-card
   * panel obeys that by being handed only the reader's own cards, but the
   * history would leak the same thing through the back door: the last four
   * digits of whichever card was charged. So a transaction knows whose card it
   * was, and the borrower-facing history shows the digits only to the person
   * they belong to. An internal reader sees them either way, because tracing a
   * payment to a card is the whole point of story 15.
   */
  paidBy?: "borrower" | "coBorrower";
  /** Repay's reference for the attempt. */
  reference: string;
  /** Which installment it was against, when it was a scheduled payment. */
  installmentId?: string;
  /**
   * Why it ended that way, when the borrower is owed an explanation.
   *
   * A translation key, not a sentence: this is displayed, so it has to exist
   * in both languages, and a computed key would need a cast that stops the
   * compiler telling us it does not.
   */
  noteKey?: PaymentNoteKey;
};

/** The reasons a transaction carries a line of explanation. */
export type PaymentNoteKey =
  | "payments.noteDeclined"
  | "payments.noteExpired"
  | "payments.noteInsufficient"
  | "payments.notePending"
  | "payments.noteRefunded"
  | "payments.noteReversed";

/**
 * How far behind the account is. WBS story 9 defines all four boundaries and
 * OPA does not get to soften them:
 *
 *   current      — nothing past due.
 *   overdue      — a payment missed. On the 16th day a late fee is charged.
 *   default      — "more than 90 days past due... the full past due balance
 *                  must be paid within 30 days to avoid loan acceleration".
 *   accelerated  — "more than 120 days past due... the full remaining loan
 *                  balance including interest and outstanding fees must be
 *                  paid within 30 days of receiving a notice of default".
 *
 * Story 10 is what puts it on screen: "review applied late fees and OVERDUE
 * PAYMENT INFORMATION".
 */
export type DelinquencyStage = "current" | "overdue" | "default" | "accelerated";

/**
 * What the borrower owes right now. WBS story 3 — "review the current
 * outstanding loan balance" — plus the parts story 10 adds to it.
 */
export type Balance = {
  /** The headline: everything still owed, fees included. */
  outstanding: string;
  /** Of that, what is loan and what is fee. Story 10 wants the fees named. */
  principal: string;
  fees: string;
  /** What is late right now, if anything. */
  pastDue?: string;
  stage: DelinquencyStage;
  /** Only once behind: how far. Drives the wording, not a countdown. */
  daysPastDue?: number;
  /**
   * WBS story 6: "repay the outstanding loan balance before the scheduled
   * maturity date". The figure that closes the loan today.
   */
  payoff: string;
  /** WBS story 8 (Manage loan) already showed the APR; it is repeated here
   *  because story 9's acceleration clause turns on it: "The APR remains at 1%". */
  apr: string;
  /** The last scheduled due date, for story 6's "before the maturity date". */
  maturityOn: string;
};

/**
 * The card the borrower repays with.
 *
 * WBS story 7 is emphatic on two points and both are structural rather than
 * cosmetic: "Full card details are not stored or displayed... only masked card
 * information and the payment token/reference received from Repay", and "They
 * cannot see each others card information. Borrower/Co-borrower should see
 * only the cards that the current user added."
 *
 * So a card knows who added it, and the screen is handed only the ones that
 * belong to whoever is looking.
 */
/*
 * WBS story 7 lists exactly what a saved card shows: "masked card details,
 * card brand, expiration date, and whether the card is currently used as the
 * active repayment method." Four things. An "Added <date>" line was here as a
 * fifth and has been removed — it was not on the list, and it made one card
 * take three lines of text.
 */
export type RepaymentCard = CardToken & {
  id: string;
  /** WBS story 7: "whether the card is currently used as the active repayment method". */
  active: boolean;
  /** Whose card it is. The other party is never shown it. */
  owner: "borrower" | "coBorrower";
};

/** Everything the payments screen renders, for one loan. */
export type PaymentsRecord = {
  loanId: string;
  balance: Balance;
  /** WBS story 2. Generated on funding, per story 1. */
  schedule: Installment[];
  /** WBS story 4. Read-only, newest first. */
  history: PaymentTransaction[];
  /** WBS story 7. Only the current reader's own cards ever reach here. */
  cards: RepaymentCard[];
};

/** What the borrower is paying, in the pay dialog. WBS stories 5 and 6. */
export type PaymentChoice = "installment" | "pastDue" | "payoff" | "other";
