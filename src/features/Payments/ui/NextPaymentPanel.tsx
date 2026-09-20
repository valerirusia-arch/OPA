// src/features/Payments/ui/NextPaymentPanel.tsx
//
// THE ONE THING TO DO ON THIS PAGE, given its own panel.
//
// It was three facts scattered across the balance card: the date in a caption
// under the figure ("Next on Jan 01, 2027"), the amount nowhere on the card at
// all — only in row 4 of the table below — and the button pinned to the card's
// top-right corner, as far from both as the card is wide. A borrower reading
// "what do I owe, and what do I do about it" was made to travel three corners
// of a 1650px card and then look in a table for the amount.
//
// So the answer and the action separate. The balance card states the account —
// what is still owed, how far through, the small print about it. This panel
// states the NEXT transaction: what, when, and the button that starts it, in
// that order, in one column.
//
// It repeats the loan page's arrangement on purpose. /loan already says "NEXT
// PAYMENT / $120.65 / Due Jan 01, 2027"; saying it differently on the page
// that is actually about repayment would be two descriptions of one fact.
//
// `figure` AND NOT `figureLg`: a page gets one of those and on /payments it is
// the outstanding balance. This number is the next one among numbers — see
// figures.styles.
//
// WBS stories 2 (what is due and when) and 5 (make a payment). The amount and
// the date are the schedule's own; nothing here computes either.
//
// Dumb: an installment in, a press out.

import { Button, Card, Flex, Typography, theme } from "antd";
import { useT } from "../../../shared/ui/i18n/useT";
import { StatusPill } from "../../../shared/ui/StatusPill";
import { getStyles, styles } from "./NextPaymentPanel.styles";
import type { Installment } from "./types";

export type NextPaymentPanelProps = {
  /** The earliest unpaid line of the schedule, picked by the page. */
  installment: Installment;
  /** Withheld once there is nothing payable — the panel then has no button. */
  onPay?: () => void;
};

export function NextPaymentPanel({ installment, onPay }: NextPaymentPanelProps) {
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);

  return (
    /* Stretches to the balance card beside it and pins the button to its foot,
       so the two panels share a bottom edge whichever is taller. */
    <Card style={styles.card} styles={{ body: styles.body }}>
      <Flex vertical justify="space-between" gap={24} style={styles.fill}>
        <Flex vertical>
          {/* The state, on the label's line and not over the number — the same
              arrangement the balance card uses for its own. Only ever drawn
              when the line is late; a "Scheduled" pill on a scheduled payment
              is a word for the ordinary case. */}
          <Flex align="baseline" gap={10} wrap style={styles.labelRow}>
            <Typography.Text style={s.label}>{t("loanPage.nextPayment")}</Typography.Text>
            {installment.status === "overdue" ? (
              <StatusPill bare color="error">
                {t("schedule.overdue")}
              </StatusPill>
            ) : null}
          </Flex>

          <Typography.Text style={s.figure}>{installment.amount}</Typography.Text>

          <Typography.Text type="secondary" style={styles.due}>
            {t("loanPage.dueOn", { due: installment.due })}
          </Typography.Text>
        </Flex>

        {/* WBS story 5 starts here and story 6 starts here too — which amount
            it is for is the dialog's question, not this panel's. */}
        {onPay ? (
          <Button type="primary" size="large" block onClick={onPay}>
            {t("payments.makePayment")}
          </Button>
        ) : null}
      </Flex>
    </Card>
  );
}

export default NextPaymentPanel;
