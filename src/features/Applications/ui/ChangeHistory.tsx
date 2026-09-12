// src/features/Applications/ui/ChangeHistory.tsx
//
// Every change to the requested loan amount, and who made it.
//
// The wireframe reserves the space and says so in as many words — "here will
// be maybe small table (change history)". The WBS decides what goes in it, and
// it is not vague at all: "All changes shall be logged with the PREVIOUS
// VALUE, UPDATED VALUE, USER, DATE, and REASON for the modification." Five
// things, five columns.
//
// It reads the same audit entries the full trail below the page does, narrowed
// to the ones that moved a figure. Two lists would be two versions of the same
// history, and the one an underwriter happened to be looking at would be the
// one they trusted.
//
// Dumb: it renders entries it is given.

import { Flex, Table, Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useT } from "../../../shared/ui/i18n/useT";
import { decorateColumns } from "../../../shared/ui/tableColumns";
import { styles } from "./ChangeHistory.styles";
import type { AuditEntry } from "./types";

export type ChangeHistoryProps = {
  /** The whole trail. Only the amount changes in it are shown. */
  entries: AuditEntry[];
};

export function ChangeHistory({ entries }: ChangeHistoryProps) {
  const t = useT();

  /**
   * Amount changes only, matched on the action rather than on "has a from and
   * a to".
   *
   * An overridden decision also records a previous and a new value, and it
   * would have landed in this table under a heading that says the amount
   * changed. The full trail lower down the page is where every kind of change
   * belongs; this panel answers one question.
   */
  const changes = entries.filter((entry) => entry.action === "audit.amountChanged");

  if (changes.length === 0) {
    return (
      <Typography.Text type="secondary" style={styles.empty}>
        {t("amountPanel.noChanges")}
      </Typography.Text>
    );
  }

  const columns: ColumnsType<AuditEntry> = [
    {
      title: t("amountPanel.colWhen"),
      key: "on",
      width: 150,
      render: (_v, row) => (
        <Typography.Text type="secondary">{row.on}</Typography.Text>
      ),
    },
    {
      title: t("amountPanel.colChange"),
      key: "change",
      render: (_v, row) => (
        <Flex align="center" gap={8} wrap>
          <Typography.Text delete type="secondary">
            {row.from}
          </Typography.Text>
          <ArrowRightOutlined />
          <Typography.Text style={styles.to}>{row.to}</Typography.Text>
        </Flex>
      ),
    },
    {
      title: t("amountPanel.colBy"),
      key: "by",
      width: 140,
      render: (_v, row) => row.by,
    },
    {
      title: t("amountPanel.colReason"),
      key: "reason",
      render: (_v, row) =>
        row.reason ? (
          <Typography.Text>{row.reason}</Typography.Text>
        ) : (
          <Typography.Text type="secondary">{"—"}</Typography.Text>
        ),
    },
  ];

  return (
    <Table<AuditEntry>
      rowKey="id"
      size="small"
      tableLayout="fixed"
      columns={decorateColumns(columns)}
      dataSource={changes}
      pagination={false}
      scroll={{ x: "max-content" }}
    />
  );
}

export default ChangeHistory;
