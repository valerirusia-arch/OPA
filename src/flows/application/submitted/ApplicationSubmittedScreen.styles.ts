// src/flows/application/submitted/ApplicationSubmittedScreen.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";
import { CARD_MAX_WIDTH } from "../../../features/LoanApplication/ui/ApplicationWizard.styles";

export const styles = {
  column: {
    width: "100%",
    maxWidth: CARD_MAX_WIDTH,
    marginInline: "auto",
    paddingInline: 24,
    boxSizing: "border-box",
  },
  result: { padding: 0 },
  contactTitle: { marginTop: 0, marginBottom: 16 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    page: { paddingBlock: 64 },
    card: { paddingBlock: token.paddingLG, marginBottom: 24 },
    title: { marginTop: token.margin },
    subTitle: { maxWidth: 420, marginInline: "auto", marginTop: token.marginXS },
    extra: { marginTop: token.marginLG },
    waiting: { marginTop: token.margin, marginBottom: 0 },
  }) satisfies Record<string, CSSProperties>;
