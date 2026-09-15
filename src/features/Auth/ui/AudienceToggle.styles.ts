// src/features/Auth/ui/AudienceToggle.styles.ts
//
// Styles for AudienceToggle. The pill's colours and height come from the global
// Segmented theme tokens (tokens.ts); only these geometry/weight bits are the
// control's own, and none of them depend on the theme — so a static object.

import type { CSSProperties } from "react";

export const styles = {
  segmented: { width: "100%" },
  /** The selected label's only change: a slightly heavier weight. It adds no
   *  icon and no size, so the control does not shift as you switch. */
  pillActive: { fontWeight: 600 },
} satisfies Record<string, CSSProperties>;
