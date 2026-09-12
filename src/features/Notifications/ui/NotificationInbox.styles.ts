// src/features/Notifications/ui/NotificationInbox.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  /** The wireframe's own measure. A dropdown wider than this stops reading as
   *  a panel hanging off the bell and starts reading as a page. */
  panel: { width: 360 },
  head: { paddingInline: 16, paddingBlock: 12 },
  /** No end padding, so the link's words line up with the panel's edge. */
  markAll: { paddingInline: 0 },
  rule: { marginBlock: 0 },
  /**
   * The list scrolls, the head and the channel foot do not.
   *
   * A bell panel that grows with its contents ends up taller than the window
   * on the one account that has had a busy month, which is the account that
   * most needs to read it.
   */
  list: { maxHeight: 320, overflowY: "auto" },
  empty: { marginBlock: 32 },
  /** A row is the whole width, left-aligned, and as tall as its own copy. */
  row: {
    display: "block",
    width: "100%",
    height: "auto",
    paddingInline: 16,
    paddingBlock: 12,
    textAlign: "start",
    borderRadius: 0,
  },
  rowInner: { width: "100%" },
  mark: { fontSize: 20, flex: "none", marginTop: 2 },
  /** `minWidth: 0` or the ellipsis on the title never triggers. */
  copy: { flex: 1, minWidth: 0 },
  /** The line under the title: 13px, the product's own secondary size. */
  body: { fontSize: 13, whiteSpace: "normal" },
  on: { fontSize: 12 },
  /** The wireframe's 8px dot, level with the first line of the title. */
  dot: { flex: "none", marginTop: 6 },
  channelRow: { paddingInline: 16, paddingBlock: 8 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    title: { fontWeight: 600, fontSize: 15 },
    rowTitle: { display: "block" },
    /** Unread reads as weight, not colour: the dot carries the state and a
     *  second signal in blue would make every unread row look like a link. */
    titleUnread: { display: "block", fontWeight: 600 },
    /**
     * The shaded foot, as the wireframe has it — the preferences are not one
     * more notification, so they sit on their own ground with a rule above.
     */
    channels: {
      borderTop: `1px solid ${token.colorSplit}`,
      background: token.colorFillQuaternary,
      paddingBlock: 4,
    },
  }) satisfies Record<string, CSSProperties>;
