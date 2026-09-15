// src/flows/staff-acquisition/AcquisitionPerformanceScreen.styles.ts

import type { CSSProperties } from "react";

export const styles = {
  /* The description is a subtitle of the page title, so it sits close under it:
     the title row already keeps 24px below itself, which is too much for a
     subtitle — pull it up so the gap reads as ~8px, not a full block. */
  lead: { display: "block", marginTop: -16, marginBottom: 20, maxWidth: 640 },
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
  /** The table's heading sits above the flush card — not in a card-head bar
   *  stacked on the table's own header — so the table reads like the app's
   *  other lists. */
  byChannelHeading: { display: "block", marginBottom: 12 },
} satisfies Record<string, CSSProperties>;
