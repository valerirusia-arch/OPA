// src/features/Payments/ui/BalanceSummary.tsx
//
// What the borrower owes. WBS story 3 — "review the current outstanding loan
// balance" — drawn as the wireframe draws it: the label, the figure, one line
// naming the next payment, and the way to pay on the right.
//
// SIX FIGURES, THEN ONE, NOW THREE — and each change had a reason.
//
// It was six in a row (principal, fees, payoff, APR, maturity, next payment),
// which made the reader work out which number answers "how much do I owe".
// Stripping it to one fixed that. But in the two-up layout the card then held
// 80px of content in a 340px slot, and two of the figures are things the WBS
// says the borrower may see: story 10's "review APPLIED LATE FEES", and story
// 6's right to "repay the outstanding loan balance BEFORE THE SCHEDULED
// MATURITY DATE" — which needs both the payoff and the maturity date to be
// findable, not only inside the pay dialog.
//
// So: one figure at full size, and three quiet ones under a rule. The
// hierarchy is the point — the balance is the answer, the rest is detail
// about it. APR stays off this page; it belongs to the loan's terms.
//
// THE DELINQUENCY STATE IS BACK ON THIS CARD, and the NOTICE is not.
//
// The two were never the same thing. The notice is three sentences of policy
// — a late fee on the 16th day, default past 90 days, acceleration past 120 —
// and it went out to a page-wide banner because policy is not a property of
// one number. That was right about the policy and wrong about the STATE:
// "22 days overdue" is not a rule, it is the condition of the very money
// printed underneath it, and a yellow slab above the card was saying it about
// the page instead of about the balance. *"ეს ალერტები ესე არ მომწონს."*
//
// So the card takes back the two things that belong to the figure — a pill
// naming the state and the past-due amount as a named figure in the strip,
// which is also WBS story 10's "review applied late fees and OVERDUE PAYMENT
// INFORMATION" — and the rule stays where a reader can act on it: the dated
// steps on the dashboard, the schedule's own fee column on /payments.
//
// Dumb: it renders a balance and reports that the button was pressed.

import { Button, Col, Divider, Flex, Grid, Progress, Row, Typography, theme } from "antd";
import { StatusPill } from "../../../shared/ui/StatusPill";
import { useT } from "../../../shared/ui/i18n/useT";
import { getStyles, styles } from "./BalanceSummary.styles";
import type { Balance, Installment } from "./types";

export type BalanceSummaryProps = {
  balance: Balance;
  /**
   * The account's condition, on the label's line.
   *
   * Composed by the screen from `stageCopy`, because the wording is one rule
   * shared with /payments and this card does not own it.
   */
  status?: { label: string; tone: "warning" | "error" };
  /**
   * What is past due, when anything is. It joins the three figures under the
   * rule rather than arriving as its own banner.
   */
  pastDue?: string;
  /**
   * HOW FAR THROUGH THE SCHEDULE, as a bar under the balance.
   *
   * A balance on its own answers "how much" and says nothing about "how far",
   * and on a twelve-month loan the second is the question a borrower actually
   * lives with. The bar is the cheapest possible answer: one line, no legend,
   * and it sits directly under the figure it is about — the arrangement the
   * designer pointed at.
   *
   * Counts, not money: the schedule is twelve equal instalments, so the
   * count IS the proportion, and it needs no currency parsed to be true.
   */
  progress?: { paid: number; total: number };
  /** The next thing owed, taken from the schedule by the screen. */
  next?: Installment;
  /**
   * Fill the card and push the detail row to its foot.
   *
   * Only true where this card shares a row with another and has a height to
   * fill. Stacked, it sizes to its content.
   */
  fill?: boolean;
  onPay?: () => void;
};

