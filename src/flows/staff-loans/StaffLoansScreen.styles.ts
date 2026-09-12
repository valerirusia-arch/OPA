// src/flows/staff-loans/StaffLoansScreen.styles.ts

import type { CSSProperties } from "react";

export const styles = {
  /** The same width every other back-office toolbar control uses. */
  search: { width: 300 },
  /** The status filter sits above the table, inside the card. */
  filter: { width: 240 },
  /** The whole row opens the loan, so it says so under the pointer. */
  row: { cursor: "pointer" },
} satisfies Record<string, CSSProperties>;
