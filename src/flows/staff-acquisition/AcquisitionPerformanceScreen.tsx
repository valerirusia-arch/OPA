// src/flows/staff-acquisition/AcquisitionPerformanceScreen.tsx
//
// Epic 10 — "Analyze Lending Performance by Acquisition Channel". WBS:
// "Authorized internal users shall be able to analyze lending performance by
// campaign, partner group, referral partner, and acquisition source via
// creating credit report / consumer credit report for a specific campaign /
// partner / acquisition channel", and the comment: "filters should be added
// for the data appearing in the report".
//
// So this is not a table — it is the filters that scope one of the Reporting
// epic's two credit reports to a single channel, and the way to run it. Pick
// what to analyse by, pick which one, pick the report, export. Admin AND
// Underwriter (the epic's View/Search/Analyse stories name both), not OPA Staff.
//
// Dumb: local selection, simulated export.

import { useMemo, useState } from "react";
import { App, Button, Card, Dropdown, Flex, Result, Row, Col, Select, Table, Typography, theme } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DownloadOutlined } from "@ant-design/icons";
import { useNavigate } from "@tanstack/react-router";
import { AdminShell } from "../../shared/ui/AdminShell";
import { AdminPage } from "../../shared/ui/AdminPage";
import { getStyles as getPageStyles } from "../../shared/ui/AdminPage.styles";
import { staffNavFor } from "../../shared/ui/navigation";
import { useStaffViewer } from "../../shared/ui/viewerRole";
import { useT } from "../../shared/ui/i18n/useT";
import type { TranslationKey } from "../../shared/ui/i18n/dictionary";
import { SummaryStats, type SummaryStat } from "../../shared/ui/SummaryStats";
import { SessionTimeoutModal } from "../../features/Auth/ui/SessionTimeoutModal";
import { useIdleTimer, DEFAULT_IDLE_MS } from "../../features/Auth/ui/useIdleTimer";
import { mockSources } from "./mockSources";
import { mockGroups, mockReferralPartners } from "./mockPartners";
import { mockCampaigns } from "./mockCampaigns";
import { styles } from "./AcquisitionPerformanceScreen.styles";

// The analysis, from the wireframe: a few totals, then a row per channel with
// its loans, credit reports and approval rate. Mock aggregates — Dev reads the
// real figures once the filters run against the data.
const PERF_STATS: SummaryStat[] = [
  { key: "loans", labelKey: "acq.perf.statLoans", value: 142 },
  { key: "reports", labelKey: "acq.perf.statReports", value: 187 },
  { key: "volume", labelKey: "acq.perf.statVolume", value: "$204,480" },
  { key: "approval", labelKey: "acq.perf.statApproval", value: "68%" },
];

type PerfRow = { key: string; channel: string; loans: number; reports: number; approval: string };

const PERF_ROWS: PerfRow[] = [
  { key: "r1", channel: "Organic search", loans: 64, reports: 80, approval: "72%" },
  { key: "r2", channel: "Partner referral", loans: 38, reports: 51, approval: "66%" },
  { key: "r3", channel: "Email newsletter", loans: 22, reports: 33, approval: "61%" },
  { key: "r4", channel: "Community webinar", loans: 18, reports: 23, approval: "58%" },
];

type Dimension = "campaign" | "group" | "partner" | "source";
type ReportKind = "credit" | "consumer";

const DIMENSION_LABEL: Record<Dimension, TranslationKey> = {
  campaign: "acq.perf.dimCampaign",
  group: "acq.perf.dimGroup",
  partner: "acq.perf.dimPartner",
  source: "acq.perf.dimSource",
};

export type AcquisitionPerformanceScreenProps = { viewerName?: string; idleMs?: number };

