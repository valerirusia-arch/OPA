// src/flows/staff-dashboard/StaffDashboardScreen.styles.ts

import type { CSSProperties } from "react";

export const styles = {
  /** The gap between the page's stacked bands (stats, shortcuts, table). */
  section: { marginBottom: 32 },
  /** A responsive grid of shortcut tiles: each grows to fill the row but never
   *  narrower than ~200px, so they reflow from a single row on a wide screen to
   *  a stack on a phone. */
  shortcut: {
    flex: "1 1 200px",
    height: 52,
    justifyContent: "flex-start",
  },
  amount: { fontVariantNumeric: "tabular-nums" },
} satisfies Record<string, CSSProperties>;
