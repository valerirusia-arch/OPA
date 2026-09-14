// src/shared/ui/InstalmentTrack.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  /** `width: 100%` so the segments divide the card and not just the text
   *  above them. */
  track: { width: "100%" },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) => {
  /**
   * One instalment.
   *
   * `flex: 1` so twelve of them divide whatever width they are given, and the
   * radius equals the height, so each is a capsule rather than a brick — the
   * same shape the application rail uses for a step.
   */
  const segment: CSSProperties = { flex: 1, height: 8, borderRadius: 8 };

  return {
    /** Green: this is money that has been paid, which is what green means
     *  everywhere else in the product. */
    paid: { ...segment, background: token.colorSuccess },
    due: { ...segment, background: token.colorFillSecondary },
  } satisfies Record<string, CSSProperties>;
};
