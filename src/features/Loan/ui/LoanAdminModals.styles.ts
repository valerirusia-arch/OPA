// src/features/Loan/ui/LoanAdminModals.styles.ts

import type { CSSProperties } from "react";

export const styles = {
  form: { marginTop: 4 },
  /** A row tall enough to hold its own remove button, same as every upload. */
  uploadItem: { minHeight: 40, paddingInline: 4 },
} satisfies Record<string, CSSProperties>;
