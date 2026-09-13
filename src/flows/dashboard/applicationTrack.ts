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
//   Reviewed    underwriting reached a decision    loan.approvedOn
//   Signed      the package came back executed     the document's own date
//   Funded      OPA paid USCIS and issued the card loan.fundedOn
//   Repaid      the schedule is behind you         (no date; it has not
//                                                   happened to anyone yet)
//
// "Reviewed" rather than "Approved" because the step is the REVIEW ENDING,
// and it ends two ways. A rail that can only name the good outcome has to
// pretend a decline never reached it.
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

export type ApplicationTrack = {
  steps: TrackStep[];
  /** 0-based index of the live step. */
  current: number;
  /** The live step is an outcome nobody wanted. */
  failed: boolean;
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

  const where = (): Omit<ApplicationTrack, "steps"> => {
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

      if (record.status === "pendingAction")
        return {
          current: REVIEWED,
          failed: false,
          title: t("dashboard.stageNeedsInfo"),
          body: t("dashboard.stageReviewInfo"),
          owner: "you",
          action: { label: t("dashboard.stageOpenApplication"), to: "/application" },
        };

      if (record.status === "coBorrower")
        return {
          current: REVIEWED,
          failed: false,
          title: t("dashboard.stageCoBorrower"),
          body: t("dashboard.stageReviewCoBorrower"),
          owner: "you",
          action: { label: t("dashboard.stageOpenApplication"), to: "/application" },
        };

      return {
        current: REVIEWED,
        failed: false,
        title: t("dashboard.stageReview"),
        body: t("dashboard.stageReviewBody"),
        owner: "opa",
        action: { label: t("dashboard.stageOpenApplication"), to: "/application" },
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
        title: t("dashboard.stageSign"),
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
        title: t("dashboard.stageFunding"),
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
      title: t("loanPage.stageFunded"),
      body: t("dashboard.stageFundedBody"),
      owner: "you",
      action: { label: t("dashboard.stageOpenPayments"), to: "/payments" },
    };
  };

  const state = where();

  /** A date only where the record holds one AND the step is behind the
   *  reader. Both halves matter: the mocks have carried a funding date on a
   *  loan that was still out for signature. */
  const dated = (index: number, date: string | undefined) =>
    index < state.current ? date : undefined;

  const steps: TrackStep[] = [
    { key: "submitted", title: t("dashboard.trackSubmitted"), meta: record.submittedOn },
    { key: "reviewed", title: t("dashboard.trackReviewed"), meta: dated(REVIEWED, loan?.approvedOn) },
    { key: "signed", title: t("dashboard.trackSigned"), meta: dated(SIGNED, signedOn) },
    { key: "funded", title: t("dashboard.trackFunded"), meta: dated(FUNDED, loan?.fundedOn) },
    { key: "repaid", title: t("dashboard.trackRepaid") },
  ];

  return { steps, ...state };
};
