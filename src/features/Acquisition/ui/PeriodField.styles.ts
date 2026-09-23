// src/features/Acquisition/ui/PeriodField.styles.ts

import type { CSSProperties } from "react";

export const styles = {
  /** Half the row each, and `wrap` on the row above: in a 480px dialog the two
   *  sit side by side, and anywhere narrower they stack rather than squeeze a
   *  date into a box it cannot print one in. */
  half: { flex: "1 1 180px", marginBottom: 0 },
  fullWidth: { width: "100%" },
  /** Under the pair, quiet: it is a consequence of the two dates, not a third
   *  thing to fill in. */
  span: { fontSize: 13 },
} satisfies Record<string, CSSProperties>;
