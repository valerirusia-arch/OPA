// src/flows/staff-loans/loan-details/LoanRecordScreen.tsx
//
// Epic 5 stories 10 and 11, on the page the wireframe draws for them.
//
//   story 10  Admin / Underwriter / OPA Staff — "review all loan information,
//             funding status and related documents". Its comment adds
//             "Includes access to borrower information, funding status and
//             generated documents" and "OPA Staff - read only".
//   story 11  Admin / Underwriter — "manually update loan details (add
//             documents, comments)". One dialog, per the wireframe.
//
// WHO MAY ADD: story 11's role column is Admin and Underwriter. OPA Staff is
// on story 10 only, with "read only" spelled out, so they read this page and
// are offered nothing to press.
//
// ONE CARD HERE BELONGS TO ANOTHER EPIC. "Acquisition information" is "View
// Acquisition Information for Loans" — Admin/Underwriter, priority 2, in
// Acquisition Channels, Referrals & Campaign Management. It is on this page
// because that is where the wireframe puts it and because a loan is what the
// acquisition data is attached to. Its role list is SHORTER than story 10's:
// no OPA Staff, so the card is not rendered for them.
//
// Dumb: the record comes from mock data keyed by the :id in the route, and
// adding is local state plus a console.log.

import { useState } from "react";
import { App, Button, Card, Flex, Result, Tag, Typography } from "antd";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "@tanstack/react-router";
import { AdminShell } from "../../../shared/ui/AdminShell";
import { AdminPage } from "../../../shared/ui/AdminPage";
import { staffNavFor } from "../../../shared/ui/navigation";
import { useStaffViewer } from "../../../shared/ui/viewerRole";
import { pill } from "../../../shared/ui/tag.styles";
import { useT } from "../../../shared/ui/i18n/useT";
import { SessionTimeoutModal } from "../../../features/Auth/ui/SessionTimeoutModal";
import { useIdleTimer, DEFAULT_IDLE_MS } from "../../../features/Auth/ui/useIdleTimer";
import { DetailGrid, type DetailItem } from "../../../features/Borrowers/ui/DetailGrid";
import { LoanStatusTag } from "../../../features/Borrowers/ui/StatusTags";
import { LoanDocumentsTable } from "../../../features/Loan/ui/LoanDocumentsTable";
import { AddDocumentCommentModal } from "../../../features/Loan/ui/LoanAdminModals";
import { LoanAdminPanel } from "../../../features/Loan/ui/LoanAdminPanel";
import { AcquisitionPanel } from "../../../features/Loan/ui/AcquisitionPanel";
import { allLoans, type LoanRow } from "../mockStaffLoans";
import { styles } from "./LoanRecordScreen.styles";

export type LoanRecordScreenProps = {
  loans?: LoanRow[];
  viewerName?: string;
  idleMs?: number;
};

