// src/features/Auth/ui/IdentityStep.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  wrap: { width: "100%", textAlign: "center", paddingBlock: 24 },
  title: { marginTop: 0, marginBottom: 4 },
  description: { display: "block", marginBottom: 24, textWrap: "balance" },
  alert: { marginBottom: 16, textAlign: "start" },
  actions: { marginTop: 16 },
  /** One thought per line, broken where the sentence breaks. */
  line: { display: "block" },
} satisfies Record<string, CSSProperties>;

/** The same outcome rhythm the other end-of-flow screens use. */
export const getStyles = (token: GlobalToken) =>
  ({
    resultTitle: { marginTop: token.margin },
    /**
     * A measure, and lines that FILL rather than balance.
     *
     * `balance` evens the two lines out, which broke this sentence after
     * "Next," and left "we'll verify your email address" hanging below — the
     * clause the reader is looking for, split off from the words that set it
     * up. `pretty` fills the first line and still refuses to strand a single
     * word, so the break falls where the sentence's own pause is.
     */
    resultSubTitle: {
      maxWidth: 460,
      marginInline: "auto",
      marginTop: token.marginXS,
      textWrap: "pretty",
    },
    resultExtra: { marginTop: token.marginLG },
    /**
     * The primary action carries more weight than "Back", so it gets more
     * width. Sized by content alone the two buttons come out nearly equal,
     * which reads as two choices of the same rank — they are not.
     */
    primaryAction: { minWidth: 180 },
  }) satisfies Record<string, CSSProperties>;
