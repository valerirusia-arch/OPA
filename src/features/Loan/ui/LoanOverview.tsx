// src/features/Loan/ui/LoanOverview.tsx
//
// The borrower's Manage loan page.
//
//   Manage loan                                   Approved · Funded
//   ┌ NEXT PAYMENT  $120.65   schedule → ┐  ┌ Virtual card ──────┐
//   │ ▓▓▓▓▓▓░░░░░░  3 of 12 · ends Oct 1 │  │  •••• •••• 3094    │
//   │ amount · unused · rate · starts    │  │  expires 08/29     │
//   └────────────────────────────────────┘  └────────────────────┘
//   ┌ Documents ───────────────────────────────────────────────── ┐
//   └───────────────────────────────────────────────────────────── ┘
//   ─────────────────────────────────────────────────────────────
//   Cancel this loan                                    [Cancel]
//
// Seven WBS stories from Manage Loan compose here: status and details (3),
// documents (4), withdraw (5), sign (2), loan details (8), the virtual card
// (7) and cancel (9).
//
// THE LAYOUT CHANGED, THE CONTENT DID NOT (2026-09-11). The page was six white
// cards on grey: a strip of four figures, a repayment card, a card panel, a
// documents table, a cancel card. Every one of them had the same border, the
// same radius and the same shadow, so the page had no first thing to read and
// was read at a constant effort from top to bottom — which is what the
// designer meant by heavy, uninteresting and hard to take in. Three moves, no
// new facts:
//
//   1. The state was a RAIL for a while — Approved ─ Signed ─ Funded ─ Repaid
//      across the top. It is gone again on the designer's call: that overview
//      belongs to the Dashboard, which is where they want it, and two places
//      telling one story is how they start disagreeing. `LoanJourney` is kept
//      for that page; here the state is the two tags beside the title.
//   2. The one figure the page exists for moved onto ONE COLOURED PANEL, and
//      the four contract facts moved into its foot. They were the loudest
//      thing on the page and the least useful — the loan amount and the
//      remaining unused balance are the same number until the card is used, so
//      the page opened on a figure printed twice.
//   3. The card came up beside the answer — the two things a funded borrower
//      opens this page for now sit on one line — the documents table went back
//      to full width under them, and cancelling became a quiet footer rather
//      than a sixth card with a red button in it.
//
// THE SCHEDULE IS NOT ON THIS PAGE. WBS story 8 says "repayment terms and
// schedule" and the wireframe answers it with the next payment plus "View full
// schedule →" — the full table lives on the Payments page, which owns it.
// Printing twelve rows in both places is how two pages start disagreeing about
// what is due.
//
// STATES THE WIREFRAME DOES NOT DRAW, KEPT BECAUSE THE WBS ASKS FOR THEM: the
// wireframe only draws a funded loan. Story 3 is "view the current application
// status (e.g. Submitted, Under Review, Pending action, Approved, declined)
// and view the application details", and story 5 is withdrawing "before the
// final loan decision is made" — both belong to the weeks before there is a
// loan, so the page carries an application state too.
//
// WHAT IS DELIBERATELY ABSENT — WBS story 3's note: "Only customer-facing
// decision details are displayed. Internal scoring, business rules and
// decision logic are NOT exposed to the borrower." No credit score, no rule
// name, no "which check stopped it". A decision reaches the borrower as one
// sentence about what happens next.
//
// WITHDRAW AND CANCEL ARE NOT THE SAME BUTTON. Story 5 withdraws an
// APPLICATION "before the final loan decision"; story 9 cancels a LOAN "before
// the virtual payment card has been used". Different stories, different
// moments, so they never appear together.
//
// Dumb: it renders what it is given and reports which control was pressed.

import type { ReactNode } from "react";
import { Button, Card, Col, Flex, Grid, Result, Row, Typography, theme } from "antd";
import { PageNotice } from "../../../shared/ui/PageNotice";
import { useT } from "../../../shared/ui/i18n/useT";
import { DocumentList } from "./DocumentList";
import { NoLoanMark } from "./NoLoanMark";
import { LoanStatement, type LoanStatementProps, type StatementFact } from "./LoanStatement";
import { VirtualCardPanel } from "./VirtualCardPanel";
import { getStyles, styles } from "./LoanOverview.styles";
import type { ApplicationSummary, LoanDocument } from "./types";

