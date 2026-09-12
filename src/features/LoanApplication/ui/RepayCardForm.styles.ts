// src/features/LoanApplication/ui/RepayCardForm.styles.ts

import type { CSSProperties } from "react";

export const styles = {
  form: { width: "100%" },
  /** Grouped as you type, so a 16-digit number can be checked at a glance. */
  number: { fontVariantNumeric: "tabular-nums" },
  actions: { marginTop: 4, marginBottom: 0 },
  note: { marginTop: 12 },
  noteText: { fontSize: 12 },
  /** Sits on the note's baseline, not in a row of its own. */
  fill: { padding: 0, height: "auto", fontSize: 12 },
} satisfies Record<string, CSSProperties>;
