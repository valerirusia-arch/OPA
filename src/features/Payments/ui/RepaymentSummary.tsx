// src/features/Payments/ui/RepaymentSummary.tsx
//
// THE PAGE'S LEAD: one figure, and the facts about it on a tray beneath.
//
// What it replaces, and why. /payments opened on a white card the full width
// of the viewport with the outstanding figure in its top-left corner, a button
// pinned top-right and three small facts along the bottom — three corners for
// one block, ~700px of nothing between them at 1440, and nothing on the page
// that said how far through the loan the borrower was. Splitting it in two
// only moved the void into the second card.
//
// The arrangement here is the one the designer sent as the reference: a
// headline figure with its caption, and under it a RECESSED TRAY holding the
// supporting facts as small raised boxes. The tray is what makes the hierarchy
// legible — four label-over-value pairs laid flat on the card read as four
// more headlines competing with the one above them; the same four sunk into a
// grey strip read as what they are, the detail of the figure.
//
// WHICH FACTS, and why those. Every one is a WBS entitlement, not a pick:
//
//   Next payment      story 2 — what is due and when.
//   Paid so far       story 2, counted. The page never said where in the
//                     schedule the borrower stood; the dashboard's copy of
//                     the balance has drawn it since Epic 6.
//   Pay off today     story 6 — "repay the outstanding balance BEFORE the
//                     scheduled maturity date" needs the payoff findable
//                     outside the pay dialog.
//   Fees applied      story 10 — "review applied late fees".
//   Past due          story 10's "overdue payment information". First in the
//                     row and the only one in the error ink, because it is
//                     the only one of the five that is a problem. It is not
//                     drawn at all on a healthy account.
//
// The maturity date is the caption's second sentence rather than a sixth box:
// it is the one fact here that is a boundary and not a balance.
//
// THE ACTION IS NOT ON THIS PANEL. It is in the page's title row, where the
// reference puts it and where it cannot open a hole in a card by being pinned
// to a corner.
//
// Dumb: a balance, a next line and two counts in; nothing out.

import { Card, Flex, Typography, theme } from "antd";
import { CreditCardOutlined } from "@ant-design/icons";
import { useT } from "../../../shared/ui/i18n/useT";
import { leadPanelBody } from "../../../shared/ui/panel.styles";
import { getStyles, styles } from "./RepaymentSummary.styles";
import type { Balance, Installment } from "./types";

export type RepaymentSummaryProps = {
  balance: Balance;
  /** The earliest unpaid line of the schedule, picked by the page. */
  next?: Installment;
  /** Counts, not money — twelve equal instalments, so the count IS the share. */
  progress: { paid: number; total: number };
};

/*
  NO STATE PILL ON THIS PANEL, unlike the dashboard's copy of the balance.

  There the card stands alone and the state has nowhere else to be. Here the
  page's own notice sits directly above it, in the WBS's own words — "in
  default, 96 days past due... the full past due balance of $376.95 must be
  paid within 30 days" — and a pill repeating "In default · 96 days" 40px
  under it is a heading saying what the paragraph above it said.
*/

export function RepaymentSummary({ balance, next, progress }: RepaymentSummaryProps) {
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);

  /* NOTHING ABOUT WHAT IS STILL OWED, ONCE NOTHING IS. A settled loan printed
     "Pay off today $0.00" and a final payment due next September under
     "$0.00" — a closed account billing the borrower for September. With no
     next line there is no tray and no caption. */
  const open = next !== undefined;

  const facts = [
    ...(balance.pastDue
      ? [{ key: "past", label: t("payments.pastDueLabel"), value: balance.pastDue, alarm: true }]
      : []),
    ...(next
      ? [
          {
            key: "next",
            label: t("loanPage.nextPayment"),
            value: next.amount,
            hint: t("loanPage.dueOn", { due: next.due }),
            alarm: false,
          },
        ]
      : []),
    {
      key: "progress",
      label: t("payments.paidSoFar"),
      value: t("loanPage.paymentsMadeValue", {
        paid: String(progress.paid),
        count: String(progress.total),
      }),
      alarm: false,
    },
    { key: "fees", label: t("payments.feesApplied"), value: balance.fees, alarm: false },
    { key: "payoff", label: t("payments.payoffToday"), value: balance.payoff, alarm: false },
  ];

  return (
    <Card
      style={styles.card}
      styles={{ body: { ...leadPanelBody, ...styles.fillBody } }}
    >
      <Flex vertical justify="space-between" style={styles.body}>
        <Flex vertical>
          {/* The label and the glyph that marks the panel — one line, the chip
              at the far edge, the way the reference marks what a card is
              about. */}
          <Flex align="flex-start" justify="space-between" gap={16} style={styles.head}>
            <Typography.Text style={s.label}>{t("payments.outstanding")}</Typography.Text>
            <Flex align="center" justify="center" style={s.chip} aria-hidden>
              <CreditCardOutlined />
            </Flex>
          </Flex>

          <Typography.Text style={s.figure}>{balance.outstanding}</Typography.Text>

          {open ? (
            <Typography.Text type="secondary" style={styles.caption}>
              {t("payments.outstandingCaption", { due: balance.maturityOn })}
            </Typography.Text>
          ) : null}
        </Flex>

        {open ? (
          <div style={styles.tray}>
            <div style={{ ...s.tray, ...styles.facts }}>
              {facts.map((fact) => (
                <div key={fact.key} style={{ ...styles.fact, ...s.factBox }}>
                  <Typography.Text style={s.label}>{fact.label}</Typography.Text>
                  <Typography.Text style={fact.alarm ? s.factValueAlarm : s.factValue}>
                    {fact.value}
                  </Typography.Text>
                  {fact.hint ? (
                    <Typography.Text style={s.factHint}>{fact.hint}</Typography.Text>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </Flex>
    </Card>
  );
}

export default RepaymentSummary;
