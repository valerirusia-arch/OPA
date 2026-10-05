// src/shared/ui/FacetFilters.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";
import { getFigureStyles } from "./figures.styles";

export const styles = {
  /** Wide enough for "Co-borrower required" without truncating the option. */
  panel: { width: 260 },
  field: { width: "100%" },
  /** The chips sit under the toolbar, outside the card, on their own line. */
  chips: { marginBottom: 24 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) => {
  const figures = getFigureStyles(token);
  return ({
    label: {
      ...figures.microLabel,
      display: "block",
      marginBottom: 6,
    },
    /**
     * AN ACTIVE FILTER IS WHITE, with a hairline.
     *
     * `variant="filled"` with no colour takes antd's `defaultBg`, composited
     * from `colorFillTertiary` — on this warm palette a cream slab, and these
     * chips sit on the page's warm grey ground where that reads as a smudge
     * rather than as an object: *"როცა ვფილტრავ, ესენი თეთრი ფერის უნდა
     * იყოს"*.
     *
     * The same answer StatusPill's neutral state already takes, for the same
     * reason: white and a 1px split edge give the chip its shape, and the
     * text plus its close cross say what it is. One white chip on grey also
     * reads as something you put there and can take off, which is what an
     * active filter is.
     */
    chip: {
      background: token.colorBgContainer,
      border: `1px solid ${token.colorSplit}`,
    },
    /** "Clear all" is a way out, not a second primary action. */
    clear: { paddingInline: 0 },
    divider: { margin: `${token.marginSM}px 0 ${token.marginXS}px` },
    /**
     * THE TRIGGER READS AT THE SEARCH BOX'S WEIGHT, not the theme's button
     * weight (500, set globally for every button in the product). antd
     * exposes a token for the STRONG weight it wants back (`fontWeightStrong`)
     * but none for its own baseline, so there's nothing to read here — only
     * "normal" to ask for. Unlike colour and border, which `defaultColor` /
     * `defaultBorderColor` already scope to this one button in the toolbar's
     * own ConfigProvider (AdminPage.styles.ts), `fontWeight` has no
     * per-variant token, so a primary button sharing that toolbar couldn't be
     * spared the same way — set directly on this component instead, the one
     * button that needs it.
     */
    trigger: { fontWeight: "normal" },
  }) satisfies Record<string, CSSProperties>;
};
