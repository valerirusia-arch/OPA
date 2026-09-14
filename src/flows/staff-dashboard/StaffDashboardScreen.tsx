// src/flows/staff-dashboard/StaffDashboardScreen.tsx
//
// The back-office landing page. NOT A WBS EPIC — like the borrower's dashboard,
// "Dashboard" appears nowhere in the WBS. It invents no capability: it is a
// summary of numbers the system already keeps, arranged two ways —
//
//   · the stat band (SummaryStats) — application counts by their WBS statuses;
//   · a donut of that same split beside a recent-applications table, so the
//     numbers have a shape and a few names behind them.
//
// Every figure is mock and every row is existing data. Dumb: reads the role
// and shows counts.

import { Card, Col, Row, Table, Typography, theme } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "@tanstack/react-router";
import { AdminShell } from "../../shared/ui/AdminShell";
import { AdminPage } from "../../shared/ui/AdminPage";
import { getStyles as getPageStyles } from "../../shared/ui/AdminPage.styles";
import { staffNavFor } from "../../shared/ui/navigation";
import { useStaffViewer } from "../../shared/ui/viewerRole";
import { useT } from "../../shared/ui/i18n/useT";
import { SummaryStats, type SummaryStat } from "../../shared/ui/SummaryStats";
import { StatusDonut, type DonutSegment } from "../../shared/ui/StatusDonut";
import { SessionTimeoutModal } from "../../features/Auth/ui/SessionTimeoutModal";
import { useIdleTimer, DEFAULT_IDLE_MS } from "../../features/Auth/ui/useIdleTimer";
import { ApplicationStatusTag } from "../../features/Borrowers/ui/StatusTags";
import type { ApplicationRecord } from "../../features/Applications/ui/types";
import { brand } from "../../theme/tokens";
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

  // The same split as the stat band, given a shape. The donut's own softer
  // palette, not the semantic success/error/warning — see brand.donut*.
  const donutSegments: DonutSegment[] = [
    { key: "approved", labelKey: "reporting.statApproved", value: 2, color: brand.donutApproved },
    { key: "declined", labelKey: "reporting.statDeclined", value: 2, color: brand.donutDeclined },
    { key: "review", labelKey: "reporting.statInReview", value: 1, color: brand.donutReview },
    { key: "pending", labelKey: "staffDash.statPending", value: 5, color: brand.donutPending },
  ];

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
        <div style={styles.stats}>
          <SummaryStats items={APPLICATIONS} />
        </div>

        {/* The split as a shape, beside a few of the rows behind it. */}
        <Row gutter={[16, 16]} style={styles.stats}>
          <Col xs={24} lg={8}>
            <Card title={t("staffDash.donutTitle")} style={styles.fill}>
              <StatusDonut segments={donutSegments} centerLabelKey="staffDash.donutCenter" />
            </Card>
          </Col>
          <Col xs={24} lg={16}>
            <Card
              title={t("staffDash.recentApps")}
              style={{ ...styles.fill, ...page.tableCard }}
              styles={{ body: page.tableCardBody }}
            >
              <Table<ApplicationRecord>
                rowKey="id"
                columns={recentColumns}
                dataSource={recent}
                pagination={false}
              />
            </Card>
          </Col>
        </Row>
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
