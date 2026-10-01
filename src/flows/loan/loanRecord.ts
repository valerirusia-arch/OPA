// src/flows/loan/loanRecord.ts
//
// Where the borrower is in their journey, for the whole prototype at once.
//
// TWO PROBLEMS, ONE ANSWER.
//
// The first: cancelling a loan used to live in `useState` inside LoanScreen,
// so it survived exactly as long as the page did — walk to Payments and back
// and the cancelled loan was funded again. *"სხვა გვერდზე რომ გადავდივარ და
// უკან გადმოვდივარ, ლოანი ისევ იგივენაირად მხვდება."*
//
// The second: most of the design is in states nobody can walk to. Seeing an
// overdue account meant editing a mock; seeing an approved-but-unsigned
// application meant filling in seven steps first. *"რამე დემო ვერსია ხომ უნდა
// მქონდეს, სადაც ამ ყველაფერს ვნახავ — სტატუსებს და ასე შემდეგ."*
//
// So one module holds ONE fact — which stage the borrower is at — and every
// borrower-side screen reads the records that follow from it. The DevBar sets
// it directly, and the app's own irreversible actions set it too, so the
// switch and the app can never disagree.
//
// PREVIEW PLUMBING, not product state. Same category and the same mechanism as
// `shared/ui/viewerRole.ts` and `theme/themeMode.ts`: a module-level value plus
// `useSyncExternalStore`, no provider to mount (which would mean editing /app),
// no store library, no fetching, no business rules — a lookup table of mocks.
//
// Deliberately NOT persisted the way the role switch is: a reload puts the
// prototype back where a new customer starts, with nothing applied for.
// Anything tried — an application, a payment, a cancellation — is meant to be
// tried, seen through, and reset by refreshing.
//
// Dev deletes this file: the screens read the same shapes from queries.

import { useSyncExternalStore } from "react";
import type { ApplicationSummary } from "../../features/Loan/ui/types";
import type {
  Installment,
  PaymentsRecord,
  RepaymentCard,
} from "../../features/Payments/ui/types";
import { formatAmount, toAmount } from "../../features/Payments/ui/money";
import {
  mockAwaitingSignature,
  mockCancelled,
  mockCardUsed,
  mockCoBorrowerFailed,
  mockCoBorrowerNeeded,
  mockDeclined,
  mockFunded,
  mockFunding,
  mockNeedsInfo,
  mockRepaid,
  mockUnderReview,
} from "./mockLoan";
import {
  mockAccelerated,
  mockCurrent,
  mockDefault,
  mockFresh,
  mockOverdue,
  mockPaidOff,
} from "../payments/mockPayments";

/**
 * Every state the borrower's side of the product can be in, in the order they
 * happen. The WBS names all of them; this is only a shorter way to say which.
 */
export type BorrowerStage =
  | "none"
  | "review"
  | "coBorrower"
  | "coBorrowerFailed"
  | "needsInfo"
  | "declined"
  | "approved"
  | "funding"
  | "funded"
  | "cardUsed"
  | "overdue"
  | "default"
  | "accelerated"
  | "paidOff"
  | "cancelled";

/**
 * What each stage IS, on both pages at once.
 *
 * Built once, at module load, rather than per read: `useSyncExternalStore`
 * compares snapshots by identity, and a record rebuilt on every read is a new
 * object every time — which is an infinite render loop, not a re-render.
 *
 * `payments: undefined` is not "no data". It is the WBS's own answer —
 * "Repayment Schedule is automatically generated when the loan is funded" —
 * so before funding there is nothing to repay, and after a cancellation there
 * is nothing left to repay either.
 */
const STAGES: Record<
  BorrowerStage,
  { label: string; loan?: ApplicationSummary; payments?: PaymentsRecord }
