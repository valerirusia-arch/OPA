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

import { useCallback, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Flex } from "antd";
import type { ColumnsType, ColumnType } from "antd/es/table";
import { PopinLine } from "./PopinLine";

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

// ---------------------------------------------------------------------------
// Responsive columns — SAP Fiori's "pop-in" pattern, composed from antd.
//
// Every table in this product used to answer a narrow screen the same way:
// `scroll={{ x: N }}`, a horizontal scrollbar hiding the back half of every
// row. SAP's responsive table (sap.m.Table) solves this instead by ranking
// columns and, as space runs out, moving the lowest-ranked ones out of the
// grid and into a label/value list under the row — the "pop-in area" — so
// the user sees less, rather than has to scroll to see the rest.
//
// A column's `priority` says how willing it is to leave the table:
//   high    — the identifier and the one key fact, SAP's own phrase for what
//             a responsive table keeps "for the smallest screen width".
//             Last to pop, but — unlike a truly unlabeled column — not
//             exempt: two `high` columns that still don't fit each other on
//             the narrowest phone-width card is a real case here (Name next
//             to a long status pill), and SAP's one hard guarantee is
//             narrower than "every high column survives" — it is "at least
//             one column always remains in the table layout".
//   medium  — the default for a labeled column. Pops before high, after low.
//   low     — pops first.
// A column with no header text (an icon, a row menu) is a separate, implicit
// tier above all three: it never enters the pop-in area at all, because it
// has nothing to show as a label there (SAP's own warning: an unlabeled
// column popped-in reads as a blank line followed by a colon).
export type ColumnPriority = "high" | "medium" | "low";

export type PriorityColumn<T> = ColumnType<T> & {
  priority?: ColumnPriority;
  /**
   * What to print for this column once it's popped, in place of calling its
   * own `render`. Most of this product's columns colour their cell text to
   * fit a cramped, lower-priority TABLE column — `type="secondary"`, a muted
   * style object — which is backwards once that same fact is the thing a
   * pop-in line exists to show: SAP's own pop-in examples print the label
   * light and the value dark ("Vendor:" muted, "Supplier 01" plain text),
   * the opposite of how this product already shades a secondary column.
   * Set this to the plain value for any column whose in-table render dims
   * its own text; leave it unset for a column whose render already returns
   * the right thing inline (a tag, a link, a pill).
   */
  popinText?: (record: T, index: number) => string;
  /**
   * What to print for this column once it's popped, in place of the default
   * "Label: value" `PopinLine` — for a column whose cell is already a
   * complete, self-explanatory piece of UI (an action link) rather than a
   * fact that reads naturally with its header as a label. Setting this also
   * makes an otherwise-unlabeled column (blank `title`) eligible to pop at
   * all — see `priorityOf`.
   */
  popinRender?: (record: T, index: number) => ReactNode;
};

// SAP's auto pop-in mode defaults an unsized column to an 8rem (~128px)
// minimum. This project's narrowest pinned column (State, at 58px) is
// already an outlier, so an unsized column here gets a slightly roomier
// floor for the fit calculation below.
const DEFAULT_COLUMN_WIDTH = 160;

// The fit calculation only ever looks at these three fields, never at the
// row type `T` itself — spelling that out here (rather than reusing
// `PriorityColumn<unknown>`) sidesteps the variance TypeScript would
// otherwise demand of a type that still carries `T` in its renderer.
type ColumnShape = {
  title?: unknown;
  width?: number | string;
  priority?: ColumnPriority;
  popinRender?: unknown;
};

function widthOf(column: ColumnShape): number {
  return typeof column.width === "number" ? column.width : DEFAULT_COLUMN_WIDTH;
}

/** `null` marks the implicit, never-pops tier for a column with no header text
 *  — unless it brings its own `popinRender`, which is exactly the escape
 *  hatch for a column that has no label to show but isn't a blank line
 *  either (see `popinRender`'s own note). */
function priorityOf(column: ColumnShape): ColumnPriority | null {
  if (!column.title && !column.popinRender) return null;
  return column.priority ?? "medium";
}

// Pop order: low leaves first, then medium, then high — never the unlabeled
// (`null`) tier, which this ranking simply excludes from popping at all.
const POP_RANK: Record<ColumnPriority, number> = { low: 0, medium: 1, high: 2 };

