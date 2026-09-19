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
    /**
     * A RECESS, NOT A BORDERED BOX.
     *
     * Three outlined boxes directly above a table read as three cards sitting
     * on a card — the page's own frames repeated at a smaller size, competing
     * with the thing they summarise. The product's way of saying "a surface
     * within a surface" is the recessed fill, which is what the eligibility
     * conclusion and the person panels take, and it leaves the borders on the
     * page to the cards that are actually cards.
     */
    part: {
      height: "100%",
      boxSizing: "border-box",
      padding: "12px 16px",
      background: token.colorFillQuaternary,
      borderRadius: token.borderRadiusLG,
    },
    /** The part's name, in the product's own label treatment — the same one
     *  that sits above every figure in it. */
    partName: { ...figures.microLabel, display: "block", minWidth: 0 },
  } satisfies Record<string, CSSProperties>;
};
