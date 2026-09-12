// src/features/Applications/ui/ChangeHistory.styles.ts

import type { CSSProperties } from "react";

export const styles = {
  empty: { fontSize: 13 },
  /** The value that stands, against the struck-through one it replaced. */
  to: { fontWeight: 500 },
} satisfies Record<string, CSSProperties>;
