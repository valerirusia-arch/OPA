// src/flows/staff-reporting/StaffReportingScreen.styles.ts

import type { CSSProperties } from "react";

export const styles = {
  /** A reading measure for the one intro line — a full-width sentence over a
   *  card of short rows is a line the eye has to travel twice. */
  lead: { display: "block", marginBottom: 16, maxWidth: 640 },
  /** Equal air on both sides of the hairline between report rows. */
  divider: { marginBlock: 16 },
  row: { width: "100%" },
  /** So a long description wraps in its own column instead of shoving the
   *  export button off the card. */
  copy: { minWidth: 0 },
  name: { fontWeight: 500 },
} satisfies Record<string, CSSProperties>;
