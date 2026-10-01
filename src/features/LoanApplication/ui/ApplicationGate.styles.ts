// src/features/LoanApplication/ui/ApplicationGate.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";
import { getPageResultStyles } from "../../../shared/ui/pageResult.styles";

export const styles = {
  /** The card supplies the padding; Result would add its own on top. */
  result: { padding: 0 },
  /** One sentence per line inside a subtitle. No colour of its own: it has to
   *  inherit the Result's, or the two lines read as two voices. */
  subLine: { display: "block" },
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
    /** A run inside the sentence that should be read first — the date an
     *  invitation lapses on. Ink rather than the subtitle's grey, and nothing
     *  else: a bolder weight here would make the sentence read as two. */
    emphasis: { color: token.colorText },
    ...getPageResultStyles(token),
  }) satisfies Record<string, CSSProperties>;
