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

import { useRef, useState, type RefObject } from "react";
import dayjs from "dayjs";
import { App, Button, Card, Flex, Result } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "@tanstack/react-router";
import { AdminShell } from "../../../shared/ui/AdminShell";
import { AdminPage } from "../../../shared/ui/AdminPage";
import { staffNavFor } from "../../../shared/ui/navigation";
import { useStaffViewer } from "../../../shared/ui/viewerRole";
import { useT } from "../../../shared/ui/i18n/useT";
import { SessionTimeoutModal } from "../../../features/Auth/ui/SessionTimeoutModal";
import { useIdleTimer, DEFAULT_IDLE_MS } from "../../../features/Auth/ui/useIdleTimer";
import { DetailGrid, type DetailItem } from "../../../features/Borrowers/ui/DetailGrid";
import { LoanStatusTag } from "../../../features/Borrowers/ui/StatusTags";
import { LoanDocumentsTable } from "../../../features/Loan/ui/LoanDocumentsTable";
import type { LoanComment, LoanDocument } from "../../../features/Loan/ui/types";
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

  /* After adding, scroll to where it landed — the Documents card for a file,
     the comments card for a note — so the staff member SEES it took, the same
     way the application screen scrolls to a new request. Local scroll only. */
  const documentsRef = useRef<HTMLDivElement>(null);
  const commentsRef = useRef<HTMLDivElement>(null);
  const scrollTo = (ref: RefObject<HTMLDivElement | null>) =>
    setTimeout(
      () => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      60,
    );
  const [addedDocs, setAddedDocs] = useState<LoanDocument[]>([]);
  const [addedComments, setAddedComments] = useState<LoanComment[]>([]);

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

  const { loan: stored } = record;
  /*
   * WHAT WAS ADDED THIS SESSION, so the page shows it.
   *
   * The header above has always said "adding is local state plus a
   * console.log", and only the second half was true: pressing Add logged the
   * values, raised a toast, closed the dialog, and left the documents table
   * and the comment list exactly as they were — the thing just added nowhere
   * on the page. WBS story 11 is "manually update loan details (ADD
   * DOCUMENTS, COMMENTS)", and a prototype that cannot show the result of the
   * one action on the screen cannot be reviewed.
   */
  const loan = { ...stored, documents: [...stored.documents, ...addedDocs],
    comments: [...stored.comments, ...addedComments] };

  const items: DetailItem[] = [
    { key: "amount", label: t("loanPage.loanAmount"), value: loan.amount },
    { key: "rate", label: t("loanPage.interestRate"), value: loan.rate },
    { key: "terms", label: t("loanAdmin.repaymentTerms"), value: loan.repaymentTerms },
    {
      /* THE REFERENCE, NOT THE STATUS. The status was here AND in the page's
         own heading, two inches apart — and the heading is where a status
         belongs, because it describes the whole page. The reference had been
         crowded in beside the borrower's name instead: *"ეს სტატუსი ამოიღე
         კონტეინერიდან... და ეგ აიდი ჩასვი მაგ სტატუსის ნაცვლად."* So they
         swap. The name now carries the status alone, and the loan's own id
         sits with the rest of its facts, where a fact goes. */
      key: "reference",
      label: t("loanAdmin.loanIdLabel"),
      value: loan.loanId,
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
        back={{
          label: t("loans.back"),
          onClick: () => navigate({ to: "/staff/loans" }),
        }}
        titleAfter={
          <Flex align="center" gap={12}>
            {/* THE PRODUCT'S OWN STATUS COMPONENT, not a bare Tag.
                It was `<Tag variant="filled">` with no colour — which antd
                draws as the neutral grey lozenge, so "Funded" arrived here
                with no fill worth seeing and no dot, while the same word two
                screens away is a green pill. A status has one appearance in
                this product and `LoanStatusTag` is where it lives. */}
            <LoanStatusTag status={loan.status} />
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
        <Card ref={documentsRef} title={t("loanPage.documents")} style={styles.card}>
          <LoanDocumentsTable
            documents={loan.documents}
            packageParts={loan.package}
            onDownload={(document) => console.log("download loan document", document.name)}
          />
        </Card>

        {/* Story 11's other half. The comments an authorised user has left,
            append-only, and read by all three roles. */}
        <Card ref={commentsRef} style={styles.card}>
          <LoanAdminPanel comments={loan.comments} />
        </Card>
      </AdminPage>

      <AddDocumentCommentModal
        open={adding}
        onCancel={() => setAdding(false)}
        onAdd={(values) => {
          console.log("add to loan", loan.loanId, values);
          /*
            One dialog, two WBS things: "add documents, comments". Either half
            may be empty — a comment with no file, a file with no comment — so
            each is appended only if it is there, and both carry who and when,
            which is what the documents table's own columns ask for.
          */
          const on = dayjs().format("DD MMM YYYY");
          if (values.files?.length) {
            setAddedDocs((prev) => [
              ...prev,
              ...values.files!.map((file, index) => ({
                id: `added-${prev.length + index + 1}`,
                name: file.name,
                type: "other" as const,
                on,
                uploadedBy: name,
                comment: values.comment,
              })),
            ]);
          }
          if (values.comment && !values.files?.length) {
            setAddedComments((prev) => [
              ...prev,
              {
                id: `c-added-${prev.length + 1}`,
                on: `${on} ${dayjs().format("HH:mm")}`,
                by: name,
                text: values.comment!,
              },
            ]);
          }
          message.success(t("loanAdmin.noteAdded"));
          setAdding(false);
          /* Scroll to where it appears: the Documents card if a file was
             attached, otherwise the comments card below it. */
          scrollTo(values.files?.length ? documentsRef : commentsRef);
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
