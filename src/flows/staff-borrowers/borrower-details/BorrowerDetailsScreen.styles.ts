// src/flows/staff-borrowers/borrower-details/BorrowerDetailsScreen.styles.ts

import type { CSSProperties } from "react";

/** The margin the card's own contents keep from its edge. */
const CARD_INSET = 24;

export const styles = {
  /**
   * The card carries no padding of its own so the tab bar's rule runs edge to
   * edge, the way the tables' header band does. The tab bar and the record
   * below it bring the inset back.
   */
  card: { overflow: "hidden" },
  /** Clips the flush tabs and tables to the card's radius. */
  cardClip: { overflow: "hidden" },
  cardBody: { padding: 0 },
  tabBar: { paddingInline: CARD_INSET, marginBottom: 0 },
  /** The last row of the grid already carries its own 24px underneath. */
  /**
   * THE BOTTOM INSET IS NOT ZERO ANY MORE.
   *
   * It was `24px 24px 0`, which left whatever ended the tab sitting on the
   * card's own edge — measured at 1px between the last control and the frame.
   * The other three tabs end in a form whose own margin covered for it; the
   * loan tab ends in a comment, and it showed.
   */
  tabBody: { padding: CARD_INSET },
  /** A link button with its own padding taken off, so its words line up with
   *  the panel above it. */
  /**
   * A link button with antd's own padding taken off, so its words line up with
   * the panel above it — and with its trailing arrow given room, since with
   * zero padding the glyph sat flush against whatever edge it ended on.
   */
  recordLink: {
    paddingInline: 0,
    height: "auto",
    alignSelf: "flex-start",
    marginInlineEnd: 2,
  },
  /** The reverse side of the link, under whatever the tab showed first. */
  sponsoring: { marginTop: 8 },
  sponsoringLabel: { fontWeight: 500 },
  sponsoringCap: { fontSize: 13 },
  /** The way through to the loan's own record, under its summary. */
  /** The loan's state and the way to its full record, on one line above the
   *  fields. A state is not a field and a way out is not a comment — see the
   *  note in the tab. */
  /**
   * The state and the way through, facing each other across the tab's first
   * line — and standing clear of the facts below.
   *
   * The tab body's gap alone put the grid 24 under them, which read as the
   * same distance the grid's own rows keep from each other, so the pair
   * looked like one more row of it. The extra 12 makes the line a header for
   * what follows rather than part of it. *"ცოტა მაგათ ქვემოთ ინფო უფრო ჩაწიე
   * დაბლა, და ფუნდედი და ეს პირისპირ დატოვე."*
   */
  loanState: { width: "100%", marginBottom: 12 },
} satisfies Record<string, CSSProperties>;
