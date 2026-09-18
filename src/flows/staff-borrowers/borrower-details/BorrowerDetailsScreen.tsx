// src/flows/staff-borrowers/borrower-details/BorrowerDetailsScreen.tsx
//
// Epic 2 — "View borrower details", plus the three actions the WBS attaches to
// a borrower's record.
//
// WBS: "Admin/Underwriter shall be able to open a borrower profile and review
// all available borrower, co-borrower, application and loan information" —
// hence the tabs, and hence read-only: "Editing is covered by Manage borrower
// accounts."
//
// THERE IS NO PAYMENTS TAB HERE. One was built and removed: the wireframe
// puts Manage Payments stories 14 and 15 on their own back-office page, as a
// table across every borrower with a "Filter by borrower" box, so that is
// where they live (src/flows/staff-payments). Two homes for one table is how
// the two drift apart.
//
// Who may do what, taken from the WBS's own role column and NOT from the
// wireframes, which draw the two internal roles slightly differently:
//   Manage account        — Admin / Underwriter
//   Send set-password link — Admin / Underwriter
//   Add to DO NOT LOAN     — Admin / Underwriter / OPA Staff
// So an OPA Staff member reads the record and can flag it, and nothing else.
//
// Dumb: the record comes from mock data keyed by the :id in the route, the
// three actions are local state plus a console.log for Dev to wire.