export type LoanOverviewProps = {
  /** Omitted entirely when the borrower has never applied. */
  application?: ApplicationSummary;
  /** WBS story 7: the card belongs to the borrower, never the co-borrower. */
  role?: "borrower" | "coBorrower";
  onStartApplication?: () => void;
  /**
   * Whether the reader has already signed the loan package.
   *
   * WBS story 2 wants two signatures before funding, so "approved, waiting
   * for a signature" is two different pages: one with something to do on it,
   * and one that is waiting on somebody else.
   */
  signedByReader?: boolean;
  onWithdraw?: () => void;
  onSign?: () => void;
  onOpenCard?: () => void;
  /** The name printed along the foot of the virtual card. */
  cardholder?: string;
  onCancelLoan?: () => void;
  onViewSchedule?: () => void;
  onDownload?: (document: LoanDocument) => void;
};

export function LoanOverview({
  application,
  role = "borrower",
  onStartApplication,
  signedByReader = false,
  onWithdraw,
  onSign,
  onOpenCard,
  cardholder = "",
  onCancelLoan,
  onViewSchedule,
  onDownload,
}: LoanOverviewProps) {
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);
  const screens = Grid.useBreakpoint();
  /* True only where the two cards ACTUALLY share a row, which is the only
     condition under which filling one to the other's height means anything. */
  const sideBySide = screens.lg === true;

  const loan = application?.loan;

  /**
   * WBS story 5: "before the final loan decision is made", and "Availability
   * depends on the current application status". Approved and declined are both
   * final, so the button is GONE by then rather than disabled.
   */
  /**
   * WBS story 5 is the BORROWER's: "The borrower shall be able to withdraw an
   * application before the final loan decision is made." The co-borrower is
   * named on almost every neighbouring story — reviewing, signing, viewing the
   * status, the schedule, the balance — and pointedly not on this one. They
   * joined an application they do not own, so they cannot take it away; the
   * page reads the same to them, minus this footer.
   */
  /**
   * The other person who has to sign, named.
   *
   * The borrower waits on the co-borrower and the co-borrower waits on the
   * applicant; either way it is one name, and a page that says "somebody else
   * has to sign" is not telling anybody anything.
   */
  const otherSigner =
    role === "borrower" ? application?.coBorrower : application?.applicant;

  const canWithdraw =
    role === "borrower" &&
    application !== undefined &&
    application.status !== "approved" &&
    application.status !== "declined";

  /**
   * WBS story 9: "only before the Virtual Payment Card has been used". Only
   * the borrower can cancel; a co-borrower cannot even see the card.
   */
  const canCancel =
    loan?.stage === "funded" && loan.card?.used === false && role === "borrower";

  /*
    A PAGE WITH NO LOAN ON IT, drawn as one thing rather than as a strip.

    ONE STATE, NOT TWO. Never applied and cancelled-a-loan-that-was-never-spent
    used to be two screens with their own words and their own badge. They are
    the same fact — there is no application and no loan on this page — and the
    second one told the reader something they had done thirty seconds earlier
    and already knew. *"დაქენსელდა სტეიტი… ეგ ზედმეტია."* Cancelling now leaves
    exactly the page a borrower who has never applied sees, which is also the
    page that offers the way forward.

    AND ONE PAGE FOR BOTH PEOPLE, which is a point about what a co-borrower
    IS. It is not an account type: the WBS registers them as an ordinary
    personal account and the INVITATION "securely associates the co-borrower
    with the corresponding loan application" — a relationship to one
    application, which is also why "co-borrowers can sponsor up to 3
    borrowers". So with no application anywhere there is nobody to be a
    co-borrower OF, and words like "the application you were invited to" were
    the product inventing a role the WBS does not have. *"ცალკე როლი ამისთვის
    არ არსებობს."* Everything that IS role-specific on this page — the virtual
    card, withdrawing — is scoped to an application that exists.

    antd's `Result` rather than the table `EmptyState`: this is the whole page,
    not a card that ran out of rows, and Result is the component antd gives a
    page-sized state — the artwork at illustration size, a real heading under
    it, and the way forward last. It is the same furniture the back office's
    403 pages already use.
  */
  const nothingHere = () => (
    <Card>
      <Result
        icon={<NoLoanMark muted />}
        title={t("loanPage.none")}
        subTitle={t("loanPage.noneBody")}
        extra={
          <Button type="primary" size="large" onClick={onStartApplication}>
            {t("loanPage.startApplication")}
          </Button>
        }
      />
    </Card>
  );

  if (!application) return nothingHere();

  /*
    THE PAGE'S FOOT, and the only place a way OUT of the loan is offered.

    Withdrawing an application and cancelling a funded loan are the same kind
    of thing at two different moments, so they get the same treatment: a rule,
    a heading, one sentence, and the control at the end of the line. Neither
    gets a card. A card puts a destructive action on the same footing as the
    loan it would destroy, which is how this page ended up with a red button
    in a frame of its own at the bottom.
  */
  const exitRow = (title: string, body: string, action?: ReactNode) => (
    <Flex align="center" justify="space-between" gap={24} wrap style={s.exit}>
      <Flex vertical gap={4} style={styles.exitCopy}>
        <Typography.Text style={s.sectionTitle}>{title}</Typography.Text>
        <Typography.Text type="secondary">{body}</Typography.Text>
      </Flex>
      {action}
    </Flex>
  );

  /* The table sits flush against the card's edges, as every other table in
     the product does: a table has its own head, its own row rule and its own
     cell padding, and a card's 24px inset on top of that draws a second frame
     inside the first. Padding comes back only for the empty state, which is
     prose and needs the margin. */
  const documents = (
    <Card
      title={t("loanPage.documents")}
      style={application.documents.length > 0 ? styles.tableCard : undefined}
      styles={application.documents.length > 0 ? { body: styles.tableCardBody } : undefined}
    >
      <DocumentList documents={application.documents} onDownload={onDownload} />
    </Card>
  );

  /* WBS: customer-facing decision details only. One sentence about what
     happens next, and nothing about how it was reached.

     IT GOES ONCE THEY HAVE SIGNED. The approval note's second half tells them
     to sign the loan agreement, which is the one thing they have just done —
     and the statement under it already says what is left. The status beside
     the page title still reads "Approved", so nothing about the decision is
     lost by not repeating it. */
  const decision =
    application.decisionNote &&
    !(signedByReader && loan?.stage === "awaitingSignature") ? (
    <PageNotice tone={application.status === "declined" ? "error" : "success"}>
      {application.decisionNote}
    </PageNotice>
  ) : null;

  /* No loan yet: the application's own state, per story 3, and story 5's
     withdraw while the decision is still open. The panel leads on the amount
     that was asked for, because until there is a decision that is the whole
     subject of the page. */
  if (!loan) {
    return (
      <>
        {decision}

        <Row style={styles.row}>
          <Col xs={24}>
            <LoanStatement
              title={t("loanPage.statement")}
              label={t("loanPage.amount")}
              value={application.amount}
              labelAside={t("loanPage.submittedOn", { date: application.submittedOn })}
              facts={[
                /* A reference is eight characters; a third of the panel is
                   what pushed the service that far right, with nothing in
                   between. A quarter is enough for it. */
                {
                  key: "ref",
                  label: t("loanPage.reference"),
                  value: application.id,
                  span: 6,
                },
                /* The USCIS service is a sentence, not a figure — it takes the
                   width the reference does not need. */
                {
                  key: "uscis",
                  label: t("loanPage.uscis"),
                  value: application.uscisType,
                  span: 18,
                },
              ]}
            />
          </Col>
        </Row>

        {documents}

        {canWithdraw
          ? exitRow(
              t("loanPage.withdrawTitle"),
              t("loanPage.withdrawBody"),
              <Button danger onClick={onWithdraw} style={styles.action}>
                {t("loanPage.withdraw")}
              </Button>
            )
          : null}
      </>
    );
  }

  /*
    WBS story 9, AFTER THE FACT. The loan is cancelled, the card is closed and
    nothing was paid out, so there is no balance, no schedule and no card to
    show — printing the terms of a loan that no longer exists is worse than
    saying it is gone.

    AND NO DOCUMENTS EITHER, on the designer's call: *"დოკუმენტები რატომ რჩება
    თუ ლოანი გავაუქმე და არ მაქვს ეხლა არაფერი"*. Story 4's "documents remain
    available throughout the loan lifecycle" was the reason they were left
    here; the cancelled loan HAS no lifecycle left, and a page that says "you
    have nothing" over a table of five files says two things at once. Raised
    with OPA if they ask for the signed package to stay reachable.

    Which leaves the page with nothing on it — so it is the empty page, in the
    same words as any other empty page. See the note on `nothingHere`.
  */
  if (loan.stage === "cancelled") return nothingHere();

  /*
    HOW FAR THROUGH THE LOAN SOMEBODY IS, read off the schedule the page
    already holds — no new data, and nothing the borrower is not entitled to.

    It is the question a borrower actually has between statements, and it
    cannot be read off "next payment" alone. It is the one thing on this page
    the wireframe does not draw.
  */
  const paidCount = loan.schedule.filter((row) => row.status === "paid").length;
  const totalCount = loan.schedule.length;
  const finalDue = loan.schedule[totalCount - 1]?.due;

  /* WBS story 8: "loan amount, remaining unused balance, APR, repayment
     terms". Four facts — along the foot of the panel rather than in a strip
     of their own above it, where they outshouted the answer. */
  const hasCard = role === "borrower" && loan.card !== undefined;

  /*
    FOUR ACROSS, ALWAYS, ON ONE BASELINE.

    Two rows of two was the first attempt and the designer rejected it: these
    are one group of four facts about one loan, and dropping half of them to a
    second line reads as two groups. Four fit in two thirds of the row — about
    166px each — once the labels are short enough to stay on one line, which
    is why "Remaining unused balance" is now "Unused balance". A label that
    wraps is what puts the values on two different baselines.
  */
  const factSpan = 6;

  const terms: StatementFact[] = [
    {
      key: "unused",
      label: t("loanPage.unused"),
      value: loan.unusedBalance,
      span: factSpan,
    },
    {
      key: "apr",
      label: t("loanPage.interestRate"),
      value: loan.apr,
      span: factSpan,
    },
    {
      key: "starts",
      label: t("loanPage.repaymentStarts"),
      value: loan.firstPaymentOn,
      span: factSpan,
    },
  ];

  /*
    ONE NUMBER PER PAGE, AND WHICH ONE DEPENDS ON THE STAGE.

    Repaying, the answer is what is owed next. Before that there is nothing
    owed yet and the answer is the loan itself — with the signature it is
    waiting on as the action, which is also why the "documents ready to sign"
    banner is gone: it was a third telling of the same fact, above a card that
    repeated it.
  */
  const statement: LoanStatementProps =
    loan.stage === "funded"
      ? {
          title: t("loanPage.statement"),
          label: t("loanPage.nextPayment"),
          /* SHORT: "Oct 01", not "Oct 01, 2026". The year is under the track
             in "ends Sep 01, 2027", and beside the label a four-digit year is
             the longest thing on the line for the least. The dates in this
             prototype are written as English strings in the mock and never
             localised, so dropping a trailing ", YYYY" is exactly as safe as
             the data it reads. */
          labelAside:
            paidCount === totalCount && totalCount > 0
              ? t("payments.nothingDue")
              : loan.nextPaymentOn.replace(/,\s*\d{4}$/, ""),
          value: loan.nextPayment,
          action: { label: t("loanPage.viewSchedule"), onClick: onViewSchedule },
          progress: {
            paid: paidCount,
            total: totalCount,
            /* Two facts, one sentence: how far through, and when it ends. */
            caption: t("loanPage.progressLine", {
              paid: String(paidCount),
              count: String(totalCount),
              due: finalDue ?? "",
            }),
            ariaLabel: t("loanPage.paymentsMade"),
          },
          facts: [
            {
              key: "amount",
              label: t("loanPage.loanAmount"),
              value: loan.amount,
              span: factSpan,
            },
            ...terms,
          ],
        }
      : {
          title: t("loanPage.statement"),
          label: t("loanPage.loanAmount"),
          value: loan.amount,
          /* ON THE LABEL'S LINE, not under the figure — *"ესენი ყველაფერი
             ზემოთ დაუწერო, როგორც თარიღი უწერია, ყველა სტეპზე."* Every stage
             of this panel now says its one thing in the same place: beside
             the label, short.

             THE REDUCTION COMES FIRST, where there was one. Everything else
             this line says is about WHERE the loan is; this is about WHAT it
             is, and the borrower is a click away from signing for it. */
          labelAside: loan.requestedAmount
            ? t("loanPage.approvedInstead", { requested: loan.requestedAmount })
            : loan.stage === "awaitingSignature"
              ? signedByReader
                ? t("loanPage.stageAwaitingOther", { name: otherSigner ?? "" })
                : t("loanPage.stageAwaitingSignature")
              : loan.stage === "funding"
                ? t("loanPage.stageFunding")
                : t("loanPage.stageCancelled"),
          /* WBS story 2: "Loan documents become available for signature only
             after the application has been approved." Signing is its own
             screen, per the wireframe; this is the way in. */
          action:
            loan.stage === "awaitingSignature" && !signedByReader
              ? { label: t("loanPage.sign"), onClick: onSign, emphasis: "primary" }
              : undefined,
          /* PRODUCT.md's fourth principle: name the hand-over. DocuSign owns
             the signature, and the money does not move until it is done.

             ONCE THEY HAVE SIGNED it says the other half of story 2 instead:
             both parties sign before funding, so the page names who is left
             and offers nothing — there is nothing they can do about it, and a
             second "Review and sign" button would ask them to sign twice. */
          note:
            loan.stage !== "awaitingSignature"
              ? undefined
              : signedByReader
                ? t("loanPage.signWaiting", { name: otherSigner ?? "" })
                : t("loanPage.signBody"),
          /* The amount is the figure above; printing it again as a fact is
             what the old strip did. */
          facts: terms,
        };

  return (
    <>
      {decision}

      {/*
        THE ONE STATE WHERE THE BORROWER HAS NOTHING TO DO — so the page says
        so, in as many words.

        Signed, and now OPA and USIO have to move: the WBS's own steps are
        "the system shall request issuance of a prepaid virtual card" and then
        the funding notification "when the loan has been funded and the
        Virtual Payment Card is available". Neither is the borrower's. A page
        that says only "Being paid out" under a figure leaves somebody waiting
        without knowing what for, or worse, wondering whether they have missed
        a step of their own. This names what is happening, who is doing it,
        that they will be told, and when repayment starts — the next thing
        that WILL be asked of them.
      */}
      {loan.stage === "funding" ? (
        <PageNotice tone="info">
          {/* ONE MESSAGE. The heading and the paragraph under it were a title
              for two sentences; joined, they are the two sentences.

              NOT THE SAME SECOND SENTENCE FOR BOTH. The borrower's names the
              virtual card, because it is the thing that appears here when the
              money moves. The co-borrower has no card and never will —
              "Co-borrower has no access to card information" — so promising
              them one is the page telling them something that cannot
              happen. */}
          {`${t("loanPage.fundingTitle")} ${t(
            role === "borrower" ? "loanPage.fundingBody" : "loanPage.fundingBodyCoBorrower",
            { date: loan.firstPaymentOn }
          )}`}
        </PageNotice>
      ) : null}

      {/*
        THE SAME SPLIT AS THE PAYMENTS PAGE: two thirds for the money, one
        third for the card.

        The card face is one component drawn from one token, so a half-width
        column came out 240px wider than the identical face on /payments —
        same card, same product, two different shapes. A card is a card-shaped
        object; the column has to be the width that lets it be one.
      */}
      <Row gutter={[24, 24]} style={styles.row}>
        <Col
          xs={24}
          lg={hasCard ? 16 : 24}
          style={sideBySide && hasCard ? styles.column : undefined}
        >
          <LoanStatement {...statement} fill={sideBySide && hasCard} />
        </Col>

        {/* WBS story 7. The co-borrower's wireframe has no card on it at all,
            so neither does theirs: the panel is not rendered rather than
            rendered and refused. */}
        {hasCard && loan.card ? (
          <Col xs={24} lg={8} style={sideBySide ? styles.column : undefined}>
            <VirtualCardPanel
              title={t("loanPage.card")}
              brand={loan.card.brand}
              cardholder={cardholder}
              used={loan.card.used}
              fill={sideBySide}
              onOpen={onOpenCard}
            />
          </Col>
        ) : null}
      </Row>

      {/* WBS story 4: download only, no preview. Full width — it is a table,
          and a table wants the page. */}
      {documents}

      {/*
        WBS story 9, and ONLY WHILE IT IS ALLOWED.

        Cancelling is possible "only before the Virtual Payment Card has been
        used". Once it has been used the row is gone rather than standing there
        explaining itself: a heading, a sentence and no control is a paragraph
        about something the reader cannot do, at the foot of a page that has
        nothing else to say. The card's own panel already reads "In use", which
        is the same fact where it belongs.
      */}
      {canCancel
        ? exitRow(
            t("loanPage.cancelTitle"),
            t("loanPage.cancelBody"),
            /* NOT `size="large"`. It was, and that made the one destructive
               control the heaviest thing on a page whose actual jobs are
               reading a schedule and opening a card. */
            <Button danger onClick={onCancelLoan} style={styles.action}>
              {t("loanPage.cancel")}
            </Button>
          )
        : null}
    </>
  );
}

export default LoanOverview;
