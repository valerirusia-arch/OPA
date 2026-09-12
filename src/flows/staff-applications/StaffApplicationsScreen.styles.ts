// src/flows/staff-applications/StaffApplicationsScreen.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  /** Wide enough for an email address, which is the longest thing searched. */
  search: { width: 280 },
  row: { cursor: "pointer" },
  /** The applicant's name over their email: two lines, one column. */
  applicant: { minWidth: 0 },
  email: { fontSize: 12 },
  /** Lining figures so a column of amounts lines up on the decimal. */
  amount: { fontVariantNumeric: "tabular-nums" },
  id: { fontVariantNumeric: "tabular-nums", fontWeight: 500 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /** The step that flagged a row, quieter than the row's own facts. */
    routedBy: { color: token.colorTextSecondary },
  }) satisfies Record<string, CSSProperties>;
