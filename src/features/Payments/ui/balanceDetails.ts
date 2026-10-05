// src/features/Payments/ui/balanceDetails.ts
//
// Its own file because two components draw this list and a component file may
// only export components — the fast-refresh rule, and it is right: a shared
// list is not a component.
//
// AND IT HOLDS NO MARKUP. The icon each fact wears belongs to the panel that
// draws it, keyed off `key` — see BalanceFacts. Data says WHAT the fact is;
// how it looks is the component's business, and keeping JSX out of here keeps
// this a `.ts` file.

import type { Translate } from "../../../shared/ui/i18n/useT";
import type { Balance } from "./types";

/**
 * THE SMALL PRINT, AND THE ONE FIGURE THAT IS NOT SMALL PRINT.
 *
 * Past due leads because it is the only one of the four that is a problem;
 * it takes the error ink for the same reason. The other three are the WBS's
 * own entitlements — story 10's applied fees, story 6's payoff and maturity.
 *
 * SETTLED IS A DIFFERENT THREE FACTS, not the same three at zero. "Pay off
 * today $0.00" is an offer to do something that cannot be done, and a final
 * payment due next September bills a closed loan — both were TRUE of the
 * record and false as statements. *"ინფოც შესაბამისი იქნება."*
 *
 * Exported because two components draw these now: this card where it stands
 * alone, and `BalanceFacts` where /payments sets them beside it. One list,
 * so the two can never say different things about one loan.
 */
export type BalanceDetail = {
  key: string;
  label: string;
  value: string;
  alarm: boolean;
};

export function balanceDetails(
  t: Translate,
  opts: {
    balance: Balance;
    pastDue?: string;
    totalRepaid?: string;
    closedOn?: string;
    settled: boolean;
  },
): BalanceDetail[] {
  const { balance, pastDue, totalRepaid, closedOn, settled } = opts;
  if (settled) {
    return [
      {
        key: "fees",
        label: t("payments.feesApplied"),
        value: balance.fees,
        alarm: false,
      },
      {
        key: "repaid",
        label: t("payments.totalRepaid"),
        value: totalRepaid ?? balance.outstanding,
        alarm: false,
      },
      {
        key: "closed",
        label: t("payments.closedOn"),
        value: closedOn ?? balance.maturityOn,
        alarm: false,
      },
    ];
  }
  return [
    ...(pastDue
      ? [
          {
            key: "past",
            label: t("payments.pastDueLabel"),
            value: pastDue,
            alarm: true,
          },
        ]
      : []),
    {
      key: "fees",
      label: t("payments.feesApplied"),
      value: balance.fees,
      alarm: false,
    },
    {
      key: "payoff",
      label: t("payments.payoffToday"),
      value: balance.payoff,
      alarm: false,
    },
    {
      key: "maturity",
      label: t("payments.maturity"),
      value: balance.maturityOn,
      alarm: false,
    },
  ];
}
