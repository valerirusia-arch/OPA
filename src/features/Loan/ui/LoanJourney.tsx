// src/features/Loan/ui/LoanJourney.tsx
//
// Where this loan has got to, drawn as the rail it is.
//
// NOT ON /loan, AND NOT DEAD EITHER. The designer took it off the loan page —
// *"ეს აქ არ დაგვჭირდება, ესეთი დეშბორდზე გვექნება"* — because that page
// already answers "where am I" with the two pills beside its title and the
// statement under them, and two things telling one story is how they start
// disagreeing. It is kept for the Dashboard, whose epic is not built yet, so
// nothing imports it today. Delete it only if that decision is reversed.
//
// The state of the whole page used to reach the reader as two small grey pills
// in the top right corner — "Approved" and "Funded" — which is the least
// legible way to answer the first question a borrower opens this page with.
// A rail answers it before they have read a single figure: the ticks are
// behind you, the filled one is now, the grey ones are ahead.
//
// NOTHING NEW IS STATED HERE. Every step is a state the WBS already names and
// the page already held:
//
//   application (no loan yet) — story 3's own list, "Submitted, Under Review,
//     Pending action, Approved, declined". Pending action and Co-borrower
//     required are not phases of their own; they are what the review is
//     waiting on, so they appear as the current step's line rather than as
//     extra steps nobody else passes through.
//   loan — the `LoanStage` union: awaitingSignature, funding, funded,
//     cancelled. The fourth step is repayment, and it is read off the schedule
//     the page already holds ("if a payment was completed", Manage Payments
//     story 2), not from a new field.
//
// ─────────────────────────────────────────────────────────────────────────
// IT IS A VERTICAL TIMELINE NOW, AND IT WAS A HORIZONTAL RAIL.
//
// The rail was antd's `Steps`, laid across whatever width it was given. On a
// half-width card that was fine; given the whole 1216 column it became four
// small labels adrift on three enormous connectors, which is the failure mode
// of every horizontal stepper — *"პროგრესი ესე არ მომწონს ამ სიგრძეზე"* —
// and the designer's verdict went further than the width: *"საერთოდ არ
// მომწონს ეგეთი პროგრეს ტრეკერი."*
//
// The shape a status tracker actually wants is the one every order-tracking
// and application-status screen converged on, and for a reason: DOWN, not
// across. A vertical rail is indifferent to the width it is given, so it can
// sit in a half-width card or a phone with no second layout; it has room
// beside each step for the line of context that says what the step is waiting
// on, which a horizontal one has to drop or wrap; and reading order and time
// order become the same direction.
//
// THE ICONS ARE ONE FAMILY, and they were not.
//
// The first set reached for whatever named the step most literally — an audit
// ledger, a signed form, a certificate with a seal, a solution document — and
// three of them were the same busy rectangle-with-a-person at 15px, all hard
// corners and internal detail. Against a product built on soft radii and open
// shapes they read as clip art: *"სტილიც არაცდენილია, ჩვენ არ გვაქვს შარპ
// კუთხეები."*
//
// The rule now is the shape, not the noun: ONE outline weight, round or
// soft-cornered silhouettes, and as little inside the glyph as the meaning
// allows. A clock beats an audit ledger for "under review" on both counts —
// it is a circle, and waiting is what the step actually is.
//
// EVERY STEP WEARS ITS OWN ICON, in a 34px disc with a dimmed ring around it.
// It was a 20px tick, a ring and an empty ring — correct, and four words
// against a white wall. The icon says what the step IS before the word is
// read, the disc gives the panel mass, and the halo is what stops four discs
// reading as four bullets.
//
// State is carried by the disc's colour and by the weight of the title beside
// it: green behind you, the accent where you are, the page's own fill ahead.
// And a completed step swaps its icon for a tick — *"რაც დაეპრუვდება,
// მოპწიჩკე"* — because what a finished step has left to say is only that it
// finished.
//
// The line is solid where BOTH its ends are behind the reader and dotted
// everywhere else — including the segment running into the step they are
// standing in, which has been reached but not finished.
//
// WHAT DID NOT CHANGE: which steps exist and which one you are on. That is
// WBS-derived and it is the part worth keeping — see the two rail functions
// below.
//
// Dumb: it renders the state it is given.

