// src/features/Payments/ui/PaymentsOverview.tsx
//
// The borrower's and co-borrower's whole payments page:
//
//   Balance (2/3) | Saved card (1/3)                         WBS 3, 10, 7, 8
//   One card, two tabs, full width:                          WBS 2, 5, 4, 12, 13
//     Repayment schedule | Payment history
//
// THIS IS A DEPARTURE FROM THE WIREFRAME, made with the designer. The
// wireframe stacks four separate cards: balance full width, schedule full
// width, then history and the saved card side by side. Measured, that put the
// page's width exactly the wrong way round — the simplest table (a date, an
// amount, one word) had 1216px with ~400px of gap in the middle, while the
// richest one, five-column Payment history, had 546px and scrolled its own
// Status column out of sight. The balance card was 80px of content across the
// full width.
//
// Tabs fix all three at once and are not a new idea: /staff/payments already
// puts exactly these two tables behind exactly these two tabs, so the two
// sides of the product now describe repayment the same way. Both tables get
// the full 1216px, the two small blocks share the top row, and the page is
// about 40% shorter.
//
// Eight WBS stories compose here: the balance (3), the schedule (2), paying
// (5, 6), the history (4, 12), retrying (13), the fees and overdue
// information (10), and the repayment card (7, 8).
//
// A component rather than blocks in the screen, for the reason Epics 4 and 5
// both taught: the route renders ONE state. Every state that matters here is
// one nobody wants to be in — overdue, in default, accelerated, a failed
// payment, no card — and those are exactly the ones that go unreviewed if the
// only way to see them is to be in them. Each is a story.
//
// WHAT IS DELIBERATELY ABSENT: nothing here recalculates a balance, applies a
// fee or decides a status. WBS stories 1, 9, 11 and 16 are all "System", and
// their note says the rules "are defined in the code and are NOT
// configurable". The interface shows the result.
//
// Dumb: everything arrives as props and leaves as a callback.

import {
  Alert, Button, Card, Col, Collapse, Flex, Grid, Result, Row, Tabs, Typography, theme,
} from "antd";
import { NoScheduleMark } from "./NoScheduleMark";
import { stageCopy } from "./delinquency";
import { useT } from "../../../shared/ui/i18n/useT";
import { leadPanelBody } from "../../../shared/ui/panel.styles";
import type { CardToken } from "../../LoanApplication/ui/types";
import { BalanceSummary } from "./BalanceSummary";
import { PaymentHistory } from "./PaymentHistory";
import { PaymentSchedule } from "./PaymentSchedule";
import { RepaymentCardPanel } from "./RepaymentCardPanel";
import { getStyles, styles } from "./PaymentsOverview.styles";
import type {
  Installment,
  PaymentTransaction,
  PaymentsRecord,
  RepaymentCard,
} from "./types";


export type PaymentsOverviewProps = {
  /** Absent until a loan has been funded — there is nothing to repay before that. */
  record?: PaymentsRecord;
  /**
   * Whether there is an application at all.
   *
   * The empty page has two readings and they need different ways out. With an
   * application in flight, the schedule simply does not exist yet — WBS story
   * 1: "Repayment Schedule is automatically generated when the loan is
   * funded" — and the loan page is where the news is. With NOTHING, this page
   * is one of two places a first-time visitor can land, and telling them to
   * go to a loan they do not have is a circle: both tabs would send them to
   * each other and neither would say what to do.
   */
  hasApplication?: boolean;
  role?: "borrower" | "coBorrower";
  /** No installment means the borrower pressed the balance card's button. */
  onPay?: (installment?: Installment) => void;
  onRetry?: (transaction: PaymentTransaction) => void;
  onSaveCard?: (card: CardToken, replacing?: RepaymentCard) => void;
  onViewLoan?: () => void;
  /** Only reachable when there is no application and the reader is the borrower. */
  onStartApplication?: () => void;
};