> = {
  none: { label: "No application" },
  review: { label: "Submitted · under review", loan: mockUnderReview },
  coBorrower: { label: "Waiting on the co-borrower", loan: mockCoBorrowerNeeded },
  /* WBS story 14: the co-borrower failed underwriting, so the system reset
     the application and it is waiting on a different one. */
  coBorrowerFailed: { label: "Co-borrower did not qualify", loan: mockCoBorrowerFailed },
  needsInfo: { label: "More information needed", loan: mockNeedsInfo },
  declined: { label: "Declined", loan: mockDeclined },
  approved: { label: "Approved · to sign", loan: mockAwaitingSignature },
  /* The borrower has signed; OPA and USIO have not finished. */
  funding: { label: "Signed · being paid out", loan: mockFunding },
  /* Funded, card untouched: a schedule with nothing on it behind you. */
  funded: { label: "Funded · card unused", loan: mockFunded, payments: mockFresh },
  /* The fee is paid, so repayment is under way: three of twelve. */
  cardUsed: { label: "Card in use · repaying", loan: mockCardUsed, payments: mockCurrent },
  overdue: { label: "Payment overdue", loan: mockCardUsed, payments: mockOverdue },
  default: { label: "In default", loan: mockCardUsed, payments: mockDefault },
  accelerated: { label: "Accelerated", loan: mockCardUsed, payments: mockAccelerated },
  /* Nothing left: twelve of twelve, and the loan page has to say so too. */
  paidOff: { label: "Paid off", loan: mockRepaid, payments: mockPaidOff },
  cancelled: { label: "Cancelled", loan: mockCancelled },
};

/** How the switcher lists them: the story in the order the WBS tells it. */
export const STAGE_GROUPS: { group: string; stages: BorrowerStage[] }[] = [
  {
    group: "Application",
    stages: ["none", "review", "coBorrower", "coBorrowerFailed", "needsInfo", "declined"],
  },
  { group: "Loan", stages: ["approved", "funding", "funded", "cardUsed"] },
  { group: "Repayment", stages: ["overdue", "default", "accelerated", "paidOff"] },
  { group: "Ended", stages: ["cancelled"] },
];

/**
 * WHAT THE PAGE YOU ARE ON CAN ACTUALLY SHOW.
 *
 * The dock used to walk all twelve wherever you stood, so on /payments eight
 * of the presses drew the same empty state and on /loan four of them drew the
 * same funded page. *"როცა ლოანზე ვარ, მხოლოდ ლოანის ვარიანტები უნდა
 * გვქონდეს; როცა ფეიმენტზე გადავალ, მანდ მხოლოდ ფეიმენტის ვარიანტები."*
 *
 * /payments only has states once a loan is funded — plus the one before it,
 * because "there is nothing to repay yet" is a state of that page too.
 */
const PAYMENT_STAGES: BorrowerStage[] = [
  "none",
  "funded",
  "overdue",
  "default",
  "accelerated",
  "paidOff",
];

/**
 * /application draws THREE screens, so the dock offers three stages.
 *
 * `gateFor` collapses the rest onto them — declined and cancelled both leave
 * the page offering a new application, and approved, funding, funded and
 * card-in-use all leave it saying "you already have one". Walking eight
 * stages there means pressing through the same screen four times in a row.
 */
const APPLICATION_STAGES: BorrowerStage[] = [
  "none",
  "review",
  "coBorrower",
  "coBorrowerFailed",
  "needsInfo",
  /* The decision, both ways: this page draws each of them now rather than
     collapsing approved onto "still with OPA" and declined onto "start one". */
  "approved",
  "declined",
  /* `paidOff` is the only funded stage this page draws differently from the
     rest: it is the state that offers to close the file. */
  "paidOff",
];

const LOAN_STAGES: BorrowerStage[] = [
  "none",
  "review",
  "coBorrower",
  "coBorrowerFailed",
  "needsInfo",
  "declined",
  "approved",
  "funding",
  "funded",
  "cardUsed",
  /* PAID OFF WAS MISSING FROM THIS LIST and it is the other way a loan ends.
     `cancelled` was here and `paidOff` was not, so /loan's demo bar could
     reach the unhappy ending and not the happy one — which also left the
     statement's "Nothing left to pay" unreachable on the page that draws it.
     The delinquency stages stay off this list on purpose: they are about the
     money and belong to /payments and the dashboard. */
  "paidOff",
  "cancelled",
];

