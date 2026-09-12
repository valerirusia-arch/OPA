// src/flows/application/co-borrower/InviteCoBorrowerScreen.styles.ts
//
// The same page furniture as "send additional information": one card, the
// wizard's own measure, a heading and a line of explanation over the step.
// Two screens that answer a request about one application should not be two
// different shapes.

import type { CSSProperties } from "react";
import { CARD_MAX_WIDTH } from "../../../features/LoanApplication/ui/ApplicationWizard.styles";

export const styles = {
  page: { paddingBlock: 48 },
  column: {
    width: "100%",
    maxWidth: CARD_MAX_WIDTH,
    marginInline: "auto",
    paddingInline: 24,
    boxSizing: "border-box",
  },
  title: { marginTop: 0, marginBottom: 4 },
  subtitle: { display: "block", marginBottom: 24, textWrap: "balance" },
} satisfies Record<string, CSSProperties>;
