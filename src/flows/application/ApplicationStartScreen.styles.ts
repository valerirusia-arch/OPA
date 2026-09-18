// src/flows/application/ApplicationStartScreen.styles.ts

import type { CSSProperties } from "react";
import { CARD_MAX_WIDTH } from "../../features/LoanApplication/ui/ApplicationWizard.styles";

/**
 * The frosted pane the card stands on: the content column plus a margin of
 * glass on each side. Wide enough to read as a pane the card sits on, not so
 * wide that it becomes the page.
 */
export const FRAME_MAX_WIDTH = CARD_MAX_WIDTH + 48;

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
