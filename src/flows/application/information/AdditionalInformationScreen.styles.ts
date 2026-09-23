// src/flows/application/information/AdditionalInformationScreen.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";
import { getFigureStyles } from "../../../shared/ui/figures.styles";
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
  /** The reviewer's own words, quoted rather than paraphrased. */
  asked: { display: "block", marginTop: 8 },
  meta: { fontSize: 13 },
  /** A row tall enough to hold its own remove button — same fix as the wizard. */
  uploadItem: { minHeight: 40, paddingInline: 4 },
  actions: { marginTop: 8, justifyContent: "flex-end" },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) => {
  const figures = getFigureStyles(token);
  return ({
    /**
     * What was asked for, framed.
     *
     * It is somebody else's sentence, and the borrower is answering it — a
     * quotation, not a paragraph of the page's own copy. The frame is what
     * makes that visible without a pair of quote marks doing the work.
     */
    request: {
      marginBottom: 24,
      padding: token.padding,
      borderRadius: token.borderRadiusLG,
      background: token.colorFillQuaternary,
      border: `1px solid ${token.colorBorderSecondary}`,
    },
    label: {
      ...figures.microLabel,
      display: "block",
      marginBottom: 4,
    },
    /**
     * The co-borrower door, under a rule rather than inside the form.
     *
     * It is not an answer to the request — pressing it does not resubmit
     * anything — so it must not read as another field of the thing above it.
     */
    aside: {
      marginTop: 24,
      paddingTop: 20,
      borderTop: `1px solid ${token.colorSplit}`,
    },
  }) satisfies Record<string, CSSProperties>;
};
