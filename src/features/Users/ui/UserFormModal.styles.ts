// src/features/Users/ui/UserFormModal.styles.ts

import type { CSSProperties } from "react";

export const styles = {
  title: { marginTop: 0, marginBottom: 4 },
  /** Why the form asks for so little: the password is not ours to choose. */
  subtitle: { display: "block", marginBottom: 24 },
  titleOnly: { marginTop: 0, marginBottom: 24 },
  /** The last field already carries the form's bottom margin. */
  actions: { justifyContent: "flex-end", marginTop: 8 },
} satisfies Record<string, CSSProperties>;
