// src/features/LoanApplication/ui/CoBorrowerStep.styles.ts

import type { CSSProperties } from "react";

export const styles = {
  /** Above the button that was refused, not below it. */
  sendError: { marginBottom: 16 },
  optIn: { marginBottom: 24 },
  /** The panel's own look is PersonPanel's; this is only where it sits. */
  invitation: { marginTop: 24 },
  inviteActions: { marginTop: 16 },
} satisfies Record<string, CSSProperties>;
