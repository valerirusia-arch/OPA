// src/flows/staff-applications/application-details/ApplicationDetailsScreen.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  /**
   * A tabbed card carries no body padding: the tab bar takes the card's inset
   * and the panel under it starts where the bar's own line ends, the same
   * pattern the payments page and the back-office dashboard use.
   */
  tabbedBody: { paddingTop: 0 },
  /** A link button with antd's own padding taken off, so it ends the panel's
   *  row rather than floating in from its edge. */
  recordLink: { paddingInline: 0, height: "auto" },
  /** The cards down the page, all on one rhythm. */
  card: { marginBottom: 24 },
  /** The decision banner sits above everything, before the record itself. */
  banner: { marginBottom: 24 },
  amount: { fontSize: 16, fontWeight: 600, fontVariantNumeric: "tabular-nums" },
  /** The requested figure, struck through once an underwriter has changed it. */
  amountWas: { textDecoration: "line-through", fontVariantNumeric: "tabular-nums" },
  request: { paddingBlock: 12 },
  rule: { marginBlock: 0 },
  /** It follows the record grid rather than opening the card, so it keeps the
   *  grid's own row gap above it and nothing below. */
  note: { marginTop: 24, marginBottom: 0 },
  meta: { fontSize: 13 },
  documents: { paddingBlock: 4 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /** A quiet frame for the borrower's answer to a request. */
    answer: {
      marginTop: 12,
      padding: token.paddingSM,
      borderRadius: token.borderRadiusLG,
      background: token.colorFillQuaternary,
    },
    sectionTitle: { fontWeight: 500 },
  }) satisfies Record<string, CSSProperties>;
