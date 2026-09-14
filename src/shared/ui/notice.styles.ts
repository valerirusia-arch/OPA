// src/shared/ui/notice.styles.ts

import type { CSSProperties } from "react";

/**
 * THE PANEL, REMOVED — see PageNotice.tsx for why.
 *
 * `background` and `border` go to nothing and the padding with them, so the
 * notice's first pixel is its icon and its text starts on the same left edge
 * as the page's own content. What antd keeps doing is the part that matters:
 * the icon, its colour, and the alert semantics.
 *
 * The 24 below is the page's band rhythm, the same gap every card on these
 * screens leaves under itself.
 */
export const pageNotice: CSSProperties = {
  background: "transparent",
  border: "none",
  padding: 0,
  marginBottom: 24,
  /**
   * THE MARK SITS ON THE FIRST LINE, NOT IN THE MIDDLE OF THE PARAGRAPH.
   *
   * antd centres a title-only Alert's icon against the whole text block,
   * which is right for the one-line notices and wrong the moment one wraps:
   * the funding notice runs to two lines and its icon was drawn floating
   * between them, attached to neither.
   */
  alignItems: "flex-start",
};

/**
 * And the nudge that puts it ON that line rather than above it.
 *
 * The glyph is 16 and the copy's line box is 14 x 1.6 = 22.4, so 3px lands
 * the mark's centre on the first line's centre.
 */
export const pageNoticeIcon: CSSProperties = { marginTop: 3 };
