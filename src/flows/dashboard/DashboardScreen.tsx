// src/flows/dashboard/DashboardScreen.tsx
//
// The page the borrower lands on, from the designer's own wireframe.
//
// NOT IN THE WBS. "Dashboard" appears nowhere in it — the epics run from
// Authentication to Acquisition and none of them is this page. The designer
// drew it, the navigation has carried a Dashboard entry since Epic 1, and
// every tile on it is a WBS story that already exists somewhere else. So it
// invents no capability: it is the product's own facts arranged to answer the
// three questions a borrower opens the app with, and if that is wrong it is
// wrong as a whole, not in its parts.
//
// THE WIREFRAME'S FOUR BANDS, kept:
//   1  a greeting
//   2  four tiles: loan amount, the card, payment history, documents
//   3  the money, at figure size
//   4  two up: where the application is, and the panel the wireframe left
//      empty with "need to think about what would fit here" written on it
//
// WHAT CHANGED INSIDE THEM, and why:
//
//   Band 2 — the tiles carry their own figures. Four labels linking to pages
//   the top navigation already lists is the most valuable band on the page
//   spent repeating the navigation.
//
//   Band 3 — one component per phase, both the product's own. Before funding
//   there is no balance to show, so it is the loan page's statement; after
//   funding it is the payments page's balance summary, the same component
//   with the same figures. Two screens cannot disagree with a third that is
//   made of them.
//
//   Band 4 right — "What happens next". The WBS is full of dates the borrower
//   is held to and none of them is on any screen; see nextSteps.ts.
//
//   The greeting's emoji is gone. Everything else in this product draws its
//   icons; one emoji in the page's largest type is a different system.
//
// Dumb: reads the same records every other screen reads, and navigates.

