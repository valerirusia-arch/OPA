// src/features/Applications/ui/VerificationList.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

/**
 * THE ROW'S OWN AIR, taken from the dashboard's "steps so far" list.
 *
 * 16 above and below, and it was 12 with a Divider doing the separating. Each
 * row carries two lines now, and at 12 the rule above a row sat closer to the
 * sentence of the row ABOVE it than to the name it was introducing — which is
 * the same reason the dashboard's list landed on 16.
 */
const ROW_PAD = 16;

export const styles = {
  /** The first row has nothing above it to be separated from. */
  rowFirst: { width: "100%", paddingBlock: ROW_PAD },
  /** The left column: the check's name over the line saying what it looked at.
   *  It takes the row and may shrink so the outcome on the right keeps its
   *  place. */
  name: { minWidth: 0, flex: "1 1 auto" },
  /**
   * The check's name, a half-step firmer than the line under it.
   *
   * It was 400, the same weight as its own caption, so the two lines of a row
   * read as one block of grey and the four names stopped being the thing you
   * scan. 500 is the step this product uses everywhere something is a value
   * rather than a description — enough to separate the name from its caption,
   * not enough to make four of them shout. *"ძალიან ოდნავ მოუმატე თაითლეს
   * სისქე."*
   */
  nameText: { minWidth: 0, fontWeight: 500 },
  /** The outcome group, pinned to the top of the row so it sits on the check's
   *  name rather than halfway down the sentence under it. */
  end: { flex: "none", paddingTop: 1 },
  /** The conclusion panel's subtitle. */
  detail: { fontSize: 13 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /** Every row but the first: hairlines BETWEEN the rows, not around them, so
     *  the list reads as a record and not as four more cards — and none under
     *  the last, which would be a rule with nothing beneath it. */
    row: {
      width: "100%",
      paddingBlock: ROW_PAD,
      borderTop: `1px solid ${token.colorSplit}`,
    },
    /** What the check looked at. One step down from the name, at the size the
     *  dashboard's own record lines take. */
    about: { fontSize: 13, color: token.colorTextTertiary },
    /** The provider's evidence, right-aligned and quiet — the mark and the
     *  colour carry the verdict, so the words only have to say what was found. */
    evidence: {
      fontSize: 13,
      textAlign: "end",
      color: token.colorTextTertiary,
    },
    /** The eligibility conclusion — the automated verdict that weighs every
     *  check and the score together. It reads as a CONCLUSION, not one more
     *  row: a light contained ground with room to breathe (20 inside), set off
     *  by symmetric space — the 4 here lifts the gap above it to match the 24 of
     *  the card's own foot below, so the panel sits evenly framed at the bottom.
     *  The colour still lives on the outcome tag, so the block stays calm. */
    conclusion: {
      background: token.colorFillQuaternary,
      borderRadius: token.borderRadiusLG,
      padding: 20,
      marginTop: 4,
    },
  }) satisfies Record<string, CSSProperties>;
