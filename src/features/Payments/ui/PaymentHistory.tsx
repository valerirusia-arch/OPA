// src/features/Payments/ui/PaymentHistory.tsx
//
// Every attempt to pay, and how it ended. WBS story 4 (borrower/co-borrower)
// and story 15 (Admin/Underwriter/OPA Staff) ask for the same five outcomes —
// "completed, pending, failed, refunded and reversed" — and the wireframes
// draw the same table on both sides, so this is one component both read.
//
// Columns, off the wireframes:
//   borrower's page ("Repayment")   Date | Amount | Method | Status
//   internal page ("Payment history")  Borrower | Date | Amount | Method | Status
//
// "Payment history is read-only" (story 4). Nothing here can be edited or
// removed by anybody, which is why the only button that ever appears is story
// 13's: "if a payment failed or was reversed, borrower should be able to make
// another attempt to make a payment."
//
// REFUNDED IS NOT OFFERED A RETRY. Story 13 names failed and reversed and
// stops there, and it is right to: a refund is a decision somebody made on
// purpose, and a button inviting the borrower to undo it would be the
// interface arguing with the business.
//
// Dumb: it renders transactions and reports a retry.

import { Button, Flex, Table, Tooltip, Typography, theme } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useT } from "../../../shared/ui/i18n/useT";
import { decorateColumns } from "../../../shared/ui/tableColumns";
import { getStyles as getPageStyles } from "../../../shared/ui/AdminPage.styles";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { PaymentStatusTag } from "./PaymentTags";
import { styles } from "./PaymentHistory.styles";
import type { PaymentTransaction } from "./types";

export type PaymentHistoryProps = {
  transactions: PaymentTransaction[];
  /**
   * Rows per page. Left off on the borrower's own page: twelve installments
   * and a handful of attempts are the whole record, and paging them would hide
   * the schedule behind a control. The back-office list spans every borrower
   * and the wireframe pages it.
   */
  pageSize?: number;
  /** The internal page's leading column. WBS story 15. */
  showBorrower?: boolean;
  /**
   * Who is reading, when it is one of the two customers.
   *
   * Omitted on the internal page, and that is the only difference in what the
   * "Method" column says: WBS story 7 keeps a borrower and a co-borrower from
   * seeing each other's card, so each is shown the digits of their own card
   * and told only WHO paid for the other's. An Underwriter tracing a payment
   * sees both.
   */
  reader?: "borrower" | "coBorrower";
  /** WBS story 13. Omitted on the internal page, where nobody may pay. */
  onRetry?: (transaction: PaymentTransaction) => void;
};

/** WBS story 13's two words, and only those two. */
const canRetry = (transaction: PaymentTransaction) =>
  transaction.status === "failed" || transaction.status === "reversed";

export function PaymentHistory({
  transactions,
  pageSize,
  showBorrower = false,
  reader,
  onRetry,
}: PaymentHistoryProps) {
  const t = useT();
  const { token } = theme.useToken();
  const page = getPageStyles(token);

  /** The digits, or who paid, per the rule above. */
  const methodOf = (transaction: PaymentTransaction) => {
    const hide =
      reader !== undefined &&
      transaction.paidBy !== undefined &&
      transaction.paidBy !== reader;
    if (!hide) return t("payments.cardEnding", { last4: transaction.cardLast4 });
    return t(
      transaction.paidBy === "coBorrower"
        ? "payments.paidByCoBorrower"
        : "payments.paidByBorrower"
    );
  };

  if (transactions.length === 0) {
    return <EmptyState title={t("payments.noHistory")} description={t("payments.noHistoryBody")} />;
  }

  const columns: ColumnsType<PaymentTransaction> = [
    ...(showBorrower
      ? [
          {
            title: t("payments.borrower"),
            key: "borrower",
            width: "22%",
            render: (_v: unknown, row: PaymentTransaction) => row.borrower,
          },
        ]
      : []),
    /* Shares of the width, like the schedule next door: fixed pixels with one
       absorbing column packed everything to the left and left a void on the
       right. */
    { title: t("payments.date"), key: "on", width: "20%", render: (_v, row) => row.on },
    {
      /* Right-aligned for the same reason the schedule's is: a column of
         amounts is there to be compared. */
      title: t("loanPage.payment"),
      key: "amount",
      width: "16%",
      align: "end",
      render: (_v, row) => (
        <Typography.Text style={styles.amount}>{row.amount}</Typography.Text>
      ),
    },
    {
      title: t("payments.method"),
      key: "card",
      width: "20%",
      render: (_v, row) => (
        <Typography.Text type="secondary">{methodOf(row)}</Typography.Text>
      ),
    },
    {
      /* The widest share: it holds a pill and, on anything that did not
         simply succeed, a line of explanation under it that needs room to
         wrap. */
      title: t("loanPage.status"),
      key: "status",
      width: "32%",
      render: (_v, row) => (
        <Flex vertical gap={4} align="flex-start">
          <PaymentStatusTag status={row.status} />
          {/* WBS story 12 is "view the status of each payment transaction" — a
              status nobody can act on is only useful with the reason next to
              it. Not drawn in the wireframe, which shows only Completed rows;
              the other four outcomes all need one. */}
          {row.noteKey ? (
            <Typography.Text type="secondary" style={styles.note}>
              {t(row.noteKey)}
            </Typography.Text>
          ) : null}
        </Flex>
      ),
    },
    ...(onRetry
      ? [
          {
            /*
             * Icon only, and 72px wide.
             *
             * On the borrower's page this table sits in a half-width card, and
             * a 140px column holding the words "Try again" pushed the whole
             * thing 55px past the card's edge — measured, not guessed — so the
             * Status column was clipped on every row. Story 13 needs the
             * control, not the sentence: the icon carries it, and the tooltip
             * gives the words back to anybody who needs them, including a
             * screen reader through aria-label.
             */
            title: "",
            key: "actions",
            width: "12%",
            align: "end" as const,
            render: (_v: unknown, row: PaymentTransaction) =>
              canRetry(row) ? (
                <Flex justify="flex-end">
                  <Tooltip title={t("payments.retry")}>
                    <Button
                      icon={<ReloadOutlined />}
                      aria-label={t("payments.retry")}
                      onClick={() => onRetry(row)}
                    />
                  </Tooltip>
                </Flex>
              ) : null,
          },
        ]
      : []),
  ];

  return (
    <Table<PaymentTransaction>
      rowKey="id"
      size="small"
      tableLayout="fixed"
      columns={decorateColumns(columns)}
      dataSource={transactions}
      pagination={
        pageSize
          ? { pageSize, showSizeChanger: false, style: page.pagination }
          : false
      }
      /* A minimum, not the content width. */
      scroll={{ x: 640 }}
    />
  );
}

export default PaymentHistory;
