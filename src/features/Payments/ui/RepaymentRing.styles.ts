// src/features/Payments/ui/RepaymentRing.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";
import { getFigureStyles } from "../../../shared/ui/figures.styles";

/** The legend's marks. The same 8px disc the status pills use, so a colour
 *  means the same thing here as it does anywhere else in the product. */
const DOT = 8;

export const styles = {
  /** The legend spans the ring's own width, so its values line up on one
   *  right edge instead of trailing after three labels of different lengths. */
  legend: { width: "100%", maxWidth: 260 },
  /** The dot and the word stay together; only the gap after them stretches. */
  legendName: { flex: "none" },
  legendLabel: { fontSize: 13 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) => {
  const figures = getFigureStyles(token);
  const dot: CSSProperties = {
    width: DOT,
    height: DOT,
    borderRadius: "50%",
    flex: "none",
  };
  return {
    /**
     * The number in the middle of the ring.
     *
     * `figureLg`'s weight at a size that fits a 168px circle: it is the one
     * thing the ring exists to say, but it is not the page's answer — the
     * outstanding balance beside it is — so it does not take the full 36.
     */
    centre: { ...figures.figureLg, fontSize: 30, lineHeight: 1.1 },
    /** The word under it, at the product's own label treatment. */
    centreLabel: { ...figures.microLabel, display: "block" },
    dotPaid: { ...dot, background: token.colorSuccess },
    dotOverdue: { ...dot, background: token.colorError },
    dotLeft: { ...dot, background: token.colorFillSecondary },
    /** The dotted rule between a label and its value. `flex: 1` so it is
     *  exactly as long as the gap; sat on the baseline so it reads as a rule
     *  under the words rather than as a line through them. */
    leader: {
      flex: 1,
      borderBottom: `1px dashed ${token.colorSplit}`,
      transform: "translateY(-4px)",
    },
    legendValue: { fontSize: 13, fontWeight: 500, fontVariantNumeric: "tabular-nums" },
    /** The one line that is a problem takes the problem's ink. */
    legendValueAlarm: {
      fontSize: 13,
      fontWeight: 600,
      fontVariantNumeric: "tabular-nums",
      color: token.colorError,
    },
  } satisfies Record<string, CSSProperties>;
};
