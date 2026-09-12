// src/flows/staff-applications/application-details/ApplicationDetailsScreen.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  /** The cards down the page, all on one rhythm. */
  card: { marginBottom: 24 },
  /** The decision banner sits above everything, before the record itself. */
  banner: { marginBottom: 24 },
  amount: { fontSize: 20, fontWeight: 600, fontVariantNumeric: "tabular-nums" },
  /** The requested figure, struck through once an underwriter has changed it. */
  amountWas: { textDecoration: "line-through", fontVariantNumeric: "tabular-nums" },
  request: { paddingBlock: 12 },
  rule: { marginBlock: 0 },
  note: { display: "block", marginTop: 4 },
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
