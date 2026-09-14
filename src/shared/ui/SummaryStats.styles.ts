// src/shared/ui/SummaryStats.styles.ts

import type { CSSProperties } from "react";

export const styles = {
  /** Cards share the width and wrap on a phone rather than crushing. */
  row: {},
  card: { flex: "1 1 140px", minWidth: 140 },
  body: { padding: 16 },
} satisfies Record<string, CSSProperties>;
