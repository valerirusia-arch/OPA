// src/features/Dashboard/ui/ApplicationProgress.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";
import { LEAD_PANEL_INSET } from "../../../shared/ui/panel.styles";

export const styles = {
  /**
   * The lead inset, because this band IS the dashboard's lead before there is
   * a balance to lead with — it occupies the same slot the money card takes
   * after funding, and the two must not sit at different distances from their
   * own edges.
   *
   * The extra two at the top are the caret's business: the marker over the
   * live node hangs above the rail, and at a flat 32 it sat closer to the
   * card's edge than the rail sat to the rule below it — the band read as
   * top-heavy by exactly the height of one glyph.
   */
  body: {
    paddingTop: LEAD_PANEL_INSET + 2,
    paddingInline: LEAD_PANEL_INSET,
    paddingBottom: LEAD_PANEL_INSET,
  },
  /** The row under the rule: words on the left, the move on the right. */
  detail: { width: "100%" },
  /** `minWidth: 0` so the sentence wraps inside its own column instead of
   *  widening the row and pushing the button off the card. */
  copyBlock: { minWidth: 0 },
  title: { marginTop: 0, marginBottom: 0 },
  /**
   * A reading measure, not the band's full width.
   *
   * These sentences run past 120 characters and the card is wide enough to
   * set every one of them as a single line — which is the width at which an
   * eye loses the start of the next.
   *
   * 460px, MEASURED, because `ch` lies about this face: `64ch` computed to
   * 564px and the average character in the real copy is 6.5px, so that line
   * was carrying 87 characters, not 64. The `ch` unit is the advance of "0",
   * which in this font is a third wider than the letters around it. 460 / 6.5
   * is 71 characters, inside the 65–75 the eye tracks comfortably.
   */
  copy: { fontSize: 14, maxWidth: 460, display: "block" },
  /** Never squeezed: the row's `space-between` gives the words the slack and
   *  the label keeps its own width, so "Open the documents" does not become
   *  two lines because the sentence beside it grew. */
  action: { flex: "none" },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /**
     * The rule between the road and the place you are standing.
     *
     * Equal air on both sides: a divider is a joint, and unequal margins
     * would attach it to one of the two things it separates. The heading
     * below it then has 24 above and 8 below its own sentence, which is the
     * order that reading wants.
     */
    rule: {
      height: 1,
      background: token.colorSplit,
      marginBlock: 24,
    },
  }) satisfies Record<string, CSSProperties>;
