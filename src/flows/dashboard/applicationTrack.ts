// src/flows/dashboard/applicationTrack.ts
//
// THE FIVE STEPS, AND WHICH ONE THE READER IS STANDING ON.
//
// It replaces `currentStage.ts`, which described four: approved, signed,
// funded, repaid. Four was wrong at the front. A borrower whose application
// went in this morning opened a tracker whose first step was "Approved" — a
// road that starts one place further along than they are. The thing they have
// actually done, and the only date the record is certain to hold at that
// point, was missing from it.
//
//   Submitted   the application went in            record.submittedOn
//   Review      underwriting reaches a decision    loan.approvedOn
//   Signing     the package comes back executed    the document's own date
//   Funding     OPA pays USCIS and issues the card loan.fundedOn
//   Repayment   the schedule runs to its end       (no date; it has not
//                                                   happened to anyone yet)
//
// THE NAMES ARE STAGE NAMES, not outcomes, and that is what lets the panel
// below the rail carry the SAME STRING as the step it is describing —
// *"სახელი ზუსტად იდენტური უნდა იყოს: under review არა, პირდაპირ review."*
// "Review" rather than "Approved" also because the step ends two ways, and a
// rail that can only name the good one has to pretend a decline never
// reached it.
//
// NOTHING IS INVENTED. Every date is a field the record already carries, and
// a step still ahead of the reader is given none — a tracker that dates a
// future event is reporting it in the past tense. Every sentence is a WBS
// rule or a fact on the record.
//
// TWO FIELDS STILL WANT OPA'S CONFIRMATION, and they are flagged in
// features/Loan/ui/types.ts rather than only here: `fundedOn` the product
// already held, `approvedOn` is its pair and is genuinely new. A status
// tracker is not worth much if the system does not record when each status
// was reached.

import type { ApplicationSummary } from "../../features/Loan/ui/types";
import type { TrackStep } from "../../features/Dashboard/ui/StageTrack";
import type { TranslationKey } from "../../shared/ui/i18n/dictionary";

type T = (key: TranslationKey, values?: Record<string, string>) => string;

/**
 * FOUR STEPS, ENDING AT FUNDING, with Repayment named beside the rail.
 *
 * Four of the loan's events can be dated — `submittedOn`, `approvedOn`, the
 * document's own date, `fundedOn` — and they are the four capsules. Repayment
 * is not an event: it is a year-long STATE the balance card under this rail
 * already draws ("3 of 12 paid"), so it is a destination marker beside the
 * rail rather than a fifth capsule — the word stays in the picture a borrower
 * reads before signing, without claiming to be a stop on the way. The one
 * exception is a loan PAID OFF: then repayment has actually happened, is behind
 * the reader, and joins the drawer as a finished fifth step with its date.
 *
 * This replaced a comparison of drawings (five capsules, numbered discs, a
 * bare four-step rail) that ran on a dev switch; the losers were deleted once
 * the choice was made. Git history holds them.
 */
export type ApplicationTrack = {
  steps: TrackStep[];
  /** 0-based index of the live step. */
  current: number;
  /** The live step is an outcome nobody wanted. */
  failed: boolean;
  /** Where the road leads once the four steps are behind you. Drawn beside
   *  the rail, never on it. */
  goal?: string;
  /** The rail has nothing left to report: every step on it is behind the
   *  reader. It takes no owner pill — a finished journey is nobody's move. */
  complete: boolean;
  title: string;
  body: string;
  owner: "you" | "opa";
  action?: { label: string; to: string };
};

/* Named rather than numbered at the call sites: `current: 2` says nothing
   about which step that is, and the mapping is the part of this file most
   likely to be read by somebody checking it against the WBS. */
const REVIEWED = 1;
const SIGNED = 2;
const FUNDED = 3;
const REPAID = 4;

