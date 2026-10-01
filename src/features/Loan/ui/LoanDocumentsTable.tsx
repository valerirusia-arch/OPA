// src/features/Loan/ui/LoanDocumentsTable.tsx
//
// The internal read of a loan's documents. WBS story 10 — "review all loan
// information, funding status and RELATED DOCUMENTS".
//
// It is not the borrower's DocumentList with an extra column. The internal
// wireframe asks two questions the borrower's version never does: WHO put this
// here — the borrower uploaded a pay stub, the system generated the agreement
// — and what was said about it. Both are columns here, and neither belongs on
// the borrower's own page.
//
// Above the table, the package as THREE BOXES — the wireframe summarises
// "Loan agreement / State-specific disclosures / Underwriting documents" with
// their signature state, which answers "is this loan executed" without reading
// every row.
//
// They were drawn as a loose run of name-then-pill across one line, and at
// that size the three ran together into a sentence: *"ეს უაზროდ გდია; ჩემს
// ვაიერფრეიმებში კონტეინერებში ზის, ეგრე ჩასვი, რომ კარგად გამოიყოს."* Three
// named boxes is also the arrangement the rest of this product uses for a
// small set of labelled facts — the dashboard's four tiles, the balance
// card's strip — so the summary reads as a summary rather than as a caption
// for the table under it.
//
// Dumb: it renders documents and reports a download.

import { Col, Flex, Row, Table, Typography, theme } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useT } from "../../../shared/ui/i18n/useT";
import { StatusPill } from "../../../shared/ui/StatusPill";
import { decorateColumns } from "../../../shared/ui/tableColumns";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { getStyles, styles } from "./LoanDocumentsTable.styles";
import type { LoanDocument } from "./types";

export type LoanDocumentsTableProps = {
  documents: LoanDocument[];
  /** The generated package and whether each part came back signed. */
  packageParts?: { key: string; name: string; signed: boolean }[];
  onDownload?: (document: LoanDocument) => void;
};

export function LoanDocumentsTable({
  documents,
  packageParts,
  onDownload,
}: LoanDocumentsTableProps) {
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);

  const columns: ColumnsType<LoanDocument> = [
    {
      title: t("loanPage.docName"),
      key: "name",
      render: (_v, row) => (
        <Typography.Link onClick={() => onDownload?.(row)} ellipsis>
          {row.name}
        </Typography.Link>
      ),
    },
    {
      title: t("loanPage.docType"),
      key: "type",
      width: 150,
      /* A category, not a state — the same call the borrower's own documents
         table makes. Tags are for states here: "Signed" is one, "consent" is
         not, and a pill per row on both tables just counted boxes. */
      render: (_v, row) => <Typography.Text type="secondary">{row.type}</Typography.Text>,
    },
    {
      title: t("loanAdmin.uploadedBy"),
      key: "by",
      width: 180,
      render: (_v, row) => (
        <Typography.Text type="secondary">
          {row.uploadedBy ?? t("loanAdmin.uploadedBySystem")}
        </Typography.Text>
      ),
    },
    {
      title: t("loanPage.docDate"),
      key: "on",
      width: 150,
      render: (_v, row) => (
        <Typography.Text type="secondary">{row.on}</Typography.Text>
      ),
    },
    {
      title: t("loanAdmin.docComment"),
      key: "comment",
      width: 220,
      render: (_v, row) =>
        row.comment ? (
          <Typography.Text>{row.comment}</Typography.Text>
        ) : (
          /* A dash, per the wireframe: nothing was said, which is not the same
             as an empty cell somebody forgot to fill in. */
          <Typography.Text type="secondary">{"—"}</Typography.Text>
        ),
    },
  ];

  return (
    <Flex vertical>
      {packageParts?.length ? (
        <Row gutter={[16, 16]} style={styles.chips}>
          {packageParts.map((part) => (
            <Col key={part.key} xs={24} sm={8}>
              {/* ONE LINE, NOT TWO. The name and the state stacked with the
                  pill under them, which made a box 130px tall to carry a label
                  and a chip — three of them mostly padding, above a table. On
                  one line the box is the height of the thing it holds, the
                  name reads on the left and the state ends the row, which is
                  the arrangement every other summary in this product uses.
                  *"უფრო ლამაზად მოსვა."* */}
              <Flex align="center" justify="space-between" gap={12} style={s.part}>
                <Typography.Text style={s.partName}>{part.name}</Typography.Text>
                <StatusPill color={part.signed ? "success" : "warning"}>
                  {t(part.signed ? "loanPage.executed" : "loanAdmin.unsigned")}
                </StatusPill>
              </Flex>
            </Col>
          ))}
        </Row>
      ) : null}

      {documents.length === 0 ? (
        <EmptyState
          title={t("loanPage.noDocuments")}
        />
      ) : (
        <Table<LoanDocument>
          rowKey="id"
          size="small"
          tableLayout="fixed"
          columns={decorateColumns(columns)}
          dataSource={documents}
          pagination={false}
          scroll={{ x: "max-content" }}
        />
      )}
    </Flex>
  );
}

export default LoanDocumentsTable;