export function BalanceSummary({
  balance,
  status,
  pastDue,
  progress,
  next,
  fill = false,
  onPay,
}: BalanceSummaryProps) {
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);
  const screens = Grid.useBreakpoint();

  /*
    THE TOP ROW IS TWO DIFFERENT ROWS, and the phone gets the other one.

    Side by side, the figure and the button share a centre line and the caption
    sits under both: the number is the answer, the button is the action on it,
    and the caption is a footnote to the number. That reads as structure.

    Below `md` there is no room for both on one line — the figure and the
    button together want ~330px in a ~295px body — so the row wrapped, which
    dropped the button BETWEEN the figure and the line describing it and broke
    the one link on the card that matters. Stacked, the figure keeps its
    caption and the button goes full width underneath, where a phone expects
    its primary action anyway.
  */
  const stacked = screens.md === false;

  /* Named so the two arrangements below differ only in arrangement. */
  const figure = <Typography.Text style={s.figure}>{balance.outstanding}</Typography.Text>;

  /*
    THE SMALL PRINT, AND THE ONE FIGURE THAT IS NOT SMALL PRINT.

    Past due leads because it is the only one of the four that is a problem;
    it takes the error ink for the same reason. The other three are the WBS's
    own entitlements — story 10's applied fees, story 6's payoff and maturity.
  */
  const details = [
    ...(pastDue
      ? [{ key: "past", label: t("payments.pastDueLabel"), value: pastDue, alarm: true }]
      : []),
    { key: "fees", label: t("payments.feesApplied"), value: balance.fees, alarm: false },
    { key: "payoff", label: t("payments.payoffToday"), value: balance.payoff, alarm: false },
    { key: "maturity", label: t("payments.maturity"), value: balance.maturityOn, alarm: false },
  ];
  const span = 24 / details.length;

  const caption = (
    <Typography.Text type="secondary" style={styles.next}>
      {next
        ? t("payments.nextPaymentLine", { amount: next.amount, due: next.due })
        : t("payments.nothingDue")}
    </Typography.Text>
  );

  /* Story 5 and story 6 start from the same button. Which amount it is for is
     the dialog's question, not this card's. */
  const action = (
    <Button
      type="primary"
      size="large"
      block={stacked}
      onClick={onPay}
      style={stacked ? undefined : styles.action}
    >
      {t("payments.makePayment")}
    </Button>
  );

  return (
    /* Fills its card and pushes the detail row to the base: the balance is the
       headline, the three figures at the foot are its footnote, and the space
       between them separates two groups rather than trailing off the end of
       one. */
    <Flex
      vertical
      justify={fill ? "space-between" : undefined}
      style={fill ? { ...styles.panel, ...styles.relative } : styles.relative}
    >
      {/* THE ACTION IS PINNED TO THE CORNER, not laid in the label's row.
          In the row it was the tallest thing in it — a 40px button beside an
          11px label — so the row became 40px and the figure was pushed a
          button's-worth down the card, away from the label that names it.
          The loan page's statement solved this the same way and the designer
          asked for the same here. On a phone it stays in the flow, under the
          figure, where a primary action belongs. */}
      {stacked ? null : <div style={styles.actionSlot}>{action}</div>}
      {/*
        The balance and the three figures under it are two groups, and the only
        thing separating them is space. There was a rule here; it was one line
        too many on a card that already has a head, a border and a colour
        change to do the same job.

        They are wrapped as one flex child so `space-between` puts all the
        card's spare height BELOW them rather than splitting it.
      */}
      <Flex vertical>
        {/*
          THE LABEL IS BACK, AND THE CARD'S HEAD IS GONE.

          It used to be the head's job — "Outstanding balance" in a title bar
          with a rule under it — which cost the card 57px of chrome to say one
          word and made this page's answer sit lower than the loan page's. The
          statement on /loan states what its figure is in the product's own
          11px label directly above it, and the designer asked for the same
          here. One pattern for "the one number a page exists to answer",
          wherever it is drawn.
        */}
        {/* THE ACTION SITS ON THE LABEL'S LINE, the same as the loan page's
            statement. Beside the figure it floated in the middle of the card;
            level with the label it reads as belonging to the block, and the
            figure gets the width under both. */}
        {/* THE STATE SITS ON THE LABEL'S LINE, level with the name of the
            figure it qualifies. Not over the card and not under the number:
            a reader takes "outstanding balance · 22 days overdue" as one
            statement, which is what it is. */}
        <Flex align="center" gap={10} wrap style={styles.labelRow}>
          <Typography.Text style={s.labelInline}>{t("payments.outstanding")}</Typography.Text>
          {status ? (
            <StatusPill color={status.tone === "error" ? "error" : "warning"}>
              {status.label}
            </StatusPill>
          ) : null}
        </Flex>

        {stacked ? (
          <Flex vertical gap={16}>
            <Flex vertical>
              {figure}
              {caption}
            </Flex>
            {action}
          </Flex>
        ) : (
          <Flex vertical>
            {figure}
            {caption}
          </Flex>
        )}
      </Flex>

      {/*
        THE BAR, BETWEEN THE ANSWER AND ITS SMALL PRINT.

        Above the rule because it belongs to the balance — it is the same
        number seen from the other end — and below the caption because the
        caption is about the NEXT payment and the bar is about all of them.
        No percentage printed inside it: antd would put the figure at the end
        of the line where it reads as a label for the empty part, so it goes
        under the bar at the start, against the filled end, which is what it
        describes.
      */}
      {progress && progress.total > 0 ? (
        <Flex vertical gap={6} style={styles.progress}>
          <Progress
            percent={Math.round((progress.paid / progress.total) * 100)}
            showInfo={false}
            strokeColor={token.colorSuccess}
            trailColor={token.colorFillSecondary}
            size={["100%", 8]}
          />
          <Typography.Text style={s.progressLabel}>
            {t("payments.progressLine", {
              percent: String(Math.round((progress.paid / progress.total) * 100)),
            })}
          </Typography.Text>
        </Flex>
      ) : null}

      {/* At label size: detail about the figure above, not three more figures
          competing with it. The rule is what the card's head used to be — the
          line between the answer and its footnotes, moved to where the
          separation actually is.

          A GRID, NOT A ROW OF GAPS. Three pairs 40px apart sat in the left
          half of a wide card with the right half empty; an even share each
          spreads them over the width they have, which is also exactly what
          the loan page's statement does with its four. Two money pages, one
          way of setting out the small print. */}
      <Flex vertical>
        <Divider style={styles.rule} />
        <Row gutter={[24, 20]}>
          {details.map((detail) => (
            /* THREE OR FOUR, SHARING THE WIDTH EITHER WAY. An `sm={8}` third
               kept for the healthy account and a quarter once the past-due
               figure joins, so the strip fills the card in both states rather
               than leaving a column of air where a fourth fact will land. */
            <Col key={detail.key} xs={24} sm={details.length > 3 ? 12 : 8} lg={span}>
              <Flex vertical gap={2}>
                <Typography.Text style={s.label}>{detail.label}</Typography.Text>
                <Typography.Text style={detail.alarm ? s.detailAlarm : s.detail}>
                  {detail.value}
                </Typography.Text>
              </Flex>
            </Col>
          ))}
        </Row>
      </Flex>
    </Flex>
  );
}

export default BalanceSummary;