/**
 * THE DASHBOARD SEES BOTH HALVES, so it walks all of them.
 *
 * It is the one page that draws the application AND the money: the tiles, the
 * balance and the delinquency deadlines are all on it. Handing it the loan
 * page's list left "in default" and "accelerated" unreachable from the page
 * that has the most to say about them.
 */
const ALL_STAGES: BorrowerStage[] = [
  "none",
  "review",
  "coBorrower",
  "needsInfo",
  "declined",
  "approved",
  "funding",
  "funded",
  "cardUsed",
  "overdue",
  "default",
  "accelerated",
  "paidOff",
  "cancelled",
];

/**
 * THE CO-BORROWER'S OWN WALK, which is not the borrower's.
 *
 * `none` is off it, and that is the point: a co-borrower with no application
 * is not a person this product has. They exist because somebody invited them,
 * so their first state is the invitation and never "start a loan application"
 * — which is what the dock was offering them. *"ქო-ბოროვერს პირველი ექნებოდა
 * რომ ლევი აკერმანმა მოგიწვია."*
 *
 * Seven stages, and each one draws a different screen for them: invited,
 * their part filed, a request for more, the invitation closed after they did
 * not qualify, the loan live, the application closed, and settled.
 */
const CO_BORROWER_STAGES: BorrowerStage[] = [
  "coBorrower",
  "review",
  "needsInfo",
  "coBorrowerFailed",
  "funded",
  "declined",
  "paidOff",
];

export const stagesForPath = (
  pathname: string,
  role?: "borrower" | "coBorrower",
): BorrowerStage[] =>
  role === "coBorrower"
    ? CO_BORROWER_STAGES
    : stagesForBorrowerPath(pathname);

const stagesForBorrowerPath = (pathname: string): BorrowerStage[] =>
  pathname.startsWith("/dashboard")
    ? ALL_STAGES
    : pathname.startsWith("/payments")
    ? PAYMENT_STAGES
    : /* The co-borrower's application is an application: it draws the same
         three screens, and it was being offered the loan page's nine. */
      pathname.startsWith("/application") || pathname.startsWith("/co-application")
      ? APPLICATION_STAGES
      : LOAN_STAGES;

export const stageLabel = (stage: BorrowerStage) => STAGES[stage].label;

/**
 * WHERE THE PROTOTYPE OPENS: with nothing.
 *
 * It used to open on a funded loan, because that is the state most of the
 * design hangs off and it saved a reviewer seven steps. The designer's call
 * is the other way round, and it is the right one: the first thing anybody
 * sees should be the first thing a REAL person sees — no application, no
 * loan, an empty Application tab offering to start one. *"ყოველთვის
 * დეფაულტად იყოს ზუსტად ისე, როგორც ახალ შემოსული იუსერი."*
 *
 * Nothing is lost by it: the demo dock walks to any state in a press or two,
 * and now the walk starts where the story does.
 */
let current: BorrowerStage = "none";

const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const setStage = (stage: BorrowerStage) => {
  current = stage;
  /* A payment belongs to the stage it was made in. */
  paid = undefined;
  loanPaid = undefined;
  /* …and so do the signatures: walking the dock past the signing stage is
     walking past the signing, and a stage that is already funded cannot be
     waiting for anybody's pen. The invitation and the applied-for amount are
     NOT cleared: those belong to the person and their application, which is
     the same application whichever stage the demo is walked to. */
  delete signatures.borrower;
  delete signatures.coBorrower;
  loanMemo = {};
  listeners.forEach((listener) => listener());
};

const getStage = () => current;

/**
 * The same session's payment, seen from the loan page.
 *
 * /loan reads its own copy of the schedule — the statement's "0 of 12
 * payments made" and the next instalment come off it — so a payment that
 * only updated the payments record left the two pages disagreeing about the
 * same loan. One payment, both overlays.
 */
let loanPaid: ApplicationSummary | undefined;

