// src/shared/ui/ResponsiveModal.styles.ts

import type { CSSProperties } from "react";

export const styles = {
  /** The bottom sheet's panel: well rounded along the top where it meets the
   *  screen edge, and capped so a tall sheet scrolls its own body rather than
   *  covering the whole screen. `dvh` so the browser chrome on a phone does not
   *  push the foot of the sheet off-screen. */
  sheetContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    maxHeight: "90dvh",
  },
  /** Room above the title for the grab handle, and no divider under the header
   *  — the sheet reads as one surface, the way the references draw it. Relative
   *  so the handle can be centred across the full width regardless of the close
   *  button on the right. Tight block padding so the title sits just under the
   *  handle and the body follows it, rather than a tall band of empty header. */
  sheetHeader: { position: "relative", paddingTop: 18, paddingBottom: 10, borderBottom: "none" },
  /** The body scrolls inside the capped panel; the header and footer stay put.
   *  A smaller top inset than antd's default 24, so the first control sits
   *  close under the title instead of across a gap. */
  sheetBody: { overflowY: "auto", paddingTop: 8 },
  /** The close control, held to the title's own height so it doesn't inflate
   *  the header into a tall band. */
  sheetClose: { width: 32, height: 32 },
  /** The grab handle: a short, rounded bar centred at the very top of the sheet.
   *  Absolute, so it is centred across the whole width no matter what the header
   *  holds; the colour is applied from a theme token at the call site. */
  handle: {
    position: "absolute",
    top: 9,
    left: "50%",
    transform: "translateX(-50%)",
    width: 36,
    height: 5,
    borderRadius: 999,
  },
} satisfies Record<string, CSSProperties>;
