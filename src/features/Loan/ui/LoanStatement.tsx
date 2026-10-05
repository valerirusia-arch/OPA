// src/features/Loan/ui/LoanStatement.tsx
//
// The one thing this page exists to say, on the page's first and roomiest
// surface.
//
// WHY THE PAGE NEEDED IT. The loan page was six cards of equal weight — a
// strip of four figures, a repayment card, a card panel, a documents table, a
// cancel card — so the figure a borrower opens the page for sat inside the
// third of them at exactly the pressure of the other five. A page with no lead
// is read top to bottom at a constant effort, which is what "heavy" describes.
//
// IT IS WHITE, AND THAT WAS DECIDED THE HARD WAY. The first build put this on
// `brand.panelGradient`, the deep blue the theme has always defined; the
// designer's verdict was that a blue shape this size looks bad on the page, so
// the colour came out and everything else stayed. The lead is now carried by
// order, air and type: it comes first, it is inset 32 where the cards below get
// 24, it holds the only `figureLg` on the page, and its instalment track is
// the one saturated colour. The structure — one answer, the track, the
// contract's facts along the foot — is what fixed the reading order, not the
// blue.
//
// WHAT IT SAYS DEPENDS ON THE STAGE, and the screen decides that, not this
// component: before funding the answer is the loan's amount and the signature
// it is waiting on; once funded it is the next payment. One number per page,
// which is the rule that makes a number mean something.
//
// Dumb: it renders what it is handed, and reports the one press.

import { Button, Card, Col, Divider, Flex, Grid, Row, Typography, theme } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { InstalmentTrack } from "../../../shared/ui/InstalmentTrack";
import { getStyles, styles } from "./LoanStatement.styles";
import { cardHeadTitle } from "../../../shared/ui/cardHead.styles";

/** A label over a value, along the panel's foot. */
export type StatementFact = {
  key: string;
  label: string;
  value: string;
  /** antd Col span on a wide window. Defaults to an equal share of the row. */
  span?: number;
};

export type LoanStatementProps = {
  /**
   * THE CARD'S HEAD.
   *
   * This panel had none: it was a bare Card and its one action was pinned
   * inside the body's top-right corner. The card BESIDE it on /loan — the
   * virtual card — has an ordinary antd head, a title on the left and its
   * link on the right over a hairline, so two cards sharing a row were two
   * different shapes. *"მინდა რომ ამასაც ჰქონდეს თაითლი, როგორც მეორე
   * ფოტოზე გვაქვს."*
   *
   * With a title the action moves into `extra`, where the head puts it, and
   * the pinned slot below is not drawn.
   */
  title?: string;
  /** What the figure is. */
  label: string;
  /**
   * THIS STAGE'S ONE SENTENCE, wherever there is room for it.
   *
   * Every stage of this panel has one — the due date, "Waiting for your
   * signature", "You asked for $1,440.00" — and it has two homes, chosen by
   * whether the instalment track is drawn:
   *
   *   WITH a track, it goes beside the label: "NEXT PAYMENT · Oct 01". The
   *   space under the figure belongs to the track, and a line squeezed
   *   between them separates the number from its own picture.
   *
   *   WITHOUT one, it goes under the figure, where a caption belongs and
   *   where there is nothing else to displace.
   *
   * *"სანამ ტრეკერი იქნება, შეგვიძლია ესენი დაბლა ეწეროს; ხოლო როცა
   * ტრეკერი გამოჩნდება, მაღლა ადის ინფო."* One prop either way — the panel
   * knows which of its own parts it is drawing, and the caller does not have
   * to.
   */
  labelAside?: string;
  /** The figure. Already formatted — this component does not do money. */
  value: string;
  /*
    THE CAPTION UNDER THE FIGURE IS GONE. Every stage of this panel had one —
    the due date, "Waiting for your signature", "OPA approved this amount.
    You asked for $1,440.00." — and they all now sit beside the label as
    `labelAside`: *"ესენი ყველაფერი ზემოთ დაუწერო, როგორც თარიღი უწერია,
    ყველა სტეპზე."* One line of the panel instead of two, and the figure sits
    directly on the block under it.
  */
  /**
   * The single action the panel offers, if the stage has one.
   *
   * `emphasis` is the screen's call, because only the screen knows whether
   * the action is the point of the page: signing is the one thing a borrower
   * must do and gets the filled button, while "view the schedule" is a way
   * somewhere else and gets the outlined one.
   */
  action?: { label: string; onClick?: () => void; emphasis?: "primary" | "default" };
  /**
   * Repayment progress. Rendered only where there is repayment to report, so
   * the panel does not carry an empty track before the loan is funded.
   *
   * ONE LINE UNDER THE TRACK, NOT FOUR ELEMENTS. It was a label and a value at
   * each end — two 11px caps, two 15px figures, a 8px bar — five pieces of
   * furniture for "you are three payments into twelve and it ends in October",
   * on a panel whose job is one number. *"ზედმეტად ამძიმებს დიზაინს."* The
   * bar is thinner, the labels are gone, and the two facts are a sentence.
   */
  /**
   * COUNTS, NOT A PERCENTAGE. It was `percent`, drawn as an antd bar; it is
   * the same schedule the balance card shows, so it is now drawn the same way
   * — one capsule per instalment. *"ამაში არსებული პროგრეს ბარიც იგივენაირად
   * შევცვალოთ, როგორც იქ არის, დეშბორდზე."*
   */
  progress?: { paid: number; total: number; caption: string; ariaLabel: string };
  /** The contract's own facts, along the foot under a hairline. */
  facts?: StatementFact[];
  /**
   * Fill the height of the row it shares.
   *
   * Only ever true where it ACTUALLY shares one — filling a row that nothing
   * else is in means stretching to nothing. The card beside it takes the same
   * prop for the same reason, and the two then end level.
   */
  fill?: boolean;
  /** A last quiet line — where the flow leaves OPA, and to whom. */
  note?: string;
};

