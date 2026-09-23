// src/features/Applications/ui/types.ts
//
// The presentation contract for Loan Decisioning, taken from the WBS's own
// vocabulary. Owned by the screens that render it; Dev adapts /models onto it.

import type { TranslationKey } from "../../../shared/ui/i18n/dictionary";
import type { LoanDocument } from "../../Loan/ui/types";

/**
 * The automated checks, in the order the WBS runs them.
 *
 * The order is a requirement, not a layout choice: "Identity verification is
 * performed BEFORE initiating a credit inquiry to minimize external credit
 * bureau costs", and "Credit report is requested only after successful
 * identity verification". A screen that listed them in any other order would
 * be describing a process OPA does not run.
 *
 * OFAC is not a step of its own in the pipeline — "OFAC screening is performed
 * as part of the identity verification process through the LexisNexis
 * InstantID integration" — but it is its own story with its own outcome, so it
 * is its own row.
 */
export type CheckKey = "identity" | "ofac" | "noLend" | "credit" | "income" | "rules";

/**
 * What a check came back with.
 *
 * `unavailable` is the WBS's technical failure, and it is deliberately not the
 * same as `failed`: "Technical failures during credit check shall NOT cause
 * the application to be rejected. The application shall be resumed after the
 * issue is resolved." One is an answer about the applicant; the other is an
 * answer about the integration, and an underwriter must never read the second
 * as the first.
 */
export type CheckOutcome = "pending" | "passed" | "review" | "failed" | "unavailable";

export type VerificationResult = {
  key: CheckKey;
  outcome: CheckOutcome;
  /**
   * The evidence, in the provider's words — a score, a reason, a match. WBS:
   * "Supporting evidence is available within the application."
   */
  detail?: string;
  /** When it ran. Blank while it has not. */
  ranOn?: string;
};

/**
 * Where a decision came from. WBS separates the three: the rules decide
 * automatically, an Underwriter decides manually, and an "authorized
 * Underwriter" may override a decision the rules already made.
 */
export type DecisionSource = "automated" | "manual" | "override";

export type Decision = {
  outcome: "approved" | "declined";
  source: DecisionSource;
  /**
   * WBS: mandatory on a decline and on an override, recorded on an approval
   * ("Approval reason and timestamp are recorded").
   */
  reason?: string;
  by: string;
  on: string;
};

/**
 * One entry in the audit trail.
 *
 * WBS, on changing the loan amount: "All changes shall be logged with the
 * previous value, updated value, user, date, and reason for the modification."
 * The same shape carries every other recorded action, because an audit trail
 * with two formats is one nobody can read.
 */
export type AuditEntry = {
  id: string;
  on: string;
  by: string;
  /**
   * A translation key, not free text.
   *
   * Typed so the compiler catches a key that does not exist. It was `string`
   * with an `as never` cast at the call site, which meant a typo in a mock or
   * in Dev's adapter would have rendered "audit.aproved" on screen with
   * nothing to stop it.
   */
  action: TranslationKey;
  from?: string;
  to?: string;
  reason?: string;
};

/** What the underwriter asked the borrower for, and what came back. */
export type InformationRequest = {
  id: string;
  askedOn: string;
  askedBy: string;
  /** WBS: "the underwriter should provide a text note with the required details". */
  note: string;
  answeredOn?: string;
  /** WBS: the borrower may "upload documents via the customer portal and add a text note". */
  answerNote?: string;
  answerFiles?: string[];
};

export type ApplicationPerson = {
  /**
   * Their borrower record's id, so the underwriting screen can send you to it.
   *
   * WBS puts editing on "Manage borrower accounts", which lives on a
   * borrower's own record — and a co-borrower has one, because the role is a
   * link between two records rather than a field inside one. This page is
   * evidence; the record is where a correction is made, and the two need a
   * door between them.
   */
  recordId?: string;
  name: string;
  email: string;
  phone: string;
  state: string;
  /** Each applicant is checked separately: WBS "Evaluate co-borrower eligibility". */
  checks: VerificationResult[];
};

export type ApplicationRecord = {
  id: string;
  /** WBS: Submitted, Under Review, Pending action, Approved, Declined. */
  status: "submitted" | "review" | "pendingAction" | "approved" | "declined";
  borrower: ApplicationPerson;
  /** Absent until one is invited and accepts. */
  coBorrower?: ApplicationPerson;
  /** WBS: "selected USCIS service". */
  uscisType: string;
  /** What the borrower asked for. */
  requestedAmount: number;
  /**
   * The declared annual income.
   *
   * The wireframe's queue has a column for it, and it earns one: WBS runs
   * "Verify borrower / co-borrower income" as its own check and "Determine
   * loan eligibility" weighs it, so an underwriter picking the next row wants
   * to see the figure the decision turns on before opening anything.
   */
  annualIncome: number;
  /**
   * What the underwriter approved, when it differs.
   *
   * WBS: "The Underwriter may reduce or adjust the requested loan amount
   * before the final approval decision." Kept beside the request rather than
   * overwriting it — the pair is the point.
   */
  approvedAmount?: number;
  submittedOn: string;
  /**
   * Which automated step sent it here.
   *
   * WBS: "Applications may be routed to manual review from any automated
   * verification step (Identity Verification, Income Verification, Credit
   * Check or Business Rule Evaluation)." An underwriter opening a queue needs
   * to know why a row is in front of them before they open it.
   */
  routedBy?: CheckKey;
  /** WBS: "The system should push the application to require a co-borrower". */
  coBorrowerRequired: boolean;
  /* WBS "View application details" names "submitted documents" among what the
     underwriter must be able to view, and viewing a pay stub means opening it,
     not reading its filename. Same shape as the borrower's own list so one
     component draws both. */
  documents: LoanDocument[];
  requests: InformationRequest[];
  decision?: Decision;
  audit: AuditEntry[];
};
