// src/flows/staff-borrowers/StaffBorrowersScreen.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  /** The same width the Users toolbar uses, so the two pages line up. */
  search: { width: 300 },
  /** The whole row opens the record, so it says so under the pointer. */
  row: { cursor: "pointer" },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    secondary: { color: token.colorTextSecondary },
  }) satisfies Record<string, CSSProperties>;
