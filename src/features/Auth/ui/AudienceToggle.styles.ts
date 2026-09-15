// src/features/Auth/ui/AudienceToggle.styles.ts
//
// Styles for AudienceToggle. The pill's colours and height come from the global
// Segmented theme tokens (tokens.ts); only these geometry/weight bits are the
// control's own, and none of them depend on the theme — so a static object.

import type { CSSProperties } from "react";

export const styles = {
  segmented: { width: "100%" },
  /** The selected label reads a touch heavier than the rest — medium, not bold,
   *  so it stands out without looking like it grew. */
  pillActive: { fontWeight: 500 },
  pillIcon: { fontSize: 16 },
} satisfies Record<string, CSSProperties>;
