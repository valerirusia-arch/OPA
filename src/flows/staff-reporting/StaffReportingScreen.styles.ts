// src/flows/staff-reporting/StaffReportingScreen.styles.ts

import type { CSSProperties } from "react";

export const styles = {
  /** A reading measure for the one intro line — a full-width sentence over a
   *  card of short rows is a line the eye has to travel twice. */
  /* Subtitle of the page title: pulled up under it so the gap reads as ~8px,
     not the full block the title row keeps below itself. */
  lead: { display: "block", marginTop: -16, marginBottom: 20, maxWidth: 640 },
  /** Equal air on both sides of the hairline between report rows. */
  divider: { marginBlock: 16 },
  row: { width: "100%" },
  /** So a long description wraps in its own column instead of shoving the
   *  export button off the card. */
  copy: { minWidth: 0 },
  name: { fontWeight: 500 },
} satisfies Record<string, CSSProperties>;