/**
 * WHAT THE BORROWER ACTUALLY APPLIED FOR.
 *
 * The stage table holds one worked example — a $1,440 I-485 submitted on
 * Sep 05 — and until now that is what /loan showed however the wizard was
 * filled in. Apply for an N-400 at $760 and the next page said $1,440 for an
 * I-485: the two halves of one demo disagreeing about the loan they were
 * describing.
 *
 * So the application's own answers are kept and laid over every stage. The
 * amount is the one the WBS derives — "the application type… defines the size
 * of the loan", and OPA "lends exactly the USCIS filing fee" — so it is not a
 * free figure and everything downstream follows it: the instalments, the
 * balances and the payoff are all the same loan seen at different moments,
 * and they are scaled together rather than re-invented.
 *
 * Cleared by nothing. It is what this person applied for, and walking the
 * demo through the stages is walking THAT application through them.
 */
let submitted: { amount: string; uscisType: string; submittedOn: string; scale: number } | undefined;

/** The mock's own loan, and the figure every other number in it derives from. */
const BASE_AMOUNT = 1440;

export const applyApplication = (application: {
  amount: number;
  uscisType: string;
  submittedOn: string;
}) => {
  submitted = {
    amount: formatAmount(application.amount),
    uscisType: application.uscisType,
    submittedOn: application.submittedOn,
    scale: application.amount / BASE_AMOUNT,
  };
  /* Both memos are keyed on the record they were built from; the overlay they
     apply has just changed under them. */
  loanMemo = {};
  merged = { version: -1 };
  listeners.forEach((listener) => listener());
};

/** One formatted figure, moved onto the applied-for loan. */
const scaled = (formatted: string) =>
  submitted ? formatAmount(toAmount(formatted) * submitted.scale) : formatted;

/**
 * THE INVITATION THIS BORROWER ACTUALLY SENT.
 *
 * Same reasoning as the card and the applied-for amount: sending it from the
 * invite screen used to change that screen and nothing else, so replacing
 * Daniel with Maya and pressing Back left the Application tab still saying
 * "Daniel Okafor has been invited". An invitation is a thing that happened to
 * the APPLICATION — WBS: it "securely associates the co-borrower with the
 * corresponding loan application" — so it belongs on the record every page
 * reads, not in one screen's `useState`.
 *
 * `undefined` after a replacement with nothing sent yet is a real state, so
 * the two are told apart: `invited === null` means "the record's invitation
 * was withdrawn and there is none".
 */
let invited:
  | { invitedBy: string; invitee: string; inviteeEmail: string; expiresOn: string }
  | null
  | undefined;

export const applyInvitation = (
  invitation: {
    /** Whose application it is — the name the invited person is shown. */
    invitedBy: string;
    invitee: string;
    inviteeEmail: string;
    expiresOn: string;
  } | null
) => {
  invited = invitation;
  loanMemo = {};
  listeners.forEach((listener) => listener());
};

/**
 * WHO HAS SIGNED THE LOAN PACKAGE.
 *
 * WBS Manage Loan story 2: "The Borrower AND Co-borrower shall be able to
 * review and electronically sign all loan documents required after loan
 * approval… BEFORE LOAN FUNDING." Two signatures, and the money does not move
 * until both are in.
 *
 * The prototype used to fund on whichever signature arrived first, because
 * one stage cannot hold "half signed". It is not a stage — it is a fact about
 * two people — so it lives here, beside the cards, and the stage only moves
 * on when `signedEverything` says it may.
 *
 * An application with no co-borrower needs one signature; `coBorrower` on the
 * record is what says which.
 */
const signatures: Partial<Record<RepaymentCard["owner"], true>> = {};

export const applySignature = (who: RepaymentCard["owner"]) => {
  signatures[who] = true;
  loanMemo = {};
  listeners.forEach((listener) => listener());
};

