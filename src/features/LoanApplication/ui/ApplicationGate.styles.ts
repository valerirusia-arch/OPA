// src/features/LoanApplication/ui/ApplicationGate.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  /** The card supplies the padding; Result would add its own on top. */
  result: { padding: 0 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /** The invitation to begin: generous, and the only thing on the page. */
    card: { paddingBlock: token.paddingLG },
    title: { marginTop: token.margin },
    /**
     * The measure the sentence is set to.
     *
     * 420 held these states to three lines where two would do — a short
     * sentence broken into a narrow column reads as more text than it is.
     * 480 is still well inside a comfortable measure (roughly 60 characters)
     * and it is what puts every one of these states on two lines.
     */
    subTitle: { maxWidth: 480, marginInline: "auto", marginTop: token.marginXS },
    extra: { marginTop: token.marginLG },
  }) satisfies Record<string, CSSProperties>;
