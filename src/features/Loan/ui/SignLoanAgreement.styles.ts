// src/features/Loan/ui/SignLoanAgreement.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  /** The rows draw their own rules and inset; the card's 24 would be a second
   *  frame around them. */
  listBody: { padding: "16px 24px" },
  /** In the head: no end padding, so the link aligns with the head's edge. */
  headAction: { paddingInlineEnd: 0 },
  /**
   * Air above the bar, not just below it.
   *
   * The body's own 16 put the indicator right under the head's rule — a 6px
   * bar 16px below a 1px line reads as two rules that nearly touch. 8 more
   * above it (24 from the rule) lets the bar be a thing of its own, and 8
   * below keeps it off the first document row.
   */
  progressRow: { paddingTop: 8, paddingBottom: 8 },
  /** The bar takes the room; the count keeps its own width beside it. */
  progress: { flex: 1, marginBottom: 0 },
  count: { flex: "none", fontSize: 13 },
  rule: { marginBlock: 0 },
  row: { paddingBlock: 16 },
  name: { flex: 1, minWidth: 0 },
  /** The file name ellipses instead of pushing the button off the row. */
  nameText: { minWidth: 0 },
  meta: { fontSize: 13 },
  action: { flex: "none" },
  /** The hand-off line, at the foot of the documents it applies to. 24 rather
   *  than 16 now that no rule separates it from the last row: with a line
   *  there, 16 was enough; without one, the gap IS the separation. */
  handoff: { paddingTop: 24 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /** The file's own marker: a square, so signed and unsigned rows keep the
     *  same left edge whichever they are. */
    icon: {
      width: 36,
      height: 36,
      flex: "none",
      borderRadius: token.borderRadius,
      background: token.colorFillQuaternary,
      color: token.colorTextTertiary,
    },
    iconDone: {
      width: 36,
      height: 36,
      flex: "none",
      borderRadius: token.borderRadius,
      background: token.colorSuccessBg,
      color: token.colorSuccess,
    },
    /** The padlock beside DocuSign's sentence: a mark, not a warning. */
    handoffIcon: { color: token.colorTextTertiary, flex: "none" },
  }) satisfies Record<string, CSSProperties>;
