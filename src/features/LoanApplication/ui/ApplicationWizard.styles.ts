// src/features/LoanApplication/ui/ApplicationWizard.styles.ts

import type { CSSProperties } from "react";

/** The form column. Narrower than the page: one question at a time reads better. */
export const CARD_MAX_WIDTH = 720;

export const styles = {
  contextDivider: { marginTop: 16, marginBottom: 20 },
  /** The card's own head: how far along, above the step's title. */
  progress: { marginBottom: 16 },
  stepsBar: { width: "100%", marginTop: 8, marginBottom: 0, lineHeight: 1 },
  /** Tabular figures so the count does not jiggle as it climbs. */
  stepCount: { fontSize: 12, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" },
  column: {
    width: "100%",
    maxWidth: CARD_MAX_WIDTH,
    marginInline: "auto",
    paddingInline: 24,
    boxSizing: "border-box",
  },
  title: { marginTop: 0, marginBottom: 4 },
  subtitle: { display: "block", marginBottom: 20, textWrap: "balance" },
  /** Back sits beside Continue, one row, the way registration does it. */
  actions: { marginTop: 8, justifyContent: "flex-end" },
  /**
   * Tighter than the app's usual 48.
   *
   * A wizard step is one task with a button at the end of it: if the button
   * needs a scroll to reach, the reader has to hunt for the thing they already
   * decided to press. The gutter is the cheapest height to give back.
   */
  page: { paddingBlock: 20 },
  card: { marginBottom: 20 },
} satisfies Record<string, CSSProperties>;
