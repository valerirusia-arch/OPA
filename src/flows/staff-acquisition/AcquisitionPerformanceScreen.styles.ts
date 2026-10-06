// src/flows/staff-acquisition/AcquisitionPerformanceScreen.styles.ts

import type { CSSProperties } from "react";

export const styles = {
  /* The description is a subtitle of the page title, so it sits close under it:
     the title row already keeps 24px below itself, which is too much for a
     subtitle — pull it up so the gap reads as ~8px, not a full block. */
  /** The controls share a row and wrap on a phone. */
  controls: { rowGap: 16 },
  /** The select fills its column, so the three spread evenly across the whole
   *  row instead of sitting at a fixed width with empty space beside them. */
  field: { width: "100%" },
  fieldLabel: { display: "block", marginBottom: 6 },
  /** The action rides the same row as the selects and drops to the foot of its
   *  column, so its button bottom-aligns with the select inputs rather than
   *  floating in a block of empty space below them. Full width of its column,
   *  so it reads as the row's one primary action. */
  actionCol: { display: "flex", flexDirection: "column", justifyContent: "flex-end" },
  /** The approval-rate cell: a fixed-width track so every bar is measured
   *  against the same length, with the figure held to the right of it. */
  approvalBar: { width: 72 },
  approvalValue: { fontVariantNumeric: "tabular-nums", width: 44, textAlign: "end" },
  /** The results band's air above and below — between the filters and the
   *  by-channel table. */
  results: { marginTop: 24, marginBottom: 24 },
  /** The table's heading sits above the flush card — not in a card-head bar
   *  stacked on the table's own header — so the table reads like the app's
   *  other lists. */
  byChannelHeading: { display: "block", marginBottom: 12 },
} satisfies Record<string, CSSProperties>;
