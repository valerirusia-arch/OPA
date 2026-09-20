// src/features/Dashboard/ui/FactTiles.tsx
//
// The dashboard's first band: four facts about the loan, side by side.
//
// THEY WERE FOUR LINKS AND THEY ARE NOT ANY MORE. The wireframe drew four
// labels — Loan amount, Virtual card, Payment history, Documents — each a way
// into the page that owns it, and each carrying its own figure so the band
// answered something instead of repeating the navigation.
//
// The designer has taken the navigation out of them: *"არ უნდა იყოს
// ინტერაქციული, ანუ აროუ როა ამოიღე და ჰოვერზე როა რაღაცა ეგეც ამოიღე."*
// What the band carries now is the loan's own money facts — the amount, the
// fees applied to it, what would close it today, when it ends — and those are
// not four destinations, they are one statement in four parts. Nothing is
// lost: the pages they used to link to are in the top navigation, one click
// away and named.
//
// So the Button is gone with the chevron and the hover, and with them the
// reasons they existed:
//
//   · A TILE WAS A BUTTON because it went somewhere, and antd's focus ring,
//     keyboard behaviour and hover came with that. A fact goes nowhere; a
//     control that does nothing is worse than no control.
//   · THE CHEVRON said "pressable" at rest, for a touch screen with no hover
//     to reveal it. With nothing to press it would be a promise the tile
//     cannot keep.
//
// WHAT SURVIVED, and why. Four separate cards rather than one divided by
// hairlines: *"ესენი შეერთებული რომ არის არ მომწონს."* The light treatment
// that replaced a heavier one — no 40px icon chip, no 148px floor, figures at
// 18 rather than 20 — is all still right, and none of it was about the link.
//
// Dumb: facts in, nothing out.

import type { ReactNode } from "react";
import { Col, Flex, Row, Skeleton, Typography, theme } from "antd";
import { getStyles, styles } from "./FactTiles.styles";

export type Fact = {
  key: string;
  icon: ReactNode;
  label: string;
  /**
   * The tile's own fact.
   *
   * Optional: with nothing to report the tile shows `emptyValue` in the
   * quiet colour instead, so the band keeps its shape and still reads as
   * four things that are not known yet.
   */
  value?: string;
  /** One quieter line under it, where the figure needs a qualifier. */
  hint?: string;
};

export type FactTilesProps = {
  items: Fact[];
  /**
   * What a tile MEANS when it has no figure yet.
   *
   * Not printed: four tiles each spelling out "No info yet" is the same
   * sentence four times at figure size, which is louder than any of the real
   * figures it stands in for. *"ეს საშინელებაა, რაიმე უფრო მსუბუქი."* The
   * slot shows a quiet bar instead — the shape of a figure that is not known
   * yet — and this string is what a screen reader is told, where four
   * repetitions cost nothing.
   */
  emptyValue?: string;
};

export function FactTiles({ items, emptyValue }: FactTilesProps) {
  const { token } = theme.useToken();
  const s = getStyles(token);

  return (
    /* Four across on a desktop, two on a tablet, one on a phone, and the
       gutter is the page's own 24 — the same gap that separates every other
       band on this screen, so four cards in a row belong to the page's
       rhythm rather than forming a block of their own. */
    <Row gutter={[24, 24]}>
      {items.map((item) => (
        <Col key={item.key} xs={24} sm={12} lg={6}>
          <div
            style={s.tile}
            aria-label={item.value || !emptyValue ? undefined : `${item.label}. ${emptyValue}`}
          >
            {/* 12 UNDER THE LABEL, 6 UNDER THE FIGURE. Three lines at a flat
                4 apart were one block of text with nothing to say which line
                belonged to which — *"ტექსტი ვერ სუნთქავს"*. The label heads
                the figure and the hint footnotes it, so the gap between the
                two groups is twice the gap inside one. */}
            <Flex vertical gap={12} style={styles.inner}>
              {/* The mark at the label's size, on the label's line. It was a
                  40px grey chip on a row of its own; at that weight four of
                  them were the loudest thing in the band, ahead of the
                  money. */}
              <Flex align="center" justify="space-between" gap={8} style={styles.labelRow}>
                {/* The mark and the word are ONE thing and stay together at
                    the start. Left as three children of a `space-between`
                    row they spread across the cell and the label ended up
                    centred under nothing. */}
                {/* 10, not 7. The label is 11px caps on 0.04em tracking —
                    letters already held apart — so a mark set as close to it
                    as two letters are to each other joins the word instead of
                    introducing it. */}
                <Flex align="center" gap={10} style={styles.labelGroup}>
                  <Flex align="center" style={s.mark}>
                    {item.icon}
                  </Flex>
                  <Typography.Text style={s.label} ellipsis>
                    {item.label}
                  </Typography.Text>
                </Flex>
              </Flex>

              {/* THE QUALIFIER SITS BESIDE THE FIGURE, NOT UNDER IT. "1.00%
                  APR" is not a third fact in the tile, it is the second half
                  of the first one — and on its own line it was a third line
                  of type in a box with two. Baseline-aligned so a 16px figure
                  and a 13px note share one line rather than one box, and it
                  wraps under on a tile too narrow to hold both. */}
              <Flex align="baseline" gap={8} wrap>
                {item.value ? (
                  <Typography.Text style={s.value}>{item.value}</Typography.Text>
                ) : (
                  /* The figure's slot, held open. antd's own skeleton block
                     rather than a drawn bar, so it inherits the theme's radius
                     and fill and needs nothing hand-rolled. */
                  <Skeleton.Input active={false} size="small" style={styles.placeholder} />
                )}

                {item.hint ? (
                  <Typography.Text type="secondary" style={styles.hint}>
                    {item.hint}
                  </Typography.Text>
                ) : null}
              </Flex>
            </Flex>
          </div>
        </Col>
      ))}
    </Row>
  );
}

export default FactTiles;
