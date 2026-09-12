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
// 24, it holds the only `figureLg` on the page, and its progress bar is the one
// saturated colour. The structure — one answer, the track, the contract's facts
// along the foot — is what fixed the reading order, not the blue.
//
// WHAT IT SAYS DEPENDS ON THE STAGE, and the screen decides that, not this
// component: before funding the answer is the loan's amount and the signature
// it is waiting on; once funded it is the next payment. One number per page,
// which is the rule that makes a number mean something.
//
// Dumb: it renders what it is handed, and reports the one press.

import { useEffect, useState } from "react";
import { Button, Card, Col, Divider, Flex, Grid, Progress, Row, Typography, theme } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { getStyles, styles } from "./LoanStatement.styles";

/** A label over a value, along the panel's foot. */
export type StatementFact = {
  key: string;
  label: string;
  value: string;
  /** antd Col span on a wide window. Defaults to an equal share of the row. */
  span?: number;
};

export type LoanStatementProps = {
  /** What the figure is. */
  label: string;
  /** The figure. Already formatted — this component does not do money. */
  value: string;
  /** One line under the figure: when it is due, or what is happening. */
  caption?: string;
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
  progress?: { percent: number; caption: string; ariaLabel: string };
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
  label,
  value,
  caption,
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
     the figure. Narrow, it goes back into the flow, full width. */
  const floats = screens.md === true;

  /*
    THE PAGE'S ONE PIECE OF MOTION.

    The track fills from nothing to where the borrower actually is, once, on
    arrival — antd transitions the bar's width itself, so this is a state
    change and not an animation library. It earns its place because the bar is
    the only element here whose MEANING is a movement: you are three payments
    into twelve and heading one way. Nothing else on the page moves.
  */
  const target = progress?.percent ?? 0;
  const [filled, setFilled] = useState(0);

  useEffect(() => {
    const id = window.setTimeout(() => setFilled(target), 90);
    return () => window.clearTimeout(id);
  }, [target]);

  /* An equal share of the row unless a fact asks for more: a USCIS service
     reads "I-485 · Adjust Status / Register Permanent Residence" and a
     reference reads "A-2481", and giving those two the same width wraps the
     long one to make room for air the short one does not need. */
  const defaultSpan = facts && facts.length > 0 ? Math.floor(24 / facts.length) : 24;

  return (
    <Card
      style={fill ? { ...s.panel, ...styles.stretch } : s.panel}
      styles={{ body: fill ? { ...styles.body, ...styles.fillBody } : styles.body }}
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
            <Typography.Text style={s.label}>{label}</Typography.Text>

          {/*
            TWO WEIGHTS, BOTH antd's.

            Filled where the action is the point of the page (signing, paying),
            and TEXT — no outline — where it is a way somewhere else. An
            outlined button gives "view the schedule" the same weight as the
            thing the page is asking you to do, and boxes a label that reads
            perfectly well on its own.
          */}
            <Typography.Text style={s.figure}>{value}</Typography.Text>
            {caption ? (
              <Typography.Text style={s.caption}>{caption}</Typography.Text>
            ) : null}
          </Flex>

          {action ? (
            <div style={floats ? s.actionSlot : styles.actionBelow}>
              <Button
                size="large"
                block={!floats}
                type={action.emphasis === "primary" ? "primary" : "text"}
                onClick={action.onClick}
              >
                <Flex align="center" justify="center" gap={8}>
                  {action.label}
                  <ArrowRightOutlined />
                </Flex>
              </Button>
            </div>
          ) : null}
        </Flex>

        {progress ? (
          <Flex vertical gap={10}>
            {/* The theme's own primary on its own rail. 6px: enough to be a
                bar rather than a hairline, not so much that it competes with
                the figure above it. */}
            <Progress
              percent={filled}
              showInfo={false}
              size={{ height: 6 }}
              aria-label={progress.ariaLabel}
            />
            <Typography.Text style={s.progressCaption}>
              {progress.caption}
            </Typography.Text>
          </Flex>
        ) : null}

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
