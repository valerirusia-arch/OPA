// src/features/Applications/ui/DecisionModals.styles.ts

import type { CSSProperties } from "react";

export const styles = {
  /** The consequence, under the title and above the fields. */
  body: { display: "block", marginBottom: 20 },
  form: { marginTop: 4 },
  alert: { marginBottom: 20 },
} satisfies Record<string, CSSProperties>;
