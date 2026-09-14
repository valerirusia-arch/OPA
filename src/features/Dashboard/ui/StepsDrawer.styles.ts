// src/features/Dashboard/ui/StepsDrawer.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  /**
   * A ghost Collapse pads its header 12px from the left, which would step the
   * drawer in from everything above it. The negative inline margin takes the
   * panel back out to its container's edge.
   */
  flush: { marginInline: -12 },
  list: { width: "100%" },
  /** The name and its line wrap inside their own column rather than pushing
   *  the date and the tick off the row. */
  copy: { minWidth: 0 },
  /** Pinned to the top of the row so the date sits on the step's NAME and not
   *  halfway down the sentence under it. */
  end: { flex: "none", paddingTop: 1 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /** Shut, and open. `motionDurationMid` is antd's own, so the turn is the
     *  same speed as every other disclosure in the product. */
    arrow: {
      fontSize: 11,
      color: token.colorText,
      transition: `transform ${token.motionDurationMid}`,
    },
    arrowOpen: {
      fontSize: 11,
      color: token.colorText,
      transform: "rotate(90deg)",
      transition: `transform ${token.motionDurationMid}`,
    },
    /**
     * One finished step. Hairlines between them rather than around them, so
     * the list reads as a record and not as four more cards — and none under
     * the last row, which would be a rule with nothing beneath it.
     *
     * 16 rather than 10: each row carries two lines, and at 10 the rule above
     * a row sat closer to the sentence of the row ABOVE it than to the name it
     * was introducing.
     */
    row: {
      width: "100%",
      paddingBlock: 16,
      borderTop: `1px solid ${token.colorSplit}`,
    },
    step: { fontSize: 14, color: token.colorText },
    /** What the step was, past tense. One step down from the name, at the
     *  size the live step's own sentence takes. */
    note: { fontSize: 13, color: token.colorTextTertiary },
    date: {
      fontSize: 13,
      color: token.colorTextTertiary,
      fontVariantNumeric: "tabular-nums",
    },
    /** Green, and the only green on the band. */
    tick: { color: token.colorSuccess, fontSize: 15 },
  }) satisfies Record<string, CSSProperties>;
