// src/features/Borrowers/ui/DetailGrid.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";
import { getFigureStyles } from "../../../shared/ui/figures.styles";


export const getStyles = (token: GlobalToken) => {
  const figures = getFigureStyles(token);
  return ({
    /**
     * The quiet half of the pair. One definition, in figures.styles.
     *
     * 2 under it rather than 4: a label and its value are ONE thing, and at 4
     * — against the 24 between rows — each pair read as two loosely related
     * lines rather than one fact. Closing the inner gap is what makes a grid
     * of them scan as rows instead of as a field of text.
     */
    label: { ...figures.microLabel, display: "block", marginBottom: 2 },
    value: { display: "block" },
  }) satisfies Record<string, CSSProperties>;
};
