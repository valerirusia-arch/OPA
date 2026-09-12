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
  next: { marginTop: 8, fontSize: 13 },
  /**
   * Side by side with the figure, the button is its own width — never stretched
   * by the row and never squashed by a long balance. Stacked it goes `block`
   * instead, so this is not applied there.
   */
  action: { flex: "none" },
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
  /** The bar sits apart from the caption above it and the rule below: it is
   *  its own statement, not a decoration on either. */
  progress: { marginTop: 20 },
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
    /** The line under the bar. Green, because it reports the green part —
     *  a grey caption under a coloured bar reads as a caption for the bar's
     *  container rather than for its fill. */
    progressLabel: { fontSize: 13, fontWeight: 500, color: token.colorSuccess },
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
    figure: { ...figures.figureLg, display: "block" },
  }) satisfies Record<string, CSSProperties>;
};
