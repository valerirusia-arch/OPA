// src/features/Applications/ui/VerificationList.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  /** Hairlines, the way the review step and the contact page separate rows. */
  rule: { marginBlock: 0 },
  row: { paddingBlock: 12 },
  name: { minWidth: 0, flex: "1 1 auto" },
  /** Who answered, quieter than the check it belongs to. */
  detail: { fontSize: 13 },
  /**
   * The outcome group sits on the right. It held its full width with
   * `flex:none`, which was fine until a long sentence of evidence ("No open
   * application or loan") made it wide enough to squeeze the check name to a
   * single character per line on a phone. Letting it shrink — the sentence
   * wraps instead — keeps both columns readable; on a wide screen there is
   * room for everything, so nothing wraps and the desktop layout is unchanged.
   */
  result: { flexShrink: 1, minWidth: 0, justifyContent: "flex-end" },
  /** Stacked under the name on a phone: full width, reading left like the
   *  name above it rather than pinned to the right of a short line. */
  resultStacked: { flexShrink: 0, justifyContent: "flex-start" },
  evidence: { fontSize: 13, textAlign: "end" },
  /** Left-aligned when the evidence sits on its own line under the name. */
  evidenceStacked: { fontSize: 13, textAlign: "start" },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /**
     * A credit score, at the size the wireframe gives it.
     *
     * It is the only number on this card an underwriter reads twice, and it
     * exists nowhere the borrower can see — so it earns the weight here and
     * nowhere else.
     */
    score: {
      fontSize: 22,
      fontWeight: 600,
      color: token.colorText,
      fontVariantNumeric: "tabular-nums",
    },
  }) satisfies Record<string, CSSProperties>;
