// src/features/Payments/ui/NextPaymentPanel.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";
import { getFigureStyles } from "../../../shared/ui/figures.styles";

export const styles = {
  /** Fills the Col so this panel and the balance card share a bottom edge. */
  card: { flex: 1, display: "flex", flexDirection: "column" },
  /**
   * The ordinary 24, NOT the lead panel's 32.
   *
   * The inset is how this product says which card a page is for, and on
   * /payments that is the balance. Setting both at 32 would give the page two
   * leads and neither would read as the answer.
   */
  body: { padding: 24, flex: 1, display: "flex", flexDirection: "column" },
  fill: { flex: 1 },
  /** The gap under the label row, off the label itself, so a pill beside it
   *  centres against the letters rather than a taller box. */
  labelRow: { marginBottom: 8 },
  /** Clear of the figure's own line box, which stops close to the digits. */
  due: { marginTop: 6, fontSize: 14 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) => {
  const figures = getFigureStyles(token);
  return {
    label: { ...figures.microLabel, display: "block" },
    /** `figure`, not `figureLg` — the balance next door is the page's answer. */
    figure: { ...figures.figure, display: "block", fontSize: 28 },
  } satisfies Record<string, CSSProperties>;
};
