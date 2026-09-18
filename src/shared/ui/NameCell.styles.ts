// src/shared/ui/NameCell.styles.ts

import type { CSSProperties } from "react";

export const styles = {
  /** The name and its reference wrap inside their own column rather than
   *  pushing the rest of the row out. */
  root: { minWidth: 0 },
  /** The reference: a step down, and quiet. It is what support is asked for,
   *  not what a reader picks a row by. */
  meta: { fontSize: 12 },
} satisfies Record<string, CSSProperties>;
