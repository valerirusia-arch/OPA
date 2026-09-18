// src/shared/ui/tableColumns.ts
//
// Table chrome that a column definition alone cannot say.
//
// Two things, both about spacing:
//
//   Rows are tight — 8px above and below — so a long list can be scanned. The
//   header is not a row but the label above them, and at the same 8px it
//   collapses onto the first record; 16px gives it back its own weight.
//
//   The table runs flush to the card's edge, which means the first and last
//   columns would start 16px in while the card's other contents start at 24.
//   The extra 8px on the outer edges puts the whole table on the same margin
//   as everything else on the page.
//
// antd exposes no token for either, but it does let a column decorate its own
// header and body cells — so this stays style objects, not a stylesheet.

import type { CSSProperties } from "react";
import type { ColumnsType } from "antd/es/table";

/** Matches the card's own padding, so the table lines up with it. */
export const TABLE_EDGE_INSET = 24;
const HEADER_PADDING_BLOCK = 16;

/**
 * One row height for every table in the product.
 *
 * Left to itself a row is as tall as its tallest cell, so a list of plain text
 * sits at 40px while an otherwise identical list with a menu button in the
 * last column sits at 64 — and the two screens stop looking like the same
 * product. Pinning the height settles it: this is a floor, so a cell that
 * genuinely needs two lines still grows.
 */
export const TABLE_ROW_HEIGHT = 64;

/**
 * THE WIDTH OF A NAME COLUMN, and the rule that goes with it.
 *
 * With `tableLayout="fixed"` every spare pixel goes to the one column that has
 * no width. So a table has AT MOST ONE column without a width, and it is the
 * longest free-text field it carries — the USCIS service, an address, an email
 * — never a name. A flexible name column opened a 600px hole between the
 * person and their first fact on the queue, the loans list and both dashboard
 * tabs, all four at once.
 *
 * Where a table has no long field at all, every column takes a width and the
 * browser stretches them proportionally: the air is shared instead of dumped
 * in one place.
 *
 * 260 fits the longest name in the mocks over its reference line. Lists with
 * seven columns to fit (the borrower list) size their own name column tighter
 * and are still following the rule — what matters is that it HAS one.
 */
export const TABLE_NAME_WIDTH = 260;

/**
 * Marks a heading cell that carries no label — the row-actions column.
 *
 * antd separates headings with a short vertical rule, which is right between
 * two words and wrong before a blank: it looks like a heading fell out. The
 * rule belongs to the cell BEFORE the blank one, so the stylesheet reaches it
 * through this class (see index.html) — a `::before` is not something a style
 * object can touch.
 */
const PLAIN_HEADER_CLASS = "opa-th-plain";

export function decorateColumns<T>(columns: ColumnsType<T>): ColumnsType<T> {
  const last = columns.length - 1;

  return columns.map((column, index) => {
    const edge = {
      ...(index === 0 ? { paddingInlineStart: TABLE_EDGE_INSET } : null),
      ...(index === last ? { paddingInlineEnd: TABLE_EDGE_INSET } : null),
    };

    // A column may still bring its own onCell / onHeaderCell — its style is
    // merged on top rather than replaced, so a single column can nudge its
    // own padding without opting out of the row height and the edge insets.
    // Read loosely: antd and rc-table disagree about the `title` type on a
    // column group, which makes the precise column type unusable here. All
    // this needs is the style a column may have set for itself.
    const own = column as {
      onHeaderCell?: () => { style?: CSSProperties };
      onCell?: () => { style?: CSSProperties };
    };
    const ownHeader = own.onHeaderCell?.() ?? {};
    const ownCell = own.onCell?.() ?? {};

    return {
      ...column,
      onHeaderCell: () => ({
        ...ownHeader,
        style: {
          paddingBlock: HEADER_PADDING_BLOCK,
          ...edge,
          ...ownHeader.style,
        },
        className: column.title ? undefined : PLAIN_HEADER_CLASS,
      }),
      onCell: () => ({
        ...ownCell,
        style: { height: TABLE_ROW_HEIGHT, ...edge, ...ownCell.style },
      }),
    };
  });
}
