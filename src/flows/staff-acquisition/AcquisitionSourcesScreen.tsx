// src/flows/staff-acquisition/AcquisitionSourcesScreen.tsx
//
// Epic 10 — "Manage Acquisition Sources". WBS: the Admin "shall be able to
// create, view, update, and maintain acquisition sources used to classify and
// track loan acquisition", with the simple attribute set name / partner / code
// / status and an active-inactive lifecycle.
//
// Admin only. Every Manage-* story in this epic names the Admin and no one
// else, so a non-admin who reaches the route is shown the same 403 state the
// Users screen uses rather than a redirect (the real guard is Dev's, in /app).
//
// The same list + New + row-menu shape as the Users screen, because it is the
// same job: a simple maintained list. Dumb: rows in local state, no fetching.

import { useState } from "react";
import { App, Badge, Button, Card, Dropdown, Result, Table, Typography, theme } from "antd";
import type { ColumnsType } from "antd/es/table";
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
import { decorateColumns } from "../../shared/ui/tableColumns";
import { useT } from "../../shared/ui/i18n/useT";
import { SessionTimeoutModal } from "../../features/Auth/ui/SessionTimeoutModal";
import { useIdleTimer, DEFAULT_IDLE_MS } from "../../features/Auth/ui/useIdleTimer";
import {
  AcquisitionSourceModal,
  type AcquisitionSourceValues,
} from "../../features/Acquisition/ui/AcquisitionSourceModal";
import type { AcquisitionSource, AcquisitionStatus } from "../../features/Acquisition/ui/types";
import { mockPartners, mockSources } from "./mockSources";
import { getStyles } from "./AcquisitionSourcesScreen.styles";
import { EmptyScene } from "../../shared/ui/empty/EmptyScene";

export type AcquisitionSourcesScreenProps = {
  sources?: AcquisitionSource[];
  viewerName?: string;
  idleMs?: number;
};

type Pending = { kind: "delete" | "deactivate" | "activate"; source: AcquisitionSource } | null;

export default function AcquisitionSourcesScreen({
  sources = mockSources,
  viewerName,
  idleMs = DEFAULT_IDLE_MS,
}: AcquisitionSourcesScreenProps) {
  const viewer = useStaffViewer();
  const name = viewerName ?? viewer.name;
  const { message } = App.useApp();
  const navigate = useNavigate();
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);
  const page = getPageStyles(token);
  const { idle, reset: staySignedIn } = useIdleTimer(idleMs);

  const [rows, setRows] = useState(sources);
  const [editing, setEditing] = useState<AcquisitionSource | null>(null);
  const [creating, setCreating] = useState(false);
  const [pending, setPending] = useState<Pending>(null);

  // WBS: every "Manage" story in this epic is the Admin's alone.
  const canManage = viewer.role === "admin";

  const partnerOptions = mockPartners.map((partner) => ({ label: partner, value: partner }));

  const rowMenu = (source: AcquisitionSource) => ({
    items: [
      { key: "edit", label: t("acq.action.edit"), onClick: () => setEditing(source) },
      {
        key: "status",
        label: source.status === "active" ? t("acq.action.deactivate") : t("acq.action.activate"),
        onClick: () =>
          setPending({ kind: source.status === "active" ? "deactivate" : "activate", source }),
      },
      { type: "divider" as const },
      { key: "delete", danger: true, label: t("acq.action.delete"), onClick: () => setPending({ kind: "delete", source }) },
    ],
  });

  const columns: ColumnsType<AcquisitionSource> = [
    {
      title: t("acq.source.name"),
      dataIndex: "name",
      width: 240,
      render: (value: string, row) => (
        <Typography.Text style={row.status === "inactive" ? s.inactiveRow : undefined}>
          {value}
        </Typography.Text>
      ),
    },
    {
      title: t("acq.source.partner"),
      dataIndex: "partner",
      render: (value: string) => <Typography.Text style={s.quiet}>{value}</Typography.Text>,
    },
    {
      title: t("acq.source.code"),
      dataIndex: "code",
      width: 200,
      render: (value: string) => <Typography.Text style={s.code}>{value}</Typography.Text>,
    },
    {
      title: t("acq.col.status"),
      dataIndex: "status",
      width: 160,
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
    if (pending.kind === "delete") {
      return {
        title: t("acq.source.deleteTitle"),
        body: t("acq.source.deleteBody", { name: pending.source.name }),
        confirmLabel: t("acq.action.delete"),
        danger: true,
      };
    }
    if (pending.kind === "deactivate") {
      return {
        title: t("acq.deactivateTitle"),
        body: t("acq.deactivateBody", { name: pending.source.name }),
        confirmLabel: t("acq.action.deactivate"),
        danger: true,
      };
    }
    return {
      title: t("acq.activateTitle"),
      body: t("acq.activateBody", { name: pending.source.name }),
      confirmLabel: t("acq.action.activate"),
      danger: false,
    };
  };

  const applyPending = () => {
    if (!pending) return;
    const { kind, source } = pending;
    if (kind === "delete") {
      console.log("delete acquisition source", source.id);
      setRows((current) => current.filter((row) => row.id !== source.id));
      message.success(t("acq.source.deleted"));
    } else {
      const status: AcquisitionStatus = kind === "deactivate" ? "inactive" : "active";
      console.log(`${kind} acquisition source`, source.id);
      setRows((current) => current.map((row) => (row.id === source.id ? { ...row, status } : row)));
      message.success(t(kind === "deactivate" ? "acq.deactivated" : "acq.activated", { name: source.name }));
    }
    setPending(null);
  };

  const saveSource = (values: AcquisitionSourceValues) => {
    if (editing) {
      console.log("update acquisition source", editing.id, values);
      setRows((current) => current.map((row) => (row.id === editing.id ? { ...row, ...values } : row)));
      message.success(t("acq.source.updated"));
      setEditing(null);
      return;
    }
    console.log("create acquisition source", values);
    setRows((current) => [
      { id: `s${current.length + 1}`, ...values, status: "active" },
      ...current,
    ]);
    message.success(t("acq.source.created"));
    setCreating(false);
  };

  const copy = confirmCopy();

  return (
    <AdminShell
      sections={staffNavFor(viewer.role)}
      activeKey="source"
      userName={name}
      profileTo="/staff/profile"
      onLogout={() => {
        console.log("log out");
        navigate({ to: "/" });
      }}
    >
      <AdminPage
        title={t("acq.source.title")}
        subtitle={t("acq.source.lead")}
        extra={
          canManage ? (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreating(true)}>
              {t("acq.source.new")}
            </Button>
          ) : null
        }
      >
        {canManage ? (
          <Card style={page.tableCard} styles={{ body: page.tableCardBody }}>
            <Table<AcquisitionSource>
              rowKey="id"
              tableLayout="fixed"
              scroll={{ x: 860 }}
              columns={decorateColumns(columns)}
              dataSource={rows}
              locale={{
                emptyText: (
                  <EmptyState
                    title={t("acq.source.empty")}
                    description={t("acq.source.emptyHint")}
                    minHeight={TABLE_EMPTY_MIN_HEIGHT}
                  />
                ),
              }}
              pagination={false}
            />
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

      <AcquisitionSourceModal
        open={creating || editing !== null}
        mode={editing ? "edit" : "create"}
        partnerOptions={partnerOptions}
        initialValues={
          editing ? { name: editing.name, partner: editing.partner, code: editing.code } : undefined
        }
        onSubmit={saveSource}
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
