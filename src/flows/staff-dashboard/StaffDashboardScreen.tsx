// src/flows/staff-dashboard/StaffDashboardScreen.tsx
//
// The back-office landing page. NOT A WBS EPIC — like the borrower's dashboard,
// "Dashboard" appears nowhere in the WBS. It invents no capability: it is a
// summary of numbers the system already keeps, plus quick ways into the work —
//
//   · the stat band (SummaryStats) — application counts by their WBS statuses;
//   · a row of shortcut tiles into the sections the role can open;
//   · a recent-applications table, a few of the names behind the numbers.
//
// Every figure is mock and every row is existing data. Dumb: reads the role
// and shows counts.

import { Button, Card, Flex, Table, Typography, theme } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "@tanstack/react-router";
import { AdminShell } from "../../shared/ui/AdminShell";
import { AdminPage } from "../../shared/ui/AdminPage";
import { getStyles as getPageStyles } from "../../shared/ui/AdminPage.styles";
import { staffNavFor } from "../../shared/ui/navigation";
import { useStaffViewer } from "../../shared/ui/viewerRole";
import { useT } from "../../shared/ui/i18n/useT";
import { SummaryStats, type SummaryStat } from "../../shared/ui/SummaryStats";
import { SessionTimeoutModal } from "../../features/Auth/ui/SessionTimeoutModal";
import { useIdleTimer, DEFAULT_IDLE_MS } from "../../features/Auth/ui/useIdleTimer";
import { ApplicationStatusTag } from "../../features/Borrowers/ui/StatusTags";
import type { ApplicationRecord } from "../../features/Applications/ui/types";
import { mockApplications } from "../staff-applications/mockApplications";
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

  // Quick ways into the work, drawn from THIS role's own nav so a shortcut can
  // never point somewhere the role's rail (and route guard) would refuse. The
  // dashboard itself is dropped, and a group with no page of its own (Acquisition)
  // links to its first child.
  const shortcuts = staffNavFor(viewer.role)
    .flatMap((section) => section.items)
    .filter((item) => item.key !== "dashboard")
    .flatMap((item) => {
      const to = item.to ?? item.children?.find((child) => child.to)?.to;
      return to ? [{ key: item.key, labelKey: item.labelKey, icon: item.icon, to }] : [];
    });

  const recent = mockApplications.slice(0, 5);

  const recentColumns: ColumnsType<ApplicationRecord> = [
    {
      title: t("staffDash.colBorrower"),
      key: "name",
      render: (_value, row) => <Typography.Text>{row.borrower.name}</Typography.Text>,
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

        {/* Quick ways in — the sections this role can open, one tap away. */}
        <Card title={t("staffDash.quickActions")} style={styles.section}>
          <Flex wrap gap={12}>
            {shortcuts.map((item) => (
              <Button
                key={item.key}
                size="large"
                icon={item.icon}
                style={styles.shortcut}
                onClick={() => navigate({ to: item.to })}
              >
                {t(item.labelKey)}
              </Button>
            ))}
          </Flex>
        </Card>

        {/* A few of the names behind the numbers, full width. */}
        <Card
          title={t("staffDash.recentApps")}
          style={page.tableCard}
          styles={{ body: page.tableCardBody }}
        >
          <Table<ApplicationRecord>
            rowKey="id"
            scroll={{ x: 520 }}
            columns={recentColumns}
            dataSource={recent}
            pagination={false}
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
