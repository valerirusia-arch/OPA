// src/shared/ui/AppHeader.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken, ThemeConfig } from "antd";
import { brand } from "../../theme/tokens";

/** What the top bar's contents keep off each edge of the window. */
export const HEADER_INSET = 32;
/** ...and on a phone, where 32 each side is a sixth of the screen. */
export const HEADER_INSET_COMPACT = 16;

/**
 * The bar's height. Shared so a page that wants to fill what is left of the
 * window can subtract it instead of guessing — the back office's own header is
 * the same height, so one number covers both shells.
 */
export const HEADER_HEIGHT = 64;

/** Transparent, or the nav paints an opaque strip over the bar's own blur. */
export const navMenu: CSSProperties = {
  flex: 1,
  minWidth: 0,
  borderBottom: "none",
  background: "transparent",
};

/**
 * The top bar's own menu spacing.
 *
 * The global Menu tokens are tuned for the back-office RAIL, where rows sit
 * one above the other and 8px of side padding is right. Laid out in a line
 * those same 8s leave the links 16px apart, which reads as one long word.
 * 12 each side puts 24px between them — scoped here, so the rail is untouched.
 */
export const navTheme: ThemeConfig = {
  components: {
    Menu: {
      itemPaddingInline: 12,
      /**
       * The active link's underline is drawn on the BOTTOM of its menu item,
       * so the item has to be as tall as the bar for the underline to land on
       * the bar's own edge. At antd's default 46px it floats in mid-air a few
       * pixels above the border, reading as a stray rule rather than as the
       * tab it is. Matching the bar's height sits it directly on the border.
       */
      horizontalLineHeight: `${HEADER_HEIGHT}px`,
      itemMarginBlock: 0,
    },
  },
};
/**
 * How far to pull the unread count in from the button's corner.
 *
 * Measured, not guessed: the header's bell is a 48px button around a ~16px
 * glyph, so antd's default corner lands the count 24px out from the centre on
 * both axes — a good 16px clear of anything drawn, which is why it read as a
 * red dot floating in the header. 14 back along each axis puts it on the
 * bell's own top-right corner.
 */
export const badgeOffset: [number, number] = [-14, 14];

/**
 * THE PANEL RUNS TO ITS OWN EDGES.
 *
 * The notification panel supplies its own padding row by row, because a row
 * has to reach the panel's edges to be pressable across its whole width — and
 * the shaded preferences foot has to reach them to read as a foot rather than
 * as a grey block floating inside a white one. *"ეს ნაცრისფერი ქვემოთ რომ
 * არის, ფერი ბოლომდე გაწიე გვერდებზე; არ მომწონს ესე სფეისი რომ არის."*
 *
 * It was already `padding: 0` and it was going to the WRONG NODE. antd 6
 * renamed the popover's panel from `.ant-popover-inner` to
 * `.ant-popover-container`, and `styles.content` lands on
 * `.ant-popover-content`, which had no padding to remove. Measured: the
 * container carried 12px on all four sides, so the head sat 28 from the left
 * and the grey foot stopped 12 short of the bottom and both sides.
 *
 * `overflow: hidden` is the other half of it. With the foot finally reaching
 * the edges, its square corners would otherwise sit outside the panel's 14px
 * radius — the grey would poke past the curve instead of being cut by it.
 */
export const popoverPanel: CSSProperties = { padding: 0, overflow: "hidden" };

export const userButton: CSSProperties = { height: 40, paddingInline: 8 };

export const getStyles = (token: GlobalToken, compact = false) =>
  ({
    /** Fixed: the menu beside it is the one that gives way. On a phone the nav
     *  is a drawer (out of the flow), so an auto start-margin does the pushing
     *  the horizontal menu's flex:1 does on a wide screen. */
    account: { flex: "none", marginInlineStart: "auto" },
    /** Mobile nav trigger, sat before the logo. */
    burger: { flex: "none", fontSize: token.fontSizeLG },
    /** Full-bleed bar: the background and rule run edge to edge... */
    header: {
      position: "sticky",
      top: 0,
      zIndex: 10,
      display: "flex",
      alignItems: "center",
      height: HEADER_HEIGHT,
      /**
       * Translucent, with what shows through blurred.
       *
       * Pinned and opaque, the bar is a lid: text scrolls up to it and
       * vanishes at a hard line. Frosted, the page visibly continues under it
       * — you can see that something is up there — while the blur keeps the
       * nav readable over whatever happens to be passing beneath.
       *
       * The colour still falls back to white where backdrop-filter is not
       * supported; the bar just loses the blur, not its legibility.
       */
      background: brand.headerVeil,
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderBottom: `1px solid ${token.colorBorderSecondary}`,
    },
    /**
     * The bar's CONTENTS keep a fixed inset off each edge rather than sitting
     * on the page's centred content column.
     *
     * The bar is chrome, not content: the logo belongs near the corner it
     * anchors and the account menu near the opposite one, the way a browser's
     * own toolbar sits. Pinned to the 1216px column instead, both drift
     * inwards on a wide screen and the bar reads as a card that forgot its
     * edges. Only this header does this — the page below it stays on the grid.
     */
    inner: {
      width: "100%",
      paddingInline: compact ? HEADER_INSET_COMPACT : HEADER_INSET,
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      gap: compact ? token.padding : token.paddingLG,
    },
  }) satisfies Record<string, CSSProperties>;
