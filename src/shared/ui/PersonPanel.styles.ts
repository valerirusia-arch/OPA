// src/shared/ui/PersonPanel.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  /** The name and its line, held together against whatever ends the row. */
  words: { minWidth: 0 },
  name: { display: "block" },
  meta: { display: "block" },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) => {
  const panel: CSSProperties = {
    padding: token.padding,
    borderRadius: token.borderRadiusLG,
  };

  return {
    /** Chosen: the tint antd derives for a selected row, with its border. */
    selected: {
      ...panel,
      background: token.colorPrimaryBg,
      border: `1px solid ${token.colorPrimaryBorder}`,
    },
    /**
     * Stated: a recess in the card it sits in, and NO EDGE.
     *
     * A border here would make it a card inside a card; the fill alone says
     * "a surface within a surface", which is what it is — the same fill the
     * eligibility conclusion takes two cards up.
     */
    quiet: { ...panel, background: token.colorFillQuaternary },
  } satisfies Record<string, CSSProperties>;
};
