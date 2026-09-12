// src/features/Auth/ui/LoginForm.styles.ts

import type { CSSProperties } from "react";

export const styles = {
  form: { width: "100%" },
  heading: { marginTop: 0, marginBottom: 4 },
  subheading: { display: "block", marginBottom: 24 },
  segmented: { marginBottom: 24 },
  /** Password field → the remember / forgot row. */
  optionsRow: { marginBottom: 12 },
  /** That row → the submit button. */
  optionsToSubmit: { marginBottom: 32 },
  /** Same row when a notice sits between it and the button instead. */
  optionsToNotice: { marginBottom: 16 },
  alert: { marginBottom: 24 },
  submit: { marginBottom: 0 },
  footer: { marginTop: 24 },
  noMargin: { margin: 0 },
} satisfies Record<string, CSSProperties>;
