// src/features/LoanApplication/ui/ContactDetails.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";
import { getFigureStyles } from "../../../shared/ui/figures.styles";

export const styles = {
  value: { display: "block", fontVariantNumeric: "tabular-nums" },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) => {
  const figures = getFigureStyles(token);
  return ({
    /** Same label treatment as the borrower record in the back office. */
    label: {
      ...figures.microLabel,
      display: "block",
      marginBottom: 2,
    },
  }) satisfies Record<string, CSSProperties>;
};
