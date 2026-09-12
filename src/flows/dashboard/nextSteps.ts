// src/flows/dashboard/nextSteps.ts
//
// The WBS's own deadlines, applied to this borrower.
//
// Every line below is a rule from the WBS, not a forecast and not advice:
//
//   "Loan repayment begins within 45 days after the loan is approved, with
//    payments due on the 1st of each month."
//   "A co-borrower invitation expires 5 calendar days after it is sent."
//   "If a monthly payment is not received within 15 calendar days after the
//    due date, a late fee will be charged on the 16th day… $5.00 or 5% of the
//    unpaid installment amount, whichever is less. Only one late fee will be
//    charged for each missed payment."
//   "If an account is more than 90 days past due, it will be considered in
//    default… the full past due balance must be paid within 30 days to avoid
//    loan acceleration."
//   "If an account is more than 120 days past due, the loan will be
//    accelerated… within 30 days of receiving a notice of default."
//   "Applications requiring a co-borrower cannot proceed to underwriting until
//    a qualified co-borrower has accepted the invitation and completed all
//    required application steps."
//   "Loan documents become available for signature only after the application
//    has been approved" and are signed "before loan funding".
//
// WHAT IS NOT HERE: a decision date. The WBS gives underwriting no SLA, so the
// review step carries no date rather than a guessed one — `when: undefined`
// renders as a dash, which is the honest answer and visibly different from a
// date somebody could plan around.
//
// Dates come from the record the rest of the product reads, so a step cannot
// name a day the loan page disagrees with.

import type { NextStep } from "../../features/Dashboard/ui/NextSteps";
import type { ApplicationSummary } from "../../features/Loan/ui/types";
import type { PaymentsRecord } from "../../features/Payments/ui/types";
import type { TranslationKey } from "../../shared/ui/i18n/dictionary";

type T = (key: TranslationKey, values?: Record<string, string>) => string;

export const buildNextSteps = (
  t: T,
  record: ApplicationSummary | undefined,
  payments: PaymentsRecord | undefined,
  role: "borrower" | "coBorrower"
): NextStep[] => {
  /* Nothing applied for: the only thing ahead is the application itself, and
     the page's own call to action already says so. */
  if (!record) return [];

  const loan = record.loan;
  const steps: NextStep[] = [];

  /* WAITING ON A CO-BORROWER. The invitation's expiry is the live deadline
     and it belongs to whoever can act on it — the borrower replaces a lapsed
     one, the invited person answers it. */
  if (record.status === "coBorrower" && record.invitation) {
    steps.push({
      key: "invitation",
      title: t(
        role === "borrower" ? "dashboard.stepInvitation" : "dashboard.stepYourPart"
      ),
      body: t(
        role === "borrower" ? "dashboard.stepInvitationBody" : "dashboard.stepYourPartBody"
      ),
      when: record.invitation.expiresOn,
      owner: role === "borrower" ? "opa" : "you",
      urgent: true,
    });
  }

  /* An underwriter asked for something. Theirs to send, and nothing moves
     until it arrives. */
  if (record.status === "pendingAction") {
    steps.push({
      key: "more-info",
      title: t("dashboard.stepMoreInfo"),
      body: t("dashboard.stepMoreInfoBody"),
      owner: "you",
      urgent: true,
    });
  }

  /* DECLINED IS AN OUTCOME, NOT A QUEUE. Nothing is ahead of it, so the
     panel says so rather than listing a decision that has already been
     taken. */
  if (record.status === "declined") return [];

  /* Under review. No date: the WBS sets underwriting no deadline. */
  if (record.status === "review" || record.status === "submitted") {
    steps.push({
      key: "decision",
      title: t("dashboard.stepDecision"),
      body: t("dashboard.stepDecisionBody"),
      owner: "opa",
    });
  }

  if (loan?.stage === "awaitingSignature") {
    steps.push({
      key: "sign",
      title: t("dashboard.stepSign"),
      body: t(
        record.coBorrower ? "dashboard.stepSignBodyBoth" : "dashboard.stepSignBody"
      ),
      owner: "you",
    });
    steps.push({
      key: "funding",
      title: t("dashboard.stepFunding"),
      body: t("dashboard.stepFundingBody"),
      owner: "opa",
    });
  }

  if (loan?.stage === "funding") {
    steps.push({
      key: "funding",
      title: t("dashboard.stepFunding"),
      body: t("dashboard.stepFundingBody"),
      owner: "opa",
    });
  }

  /* Repayment. The next instalment, then the rule that applies if it is
     missed — stated before it is missed, which is the only time it is any use
     to the reader. */
  const next = payments?.schedule.find((row) => row.status !== "paid");
  /* ONCE ACCELERATED THERE IS NO INSTALMENT. The whole balance is due, so
     asking for $120.65 and for $1,105.85 in the same list is two
     contradictory demands. */
  if (loan && next && payments?.balance.stage !== "accelerated") {
    steps.push({
      key: "next-payment",
      title: t("dashboard.stepPayment", { amount: next.amount }),
      /* THE READER'S OWN CARD, never the other party's. Both mock cards are
         active, so an unfiltered `find` handed the co-borrower the borrower's
         digits — the one thing the WBS forbids outright: "They cannot see
         each others card information." The payments screen filters by owner
         for the same reason. */
      body: t("dashboard.stepPaymentBody", {
        card:
          payments?.cards.find((card) => card.owner === role && card.active)?.last4 ?? "",
      }),
      when: next.due,
      owner: "you",
      urgent: next.status === "overdue",
    });

    /* THE FEE IS A WARNING, NOT A HISTORY ENTRY. It belongs here only while
       it has not been charged yet: by default and acceleration the schedule
       already carries three of them, and listing it under "what happens
       next" tells somebody three fees deep that one is coming. */
    if (next.status === "overdue" && payments?.balance.stage === "overdue") {
      steps.push({
        key: "late-fee",
        title: t("dashboard.stepLateFee"),
        body: t("dashboard.stepLateFeeBody"),
        owner: "opa",
      });
    }
  }

  /* The delinquency ladder, one rung at a time: only the rung after the one
     the account is on. Printing all three at once reads as a threat rather
     than as a deadline. */
  const stage = payments?.balance.stage;
  if (stage === "default") {
    steps.push({
      key: "acceleration",
      title: t("dashboard.stepAcceleration"),
      body: t("dashboard.stepAccelerationBody", {
        amount: payments?.balance.pastDue ?? "",
      }),
      owner: "opa",
      urgent: true,
    });
  }
  if (stage === "accelerated") {
    steps.push({
      key: "accelerated",
      title: t("dashboard.stepAccelerated"),
      body: t("dashboard.stepAcceleratedBody", {
        amount: payments?.balance.outstanding ?? "",
      }),
      owner: "you",
      urgent: true,
    });
  }

  /* The end of it, once there is a schedule to end — and only while there is
     something left on it. Twelve of twelve paid and the last instalment is
     behind them, not ahead. */
  const settled = payments !== undefined && next === undefined;
  if (loan && payments && stage !== "accelerated" && !settled) {
    steps.push({
      key: "final",
      title: t("dashboard.stepFinal"),
      body: t("dashboard.stepFinalBody"),
      when: payments.balance.maturityOn,
      owner: "you",
    });
  }

  return steps;
};
