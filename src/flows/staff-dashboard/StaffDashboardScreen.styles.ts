// src/flows/staff-dashboard/StaffDashboardScreen.styles.ts

import type { CSSProperties } from "react";

export const styles = {
  /** The gap between the page's stacked bands (stats, then the table). */
  section: { marginBottom: 32 },
  /** The tab bar sits atop the flush table card — the payments page's pattern:
   *  24px inset to line up with the rows, no gap before the table below. */
  tabBar: { paddingInline: 24, marginBottom: 0 },
  /** Rows open their record, like every other back-office list. */
  row: { cursor: "pointer" },
  amount: { fontVariantNumeric: "tabular-nums" },
} satisfies Record<string, CSSProperties>;
