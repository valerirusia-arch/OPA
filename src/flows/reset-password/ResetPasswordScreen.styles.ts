// src/flows/reset-password/ResetPasswordScreen.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  /** Same top-left "back" affordance every auth screen uses. */
  back: { paddingInline: 0 },
  /**
   * Matches "Check your email": an outlined card around the outcome.
   *
   * That screen carries a "Back to sign in" link above its card; this one has
   * nothing to go back to, so the same 48px is reserved instead. Without it
   * the card starts higher than every other auth page and the whole flow
   * jumps as you move through it.
   */
  panel: { width: "100%", marginTop: 48 },
  result: { padding: 0 },
  heading: { marginTop: 0, marginBottom: 4 },
  subheading: { display: "block", marginBottom: 24, textWrap: "balance" },
  submit: { marginBottom: 0 },
} satisfies Record<string, CSSProperties>;

/** Same rhythm as the "Check your email" outcome, so the pair reads as a set. */
export const getStyles = (token: GlobalToken) =>
  ({
    doneBadge: { background: token.colorSuccess, color: token.colorWhite },
    resultTitle: { marginTop: token.margin },
    resultSubTitle: {
      // Sized so the break falls after "Sign in", leaving "with your new
      // password." on the second line: the first line measures 269px up to
      // "Sign in" and 300px once "with" joins it, so the column sits between.
      // Line balancing is deliberately off here — it would even the two lines
      // out and undo that break.
      maxWidth: 285,
      marginInline: "auto",
      marginTop: token.marginXS,
    },
    resultExtra: { marginTop: token.marginLG },
  }) satisfies Record<string, CSSProperties>;
