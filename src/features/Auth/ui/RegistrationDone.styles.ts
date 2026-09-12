// src/features/Auth/ui/RegistrationDone.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  /**
   * One thought per line, broken where the sentence breaks.
   *
   * As a single paragraph it wrapped wherever the measure ran out, which put
   * "is / ready" across the break — the reader met half the news, then the
   * line ended. Two blocks put the break where the full stop already is.
   */
  line: { display: "block" },
} satisfies Record<string, CSSProperties>;

/** Same rhythm as the other outcome screens, so the set reads as one family. */
export const getStyles = (token: GlobalToken) =>
  ({
    resultTitle: { marginTop: token.margin },
    /** A measure wide enough that neither line has to wrap again. */
    resultSubTitle: {
      maxWidth: 460,
      marginInline: "auto",
      marginTop: token.marginXS,
      textWrap: "balance",
    },
    resultExtra: { marginTop: token.marginLG },
  }) satisfies Record<string, CSSProperties>;
