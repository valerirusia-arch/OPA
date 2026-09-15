// src/features/Payments/ui/BalanceSummary.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";
import { getFigureStyles } from "../../../shared/ui/figures.styles";

export const styles = {
  /**
   * Grows to fill the card body; never shrinks below its own content.
   *
   * It was `flex: 1`, which is `1 1 0%` — grow, SHRINK, and a zero basis. In a
   * column flex container that lets the block be compressed under its content,
   * and on a phone, where the three detail figures wrap onto two rows, the
   * last one was drawn 27px OUTSIDE the card, across the head of the card
   * below. `1 0 auto` fills the row where there is one to fill and refuses to
   * squash where there is not.
   */
  panel: { flex: "1 0 auto" },
  /** The ground the pinned action is positioned against. */
  relative: { position: "relative" },
  /** Top right of the panel, level with the label — the loan statement's own
   *  arrangement. */
  actionSlot: { position: "absolute", top: 0, right: 0, zIndex: 1 },
  /**
   * The line beside the figure — 14, the size the loan page's statement sets
   * the same line at.
   *
   * It was 13, which put "Next payment $120.65 due Jan 01, 2027" a step below
   * "Due Jan 01, 2027" on the other page. Same sentence, same job, two sizes.
   *
   * TWO OF THEM, because the caption sits in two places. Under the figure it
   * needs its own gap — `figureLg` is set at 1.15 leading, so the number's
   * box stops almost at the digits and without a margin the line is against
   * their feet. Beside the figure the gap is the row's, and a margin there
   * would drop the caption off the baseline it is meant to share.
   */
  next: { marginTop: 10, fontSize: 14 },
  /** The figure and its caption, side by side. `wrap` is the safety net for a
   *  very long balance in a narrow card: the caption drops under rather than
   *  pushing the number out of the card. */
  figureRow: { width: "100%" },
  /**
   * The small print beside the figure.
   *
   * `flex: none` so the group is only as wide as its three facts: left to
   * grow it would stretch to the card's edge and reopen the gaps this change
   * closed. It wraps under the figure rather than squeezing when the card is
   * narrow — three labels at 11px do not survive being crushed.
   */
  aside: { flex: "none" },
  /**
   * Side by side with the figure, the button is its own width — never stretched
   * by the row and never squashed by a long balance. Stacked it goes `block`
   * instead, so this is not applied there.
   */
  action: { flex: "none" },
  /** "Make a payment" as a quiet blue text link, flush with the figure above
   *  it — not a filled button competing with the balance for attention. */
  payLink: { flex: "none", alignSelf: "flex-start", paddingInline: 0, height: "auto" },
  /** The rule above the three details, at the card's own split colour. */
  /**
   * THE RULE BETWEEN THE ANSWER AND ITS SMALL PRINT.
   *
   * It had no top margin at all, so it sat about 16px under the caption and
   * about 34 above the figures below — a line closer to the block it is
   * separating FROM than to the one it separates TO, which stops reading as a
   * boundary and starts reading as an underline of the sentence above it.
   * *"სტროუკი და ტექსტი ახლო-ახლოს არიან."*
   *
   * 32 above and 20 below, which lands even: the Row under it carries a 20px
   * vertical gutter, so its first label starts 30 clear of the line.
   */
  rule: { marginTop: 32, marginBottom: 20 },
  /** The three details: readable, and clearly not the headline. */
  /** The gap under the label row, moved off the label itself — see
   *  `labelInline`. */
  labelRow: { marginBottom: 8 },
  /**
   * 28 above the schedule.
   *
   * It was 20, measured from the figure's own line box — and `figureLg` is
   * set at 1.15 leading, so a 46px number's box stops almost at the digits
   * and the real gap a reader sees was closer to 14. The row of capsules is
   * its own statement about the loan, not a rule under the balance, and it
   * has to be clear of the number to read as one.
   */
  progress: { marginTop: 28 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) => {
  const figures = getFigureStyles(token);
  return ({
    label: { ...figures.microLabel, display: "block", marginBottom: 8 },
    /**
     * The same label with no bottom gap, for the row that carries the state
     * pill beside it.
     *
     * The 8 belongs to the ROW there: left on the word, the pill centres
     * against a box 8px taller than the letters and sits visibly high.
     */
    labelInline: { ...figures.microLabel, display: "block" },
    /**
     * The line under the segments.
     *
     * QUIET, not green. It was green while it read "25%", which described the
     * filled part; it counts segments now, and a caption for a whole row is
     * not a caption for the coloured half of it.
     */
    progressLabel: { fontSize: 13, fontWeight: 500, color: token.colorTextTertiary },
    /** The three (or four) figures under the rule. `figures.rowValue` — the
     *  same step the loan statement's fact row and the dashboard's tiles
     *  take, because all three are a value under a micro-label in a row. */
    detail: figures.rowValue,
    /** The past-due figure. The only one of the four that is a problem, so
     *  it is the only one that is not the page's ordinary ink. */
    detailAlarm: { ...figures.rowValue, color: token.colorError },
    /**
     * The one number this page exists to answer, so the larger step.
     *
     * It was 36 here and 32 on the loan page's next payment and 28 on the
     * metric cards — three sizes for one idea. Now there are two, and which
     * one a figure gets is a question about the page, not about the component.
     */
    /**
     * The figure, at the product's own `figureLg`.
     *
     * This is the size /loan sets its next payment at, and the two pages sit
     * one click apart — a balance at one size on /payments and at another on
     * /loan is the kind of difference nobody names and everybody feels.
     */
    figure: { ...figures.figureLg, display: "block" },
    /**
     * The same figure where the card LEADS a page rather than sitting in it.
     *
     * Only the dashboard's, where the balance is the first thing on the
     * screen and the only thing at its rank. It was applied to the component
     * itself at first, which quietly grew /payments' balance too and broke
     * the very consistency it was meant to serve. Clamped because 46 of
     * tabular digits wraps on a phone.
     */
    figureHero: {
      ...figures.figureLg,
      display: "block",
      fontSize: "clamp(36px, 4.2vw, 46px)",
    },
  }) satisfies Record<string, CSSProperties>;
};