/**
 * Has this person signed? Drives what the loan page offers them.
 *
 * A hook rather than a plain read: the loan page can be open when the
 * signature lands, and `getLoan`'s snapshot does not change when it does —
 * nothing about the APPLICATION changed, only who has signed it. A boolean
 * snapshot is its own identity, so this subscribes cleanly.
 */
export const useHasSigned = (who: RepaymentCard["owner"]): boolean =>
  useSyncExternalStore(
    subscribe,
    () => signatures[who] === true,
    () => signatures[who] === true
  );

/**
 * Is the package complete? The borrower always has to sign; the co-borrower
 * only if there is one on the application.
 */
export const signedEverything = (record: ApplicationSummary | undefined) =>
  signatures.borrower === true &&
  (record?.coBorrower === undefined || signatures.coBorrower === true);

/* Memoised, because `useSyncExternalStore` compares snapshots by identity. */
let loanMemo: { from?: ApplicationSummary; out?: ApplicationSummary } = {};

const getLoan = () => {
  const base = loanPaid ?? STAGES[current].loan;
  if (!base || (!submitted && invited === undefined)) return base;
  if (loanMemo.from === base) return loanMemo.out;

  const out: ApplicationSummary = {
    ...base,
    ...(submitted
      ? {
          amount: submitted.amount,
          uscisType: submitted.uscisType,
          submittedOn: submitted.submittedOn,
        }
      : null),
    /* Whoever was actually invited is the co-borrower this loan waits a
       signature on, not the one the mock happens to name. */
    ...(invited ? { coBorrower: invited.invitee } : null),
    ...(invited === undefined
      ? null
      : {
          invitation: invited
            ? {
                invitedBy: invited.invitedBy,
                invitee: invited.invitee,
                inviteeEmail: invited.inviteeEmail,
                expiresOn: invited.expiresOn,
              }
            : undefined,
        }),
    loan: base.loan && {
      ...base.loan,
      ...(submitted ? { amount: submitted.amount } : null),
      unusedBalance: scaled(base.loan.unusedBalance),
      nextPayment: scaled(base.loan.nextPayment),
      schedule: base.loan.schedule.map((row) => ({
        ...row,
        amount: scaled(row.amount),
        ...(row.fee ? { fee: row.fee } : null),
      })),
    },
  };
  loanMemo = { from: base, out };
  return out;
};

/**
 * A payment the borrower made during this session.
 *
 * The stage table is static — it has to be, or `useSyncExternalStore` loops —
 * so a payment lands here instead, over the top of whatever stage is current.
 * Changing stage throws it away: the stage IS the state, and "overdue" means
 * overdue whatever was paid a moment ago in another one.
 */
let paid: PaymentsRecord | undefined;

/**
 * THE CARDS THESE TWO PEOPLE HAVE GIVEN REPAY, in this session.
 *
 * Kept apart from `paid`, and NOT cleared by a stage change, because a card is
 * not a property of the loan's stage — it is a property of the PERSON. The
 * WBS collects it during the application deliberately: "Integrate with Repay…
 * to collect and tokenize borrower / co-borrower debit card information
 * DURING THE LOAN APPLICATION PROCESS and to support subsequent loan
 * repayment transactions." The whole point of taking it then is that it is
 * already on file when the first instalment falls due — so a card that
 * evaporated the moment the application was submitted would be the prototype
 * misrepresenting the integration. *"წეღან შევიყვანე აპლიკაციაში ბარათი და
 * მანდ არ დაასეივა."*
 *
 * One per person, because one is all either of them can have: the update
 * story deletes the old card and puts the new one through the same flow. And
 * strictly per person — "They cannot see each other's card information."
 */
const given: Partial<Record<RepaymentCard["owner"], RepaymentCard>> = {};
/** Bumped on every write, so the memo below knows to rebuild. */
let cardsVersion = 0;

/**
 * The stage's payments record, with those cards over the top of it.
 *
 * Memoised rather than rebuilt per read: `useSyncExternalStore` compares
 * snapshots by identity, so a fresh object on every read is an infinite loop
 * rather than a re-render.
 */
let merged: { from?: PaymentsRecord; version: number; out?: PaymentsRecord } = {
  version: -1,
};

