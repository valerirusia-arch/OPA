// src/shared/ui/PopinLine.tsx
//
// One popped-in line's own component, split out of tableColumns.tsx for one
// reason: it needs `theme.useToken()`, a hook, and a hook can only be called
// from an actual component — tableColumns.tsx is a logic module (it already
// can't hold a component alongside its other exports without losing Fast
// Refresh, see PopinDetails' old history).
//
// WHY A HOOK IS NEEDED AT ALL: antd's default body-text colour, `colorText`,
// is `colorTextBase` at reduced opacity — exactly right for a table cell
// sitting one grade below its row's main fact, and exactly wrong once that
// same text IS the fact a pop-in line exists to show ("the info should be
// dark, the label light, like SAP has"). `colorTextBase` has no opacity
// knocked off it, so the value reads as dark as the identifier itself.
// Hardcoding that hex here isn't an option — tokens.ts is the one file
// allowed raw hex — so this reads it from the theme instead.

import { Flex, Typography, theme } from "antd";
import type { ReactNode } from "react";
import type { PriorityColumn } from "./tableColumns";

// The mark this product already uses everywhere else for "nothing here" —
// an empty flag cell, an unfunded loan's date — so a popped column that
// happens to be blank for this row reads the same way inline as it did in
// its own cell, rather than as a label trailing off into nothing.
const POPIN_EMPTY = "—";

function popinValue<T>(column: PriorityColumn<T>, record: T, index: number): ReactNode {
  if (column.popinText) return column.popinText(record, index);
  const dataIndex = column.dataIndex as keyof T | undefined;
  const value = dataIndex !== undefined ? (record[dataIndex] as unknown) : undefined;
  if (!column.render) return (value as ReactNode) ?? null;
  const rendered = column.render(value, record, index);
  if (rendered && typeof rendered === "object" && "children" in rendered) {
    return (rendered as { children: ReactNode }).children;
  }
  return rendered as ReactNode;
}

/**
 * The label, then the value — side by side when there's room for both
 * (SAP's own example: "Vendor: Supplier 01" on one line), or the value
 * alone on the line below when there isn't (SAP's narrower-still example:
 * the value "moved below the corresponding label"). Plain flex-wrap, not a
 * media query: the label never shrinks, the value is the one flex item
 * allowed to wrap as a whole unit onto its own line, and ellipsis is the
 * last resort — only once the value doesn't fit even alone on a full-width
 * line of its own.
 */
export function PopinLine<T>({
  column,
  record,
  index,
}: {
  column: PriorityColumn<T>;
  record: T;
  index: number;
}) {
  const { token } = theme.useToken();
  const value = popinValue(column, record, index);
  const empty = value === null || value === undefined || value === "";

  return (
    <Flex gap={4} wrap="wrap" style={{ rowGap: 0 }}>
      <Typography.Text type="secondary" style={{ flexShrink: 0 }}>
        {column.title as ReactNode}:
      </Typography.Text>
      <span style={{ minWidth: 0, flex: "1 1 auto" }}>
        {empty ? (
          <Typography.Text type="secondary">{POPIN_EMPTY}</Typography.Text>
        ) : typeof value === "string" ? (
          <Typography.Text
            ellipsis={{ tooltip: value }}
            style={{ color: token.colorTextBase }}
          >
            {value}
          </Typography.Text>
        ) : (
          value
        )}
      </span>
    </Flex>
  );
}