import type { ReactNode } from "react";
import { Flex, Typography, theme } from "antd";
import {
  CheckOutlined,
  CreditCardOutlined,
  DollarCircleOutlined,
  EditOutlined,
  SafetyOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { useT } from "../../../shared/ui/i18n/useT";
import type { ApplicationStatus } from "../../Borrowers/ui/types";
import { getStyles, styles } from "./LoanJourney.styles";
import type { LoanStage } from "./types";

export type LoanJourneyProps = {
  /** The application's status. Read when there is no loan yet. */
  status: ApplicationStatus;
  /** The loan's stage, once there is a loan. Takes over from `status`. */
  stage?: LoanStage;
  /**
   * How much of the schedule is paid.
   *
   * Not printed — the statement says "3 of 12" under PAYMENTS MADE, and the
   * rail is not the place to say it twice. It decides one thing: whether the
   * last step is the one you are ON or the one you have finished.
   */
  paid?: { count: number; total: number };
  /**
   * WHEN EACH STEP HAPPENED, keyed by the step it belongs to.
   *
   * Right-aligned against the step's title, which is where a tracker puts a
   * date and the reason its rows have two edges instead of one. Supplied by
   * the screen because the dates live on the record, not here.
   *
   * ONLY COMPLETED STEPS ARE DATED, whatever this map contains. The record
   * can hold a date for a step the loan has not reached — a funding date on
   * a loan still waiting for its signature — and printing it would be the
   * tracker reporting a future event in the past tense. The step's state
   * decides; the map only supplies.
   */
  dates?: Partial<Record<string, string>>;
  /**
   * WHAT THE STEP IS WAITING ON, keyed by step.
   *
   * The rail's own titles say where the loan is; they do not say what has to
   * happen for it to move, and that is the question a borrower opens this
   * panel with — *"ამ ეტაპზე უნდა დაველოდოთ ქო-ბოროვერს, ამ ეტაპზე უნდა
   * დაველოდოთ ადმინებს"*. Supplied by the screen because the wording is the
   * WBS's and the facts are the record's.
   *
   * ONLY THE CURRENT STEP GETS ONE. A note under a step three moves away is
   * not guidance, it is a rail that talks the whole way down.
   */
  notes?: Partial<Record<string, string>>;
};

export function LoanJourney({ status, stage, paid, dates, notes }: LoanJourneyProps) {
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);

  /* NO NARROW VARIANT, AND NO BREAKPOINT. The rail needed one because four
     titles across a 375px phone are a smudge; down the page they are four
     lines, at any width there has ever been. */

  /*
    ONE RAIL, FOUR STEPS, FROM THE FIRST DAY.

    It used to be two rails: three steps while the application was with
    underwriting (Submitted, Under review, Decision) and a different four once
    there was a loan (Approved, Signed, Funded, Repaid). Two shapes for one
    journey, and the shape changed under the reader exactly when they were
    most anxious about where they stood. *"თავიდანვე 4 სტეპი უნდა ჩანდეს, ის
    სტეპები რაც გასავლელი აქვთ."*

    So the four are the four, always, and on day one three of them are ahead.
    That is the point: a borrower can see the whole road before they are on
    it.

    "Submitted" is not one of them because it is not a step you wait through —
    you cannot be anywhere on this rail without having applied. What the old
    rail said in its own steps, this one says in the line under the step it is
    about: under review, pending action, waiting on a co-borrower, declined.
    Nothing was dropped; it moved to where it belongs.
  */
  const items: { key: string; title: string; icon: ReactNode; content?: string }[] = [
    {
      key: "approved",
      title: t("application.approved"),
      icon: <SafetyOutlined />,
      /* WHAT THE DECISION IS WAITING ON, while it is still the current step.
         These four were three separate rail steps before, which made a
         borrower whose co-borrower had not answered look like they were one
         step further along than one still under review. They are the same
         step; only the reason differs. */
      content: stage
        ? notes?.approved
        : status === "pendingAction"
          ? t("application.pendingAction")
          : status === "coBorrower"
            ? t("application.coBorrower")
            : status === "declined"
              ? t("application.declined")
              : t("application.review"),
    },
    {
      key: "signed",
      title: t("loanPage.journeySigned"),
      icon: <EditOutlined />,
      content: notes?.signed,
    },
    /* The card is what "funded" MEANS here: OPA does not hand over cash, it
       issues a card restricted to the filing fee. */
    {
      key: "funded",
      title: t("loanPage.stageFunded"),
      icon: <CreditCardOutlined />,
      content: notes?.funded,
    },
    /* NO SECOND LINE UNDER THE LAST STEP. It carried "3 of 12", which the
       PAYMENTS tile already states — a fact printed twice. */
    {
      key: "repaid",
      title: t("loanPage.journeyRepaid"),
      icon: <DollarCircleOutlined />,
      content: notes?.repaid,
    },
  ];

  const rail: {
    items: { key: string; title: string; icon: ReactNode; content?: string }[];
    current: number;
    /** Set where the current step is an outcome nobody wanted. */
    failed?: boolean;
  } = stage ? loanRail() : applicationRail();

  function loanRail() {
    /* Cancelled is not "further along than funded" — it is the end of the
       line, and the only state that changes the rail's own shape, because a
       journey that has stopped does not still have a repayment step. */
    if (stage === "cancelled")
      return {
        items: [
          items[0],
          items[1],
          {
            key: "cancelled",
            title: t("loanPage.stageCancelled"),
            icon: <StopOutlined />,
          },
        ],
        current: 2,
        failed: true,
      };

    if (stage === "awaitingSignature") return { items, current: 1 };
    if (stage === "funding") return { items, current: 2 };
    /* Funded: repayment is under way, and it is finished only once the last
       instalment is paid — at which point the whole rail is behind you. */
    const repaid = paid !== undefined && paid.total > 0 && paid.count === paid.total;
    return { items, current: repaid ? 4 : 3 };
  }

  /* No loan yet: the whole rail is ahead, and the reader is standing on the
     first of it — whatever underwriting happens to be waiting for. */
  function applicationRail() {
    return { items, current: 0, failed: status === "declined" };
  }

  return (
    <Flex vertical>
      {rail.items.map((item, index) => {
        const isLast = index === rail.items.length - 1;
        const done = index < rail.current;
        const isCurrent = index === rail.current;
        /* antd applied `status` to the current step only, and the same is
           true here: a declined application HAS a decision, and it is not a
           pending one. */
        const failed = isCurrent && rail.failed === true;

        return (
          <Flex key={item.key} gap={14}>
            {/* THE MARKER AND ITS LINE ARE ONE COLUMN, and the line is
                `flex: 1`, so it reaches exactly to the next marker whatever
                the step beside it happens to be tall. */}
            <Flex vertical align="center" style={styles.markerColumn}>
              <Flex
                align="center"
                justify="center"
                style={failed ? s.failed : done ? s.done : isCurrent ? s.current : s.ahead}
              >
                {/* A STEP THAT IS DONE WEARS A TICK, not its own icon.
                    The icon says what the step IS, which is worth a glyph
                    while it is still ahead of you or under way; once it has
                    happened the only thing left to say is that it happened,
                    and a tick says that without being read. */}
                {failed ? <StopOutlined /> : done ? <CheckOutlined /> : item.icon}
              </Flex>
              {/* THE LINE BELONGS TO THE STEP ABOVE IT. Solid where that
                  step is done, dotted where it is not — so a marker and the
                  line leaving it always describe the same thing. A pass that
                  dotted the segment INTO the current step was reading the
                  line as belonging to the step below, which put a dotted line
                  under a finished step. */}
              {isLast ? null : (
                <span style={done ? s.connectorDone : s.connectorAhead} />
              )}
            </Flex>

            <Flex
              justify="space-between"
              align="flex-start"
              gap={16}
              style={isLast ? styles.copyLast : styles.copy}
            >
              <Flex vertical gap={2} style={styles.words}>
              <Typography.Text
                style={
                  failed
                    ? s.titleFailed
                    : isCurrent
                      ? s.titleCurrent
                      : done
                        ? s.titleDone
                        : s.titleAhead
                }
              >
                {item.title}
              </Typography.Text>
              {/* WHAT THE STEP IS WAITING ON, where anything is waiting. The
                  horizontal rail could only hang this under a title in a
                  column one word wide; here it is a line of prose with a line
                  of prose's room. */}
              {item.content ? (
                <Typography.Text type="secondary" style={styles.content}>
                  {item.content}
                </Typography.Text>
              ) : null}
              </Flex>

              {/* THE DATE AT THE FAR EDGE — and ONLY on a step that has
                  happened. A date beside "Funded" while the loan is still
                  waiting on a signature is the tracker reporting a future
                  event in the past tense, which is the one thing a status
                  tracker cannot do. The record may well hold the field; it is
                  the step's own state that decides whether it is true yet. */}
              {done && dates?.[item.key] ? (
                <Typography.Text style={s.meta}>{dates[item.key]}</Typography.Text>
              ) : null}
            </Flex>
          </Flex>
        );
      })}
    </Flex>
  );
}

export default LoanJourney;