const getPayments = () => {
  const base = paid ?? STAGES[current].payments;
  const owners = Object.keys(given) as RepaymentCard["owner"][];
  if (!base || (owners.length === 0 && !submitted)) return base;

  if (merged.from === base && merged.version === cardsVersion) return merged.out;

  /* THE SAME LOAN, SEEN FROM THE OTHER PAGE. The instalments, the balances
     and the payoff are all derived from the amount borrowed, so when that is
     the applied-for amount rather than the mock's they move with it — see
     `submitted`. Scaled together, never re-invented, so /loan and /payments
     cannot disagree about one loan. */
  const money = submitted
    ? {
        balance: {
          ...base.balance,
          outstanding: scaled(base.balance.outstanding),
          principal: scaled(base.balance.principal),
          payoff: scaled(base.balance.payoff),
          ...(base.balance.pastDue ? { pastDue: scaled(base.balance.pastDue) } : null),
        },
        schedule: base.schedule.map((row) => ({ ...row, amount: scaled(row.amount) })),
        history: base.history.map((row) => ({ ...row, amount: scaled(row.amount) })),
      }
    : null;

  merged = {
    from: base,
    version: cardsVersion,
    out: {
      ...base,
      ...(money ?? {}),
      cards: [
        ...owners.map((owner) => given[owner] as RepaymentCard),
        /* Whatever the mock held for somebody who has not given one here. */
        ...base.cards.filter((card) => !owners.includes(card.owner)),
      ],
    },
  };
  return merged.out;
};

/**
 * A CARD GOES ON FILE, AND EVERY PAGE THAT SHOWS CARDS SAYS SO.
 *
 * Three moments reach this, and the WBS treats them as the same thing:
 *
 *   · the application's card step, where Repay tokenises the details — for
 *     the borrower, and for the co-borrower, whose own story reads "Co-borrower
 *     shall provide their debit card details". It is not optional in either:
 *     the step will not continue without one;
 *   · the review dialog, when that step is edited before submitting;
 *   · the payments page's Update — "old card should be removed and the new
 *     card should pass the same flow as when adding a card for the first
 *     time", which is why replacing needs no special case here: this person
 *     has one card, and after this call it is the new one.
 */
export const applyCard = (
  token: { brand: string; last4: string; expiry: string },
  owner: RepaymentCard["owner"] = "borrower"
) => {
  given[owner] = {
    id: `rc-${Date.now()}`,
    brand: token.brand,
    last4: token.last4,
    expiry: token.expiry,
    active: true,
    owner,
  };
  cardsVersion += 1;

  listeners.forEach((listener) => listener());
};

/**
 * PAYING CHANGES THE PAGE. WBS story 5: "make a scheduled payment"; story 4:
 * the history shows "all completed... transactions". The prototype used to
 * take the money, show a receipt and leave the row saying "Pay now", which is
 * the one thing a payment page must never do.
 *
 * Everything here is arithmetic on the mock: the instalment is marked paid,
 * the balance and the payoff come down by what was taken, and a completed
 * transaction goes on the front of the history. Late fees are NOT waived —
 * the WBS charges them against the instalment, and paying it does not unsay
 * that.
 */
