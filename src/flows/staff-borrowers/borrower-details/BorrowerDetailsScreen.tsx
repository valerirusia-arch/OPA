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
import dayjs from "dayjs";
import { App, Badge, Button, Card, Dropdown, Flex, Result, Tabs, Typography } from "antd";
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
import { PersonPanel } from "../../../shared/ui/PersonPanel";
import { mockBorrowers } from "../mockBorrowers";
import { styles } from "./BorrowerDetailsScreen.styles";
import { EmptyScene } from "../../../shared/ui/empty/EmptyScene";

/**
 * The record stores a date of birth as it reads — "14 May 1990" — and the
 * product's own picker works in Dayjs, so the screen is where the two meet.
 * One format, named once, so the two directions cannot drift apart.
 */
const DOB_FORMAT = "DD MMM YYYY";
const parseDob = (value: string) => {
  const parsed = dayjs(value, DOB_FORMAT);
  return parsed.isValid() ? parsed : undefined;
};

/**
 * A NEW SSN, MASKED ON THE WAY IN.
 *
 * The back office shows and holds nothing but the last four — "Masked. The
 * full number is never shown in the back office" — so a replacement is stored
 * the same way the moment it arrives. Nothing here is the place the full
 * number lives; this is a prototype and it never sees one.
 */
