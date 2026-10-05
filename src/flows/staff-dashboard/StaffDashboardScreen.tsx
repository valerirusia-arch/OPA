// src/flows/staff-dashboard/StaffDashboardScreen.tsx
//
// The back-office landing page. NOT A WBS EPIC — like the borrower's dashboard,
// "Dashboard" appears nowhere in the WBS. It invents no capability: it is a
// summary of numbers the system already keeps —
//
//   · the stat band (SummaryStats) — application counts by their WBS statuses;
//   · a flush table card whose tabs switch between the recent applications and
//     the recent loans, a few of the names behind the numbers.
//
// Every figure is mock and every row is existing data. Dumb: reads the role
// and shows counts.

import { Card, Table, Tabs, Typography, theme } from "antd";
import { useNavigate } from "@tanstack/react-router";
import { AdminShell } from "../../shared/ui/AdminShell";
import { AdminPage } from "../../shared/ui/AdminPage";
import { getStyles as getPageStyles } from "../../shared/ui/AdminPage.styles";
import { staffNavFor } from "../../shared/ui/navigation";
import { useStaffViewer } from "../../shared/ui/viewerRole";
import {
  buildPopinTable,
  useMeasuredWidth,
  TABLE_NAME_WIDTH,
} from "../../shared/ui/tableColumns";
import type { PriorityColumn } from "../../shared/ui/tableColumns";
import { NameCell } from "../../shared/ui/NameCell";
import { useT } from "../../shared/ui/i18n/useT";
import { SummaryStats, type SummaryStat } from "../../shared/ui/SummaryStats";
import { SessionTimeoutModal } from "../../features/Auth/ui/SessionTimeoutModal";
import { useIdleTimer, DEFAULT_IDLE_MS } from "../../features/Auth/ui/useIdleTimer";
import {
  ApplicationStatusTag,
  LoanStatusTag,
} from "../../features/Borrowers/ui/StatusTags";
import type { ApplicationRecord } from "../../features/Applications/ui/types";
import { mockApplications } from "../staff-applications/mockApplications";
import { allLoans, type LoanRow } from "../staff-loans/mockStaffLoans";
import { styles } from "./StaffDashboardScreen.styles";

// The application statuses are the WBS's own words (story 3); Applications and
// Borrowers are counts the system already keeps. Mock figures for the prototype.
const APPLICATIONS: SummaryStat[] = [
  { key: "applications", labelKey: "reporting.statApplications", value: 10 },
  { key: "approved", labelKey: "reporting.statApproved", value: 2 },
  { key: "declined", labelKey: "reporting.statDeclined", value: 2 },
  { key: "review", labelKey: "reporting.statInReview", value: 1 },
  { key: "borrowers", labelKey: "reporting.statBorrowers", value: 11 },
];

