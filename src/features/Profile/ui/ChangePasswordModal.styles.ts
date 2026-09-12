// src/features/Profile/ui/ChangePasswordModal.styles.ts

import type { CSSProperties } from "react";

export const styles = {
  /**
   * Between proving who you are and choosing what comes next. The two halves
   * of this form answer different questions, and a hairline says so without
   * adding a heading for a two-field group.
   */
  divider: { marginTop: 4, marginBottom: 20 },
  subtitle: { display: "block", marginBottom: 16 },
  alert: { marginBottom: 16 },
  submit: { marginBottom: 0 },
} satisfies Record<string, CSSProperties>;
