// src/flows/payments/mockPayments.ts
//
// What the payments page shows, in each state the WBS names. Mock data only.
//
// The states here are almost all bad ones, on purpose. A repayment screen
// where every installment is paid is the state nobody needs designed: what
// needs designing is the page a borrower sees on day 22 of being late, and on
// day 96 when they are 25 days from owing the whole loan. Those are the ones
// with a story.
//
// THE FIGURES ARE ARITHMETIC, NOT INVENTION. The loan is the same $1,440.00 at
// 1% APR over 12 months that the loan page shows, and the schedule below is
// what that comes to: $120.65 a month with the last line rounding. WBS story 1
// sets the dates — "repayment begins within 45 days after the loan is
// approved, with payments due on the 1st of each month" — and the loan was
// approved on Sep 12, 2026, so the first line is Oct 01, 2026.
//
// IT USED TO SAY NOV 01, and that was 50 days after approval: outside the
// WBS's window, by five days, in the one number the whole schedule is built
// on. Both dates land on the 1st, which is how it survived so long — the rule
// has two halves and only the second one was being checked.
//
// THE LATE FEE IS THE WBS'S FORMULA, BOTH WAYS ROUND. "$5.00 or 5% of the
// unpaid installment amount, WHICHEVER IS LESS." On a $120.65 installment 5%
// is $6.03, so the fee is $5.00; on the $63.68 installment in the back-office
// mock 5% is $3.18, so the fee is $3.18. Both branches appear in the data,
// because a rule with only one worked example in a prototype is a rule nobody
// checks.

import type {
  Installment,
  PaymentTransaction,
  PaymentsRecord,
  RepaymentCard,
} from "../../features/Payments/ui/types";

const MONTHS = [
  "Oct 01, 2026",
  "Nov 01, 2026",
  "Dec 01, 2026",
  "Jan 01, 2027",
  "Feb 01, 2027",
  "Mar 01, 2027",
  "Apr 01, 2027",
  "May 01, 2027",
  "Jun 01, 2027",
  "Jul 01, 2027",
  "Aug 01, 2027",
  "Sep 01, 2027",
];

/**
 * $1,440.00 at 1% APR over 12 months.
 *
 * TWELVE EQUAL LINES, and that is a correction. The last one was $120.60 —
 * "the last line carries the rounding", which is how a real schedule works —
 * and it made the twelve add up to $1,447.75 against a balance this file
 * states as $1,447.80 everywhere else. Five cents, wrong for two years, and
 * invisible until /payments started printing "Total repaid" off the
 * schedule's own sum. Twelve at $120.65 is $1,447.80 exactly, which is the
 * number every other screen already shows.
 */
const INSTALLMENT = "$120.65";
const LAST_INSTALLMENT = INSTALLMENT;

/**
 * The schedule, with the first `paid` lines marked and `overdue` ones flagged.
 *
 * One builder rather than five hand-written arrays: the difference between
 * "on time" and "in default" is which lines have been paid, and writing that
 * out five times is how a demo ends up with a loan that owes thirteen months.
 */
const buildSchedule = (paid: number, overdue = 0, fee?: string): Installment[] =>
  MONTHS.map((due, index) => ({
    id: `s${index + 1}`,
    number: index + 1,
    due,
    amount: index === MONTHS.length - 1 ? LAST_INSTALLMENT : INSTALLMENT,
    status:
      index < paid ? "paid" : index < paid + overdue ? "overdue" : "scheduled",
    // WBS story 9: "ONLY ONE late fee will be charged for each missed
    // payment" — one value per line, never a running total. Every overdue
    // line here is past its 16th day; the back-office mock carries the case
    // where the newest miss has not reached its fee yet.
    ...(fee && index >= paid && index < paid + overdue ? { fee } : null),
  }));

/** The borrower's own card. WBS story 7: masked, and theirs alone. */
const borrowerCard: RepaymentCard = {
  id: "rc1",
  brand: "Visa",
  last4: "4417",
  expiry: "08/29",
  active: true,
  owner: "borrower",
};

/** The co-borrower's. Neither of them is ever handed the other's. */
const coBorrowerCard: RepaymentCard = {
  id: "rc2",
  brand: "Mastercard",
  last4: "8821",
  expiry: "03/28",
  active: true,
  owner: "coBorrower",
};

