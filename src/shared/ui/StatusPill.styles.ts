// src/shared/ui/StatusPill.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

/** The dot's size. Small enough to be punctuation, big enough to have colour. */
const DOT = 6;

export const getStyles = (token: GlobalToken) => {
  const dot: CSSProperties = {
    width: DOT,
    height: DOT,
    borderRadius: "50%",
    flex: "none",
  };

  /**
   * THE PILL, AS IT IS EVERYWHERE EXCEPT ONE CARD.
   *
   * A tint in the state's own hue with the product's lightest line around it.
   * The line is `colorSplit` — 6% neutral ink, the same rule that separates
   * two rows of a table — and it carries no hue on purpose: antd's derived
   * `colorSuccessBorder` and `…BgHover` were both tried and both came out as
   * a hard ring, because this product's success green is a darkened one and
   * every step antd derives from it lands heavier than the number suggests.
   */
  const edge: CSSProperties = {
    border: `1px solid ${token.colorSplit}`,
    fontWeight: 500,
    paddingBlock: 1,
  };

  /**
   * THE SAME STATE WITH NOTHING AROUND IT — for the balance card alone.
   *
   * "22 days overdue" does not sit in a row of statuses there; it sits on the
   * label line of the one figure the page exists to answer, as a qualifier of
   * that number. A lozenge with a fill and an edge makes a qualifier look
   * like an object, and on a card whose whole job is one number that is the
   * second loudest thing on it. *"დეშბორდზე ვამბობდი, არ უნდა-თქო."*
   *
   * Everywhere else the fill stays: in the loan page's header, in a table
   * cell, in a list, a status IS one item among several and needs a shape to
   * be one. The horizontal padding goes with the fill here, because antd
   * insets its text 8px for a lozenge that is no longer drawn.
   */
  const bare: CSSProperties = {
    background: "transparent",
    border: "none",
    paddingInline: 0,
    marginInlineEnd: 0,
    fontWeight: 500,
  };

  return {
    /**
     * The label weight. antd's Tag is 12px/400 — at that weight a status
     * reads as a caption, and these are the words a borrower scans a table
     * for. 500 is the step the product uses everywhere something is a value
     * rather than a description.
     */
    tag: { fontWeight: 500, paddingBlock: 2 },
    edge,
    bare,
    /** The dot and the word are one line, whatever the line-height does. */
    inner: { display: "inline-flex" },
    dotSuccess: { ...dot, background: token.colorSuccess },
    dotError: { ...dot, background: token.colorError },
    dotWarning: { ...dot, background: token.colorWarning },
    dotProcessing: { ...dot, background: token.colorPrimary },
    /** Neutral: the ordinary middle of a process, not a colour worth
     *  spending. It still gets a dot, so it is visibly a STATE. */
    dotNeutral: { ...dot, background: token.colorTextQuaternary },
  } satisfies Record<string, CSSProperties>;
};
