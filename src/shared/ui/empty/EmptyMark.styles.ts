// src/shared/ui/empty/EmptyMark.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";
import { brand } from "../../../theme/tokens";

export const getStyles = (token: GlobalToken) =>
  ({
    /**
     * The disc is the table's own warm tint and the glyph is the product's
     * teal — two colours that are already on any page this appears on, which
     * is what stops the mark reading as a sticker.
     *
     * THE GLYPH IS DELIBERATELY SMALL FOR ITS DISC. antd sizes an Avatar's
     * icon at half the avatar, so 72 would have drawn a 36px glyph — a mark
     * as loud as the heading under it. At 26 in 72 the ring of empty tint
     * around it is wider than the glyph, which is what makes it read as
     * quiet furniture rather than as an alert.
     */
    mark: {
      backgroundColor: brand.warmTintStrong,
      color: token.colorPrimary,
      fontSize: 26,
      marginBottom: token.marginXS,
    },
    /** The page register: the same ring of empty tint around the glyph, at the
     *  larger disc — 34 in 96 is the same proportion as 26 in 72. */
    markPage: {
      backgroundColor: brand.warmTintStrong,
      color: token.colorPrimary,
      fontSize: 34,
    },
  }) satisfies Record<string, CSSProperties>;
