// src/features/Loan/ui/DocumentList.tsx
//
// WBS story 4 — "Borrower shall be able to access all loan-related documents
// (download only, no in-app preview is assumed)". Comments: "Documents remain
// available throughout the loan lifecycle and are read-only after execution."
//
// So: no preview, no viewer, no thumbnail. The wireframe draws it as a table —
// Name, Type, Date, Download — and that is what it is. "No in-app preview is
// assumed" is a decision about scope, and drawing a preview anyway would be
// building a feature nobody costed and promising the borrower something the
// product does not do.
//
// A signed document says so. "Read-only after execution" is why there is no
// delete and no replace next to one.
//
// Dumb: it renders documents it is given and reports a download.

import { Flex, Table, Tag, Typography } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useT } from "../../../shared/ui/i18n/useT";
import { pill } from "../../../shared/ui/tag.styles";
import { decorateColumns } from "../../../shared/ui/tableColumns";
import { EmptyState } from "../../../shared/ui/EmptyState";
import type { LoanDocument } from "./types";

export type DocumentListProps = {
  documents: LoanDocument[];
  onDownload?: (document: LoanDocument) => void;
};

export function DocumentList({ documents, onDownload }: DocumentListProps) {
  const t = useT();

  if (documents.length === 0) return <EmptyState title={t("loanPage.noDocuments")} />;

  const columns: ColumnsType<LoanDocument> = [
    /*
     * Every column takes a SHARE of the width, not a fixed pixel count, so
     * this table spreads and collapses like every other table in the product.
     * The name column had no width at all, which let it swallow all the slack
     * on a wide window and pushed Type and Date so far right they lost their
     * relationship to the file they belong to. `scroll.x` below is a MINIMUM:
     * under it the table scrolls in its card rather than crushing the dates.
     */
    {
      title: t("loanPage.docName"),
      key: "name",
      width: "44%",
      render: (_v, row) => (
        <Flex align="center" gap={8}>
          <Typography.Text ellipsis={{ tooltip: row.name }}>{row.name}</Typography.Text>
          {/* "Read-only after execution", said on the row it applies to. */}
          {row.executed ? (
            <Tag color="success" variant="filled" style={pill}>
              {t("loanPage.executed")}
            </Tag>
          ) : null}
        </Flex>
      ),
    },
    /* A category, not a state, so it is a word rather than a pill.
       Six rows each carrying a grey pill in this column plus a green one in
       the last plus a link in the next put three small boxes on every line of
       a six-row table, and the eye counted boxes instead of reading files.
       Tags are for states now — "Signed" is one, "consent" is not. */
    {
      title: t("loanPage.docType"),
      key: "type",
      width: "20%",
      render: (_v, row) => <Typography.Text type="secondary">{row.type}</Typography.Text>,
    },
    {
      title: t("loanPage.docDate"),
      key: "on",
      width: "20%",
      render: (_v, row) => (
        <Typography.Text type="secondary">{row.on}</Typography.Text>
      ),
    },
    {
      title: "",
      key: "actions",
      width: "16%",
      align: "end",
      /* THE ICON ALONE — no "Download" word. Four columns plus a labelled action
         read as cramped in this card, so the control drops to the glyph a reader
         already knows; the word moves to `aria-label` so the button is still
         named for a screen reader. *"დოვნლოდ ტექსტი აღარ არის საჭირო, მხოლოდ
         აიქონი დატოვე."* */
      render: (_v, row) => (
        <Flex justify="flex-end">
          <Typography.Link
            onClick={() => onDownload?.(row)}
            aria-label={t("loanPage.download")}
          >
            <DownloadOutlined />
          </Typography.Link>
        </Flex>
      ),
    },
  ];

  return (
    <Table<LoanDocument>
      rowKey="id"
      size="small"
      tableLayout="fixed"
      columns={decorateColumns(columns)}
      dataSource={documents}
      pagination={false}
      /* A minimum, not the content width: above it the percentages spread the
         columns, below it the table scrolls in its own card. */
      scroll={{ x: 640 }}
    />
  );
}

export default DocumentList;
