// src/features/Auth/ui/TermsStep.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  wrap: { width: "100%" },
  title: { marginTop: 0, marginBottom: 4 },
  description: { display: "block", marginBottom: 24, textWrap: "balance" },
  consent: { marginBottom: 16 },
  submit: { marginTop: 8 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /**
     * The summary scrolls in its own panel rather than stretching the step:
     * the wizard keeps one height, and the consent checkboxes stay in view
     * instead of being pushed below the fold by the text you must agree to.
     */
    document: {
      maxHeight: 260,
      overflowY: "auto",
      padding: token.padding,
      marginBottom: token.margin,
      background: token.colorFillQuaternary,
      border: `1px solid ${token.colorBorder}`,
      borderRadius: token.borderRadius,
    },
    docTitle: { marginTop: 0, marginBottom: token.marginXS },
    /** The second document needs air from the end of the first. */
    docTitleSpaced: { marginTop: token.marginLG, marginBottom: token.marginXS },
    point: { marginBottom: token.marginXS },
    note: { display: "block", marginBottom: token.marginLG },
  }) satisfies Record<string, CSSProperties>;