import { useState } from "react";
import { App, Badge, Button, Card, Dropdown, Flex, Result, Tabs } from "antd";
import type { MenuProps } from "antd";
import {
  ArrowRightOutlined,
  MoreOutlined,
  SendOutlined,
  StopOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "@tanstack/react-router";
import { AdminShell } from "../../../shared/ui/AdminShell";
import { AdminPage } from "../../../shared/ui/AdminPage";
import { ConfirmModal } from "../../../shared/ui/ConfirmModal";
import { staffNavFor } from "../../../shared/ui/navigation";
import { useStaffViewer, type StaffRole } from "../../../shared/ui/viewerRole";
import { useT } from "../../../shared/ui/i18n/useT";
import { SessionTimeoutModal } from "../../../features/Auth/ui/SessionTimeoutModal";
import { useIdleTimer, DEFAULT_IDLE_MS } from "../../../features/Auth/ui/useIdleTimer";
import { DetailGrid, type DetailItem } from "../../../features/Borrowers/ui/DetailGrid";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { LoanAdminPanel } from "../../../features/Loan/ui/LoanAdminPanel";
import {
  ManageBorrowerModal,
  type ManageBorrowerValues,
} from "../../../features/Borrowers/ui/ManageBorrowerModal";
import {
  ApplicationStatusTag,
  DoNotLoanTag,
  LoanStatusTag,
} from "../../../features/Borrowers/ui/StatusTags";
import type { Borrower } from "../../../features/Borrowers/ui/types";
import { fullName } from "../../../features/Borrowers/ui/types";
import { mockBorrowers } from "../mockBorrowers";
import { styles } from "./BorrowerDetailsScreen.styles";

export type BorrowerDetailsScreenProps = {
  borrowers?: Borrower[];
  /** Omitted, it follows the DevBar's "view as" switch. */
  viewerRole?: StaffRole;
  viewerName?: string;
  idleMs?: number;
};

export default function BorrowerDetailsScreen({
  borrowers = mockBorrowers,
  viewerRole,
  viewerName,
  idleMs = DEFAULT_IDLE_MS,
}: BorrowerDetailsScreenProps) {
  const viewer = useStaffViewer();
  const role = viewerRole ?? viewer.role;
  const viewerLabel = viewerName ?? viewer.name;
  const { message } = App.useApp();
  const navigate = useNavigate();
  // strict: false — the tree is built at runtime from flows/routes.tsx, so
  // TanStack cannot literal-type it and strict mode would demand a `from`.
  const params = useParams({ strict: false }) as { id?: string };
  const t = useT();
  const { idle, reset: staySignedIn } = useIdleTimer(idleMs);

  const record = borrowers.find((item) => item.id === params.id);
  // Edits live here so the prototype responds; if the :id changes under us the
  // draft belongs to the previous record, so the fresh one wins.
  const [draft, setDraft] = useState<Borrower | undefined>(record);
  const borrower = draft && draft.id === record?.id ? draft : record;
  const [managing, setManaging] = useState(false);
  const [flagging, setFlagging] = useState(false);
  const [changingAccess, setChangingAccess] = useState(false);

  const canEdit = role !== "staff";
  // WBS story 9 is the Admin's alone: "withdraw and reinstate access to the
  // system for any user" — and a borrower is a user.
  const canManageAccess = role === "admin";
  const yesNo = (value: boolean) => (value ? t("detail.yes") : t("detail.no"));

  if (!borrower) {
    return (
      <AdminShell
        sections={staffNavFor(role)}
        activeKey="borrowers"
        userName={viewerLabel}
        profileTo="/staff/profile"
      >
        <AdminPage title={t("borrowers.title")}>
          <Card>
            <Result
              status="404"
              title={t("borrowers.empty")}
              extra={
                <Button type="primary" onClick={() => navigate({ to: "/staff/borrowers" })}>
                  {t("borrower.back")}
                </Button>
              }
            />
          </Card>
        </AdminPage>
      </AdminShell>
    );
  }

  const p = borrower.profile;
  const profileItems: DetailItem[] = [
    { key: "firstName", label: t("field.firstName"), value: p.firstName },
  ];
  if (p.middleName) {
    profileItems.push({
      key: "middleName",
      label: t("field.middleName"),
      value: p.middleName,
    });
  }
  profileItems.push(
    { key: "lastName", label: t("field.lastName"), value: p.lastName },
    { key: "dob", label: t("field.dateOfBirth"), value: p.dateOfBirth },
    { key: "ssn", label: t("field.ssn"), value: p.ssn },
    { key: "country", label: t("field.country"), value: p.country },
    { key: "email", label: t("field.email"), value: p.email },
    { key: "phone", label: t("field.phone"), value: p.phone },
    {
      key: "address",
      label: t("detail.address"),
      value: `${p.street}, ${p.city}, ${p.state} ${p.zip}`,
    },
    { key: "comms", label: t("field.communication"), value: p.communication },
    { key: "emailVerified", label: t("detail.emailVerified"), value: yesNo(p.emailVerified) },
    { key: "phoneVerified", label: t("detail.phoneVerified"), value: yesNo(p.phoneVerified) },
    {
      key: "identityVerified",
      label: t("detail.identityVerified"),
      value: yesNo(p.identityVerified),
    }
  );

  const application = borrower.application;
  const coBorrower = borrower.coBorrower;
  const loan = borrower.loan;

  const applicationItems: DetailItem[] = application
    ? [
        {
          key: "status",
          label: t("detail.status"),
          value: <ApplicationStatusTag status={application.status} />,
        },
        { key: "uscis", label: t("detail.uscisType"), value: application.uscisType },
        { key: "amount", label: t("detail.loanAmount"), value: application.loanAmount },
        { key: "income", label: t("detail.annualIncome"), value: application.annualIncome },
        {
          key: "incomeDoc",
          label: t("detail.incomeDoc"),
          value: application.incomeDocUploaded
            ? t("detail.uploaded")
            : t("detail.notUploaded"),
        },
        {
          key: "coRequired",
          label: t("detail.coBorrowerRequired"),
          value: yesNo(application.coBorrowerRequired),
        },
        {
          key: "docsSigned",
          label: t("detail.docsSigned"),
          value: yesNo(application.docsSigned),
        },
        {
          key: "household",
          label: t("detail.householdSize"),
          value: String(application.householdSize),
        },
        { key: "submitted", label: t("detail.submitted"), value: application.submitted },
        { key: "referral", label: t("detail.referral"), value: application.referral },
      ]
    : [];

  const coBorrowerItems: DetailItem[] = coBorrower
    ? [
        { key: "firstName", label: t("field.firstName"), value: coBorrower.firstName },
        { key: "lastName", label: t("field.lastName"), value: coBorrower.lastName },
        {
          key: "relationship",
          label: t("detail.relationship"),
          value: coBorrower.relationship,
        },
        { key: "email", label: t("field.email"), value: coBorrower.email },
        { key: "phone", label: t("field.phone"), value: coBorrower.phone },
        {
          key: "identityVerified",
          label: t("detail.identityVerified"),
          value: yesNo(coBorrower.identityVerified),
        },
      ]
    : [];

  /*
    THE LOAN TAB'S FIELDS — SIX OF THEM, AND THE STATE IS NOT ONE.

    There were seven in a three-column grid, so the last one sat alone on a
    row of its own with two empty cells beside it: *"ვერ მივხდი თუ აქაც
    საჭირო ესენი, კარგად მოსვი, ეხლა ალეწილია."*

    The one that came out is the STATUS, and not because it was the seventh.
    It is the only item here that is not a field: a tag in a cell labelled
    "Status" is the state of the whole loan pretending to be one of its
    properties, and it is drawn in a different shape from the six values
    around it. Above the grid it names what the reader is looking at, and the
    six that remain — amount, rate, agreement, the two cards, the funding date
    — fill two even rows.

    Nothing was dropped. Every field the WBS names for story 10 is still here.
  */
  const loanItems: DetailItem[] = loan
    ? [
        { key: "amount", label: t("detail.amount"), value: loan.amount },
        { key: "rate", label: t("detail.rate"), value: loan.rate },
        {
          key: "agreement",
          label: t("detail.agreementSigned"),
          value: yesNo(loan.agreementSigned),
        },
        { key: "virtual", label: t("detail.virtualCard"), value: loan.virtualCard },
        { key: "debit", label: t("detail.debitCard"), value: loan.debitCard },
        // WBS story 10: "all loan information, FUNDING STATUS and related
        // documents". The documents are below; this is the funding.
        //
        // AND IT IS LABELLED "Funded", NOT "Funding status". The value is a
        // DATE, and a date under a label promising a status is the field
        // answering a question nobody asked — the status is the tag above the
        // grid. "Funded · 14 Aug 2026" is also exactly how the loans table
        // words the same fact one screen away.
        ...(loan.fundedOn
          ? [{ key: "funded", label: t("loans.col.funded"), value: loan.fundedOn }]
          : []),
      ]
    : [];

  const name = fullName(borrower.profile);

  const saveAccount = (values: ManageBorrowerValues) => {
    console.log("update borrower", borrower.id, values);
    setDraft({ ...borrower, profile: { ...borrower.profile, ...values } });
    message.success(t("manageBorrower.saved"));
    setManaging(false);
  };

  const toggleAccess = () => {
    const next = !borrower.active;
    console.log(next ? "reinstate access" : "withdraw access", borrower.id);
    setDraft({ ...borrower, active: next });
    message.success(
      t(next ? "users.activated" : "users.deactivated", { name })
    );
    setChangingAccess(false);
  };

  const toggleFlag = () => {
    const next = !borrower.doNotLoan;
    console.log(next ? "add to DO NOT LOAN" : "remove from DO NOT LOAN", borrower.id);
    setDraft({ ...borrower, doNotLoan: next });
    message.success(t(next ? "doNotLoan.added" : "doNotLoan.removed"));
    setFlagging(false);
  };

  /*
    EVERY ACTION IN THE ⋮ MENU, not a row of buttons with a menu on the end.
    *"ამ 3 წერტილში ჩასვი ყველა ეს ექშენი."* The record's own actions — managing
    it, sending the set-password link, flagging it, and (Admin only) withdrawing
    access — are occasional, so they collapse behind one control and leave the
    title row to the name and its status tags. Each item keeps the WBS role gate
    it had as a button: Manage / Send link for Admin & Underwriter, DO NOT LOAN
    for those two AND OPA Staff, access for the Admin alone.
  */
  const actionItems: MenuProps["items"] = [
    ...(canEdit
      ? [
          {
            key: "manage",
            icon: <UserOutlined />,
            label: t("borrower.manage"),
            onClick: () => setManaging(true),
          },
          {
            key: "sendLink",
            icon: <SendOutlined />,
            label: t("borrower.sendLink"),
            onClick: () => {
              console.log("send set-password link", borrower.profile.email);
              message.success(t("users.linkSent"));
            },
          },
        ]
      : []),
    {
      key: "flag",
      icon: <StopOutlined />,
      // Red only when ADDING the flag; removing it is an ordinary action.
      danger: !borrower.doNotLoan,
      label: borrower.doNotLoan ? t("doNotLoan.remove") : t("doNotLoan.add"),
      onClick: () => setFlagging(true),
    },
    // Withdrawing access is rare and severe, so it sits after a divider from
    // the daily actions — WBS story 9, the Admin's alone.
    ...(canManageAccess
      ? [
          { type: "divider" as const },
          {
            key: "access",
            icon: <UserSwitchOutlined />,
            danger: borrower.active,
            label: borrower.active
              ? t("users.action.deactivate")
              : t("users.action.activate"),
            onClick: () => setChangingAccess(true),
          },
        ]
      : []),
  ];

  return (
    <AdminShell
      sections={staffNavFor(role)}
      activeKey="borrowers"
      userName={viewerLabel}
      profileTo="/staff/profile"
      onLogout={() => {
        console.log("log out");
        navigate({ to: "/" });
      }}
    >
      <AdminPage
        title={name}
        back={{
          label: t("borrower.back"),
          onClick: () => navigate({ to: "/staff/borrowers" }),
        }}
        titleAfter={
          <>
            {borrower.doNotLoan ? <DoNotLoanTag /> : null}
            {/* An account with its access withdrawn is a fact about the whole
                record, so it is stated beside the name, not inside a tab. */}
            {borrower.active ? null : (
              <Badge status="default" text={t("users.status.inactive")} />
            )}
          </>
        }
        extra={
          <Dropdown
            trigger={["click"]}
            placement="bottomRight"
            menu={{ items: actionItems }}
          >
            <Button icon={<MoreOutlined />} aria-label={t("borrower.moreActions")} />
          </Dropdown>
        }
      >
        <Card
          style={{ ...styles.card, ...styles.cardClip }}
          styles={{ body: styles.cardBody }}
        >
          <Tabs
            tabBarStyle={styles.tabBar}
            defaultActiveKey="profile"
            items={[
              {
                key: "profile",
                label: t("borrower.tab.profile"),
                children: (
                  <Flex vertical style={styles.tabBody}>
                    <DetailGrid items={profileItems} />
                  </Flex>
                ),
              },
              {
                key: "application",
                label: t("borrower.tab.application"),
                children: (
                  <Flex vertical style={styles.tabBody}>
                    {application ? (
                      <DetailGrid items={applicationItems} />
                    ) : (
                      <EmptyState
                        title={t("application.emptyTitle")}
                        description={t("application.emptyDescription")}
                      />
                    )}
                  </Flex>
                ),
              },
              {
                key: "coBorrower",
                label: t("borrower.tab.coBorrower"),
                children: (
                  <Flex vertical style={styles.tabBody}>
                    {coBorrower ? (
                      <DetailGrid items={coBorrowerItems} />
                    ) : (
                      <EmptyState
                        title={t("coBorrower.emptyTitle")}
                        description={t("coBorrower.emptyDescription")}
                      />
                    )}
                  </Flex>
                ),
              },
              {
                key: "loan",
                label: t("borrower.tab.loan"),
                children: (
                  <Flex vertical style={styles.tabBody}>
                    {loan ? (
                      <>
                        {/*
                          THE STATE ON THE LEFT, THE WAY THROUGH ON THE RIGHT.

                          The link to the full record used to sit at the very
                          bottom, under the comment list — 24px below the last
                          comment and 1px above the card's edge, measured. So
                          it read as an action ON the comments, and it was
                          jammed against the frame.

                          It is neither: it is how you leave this summary for
                          the record itself, which is the same job the status
                          beside it does for reading. On the tab's first line
                          they are a pair — what this loan is, and where the
                          whole of it lives.
                        */}
                        <Flex
                          align="center"
                          justify="space-between"
                          gap={16}
                          wrap
                          style={styles.loanState}
                        >
                          <LoanStatusTag status={loan.status} />
                          {/* Epic 2's own words: "Read-only access. Editing is
                              covered by Manage borrower accounts." So story
                              11's Add document / comment is NOT offered here —
                              it lives on the loan record, which is also where
                              the documents table with its uploader and comment
                              columns lives. This is the way through. */}
                          <Button
                            icon={<ArrowRightOutlined />}
                            iconPlacement="end"
                            onClick={() =>
                              navigate({ to: `/staff/loans/${loan.loanId}` })
                            }
                          >
                            {t("loanAdmin.openRecord")}
                          </Button>
                        </Flex>
                        <DetailGrid items={loanItems} />
                        {/* WBS stories 10 and 11: the loan's documents, its
                            comments, and the two things an Admin or an
                            Underwriter may add. OPA Staff reads them. */}
                        <LoanAdminPanel comments={loan.comments} />
                      </>
                    ) : (
                      <EmptyState
                        title={t("loan.emptyTitle")}
                        description={t("loan.emptyDescription")}
                      />
                    )}
                  </Flex>
                ),
              },
            ]}
          />
        </Card>
      </AdminPage>

      <ManageBorrowerModal
        open={managing}
        initialValues={{
          firstName: borrower.profile.firstName,
          middleName: borrower.profile.middleName,
          lastName: borrower.profile.lastName,
          email: borrower.profile.email,
          phone: borrower.profile.phone,
          street: borrower.profile.street,
          city: borrower.profile.city,
          state: borrower.profile.state,
          zip: borrower.profile.zip,
        }}
        onSubmit={saveAccount}
        onCancel={() => setManaging(false)}
      />

      <ConfirmModal
        open={flagging}
        title={t(borrower.doNotLoan ? "doNotLoan.removeTitle" : "doNotLoan.addTitle")}
        body={t(borrower.doNotLoan ? "doNotLoan.removeBody" : "doNotLoan.addBody", { name })}
        confirmLabel={t(borrower.doNotLoan ? "doNotLoan.remove" : "doNotLoan.add")}
        danger={!borrower.doNotLoan}
        onConfirm={toggleFlag}
        onCancel={() => setFlagging(false)}
      />

      <ConfirmModal
        open={changingAccess}
        title={t(borrower.active ? "users.deactivateTitle" : "users.activateTitle")}
        body={t(borrower.active ? "users.deactivateBody" : "users.activateBody", {
          name,
        })}
        confirmLabel={t(
          borrower.active ? "users.action.deactivate" : "users.action.activate"
        )}
        danger={borrower.active}
        onConfirm={toggleAccess}
        onCancel={() => setChangingAccess(false)}
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
