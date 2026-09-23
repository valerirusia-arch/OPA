// src/features/Auth/ui/VerifyCodeStep.styles.ts

import type { CSSProperties } from "react";

export const styles = {
  wrap: { width: "100%", textAlign: "center" },
  title: { marginBottom: 4 },
  description: { display: "block", marginBottom: 24, textWrap: "balance" },
  otp: { justifyContent: "center", marginBottom: 16 },
  alert: { marginBottom: 16, textAlign: "start" },
  actions: { marginTop: 12 },
  /** antd's default OTP box is narrow and tall; square reads better. */
  /* Wider than tall, not square — *"ესენი არ უნდა იყოს ოთკუთხედი, უნდა იყოს
     სულ ოდნავ უფრო გრძელი სიგრძეში."* A digit is wider than it is tall to
     read, and six squares in a row read as a grid rather than as one code. */
  otpInput: { width: 56, height: 48, fontSize: 18 },
} satisfies Record<string, CSSProperties>;