/**
 * Splits a priority-ranked column set into what the table shows and what
 * pops into the per-row detail list, given the width actually available to
 * the table — not the viewport (see `useMeasuredWidth` below).
 *
 * Pops one column at a time — lowest priority first, and within a tier the
 * right-most column first (SAP: "the right-most low-priority column moves
 * to the pop-in area first") — until the rest fit, or only one LABELED
 * column is left. That floor is SAP's own: "the responsive table ensures
 * that at least one column always remains in the table layout." A flat
 * three-tier cutoff can't make that promise — two `high` columns that don't
 * fit each other have nowhere left to go — so this keeps popping past
 * `high` rather than stopping there and letting the row overflow its card.
 *
 * LABELED, not just "one column": an unlabeled column (a row-menu) is
 * already exempt from popping at all (see `priorityOf`), so it already
 * satisfies "something survives" on its own — stopping at `size <= 1`
 * counted it as that one survivor, which let the real identifier pop too
 * once a menu column was the only other thing left, handing every popped
 * fact to the MENU column's cell instead of the name's. The floor is about
 * keeping a row readable, which a lone icon button doesn't do.
 */
export function splitColumnsForWidth<T>(
  columns: PriorityColumn<T>[],
  availableWidth: number,
): { tableColumns: PriorityColumn<T>[]; popinColumns: PriorityColumn<T>[] } {
  const included = new Set(columns.map((_, index) => index));
  const widthOfIncluded = () =>
    columns.reduce((sum, c, index) => sum + (included.has(index) ? widthOf(c) : 0), 0);

  const popOrder = columns
    .map((column, index) => ({ index, priority: priorityOf(column) }))
    .filter((entry): entry is { index: number; priority: ColumnPriority } => entry.priority !== null)
    // Ascending rank (low, medium, high), then descending index — the
    // right-most column of a tier goes before its own neighbours.
    .sort((a, b) => POP_RANK[a.priority] - POP_RANK[b.priority] || b.index - a.index);

  const labeledSurvivorCount = () =>
    popOrder.reduce((count, { index }) => count + (included.has(index) ? 1 : 0), 0);

  for (const { index } of popOrder) {
    if (widthOfIncluded() <= availableWidth) break;
    if (labeledSurvivorCount() <= 1) break;
    included.delete(index);
  }

  const tableColumns: PriorityColumn<T>[] = [];
  const popinColumns: PriorityColumn<T>[] = [];
  columns.forEach((column, index) => {
    (included.has(index) ? tableColumns : popinColumns).push(column);
  });
  return { tableColumns, popinColumns };
}

/**
 * Measures the width actually available to a table, not the viewport — the
 * two differ once the table sits beside a nav rail, as every staff table
 * here does (SAP's manual pop-in mode calls the same idea `contextualWidth`:
 * "by default the table width is assumed to be the screen width; if the
 * table does not use the full width of the screen, app developers must
 * configure the table accordingly").
 *
 * A CALLBACK ref, not a plain object ref read inside `useEffect`. Several of
 * these tables render behind a `canView`-style gate that is false on the
 * first paint and only mounts the measured element once a role check (or
 * similar) flips true on a later render — by which point a mount-only effect
 * has already run once, found `ref.current` null, and will never run again.
 * A callback ref has no such "already ran" state: React calls it exactly
 * when the node attaches, however late that is, so the observer always ends
 * up watching the right element.
 */
export function useMeasuredWidth<E extends HTMLElement>(): [(node: E | null) => void, number] {
  // A generous initial width: on the common desktop session this never
  // changes, and on a narrower one ResizeObserver corrects it before paint
  // settles rather than flashing every column open and then popping them.
  const [width, setWidth] = useState(1600);
  const observerRef = useRef<ResizeObserver | null>(null);

  const ref = useCallback((node: E | null) => {
    observerRef.current?.disconnect();
    observerRef.current = null;
    if (!node) return;
    // A tab pane mounts its table the moment it becomes active, mid-animation
    // — ResizeObserver's first callback only arrives once that settles, a
    // beat late. Reading the box synchronously here, before that, catches the
    // common case (switching into an already-sized pane) immediately; a
    // momentary 0 means the pane itself has no size yet (still animating
    // in), so the 1600 default holds one more frame rather than popping
    // every column open on a false read of zero.
    const initial = node.getBoundingClientRect().width;
    if (initial > 0) setWidth(initial);
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setWidth(entry.contentRect.width);
    });
    observer.observe(node);
    observerRef.current = observer;
  }, []);

  return [ref, width];
}

/** A column's `render` may return `{ children, props }` to merge cells
 *  (rowSpan/colSpan) in the real table — meaningless once the value is
 *  reprinted as a pop-in line, so only `children` ever applies. */
