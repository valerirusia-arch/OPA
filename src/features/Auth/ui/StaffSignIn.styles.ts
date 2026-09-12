// src/features/Auth/ui/StaffSignIn.styles.ts

import type { CSSProperties } from "react";

export const styles = {
  /**
   * The Segmented already leaves 24px below it, which is the right gap before
   * the borrower form's first label. A single button needs more air, so this
   * tops the gap up to 32 — the same distance the sign-in form puts above its
   * own button.
   */
  root: { marginTop: 8 },
  note: { margin: 0 },
} satisfies Record<string, CSSProperties>;
