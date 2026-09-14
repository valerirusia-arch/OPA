// src/features/Auth/ui/AudienceToggle.styles.ts
//
// Styles for AudienceToggle. The pill's colours and height come from the global
// Segmented theme tokens (tokens.ts); only these geometry/weight bits are the
// control's own, and none of them depend on the theme — so a static object.

import type { CSSProperties } from "react";

export const styles = {
  segmented: { width: "100%" },
  pillActive: { fontWeight: 600 },
  pillIcon: { fontSize: 16 },
} satisfies Record<string, CSSProperties>;
