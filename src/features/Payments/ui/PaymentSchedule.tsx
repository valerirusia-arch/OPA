// src/features/Payments/ui/PaymentSchedule.tsx
//
// The repayment schedule, as the wireframes draw it. WBS story 2 (borrower/
// co-borrower) and story 14 (Admin/Underwriter/OPA Staff) ask for the SAME
// four things — "due dates, amount to pay, if a payment was completed, if a
// payment is overdue" — and the two wireframes draw the same table twice, so
// this is one component read by both sides rather than two that drift.
//
// The columns come straight off the wireframes:
//   borrower's page   #  | Due date | Amount | Status |            | Pay now
//   internal page     Borrower | Due date | Amount | Status | Fees applied
//
// FEES ARE SHOWN ON BOTH. The internal wireframe has the column and the
// borrower's does not, but WBS story 10 is "Borrower/co-borrower shall be able
// to review APPLIED LATE FEES and overdue payment information" — so the
// wireframe is missing something the WBS grants, and a borrower who cannot
// find a charge they are paying is being kept in the dark by the interface.
// It appears on either side whenever a fee exists.
//
// The pay control is a LINK, per the wireframe, and it differs by capability
// rather than by role: the borrower's screen passes `onPay`, the internal page
// does not, because no WBS story in this epic lets an internal user take a
// payment.
//
// Dumb: it renders installments and reports which one was pressed.

import { Flex, Table, Typography, theme } from "antd";
import { useT } from "../../../shared/ui/i18n/useT";
import { buildPopinTable, useMeasuredWidth } from "../../../shared/ui/tableColumns";
import type { PriorityColumn } from "../../../shared/ui/tableColumns";
import { getStyles as getPageStyles } from "../../../shared/ui/AdminPage.styles";
import { InstallmentStatusTag } from "./PaymentTags";
import { styles, getStyles } from "./PaymentSchedule.styles";
import type { Installment } from "./types";

export type PaymentScheduleProps = {
  installments: Installment[];
  /**
   * Rows per page. Left off on the borrower's own page: twelve installments
   * and a handful of attempts are the whole record, and paging them would hide
   * the schedule behind a control. The back-office list spans every borrower
   * and the wireframe pages it.
   */
  pageSize?: number;
  /** The internal page's leading column. WBS story 14. */
  showBorrower?: boolean;
  /** Omitted where paying isn't offered: the internal page, and the loan page. */
  onPay?: (installment: Installment) => void;
};

