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
import type { ColumnsType } from "antd/es/table";
import { useT } from "../../../shared/ui/i18n/useT";
import { decorateColumns } from "../../../shared/ui/tableColumns";
import { getStyles as getPageStyles } from "../../../shared/ui/AdminPage.styles";
import { InstallmentStatusTag } from "./PaymentTags";
import { getStyles, styles } from "./PaymentSchedule.styles";
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

  const columns: ColumnsType<Installment> = [
    ...(showBorrower
      ? [
          {
            title: t("payments.borrower"),
            key: "borrower",
            width: "26%",
            render: (_v: unknown, row: Installment) => row.borrower,
          },
        ]
      : [
          {
            /* "#" in the wireframe: the position in the schedule, nothing more. */
            title: t("payments.number"),
            key: "number",
            width: "7%",
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
    { title: t("payments.dueDate"), key: "due", width: "27%", render: (_v, row) => row.due },
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
      width: "18%",
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
      width: "20%",
      render: (_v, row) => <InstallmentStatusTag status={row.status} />,
    },
    ...(hasFees
      ? [
          {
            title: t("payments.feesApplied"),
            key: "fee",
            width: "15%",
            align: "end" as const,
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
            width: "14%",
            align: "end" as const,
            render: (_v: unknown, row: Installment) =>
              payable(row) ? (
                <Flex justify="flex-end">
                  <Typography.Link onClick={() => onPay(row)}>
                    {t("payments.payNow")}
                  </Typography.Link>
                </Flex>
              ) : null,
          },
        ]
      : []),
  ];

  return (
    <Table<Installment>
      rowKey="id"
      size="small"
      tableLayout="fixed"
      columns={decorateColumns(columns)}
      dataSource={installments}
      /*
       * The next line owed is tinted.
       *
       * Twelve rows of the same amount and the same word is a wall, and the
       * one row that has anything to do with today was findable only by
       * spotting a small link at the end of it. A tint from the primary's own
       * background token makes the page have a subject. Overdue rows are left
       * alone: their status pill is already red, and tinting those as well
       * would mean three kinds of emphasis arguing.
       */
      onRow={(row) =>
        row.id === next?.id && row.status !== "overdue"
          ? { style: s.nextRow }
          : {}
      }
      pagination={
        pageSize
          ? { pageSize, showSizeChanger: false, style: page.pagination }
          : false
      }
      /* A minimum, not the content width: above it the percentages spread the
         columns, below it the table scrolls in its own card. */
      scroll={{ x: 760 }}
    />
  );
}

export default PaymentSchedule;
