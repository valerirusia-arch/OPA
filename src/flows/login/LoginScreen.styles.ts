// src/flows/login/LoginScreen.styles.ts

import type { CSSProperties } from "react";

export const styles = {
  /** antd's h2 reset adds a top margin; the layout owns that space. */
  heading: { marginTop: 0, marginBottom: 4 },
  /**
   * The greeting's hand. The keyframes are declared once in index.html —
   * @keyframes has no CSSProperties equivalent — and referenced by name here,
   * so the component still styles itself from this file.
   * transform-origin sits at the wrist so it pivots instead of spinning.
   */
  wave: {
    display: "inline-block",
    transformOrigin: "70% 70%",
    animation: "opa-wave 3s ease-in-out infinite",
  },
  subheading: { display: "block", marginBottom: 24, textWrap: "balance" },
  /** The switcher's own design lives in AudienceToggle; this only owns the gap
   *  to the form beneath it, the same 24px every variant needs. */
  toggleWrap: { marginBottom: 24 },
  /**
   * The borrower form is much taller than the staff hand-off. Reserving one
   * height for both keeps the heading and the tabs still when you switch.
   */
  panel: { minHeight: 360 },
} satisfies Record<string, CSSProperties>;
