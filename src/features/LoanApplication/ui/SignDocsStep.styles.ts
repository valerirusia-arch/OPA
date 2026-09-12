// src/features/LoanApplication/ui/SignDocsStep.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  packageLabel: { display: "block", marginBottom: 8 },
  /** The package is one object; the rows inside it are its contents. */
  list: { marginBottom: 24 },
  rule: { marginBlock: 0 },
  row: { paddingBlock: 10 },
  signedTitle: { display: "block", fontWeight: 500 },
  signedMeta: { display: "block" },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    documentIcon: { color: token.colorTextTertiary },
    /** The documents, boxed so they read as a package and not as loose rows. */
    listFrame: {
      marginBottom: 24,
      border: `1px solid ${token.colorBorderSecondary}`,
      borderRadius: token.borderRadiusLG,
      paddingInline: token.padding,
    },
    /**
     * The done state is a RECEIPT, so it gets a surface of its own.
     *
     * Loose in the panel body it was two more lines of text under the
     * paragraph explaining how to sign — the same weight as the instructions
     * it had just made obsolete. On its own tinted strip it reads as the
     * outcome: this part is finished, and here is the proof.
     */
    receipt: {
      flex: 1,
      padding: token.paddingSM,
      borderRadius: token.borderRadiusLG,
      background: token.colorSuccessBg,
      border: `1px solid ${token.colorSuccessBorder}`,
    },
    /** Solid on the pale strip: the one saturated mark in the panel. */
    signedBadge: {
      width: 32,
      height: 32,
      borderRadius: "50%",
      background: token.colorSuccess,
      color: token.colorWhite,
      fontSize: 14,
      flex: "none",
    },
  }) satisfies Record<string, CSSProperties>;
