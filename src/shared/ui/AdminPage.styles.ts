// src/shared/ui/AdminPage.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken, ThemeConfig } from "antd";

/**
 * The rail already eats 240px, so the work area does not get a second centred
 * column on top of it — it runs the full width with an even margin.
 */
export const PAGE_PADDING = 32;

/**
 * A page's toolbar sits at 40px, not the 48px the forms use.
 *
 * 48 is right for a field someone types a loan application into. A search box
 * and a "New user" button above a dense table are chrome, and at 48 they
 * out-weigh the rows they act on. Scoped through ConfigProvider so it stays a
 * TOKEN change — no CSS override, and nothing outside the toolbar moves.
 */
export const toolbarTheme: ThemeConfig = {
  token: { controlHeight: 40, controlHeightLG: 40 },
};

export const styles = {
  page: { padding: PAGE_PADDING },
  /**
   * The way back, at the head of the title's own line.
   *
   * No padding and no button height: a link button's box would put eleven
   * pixels of air between the arrow and the name and stand a 40px control
   * against a line of type. What is left is the glyph.
   */
  back: { paddingInline: 0, height: "auto", fontSize: 18 },
  /** The heading sits on the same line as whatever acts on the page. */
  titleRow: { marginBottom: 24 },
  /**
   * 26, not antd's 30 for a level-2 heading.
   *
   * The back office is a workspace: the page's name is a signpost above a
   * dense table, not the headline of a marketing page. Set here rather than on
   * the heading token, so the auth screens — where the title IS the page —
   * keep theirs. The line height comes down with it so the row does not keep
   * the space the larger size needed.
   */
  title: { marginTop: 0, marginBottom: 0, fontSize: 26, lineHeight: "34px" },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /**
     * A table card carries no padding of its own: the header band and the row
     * rules run to the card's edge and the band meets its top, instead of
     * floating in a white margin.
     */
    tableCard: { overflow: "hidden" },
    tableCardBody: { padding: 0 },
    /**
     * The pager is the one thing inside a flush table card that still needs a
     * margin. 48 above it, so it reads as a separate control rather than the
     * next row down; 24 below and beside it, matching the card's own inset.
     */
    pagination: { marginTop: 48, marginBottom: 24, marginInline: 24 },
    /**
     * Anything that sits above a flush table — filters, a toolbar.
     *
     * The same 24 the table's outer columns are inset by and the same 24 the
     * pager keeps, so the card has one margin, not three near-misses.
     */
    cardBlock: { padding: token.paddingLG },
  }) satisfies Record<string, CSSProperties>;
