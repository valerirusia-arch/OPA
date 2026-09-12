// src/flows/forgot-password/ForgotPasswordScreen.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  /** Same top-left "back" affordance every auth screen uses. */
  back: { paddingInline: 0 },
  /** An outlined card gives the outcome edges, so it reads as one object
   *  rather than four things floating on the page. */
  panel: { width: "100%" },
  /** Result brings its own generous padding; the card already supplies it. */
  result: { padding: 0 },
  heading: { marginTop: 0, marginBottom: 4 },
  subheading: { display: "block", marginBottom: 24, textWrap: "balance" },
  submit: { marginBottom: 0 },
  footer: { marginTop: 24 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /**
     * A soft mail badge instead of antd's solid blue exclamation: nothing has
     * gone wrong here, and the icon may as well say what to do next.
     */
    mailBadge: {
      background: token.colorPrimaryBg,
      color: token.colorPrimary,
    },
    /** Air between the badge and the headline. */
    resultTitle: { marginTop: token.margin },
    /**
     * A measure this short keeps the sentence to two balanced lines instead of
     * one long line that runs the full width of the card.
     */
    resultSubTitle: {
      maxWidth: 460,
      marginInline: "auto",
      marginTop: token.marginXS,
      // Balances the lines so the last one never holds a single word.
      textWrap: "balance",
    },
    resultExtra: { marginTop: token.marginLG },
    /**
     * The prototype shortcut lives OUTSIDE the card, dashed, so it reads as
     * scaffolding for the review rather than a feature of the product.
     */
    demoRow: { marginTop: token.marginXL },
  }) satisfies Record<string, CSSProperties>;
