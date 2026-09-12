// src/features/Auth/ui/VerifyCodeStep.styles.ts

import type { CSSProperties } from "react";

export const styles = {
  wrap: { width: "100%", textAlign: "center" },
  title: { marginBottom: 4 },
  description: { display: "block", marginBottom: 24, textWrap: "balance" },
  otp: { justifyContent: "center", marginBottom: 16 },
  alert: { marginBottom: 16, textAlign: "start" },
  actions: { marginTop: 8 },
  /** antd's default OTP box is narrow and tall; square reads better. */
  otpInput: { width: 56, height: 56, fontSize: 18 },
} satisfies Record<string, CSSProperties>;