export const applyPayment = (installment: Installment | undefined, amount: string) => {
  const base = getPayments();
  if (!base) return;

  const target =
    installment ?? base.schedule.find((row) => row.status !== "paid");
  const taken = toAmount(amount);

  const schedule = base.schedule.map((row) =>
    target && row.id === target.id ? { ...row, status: "paid" as const } : row
  );

  const outstanding = Math.max(0, toAmount(base.balance.outstanding) - taken);
  const payoff = Math.max(0, toAmount(base.balance.payoff) - taken);
  const settled = schedule.every((row) => row.status === "paid");

  paid = {
    ...base,
    schedule,
    balance: {
      ...base.balance,
      outstanding: formatAmount(outstanding),
      payoff: formatAmount(payoff),
      /* Paying what is due puts the account back in good standing — the
         delinquency stages are about what is UNPAID. */
      stage: schedule.some((row) => row.status === "overdue")
        ? base.balance.stage
        : "current",
      pastDue: schedule.some((row) => row.status === "overdue")
        ? base.balance.pastDue
        : undefined,
      daysPastDue: undefined,
    },
    history: [
      {
        id: `t-${Date.now()}`,
        on: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
        amount,
        status: "succeeded" as const,
        cardLast4: base.cards.find((card) => card.active)?.last4 ?? "0000",
        paidBy: "borrower" as const,
        reference: `RP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        installmentId: target?.id,
      },
      ...base.history,
    ],
  };

  /* The loan page reads its own schedule; it has to see the same payment. */
  const baseLoan = getLoan();
  if (baseLoan?.loan) {
    const upcoming = schedule.find((row) => row.status !== "paid");
    loanPaid = {
      ...baseLoan,
      loan: {
        ...baseLoan.loan,
        schedule,
        nextPayment: upcoming?.amount ?? formatAmount(0),
        nextPaymentOn: upcoming?.due ?? baseLoan.loan.nextPaymentOn,
      },
    };
  }

  listeners.forEach((listener) => listener());

  /* The last instalment closes the loan, and that is the borrower's own doing
     — so the prototype moves on by itself, the same as signing does. */
  if (settled) setStage("paidOff");
};

/** Which stage the prototype is showing. For the DevBar's switch. */
export const useBorrowerStage = () => useSyncExternalStore(subscribe, getStage);

/** The application and its loan, as /loan and /application read them. */
export const useLoanRecord = () => useSyncExternalStore(subscribe, getLoan);

/** The repayment record, as /payments reads it. */
export const usePaymentsRecord = () => useSyncExternalStore(subscribe, getPayments);

/**
 * Which of ApplicationGate's states the /application page is in, read off the
 * same record.
 *
 * Derived rather than stored: the gate is a VIEW of where the application has
 * got to, and two places holding that separately is how a prototype ends up
 * offering "start an application" to somebody who already has one. The states
 * this cannot produce — notEligible, checkPaused, stopped — are decided by
 * checks that do not exist in a prototype, and their own stories still cover
 * them.
 */
/**
 * IS THERE AN APPLICATION IN PLAY?
 *
 * One question, asked by three pages, and it is not the same as "is there a
 * record". A cancelled loan leaves a record behind — it is history, not
 * something anyone is waiting on — so /loan draws the empty page for it and
 * /application offers a new one. /payments was asking the simpler question
 * and so, after a cancellation, told the reader their "repayment schedule is
 * created when the loan is paid out" and pointed them at a loan page that had
 * just said there was no loan. Two pages, two stories, one cancelled loan.
 */
export const hasOpenApplication = (record: ApplicationSummary | undefined) =>
  record !== undefined && record.loan?.stage !== "cancelled";

/**
 * EVERY INSTALMENT PAID, on a loan that was funded.
 *
 * Derived rather than stored: there is no "repaid" LoanStage, because the WBS
 * has no story that sets one — it defines the four stages that end at
 * `funded` and `cancelled` and says nothing about what a loan becomes when it
 * is settled. What the product does have is the schedule, and a schedule with
 * nothing left on it is the same fact by another route.
 */
export const isRepaid = (record: ApplicationSummary | undefined) =>
  record?.loan?.stage === "funded" &&
  record.loan.schedule !== undefined &&
  record.loan.schedule.length > 0 &&
  record.loan.schedule.every((row) => row.status === "paid");

/**
 * THE SAME QUESTION FROM THE CO-BORROWER'S SIDE, answered in one place.
 *
 * It was answered in two, and they had already drifted: `/application`
 * checked `coBorrowerFailed` and `/co-application` did not, so a declined
 * co-borrower opening the second one was handed the invitation screen again
 * with the inviter's name blank. That is what a second copy of a rule buys.
 *
 * BOTH COPIES ALSO STOPPED AT `assignedDone`, whose words are "OPA is
 * reviewing the application now" — so an approved application, a declined
 * one and a loan repaid in full all told the co-borrower it was still under
 * review. The WBS's "View application status and details" carries
 * Borrower/Co-borrower in its role column and owes them "Submitted, Under
 * Review, Pending action, Approved, declined"; two of those five had nowhere
 * to appear.
 *
 * The order matters and is not the borrower's. Settled and closed come
 * first, because they are true no matter what the status field still says.
 */
export const coBorrowerGateFor = (record: ApplicationSummary | undefined) => {
  /*
    NO RECORD MEANS NOT A CO-BORROWER ANY MORE, so this is `open` — the same
    "start an application" any signed-in person with nothing sees.
    *"დანს რომ დააწვება, უბრალოდ აღარ არის ქო-ბოროვერი, და როგორც ბოროვერს
    უჩანს, ისე გამოჩნდება."*

    Being a co-borrower is a relationship to one application. When that
    application ends and they acknowledge it, the relationship ends with it
    and what is left is a person with no application.

    This does not put "start a loan application" back at the top of their
    walk: `CO_BORROWER_STAGES` has no `none` in it, so the demo never opens
    there. It is reached by pressing the button on a closed application,
    which is the only way a real one would reach it either.
  */
  if (!record) return "open" as const;
  if (isRepaid(record)) return "assignedSettled" as const;
  /* Declined and cancelled share a state: what the co-borrower does about
     either is the same — nothing — and one sentence can be true of both
     without the page guessing which it was. */
  if (record.status === "declined" || record.loan?.stage === "cancelled")
    return "assignedClosed" as const;
  /* Before the plain co-borrower check, same as the borrower's: story 14's
     reset leaves the status at `coBorrower` with no invitation on it. */
  if (record.coBorrowerFailed) return "invitationClosed" as const;
  if (record.status === "coBorrower") return "invited" as const;
  if (record.status === "pendingAction") return "needsInfo" as const;
  /* A loan exists, or the decision is in: either way it is past review. */
  if (record.status === "approved" || record.loan) return "assignedActive" as const;
  return "assignedDone" as const;
};

export const gateFor = (record: ApplicationSummary | undefined) => {
  if (!record) return "open" as const;
  /* SETTLED, AND THE FILE CAN BE CLOSED. Before `hasActive`, which is what
     this would otherwise be: a repaid loan still counts as an open one to
     the WBS's own check ("an open application OR LOAN"), and that is exactly
     the state this page now offers a way out of. See `repaid` on
     ApplicationGateState. */
  if (isRepaid(record)) return "repaid" as const;
  /* A cancelled loan closes the application with it — the record is history,
     not something to resume, so the page offers a new one. */
  if (record.loan?.stage === "cancelled") return "open" as const;
  if (record.status === "pendingAction") return "needsInfo" as const;
  /* BEFORE the plain co-borrower check, because it is the same status with a
     different thing to say. WBS story 14: a reset application is waiting on a
     co-borrower again, but the borrower is owed the reason — and the action is
     "invite a DIFFERENT one", not "invite one". */
  if (record.coBorrowerFailed) return "coBorrowerFailed" as const;
  if (record.status === "coBorrower") return "coBorrowerNeeded" as const;
  /* DECLINED SAYS SO. It returned `open`, which offered a new application
     without ever telling them the last one had been turned down — the page
     that should break the news behaved as though nothing had happened.
     Nothing in the WBS stops them applying again, so the way out is still
     there; it is the sentence that was missing. */
  if (record.status === "declined") return "declined" as const;
  /* AND APPROVED SAYS SO. Everything past the decision used to fall to
     `hasActive`, whose words are "OPA is reviewing your application now" —
     said to somebody whose loan was already approved and being set up. */
  if (record.status === "approved" || record.loan) return "approved" as const;
  /*
    What is left is an application still being read. The WBS blocks a second
    one for two reasons at once — "verify that the applicant does not have an
    open application OR LOAN" — and that rule is stated in this state's own
    sentence rather than in a state of its own.
  */
  return "hasActive" as const;
};
