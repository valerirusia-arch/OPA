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
  segmented: { marginBottom: 24, width: "100%" },
  /**
   * antd has no weight token for the selected segment, so the label carries
   * it. The extra weight is what makes the choice read as made, rather than
   * relying on the white thumb alone.
   */
  segmentActive: { fontWeight: 600 },
  /** antd icons are filled paths, so weight is carried by size, not stroke. */
  segmentActiveIcon: { fontSize: 16 },
  /**
   * The borrower form is much taller than the staff hand-off. Reserving one
   * height for both keeps the heading and the tabs still when you switch.
   */
  panel: { minHeight: 360 },
} satisfies Record<string, CSSProperties>;
