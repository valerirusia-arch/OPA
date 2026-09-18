// src/features/Borrowers/ui/DetailGrid.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";
import { getFigureStyles } from "../../../shared/ui/figures.styles";


export const getStyles = (token: GlobalToken) => {
  const figures = getFigureStyles(token);
  return ({
    /** The quiet half of the pair. One definition, in figures.styles. */
    label: { ...figures.microLabel, display: "block", marginBottom: 4 },
    value: { display: "block" },
  }) satisfies Record<string, CSSProperties>;
};
