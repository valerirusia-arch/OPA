// src/shared/ui/EmptyState.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";
import { brand } from "../../theme/tokens";

/**
 * A full page of rows plus the header. An empty table that keeps this height
 * leaves the card the size it was a moment ago, instead of snapping shut and
 * dragging everything below it up the page.
 */
export const TABLE_EMPTY_MIN_HEIGHT = 288;

export const styles = {
  /** A touch heavier than the body, so the title reads as the title — just a
   *  touch. *"თაითლები ოდნავ უფრო გააბოლდე, სულ ოდნავ."* */
  title: { display: "block", fontWeight: 500 },
  /** A single-line empty that reads as a quiet caption, not a heading — the
   *  line in the caption grey at regular weight. *"საბთაითლი არ უნდა, ტექსტი
   *  საბთაითლის ფერში."* */
  titleMuted: { display: "block", fontWeight: 400, color: brand.sceneCaption },
  /** antd pins its image slot to a fixed height; the illustration is let out to
   *  its own. 16 below it to the copy — *"16-ზე ამ შემთხვევაში."* */
  image: { height: "auto", marginBottom: 16 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /** antd's own illustration; only the space around it is ours. */
    empty: { margin: 0, padding: token.paddingLG },
    description: { display: "block", marginTop: 4, color: brand.sceneCaption },
  }) satisfies Record<string, CSSProperties>;