const money = (amount: number) =>
  `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

export type StaffDashboardScreenProps = { viewerName?: string; idleMs?: number };

export default function StaffDashboardScreen({
  viewerName,
  idleMs = DEFAULT_IDLE_MS,
}: StaffDashboardScreenProps) {
  const viewer = useStaffViewer();
  const name = viewerName ?? viewer.name;
  const navigate = useNavigate();
  const t = useT();
  const { token } = theme.useToken();
  const page = getPageStyles(token);
  const { idle, reset: staySignedIn } = useIdleTimer(idleMs);

  const recent = mockApplications.slice(0, 5);
  const recentLoans = allLoans.slice(0, 5);

  /*
    THESE TWO READ LIKE THE LISTS THEY SUMMARISE, and they did not.

    Both drew a bare link in a column with no width, which on a full-width card
    is a 600px hole between the borrower and their first fact — the same thing
    the queue and the loans list had. The name column is sized now and carries
    the row's reference under it, exactly as those lists do, and the one
    flexible column is the longest free-text field the table has.

    Recent applications gains the USCIS service for that reason: three columns
    could not fill the card, the queue already shows it, and it is the fact
    that says what the application actually is. *"თებლები უნდა იყოს ძაან
    კონსისტენტური."*

    AND NEITHER ENDS ON A RIGHT-ALIGNED COLUMN. The amount was last and set
    `align: "end"`, which pins its digits to the card's own border — the figure
    had no air on either side of it and the row stopped before the card did:
    *"დეშბორდზე კედელზეა მიწებებული, არადა გვაქვს მაგის სფეისი."* The money
    keeps its right alignment, because a column of figures reads on its
    decimal, and it simply is not the last column any more. The queue and the
    loans list both already ended on a left-aligned field; these two now do
    too.
  */
  const recentColumns: PriorityColumn<ApplicationRecord>[] = [
    {
      title: t("staffDash.colBorrower"),
      key: "name",
      width: TABLE_NAME_WIDTH,
      // The identifier — stays on screen at every width.
      priority: "high",
      render: (_value, row) => (
        <NameCell
          name={row.borrower.name}
          to={`/staff/applications/${row.id}`}
          meta={row.id}
        />
      ),
    },
    {
      title: t("staffDash.colAmount"),
      key: "amount",
      width: 140,
      align: "end",
      render: (_value, row) => (
        <Typography.Text style={styles.amount}>{money(row.requestedAmount)}</Typography.Text>
      ),
    },
    {
      title: t("staffDash.colStatus"),
      key: "status",
      width: 180,
      // The key attribute this summary exists to show.
      priority: "high",
      render: (_value, row) => <ApplicationStatusTag status={row.status} />,
    },
    /* LAST, AND LEFT-ALIGNED — the queue ends the same way. See the note above
       the columns on why a right-aligned column never sits here. */
    {
      title: t("queue.col.uscis"),
      key: "uscis",
      render: (_value, row) => (
        <Typography.Text ellipsis={{ tooltip: row.uscisType }}>
          {row.uscisType}
        </Typography.Text>
      ),
    },
  ];

  const recentLoanColumns: PriorityColumn<LoanRow>[] = [
    {
      title: t("loans.col.borrower"),
      key: "name",
      width: TABLE_NAME_WIDTH,
      // The identifier — stays on screen at every width.
      priority: "high",
      render: (_value, row) => (
        <NameCell
          name={row.borrowerName}
          to={`/staff/loans/${row.loan.loanId}`}
          meta={t("loanAdmin.loanId", { id: row.loan.loanId })}
        />
      ),
    },
    {
      title: t("loans.col.amount"),
      key: "amount",
      width: 140,
      align: "end",
      render: (_value, row) => (
        <Typography.Text style={styles.amount}>{row.loan.amount}</Typography.Text>
      ),
    },
    {
      title: t("loans.col.status"),
      key: "status",
      width: 180,
      // The key attribute this summary exists to show.
      priority: "high",
      render: (_value, row) => <LoanStatusTag status={row.loan.status} />,
    },
    /* Last and left-aligned, exactly as the loans list ends. Also the first
       to pop — least essential for a five-row "recent" summary. */
    {
      title: t("loans.col.funded"),
      key: "funded",
      priority: "low",
      popinText: (row) => row.loan.fundedOn ?? "",
      render: (_value, row) => (
        <Typography.Text type="secondary">{row.loan.fundedOn ?? "—"}</Typography.Text>
      ),
    },
  ];

  const [appsTableRef, appsTableWidth] = useMeasuredWidth<HTMLDivElement>();
  const appsPopin = buildPopinTable(recentColumns, appsTableWidth);
  const [loansTableRef, loansTableWidth] = useMeasuredWidth<HTMLDivElement>();
  const loansPopin = buildPopinTable(recentLoanColumns, loansTableWidth);

  return (
    <AdminShell
      sections={staffNavFor(viewer.role)}
      activeKey="dashboard"
      userName={name}
      profileTo="/staff/profile"
      onLogout={() => {
        console.log("log out");
        navigate({ to: "/" });
      }}
    >
      <AdminPage title={t("nav.dashboard")}>
        <div style={styles.section}>
          <SummaryStats items={APPLICATIONS} />
        </div>

        {/* One flush table card, its tabs the header — the payments page's
            pattern, so it reads like every other back-office list. */}
        <Card style={page.tableCard} styles={{ body: page.tableCardBody }}>
          <Tabs
            defaultActiveKey="applications"
            tabBarStyle={styles.tabBar}
            items={[
              {
                key: "applications",
                label: t("staffDash.recentApps"),
                children: (
                  <div ref={appsTableRef}>
                  <Table<ApplicationRecord>
                    rowKey="id"
                    tableLayout="fixed"
                    columns={appsPopin.columns}
                    dataSource={recent}
                    pagination={false}
                    onRow={(row) => ({
                      style: styles.row,
                      onClick: (event) => {
                        if ((event.target as HTMLElement).closest("a")) return;
                        navigate({ to: `/staff/applications/${row.id}` });
                      },
                    })}
                  />
                  </div>
                ),
              },
              {
                key: "loans",
                label: t("staffDash.recentLoans"),
                children: (
                  <div ref={loansTableRef}>
                  <Table<LoanRow>
                    rowKey={(row) => row.loan.loanId}
                    tableLayout="fixed"
                    columns={loansPopin.columns}
                    dataSource={recentLoans}
                    pagination={false}
                    onRow={(row) => ({
                      style: styles.row,
                      onClick: (event) => {
                        if ((event.target as HTMLElement).closest("a")) return;
                        navigate({ to: `/staff/loans/${row.loan.loanId}` });
                      },
                    })}
                  />
                  </div>
                ),
              },
            ]}
          />
        </Card>
      </AdminPage>

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
