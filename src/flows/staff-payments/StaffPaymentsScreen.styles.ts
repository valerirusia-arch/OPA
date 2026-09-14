// src/flows/staff-payments/StaffPaymentsScreen.styles.ts

import type { CSSProperties } from "react";

export const styles = {
  /** The same width every other back-office toolbar control uses. */
  search: { width: 300 },
  /**
   * INLINE PADDING ONLY.
   *
   * It was the page's `cardBlock` — 24 on all four sides — which put 24px of
   * empty card above the labels AND, because the ink bar is drawn at the
   * bottom of the tab and the bar's own rule is drawn at the bottom of the
   * NAV, left the two 24px apart. An active-tab underline floating a
   * finger's width above the line it belongs to is what *"სტროუკზე უნდა
   * იჯდეს ეს ტაბი"* is pointing at.
   *
   * 24 inline keeps the labels on the same left edge as the table's first
   * column; the block space is the tab item's own, which every other tab bar
   * in the product already uses.
   */
  tabBar: { paddingInline: 24, marginBottom: 0 },
} satisfies Record<string, CSSProperties>;