export function PaymentsOverview({
  record,
  hasApplication = true,
  role = "borrower",
  onPay,
  onRetry,
  onSaveCard,
  onViewLoan,
  onStartApplication,
}: PaymentsOverviewProps) {
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);

  /**
   * Whether the balance and the card are actually beside each other.
   *
   * The equal-height stretch is only correct when they are. Below `lg` the
   * columns stack, and a Card carrying `height: 100%` there resolved to a
   * definite 409px — measured — which was the height of its BODY and not of
   * its head plus its body, so the last detail figure was drawn 27px outside
   * the card, over the head of the card below. Two guesses at the flex
   * properties did not fix that, because the cause was never the flex.
   */
  const screens = Grid.useBreakpoint();
  const sideBySide = screens.lg === true;

  /*
    A PAGE WITH NOTHING TO REPAY, drawn as one thing.

    antd's `Result` rather than the table `EmptyState`: this is the whole page,
    not a card that ran out of rows, and Result is what antd gives a page-sized
    state — the artwork at illustration size, a real heading under it, and the
    way forward last. Same furniture as /loan's empty states, and the mark is
    the third in the same family.
  */
  if (!record) {
    /* Nothing at all: say what to do, not where else to look. And the same
       for both readers — being a co-borrower is a relationship to one
       application, so with no application there is nobody to be a co-borrower
       of. See the note on `nothingHere` in LoanOverview. */
    const nothingAtAll = !hasApplication;
    return (
      <Card>
        <Result
          icon={<NoScheduleMark />}
          title={t(nothingAtAll ? "payments.noLoanTitle" : "payments.noneTitle")}
          subTitle={t(nothingAtAll ? "payments.noLoanBody" : "payments.noneBody")}
          extra={
            <Button
              type="primary"
              size="large"
              onClick={nothingAtAll ? onStartApplication : onViewLoan}
            >
              {t(nothingAtAll ? "payments.startApplication" : "payments.viewLoan")}
            </Button>
          }
        />
      </Card>
    );
  }

  /**
   * The next thing owed: the earliest line that has not been paid.
   *
   * The schedule arrives in date order — WBS story 1 generates it that way,
   * "payments due on the 1st of each month" — so the first unpaid row is the
   * next one, and an overdue row is still the next one, which is right.
   */
  const next = record.schedule.find((row) => row.status !== "paid");

  const notice = stageCopy[record.balance.stage];

  return (
    <>
      {/*
        WBS story 9's consequences, as the PAGE's banner rather than a block
        inside the balance card.

        It sat in the card, above the figure, which made a notice about the
        whole account look like a property of one number — and boxed it inside
        a border that already had a job. Out here it reads the way /loan's own
        banners do: full width, under the title, before anything it is about.
      */}
      {notice ? (
        <Alert
          style={styles.banner}
          type={notice.type}
          showIcon
          title={t(notice.title, {
            days: String(record.balance.daysPastDue ?? 0),
          })}
          description={t(notice.body, {
            pastDue: record.balance.pastDue ?? record.balance.outstanding,
            outstanding: record.balance.outstanding,
            apr: record.balance.apr,
          })}
        />
      ) : null}

      <Row gutter={[24, 24]} style={styles.row}>
        {/* WBS stories 3 and 10. The page's one figure and the one action. */}
        <Col xs={24} lg={16} style={sideBySide ? styles.column : undefined}>
          {/* NO HEAD. The label lives inside, above the figure, the way the
              loan page's statement states its own — see BalanceSummary. */}
          <Card
            style={sideBySide ? styles.stretchCard : undefined}
            /* THE PAGE'S LEAD, at the lead inset. It was antd's own 24, which
               made the same figure under the same label sit 8px closer to its
               card edge here than on /loan. See shared/ui/panel.styles.ts. */
            styles={{
              body: sideBySide ? { ...leadPanelBody, ...styles.fillBody } : leadPanelBody,
            }}
          >
            <BalanceSummary
              balance={record.balance}
              next={next}
              fill={sideBySide}
              onPay={() => onPay?.()}
            />
          </Card>
        </Col>

        {/* WBS stories 7 and 8. Small content, so a small slot — it was half
            the page before and mostly empty.

            This one brings its own Card: its head carries the Update action,
            and whether that action belongs there is a question only the panel's
            own state can answer. */}
        <Col xs={24} lg={8} style={sideBySide ? styles.column : undefined}>
          <RepaymentCardPanel
            title={t("payments.savedCard")}
            cards={record.cards}
            role={role}
            fill={sideBySide}
            onSaveCard={onSaveCard}
          />
        </Col>
      </Row>

      {/* The record of the loan's repayment, in one card. Flush body and an
          inset tab bar, the same treatment the back-office tables use, so the
          table's header band meets the card's edge instead of floating in a
          white margin. */}
      <Card
        style={{ ...styles.card, ...styles.tableCard }}
        styles={{ body: styles.tableCardBody }}
      >
        <Tabs
          defaultActiveKey="schedule"
          tabBarStyle={styles.tabBar}
          items={[
            {
              key: "schedule",
              label: t("loanPage.schedule"),
              children: (
                <>
                  {/* WBS story 2, with story 5's Pay now on each payable line. */}
                  <PaymentSchedule installments={record.schedule} onPay={onPay} />

                  {/* WBS story 10 is "review applied late fees AND OVERDUE
                      PAYMENT INFORMATION". A fee in a column tells the borrower
                      what they were charged; only the rules tell them why, and
                      when the next one lands. Collapsed, because it is
                      reference and not news, and under the table because that
                      is what it explains. */}
                  <div style={styles.rulesBlock}>
                    <Collapse
                      ghost
                      items={[
                        {
                          key: "fees",
                          label: (
                            <Typography.Text style={s.rulesLabel}>
                              {t("payments.rulesTitle")}
                            </Typography.Text>
                          ),
                          children: (
                            <Flex vertical gap={8}>
                              <Typography.Text type="secondary">
                                {t("payments.ruleLateFee")}
                              </Typography.Text>
                              <Typography.Text type="secondary">
                                {t("payments.ruleDefault")}
                              </Typography.Text>
                              <Typography.Text type="secondary">
                                {t("payments.ruleAcceleration")}
                              </Typography.Text>
                            </Flex>
                          ),
                        },
                      ]}
                    />
                  </div>
                </>
              ),
            },
            {
              /* WBS stories 4 and 12, with story 13's retry. "Payment history
                 is read-only" — the retry does not change a row, it starts a
                 new one. */
              key: "history",
              label: t("payments.history"),
              children: (
                <PaymentHistory
                  transactions={record.history}
                  reader={role}
                  onRetry={onRetry}
                />
              ),
            },
          ]}
        />
      </Card>
    </>
  );
}

export default PaymentsOverview;
