// src/features/Loan/ui/LoanDocumentsTable.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";
import { getFigureStyles } from "../../../shared/ui/figures.styles";

export const styles = {
  chips: { marginBottom: 20 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) => {
  const figures = getFigureStyles(token);
  return {
    /**
     * ONE PART OF THE PACKAGE, IN A BOX OF ITS OWN.
     *
     * An outline and no fill. The three sit inside a white card that already
     * has a border, so a tint would be a third surface; a hairline is enough
     * to say "these are three things" and nothing more. `height: 100%` keeps
     * them level when one name wraps to two lines and the others do not.
     */
    part: {
      height: "100%",
      padding: "16px 20px",
      border: `1px solid ${token.colorBorderSecondary}`,
      borderRadius: token.borderRadiusLG,
    },
    /** The part's name, in the product's own label treatment — the same one
     *  that sits above every figure in it. */
    partName: { ...figures.microLabel, display: "block" },
  } satisfies Record<string, CSSProperties>;
};
