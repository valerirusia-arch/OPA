// src/features/Dashboard/ui/ShortcutTiles.tsx
//
// The dashboard's first band: four facts, each a way into the page that owns
// it.
//
// THE WIREFRAME DRAWS FOUR LABELS. Loan amount, Virtual card, Payment history,
// Documents — an icon and a word each, 286 × 128. Drawn that way they are four
// links to pages the top navigation already lists, occupying the most valuable
// band on the page to say nothing a reader did not already know.
//
// So each one carries ITS OWN FIGURE: the amount, whether the card has been
// used, how far through the schedule, how many documents. Same four facts,
// same destinations — and the first thing on the page answers three questions
// instead of repeating the navigation. *"მონაცემიც ჩავსვათ მათში."*
//
// ─────────────────────────────────────────────────────────────────────────
// WHAT MADE THE BAND HEAVY, AND WHAT DID NOT.
//
// It was four bordered cards, each with a 40px grey square holding an icon,
// on a 148px floor. The designer called the band visually heavy and asked for
// as light and clean as it can be. Three things were doing the weight and
// none of them was the border:
//
//   · a filled grey square INSIDE each bordered card — a surface on a surface,
//     four times over, decorating a label that already says the word;
//   · a 148px floor under content about 70px tall, so most of the band was
//     air held open by a box;
//   · the figures at 20px, which made four navigation numbers the loudest
//     thing on the page after the balance.
//
// All three are gone. The middle pass also merged the four into ONE card
// divided by hairlines, and that is the one part the designer sent back:
// *"ესენი შეერთებული რომ არის არ მომწონს."* Four things that go to four
// places are four cards. They are simply light ones now.
//
// A TILE IS A BUTTON. It goes somewhere, so it is a control: antd's focus
// ring, keyboard behaviour and hover come with that, and none of them come
// with a div that happens to have an onClick.
//
// AND IT SAYS SO AT REST. An earlier pass leaned on the hover fill alone to
// mean "pressable", which is a cue that does not exist on a touch screen —
// four routes that looked like four read-only facts to anybody on a phone.
// A chevron at the end of the label row costs one quiet glyph and is the
// convention for exactly this.
//
// Dumb: tiles in, a callback out.

import { useState, type ReactNode } from "react";
import { Button, Col, Flex, Row, Skeleton, Typography, theme } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { getStyles, styles } from "./ShortcutTiles.styles";

export type Shortcut = {
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
  to: string;
};

export type ShortcutTilesProps = {
  items: Shortcut[];
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
  onOpen?: (to: string) => void;
};

export function ShortcutTiles({ items, emptyValue, onOpen }: ShortcutTilesProps) {
  const { token } = theme.useToken();
  const s = getStyles(token);
  /* WHICH TILE IS UNDER THE POINTER OR THE CARET. Local, presentational, and
     the only state this component has: a hover that has to change a border,
     a shadow and a child's transform at once cannot be left to antd's own
     default-button hover, which would turn the whole card accent-coloured. */
  const [raised, setRaised] = useState<string | null>(null);

  return (
    /* Four across on a desktop, two on a tablet, one on a phone, and the
       gutter is the page's own 24 — the same gap that separates every other
       band on this screen, so four cards in a row belong to the page's
       rhythm rather than forming a block of their own. */
    <Row gutter={[24, 24]}>
      {items.map((item) => (
        <Col key={item.key} xs={24} sm={12} lg={6}>
          <Button
            style={raised === item.key ? { ...s.tile, ...s.tileRaised } : s.tile}
            onMouseEnter={() => setRaised(item.key)}
            onMouseLeave={() => setRaised((key) => (key === item.key ? null : key))}
            onFocus={() => setRaised(item.key)}
            onBlur={() => setRaised((key) => (key === item.key ? null : key))}
            onClick={() => onOpen?.(item.to)}
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
                {/* At the end of the row rather than on a line of its own:
                    the vertical rhythm is label, figure, hint, and an
                    affordance is not one of the three. */}
                <RightOutlined
                  style={raised === item.key ? s.chevronRaised : s.chevron}
                />
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
          </Button>
        </Col>
      ))}
    </Row>
  );
}

export default ShortcutTiles;
