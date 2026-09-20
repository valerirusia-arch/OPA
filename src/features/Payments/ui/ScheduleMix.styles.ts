// src/features/Payments/ui/ScheduleMix.styles.ts

import type { CSSProperties } from "react";

export const styles = {
  card: { flex: 1, display: "flex", flexDirection: "column" },
  /** The ordinary 24: the panel beside it is the page's lead and keeps 32. */
  body: { padding: 24, flex: 1, display: "flex", flexDirection: "column" },
  title: { marginTop: 0, marginBottom: 20 },
  /** Centres the ring in whatever height the row turns out to be. */
  fill: { flex: 1 },
} satisfies Record<string, CSSProperties>;
