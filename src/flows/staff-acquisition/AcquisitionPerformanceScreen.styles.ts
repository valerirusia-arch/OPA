// src/flows/staff-acquisition/AcquisitionPerformanceScreen.styles.ts

import type { CSSProperties } from "react";

export const styles = {
  lead: { display: "block", marginBottom: 16, maxWidth: 640 },
  /** The controls share a row and wrap on a phone. */
  controls: { rowGap: 16 },
  /** The select fills its column, so the three spread evenly across the whole
   *  row instead of sitting at a fixed width with empty space beside them. */
  field: { width: "100%" },
  fieldLabel: { display: "block", marginBottom: 6 },
  /** The action sits at the foot of its column, level with the selects above. */
  actionCol: { display: "flex", alignItems: "flex-end" },
  /** The results band's air above and below — between the filters and the
   *  by-channel table. */
  results: { marginTop: 24, marginBottom: 24 },
} satisfies Record<string, CSSProperties>;
