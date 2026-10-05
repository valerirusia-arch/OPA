// src/features/Payments/ui/BalanceFacts.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";
import { getFigureStyles } from "../../../shared/ui/figures.styles";

export const styles = {
  block: { width: "100%" },
  /** An even share each. `minWidth: 0` so a long label wraps inside its own
   *  cell instead of widening the row. */
  cell: { flex: "1 1 0", minWidth: 0 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) => {
  const figures = getFigureStyles(token);
  return {
    /** The product's 11px label, defined once in figures.styles. */
    label: { ...figures.microLabel, display: "block" },
    /** `rowValue`, the same step the loan statement's facts take — these are
     *  detail about the figure beside them, not four more figures. */
    value: figures.rowValue,
    /** The past-due figure, the only one that is a problem. */
    valueAlarm: { ...figures.rowValue, color: token.colorError },
  } satisfies Record<string, CSSProperties>;
};
