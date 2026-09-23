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

import { App, Button, Card, Divider, Dropdown, Flex, Typography } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { useNavigate } from "@tanstack/react-router";
import { AdminShell } from "../../shared/ui/AdminShell";
import { AdminPage } from "../../shared/ui/AdminPage";
import { staffNavFor } from "../../shared/ui/navigation";
import { useStaffViewer, type StaffRole } from "../../shared/ui/viewerRole";
import { useT } from "../../shared/ui/i18n/useT";
import type { TranslationKey } from "../../shared/ui/i18n/dictionary";
import { SessionTimeoutModal } from "../../features/Auth/ui/SessionTimeoutModal";
import { useIdleTimer, DEFAULT_IDLE_MS } from "../../features/Auth/ui/useIdleTimer";
import { styles } from "./StaffReportingScreen.styles";

// The summary band that briefly sat here moved to the back-office Dashboard,
// where it belongs — it is a Dashboard concept, not a Reporting story, and the
// designer took it off this page once the Dashboard existed. The stat labels
// (reporting.stat*) stay in the dictionary; SummaryStats reads them there.

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
      <AdminPage title={t("reporting.title")} subtitle={t("reporting.lead")}>
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
