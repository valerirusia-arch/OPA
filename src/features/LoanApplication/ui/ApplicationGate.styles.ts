// src/features/LoanApplication/ui/ApplicationGate.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";
import { getPageResultStyles } from "../../../shared/ui/pageResult.styles";

export const styles = {
  /** The card supplies the padding; Result would add its own on top. */
  result: { padding: 0 },
  /** A second way out, under the first. The padding comes off so the 12 the
   *  stack is set to is the 12 that shows — antd's link button carries its
   *  own, and the gap would have read as sixteen. */
  secondaryLink: { padding: 0, height: "auto" },
  /**
   * One sentence per line inside a subtitle.
   *
   * `color: inherit` is load-bearing. A bare `Typography.Text` does not
   * inherit — it sets `colorText`, full ink — so wrapping these two sentences
   * in one darkened the whole subtitle to the weight meant for the date
   * inside it, cancelling that emphasis and making this the only Result in
   * the product whose sentence is not the subtitle grey. Measured: all three
   * runs came out at 0.88.
   */
  subLine: { display: "block", color: "inherit" },
} satisfies Record<string, CSSProperties>;

/**
 * The title, sentence and action are set the way every page-sized Result in
 * the product is — see `pageResult.styles`. They lived here, and the loan and
 * payments pages' own empties had none of them, so the same moment was set
 * three different ways. Only the card's padding is this page's.
 */
export const getStyles = (token: GlobalToken) =>
  ({
    /** The invitation to begin: generous, and the only thing on the page. */
    card: { paddingBlock: token.paddingLG },
    /**
     * A run inside the sentence that should be read first — the date an
     * invitation lapses on. Ink rather than the subtitle's grey, and a half
     * step of weight with it.
     *
     * The weight was deliberately left off at first, on the reasoning that it
     * would make one sentence read as two. On its own line it does not: the
     * line IS the deadline, so the emphasis lands on the whole thought rather
     * than interrupting one. *"თარიღი სულ ოდნავ გააბოლდე."* 500 and no more
     * — Montserrat's 600 is a different voice, not a firmer one.
     */
    emphasis: { color: token.colorText, fontWeight: 500 },
    ...getPageResultStyles(token),
  }) satisfies Record<string, CSSProperties>;
