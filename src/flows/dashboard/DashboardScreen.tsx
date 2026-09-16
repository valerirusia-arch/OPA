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

import { Button, Card, Flex, Typography } from "antd";
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
import { ApplicationProgress } from "../../features/Dashboard/ui/ApplicationProgress";
import { StageFoot } from "../../features/Dashboard/ui/StageFoot";
import { ShortcutTiles } from "../../features/Dashboard/ui/ShortcutTiles";
import { PaymentHistory } from "../../features/Payments/ui/PaymentHistory";
import { NoLoanMark } from "../../features/Loan/ui/NoLoanMark";
import { BalanceSummary } from "../../features/Payments/ui/BalanceSummary";
import { stageCopy } from "../../features/Payments/ui/delinquency";
import { hasOpenApplication, useLoanRecord, usePaymentsRecord } from "../loan/loanRecord";
import { BorrowerInbox } from "../notifications/BorrowerInbox";
import { useUnreadCount } from "../notifications/notifications";
import { applicationTrack } from "./applicationTrack";
import { leadPanelBody } from "../../shared/ui/panel.styles";
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

  const record = useLoanRecord();
  const payments = usePaymentsRecord();
  const live = hasOpenApplication(record);
  const loan = live ? record?.loan : undefined;

  const notice = payments ? stageCopy[payments.balance.stage] : undefined;

  /* WHERE THE APPLICATION HAS GOT TO, for the band that used to state the
     amount. See applicationTrack.ts — four steps ending at Funding, with
     Repayment as a destination beside the rail. */
  const track = live && record ? applicationTrack(t, record) : undefined;
  /* Bound here rather than inline, so the closure captures the destination
     rather than re-reading an optional through the object it came from. */
  const trackStep = track?.action;
  const trackAction = trackStep
    ? { label: trackStep.label, onClick: () => navigate({ to: trackStep.to }) }
    : undefined;

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
                {/* WHAT THIS PAGE IS ABOUT, by name — see the dictionary. The
                    greeting that used to be here was the largest type on the
                    screen saying the one thing the reader already knew. */}
                {!live || !record
                  ? t("dashboard.titleNone")
                  : t(record.loan ? "dashboard.titleLoan" : "dashboard.titleApplication", {
                      ref: record.id,
                    })}
              </Typography.Title>
              {/*
                ONE SENTENCE, AND ONLY WHERE THERE IS NOTHING ELSE TO READ.

                It used to run in every state — "Your application is with OPA.
                Here is where it stands." over a band that says exactly that
                in more detail, and "Here is your loan, what it costs and what
                is coming" over the loan, the cost and what is coming. A line
                that introduces what is already on screen is furniture.
                *"ეს ტექსტი აღარ უნდა, მხოლოდ empty space-ზე იყოს."*

                Before there is an application there IS nothing else to read,
                and the sentence is then the only thing telling somebody why
                the page is empty. So it stays exactly there.
              */}
              {live ? null : (
                <Typography.Text type="secondary">{t("dashboard.leadNone")}</Typography.Text>
              )}
            </Flex>


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
              <Card style={styles.band} styles={{ body: leadPanelBody }}>
                <BalanceSummary
                  balance={payments.balance}
                  /* The first thing on this page, and the only thing at its
                     rank. /payments and /loan keep the ordinary size. */
                  hero
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
                  /* NOTHING LEFT TO PAY IS A DIFFERENT CARD. With the
                     schedule behind them the bar is a full green line saying
                     nothing, the small print bills a payoff of $0.00 and a
                     final payment next September, and a primary action offers
                     to pay a zero balance. All three were on screen at once.
                     Settled, the card is the figure and the sentence under
                     it — which is the whole truth at that point. */
                  progress={nextDue ? { paid: paidCount, total: payments.schedule.length } : undefined}
                  showDetails={nextDue !== undefined}
                  next={nextDue}
                  onPay={nextDue ? () => navigate({ to: "/payments" }) : undefined}
                />
                {/* THE JOURNEY DOES NOT END WITH THE PICTURE OF IT. The band
                    above swapped to this card at funding and took the rail
                    with it, which read as a step being skipped. The name of
                    the step and the record behind it stay. See StageFoot. */}
                {track ? (
                  <StageFoot
                    steps={track.steps}
                    current={track.current}
                    title={track.title}
                    owner={track.owner}
                    complete={track.complete}
                  />
                ) : null}
              </Card>
            ) : track ? (
              /* THE ROAD, AND THE PLACE ON IT. This band used to state the
                 amount applied for, the reference and the USCIS service, and
                 the designer threw out the premise rather than the styling:
                 *"დაივიწყე ამ კონტენერის ეს არსი."* The amount is on the tile
                 directly below this card and the other two are on
                 /application; none of the three answers what a borrower opens
                 this page to find out. */
              <div style={styles.band}>
                <ApplicationProgress
                  steps={track.steps}
                  current={track.current}
                  failed={track.failed}
                  title={track.title}
                  body={track.body}
                  owner={track.owner}
                  complete={track.complete}
                  goal={track.goal}
                  action={trackAction}
                />
              </div>
            ) : (
              /* THE FRAME STAYS, EMPTY — and it was wrong to take it out with
                 the rest. *"ეს მჭირდება ემთი სფეისზეც რომ იყოს."*

                 Stripped, the page's first state was a greeting sitting
                 directly on four tiles with no values in them: nothing to
                 read, and no way to start the thing that fills them. The
                 band is where the money goes, so before there is any it
                 carries the drawing, the sentence, and the way in.

                 AND IT IS TITLED, unlike the same band when it is full. A
                 figure names itself — "OUTSTANDING BALANCE" and "APPLIED FOR"
                 sit above their own numbers — but an empty frame has nothing
                 to do that with. */
              <Card title={t("dashboard.loanBand")} style={styles.band}>
                <Flex vertical align="center" gap={16} style={styles.empty}>
                  <NoLoanMark size={140} />
                  <Typography.Text type="secondary" style={styles.emptyCopy}>
                    {t("dashboard.emptyBody")}
                  </Typography.Text>
                  {/* Outlined, not filled: it is the only control in the frame,
                      so it is unmissable without a saturated fill — and the
                      accent now lives in the illustration above it, matching the
                      /loan and /payments empty states. */}
                  <Button size="large" onClick={() => navigate({ to: "/application" })}>
                    {t("loanPage.startApplication")}
                  </Button>
                </Flex>
              </Card>
            )}

            {/* THE FOUR FACTS, UNDER THE ANSWER.
                They led the page and they should not: they are four ways in,
                and a way in is not what a borrower opens this page for. The
                figure above is. */}
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
              THE LAST FEW PAYMENTS, AT THE VERY FOOT.

              Under the tiles, not above them. The tiles are four ways OUT of
              this page and belong with the rest of its navigation; a table is
              something you read, and reading comes before leaving.

              WBS story 4 — "review payment history" — and the one thing this
              page could not answer until now: whether the money actually left
              the account. The balance says what is owed and the schedule says
              when; neither says that October's payment went through and
              November's failed.

              FIVE ROWS, NOT TWELVE. The whole record is one click away and
              this is a dashboard: what a borrower checks here is the last
              thing that happened, not the year. The head carries the way to
              the rest.

              Drawn only once the schedule exists — before funding there is
              nothing to have paid.
            */}
            {payments ? (
              <Card
                title={t("dashboard.recentTitle")}
                /* `overflow: hidden` so the table's own square corners are
                   cut by the card's radius. With the body's padding at 0 the
                   last row runs to the frame, and without the clip it ran
                   past it. */
                style={styles.tableCard}
                styles={{ body: styles.tableBody }}
                extra={
                  <Button type="link" onClick={() => navigate({ to: "/payments" })}>
                    {t("dashboard.recentAll")}
                  </Button>
                }
              >
                <PaymentHistory
                  transactions={payments.history.slice(0, 5)}
                  reader={viewer.role === "coBorrower" ? "coBorrower" : "borrower"}
                />
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
