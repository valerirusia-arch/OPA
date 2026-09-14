// src/flows/staff-dashboard/StaffDashboardScreen.styles.ts

import type { CSSProperties } from "react";

export const styles = {
  stats: { marginBottom: 32 },
  /** Fills the height its column is given, so the donut card and the table
   *  card in the same row end level. */
  fill: { height: "100%" },
  amount: { fontVariantNumeric: "tabular-nums" },
} satisfies Record<string, CSSProperties>;
