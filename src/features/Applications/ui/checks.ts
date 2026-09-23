// src/features/Applications/ui/checks.ts
//
// The checks and their names. Separate from CheckTags so that file exports
// components only — the repo's fast-refresh rule, and a good one: a constant
// living next to a component is a constant that gets re-created on every edit.

import type { TranslationKey } from "../../../shared/ui/i18n/dictionary";
import type { CheckKey } from "./types";

/**
 * The order the WBS runs them in, which is the order they are shown.
 *
 * Identity before credit is a requirement, not a preference: "Identity
 * verification is performed before initiating a credit inquiry to minimize
 * external credit bureau costs."
 */
export const CHECK_KEYS: CheckKey[] = [
  "identity",
  "ofac",
  "noLend",
  "credit",
  "income",
  "rules",
];

/**
 * Who answers each check, named on the row.
 *
 * NOT this epic's own text — it comes from **Integrations**, which names the
 * providers one by one: "Integrate with Instant ID to Verify borrower identity
 * / LexisNexis" and "Integrate with Equifax to retrieve credit report". The
 * wireframe prints them under each check for the same reason the WBS lists
 * them: an underwriter reading "Pass" needs to know who said so, and an
 * "unavailable" is a named integration to chase rather than a mystery.
 *
 * OFAC has no provider of its own on purpose: "OFAC screening is performed as
 * part of the identity verification process through the LexisNexis InstantID
 * integration", so its source is the sanctions list it was matched against.
 *
 * The credit line carries the WBS's constraint rather than a vendor: "Internal
 * scoring, business rules and decision logic are NOT exposed to the borrower",
 * so a score on this page exists nowhere the applicant can reach it, and the
 * person reading it should know that.
 */
export const checkProviderKeys: Record<CheckKey, TranslationKey> = {
  identity: "check.viaInstantId",
  ofac: "check.viaSanctions",
  noLend: "check.viaNoLendList",
  credit: "check.viaEquifax",
  income: "check.viaOcr",
  rules: "check.viaRules",
};

export const checkLabelKeys: Record<CheckKey, TranslationKey> = {
  identity: "check.identity",
  ofac: "check.ofac",
  noLend: "check.noLend",
  credit: "check.credit",
  income: "check.income",
  rules: "check.rules",
};

/**
 * WHAT EACH CHECK LOOKED AT — the line under its name on the row.
 *
 * Every sentence is the WBS's own description of that story: InstantID for
 * identity, the OFAC list "performed as part of the identity verification
 * process", the no-lend story's "open application or loan … legacy no lend
 * list and … recent (6 months) denied application", and income's "the
 * objective is to verify the EXISTENCE of an income source rather than
 * calculate or validate income amount".
 *
 * This is not the provider column that was taken off these rows. That was a
 * vendor name in the evidence position, competing with the result and offering
 * the underwriter nothing to do; this says what the check DID, which is the
 * one thing "Passed" cannot tell them. The provider appears inside the
 * sentence where the WBS names it, as part of what happened.
 *
 * The credit score and the eligibility outcome are not here: neither is drawn
 * as a row — one is the gauge, the other the conclusion panel.
 */
export const checkAboutKeys: Partial<Record<CheckKey, TranslationKey>> = {
  identity: "check.whatIdentity",
  ofac: "check.whatOfac",
  noLend: "check.whatNoLend",
  income: "check.whatIncome",
};

/**
 * IS THIS APPLICATION STILL WAITING FOR A PERSON?
 *
 * The underwriting queue's own story is "Route application for manual review —
 * the system shall route applications REQUIRING MANUAL REVIEW to the
 * underwriting queue", so an application the rules already settled does not
 * belong in it. It was listing every application, which put two automatically
 * decided ones in the queue with an empty Source column — the one column that
 * exists to name which step routed a row, showing a dash because nothing did.
 *
 * Those two are still reachable, and still overridable: the back-office
 * dashboard's "Recent applications" lists every application with its status
 * and links straight through, which is where "Override automated decision"
 * starts from.
 */
export const awaitsReview = (application: {
  decision?: { source?: string };
}) =>
  // Needs an underwriter's attention: either the system could not decide it
  // (no decision → Approve/Decline), OR the system decided it AUTOMATICALLY and
  // a human has not confirmed it yet (→ Override). A decision a person already
  // made (manual/override) is final and leaves the queue.
  application.decision === undefined ||
  application.decision.source === "automated";
