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

import { Button, Col, Divider, Flex, Grid, Row, Typography, theme } from "antd";
import { InstalmentTrack } from "../../../shared/ui/InstalmentTrack";
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
  /**
   * The small print under the rule.
   *
   * OFF WHEN THE LOAN IS CLOSED. "Pay off today $0.00" and a final payment
   * due next September are both false the moment the last instalment lands,
   * and a card that answers "$0.00 — nothing left to pay" and then bills you
   * for September is the page arguing with itself.
   */
  showDetails?: boolean;
  /** True only where this card is the first thing on its page, which is the
   *  dashboard and nowhere else. It sets the figure one rank up. */
  hero?: boolean;
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
  showDetails = true,
  hero = false,
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
  const figure = (
    <Typography.Text style={hero ? s.figureHero : s.figure}>
      {balance.outstanding}
    </Typography.Text>
  );

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

  /* One definition, two arrangements — see the note at the figure row. */
  const detailItem = (detail: (typeof details)[number]) => (
    <Flex vertical gap={2} key={detail.key}>
      <Typography.Text style={s.label}>{detail.label}</Typography.Text>
      <Typography.Text style={detail.alarm ? s.detailAlarm : s.detail}>
        {detail.value}
      </Typography.Text>
    </Flex>
  );

  /* Beside the figure the small print now has that space — see the figure
     row. So this caption is only ever drawn UNDER the figure, and takes the
     margin that needs. */
  const inline = hero && !stacked;
  const caption = (
    <Typography.Text type="secondary" style={styles.next}>
      {next
        ? t("payments.nextPaymentLine", { amount: next.amount, due: next.due })
        : t("payments.nothingDue")}
    </Typography.Text>
  );

  /* Story 5 and story 6 start from the same button. Which amount it is for is
     the dialog's question, not this card's.

     NO BUTTON WITH NOTHING TO PAY. The screen withholds `onPay` once the
     schedule is behind the borrower; a primary action over a zero balance is
     the loudest thing on the page inviting somebody to do something that
     cannot be done. */
  const action = !onPay ? null : (
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
    /* Fills its card, balance at the TOP and the foot-figures at the BASE.
       This card is the shorter of the two in its row (the saved card carries a
       card face), so filling to equal height leaves spare space. Centring the
       block was tried; the designer's call is to pin the answer where it has
       always sat and let the small print hold the foot — *"ეს დააბრუნე მაღლა
       სადაც იყო, ქვემოთ ისინი დატოვე."* — so the label, figure and next-line
       lead the card and the three figures sit along its base under the rule. */
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
      {stacked || inline || !action ? null : (
        <div style={styles.actionSlot}>{action}</div>
      )}
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
        {/* BASELINE, not centre. The label is 11px uppercase caps and the
            state beside it is a larger mixed-case word; centring their line
            boxes drops the state visibly below the caps, because the caps sit
            high in a 1.6 line box. Sitting both on one baseline is what makes
            "OUTSTANDING BALANCE · Accelerated" read as a single line of text.
            *"ტექსტთან ოდნავ დაბლა წერია — გასაცენტრებელია."* */}
        <Flex align="baseline" gap={10} wrap style={styles.labelRow}>
          <Typography.Text style={s.labelInline}>{t("payments.outstanding")}</Typography.Text>
          {status ? (
            /* BARE HERE, and only here. The state is a qualifier of the
               figure below it, not an item in a list of statuses — see the
               note on `bare` in StatusPill.styles.ts. */
            <StatusPill bare color={status.tone === "error" ? "error" : "warning"}>
              {status.label}
            </StatusPill>
          ) : null}
        </Flex>

        {/*
          BESIDE THE FIGURE ON THE DASHBOARD, UNDER IT EVERYWHERE ELSE.

          Beside it is right where the figure is at hero size and the schedule
          follows directly under it: the line sits on the digits' feet and the
          space to the right of a 46px number is spoken for. On /payments the
          figure is the ordinary 36 and nothing follows it in that block, so
          the same line crowded a smaller number and left the card empty below
          — *"ამ შემთხვევაში თარიღი ქვემოთ."*

          `align="baseline"` and not `center` where it does sit beside: the
          caption has to rest on the digits, and centring a 14px line against
          a 46px one floats it in the middle of the number.

          A PHONE ALWAYS STACKS. Beside a 36px figure there is no room for the
          pair in a 295px body.
        */}
        {inline ? (
          /*
            THE SMALL PRINT MOVES UP HERE, AND THE CAPTION GOES.

            It was a full-width row of three under its own rule at the foot of
            the card, which put the card's quietest facts on their own storey
            and left the whole right-hand side of a 46px figure empty. Both
            problems have the same fix: *"ესენი გვერდით მარჯვნივ ხომ არ
            მივუწეროთ კოხტად?"* — the figure keeps the left, the three facts
            about it take the space beside it, and the rule and the storey
            both disappear.

            That space was the next-payment caption's, and the caption is what
            paid for it: *"ეს გვერდითა ტექსტი მოაშორე."* Nothing is lost from
            the page — the next date is on the PAYMENTS tile directly below
            this card and at the top of the schedule on /payments.

            `flex-end` and not `baseline`: a two-line pair cannot share a
            baseline with a single 46px numeral without one of them floating.
            Sitting them on a common bottom edge is what makes the row read as
            one band rather than as two blocks that happen to be adjacent.
          */
          <Flex
            align="flex-end"
            justify="space-between"
            gap={32}
            wrap
            style={styles.figureRow}
          >
            {figure}
            {/*
              AND THE BUTTON COMES BACK INTO THE FLOW, here only.

              It is pinned to the card's corner everywhere else, for a good
              reason: laid in the label's row it made an 11px row 48px tall
              and pushed the figure a button's-worth down the card. But a
              pinned button knows nothing about what is under it, and measured
              once the small print moved up beside the figure, it sat exactly
              on top of it — "FINAL PAYMENT DUE" ran 1205→1325 inside a button
              occupying 1185→1325, covered completely.

              The reason it was pinned does not apply to THIS row: the figure
              row is already 46px, so a 48px button adds two. So here it joins
              the row it would otherwise obscure, on a shared bottom edge with
              the small print beside it.
            */}
            <Flex align="flex-end" gap={32} wrap style={styles.aside}>
              {showDetails ? (
                <Flex gap={44} wrap>
                  {details.map(detailItem)}
                </Flex>
              ) : null}
              {action}
            </Flex>
          </Flex>
        ) : (
          <Flex vertical gap={stacked && action ? 16 : 0}>
            <Flex vertical>
              {figure}
              {caption}
            </Flex>
            {stacked ? action : null}
          </Flex>
        )}
      {/*
        THE BAR, GROUPED WITH THE ANSWER — inside the figure block, under the
        caption. It belongs to the balance (the same number seen from the other
        end), and grouping it here is what stops a `fill` card floating it in
        the middle: with the root column set to space-between, a bar left as its
        own child sat halfway down the empty gap. Inside the block, the top of
        the card carries label + figure + caption + bar as one thing and the
        small print sits at the foot — one intentional gap between the two,
        instead of a void with a bar adrift in it. No percentage printed inside
        the bar: antd sets it at the empty end as if labelling it, so the count
        goes under the bar's filled start.
      */}
      {progress && progress.total > 0 ? (
        <Flex vertical gap={8} style={styles.progress}>
          <InstalmentTrack
            paid={progress.paid}
            total={progress.total}
            ariaLabel={t("payments.progressCount", {
              paid: String(progress.paid),
              total: String(progress.total),
            })}
          />
          <Typography.Text style={s.progressLabel}>
            {t("payments.progressCount", {
              paid: String(progress.paid),
              total: String(progress.total),
            })}
          </Typography.Text>
        </Flex>
      ) : null}
      </Flex>

      {/* At label size: detail about the figure above, not three more figures
          competing with it. The rule is what the card's head used to be — the
          line between the answer and its footnotes, moved to where the
          separation actually is.

          A GRID, NOT A ROW OF GAPS. Three pairs 40px apart sat in the left
          half of a wide card with the right half empty; an even share each
          spreads them over the width they have, which is also exactly what
          the loan page's statement does with its four. Two money pages, one
          way of setting out the small print. */}
      {showDetails && !inline ? (
      <Flex vertical>
        <Divider style={styles.rule} />
        <Row gutter={[24, 20]}>
          {details.map((detail) => (
            /* THREE OR FOUR, SHARING THE WIDTH EITHER WAY. An `sm={8}` third
               kept for the healthy account and a quarter once the past-due
               figure joins, so the strip fills the card in both states rather
               than leaving a column of air where a fourth fact will land. */
            <Col key={detail.key} xs={24} sm={details.length > 3 ? 12 : 8} lg={span}>
              {detailItem(detail)}
            </Col>
          ))}
        </Row>
      </Flex>
      ) : null}
    </Flex>
  );
}

export default BalanceSummary;