const paidOn = (id: string, on: string, amount = INSTALLMENT): PaymentTransaction => ({
  id,
  on,
  amount,
  status: "succeeded",
  cardLast4: borrowerCard.last4,
  paidBy: "borrower",
  reference: `RPY-${id.toUpperCase()}-8842`,
});

/** Three paid, nothing late. The ordinary state. */
export const mockCurrent: PaymentsRecord = {
  loanId: "A-2481",
  balance: {
    outstanding: "$1,085.85",
    principal: "$1,085.85",
    fees: "$0.00",
    stage: "current",
    payoff: "$1,081.20",
    apr: "1.00%",
    maturityOn: "Sep 01, 2027",
  },
  schedule: buildSchedule(3),
  history: [
    paidOn("t3", "Dec 01, 2026"),
    paidOn("t2", "Nov 01, 2026"),
    paidOn("t1", "Oct 01, 2026"),
  ],
  /*
    BOTH CARDS ARE ON FILE, because the WBS puts them there.

    The application collects a debit card from the borrower (story 6) and from
    the co-borrower ("Co-borrower shall provide their debit card details"), and
    neither step can be passed without one — so by the time a loan is funded
    with a co-borrower on it, two cards exist. The mock carried only the
    borrower's, which meant the co-borrower's payments page always said "No
    repayment card yet" about a card they had been REQUIRED to give.

    They still never see each other's: the screen hands this component only
    the reader's own (`ownCards`), which is story 7 — "Borrower/Co-borrower
    should see only the cards that the current user added."
  */
  cards: [borrowerCard, coBorrowerCard],
};

/**
 * FUNDED, AND NOTHING PAID YET — the state that goes with an unused card.
 *
 * The prototype used to show three payments behind you while the virtual card
 * still read "Not used yet" and the whole $1,440 sat unspent. Both cannot be
 * true: the money is repaid from the first of the month after funding, so at
 * the moment the card is issued there is a schedule and nothing on it is
 * behind you.
 *
 * The figures are the WBS's own arithmetic: twelve instalments of $120.65
 * against a $1,440 loan at 1% APR, so $1,447.80 outstanding
 * and $1,440.00 to close it today — the interest is what early settlement
 * saves.
 */
export const mockFresh: PaymentsRecord = {
  ...mockCurrent,
  balance: {
    ...mockCurrent.balance,
    outstanding: "$1,447.80",
    principal: "$1,447.80",
    payoff: "$1,440.00",
  },
  schedule: buildSchedule(0),
  history: [],
};

/**
 * Twenty-two days late. WBS story 9: the fee was charged on the 16th day, and
 * it is $5.00 rather than 5% because 5% of $120.65 is more.
 */
export const mockOverdue: PaymentsRecord = {
  ...mockCurrent,
  balance: {
    outstanding: "$1,090.85",
    principal: "$1,085.85",
    fees: "$5.00",
    pastDue: "$125.65",
    stage: "overdue",
    daysPastDue: 22,
    payoff: "$1,086.20",
    apr: "1.00%",
    maturityOn: "Sep 01, 2027",
  },
  schedule: buildSchedule(3, 1, "$5.00"),
};

/**
 * Ninety-six days past due, which the WBS calls default: "the full past due
 * balance must be paid within 30 days to avoid loan acceleration".
 */
export const mockDefault: PaymentsRecord = {
  ...mockCurrent,
  balance: {
    outstanding: "$1,100.85",
    principal: "$1,085.85",
    fees: "$15.00",
    pastDue: "$376.95",
    stage: "default",
    daysPastDue: 96,
    payoff: "$1,096.20",
    apr: "1.00%",
    maturityOn: "Sep 01, 2027",
  },
  schedule: buildSchedule(3, 3, "$5.00"),
  history: [
    {
      id: "t5",
      on: "Feb 03, 2027",
      amount: "$120.65",
      status: "failed",
      cardLast4: borrowerCard.last4,
      paidBy: "borrower",
      reference: "RPY-T5-4471",
      noteKey: "payments.noteInsufficient",
    },
    {
      id: "t4",
      on: "Jan 02, 2027",
      amount: "$120.65",
      status: "failed",
      cardLast4: borrowerCard.last4,
      paidBy: "borrower",
      reference: "RPY-T4-4470",
      noteKey: "payments.noteDeclined",
    },
    paidOn("t3", "Dec 01, 2026"),
    paidOn("t2", "Nov 01, 2026"),
    paidOn("t1", "Oct 01, 2026"),
  ],
};

