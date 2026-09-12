// src/features/Loan/ui/LoanStatement.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";
import { getFigureStyles } from "../../../shared/ui/figures.styles";

export const styles = {
  /**
   * The panel's own inset — 32 against the 24 every other card on the page
   * gets.
   *
   * THIS IS NOW THE WHOLE OF ITS EMPHASIS. The panel was built on the brand
   * gradient and the designer's verdict was that a blue shape that size looks
   * bad on the page, so the surface went back to white. What is left to make
   * it lead is what a white card can do: it comes first, it is the only thing
   * on the page set at the large figure size, its bar is the only saturated
   * colour, and it has more air inside it than anything below it.
   */
  body: { padding: 32 },
  /** Narrow, the action rejoins the flow under the figure. */
  actionBelow: { marginTop: 20 },
  /** Right-aligned text needs the alignment on the text as well as the box. */
  trailing: { textAlign: "end" },
  /** The rule above the contract's facts, at the card's own split colour. */
  rule: { marginBlock: 0, marginBottom: 24 },
  /**
   * Equal-height cards, done with flex rather than a percentage height.
   *
   * `height: 100%` on a Card is wrong twice over: a Card is head + body, so a
   * box forced to the ROW's height leaves the body only `rowHeight - head`.
   * The chain that works: the Col becomes a flex container, the Card grows
   * inside it, the Card is a flex column, and its BODY takes the remainder.
   */
  stretch: { flex: 1, display: "flex", flexDirection: "column" },
  fillBody: { flex: 1, display: "flex", flexDirection: "column" },
  grow: { flex: "1 0 auto" },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) => {
  const figures = getFigureStyles(token);
  return {
    /** No colour and no second radius: it is a card, sitting a little roomier
     *  than the cards under it. The row it sits in owns the gap below it. */
    panel: { position: "relative" },
    /**
     * The action's corner. Inset by the panel's own padding, so it lines up
     * with the label on the left and the card's edge on the right.
     *
     * A text button carries antd's own horizontal padding, which would push
     * its label in from that edge; the negative margin takes it back out so
     * the words line up with the figures under them.
     */
    actionSlot: { position: "absolute", top: 32, right: 32 - 16, zIndex: 1 },
    /** The product's label treatment, unchanged — the same one the record
     *  grids and the payments page use. */
    label: { ...figures.microLabel, display: "block", marginBottom: 8 },
    /**
     * The same label in the facts grid, without the 8 under it.
     *
     * There the gap is the Flex's own 4: a label and the figure under it are
     * one item, and 12px of air inside each item plus 20 between the rows read
     * as four loose lines rather than two rows of two.
     */
    factLabel: { ...figures.microLabel, display: "block" },
    /** The one number the page exists to answer. Same 36 as the outstanding
     *  balance on /payments. */
    figure: figures.figureLg,
    /** The line under the figure: when it is due, or what is happening now. */
    caption: { color: token.colorTextDescription, fontSize: 14, marginTop: 8 },
    /** A value in the quiet rows under the track. */
    detail: { fontWeight: 500, fontVariantNumeric: "tabular-nums" },
    /** The contract's figures along the foot. The reasoning that set 15 moved
     *  into `figures.rowValue`, where the other two multi-column rows in the
     *  product now read it from as well. */
    factValue: figures.rowValue,
    /** The line under the track: two facts at footnote weight. */
    progressCaption: { color: token.colorTextDescription, fontSize: 13 },
    /** The hand-off line — where the flow leaves OPA, and to whom. */
    note: { color: token.colorTextDescription, fontSize: 13 },
  } satisfies Record<string, CSSProperties>;
};
