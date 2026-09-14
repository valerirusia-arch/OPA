// src/flows/staff-reporting/StaffReportingScreen.tsx
//
// Epic 8 — Reporting & Audit. The one screen the epic needs: a place to export
// the reports the WBS names, each to XLSX or CSV ("CSV and Excel export formats
// are supported").
//
// THREE EXPORTS, EACH WITH ITS OWN ROLE LIST, straight from the WBS role
// column:
//
//   Credit report                         Admin / Underwriter / OPA Staff
//   Consumer credit reporting (Metro II)  Admin / Underwriter / OPA Staff
//   Application data                       Admin / OPA Staff
//
// The application-data export ALSO lives on the underwriting queue, where OPA
// Staff meet it while working. It is repeated here because the ADMIN is on that
// story too and, per Loan Decisioning, cannot reach the queue at all — this is
// the Admin's only way to it. A row shows only to the roles its story names, so
// an Underwriter never sees application data here and an Admin never sees a
// queue they cannot open.
//
// NOT DRAWN, on purpose:
//   · "Send credit report / Metro II to Equifax" are System stories — no user
//     action, no control. The Metro II row names Equifax as its destination in
//     its description; that is all a person needs to know here.
//   · There is no "audit log" screen: the WBS has no story for viewing one. The
//     audit trail it does require — the amount change history, the recorded
//     decision reasons — is already drawn where those actions happen.
//
// Dumb: a role, a list of report descriptors, and a simulated download.

import { App, Button, Card, Divider, Dropdown, Flex, Typography, theme } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { useNavigate } from "@tanstack/react-router";
import { AdminShell } from "../../shared/ui/AdminShell";
import { AdminPage } from "../../shared/ui/AdminPage";
import { staffNavFor } from "../../shared/ui/navigation";
import { useStaffViewer, type StaffRole } from "../../shared/ui/viewerRole";
import { useT } from "../../shared/ui/i18n/useT";
import type { TranslationKey } from "../../shared/ui/i18n/dictionary";
import { getFigureStyles } from "../../shared/ui/figures.styles";
import { SessionTimeoutModal } from "../../features/Auth/ui/SessionTimeoutModal";
import { useIdleTimer, DEFAULT_IDLE_MS } from "../../features/Auth/ui/useIdleTimer";
import { styles } from "./StaffReportingScreen.styles";

/**
 * THE SUMMARY BAND, from the wireframe.
 *
 * The WBS's Reporting & Audit epic has no story for these — summary metrics
 * are a Dashboard concept, and the WBS keeps a separate "Admin dashboard" epic
 * for them (unbuilt). They were flagged to the designer as out-of-epic and the
 * designer asked for them here anyway, with the counts kept honest.
 *
 * So the labels ARE the WBS's own: Approved / Declined / In review are the
 * application statuses from "View application status" (story 3), and
 * Applications and Borrowers are counts the system already keeps. Mock figures
 * for the prototype; Dev reads the real counts.
 */
const SUMMARY: { key: string; labelKey: TranslationKey; value: number }[] = [
  { key: "applications", labelKey: "reporting.statApplications", value: 10 },
  { key: "approved", labelKey: "reporting.statApproved", value: 2 },
  { key: "declined", labelKey: "reporting.statDeclined", value: 2 },
  { key: "review", labelKey: "reporting.statInReview", value: 1 },
  { key: "borrowers", labelKey: "reporting.statBorrowers", value: 11 },
];

type Report = {
  key: string;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  /** WBS role column — the row is drawn only for these roles. */
  roles: StaffRole[];
};

const REPORTS: Report[] = [
  {
    key: "credit",
    titleKey: "reporting.creditTitle",
    descKey: "reporting.creditDesc",
    roles: ["admin", "underwriter", "staff"],
  },
  {
    key: "metro",
    titleKey: "reporting.metroTitle",
    descKey: "reporting.metroDesc",
    roles: ["admin", "underwriter", "staff"],
  },
  {
    key: "applications",
    titleKey: "reporting.appDataTitle",
    descKey: "reporting.appDataDesc",
    roles: ["admin", "staff"],
  },
];

export type StaffReportingScreenProps = {
  viewerName?: string;
  idleMs?: number;
};

export default function StaffReportingScreen({
  viewerName,
  idleMs = DEFAULT_IDLE_MS,
}: StaffReportingScreenProps) {
  const viewer = useStaffViewer();
  const { message } = App.useApp();
  const name = viewerName ?? viewer.name;
  const navigate = useNavigate();
  const t = useT();
  const { token } = theme.useToken();
  const fig = getFigureStyles(token);
  const { idle, reset: staySignedIn } = useIdleTimer(idleMs);

  const available = REPORTS.filter((report) => report.roles.includes(viewer.role));

  return (
    <AdminShell
      sections={staffNavFor(viewer.role)}
      activeKey="reporting"
      userName={name}
      profileTo="/staff/profile"
      onLogout={() => {
        console.log("log out");
        navigate({ to: "/" });
      }}
    >
      <AdminPage title={t("reporting.title")}>
        <Typography.Text type="secondary" style={styles.lead}>
          {t("reporting.lead")}
        </Typography.Text>

        {/* The summary band — see SUMMARY. Wireframe's, not the WBS's, and
            designer-approved on this page; the labels stay WBS status words. */}
        <Flex gap={12} wrap style={styles.statRow}>
          {SUMMARY.map((stat) => (
            <Card key={stat.key} style={styles.statCard} styles={{ body: styles.statBody }}>
              <Flex vertical gap={4}>
                <Typography.Text style={fig.microLabel}>{t(stat.labelKey)}</Typography.Text>
                <Typography.Text style={fig.figure}>{stat.value}</Typography.Text>
              </Flex>
            </Card>
          ))}
        </Flex>

        <Card>
          {available.map((report, index) => (
            <div key={report.key}>
              {index > 0 ? <Divider style={styles.divider} /> : null}
              <Flex align="center" justify="space-between" gap={16} style={styles.row}>
                <Flex vertical gap={2} style={styles.copy}>
                  <Typography.Text style={styles.name}>{t(report.titleKey)}</Typography.Text>
                  <Typography.Text type="secondary">{t(report.descKey)}</Typography.Text>
                </Flex>

                {/* XLSX or CSV — the WBS's two formats, behind one control so a
                    row is a report and not two buttons. Simulated: Dev wires
                    the real file. */}
                <Dropdown
                  trigger={["click"]}
                  placement="bottomRight"
                  menu={{
                    items: [
                      { key: "xlsx", label: t("queue.exportXlsx") },
                      { key: "csv", label: t("queue.exportCsv") },
                    ],
                    onClick: ({ key }) => {
                      console.log("export report", { report: report.key, format: key });
                      message.success(t("reporting.exported", { report: t(report.titleKey) }));
                    },
                  }}
                >
                  <Button icon={<DownloadOutlined />}>{t("queue.export")}</Button>
                </Dropdown>
              </Flex>
            </div>
          ))}
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
