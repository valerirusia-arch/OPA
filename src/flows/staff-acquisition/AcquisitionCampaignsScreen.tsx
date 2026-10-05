// src/flows/staff-acquisition/AcquisitionCampaignsScreen.tsx
//
// Epic 10 — "Manage Marketing Campaigns". WBS: the Admin "shall be able to
// create, view, update, and maintain marketing campaigns", and the comment
// adds "campaign attributes (up to 10 simple attributes), statuses
// (active/inactive), validity periods". Kept simple: a name, the source it
// runs on, a validity period and a status. Admin only.
//
// Dumb: rows in local state, no fetching.

import { useState } from "react";
import { App, Badge, Button, Card, Dropdown, Result, Table, Typography, theme } from "antd";
import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "@tanstack/react-router";
import { AdminShell } from "../../shared/ui/AdminShell";
import { AdminPage } from "../../shared/ui/AdminPage";
import { getStyles as getPageStyles } from "../../shared/ui/AdminPage.styles";
import { ConfirmModal } from "../../shared/ui/ConfirmModal";
import { EmptyState } from "../../shared/ui/EmptyState";
import { TABLE_EMPTY_MIN_HEIGHT } from "../../shared/ui/EmptyState.styles";
import { staffNavFor } from "../../shared/ui/navigation";
import { useStaffViewer } from "../../shared/ui/viewerRole";
import { buildPopinTable, useMeasuredWidth } from "../../shared/ui/tableColumns";
import type { PriorityColumn } from "../../shared/ui/tableColumns";
import { useT } from "../../shared/ui/i18n/useT";
import { SessionTimeoutModal } from "../../features/Auth/ui/SessionTimeoutModal";
import { useIdleTimer, DEFAULT_IDLE_MS } from "../../features/Auth/ui/useIdleTimer";
import { AcquisitionEntityModal } from "../../features/Acquisition/ui/AcquisitionEntityModal";
import { fromDayjsRange, toDayjsRange } from "../../features/Acquisition/ui/entityDates";
import type { AcquisitionStatus, Campaign } from "../../features/Acquisition/ui/types";
import { mockSources } from "./mockSources";
import { mockCampaigns } from "./mockCampaigns";
import { getStyles } from "./AcquisitionSourcesScreen.styles";
import { EmptyScene } from "../../shared/ui/scenes/EmptyScene";

type Pending = { kind: "delete" | "deactivate" | "activate"; campaign: Campaign } | null;

export type AcquisitionCampaignsScreenProps = { viewerName?: string; idleMs?: number };

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });

