// src/features/LoanApplication/ui/ExternalPanel.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  /** The children row fills the panel; a child decides its own width. */
  row: { width: "100%" },
  provider: { fontWeight: 500 },
  note: { display: "block", textWrap: "balance" },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /**
     * A named place, not a dashed void.
     *
     * The panel used to be a dashed rectangle with a button floating in the
     * middle of it and the explanation printed underneath — so the reader met
     * the button before the sentence saying where it would take them, and the
     * dashes read as a drop zone waiting for a file.
     *
     * The WBS reason for marking this area at all still holds: DocuSign and
     * Repay are separate systems, OPA cannot edit the documents and never sees
     * the card. That is now carried by a titled header naming the company,
     * which says it in words rather than in border style.
     */
    panel: {
      border: `1px solid ${token.colorBorderSecondary}`,
      borderRadius: token.borderRadiusLG,
      overflow: "hidden",
    },
    header: {
      paddingInline: token.paddingLG,
      paddingBlock: 12,
      background: token.colorFillQuaternary,
      borderBottom: `1px solid ${token.colorBorderSecondary}`,
    },
    /** The padlock, framed so it reads as a mark rather than as an icon. */
    chip: {
      width: 28,
      height: 28,
      borderRadius: token.borderRadius,
      background: token.colorBgContainer,
      border: `1px solid ${token.colorBorderSecondary}`,
      color: token.colorTextSecondary,
      fontSize: 13,
      flex: "none",
    },
    /** The explanation and the action it explains, in that order. */
    body: { padding: token.paddingLG },
  }) satisfies Record<string, CSSProperties>;
