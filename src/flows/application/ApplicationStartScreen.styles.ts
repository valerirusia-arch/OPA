// src/flows/application/ApplicationStartScreen.styles.ts

import type { CSSProperties } from "react";
import { CARD_MAX_WIDTH } from "../../features/LoanApplication/ui/ApplicationWizard.styles";

export const styles = {
  column: {
    width: "100%",
    maxWidth: CARD_MAX_WIDTH,
    marginInline: "auto",
    paddingInline: 24,
    boxSizing: "border-box",
  },
  result: { padding: 0 },
  /**
   * Raises the centred card off the true middle.
   *
   * Optical centre is above geometric centre: a block placed exactly halfway
   * down a window reads as sitting low, because the eye takes the top of the
   * screen as the start of the page and weighs it more.
   *
   * The card is centred, so a bottom margin moves it up by HALF of itself —
   * 224 here is 112px of lift.
   */
  lift: { marginBottom: 224 },
} satisfies Record<string, CSSProperties>;