export default function AcquisitionPerformanceScreen({
  viewerName,
  idleMs = DEFAULT_IDLE_MS,
}: AcquisitionPerformanceScreenProps) {
  const viewer = useStaffViewer();
  const name = viewerName ?? viewer.name;
  const { message } = App.useApp();
  const navigate = useNavigate();
  const t = useT();
  const { token } = theme.useToken();
  const page = getPageStyles(token);
  const { idle, reset: staySignedIn } = useIdleTimer(idleMs);

  const perfColumns: ColumnsType<PerfRow> = [
    { title: t("acq.perf.colChannel"), dataIndex: "channel" },
    { title: t("acq.perf.colLoans"), dataIndex: "loans", width: 140, align: "end" },
    { title: t("acq.perf.colReports"), dataIndex: "reports", width: 160, align: "end" },
    { title: t("acq.perf.colApproval"), dataIndex: "approval", width: 160, align: "end" },
  ];

  // WBS: Analyse (like View and Search) names Admin and Underwriter; OPA Staff
  // is on none of the acquisition stories.
  const canView = viewer.role === "admin" || viewer.role === "underwriter";

  const [dimension, setDimension] = useState<Dimension>("campaign");
  const [value, setValue] = useState<string | undefined>();
  const [report, setReport] = useState<ReportKind>("credit");

  // The values to choose from depend on the dimension.
  const valueOptions = useMemo(() => {
    const names =
      dimension === "campaign"
        ? mockCampaigns.map((c) => c.name)
        : dimension === "group"
          ? mockGroups.map((g) => g.name)
          : dimension === "partner"
            ? mockReferralPartners.map((p) => p.name)
            : mockSources.map((s) => s.name);
    return names.map((label) => ({ label, value: label }));
  }, [dimension]);

  const dimensionOptions = (Object.keys(DIMENSION_LABEL) as Dimension[]).map((key) => ({
    label: t(DIMENSION_LABEL[key]),
    value: key,
  }));

  const reportOptions = [
    { label: t("acq.perf.reportCredit"), value: "credit" },
    { label: t("acq.perf.reportConsumer"), value: "consumer" },
  ];

  const run = (format: "xlsx" | "csv") => {
    console.log("create acquisition performance report", { dimension, value, report, format });
    message.success(t("acq.perf.created", { name: value ?? "" }));
  };

  return (
    <AdminShell
      sections={staffNavFor(viewer.role)}
      activeKey="performance"
      userName={name}
      profileTo="/staff/profile"
      onLogout={() => {
        console.log("log out");
        navigate({ to: "/" });
      }}
    >
      <AdminPage title={t("acq.perf.title")}>
        {canView ? (
          <>
            <Typography.Text type="secondary" style={styles.lead}>
              {t("acq.perf.lead")}
            </Typography.Text>

            <Card>
              <Row gutter={16} style={styles.controls}>
                <Col xs={24} md={8} style={styles.field}>
                  <Typography.Text style={styles.fieldLabel}>{t("acq.perf.analyzeBy")}</Typography.Text>
                  <Select<Dimension>
                    size="large"
                    style={styles.field}
                    value={dimension}
                    onChange={(next) => {
                      setDimension(next);
                      setValue(undefined);
                    }}
                    options={dimensionOptions}
                  />
                </Col>

                <Col xs={24} md={8} style={styles.field}>
                  <Typography.Text style={styles.fieldLabel}>{t(DIMENSION_LABEL[dimension])}</Typography.Text>
                  <Select
                    size="large"
                    style={styles.field}
                    value={value}
                    onChange={setValue}
                    options={valueOptions}
                    placeholder={t("acq.perf.selectValue")}
                    showSearch
                  />
                </Col>

                <Col xs={24} md={8} style={styles.field}>
                  <Typography.Text style={styles.fieldLabel}>{t("acq.perf.reportType")}</Typography.Text>
                  <Select<ReportKind>
                    size="large"
                    style={styles.field}
                    value={report}
                    onChange={setReport}
                    options={reportOptions}
                  />
                </Col>
              </Row>

              <Flex justify="flex-end" style={{ marginTop: 24 }}>
                <Dropdown
                  trigger={["click"]}
                  placement="bottomRight"
                  disabled={!value}
                  menu={{
                    items: [
                      { key: "xlsx", label: t("queue.exportXlsx") },
                      { key: "csv", label: t("queue.exportCsv") },
                    ],
                    onClick: ({ key }) => run(key as "xlsx" | "csv"),
                  }}
                >
                  <Button type="primary" size="large" icon={<DownloadOutlined />} disabled={!value}>
                    {t("acq.perf.create")}
                  </Button>
                </Dropdown>
              </Flex>
            </Card>

            {/* THE ANALYSIS, from the wireframe: totals then a row per channel.
                Mock aggregates; the filters above scope what a real run reads. */}
            <div style={styles.results}>
              <SummaryStats items={PERF_STATS} />
            </div>
            <Typography.Title level={5} style={styles.byChannelHeading}>
              {t("acq.perf.byChannel")}
            </Typography.Title>
            <Card style={page.tableCard} styles={{ body: page.tableCardBody }}>
              <Table<PerfRow>
                rowKey="key"
                scroll={{ x: 640 }}
                columns={perfColumns}
                dataSource={PERF_ROWS}
                pagination={false}
              />
            </Card>
          </>
        ) : (
          <Card>
            <Result
              status="403"
              title={t("access.deniedTitle")}
              subTitle={t("access.deniedDescription")}
              extra={
                <Button type="primary" onClick={() => navigate({ to: "/staff/borrowers" })}>
                  {t("access.goToBorrowers")}
                </Button>
              }
            />
          </Card>
        )}
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
