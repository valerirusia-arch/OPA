// src/flows/login/LoginScreen.styles.ts

import type { CSSProperties } from "react";

export const styles = {
  /** antd's h2 reset adds a top margin; the layout owns that space. The
   *  greeting's flourish is the sparkle beside the words (see GreetingSparkle),
   *  so the type itself stays the product's plain heading. */
  heading: { marginTop: 0, marginBottom: 24 },
  /** The switcher's own design lives in AudienceToggle; this only owns the gap
   *  to the form beneath it, the same 24px every variant needs. */
  toggleWrap: { marginBottom: 24 },
  /**
   * The borrower form is much taller than the staff hand-off. Reserving one
   * height for both keeps the heading and the tabs still when you switch.
   */
  panel: { minHeight: 360 },
} satisfies Record<string, CSSProperties>;
