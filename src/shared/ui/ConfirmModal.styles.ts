// src/shared/ui/ConfirmModal.styles.ts

import type { CSSProperties } from "react";

export const styles = {
  title: { marginTop: 0, marginBottom: 12 },
  /** The sentence that says what will happen. Never a second paragraph. */
  body: { display: "block", marginBottom: 24 },
  /** Cancel first, the committing action last — the order every other
   *  modal in the product uses. */
  actions: { justifyContent: "flex-end" },
} satisfies Record<string, CSSProperties>;
