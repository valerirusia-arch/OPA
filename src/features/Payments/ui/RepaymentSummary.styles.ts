// src/features/Payments/ui/RepaymentSummary.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";
import { getFigureStyles } from "../../../shared/ui/figures.styles";

export const styles = {
  /** Fills the Col so this panel and the donut beside it share a bottom edge. */
  card: { flex: 1, display: "flex", flexDirection: "column" },
  fillBody: { flex: 1, display: "flex", flexDirection: "column" },
  /** The label and the glyph chip sit on one line, the chip at the far edge. */
  head: { width: "100%" },
  /** Pushes the tray to the panel's foot when the donut beside it is taller. */
  body: { flex: 1 },
  caption: { marginTop: 10, fontSize: 14, maxWidth: 460, display: "block" },
  /**
   * THE TRAY. A recessed strip inside the card holding the facts as their own
   * small boxes, which is the arrangement the designer sent as the reference:
   * one big figure above, a grey tray of small ones below it. It is what stops
   * a row of four label-over-value pairs reading as four more headlines.
   */
  tray: { marginTop: 28 },
  /**
   * A GRID, NOT A WRAPPING FLEX ROW, and `auto-fill` rather than `auto-fit`.
   *
   * Four facts here, five once something is past due, and a 24-column grid has
   * no even share for five. Left to flex-wrap, the fifth box was alone on the
   * second row and STRETCHED to the tray's full width — one box four times the
   * size of the four above it, which reads as a different kind of thing rather
   * than as the fifth of five. `auto-fill` keeps the empty tracks, so the odd
   * one out is drawn at exactly one column and the row simply has a gap in it.
   *
   * 150 as the minimum, and it was measured down and put back. At the panel's
   * width it lands on four columns — one tidy row for the healthy account this
   * page shows most of the time. 110 was tried to buy a phone two columns
   * instead of one, and two 112px boxes broke "$1,440.00" across two lines: a
   * money figure that wraps is worse than a tray that is four boxes tall.
   */
  facts: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: 12,
  },
  fact: { minWidth: 0 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) => {
  const figures = getFigureStyles(token);
  return {
    label: { ...figures.microLabel, display: "block" },
    /** The one figure this page exists to answer. */
    figure: { ...figures.figureLg, display: "block" },
    /** The glyph chip in the card's corner — a tinted square, the way the
     *  reference marks what the panel is about. Decoration, so it is hidden
     *  from screen readers at the call site. */
    chip: {
      width: 40,
      height: 40,
      borderRadius: token.borderRadiusLG,
      background: token.colorBgLayout,
      color: token.colorTextSecondary,
      fontSize: 18,
      flex: "none",
    },
    /** The recessed ground the small boxes sit on. */
    tray: {
      background: token.colorBgLayout,
      borderRadius: token.borderRadiusLG,
      padding: 12,
    },
    /** One fact, as its own raised box on the tray. */
    factBox: {
      background: token.colorBgContainer,
      border: `1px solid ${token.colorBorderSecondary}`,
      borderRadius: token.borderRadius,
      padding: "12px 14px",
    },
    factValue: { ...figures.figure, display: "block", marginTop: 2 },
    factValueAlarm: {
      ...figures.figure,
      display: "block",
      marginTop: 2,
      color: token.colorError,
    },
    factHint: { fontSize: 12, color: token.colorTextTertiary, display: "block", marginTop: 2 },
  } satisfies Record<string, CSSProperties>;
};
