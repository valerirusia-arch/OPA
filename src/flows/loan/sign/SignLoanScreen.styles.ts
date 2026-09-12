// src/flows/loan/sign/SignLoanScreen.styles.ts

import type { CSSProperties } from "react";

export const styles = {
  /**
   * 24 under the title, not the loan page's 16.
   *
   * There the strip below the heading is the heading's own summary, so they
   * belong together. Here the next thing is an ALERT — a different voice, and
   * a box with its own border — and at 16 it sat on the words above it.
   */
  titleRow: { marginBottom: 24 },
} satisfies Record<string, CSSProperties>;
