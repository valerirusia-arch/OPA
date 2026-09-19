// src/flows/staff-applications/application-details/ApplicationDetailsScreen.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  /**
   * The tab bar sits INSIDE the card's body, under its title — so it reads as
   * a control belonging to this card rather than to the page. It pulls itself
   * up by the body's own top padding, so the bar sits where the content would
   * have started.
   */
  checksTabs: { marginTop: -8 },
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
