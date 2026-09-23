// src/features/Loan/ui/DocumentList.styles.ts

import type { CSSProperties } from "react";

export const styles = {
  /** Icon and word on one line inside the link. */
  /* `nowrap`: at 16% of a narrow card — the underwriter's application panel is
     one — "Download" broke across two lines as "Downlo / ad". The word is the
     control, so it does not wrap. */
  download: { display: "inline-flex", whiteSpace: "nowrap" },
} satisfies Record<string, CSSProperties>;
