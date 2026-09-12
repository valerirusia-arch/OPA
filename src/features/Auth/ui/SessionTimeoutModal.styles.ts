// src/features/Auth/ui/SessionTimeoutModal.styles.ts

import type { CSSProperties } from "react";

export const styles = {
  wrap: { width: "100%", textAlign: "center", paddingTop: 8 },
  icon: { fontSize: 40, marginBottom: 12 },
  title: { marginTop: 0, marginBottom: 4 },
  description: { display: "block", marginBottom: 16 },
  actions: { marginTop: 16 },
} satisfies Record<string, CSSProperties>;
