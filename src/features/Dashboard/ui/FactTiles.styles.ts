// src/features/Dashboard/ui/FactTiles.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";
import { brand } from "../../../theme/tokens";
import { getFigureStyles } from "../../../shared/ui/figures.styles";

export const styles = {
  inner: { width: "100%", height: "100%" },
  /** The label's row. It held a chevron at its far end while these tiles were
   *  links; what is left is the mark and the word. */
  labelRow: { width: "100%" },
  /** `minWidth: 0` so a long label ellipses inside the group rather than
   *  overflowing the cell. */
  labelGroup: { minWidth: 0 },
  /**
   * 12, and it is the one place in the product set below 13.
   *
   * 13 is right for a footnote that stands on its own line, which this was
   * when it was one. It is NOT a footnote any more: it rides beside an 18px
   * figure on the same baseline, and at 13 it read as a second fact competing
   * with the first rather than as the qualifier it is — *"გრძელია
   * ზედმეტად"*. One step down puts it where a qualifier belongs.
   *
   * The WORDS are as short as they can honestly go: "Due" replaced "Next"
   * already, and cutting the date itself would buy four characters and cost
   * the rule that a date is written one way everywhere in this product.
   */
  hint: { fontSize: 12 },
  /**
   * The held-open figure slot, at the figure's own line box.
   *
   * `rowValue` is 15px on the theme's 1.5 line height, so the line box is 22
   * and the bar is centred in it by the 4px margins. It was a bare 14 + 4,
   * under a comment claiming it matched the figure — the band with nothing to
   * say still comes out shorter than one that has, because the hint line is
   * missing too, but this slot at least no longer lies about why.
   */
  placeholder: { width: 72, minWidth: 72, height: 14, borderRadius: 4, marginBlock: 4 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) => {
  const figures = getFigureStyles(token);
  return {
    /**
     * One cell of the band.
     *
     * The 148px floor is gone — the box used to hold it open under about 70px
     * of content, which is most of what made the band heavy. What replaces it
     * is `height: 100%` of a stretched Row cell, so the band is as tall as its
     * tallest fact and no taller.
     *
     * It has to be 100% and not `auto`: Documents carries no hint line, so on
     * `auto` its cell came out 23px shorter than the other three and its
     * hairline stopped short of theirs — a ragged rule in a row of four.
     */
    /* NOT A BUTTON ANY MORE, so it states the border a Button used to bring
       with it. The hover and the chevron went with the link — see FactTiles. */
    tile: {
      display: "block",
      boxSizing: "border-box",
      border: `1px solid ${token.colorBorderSecondary}`,
      width: "100%",
      /* Equal heights across the row, from the Row's own stretch rather than
         from a floor. The 148px minimum that used to be here held open about
         70px of content, which was most of what made the band heavy. */
      height: "100%",
      /* 24 inline, the inset every other card face in the product takes, and
         a little more block so the three lines inside have somewhere to sit.
         The figures are what this band is for; boxed tight to them they read
         as a table. */
      padding: "24px 24px 26px",
      textAlign: "start",
      background: token.colorBgContainer,
      borderColor: token.colorBorderSecondary,
      borderRadius: token.borderRadiusLG,
      /* A card at rest, not a rectangle drawn on the page. See `shadowRest`. */
      boxShadow: brand.shadowRest,
    },
    /**
     * The label's mark.
     *
     * It was a 40px square filled with `colorFillQuaternary`. An icon at the
     * size of the word it belongs to needs no container at all: the label
     * treatment's own tertiary ink, and the flex is only here to stop the
     * glyph sitting on a text baseline.
     */
    mark: { color: token.colorTextTertiary, fontSize: 14, flex: "none" },
    /** The product's own label treatment, so a tile reads like every other
     *  labelled figure in the app. */
    label: { ...figures.microLabel, display: "block" },
    /**
     * The tile's figure.
     *
     * `rowValue`'s treatment at 18.
     *
     * 20 was set when this band was the only thing under the greeting. It
     * isn't now: the money card above it opens at 46, and the gap from 46 to
     * 20 is not wide enough to say which of the two a reader is meant to look
     * at first. 18 keeps the tiles legible as figures — they are still a step
     * above the 15 the rest of the product uses for a value under a label —
     * while leaving the page one headline.
     */
    value: { ...figures.rowValue, fontSize: 18, display: "block" },
  } satisfies Record<string, CSSProperties>;
};
