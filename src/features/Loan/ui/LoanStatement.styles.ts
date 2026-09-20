// src/features/Loan/ui/LoanStatement.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";
import { getFigureStyles } from "../../../shared/ui/figures.styles";
import { LEAD_PANEL_INSET, leadPanelBody } from "../../../shared/ui/panel.styles";

export const styles = {
  /** In the head: no end padding, so the link aligns with the head's own
   *  edge — the same as the virtual card's. */
  headAction: { paddingInlineEnd: 0 },
  /**
   * The lead card's inset — 32 against the 24 every ordinary card gets.
   *
   * THIS IS THE WHOLE OF THE PANEL'S EMPHASIS. It was built on the brand
   * gradient and the designer's verdict was that a blue shape that size looks
   * bad on the page, so the surface went back to white. What is left to make
   * it lead is what a white card can do: it comes first, it is the only thing
   * on the page set at the large figure size, its bar is the only saturated
   * colour, and it has more air inside it than anything below it.
   *
   * The value moved to shared/ui/panel.styles.ts, because the rule was
   * written here and obeyed only here — the balance card is the lead of two
   * other pages and was sitting at 24.
   */
  body: leadPanelBody,
  /** Narrow, the action rejoins the flow under the figure. */
  actionBelow: { marginTop: 20 },
  /** A left-aligned text action: no inner padding and its content pinned to the
   *  start, so the label sits flush with the figure and label above it instead
   *  of centred (antd centres a block button's content by default). */
  actionBelowText: { paddingInline: 0, textAlign: "start", justifyContent: "flex-start" },
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
  /** The micro-label's own line box — its size at the body's line height.
   *  Read from the two of them rather than written down, so a change to either
   *  keeps the action level with the label. */
  const labelLine = Number(figures.microLabel.fontSize) * token.lineHeight;

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
    actionSlot: {
      position: "absolute",
      /*
        LEVEL WITH THE LABEL, not with the top of the panel.

        `top: LEAD_PANEL_INSET` lined up the button's BOX with the label's box,
        and a `size="large"` button is 48px tall against the micro-label's ~18 —
        so its words landed fifteen pixels lower, level with nothing, adrift
        between the label and the figure. *"View full schedule მინდა რომ next
        payment-ის სიმაღლეზე იყოს."*

        Centring the taller box on the shorter line is the arithmetic below.
        The button has no fill, so the part of it that reaches above the panel's
        inset draws nothing — only its words move.
      */
      top: LEAD_PANEL_INSET + (labelLine - token.controlHeightLG) / 2,
      right: LEAD_PANEL_INSET - 16,
      zIndex: 1,
    },
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
