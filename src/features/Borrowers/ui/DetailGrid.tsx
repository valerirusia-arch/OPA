// src/features/Borrowers/ui/DetailGrid.tsx
//
// A read-only grid of label-and-value pairs — how every tab of a borrower's
// record is laid out.
//
// WBS: "Read-only access. Editing is covered by Manage borrower accounts." So
// these are never inputs: a disabled field looks like something you could have
// filled in, and this is a record, not a form waiting to be unlocked.
//
// Dumb: it renders the items it is handed, in the order it is handed them.

import type { ReactNode } from "react";
import { Col, Row, Typography, theme } from "antd";
import { getStyles } from "./DetailGrid.styles";

export type DetailItem = {
  key: string;
  label: string;
  /** A string, or a tag when the value is a state rather than a fact. */
  value: ReactNode;
};

export type DetailGridProps = {
  items: DetailItem[];
  /**
   * HOW MANY COLUMNS ON A WIDE SCREEN. Three by default, two for a card that
   * does not get the whole page.
   *
   * antd's breakpoints measure the VIEWPORT, not the container, so `lg` was
   * giving three columns to the underwriting screen's evidence card as
   * happily as to the full-width borrower record — except that card sits in a
   * half-width column, so each of the three came out around 210px and
   * "I-485 · Adjust Status / Register Permanent Residence" broke across three
   * lines beside two values that fit on one. The card cannot know how wide it
   * is; the screen placing it does, so it says. *"ესენიც უფრო სუფთა
   * გახადე."*
   */
  columns?: 2 | 3;
};

export function DetailGrid({ items, columns = 3 }: DetailGridProps) {
  const { token } = theme.useToken();
  const s = getStyles(token);

  return (
    /* THE ROW GAP IS THE ROW'S, not a margin under every item. As a margin it
       was also applied under the LAST row, which left a band of dead space at
       the foot of every one of these cards — most visible on a card with one
       row in it, where the gap was as tall as the content. A gutter puts the
       24 BETWEEN rows and nowhere else. */
    <Row gutter={[24, 24]}>
      {items.map((item) => (
        <Col key={item.key} xs={24} sm={12} lg={columns === 2 ? 12 : 8}>
          <Typography.Text style={s.label}>{item.label}</Typography.Text>
          {typeof item.value === "string" ? (
            <Typography.Text style={s.value}>{item.value}</Typography.Text>
          ) : (
            item.value
          )}
        </Col>
      ))}
    </Row>
  );
}

export default DetailGrid;
