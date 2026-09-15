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
import type { ColumnsType } from "antd/es/table";
import { Link, useNavigate } from "@tanstack/react-router";
import { AdminShell } from "../../shared/ui/AdminShell";
import { AdminPage } from "../../shared/ui/AdminPage";
import { getStyles as getPageStyles } from "../../shared/ui/AdminPage.styles";
import { staffNavFor } from "../../shared/ui/navigation";
import { useStaffViewer } from "../../shared/ui/viewerRole";
import { decorateColumns } from "../../shared/ui/tableColumns";
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

  const recentColumns: ColumnsType<ApplicationRecord> = [
    {
      title: t("staffDash.colBorrower"),
      key: "name",
      render: (_value, row) => (
        <Link to={`/staff/applications/${row.id}`}>{row.borrower.name}</Link>
      ),
    },
    {
      title: t("staffDash.colStatus"),
      key: "status",
      width: 150,
      render: (_value, row) => <ApplicationStatusTag status={row.status} />,
    },
    {
      title: t("staffDash.colAmount"),
      key: "amount",
      width: 130,
      align: "end",
      render: (_value, row) => (
        <Typography.Text style={styles.amount}>{money(row.requestedAmount)}</Typography.Text>
      ),
    },
  ];

  const recentLoanColumns: ColumnsType<LoanRow> = [
    {
      title: t("loans.col.borrower"),
      key: "name",
      render: (_value, row) => (
        <Link to={`/staff/loans/${row.loan.loanId}`}>{row.borrowerName}</Link>
      ),
    },
    {
      title: t("loans.col.status"),
      key: "status",
      width: 150,
      render: (_value, row) => <LoanStatusTag status={row.loan.status} />,
    },
    {
      title: t("loans.col.amount"),
      key: "amount",
      width: 130,
      align: "end",
      render: (_value, row) => (
        <Typography.Text style={styles.amount}>{row.loan.amount}</Typography.Text>
      ),
    },
  ];

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
                  <Table<ApplicationRecord>
                    rowKey="id"
                    scroll={{ x: 520 }}
                    columns={decorateColumns(recentColumns)}
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
                ),
              },
              {
                key: "loans",
                label: t("staffDash.recentLoans"),
                children: (
                  <Table<LoanRow>
                    rowKey={(row) => row.loan.loanId}
                    scroll={{ x: 520 }}
                    columns={decorateColumns(recentLoanColumns)}
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