export const applicationTrack = (
  t: T,
  record: ApplicationSummary
): ApplicationTrack => {
  const loan = record.loan;
  const signedOn = record.documents.find(
    (document) => document.type === "loan_agreement" && document.executed
  )?.on;

  const where = (): Omit<ApplicationTrack, "steps" | "complete"> => {
    /* NO LOAN YET: the decision is the live step, and what it is waiting on
       is the only thing that changes between these four. */
    if (!loan) {
      if (record.status === "declined")
        return {
          current: REVIEWED,
          failed: true,
          title: t("dashboard.stageDeclined"),
          /* The record's own customer-facing note where there is one — it
             says which application and on what grounds, and the generic line
             says neither. WBS: internal scoring and rules never reach this
             side of the product, so whatever is on the record is already the
             whole of what the borrower may be told. */
          body: record.decisionNote ?? t("dashboard.stageDeclinedBody"),
          owner: "opa",
        };

      /* THE THREE REVIEWS SHARE A HEADING and differ in the sentence and in
         whose move it is. They are one step of the journey — the rail cannot
         and should not split "waiting on an underwriter" from "waiting on a
         co-borrower" into two capsules — so the panel under it does not
         either. What a reader needs to tell them apart is the pill and the
         line, and both say it plainly. */
      if (record.status === "pendingAction")
        return {
          current: REVIEWED,
          failed: false,
          title: t("dashboard.trackReviewed"),
          body: t("dashboard.stageReviewInfo"),
          owner: "you",
          /* This one really is theirs to move, and the thing to move is on
             /application. */
          action: { label: t("dashboard.stageOpenApplication"), to: "/application" },
        };

      if (record.status === "coBorrower")
        return {
          current: REVIEWED,
          failed: false,
          title: t("dashboard.trackReviewed"),
          body: t("dashboard.stageReviewCoBorrower"),
          owner: "you",
          action: { label: t("dashboard.stageOpenApplication"), to: "/application" },
        };

      return {
        current: REVIEWED,
        failed: false,
        title: t("dashboard.trackReviewed"),
        body: t("dashboard.stageReviewBody"),
        owner: "opa",
        /*
          TO /loan, NOT /application.

          It sent the reader to the form they had already finished — *"cta
          არასწორია ამ დროს, ლოანზე უნდა გადადიოდეს რომ ნახოს სტატუსი."*
          Nothing on /application changes while underwriting has it and there
          is nothing there to do; /loan is where the application's own status,
          its documents and its decision live. The two states above keep
          /application because in those the reader genuinely has to go back
          and add something.
        */
        action: { label: t("dashboard.stageSeeStatus"), to: "/loan" },
      };
    }

    /* Cancelled AFTER the card was issued and before it was spent — WBS
       story 9 allows it up to that moment and no further. So it fails at
       Funded, not earlier: the money did move. */
    if (loan.stage === "cancelled")
      return {
        current: FUNDED,
        failed: true,
        title: t("loanPage.stageCancelled"),
        body: t("dashboard.stageCancelledBody"),
        owner: "opa",
      };

    if (loan.stage === "awaitingSignature")
      return {
        current: SIGNED,
        failed: false,
        title: t("dashboard.trackSigned"),
        /* WBS story 2 signs the package before funding, and with a
           co-borrower it takes both signatures. */
        body: t(record.coBorrower ? "dashboard.stepSignBodyBoth" : "dashboard.stepSignBody"),
        owner: "you",
        action: { label: t("dashboard.stageOpenDocuments"), to: "/loan" },
      };

    if (loan.stage === "funding")
      return {
        current: FUNDED,
        failed: false,
        title: t("dashboard.trackFunded"),
        body: t("dashboard.stepFundingBody"),
        owner: "opa",
      };

    /* Funded. On the dashboard this band has already given way to the balance
       by the time it is true — a funded loan has a schedule, and the schedule
       is what the page leads with. It is written out anyway so the component
       is complete wherever else it is put. */
    return {
      current: REPAID,
      failed: false,
      title: t("dashboard.trackRepaid"),
      body: t("dashboard.stageFundedBody"),
      owner: "you",
      action: { label: t("dashboard.stageOpenPayments"), to: "/payments" },
    };
  };

  const found = where();

  /*
    FULLY REPAID: every instalment on the loan's own schedule is paid, so the
    outstanding balance is $0.00 and there is nothing left to pay. This is the
    one moment "complete" is literally true.

    Read from the record itself so the tracker cannot disagree with the
    schedule it draws. Funding ends the application and Repayment is a
    destination rather than a step, until it has actually happened: at that
    point Repayment becomes the fifth step, behind the reader, with the date of
    the final payment on it.
  */
  const repaid =
    !!loan &&
    loan.schedule.length > 0 &&
    loan.schedule.every((row) => row.status === "paid");

  /* Funding ended the application and repayment has not yet run its course:
     the rail has nothing left to report but the loan is not paid off. */
  const done = !repaid && found.current === REPAID && !found.failed;

  const state: Omit<ApplicationTrack, "steps"> = repaid
    ? {
        ...found,
        /* One past the fifth step's index, so Repayment reads done as well. */
        current: REPAID + 1,
        complete: true,
        title: t("dashboard.loanPaidOff"),
      }
    : done
      ? {
          ...found,
          complete: true,
          title: t("dashboard.applicationDone"),
          /* The sentence still points at what happens now, and what happens now
             is the schedule — so the way out stays pointed at /payments. */
        }
      : { ...found, complete: false };

  /* The destination beside the rail — but not while the journey has failed or
     is already complete: a declined application does not lead to repayment, and
     a paid-off one has arrived, so a marker pointing ahead would be wrong in
     both. */
  const goal =
    !state.failed && !state.complete ? t("dashboard.trackGoal") : undefined;

  /** A date only where the record holds one AND the step is behind the
   *  reader. Both halves matter: the mocks have carried a funding date on a
   *  loan that was still out for signature. */
  const dated = (index: number, date: string | undefined) =>
    index < state.current ? date : undefined;

  /** The past-tense line for a step, and ONLY once it is behind the reader.
   *  "Underwriting finished and OPA reached a decision" against a step that
   *  is still in underwriting is the tracker reporting a future event in the
   *  past tense — the same rule the dates follow. */
  const past = (index: number, key: TranslationKey) =>
    index < state.current ? t(key) : undefined;

  /** The date the loan was paid off — the last instalment's due date. Only
   *  ever read for the fifth step, and only when it is behind the reader. */
  const finalPaidOn =
    loan && loan.schedule.length > 0
      ? loan.schedule[loan.schedule.length - 1].due
      : undefined;

  const steps: TrackStep[] = [
    {
      key: "submitted",
      title: t("dashboard.trackSubmitted"),
      meta: record.submittedOn,
      note: past(0, "dashboard.pastSubmitted"),
    },
    {
      key: "reviewed",
      title: t("dashboard.trackReviewed"),
      meta: dated(REVIEWED, loan?.approvedOn),
      note: past(REVIEWED, "dashboard.pastReviewed"),
    },
    {
      key: "signed",
      title: t("dashboard.trackSigned"),
      meta: dated(SIGNED, signedOn),
      note: past(SIGNED, "dashboard.pastSigned"),
    },
    {
      key: "funded",
      title: t("dashboard.trackFunded"),
      meta: dated(FUNDED, loan?.fundedOn),
      note: past(FUNDED, "dashboard.pastFunded"),
    },
    /* THE FIFTH STEP appears ONLY once the loan is paid off, where it is a
       real event behind the reader carrying the date of the final payment.
       Everywhere in between Repayment is a destination, not a step, and the
       goal marker names it beside the rail instead. */
    ...(repaid
      ? [
          {
            key: "repaid",
            title: t("dashboard.trackRepaid"),
            meta: dated(REPAID, finalPaidOn),
            note: past(REPAID, "dashboard.pastRepaid"),
          },
        ]
      : []),
  ];

  return { steps, goal, ...state };
};
