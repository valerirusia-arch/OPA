// src/flows/set-password/SetPasswordScreen.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  /**
   * There is no "back to sign in" here — the invited person has no account to
   * go back to yet — so the 48px that link occupies elsewhere is reserved, and
   * every auth screen still starts its card on the same line.
   */
  panel: { width: "100%", marginTop: 48 },
  result: { padding: 0 },
  heading: { marginTop: 48, marginBottom: 4 },
  subheading: { display: "block", textWrap: "balance" },
  /** The address they will sign in with, directly under the promise. */
  account: { display: "block", marginBottom: 24 },
  submit: { marginBottom: 0 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    doneBadge: { background: token.colorSuccess, color: token.colorWhite },
    resultTitle: { marginTop: token.margin },
    resultSubTitle: { maxWidth: 300, marginInline: "auto", marginTop: token.marginXS },
    resultExtra: { marginTop: token.marginLG },
  }) satisfies Record<string, CSSProperties>;
