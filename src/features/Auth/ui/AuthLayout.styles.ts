// src/features/Auth/ui/AuthLayout.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

/** The form column's width — the header row shares it. */
const CONTENT_WIDTH = 530;
/** Distance from the window edge to the form, and from the form to the image. */
const PAGE_GUTTER = 104;
/** The inset that makes the hero panel read as a floating card. */
const ASIDE_MARGIN = 20;
/** Pulls the panel's left edge back so the image does not dominate the page. */
const ASIDE_TRIM = 24;
/**
 * The left pane is sized, not split 50/50: it holds the form column plus its
 * gutters, minus the stretch the panel's own margin already covers, plus the
 * trim that keeps the image from taking over the page.
 */
const PANE_WIDTH = PAGE_GUTTER + CONTENT_WIDTH + PAGE_GUTTER - ASIDE_MARGIN + ASIDE_TRIM;

/** The form column. The header row shares it, so the logo lines up with the
 *  fields' left edge and the language switcher with their right. */
export const content: CSSProperties = { width: "100%", maxWidth: CONTENT_WIDTH };
/**
 * Every auth screen reserves the same block, top-aligned inside it, so the
 * heading lands at the same height whichever page (or page state) you are on.
 */
export const contentBlock: CSSProperties = { width: "100%", minHeight: 530 };

export const getStyles = (token: GlobalToken, hasAside: boolean, compact = false) =>
  ({
    page: {
      minHeight: "100vh",
      background: token.colorBgContainer,
    },
    pane: hasAside
      ? {
          flex: `0 1 ${PANE_WIDTH}px`,
          // The basis is the pane's full width, padding included.
          boxSizing: "border-box",
          minWidth: 0,
          padding: `40px ${PAGE_GUTTER - ASIDE_MARGIN + ASIDE_TRIM}px 40px ${PAGE_GUTTER}px`,
        }
      : {
          // No panel to balance against — the column just keeps its gutters.
          // On a phone the desktop gutter (104px each side) would crush the form
          // to a sliver, so it collapses to a slim edge margin below sm.
          flex: 1,
          minWidth: 0,
          padding: compact ? "32px 24px" : `40px ${PAGE_GUTTER}px`,
        },
    /** The hero panel — the brand family photo, covering the panel and clipped
     *  to its rounded corners. A background image on a div rather than an <img>,
     *  which the antd-only rule forbids in presentation. The fill shows while
     *  the photo loads. */
    aside: {
      flex: 1,
      minWidth: 0,
      margin: ASIDE_MARGIN,
      borderRadius: token.borderRadius,
      backgroundColor: token.colorFill,
      backgroundImage: "url(/auth-hero.jpg)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      overflow: "hidden",
    },
  }) satisfies Record<string, CSSProperties>;
