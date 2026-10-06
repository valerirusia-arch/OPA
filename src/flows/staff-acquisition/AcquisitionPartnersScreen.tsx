// src/flows/staff-acquisition/AcquisitionPartnersScreen.tsx
//
// Epic 10 — "Manage Referral Partners and Partner Groups". WBS: the Admin
// "shall be able to create, view, update, and maintain referral partners and
// partner groups used for loan acquisition management", and the comment adds
// "the CRUD partner groups, simple list of supported attributes (up to 5)".
//
// Two related lists, so two tabs on one page rather than two nav entries: a
// partner belongs to a group, and you set the groups up and then attach
// partners to them. Admin only, like every Manage-* story in this epic.
//
// Dumb: two lists in local state, no fetching.

import { useState } from "react";
import { App, Badge, Button, Card, Dropdown, Result, Table, Tabs, Typography, theme } from "antd";
import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "@tanstack/react-router";
import { AdminShell } from "../../shared/ui/AdminShell";
import { AdminPage } from "../../shared/ui/AdminPage";
import { getStyles as getPageStyles } from "../../shared/ui/AdminPage.styles";
import { ConfirmModal } from "../../shared/ui/ConfirmModal";
import { staffNavFor } from "../../shared/ui/navigation";
import { useStaffViewer } from "../../shared/ui/viewerRole";
import { buildPopinTable, useMeasuredWidth } from "../../shared/ui/tableColumns";
import type { PriorityColumn } from "../../shared/ui/tableColumns";
import { useT } from "../../shared/ui/i18n/useT";
import { SessionTimeoutModal } from "../../features/Auth/ui/SessionTimeoutModal";
import { useIdleTimer, DEFAULT_IDLE_MS } from "../../features/Auth/ui/useIdleTimer";
import { AcquisitionEntityModal } from "../../features/Acquisition/ui/AcquisitionEntityModal";
import type {
  AcquisitionStatus,
  PartnerGroup,
  ReferralPartner,
} from "../../features/Acquisition/ui/types";
import { mockGroups, mockReferralPartners } from "./mockPartners";
import { getStyles } from "./AcquisitionSourcesScreen.styles";
import { EmptyScene } from "../../shared/ui/scenes/EmptyScene";

type Entity = "partner" | "group";
type Tab = "partners" | "groups";

/** The confirmation only needs to know which list, which action, and enough to
 *  identify the row and name it — not the whole typed record. */
type Pending = {
  entity: Entity;
  kind: "delete" | "deactivate" | "activate";
  id: string;
  name: string;
} | null;

export type AcquisitionPartnersScreenProps = { viewerName?: string; idleMs?: number };