/**
 * Past 120 days, so the loan has been accelerated: "the full remaining loan
 * balance including interest and outstanding fees must be paid within 30 days
 * of receiving a notice of default. The APR remains at 1%."
 *
 * The payoff and the outstanding balance are the same figure here, because
 * that is what acceleration means.
 */
export const mockAccelerated: PaymentsRecord = {
  ...mockDefault,
  balance: {
    outstanding: "$1,105.85",
    principal: "$1,085.85",
    fees: "$20.00",
    pastDue: "$1,105.85",
    stage: "accelerated",
    daysPastDue: 127,
    payoff: "$1,105.85",
    apr: "1.00%",
    maturityOn: "Sep 01, 2027",
  },
  schedule: buildSchedule(3, 4, "$5.00"),
};

/**
 * All five transaction outcomes on one page. WBS story 4 asks for "completed,
 * pending, failed, refunded and reversed", and four of those never occur in a
 * happy demo.
 *
 * WBS story 16: a reversal or a refund "automatically update[s] the loan
 * balance, payment history and outstanding amount" and triggers nothing else
 * — no notification, no delinquency recalculation, no review. So the row is
 * simply there, and the balance already reflects it.
 */
export const mockAllOutcomes: PaymentsRecord = {
  ...mockCurrent,
  balance: { ...mockCurrent.balance, outstanding: "$1,206.50", principal: "$1,206.50", payoff: "$1,201.40" },
  schedule: buildSchedule(2),
  history: [
    {
      id: "t6",
      on: "Jan 01, 2027",
      amount: "$120.65",
      status: "pending",
      cardLast4: borrowerCard.last4,
      paidBy: "borrower",
      reference: "RPY-T6-4472",
      noteKey: "payments.notePending",
    },
    {
      id: "t5",
      on: "Dec 12, 2026",
      amount: "$120.65",
      status: "reversed",
      cardLast4: borrowerCard.last4,
      paidBy: "borrower",
      reference: "RPY-T5-4471",
      noteKey: "payments.noteReversed",
    },
    {
      /* Paid by the co-borrower. WBS story 7: the borrower reading this sees
         WHO paid and not the digits, and the co-borrower sees it the other way
         round. Without one such row in the data the rule is untestable. */
      id: "t4",
      on: "Dec 04, 2026",
      amount: "$50.00",
      status: "refunded",
      cardLast4: coBorrowerCard.last4,
      paidBy: "coBorrower",
      reference: "RPY-T4-4470",
      noteKey: "payments.noteRefunded",
    },
    {
      id: "t3",
      on: "Dec 01, 2026",
      amount: "$120.65",
      status: "failed",
      cardLast4: borrowerCard.last4,
      paidBy: "borrower",
      reference: "RPY-T3-4469",
      noteKey: "payments.noteExpired",
    },
    paidOn("t2", "Nov 01, 2026"),
    paidOn("t1", "Oct 01, 2026"),
  ],
};

/**
 * Nothing to charge.
 *
 * WBS story 7: "Borrower/Co-borrower should see only the cards that the
 * current user added." A co-borrower who never added one arrives here, and it
 * is not an error state — it is the normal first visit.
 */
export const mockNoCard: PaymentsRecord = { ...mockCurrent, cards: [] };

/** One reader's slice of it, for the stories that render the panel directly
 *  rather than through the screen's own filter. */
export const mockAsCoBorrower: PaymentsRecord = {
  ...mockCurrent,
  cards: [coBorrowerCard],
};

/** Paid off early. WBS story 6's other ending. */
export const mockPaidOff: PaymentsRecord = {
  ...mockCurrent,
  balance: {
    outstanding: "$0.00",
    principal: "$0.00",
    fees: "$0.00",
    stage: "current",
    payoff: "$0.00",
    apr: "1.00%",
    maturityOn: "Sep 01, 2027",
  },
  schedule: buildSchedule(12),
  history: [
    {
      id: "t4",
      on: "Jan 01, 2027",
      amount: "$1,081.20",
      status: "succeeded",
      cardLast4: borrowerCard.last4,
      paidBy: "borrower",
      reference: "RPY-T4-9001",
    },
    paidOn("t3", "Dec 01, 2026"),
    paidOn("t2", "Nov 01, 2026"),
    paidOn("t1", "Oct 01, 2026"),
  ],
};

/** The schedule the loan page shows. One source, so the two cannot disagree. */
export const loanSchedule = mockCurrent.schedule;
