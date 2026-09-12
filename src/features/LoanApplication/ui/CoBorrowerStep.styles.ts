// src/features/LoanApplication/ui/CoBorrowerStep.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  /** Above the button that was refused, not below it. */
  sendError: { marginBottom: 16 },
  optIn: { marginBottom: 24 },
  name: { display: "block" },
  meta: { display: "block" },
  inviteActions: { marginTop: 16 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /**
     * The invitation, once sent — and it is SELECTED, so it is tinted.
     *
     * It was `colorFillQuaternary`, the same grey as every recessed surface
     * in the product, which made the one person on this application look like
     * a disabled field. The primary tint is what antd derives for a chosen
     * row, a checked option, a selected item; this is the same idea — the
     * co-borrower you picked — so it wears the same colour, with the matching
     * border so the shape has an edge on white.
     */
    invitation: {
      marginTop: 24,
      padding: token.padding,
      borderRadius: token.borderRadiusLG,
      background: token.colorPrimaryBg,
      border: `1px solid ${token.colorPrimaryBorder}`,
    },
  }) satisfies Record<string, CSSProperties>;
