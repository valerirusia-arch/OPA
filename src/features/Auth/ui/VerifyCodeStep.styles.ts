// src/features/Auth/ui/VerifyCodeStep.styles.ts

import type { CSSProperties } from "react";

export const styles = {
  wrap: { width: "100%", textAlign: "center" },
  title: { marginBottom: 4 },
  description: { display: "block", marginBottom: 24, textWrap: "balance" },
  otp: { justifyContent: "center", marginBottom: 16 },
  alert: { marginBottom: 16, textAlign: "start" },
  actions: { marginTop: 12 },
  /**
   * The OTP boxes, at the size the designer set from Figma: 44 wide × 50 tall.
   *
   * Each box is a touch taller than it is wide, so a digit sits upright in its
   * own cell rather than in a wide slot; six of them keep an even rhythm across
   * the row without reading as a grid.
   */
  otpInput: { width: 44, height: 50, fontSize: 18 },
} satisfies Record<string, CSSProperties>;
