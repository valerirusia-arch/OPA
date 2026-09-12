// src/features/Payments/ui/delinquency.ts
//
// What an account past its due date is told, per WBS story 9.
//
// Its own module rather than a constant beside the component that first used
// it: the payments page raises this notice over the outstanding balance and
// the dashboard raises the same notice over the same figure, and two copies of
// one rule are two wordings the moment either is edited. (A component file may
// not export constants either — fast refresh needs one kind of export.)

import type { TranslationKey } from "../../../shared/ui/i18n/dictionary";
import type { DelinquencyStage } from "./types";

/**
 * WBS story 9's three consequences, and the quiet fourth state.
 *
 * `title` and `body` are the NOTICE — the lender's full wording, for wherever
 * the rule itself has to be read. `state` is the same fact as a STATE: three
 * or four words a pill can carry beside the balance it describes. A summary
 * screen shows the state; the page that acts on the debt shows the rule.
 */
export const stageCopy: Record<
  DelinquencyStage,
  | {
      title: TranslationKey;
      body: TranslationKey;
      state: TranslationKey;
      type: "warning" | "error";
    }
  | undefined
> = {
  current: undefined,
  overdue: {
    title: "payments.overdueTitle",
    body: "payments.overdueBody",
    state: "payments.stateOverdue",
    type: "warning",
  },
  default: {
    title: "payments.defaultTitle",
    body: "payments.defaultBody",
    state: "payments.stateDefault",
    type: "error",
  },
  accelerated: {
    title: "payments.acceleratedTitle",
    body: "payments.acceleratedBody",
    state: "payments.stateAccelerated",
    type: "error",
  },
};