const maskSsn = (value: string) => `•••-••-${value.replace(/\D/g, "").slice(-4)}`;

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
              icon={<EmptyScene variant="notFound" scale="page" />}
              /* NOT `borrowers.empty`. This page is reached by id, so it is
                 never a filter that emptied it — it said "No borrowers match
                 these filters" to a reader who had typed no filter, on a
                 screen with no filters on it. The loans and applications
                 screens next door already phrase their own version of this
                 correctly. */
              title={t("borrowers.notFound")}
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
  const loan = borrower.loan;

  /*
   * THE TWO ENDS OF THE CO-SIGNING LINK, both resolved to real records.
   *
   * `coBorrower` is who co-signs THIS borrower's application. `sponsoring` is
   * the other direction: the borrowers THIS person co-signs for — up to three,
   * per the WBS's "Co-borrowers can sponsor up to 3 borrowers" — which is the
   * only thing on a co-borrower's own file that says they are one.
   *
   * Both are lookups rather than stored fields, because there is one link and
   * storing it twice is how two copies of it start disagreeing.
   */
  const coBorrower = borrowers.find((item) => item.id === borrower.coBorrowerId);
  const sponsoring = borrowers.filter((item) => item.coBorrowerId === borrower.id);

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
    const { dateOfBirth, ssn, ...rest } = values;
    /*
     * WBS: "When phone number/email are updated — THE VERIFICATION PROCESS
     * SHOULD RE-OCCUR."
     *
     * The record was keeping its ticks through an address change, so a staff
     * correction left the file saying a brand-new address had been verified.
     * Whether the re-verification is an email or an SMS is Dev's; what the
     * record has to stop claiming is the old result.
     */
    const emailChanged = values.email !== borrower.profile.email;
    const phoneChanged = values.phone !== borrower.profile.phone;

    setDraft({
      ...borrower,
      profile: {
        ...borrower.profile,
        ...rest,
        /* The picker works in Dayjs; the record stores the date as it reads. */
        dateOfBirth: dateOfBirth
          ? dateOfBirth.format(DOB_FORMAT)
          : borrower.profile.dateOfBirth,
        /* Blank means "leave it alone" — see ManageBorrowerValues.ssn. A new
           number is masked on the way in, because the back office holds no
           more of it than the record shows. */
        ssn: ssn ? maskSsn(ssn) : borrower.profile.ssn,
        emailVerified: emailChanged ? false : borrower.profile.emailVerified,
        phoneVerified: phoneChanged ? false : borrower.profile.phoneVerified,
      },
    });
    console.log("update borrower", borrower.id, {
      ...rest,
      ssnReplaced: Boolean(ssn),
      reverify: { email: emailChanged, phone: phoneChanged },
    });
    message.success(
      emailChanged || phoneChanged
        ? t("manageBorrower.reverify")
        : t("manageBorrower.saved")
    );
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
                  <Flex vertical gap={16} style={styles.tabBody}>
                    {/*
                      THE PERSON, AND THE WAY TO THEIR FILE — not a copy of it.

                      This tab used to restate six of the co-borrower's fields.
                      They were the only copy of those facts anywhere, so there
                      was no way to change them: "Manage borrower accounts"
                      lives on a borrower's own record, and the co-borrower did
                      not have one. Now they do, and this says who they are and
                      goes there.
                    */}
                    {coBorrower ? (
                      <>
                        <PersonPanel
                          name={fullName(coBorrower.profile)}
                          meta={`${coBorrower.profile.email} · ${coBorrower.profile.phone} · ${coBorrower.profile.state}`}
                        />
                        <Button
                          type="link"
                          style={styles.recordLink}
                          onClick={() =>
                            navigate({ to: `/staff/borrowers/${coBorrower.id}` })
                          }
                        >
                          {t("coBorrower.openRecord")}
                        </Button>
                      </>
                    ) : sponsoring.length === 0 ? (
                      /* Only when the tab has nothing at all to say. On a
                         co-borrower's own file "this application has no
                         co-borrower" is both true and beside the point — they
                         have no application, and what the tab is here to show
                         is who they co-sign for. */
                      <EmptyState
                        title={t("coBorrower.emptyTitle")}
                        description={t("coBorrower.emptyDescription")}
                      />
                    ) : null}

                    {/*
                      THE OTHER DIRECTION: who THIS person co-signs for.

                      A co-borrower's own file looked like any other borrower's
                      — an account, a profile, and no application — with nothing
                      on it to say why it exists. This is that, and it is also
                      where the WBS's cap becomes visible: "Co-borrowers can
                      sponsor up to 3 borrowers", which nothing in the product
                      could show while a co-borrower was six fields inside
                      somebody else's record.
                    */}
                    {sponsoring.length > 0 ? (
                      <Flex vertical gap={8} style={styles.sponsoring}>
                        <Typography.Text style={styles.sponsoringLabel}>
                          {t("coBorrower.sponsoring")}
                        </Typography.Text>
                        {sponsoring.map((sponsored) => (
                          <PersonPanel
                            key={sponsored.id}
                            name={fullName(sponsored.profile)}
                            meta={sponsored.application?.uscisType}
                            trailing={
                              <Button
                                type="link"
                                style={styles.recordLink}
                                onClick={() =>
                                  navigate({ to: `/staff/borrowers/${sponsored.id}` })
                                }
                              >
                                {t("coBorrower.openRecord")}
                              </Button>
                            }
                          />
                        ))}
                        <Typography.Text type="secondary" style={styles.sponsoringCap}>
                          {t("coBorrower.sponsoringCap")}
                        </Typography.Text>
                      </Flex>
                    ) : null}
                  </Flex>
                ),
              },
              {
                key: "loan",
                label: t("borrower.tab.loan"),
                children: (
                  /*
                    A GAP BETWEEN THE THREE BLOCKS. There was none, and the
                    record grid stopped reserving a trailing margin of its own,
                    so "Comments" landed straight under the grid's last row and
                    read as one more cell in it — a heading inside a table.
                  */
                  <Flex vertical gap={24} style={styles.tabBody}>
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
                          {/* A LINK, not a framed button. It is a way out of a
                              summary, the same errand as "Open their borrower
                              record" on the tab beside it, and those two should
                              not be two different weights of control. An
                              outlined box also made it the heaviest thing on a
                              read-only tab. */}
                          <Button
                            type="link"
                            icon={<ArrowRightOutlined />}
                            iconPlacement="end"
                            style={styles.recordLink}
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
        maskedSsn={borrower.profile.ssn}
        initialValues={{
          firstName: borrower.profile.firstName,
          middleName: borrower.profile.middleName,
          lastName: borrower.profile.lastName,
          dateOfBirth: parseDob(borrower.profile.dateOfBirth),
          country: borrower.profile.country,
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