export default function AcquisitionCampaignsScreen({
  viewerName,
  idleMs = DEFAULT_IDLE_MS,
}: AcquisitionCampaignsScreenProps) {
  const viewer = useStaffViewer();
  const name = viewerName ?? viewer.name;
  const { message } = App.useApp();
  const navigate = useNavigate();
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);
  const page = getPageStyles(token);
  const { idle, reset: staySignedIn } = useIdleTimer(idleMs);

  const [rows, setRows] = useState(mockCampaigns);
  const [editing, setEditing] = useState<Campaign | null>(null);
  const [creating, setCreating] = useState(false);
  const [pending, setPending] = useState<Pending>(null);

  const canManage = viewer.role === "admin";
  const sourceOptions = mockSources.map((source) => ({ label: source.name, value: source.name }));

  const rowMenu = (campaign: Campaign) => ({
    items: [
      { key: "edit", label: t("acq.action.edit"), onClick: () => setEditing(campaign) },
      {
        key: "status",
        label: campaign.status === "active" ? t("acq.action.deactivate") : t("acq.action.activate"),
        onClick: () =>
          setPending({ kind: campaign.status === "active" ? "deactivate" : "activate", campaign }),
      },
      { type: "divider" as const },
      { key: "delete", danger: true, label: t("acq.action.delete"), onClick: () => setPending({ kind: "delete", campaign }) },
    ],
  });

  const columns: PriorityColumn<Campaign>[] = [
    {
      title: t("acq.campaign.name"),
      dataIndex: "name",
      width: 260,
      // The identifier — stays on screen at every width.
      priority: "high",
      render: (value: string, row) => (
        <Typography.Text style={row.status === "inactive" ? s.inactiveRow : s.identifier}>
          {value}
        </Typography.Text>
      ),
    },
    {
      title: t("acq.campaign.source"),
      dataIndex: "source",
      popinText: (row) => row.source,
      render: (value: string) => <Typography.Text style={s.quiet}>{value}</Typography.Text>,
    },
    {
      title: t("acq.campaign.period"),
      dataIndex: "period",
      width: 280,
      popinText: (row) => `${fmt(row.period[0])} – ${fmt(row.period[1])}`,
      render: (period: [string, string]) => (
        <Typography.Text style={s.dateCell}>{`${fmt(period[0])} – ${fmt(period[1])}`}</Typography.Text>
      ),
    },
    {
      title: t("acq.col.status"),
      dataIndex: "status",
      width: 140,
      // The key attribute — whether this campaign is running. Stays with
      // Name at every width.
      priority: "high",
      render: (status: AcquisitionStatus) => (
        <Badge
          status={status === "active" ? "success" : "default"}
          text={status === "active" ? t("acq.status.active") : t("acq.status.inactive")}
        />
      ),
    },
  ];

  if (canManage) {
    columns.push({
      key: "actions",
      width: 72,
      align: "end",
      render: (_value, row) => (
        <Dropdown menu={rowMenu(row)} trigger={["click"]} placement="bottomRight">
          <Button
            type="text"
            icon={<MoreOutlined style={s.rowActionIcon} />}
            style={s.rowAction}
            aria-label={t("acq.rowActions", { name: row.name })}
          />
        </Dropdown>
      ),
    });
  }

  const confirmCopy = () => {
    if (!pending) return null;
    const noun = t("acq.campaign.noun");
    if (pending.kind === "delete") {
      return {
        title: t("acq.deleteTitle", { noun }),
        body: t("acq.deleteBody", { name: pending.campaign.name }),
        confirmLabel: t("acq.action.delete"),
        danger: true,
      };
    }
    const activating = pending.kind === "activate";
    return {
      title: t(activating ? "acq.activateTitleGeneric" : "acq.deactivateTitleGeneric", { noun }),
      body: t(activating ? "acq.activateBodyGeneric" : "acq.deactivateBodyGeneric", {
        name: pending.campaign.name,
      }),
      confirmLabel: t(activating ? "acq.action.activate" : "acq.action.deactivate"),
      danger: !activating,
    };
  };

  const applyPending = () => {
    if (!pending) return;
    const { kind, campaign } = pending;
    const status: AcquisitionStatus = kind === "deactivate" ? "inactive" : "active";
    if (kind === "delete") setRows((current) => current.filter((row) => row.id !== campaign.id));
    else setRows((current) => current.map((row) => (row.id === campaign.id ? { ...row, status } : row)));
    console.log(`${kind} campaign`, campaign.id);
    message.success(t("acq.saved"));
    setPending(null);
  };

  const saveCampaign = (values: Record<string, unknown>) => {
    const period = fromDayjsRange(values.period);
    if (!period) return;
    const patch = { name: String(values.name), source: String(values.source), period };
    if (editing) {
      setRows((current) => current.map((row) => (row.id === editing.id ? { ...row, ...patch } : row)));
      setEditing(null);
    } else {
      setRows((current) => [{ id: `c${current.length + 1}`, ...patch, status: "active" }, ...current]);
      setCreating(false);
    }
    message.success(t("acq.saved"));
  };

  const copy = confirmCopy();

  const [tableRef, tableWidth] = useMeasuredWidth<HTMLDivElement>();
  const popin = buildPopinTable(columns, tableWidth);

  return (
    <AdminShell
      sections={staffNavFor(viewer.role)}
      activeKey="campaigns"
      userName={name}
      profileTo="/staff/profile"
      onLogout={() => {
        console.log("log out");
        navigate({ to: "/" });
      }}
    >
      <AdminPage
        title={t("acq.campaign.title")}
        subtitle={t("acq.campaign.lead")}
        extra={
          canManage ? (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreating(true)}>
              {t("acq.campaign.new")}
            </Button>
          ) : null
        }
      >
        {canManage ? (
          <Card style={page.tableCard} styles={{ body: page.tableCardBody }}>
            <div ref={tableRef}>
            <Table<Campaign>
              rowKey="id"
              tableLayout="fixed"
              columns={popin.columns}
              dataSource={rows}
              locale={{
                emptyText: (
                  <EmptyState
                    title={t("acq.campaign.empty")}
                    description={t("acq.campaign.emptyHint")}
                    minHeight={TABLE_EMPTY_MIN_HEIGHT}
                  />
                ),
              }}
              pagination={false}
            />
            </div>
          </Card>
        ) : (
          <Card>
            <Result
              icon={<EmptyScene variant="noAccess" scale="page" />}
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

      <AcquisitionEntityModal
        open={creating || editing !== null}
        titleKey={editing ? "acq.campaign.editTitle" : "acq.campaign.newTitle"}
        /*
          THE DATES SIT SECOND, ABOVE THE SOURCE, AND THAT IS A LAYOUT FIX.

          Last in the form, the period field lands 482px down a 768px window —
          an ordinary 1366×768 laptop — leaving 286px under it for a calendar
          that is 345 tall. antd flips the panel upward and it covers the
          dialog's title and the fields above. Shrinking the calendar cannot
          close that gap: measured, reaching 280 needs cells smaller than
          antd's own default.

          Second, the field is ~150px higher and the panel has 434 to open
          into — it drops downward as intended, with room to spare on any
          window over about 680px.

          The order survives the move: a campaign is a name, a span of time,
          and the source it belongs to. Name still opens the form.
        */
        fields={[
          { name: "name", labelKey: "acq.campaign.name", kind: "text" },
          { name: "period", labelKey: "acq.campaign.period", kind: "dateRange" },
          { name: "source", labelKey: "acq.campaign.source", kind: "select", options: sourceOptions },
        ]}
        initialValues={
          editing
            ? { name: editing.name, source: editing.source, period: toDayjsRange(editing.period) }
            : undefined
        }
        onSubmit={saveCampaign}
        onCancel={() => {
          setCreating(false);
          setEditing(null);
        }}
      />

      {copy ? (
        <ConfirmModal
          open
          title={copy.title}
          body={copy.body}
          confirmLabel={copy.confirmLabel}
          danger={copy.danger}
          onConfirm={applyPending}
          onCancel={() => setPending(null)}
        />
      ) : null}

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
