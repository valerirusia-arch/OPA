// src/features/Loan/ui/stages.ts
//
// What each loan stage is called. A map rather than a key built by string
// concatenation: a computed key needs an `as never` to compile, and that cast
// is exactly what stops the compiler telling you the string does not exist.

import type { TranslationKey } from "../../../shared/ui/i18n/dictionary";
import type { LoanStage } from "./types";

export const stageLabelKeys: Record<LoanStage, TranslationKey> = {
  awaitingSignature: "loanPage.stageAwaitingSignature",
  funding: "loanPage.stageFunding",
  funded: "loanPage.stageFunded",
  cancelled: "loanPage.stageCancelled",
};