export default function LoanRecordScreen({
  loans = allLoans,
  viewerName,
  idleMs = DEFAULT_IDLE_MS,
}: LoanRecordScreenProps) {
  const viewer = useStaffViewer();
  const name = viewerName ?? viewer.name;
  const navigate = useNavigate();
  // strict: false — the tree is built at runtime from flows/routes.tsx, so
  // TanStack cannot literal-type it and strict mode would demand a `from`.
  const params = useParams({ strict: false }) as { id?: string };
  const t = useT();
  const { message } = App.useApp();
  const { idle, reset: staySignedIn } = useIdleTimer(idleMs);

  /** Up here with the other hooks: the screen returns early below. */
  const [adding, setAdding] = useState(false);

  const record = loans.find((row) => row.loan.loanId === params.id);

  /**
   * Admin and Underwriter, and OPA Staff neither.
   *
   * Two different stories draw the same line: Manage Loan story 11 ("Update
   * loan details") and every Acquisition story. Story 10 is the one that adds
   * OPA Staff, and it is read-only.
   */
  const canEdit = viewer.role === "admin" || viewer.role === "underwriter";

  if (!record) {
    return (
      <AdminShell
        sections={staffNavFor(viewer.role)}
        activeKey="loans"
        userName={name}
        profileTo="/staff/profile"
      >
        <AdminPage title={t("loans.title")}>
          <Card>
            <Result
              status="404"
              title={t("loans.notFound")}
              extra={
                <Button type="primary" onClick={() => navigate({ to: "/staff/loans" })}>
                  {t("loans.back")}
                </Button>
              }
            />
          </Card>
        </AdminPage>
      </AdminShell>
    );
  }

  const { loan } = record;

  const items: DetailItem[] = [
    { key: "amount", label: t("loanPage.loanAmount"), value: loan.amount },
    { key: "rate", label: t("loanPage.interestRate"), value: loan.rate },
    { key: "terms", label: t("loanAdmin.repaymentTerms"), value: loan.repaymentTerms },
    {
      key: "funding",
      label: t("loanAdmin.funding"),
      value: <LoanStatusTag status={loan.status} />,
    },
    {
      key: "card",
      label: t("loanAdmin.cardIssuance"),
      value: loan.virtualCard
        ? t("loanAdmin.cardIssued", {
            last4: loan.virtualCard,
            state: t(
              loan.virtualCardUsed
                ? "loanAdmin.cardStateUsed"
                : "loanAdmin.cardStateUnused"
            ),
          })
        : t("loanAdmin.cardNotIssued"),
    },
    { key: "starts", label: t("loanPage.repaymentStarts"), value: loan.repaymentStartsOn },
  ];

  return (
    <AdminShell
      sections={staffNavFor(viewer.role)}
      activeKey="loans"
      userName={name}
      profileTo="/staff/profile"
      onLogout={() => {
        console.log("log out");
        navigate({ to: "/" });
      }}
    >
      <AdminPage
        title={record.borrowerName}
        titleBefore={
          <Button
            shape="circle"
            icon={<ArrowLeftOutlined />}
            aria-label={t("loans.back")}
            onClick={() => navigate({ to: "/staff/loans" })}
          />
        }
        titleAfter={
          <Flex align="center" gap={12}>
            {/* The loan's own reference beside the borrower's name: support is
                asked about one or the other, never about "the loan". */}
            <Typography.Text type="secondary">
              {t("loanAdmin.loanId", { id: loan.loanId })}
            </Typography.Text>
            <Tag variant="filled" style={pill}>
              {t(`loan.${loan.status}`)}
            </Tag>
          </Flex>
        }
        extra={
          canEdit ? (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setAdding(true)}>
              {t("loanAdmin.addTitle")}
            </Button>
          ) : null
        }
      >
        <Card title={t("loans.card")} style={styles.card}>
          <DetailGrid items={items} />
        </Card>

        {/* Acquisition epic, not this one. Admin and Underwriter only. */}
        {canEdit ? (
          <Card title={t("acquisition.title")} style={styles.card}>
            <AcquisitionPanel acquisition={loan.acquisition} />
          </Card>
        ) : null}

        {/* WBS story 10's "related documents", with who put each one there. */}
        <Card title={t("loanPage.documents")} style={styles.card}>
          <LoanDocumentsTable
            documents={loan.documents}
            packageParts={loan.package}
            onDownload={(document) => console.log("download loan document", document.name)}
          />
        </Card>

        {/* Story 11's other half. The comments an authorised user has left,
            append-only, and read by all three roles. */}
        <Card style={styles.card}>
          <LoanAdminPanel comments={loan.comments} />
        </Card>
      </AdminPage>

      <AddDocumentCommentModal
        open={adding}
        onCancel={() => setAdding(false)}
        onAdd={(values) => {
          console.log("add to loan", loan.loanId, values);
          message.success(t("loanAdmin.noteAdded"));
          setAdding(false);
        }}
      />

      <SessionTimeoutModal
        open={idle}
        onStaySignedIn={staySignedIn}
        onSignOut={() => {
          console.log("session ended after inactivity");
          navigate({ to: "/" });
        }}
      />
    </AdminShell>
  );
}
