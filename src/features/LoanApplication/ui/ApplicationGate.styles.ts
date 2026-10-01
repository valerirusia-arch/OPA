// src/features/LoanApplication/ui/ApplicationGate.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";
import { getPageResultStyles } from "../../../shared/ui/pageResult.styles";

export const styles = {
  /** The card supplies the padding; Result would add its own on top. */
  result: { padding: 0 },
} satisfies Record<string, CSSProperties>;

/**
 * The title, sentence and action are set the way every page-sized Result in
 * the product is — see `pageResult.styles`. They lived here, and the loan and
 * payments pages' own empties had none of them, so the same moment was set
 * three different ways. Only the card's padding is this page's.
 */
export const getStyles = (token: GlobalToken) =>
  ({
    /** The invitation to begin: generous, and the only thing on the page. */
    card: { paddingBlock: token.paddingLG },
    ...getPageResultStyles(token),
  }) satisfies Record<string, CSSProperties>;