export default function AcquisitionPartnersScreen({
  viewerName,
  idleMs = DEFAULT_IDLE_MS,
}: AcquisitionPartnersScreenProps) {
  const viewer = useStaffViewer();
  const name = viewerName ?? viewer.name;
  const { message } = App.useApp();
  const navigate = useNavigate();
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);
  const page = getPageStyles(token);
  const { idle, reset: staySignedIn } = useIdleTimer(idleMs);

  const [partners, setPartners] = useState(mockReferralPartners);
  const [groups, setGroups] = useState(mockGroups);
  const [tab, setTab] = useState<Tab>("partners");
  const [creating, setCreating] = useState<Entity | null>(null);
  const [editingPartner, setEditingPartner] = useState<ReferralPartner | null>(null);
  const [editingGroup, setEditingGroup] = useState<PartnerGroup | null>(null);
  const [pending, setPending] = useState<Pending>(null);

  const canManage = viewer.role === "admin";
  const groupOptions = groups.map((group) => ({ label: group.name, value: group.name }));

  const statusCell = (status: AcquisitionStatus) => (
    <Badge
      status={status === "active" ? "success" : "default"}
      text={status === "active" ? t("acq.status.active") : t("acq.status.inactive")}
    />
  );

  const rowMenu = <T extends { id: string; name: string; status: AcquisitionStatus }>(
    entity: Entity,
    record: T,
    onEdit: (record: T) => void,
  ) => ({
    items: [
      { key: "edit", label: t("acq.action.edit"), onClick: () => onEdit(record) },
      {
        key: "status",
        label: record.status === "active" ? t("acq.action.deactivate") : t("acq.action.activate"),
        onClick: () =>
          setPending({
            entity,
            kind: record.status === "active" ? "deactivate" : "activate",
            id: record.id,
            name: record.name,
          }),
      },
      { type: "divider" as const },
      {
        key: "delete",
        danger: true,
        label: t("acq.action.delete"),
        onClick: () => setPending({ entity, kind: "delete", id: record.id, name: record.name }),
      },
    ],
  });

  const actionsColumn = <T extends { id: string; name: string; status: AcquisitionStatus }>(
    entity: Entity,
    onEdit: (record: T) => void,
  ) =>
    canManage
      ? [
          {
            key: "actions",
            width: 72,
            align: "end" as const,
            render: (_value: unknown, row: T) => (
              <Dropdown menu={rowMenu(entity, row, onEdit)} trigger={["click"]} placement="bottomRight">
                <Button
                  type="text"
                  icon={<MoreOutlined style={s.rowActionIcon} />}
                  style={s.rowAction}
                  aria-label={t("acq.rowActions", { name: row.name })}
                />
              </Dropdown>
            ),
          },
        ]
      : [];

  const partnerColumns: PriorityColumn<ReferralPartner>[] = [
    {
      title: t("acq.partner.name"),
      dataIndex: "name",
      width: 280,
      // The identifier — stays on screen at every width.
      priority: "high",
      render: (value: string, row) => (
        <Typography.Text style={row.status === "inactive" ? s.inactiveRow : s.identifier}>
          {value}
        </Typography.Text>
      ),
    },
    {
      title: t("acq.partner.group"),
      dataIndex: "group",
      popinText: (row) => row.group,
      render: (value: string) => <Typography.Text style={s.quiet}>{value}</Typography.Text>,
    },
    {
      title: t("acq.col.status"),
      dataIndex: "status",
      width: 160,
      // The key attribute. Stays with Name at every width.
      priority: "high",
      render: statusCell,
    },
    ...actionsColumn<ReferralPartner>("partner", setEditingPartner),
  ];

  const groupColumns: PriorityColumn<PartnerGroup>[] = [
    {
      title: t("acq.group.name"),
      dataIndex: "name",
      width: 280,
      // The identifier — stays on screen at every width.
      priority: "high",
      render: (value: string, row) => (
        <Typography.Text style={row.status === "inactive" ? s.inactiveRow : s.identifier}>
          {value}
        </Typography.Text>
      ),
    },
    {
      title: t("acq.group.code"),
      dataIndex: "code",
      render: (value: string) => <Typography.Text style={s.code}>{value}</Typography.Text>,
    },
    {
      title: t("acq.col.status"),
      dataIndex: "status",
      width: 160,
      // The key attribute. Stays with Name at every width.
      priority: "high",
      render: statusCell,
    },
    ...actionsColumn<PartnerGroup>("group", setEditingGroup),
  ];

  const confirmCopy = () => {
    if (!pending) return null;
    const noun = pending.entity === "partner" ? t("acq.partner.noun") : t("acq.group.noun");
    if (pending.kind === "delete") {
      return {
        title: t("acq.deleteTitle", { noun }),
        body: t("acq.deleteBody", { name: pending.name }),
        confirmLabel: t("acq.action.delete"),
        danger: true,
      };
    }
    const activating = pending.kind === "activate";
    return {
      title: t(activating ? "acq.activateTitleGeneric" : "acq.deactivateTitleGeneric", { noun }),
      body: t(activating ? "acq.activateBodyGeneric" : "acq.deactivateBodyGeneric", {
        name: pending.name,
      }),
      confirmLabel: t(activating ? "acq.action.activate" : "acq.action.deactivate"),
      danger: !activating,
    };
  };

  const applyPending = () => {
    if (!pending) return;
    const { entity, kind, id } = pending;
    const status: AcquisitionStatus = kind === "deactivate" ? "inactive" : "active";
    if (entity === "partner") {
      if (kind === "delete") setPartners((rows) => rows.filter((row) => row.id !== id));
      else setPartners((rows) => rows.map((row) => (row.id === id ? { ...row, status } : row)));
    } else {
      if (kind === "delete") setGroups((rows) => rows.filter((row) => row.id !== id));
      else setGroups((rows) => rows.map((row) => (row.id === id ? { ...row, status } : row)));
    }
    console.log(`${kind} ${entity}`, id);
    message.success(t("acq.saved"));
    setPending(null);
  };

  const savePartner = (values: Record<string, unknown>) => {
    const patch = { name: String(values.name), group: String(values.group) };
    if (editingPartner) {
      setPartners((rows) => rows.map((row) => (row.id === editingPartner.id ? { ...row, ...patch } : row)));
      setEditingPartner(null);
    } else {
      setPartners((rows) => [{ id: `p${rows.length + 1}`, ...patch, status: "active" }, ...rows]);
      setCreating(null);
    }
    message.success(t("acq.saved"));
  };

  const saveGroup = (values: Record<string, unknown>) => {
    const patch = { name: String(values.name), code: String(values.code) };
    if (editingGroup) {
      setGroups((rows) => rows.map((row) => (row.id === editingGroup.id ? { ...row, ...patch } : row)));
      setEditingGroup(null);
    } else {
      setGroups((rows) => [{ id: `g${rows.length + 1}`, ...patch, status: "active" }, ...rows]);
      setCreating(null);
    }
    message.success(t("acq.saved"));
  };

  const copy = confirmCopy();

  const [partnersTableRef, partnersTableWidth] = useMeasuredWidth<HTMLDivElement>();
  const partnersPopin = buildPopinTable(partnerColumns, partnersTableWidth);
  const [groupsTableRef, groupsTableWidth] = useMeasuredWidth<HTMLDivElement>();
  const groupsPopin = buildPopinTable(groupColumns, groupsTableWidth);

  /* Tabs sit ATOP the flush table card, the payments page's pattern: the tab
     bar takes the card's inset and the table runs to the frame under it. */
  const tabs = (
    <Card style={page.tableCard} styles={{ body: page.tableCardBody }}>
      <Tabs
        activeKey={tab}
        onChange={(key) => setTab(key as Tab)}
        tabBarStyle={s.tabBar}
        items={[
          {
            key: "partners",
            label: t("acq.partners.tabPartners"),
            children: (
              <div ref={partnersTableRef}>
              <Table<ReferralPartner>
                rowKey="id"
                tableLayout="fixed"
                columns={partnersPopin.columns}
                dataSource={partners}
                pagination={false}
              />
              </div>
            ),
          },
          {
            key: "groups",
            label: t("acq.partners.tabGroups"),
            children: (
              <div ref={groupsTableRef}>
              <Table<PartnerGroup>
                rowKey="id"
                tableLayout="fixed"
                columns={groupsPopin.columns}
                dataSource={groups}
                pagination={false}
              />
              </div>
            ),
          },
        ]}
      />
    </Card>
  );

  return (
    <AdminShell
      sections={staffNavFor(viewer.role)}
      activeKey="partners"
      userName={name}
      profileTo="/staff/profile"
      onLogout={() => {
        console.log("log out");
        navigate({ to: "/" });
      }}
    >
      <AdminPage
        title={t("acq.partners.title")}
        extra={
          canManage ? (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreating(tab === "partners" ? "partner" : "group")}
            >
              {t(tab === "partners" ? "acq.partner.new" : "acq.group.new")}
            </Button>
          ) : null
        }
      >
        {canManage ? (
          tabs
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

      {/* Partner create/edit */}
      <AcquisitionEntityModal
        open={creating === "partner" || editingPartner !== null}
        titleKey={editingPartner ? "acq.partner.editTitle" : "acq.partner.newTitle"}
        fields={[
          { name: "name", labelKey: "acq.partner.name", kind: "text" },
          { name: "group", labelKey: "acq.partner.group", kind: "select", options: groupOptions },
        ]}
        initialValues={
          editingPartner ? { name: editingPartner.name, group: editingPartner.group } : undefined
        }
        onSubmit={savePartner}
        onCancel={() => {
          setCreating(null);
          setEditingPartner(null);
        }}
      />

      {/* Group create/edit */}
      <AcquisitionEntityModal
        open={creating === "group" || editingGroup !== null}
        titleKey={editingGroup ? "acq.group.editTitle" : "acq.group.newTitle"}
        fields={[
          { name: "name", labelKey: "acq.group.name", kind: "text" },
          { name: "code", labelKey: "acq.group.code", kind: "text" },
        ]}
        initialValues={editingGroup ? { name: editingGroup.name, code: editingGroup.code } : undefined}
        onSubmit={saveGroup}
        onCancel={() => {
          setCreating(null);
          setEditingGroup(null);
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
