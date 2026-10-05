// src/shared/ui/AdminPage.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken, ThemeConfig } from "antd";
import { brand } from "../../theme/tokens";

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
  /**
   * AND THE SEARCH BOX IS WHITE — *"მინდა რომ სერჩიც თეთრი ფერის იყოს
   * ადმინკის მხარეს ყველგან"*.
   *
   * The filled variant's ground is `colorFillTertiary`, which this theme sets
   * to warm ink at 4% so a form's fields read as one material. That is right
   * inside a form and wrong here: the toolbar's field sits on the page's warm
   * grey, where a 4% warm wash is the same colour one shade over and the box
   * loses its edges. White gives it back, and it matches the active-filter
   * chips under it, which take white for the same reason.
   *
   * Three states, because antd derives them separately: resting, hover and
   * focused. Scoped to the toolbar's own ConfigProvider, so every form field
   * in the product keeps its fill.
   */
  components: {
    Input: {
      colorFillTertiary: brand.white,
      colorFillSecondary: brand.white,
      activeBg: brand.white,
    },
    /**
     * AND THE TOOLBAR'S OWN BUTTONS READ AT THE SEARCH BOX'S WEIGHT.
     *
     * "Filters" sat at full ink (88%) beside a placeholder at 66%, so two
     * controls on one line, doing the same job, were two different greys —
     * *"ფილტერ ტექსტი სხვა ფერის არის; სერჩში რა ფერიც აქვს ტექსტს, ის ფერი
     * ჩაუსვი"*. `quiet` is the same 66% the placeholder takes and measures
     * 4.6:1 on white, so it clears AA at this size.
     *
     * Only the DEFAULT button moves. The hover colour is antd's own and is
     * left alone, so the control still answers the pointer, and a primary
     * action in the same toolbar — "New user" — is untouched.
     *
     * AND IT CARRIES NO BORDER, same reasoning: "Filters" had a visible
     * 1px edge next to a search box with none — the box isn't borderless
     * either, its border is `transparent` at the same 1px (so the control
     * keeps its box model, nothing shifts by a pixel when it gains one on
     * focus) — so `defaultBorderColor` takes the same treatment here,
     * scoped to the DEFAULT variant alone for the identical reason.
     */
    Button: { defaultColor: brand.quiet, defaultBorderColor: "transparent" },
  },
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
   * The subtitle under the title. Pulled up under the heading (the title row
   * already keeps 24 below it, so -16 leaves an 8px gap), and capped at a
   * readable measure so a one-line description does not run the page's width.
   * The value matches the hand-rolled `lead` that Reporting and Acquisition
   * carried before this prop existed, so the look is unchanged.
   */
  subtitle: { display: "block", marginTop: -16, marginBottom: 20, maxWidth: 640 },
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