import { Button, Card, Col, Flex, Grid, Row, Typography } from "antd";
import {
  BankOutlined,
  CreditCardOutlined,
  FileTextOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { useNavigate } from "@tanstack/react-router";
import { AppHeader } from "../../shared/ui/AppHeader";
import { HeroBackdrop } from "../../shared/ui/HeroBackdrop";
import { borrowerNav } from "../../shared/ui/navigation";
import { useT } from "../../shared/ui/i18n/useT";
import { useCustomerViewer } from "../../shared/ui/viewerRole";
import { SessionTimeoutModal } from "../../features/Auth/ui/SessionTimeoutModal";
import { useIdleTimer, DEFAULT_IDLE_MS } from "../../features/Auth/ui/useIdleTimer";
import { ShortcutTiles } from "../../features/Dashboard/ui/ShortcutTiles";
import { PaymentHistory } from "../../features/Payments/ui/PaymentHistory";
import { RepaymentRing } from "../../features/Payments/ui/RepaymentRing";
import { LoanJourney } from "../../features/Loan/ui/LoanJourney";
import { LoanStatement } from "../../features/Loan/ui/LoanStatement";
import { BalanceSummary } from "../../features/Payments/ui/BalanceSummary";
import { stageCopy } from "../../features/Payments/ui/delinquency";
import { NoScheduleMark } from "../../features/Payments/ui/NoScheduleMark";
import { NoLoanMark } from "../../features/Loan/ui/NoLoanMark";
import { ApplicationMark } from "../../features/LoanApplication/ui/ApplicationMark";
import { hasOpenApplication, useLoanRecord, usePaymentsRecord } from "../loan/loanRecord";
import { BorrowerInbox } from "../notifications/BorrowerInbox";
import { useUnreadCount } from "../notifications/notifications";
import { styles } from "./DashboardScreen.styles";

export type DashboardScreenProps = {
  userName?: string;
  idleMs?: number;
};

export default function DashboardScreen({
  userName,
  idleMs = DEFAULT_IDLE_MS,
}: DashboardScreenProps) {
  const navigate = useNavigate();
  const viewer = useCustomerViewer();
  const person = userName ?? viewer.name;
  const t = useT();
  const { idle, reset: staySignedIn } = useIdleTimer(idleMs);
  const unreadCount = useUnreadCount(viewer.role);
  const screens = Grid.useBreakpoint();

  const record = useLoanRecord();
  const payments = usePaymentsRecord();
  const live = hasOpenApplication(record);
  const loan = live ? record?.loan : undefined;

  /* The first name only. "Welcome back, Levi Ackerman" is a letter from a
     bank; "Welcome back, Levi" is the product talking to the person using it. */
  const firstName = person.split(" ")[0] ?? person;

  const notice = payments ? stageCopy[payments.balance.stage] : undefined;

  const paidCount = payments?.schedule.filter((row) => row.status === "paid").length ?? 0;
  const nextDue = payments?.schedule.find((row) => row.status !== "paid");

  /*
    THE FOUR TILES, each carrying the fact its page is about.

    The card tile is the one that differs by reader, and it has to: the WBS
    gives the virtual card to the borrower alone — "Co-borrower has no access
    to card information" — while both of them have a repayment card of their
    own. So the borrower's third tile is the card OPA issued them and the
    co-borrower's is the card they pay from. Neither is shown the other's.
  */
  const ownCard = payments?.cards.find((card) => card.owner === viewer.role && card.active);
  const tiles = [
    {
      key: "loan",
      icon: <BankOutlined />,
      label: t("dashboard.tileLoan"),
      value: loan?.amount ?? record?.amount,
      hint: loan ? t("dashboard.tileLoanHint", { apr: loan.apr }) : undefined,
      to: "/loan",
    },
    viewer.role === "borrower"
      ? {
          key: "card",
          icon: <CreditCardOutlined />,
          label: t("dashboard.tileCard"),
          value: loan?.card
            ? t(loan.card.used ? "dashboard.tileCardUsed" : "dashboard.tileCardUnused")
            : undefined,
          hint: loan?.card ? `•••• ${loan.card.last4}` : undefined,
          to: "/loan",
        }
      : {
          key: "card",
          icon: <CreditCardOutlined />,
          label: t("dashboard.tileRepaymentCard"),
          value: ownCard ? `•••• ${ownCard.last4}` : undefined,
          hint: ownCard ? ownCard.brand : undefined,
          to: "/payments",
        },
    {
      key: "payments",
      icon: <HistoryOutlined />,
      label: t("dashboard.tilePayments"),
      value: payments
        ? t("dashboard.tilePaymentsValue", {
            paid: String(paidCount),
            total: String(payments.schedule.length),
          })
        : undefined,
      /* NO HINT HERE, and the other three keep theirs.
         "3 of 12 paid" is the whole question this tile answers. The next due
         date is not a second half of it — it is a fact this page already
         states twice more, in the balance card's own caption and as the first
         dated row of "What happens next". The APR and the card's last four
         stay on their tiles because nothing else on this page says them. */
      to: "/payments",
    },
    {
      key: "documents",
      icon: <FileTextOutlined />,
      label: t("dashboard.tileDocuments"),
      value: record
        ? t("dashboard.tileDocumentsValue", { count: String(record.documents.length) })
        : undefined,
      to: "/loan",
    },
  ];


  return (
    <>
      <AppHeader
        navItems={borrowerNav}
        notifications={<BorrowerInbox />}
        notificationCount={unreadCount}
        activeKey="dashboard"
        userName={person}
        profileTo="/profile"
        onLogout={() => {
          console.log("log out");
          navigate({ to: "/" });
        }}
      />

      <HeroBackdrop tone="plain" paddingBlock={0}>
        <div style={styles.page}>
          <div style={styles.column}>
            <Flex vertical gap={4} style={styles.greeting}>
              <Typography.Title level={3} style={styles.title}>
                {t("dashboard.greeting", { name: firstName })}
              </Typography.Title>
              <Typography.Text type="secondary">
                {/* WHOSE APPLICATION IT IS. A co-borrower joined somebody
                    else's, and telling them "your application is with OPA"
                    over that person's amount, reference and USCIS service
                    claims something that is not theirs. The record names the
                    applicant for exactly this. */}
                {t(
                  !live
                    ? "dashboard.leadNone"
                    : loan
                      ? "dashboard.leadLoan"
                      : viewer.role === "coBorrower"
                        ? "dashboard.leadApplicationCoBorrower"
                        : "dashboard.leadApplication",
                  { name: record?.applicant ?? "" }
                )}
              </Typography.Text>
            </Flex>

            {/* ALWAYS THE FOUR. The page keeps its shape whatever state the
                account is in — a dashboard that grows and shrinks is a
                dashboard nobody learns. What an empty tile does NOT do is
                print a dash: it shows its label and waits. */}
            <div style={styles.band}>
              <ShortcutTiles
                items={tiles}
                emptyValue={t("dashboard.tileNothing")}
                onOpen={(to) => navigate({ to })}
              />
            </div>

            {/*
              THE MONEY, ACROSS THE PAGE.

              It is the answer this screen exists to give, and the only band
              with a primary action in it, so it gets the width. The four
              small figures under the rule fill that width now that the
              past-due amount has joined them; with three they sat in the left
              half of a wide card with the right half empty, which is the
              layout the designer sent back.
            */}
            {/* THE MONEY. `BalanceSummary` is content and takes the frame the
                payments page gives it; `LoanStatement` IS a card already and
                wrapping it would nest one inside another. Neither is drawn
                before there is an application: a statement reading "—" over a
                sentence the greeting has already said is three half-answers
                where the page has one. */}
            {payments ? (
              <Card style={styles.band}>
                <BalanceSummary
                  balance={payments.balance}
                  /* THE NOTICE IS NOT A BAND ANY MORE. It was a full-width
                     yellow slab above this card carrying three sentences of
                     policy, which made a rule about the account look like the
                     page's headline and put the loudest colour on the screen
                     above the money it was about. *"ეს ალერტები ესე არ
                     მომწონს."*

                     The STATE goes on the figure it describes; the RULE is
                     already in "What happens next" beside it, dated, with the
                     16th-day fee and the 30-day windows in the WBS's own
                     words. Nothing was lost — it moved to where a reader can
                     act on it. */
                  status={
                    notice
                      ? {
                          label: t(notice.state, {
                            days: String(payments.balance.daysPastDue ?? 0),
                          }),
                          tone: notice.type,
                        }
                      : undefined
                  }
                  pastDue={payments.balance.pastDue}
                  progress={{ paid: paidCount, total: payments.schedule.length }}
                  next={nextDue}
                  onPay={() => navigate({ to: "/payments" })}
                />
              </Card>
            ) : live && record ? (
              <div style={styles.band}>
                <LoanStatement
                  label={t("dashboard.appliedFor")}
                  value={record.amount}
                  caption={
                    /* A DECLINED APPLICATION IS NOT "under review". The record
                       carries the customer-facing decision note for exactly
                       this, and printing the submission date instead reads as
                       though it were still in the queue. */
                    record.status === "declined" && record.decisionNote
                      ? record.decisionNote
                      : t("dashboard.submittedOn", { date: record.submittedOn })
                  }
                  action={{
                    label: t("dashboard.viewApplication"),
                    onClick: () => navigate({ to: "/loan" }),
                  }}
                  facts={[
                    { key: "ref", label: t("dashboard.reference"), value: record.id, span: 8 },
                    {
                      key: "uscis",
                      label: t("dashboard.uscis"),
                      value: record.uscisType,
                      span: 16,
                    },
                  ]}
                />
              </div>
            ) : (
              /* THE FRAME STAYS, EMPTY. The page keeps its four bands in every
                 state so its shape is learnable; what changes is what is in
                 them. Here: the drawing, the sentence and the way in.

                 AND IT IS TITLED, unlike the same band when it is full. A
                 figure names itself — "OUTSTANDING BALANCE" and "APPLIED FOR"
                 sit above their own numbers — but an empty frame has nothing
                 to do that, and the two panels below it are both titled. A
                 band with no name between two named ones reads as a gap. */
              <Card title={t("dashboard.loanBand")} style={styles.band}>
                <Flex
                  vertical
                  align="center"
                  gap={16}
                  style={screens.md === false ? styles.emptyNarrow : styles.empty}
                >
                  <NoLoanMark size={140} muted />
                  <Typography.Text type="secondary" style={styles.emptyCopy}>
                    {t("dashboard.emptyBody")}
                  </Typography.Text>
                  {/* NOT FILLED. On /loan and /payments the same offer is the
                      whole point of the page and carries the accent; here it
                      sits inside one frame of four, beside a mark that was
                      deliberately taken down to neutral. A saturated button
                      is then the only loud thing in a quiet panel, which is
                      what the designer saw. Outlined it is still the only
                      control in the frame, so it is still unmissable. */}
                  <Button size="large" onClick={() => navigate({ to: "/application" })}>
                    {t("loanPage.startApplication")}
                  </Button>
                </Flex>
              </Card>
            )}

            {/*
              WHERE IT HAS GOT TO, AND WHAT THE SCHEDULE LOOKS LIKE.

              Half and half, as the designer asked for the tracker back —
              *"ჯობია ისევ ნახევარ ეკრანზე იყო"*.

              Two progress pictures side by side, and they are not the same
              picture: the rail on the left is the LOAN's four stages, the
              ring on the right is the SCHEDULE's twelve instalments. The rail
              ends the day the money moves; the ring only starts then.
            */}
            <Row gutter={[24, 24]} style={styles.band}>
              <Col xs={24} lg={12}>
                <Card title={t("dashboard.journeyTitle")} style={styles.journeyCard}>
                  {live && record ? (
                    <LoanJourney
                      status={record.status}
                      stage={loan?.stage}
                      paid={
                        payments ? { count: paidCount, total: payments.schedule.length } : undefined
                      }
                      /* EVERY STEP THE RECORD CAN DATE. The signature date is
                         the loan agreement's own execution date, which is the
                         same fact the Documents tab lists; approval and
                         funding come from the loan.

                         NO DATE ON "REPAID". The schedule's maturity is when
                         the loan WILL close, not when it did, and the card
                         above already states it as FINAL PAYMENT DUE. The
                         tracker only ever dates what has happened. */
                      /* WHAT EACH STAGE IS WAITING ON, in the WBS's own
                         words, and only on the stage the loan is actually in.
                         These are the sentences the dated list used to carry;
                         the list is gone and the facts are not, so they moved
                         onto the step they were always about. */
                      notes={{
                        signed:
                          loan?.stage === "awaitingSignature"
                            ? t(
                                record.coBorrower
                                  ? "dashboard.stepSignBodyBoth"
                                  : "dashboard.stepSignBody"
                              )
                            : undefined,
                        funded:
                          loan?.stage === "funding"
                            ? t("dashboard.stepFundingBody")
                            : undefined,
                      }}
                      dates={{
                        approved: loan?.approvedOn,
                        signed: record.documents.find(
                          (document) => document.type === "loan_agreement" && document.executed
                        )?.on,
                        funded: loan?.fundedOn,
                      }}
                    />
                  ) : (
                    <Flex vertical align="center" gap={12} style={styles.panelEmpty}>
                      <ApplicationMark badge="add" size={100} muted />
                      <Typography.Text type="secondary" style={styles.emptyCopy}>
                        {t("dashboard.journeyNone")}
                      </Typography.Text>
                    </Flex>
                  )}
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title={t("dashboard.ringTitle")} style={styles.journeyCard}>
                  {payments && payments.schedule.length > 0 ? (
                    <RepaymentRing
                      paid={paidCount}
                      overdue={
                        payments.schedule.filter((row) => row.status === "overdue").length
                      }
                      total={payments.schedule.length}
                    />
                  ) : (
                    <Flex vertical align="center" gap={12} style={styles.panelEmpty}>
                      <NoScheduleMark size={100} muted />
                      <Typography.Text type="secondary" style={styles.emptyCopy}>
                        {t("dashboard.ringNone")}
                      </Typography.Text>
                    </Flex>
                  )}
                </Card>
              </Col>
            </Row>

            {/*
              WHAT HAS ACTUALLY HAPPENED TO THE MONEY.

              This band held "What happens next" — a dated list of what the
              WBS would ask of the borrower. The designer took it out for the
              record of what has already been attempted, which is the thing a
              borrower checks between statements: *"what happens next არ
              გვინდა, მოდი იყოს recent transactions"*.

              It is /payments' own table, handed the four most recent rows and
              no retry: acting on a failed payment belongs to the page that
              owns paying, and the way there is one click above.
            */}
            {payments && payments.history.length > 0 ? (
              <Card
                title={t("dashboard.recentTitle")}
                style={styles.band}
                extra={
                  <Button type="link" onClick={() => navigate({ to: "/payments" })}>
                    {t("dashboard.recentAll")}
                  </Button>
                }
                styles={{ body: styles.tableBody }}
              >
                <PaymentHistory transactions={payments.history.slice(0, 4)} reader={viewer.role} />
              </Card>
            ) : null}
          </div>
        </div>
      </HeroBackdrop>

      <SessionTimeoutModal
        open={idle}
        onStaySignedIn={staySignedIn}
        onSignOut={() => {
          console.log("session ended after inactivity");
          navigate({ to: "/" });
        }}
      />
    </>
  );
}