export function LoanStatement({
  title,
  label,
  labelAside,
  value,
  action,
  progress,
  facts,
  fill = false,
  note,
}: LoanStatementProps) {
  const { token } = theme.useToken();
  const s = getStyles(token);
  const screens = Grid.useBreakpoint();
  /* Wide enough for the action to sit in the panel's corner without reaching
     the figure. Narrow, it goes back into the flow, full width. Defaults to
     the corner until the breakpoint is measured — desktop-first, like the rest
     of the app — so the action does not jump from the flow to the corner on
     first paint when arriving from another page. */
  const floats = screens.md !== false;

  /* An equal share of the row unless a fact asks for more: a USCIS service
     reads "I-485 · Adjust Status / Register Permanent Residence" and a
     reference reads "A-2481", and giving those two the same width wraps the
     long one to make room for air the short one does not need. */
  const defaultSpan = facts && facts.length > 0 ? Math.floor(24 / facts.length) : 24;

  /* In the head, the action is a PLAIN link — no arrow, the same as the
     virtual card's head, so the two heads on this row still match.
     *"აროუებია აქ მოხსენით ამათ."* */
  const headAction =
    title && action ? (
      <Button type="link" style={styles.headAction} onClick={action.onClick}>
        {action.label}
      </Button>
    ) : undefined;

  return (
    <Card
      title={title}
      extra={headAction}
      style={fill ? { ...s.panel, ...styles.stretch } : s.panel}
      styles={{
        title: cardHeadTitle,
        body: fill ? { ...styles.body, ...styles.fillBody } : styles.body,
      }}
    >
      {/* Sharing a row, the blocks spread over the height instead of bunching
          at the top and leaving the foot of the panel empty. */}
      <Flex vertical gap={28} justify={fill ? "space-between" : "flex-start"} style={styles.grow}>
        {/*
          THE ACTION IS PINNED TO THE PANEL'S TOP RIGHT, and the figure block
          is left exactly as it was.

          Two earlier attempts were wrong in opposite directions: beside the
          figure it floated in the middle of the card, and ON the label's line
          it made that line 48px tall — a button's height — which pushed the
          figure down and opened a gap under the label. Out of the flow, it
          lines up with the label and costs the type nothing.
        */}
        <Flex vertical>
          <Flex vertical>
            {/* One line, two weights of the same micro-type: what the figure
                is, and the one word of context that used to sit under it.
                `baseline`, so the middot and both words share a line rather
                than centring against each other's boxes. */}
            <Flex align="baseline" gap={6} wrap style={styles.labelRow}>
              <Typography.Text style={s.label}>{label}</Typography.Text>
              {labelAside && progress ? (
                <Typography.Text style={s.labelAside}>
                  {`· ${labelAside}`}
                </Typography.Text>
              ) : null}
            </Flex>

          {/*
            TWO WEIGHTS, BOTH antd's.

            Filled where the action is the point of the page (signing, paying),
            and a BLUE LINK — no outline — where it is a way somewhere else. An
            outlined button gives "view the schedule" the same weight as the
            thing the page is asking you to do; a link carries the accent
            without the box, so "View full schedule →" reads as the way onward
            it is. *"ეს გავალურჯოთ."*
          */}
            <Typography.Text style={s.figure}>{value}</Typography.Text>
            {labelAside && !progress ? (
              <Typography.Text style={s.caption}>{labelAside}</Typography.Text>
            ) : null}
          </Flex>

          {action && !title ? (
            <div style={floats ? s.actionSlot : styles.actionBelow}>
              <Button
                size="large"
                block={!floats}
                type={action.emphasis === "primary" ? "primary" : "link"}
                onClick={action.onClick}
                /* A primary call-to-action stays centred across its full-width
                   button; a quiet link action (e.g. "View full schedule") lines
                   up on the left with the label and figure above it rather than
                   floating in the middle of the card. */
                style={
                  !floats && action.emphasis !== "primary"
                    ? styles.actionBelowText
                    : undefined
                }
              >
                <Flex
                  align="center"
                  justify={
                    !floats && action.emphasis !== "primary" ? "flex-start" : "center"
                  }
                  gap={8}
                >
                  {action.label}
                  <ArrowRightOutlined />
                </Flex>
              </Button>
            </div>
          ) : null}

          {/*
            THE TRACK BELONGS TO THE FIGURE, so it lives in the figure's own
            block rather than as the panel's second child.

            It was a sibling under a 28px gap, and once the due date came off
            the caption there was nothing between the number and the track but
            that gap — the row of capsules read as a separate section instead
            of as the same statement seen from the other end. *"ოდნავ აწიე ეს
            ტრეკერი, ციფრებთან რომ შეიკრას."* 18 binds it to the figure and
            leaves the panel's own 28 to do what it was for: separating the
            answer from the contract's small print.
          */}
          {progress ? (
            <Flex vertical gap={10} style={styles.track}>
              <InstalmentTrack
                paid={progress.paid}
                total={progress.total}
                ariaLabel={progress.ariaLabel}
              />
              <Typography.Text style={s.progressCaption}>
                {progress.caption}
              </Typography.Text>
            </Flex>
          ) : null}
        </Flex>


        {facts && facts.length > 0 ? (
          <Flex vertical>
            {/* The card's own split colour: the facts under it are detail
                about the figure above, not a second section. */}
            <Divider style={styles.rule} />
            <Row gutter={[24, 16]}>
              {facts.map((fact) => (
                <Col key={fact.key} xs={24} sm={12} lg={fact.span ?? defaultSpan}>
                  <Flex vertical gap={4}>
                    <Typography.Text style={s.factLabel}>{fact.label}</Typography.Text>
                    <Typography.Text style={s.factValue}>{fact.value}</Typography.Text>
                  </Flex>
                </Col>
              ))}
            </Row>
          </Flex>
        ) : null}

        {note ? <Typography.Text style={s.note}>{note}</Typography.Text> : null}
      </Flex>
    </Card>
  );
}

export default LoanStatement;
