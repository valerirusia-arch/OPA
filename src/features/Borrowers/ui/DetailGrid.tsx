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
import { getStyles, styles } from "./DetailGrid.styles";

export type DetailItem = {
  key: string;
  label: string;
  /** A string, or a tag when the value is a state rather than a fact. */
  value: ReactNode;
};

export function DetailGrid({ items }: { items: DetailItem[] }) {
  const { token } = theme.useToken();
  const s = getStyles(token);

  return (
    <Row gutter={24}>
      {items.map((item) => (
        <Col key={item.key} xs={24} sm={12} lg={8} style={styles.item}>
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