function unwrapRendered(rendered: unknown): ReactNode {
  if (rendered && typeof rendered === "object" && "children" in rendered) {
    return (rendered as { children: ReactNode }).children;
  }
  return rendered as ReactNode;
}

/**
 * Appends whatever popped out of the table to the IDENTIFIER column's own
 * cell, as "Label: value" lines directly under it — SAP's pop-in area,
 * shown inline for every row (the Fiori docs' own example, "Moving the
 * vendor column to the pop-in area": "Vendor: Supplier 01" printed right
 * under the item name), not a click-to-reveal control. A row with nothing
 * popped renders exactly as it always did; one with something popped is
 * simply as tall as the extra lines need.
 */
function attachPopin<T>(
  identifierColumn: PriorityColumn<T>,
  popinColumns: PriorityColumn<T>[],
): PriorityColumn<T> {
  const originalRender = identifierColumn.render;
  const dataIndex = identifierColumn.dataIndex as keyof T | undefined;

  return {
    ...identifierColumn,
    render: (value, record, index) => {
      const main = originalRender
        ? unwrapRendered(originalRender(value, record, index))
        : dataIndex !== undefined
          ? ((record[dataIndex] as unknown) as ReactNode)
          : null;
      return (
        /*
         * 2 read as one dense paragraph: the row's own identifier and every
         * popped fact sat the same hair's-width apart, so "Due date:",
         * "Amount:" and "Status:" ran together instead of reading as three
         * separate things about the row. Each LINE still keeps its own label
         * tight against its value (that's `PopinLine`'s own gap, untouched)
         * — only the space BETWEEN lines opens up, so the group each line
         * forms with its own label stays legible as a group.
         */
        <Flex vertical gap={6}>
          {main}
          {popinColumns.map((column, columnIndex) => (
            <div key={String(column.key ?? column.dataIndex ?? columnIndex)}>
              {column.popinRender
                ? column.popinRender(record, index)
                : <PopinLine column={column} record={record} index={index} />}
            </div>
          ))}
        </Flex>
      );
    },
  };
}

/**
 * antd centers a cell's content vertically by default. Fine for an ordinary
 * row where every cell is one line tall — but once the identifier column
 * grows past the rest with its popped-in lines, a short neighbour (a status
 * pill) drifts down to the middle of that taller row instead of sitting
 * level with the row's first line, which is where SAP's own examples keep
 * every column. Scoped to rows that actually popped something, so an
 * ordinary table's cells are untouched.
 */
function topAlignCell<T>(column: PriorityColumn<T>): PriorityColumn<T> {
  const ownCell = column.onCell as (() => { style?: CSSProperties }) | undefined;
  return {
    ...column,
    onCell: () => {
      const own = ownCell?.() ?? {};
      return { ...own, style: { verticalAlign: "top", ...own.style } };
    },
  };
}

/**
 * A table has (at most) one flexible column — the one with no `width` —
 * that absorbs whatever space the others don't use (TABLE_NAME_WIDTH's own
 * rule, above). Pop enough columns out and that flexible column is
 * sometimes the one that left: every survivor then keeps its own small
 * fixed width, and the rest of the row's width goes unused instead of
 * going to the pop-in text that could use it — a value drops to its own
 * line, or gets cut with "…", at a width that had room to spare. The
 * identifier survives every pop, so once nothing else is flexible, it's
 * the column that reclaims the space: it's also the one holding the
 * popped-in label/value lines by then, so the width is never wasted.
 */
function reclaimFlexWidth<T>(columns: PriorityColumn<T>[]): PriorityColumn<T>[] {
  if (columns.length === 0 || columns.some((c) => c.width === undefined)) return columns;
  const [identifier, ...rest] = columns;
  return [{ ...identifier, width: undefined }, ...rest];
}

/**
 * Resolves a priority-ranked column set against the width currently
 * available (from `useMeasuredWidth`, called separately) into the columns a
 * `<Table>` should render: the ones that still fit, edge-decorated as
 * usual, with whatever didn't fit folded into the first (identifier)
 * column's own cell rather than left off the screen.
 */
export function buildPopinTable<T>(columns: PriorityColumn<T>[], availableWidth: number) {
  const { tableColumns, popinColumns } = splitColumnsForWidth(columns, availableWidth);

  if (popinColumns.length === 0 || tableColumns.length === 0) {
    return { columns: decorateColumns(tableColumns as ColumnsType<T>) };
  }

  const [identifier, ...rest] = reclaimFlexWidth(tableColumns);
  const withPopin = [attachPopin(identifier, popinColumns), ...rest].map(topAlignCell);
  return { columns: decorateColumns(withPopin as ColumnsType<T>) };
}
