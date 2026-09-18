// src/features/Dashboard/ui/StageFoot.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  /**
   * No inset of its own.
   *
   * This block is a child of the balance card's body, which is a LEAD panel
   * at 32 — so it already sits at the page's wide inset, and adding a second
   * one here would step the foot in from the figures directly above it.
   */
  root: {},
  /** The heading row. 8 under it, which is the gap the band's own heading
   *  keeps above the line that follows it. */
  head: { marginBottom: 8 },
  /* A touch lighter than antd's 600 Title. This heading — "Repayment started",
     "Funding", the step's own name — sits on a card that has just stated the
     balance in the page's one big figure; a 600 heading under that competes
     with it. 500 still reads as a heading, just not a second bold thing on the
     card. *"ბოლდნესი ცოტა უფრო დააკელი ამ თაითლს."* */
  title: { marginTop: 0, marginBottom: 0, fontWeight: 500 },
  /* The drawer pulls ITSELF back out to the card's edge — StepsDrawer's
     `flush` prop is on by default and carries the -12 that cancels antd's
     Collapse padding. A second copy of that number here would be one more
     place to fix it if the Collapse ever changes. */
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) => {
  return {
    /**
     * The joint between what the loan costs and where the loan is.
     *
     * Equal air on both sides, and the same 24 the band uses between its rail
     * and its heading — the two blocks are the same pair in the same order,
     * so they should not be spaced differently just because one of them has
     * moved onto another card.
     */
    rule: {
      height: 1,
      background: token.colorSplit,
      marginBlock: 24,
    },

    /** Whose move it is, matching the band's tag exactly: the reader meets
     *  this pill before funding and should not have to re-learn it after. */
    ownerTag: { fontWeight: 500, paddingBlock: 1 },

    /** The drawer's line, in the product's ink at 500 — the same weight and
     *  colour as the band's own handle and as /payments' collapsible. */
    historyLabel: { fontWeight: 500, color: token.colorText },
  } satisfies Record<string, CSSProperties>;
};
