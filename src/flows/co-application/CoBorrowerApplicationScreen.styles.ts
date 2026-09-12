// src/flows/co-application/CoBorrowerApplicationScreen.styles.ts

import type { CSSProperties } from "react";
import { CARD_MAX_WIDTH } from "../../features/LoanApplication/ui/ApplicationWizard.styles";

export const styles = {
  /** Heavier than the line under it: the name is the fact that orients you. */
  contextTitle: { display: "block", fontWeight: 500 },
  contextBody: { display: "block", fontSize: 13 },
  /**
   * The state card, when there is no wizard to draw.
   *
   * THE SAME MEASURE AND THE SAME LIFT AS THE BORROWER'S Application tab —
   * literally the same numbers, from the same constant. It was 560 wide and
   * sat where it fell, so the two halves of one screen disagreed about how
   * wide a card is and where on the page it belongs: the co-borrower's came
   * out narrower, lower, and with its one sentence broken over three lines
   * instead of two. Same card, same place, whoever is reading.
   */
  column: {
    width: "100%",
    maxWidth: CARD_MAX_WIDTH,
    marginInline: "auto",
    paddingInline: 24,
    boxSizing: "border-box",
  },
  /** Optical centre is above geometric centre; the card is centred, so a
   *  bottom margin lifts it by half of itself — 112px here. */
  lift: { marginBottom: 224 },
} satisfies Record<string, CSSProperties>;
