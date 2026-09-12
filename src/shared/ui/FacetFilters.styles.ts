// src/shared/ui/FacetFilters.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";
import { getFigureStyles } from "./figures.styles";

export const styles = {
  /** Wide enough for "Co-borrower required" without truncating the option. */
  panel: { width: 260 },
  field: { width: "100%" },
  /** The chips sit under the toolbar, outside the card, on their own line. */
  chips: { marginBottom: 24 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) => {
  const figures = getFigureStyles(token);
  return ({
    label: {
      ...figures.microLabel,
      display: "block",
      marginBottom: 6,
    },
    /** "Clear all" is a way out, not a second primary action. */
    clear: { paddingInline: 0 },
    divider: { margin: `${token.marginSM}px 0 ${token.marginXS}px` },
  }) satisfies Record<string, CSSProperties>;
};