export function PaymentSchedule({
  installments,
  pageSize,
  showBorrower = false,
  onPay,
}: PaymentScheduleProps) {
  const t = useT();
  const { token } = theme.useToken();
  const page = getPageStyles(token);
  const s = getStyles(token);
  const [tableRef, tableWidth] = useMeasuredWidth<HTMLDivElement>();

  /** WBS story 9: "only one late fee will be charged for each missed payment",
   *  so most schedules have none and the column would be a stripe of dashes. */
  const hasFees = installments.some((row) => row.fee);

  /**
   * Which lines get a Pay now: anything past due, plus the next one owed.
   *
   * The wireframe puts one on every row, completed rows included, which is a
   * low-fidelity slip rather than a rule. WBS story 5 is "make A SCHEDULED
   * loan payment" — the one that is due — and story 6 covers "an additional
   * (catch-up or extra) payment", which is the dialog's business. Twelve links
   * down a column also invite the one mistake this page must not make easy:
   * paying June's installment while February's is still missed.
   */
  const next = installments.find((row) => row.status !== "paid");
  const payable = (row: Installment) =>
    row.status === "overdue" || row.id === next?.id;

  const payNowLink = (row: Installment) =>
    payable(row) ? (
      <Typography.Link style={styles.payNow} onClick={() => onPay?.(row)}>
        {t("payments.payNow")}
      </Typography.Link>
    ) : null;

  const columns: PriorityColumn<Installment>[] = [
    ...(showBorrower
      ? [
          {
            title: t("payments.borrower"),
            key: "borrower",
            /* Widths are PIXELS, not percentages, on purpose: the pop-in fit
               calculation (tableColumns.tsx) measures real column widths, and a
               "%" string reads to it as the 160px default — so every column
               looked the same width and Status was kept on a phone where it
               had no room, clipping its pill instead of popping. With
               `tableLayout="fixed"` a wide table still spreads these
               proportionally, so the desktop layout is unchanged. */
            width: 200,
            // The identifier — stays on screen at every width.
            priority: "high" as const,
            render: (_v: unknown, row: Installment) => (
              <Typography.Text style={s.identifier}>{row.borrower}</Typography.Text>
            ),
          },
        ]
      : [
          {
            /* "#" in the wireframe: the position in the schedule, nothing more. */
            title: t("payments.number"),
            key: "number",
            width: 56,
            priority: "high" as const,
            render: (_v: unknown, row: Installment) => (
              <Typography.Text type="secondary">{row.number}</Typography.Text>
            ),
          },
        ]),
    /*
     * Every column takes a SHARE of the width, not a fixed pixel count with
     * one column absorbing the rest.
     *
     * The date column had no width, which meant it swallowed all the slack —
     * 560px of it at 1216 — and the table read as two clusters with a void
     * between them. Percentages spread the headings across the table so each
     * cell sits under its own label. `scroll.x` below is a MINIMUM: under it
     * the table scrolls in its card rather than crushing the dates.
     */
    { title: t("payments.dueDate"), key: "due", width: 160, render: (_v, row) => row.due },
    {
      /*
       * Right-aligned, and that is not a preference.
       *
       * Twelve instalments of the same size are read by comparing them, and
       * figures only compare when their digits line up. Left-aligned under a
       * left-aligned header they formed a ragged edge in the middle of a very
       * wide row, which is most of why this table read as a wall.
       *
       * A PAID line is quieter than one still to come. All twelve carried the
       * same weight before, so the three that are history competed with the
       * nine that are the plan.
       */
      title: t("loanPage.payment"),
      key: "amount",
      width: 112,
      align: "end",
      render: (_v, row) => (
        <Typography.Text
          style={styles.amount}
          type={row.status === "paid" ? "secondary" : undefined}
        >
          {row.amount}
        </Typography.Text>
      ),
    },
    {
      title: t("loanPage.status"),
      key: "status",
      /* Wide enough for the longest pill ("Scheduled", "Accelerated") plus its
         dot and padding, so it never clips while it is still in the table. */
      width: 150,
      /*
       * MEDIUM, so it drops into the pop-in BEFORE the Pay now action — the
       * order the designer asked for: *"ჯერ სტატუსი უნდა ჩამოიდროპოს და მერე
       * ფეი ნავ, ფეი ნავ ბოლოს იდროპება."* It used to be `high`, level with
       * Pay now, which (being further right) popped first and left Status
       * standing in a cell too narrow to hold its pill — the clip the phone
       * showed. On a phone it now folds into the card as a labelled line
       * above the action.
       */
      priority: "medium",
      render: (_v, row) => <InstallmentStatusTag status={row.status} />,
    },
    ...(hasFees
      ? [
          {
            title: t("payments.feesApplied"),
            key: "fee",
            width: 104,
            align: "end" as const,
            // Rare — most schedules have no fee at all. Pops first.
            priority: "low" as const,
            render: (_v: unknown, row: Installment) =>
              row.fee ? (
                <Typography.Text type="danger">{row.fee}</Typography.Text>
              ) : (
                /* An em dash in the wireframe. A dash is the right mark for
                   "not applicable" in a numeric column — it is not prose. */
                <Typography.Text type="secondary">{"—"}</Typography.Text>
              ),
          },
        ]
      : []),
    ...(onPay
      ? [
          {
            title: "",
            key: "actions",
            /*
             * A few points over what a desktop "Pay now" link actually
             * needs — the other point of the same fit this column's
             * `priority` note below is about. Once Due date and Amount have
             * popped and only Status shares the row with it, both have to
             * stand on their own literal width rather than borrow what
             * Due/Amount leave behind, so this can't be as tight as the
             * eventual rendered link is.
             */
            width: 120,
            align: "end" as const,
            /*
             * Pops like any other column rather than surviving every pop —
             * see `priorityOf` in tableColumns.tsx. An unlabeled column is
             * normally exempt from popping at all (nothing to call it in the
             * detail list), but left exempt HERE it instead got squeezed into
             * whatever sliver of the row's own width was left once other
             * columns had popped out from under it — a 14%-wide cell with
             * nowhere near enough room for "Pay now", which wrapped into
             * "Pay" / "now" stacked on two lines. `popinRender` is what makes
             * that legal with a blank title: the link is already a complete,
             * self-explanatory action, not a fact that needs "Label:" in
             * front of it, so it drops to its own line in the pop-in list
             * exactly as drawn here — no wrapping, no squeeze.
             *
             * `high`, and LAST — the opposite of "pops first". The action is
             * what a borrower came to this row to do; Due date, Amount and
             * Fees are allowed to go first and Pay now holds its column as
             * long as there is room for it, the same rank as the row's own
             * identifier and its Status. *"ჯერ ფეიმენტი არ ჩამოაგდო, ჯერ
             * სხვები ჩამოყარე და სულ ბოლოს ფეიმენტი."*
             */
            priority: "high" as const,
            popinRender: (row: Installment) => payNowLink(row),
            render: (_v: unknown, row: Installment) => (
              <Flex justify="flex-end">{payNowLink(row)}</Flex>
            ),
          },
        ]
      : []),
  ];

  /*
    THE NEXT-DUE ROW IS NOT VISUALLY MARKED.

    It wore a tint (blue, then warm) and then a teal left edge, and the designer
    rejected each in turn — *"ფერი არ მინდა აქ რომ ედოს… ეს სთროუკიც მოაშორე"*.
    So the row carries no highlight of its own; the "Pay now" link is what
    singles out the line there is anything to do about, and `next` above still
    decides which lines get one.
  */

  /*
   * BELOW A PHONE WIDTH, FOLD THE WHOLE ROW INTO ONE STACKED CARD.
   *
   * Between tablet and desktop the progressive pop-in is right: it drops the
   * lowest-priority column only when it has to. But on a phone that same
   * "keep what fits" leaves a cramped two-column row — the identifier and
   * whatever still squeezes in beside it (the action pinned top-right, the
   * rest stacked below), which reads as two half-rows rather than one record.
   *
   * So under 560px the table is handed a width of 1, which pops every column
   * but the identifier: each row becomes a single vertical card — #, then Due
   * date, Amount, Status, Fees and finally Pay now, in that order — the layout
   * the designer asked for: *"ჯერ სტატუსი უნდა ჩამოიდროპოს და მერე ფეი ნავ, ფეი
   * ნავ ბოლოს იდროპება."*
   */
  const STACK_BELOW = 560;
  const popin = buildPopinTable(columns, tableWidth < STACK_BELOW ? 1 : tableWidth);

  return (
    <div ref={tableRef}>
    <Table<Installment>
      rowKey="id"
      size="small"
      tableLayout="fixed"
      columns={popin.columns}
      dataSource={installments}
      pagination={
        pageSize
          ? { pageSize, showSizeChanger: false, style: page.pagination }
          : false
      }
    />
    </div>
  );
}

export default PaymentSchedule;
