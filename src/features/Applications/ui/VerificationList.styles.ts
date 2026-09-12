// src/features/Applications/ui/VerificationList.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  /** Hairlines, the way the review step and the contact page separate rows. */
  rule: { marginBlock: 0 },
  row: { paddingBlock: 12 },
  name: { minWidth: 0 },
  /** Who answered, quieter than the check it belongs to. */
  detail: { fontSize: 13 },
  /** The outcome group keeps its own width on the right. */
  result: { flex: "none" },
  evidence: { fontSize: 13, textAlign: "end" },
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
