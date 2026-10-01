// src/flows/staff-users/StaffUsersScreen.tsx
//
// Epic 2 — Users management, the internal-accounts side.
//
// Every WBS story on this screen, in the order the document gives them:
//   1. Admin — create, change, delete admin/underwriter  → New user, Edit, Delete
//   3. Admin / OPA Staff — view admin/underwriter        → the list + search
//   8. Admin / Underwriter — send/resend set-password link → row action
//   9. Admin — activate/inactivate a user's account      → row action
//
// The WBS gives "view" to Admin and OPA Staff, and every action to the Admin.
// So OPA Staff sees the same list with no New user button and no row menu —
// that is the whole difference, and it is a prop, not a second screen.
//
// Dumb: the rows are mock data held in local state so the prototype actually
// responds. Nothing is fetched, nothing is persisted.

import { useMemo, useState } from "react";
import {
  App,
  Button,
  Card,
  Dropdown,
  Input,
  Result,
  Table,
  Tag,
  Typography,
  theme,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { MoreOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "@tanstack/react-router";
import { AdminShell } from "../../shared/ui/AdminShell";
import { AdminPage } from "../../shared/ui/AdminPage";
import { getStyles as getPageStyles } from "../../shared/ui/AdminPage.styles";
import { ConfirmModal } from "../../shared/ui/ConfirmModal";
import { EmptyState } from "../../shared/ui/EmptyState";
import { TABLE_EMPTY_MIN_HEIGHT } from "../../shared/ui/EmptyState.styles";
import { staffNavFor } from "../../shared/ui/navigation";
import { useStaffViewer, type StaffRole } from "../../shared/ui/viewerRole";
import { decorateColumns } from "../../shared/ui/tableColumns";
import { useT } from "../../shared/ui/i18n/useT";
import { labelTag } from "../../shared/ui/tag.styles";
import { StatusPill } from "../../shared/ui/StatusPill";
import { SessionTimeoutModal } from "../../features/Auth/ui/SessionTimeoutModal";
import {
  useIdleTimer,
  DEFAULT_IDLE_MS,
} from "../../features/Auth/ui/useIdleTimer";
import {
  UserFormModal,
  type UserFormValues,
} from "../../features/Users/ui/UserFormModal";
import {
  useRoleLabel,
  type PasswordState,
  type UserRole,
  type UserStatus,
} from "../../features/Users/ui/roles";
import { getStyles, styles } from "./StaffUsersScreen.styles";
import { EmptyScene } from "../../shared/ui/empty/EmptyScene";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  password: PasswordState;
};

export type StaffUsersScreenProps = {
  users?: UserRow[];
  /** Omitted, it follows the DevBar's "view as" switch. */
  viewerRole?: StaffRole;
  viewerName?: string;
  idleMs?: number;
};

const mockUsers: UserRow[] = [
  {
    id: "u1",
    name: "Alex Goldbarg",
    email: "alex.goldbarg@opa.example",
    role: "admin",
    status: "active",
    password: "pending",
  },
  {
    id: "u2",
    name: "Priya Raman",
    email: "priya.raman@opa.example",
    role: "underwriter",
    status: "active",
    password: "set",
  },
  {
    id: "u3",
    name: "Devon Marsh",
    email: "devon.marsh@opa.example",
    role: "staff",
    status: "inactive",
    password: "set",
  },
  {
    id: "u4",
    name: "Sofía Herrera",
    email: "sofia.herrera@opa.example",
    role: "underwriter",
    status: "active",
    password: "set",
  },
  {
    id: "u5",
    name: "Toby Whitfield",
    email: "toby.whitfield@opa.example",
    role: "staff",
    status: "inactive",
    password: "set",
  },
  {
    id: "u6",
    name: "Nadia Okonkwo",
    email: "nadia.okonkwo@opa.example",
    role: "underwriter",
    status: "active",
    password: "set",
  },
  {
    id: "u7",
    name: "Marcus Lee",
    email: "marcus.lee@opa.example",
    role: "admin",
    status: "active",
    password: "set",
  },
  {
    id: "u8",
    name: "Elena Vasquez",
    email: "elena.vasquez@opa.example",
    role: "underwriter",
    status: "active",
    password: "pending",
  },
];

/** Which confirmation is open, and about whom. */
type Pending = {
  kind: "delete" | "deactivate" | "activate";
  user: UserRow;
} | null;

export default function StaffUsersScreen({
  users = mockUsers,
  viewerRole,
  viewerName,
  idleMs = DEFAULT_IDLE_MS,
}: StaffUsersScreenProps) {
  const viewer = useStaffViewer();
  const role = viewerRole ?? viewer.role;
  const name = viewerName ?? viewer.name;
  const { message } = App.useApp();
  const navigate = useNavigate();
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);
  const page = getPageStyles(token);
  const roleLabel = useRoleLabel();
  const { idle, reset: staySignedIn } = useIdleTimer(idleMs);

  const [rows, setRows] = useState(users);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<UserRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [pending, setPending] = useState<Pending>(null);

  // WBS story 1 and 9 are the Admin's; story 3 gives OPA Staff the list to
  // read. An Underwriter is on neither list, so this page is not theirs.
  const canManage = role === "admin";
  const canView = role !== "underwriter";

  // WBS: "a simple list of users is assumed + search by name/email".
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter(
      (row) =>
        row.name.toLowerCase().includes(needle) ||
        row.email.toLowerCase().includes(needle),
    );
  }, [rows, query]);

  const rowMenu = (user: UserRow) => ({
    items: [
      {
        key: "link",
        label:
          user.password === "pending"
            ? t("users.action.sendLink")
            : t("users.action.resendLink"),
        onClick: () => {
          console.log("send set-password link", user.email);
          message.success(t("users.linkSent"));
        },
      },
      {
        key: "edit",
        label: t("users.action.edit"),
        onClick: () => setEditing(user),
      },
      {
        key: "status",
        label:
          user.status === "active"
            ? t("users.action.deactivate")
            : t("users.action.activate"),
        onClick: () =>
          setPending({
            kind: user.status === "active" ? "deactivate" : "activate",
            user,
          }),
      },
      { type: "divider" as const },
      {
        key: "delete",
        danger: true,
        label: t("users.action.delete"),
        onClick: () => setPending({ kind: "delete", user }),
      },
    ],
  });

  const columns: ColumnsType<UserRow> = [
    {
      title: t("users.col.name"),
      dataIndex: "name",
      // Name and email were taking half the table each while role, status and
      // password crowded together on the right. Everything but email is now
      // sized to its content plus an even gap; email keeps the slack.
      width: 220,
      render: (name: string, row) => (
        <Typography.Text
          style={row.status === "inactive" ? s.inactiveRow : undefined}
        >
          {name}
        </Typography.Text>
      ),
    },
    {
      title: t("users.col.email"),
      dataIndex: "email",
      render: (email: string) => (
        <Typography.Text style={s.quiet} ellipsis={{ tooltip: email }}>
          {email}
        </Typography.Text>
      ),
    },
    {
      title: t("users.col.role"),
      dataIndex: "role",
      width: 190,
      /* A role is a LABEL, not a status — a value from a closed set, with no
         state to it — so it keeps the plain tag and takes the product's
         neutral label treatment rather than antd's cream default. */
      render: (role: UserRole) => (
        <Tag variant="filled" style={labelTag(token)}>
          {roleLabel(role)}
        </Tag>
      ),
    },
    {
      title: t("users.col.status"),
      dataIndex: "status",
      width: 180,
      /*
        THE PRODUCT'S STATUS PILL, and it was an antd Badge.
        
        The Badge was chosen so a column of bare dots would scan — which it
        does — but it left this table drawing statuses two ways: a dot-and-word
        here and a pill in the column beside it. A status has one appearance in
        this product. The dot survives; it is what StatusPill is built around.
      */
      render: (status: UserStatus) => (
        <StatusPill color={status === "active" ? "success" : undefined}>
          {status === "active"
            ? t("users.status.active")
            : t("users.status.inactive")}
        </StatusPill>
      ),
    },
    {
      title: t("users.col.password"),
      dataIndex: "password",
      width: 180,
      // "Set" is the ordinary case and stays quiet; only "Pending" is news —
      // it is the one row an Admin may still need to chase.
      render: (state: PasswordState) =>
        state === "pending" ? (
          /* Waiting on somebody is a STATE, so it is the product's status
             pill — with the dot and the hairline every other status on every
             other screen wears, instead of a bare amber lozenge. */
          <StatusPill color="warning">
            {t("users.password.pending")}
          </StatusPill>
        ) : (
          <Typography.Text style={s.quiet}>
            {t("users.password.set")}
          </Typography.Text>
        ),
    },
  ];

  if (canManage) {
    columns.push({
      key: "actions",
      // The 48px menu button plus the table's 24px outer inset.
      width: 72,
      align: "end",
      render: (_value, row) => (
        <Dropdown
          menu={rowMenu(row)}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button
            type="text"
            icon={<MoreOutlined style={s.rowActionIcon} />}
            style={s.rowAction}
            aria-label={t("users.rowActions", { name: row.name })}
          />
        </Dropdown>
      ),
    });
  }

  const confirmCopy = () => {
    if (!pending) return null;
    if (pending.kind === "delete") {
      return {
        title: t("users.deleteTitle"),
        body: t("users.deleteBody", { name: pending.user.name }),
        confirmLabel: t("users.action.delete"),
        danger: true,
      };
    }
    if (pending.kind === "deactivate") {
      return {
        title: t("users.deactivateTitle"),
        body: t("users.deactivateBody", { name: pending.user.name }),
        confirmLabel: t("users.action.deactivate"),
        danger: true,
      };
    }
    return {
      title: t("users.activateTitle"),
      body: t("users.activateBody", { name: pending.user.name }),
      confirmLabel: t("users.action.activate"),
      danger: false,
    };
  };

  const applyPending = () => {
    if (!pending) return;
    const { kind, user } = pending;
    if (kind === "delete") {
      console.log("delete user", user.id);
      setRows((current) => current.filter((row) => row.id !== user.id));
      message.success(t("users.deleted"));
    } else {
      const status: UserStatus = kind === "deactivate" ? "inactive" : "active";
      console.log(`${kind} user`, user.id);
      setRows((current) =>
        current.map((row) => (row.id === user.id ? { ...row, status } : row)),
      );
      message.success(
        t(kind === "deactivate" ? "users.deactivated" : "users.activated", {
          name: user.name,
        }),
      );
    }
    setPending(null);
  };

  const saveUser = (values: UserFormValues) => {
    if (editing) {
      // The last-admin guard is enforced in the form itself, under the Role
      // field (see UserFormModal's `isLastAdmin`), so a demotion never reaches
      // here — the modal will not submit while that error stands.
      console.log("update user", editing.id, values);
      setRows((current) =>
        current.map((row) =>
          row.id === editing.id ? { ...row, ...values } : row,
        ),
      );
      message.success(t("users.updated"));
      setEditing(null);
      return;
    }
    console.log("create user + send set-password email", values);
    setRows((current) => [
      {
        id: `u${current.length + 1}`,
        ...values,
        status: "active",
        password: "pending",
      },
      ...current,
    ]);
    message.success(t("users.created"));
    setCreating(false);
  };

  const copy = confirmCopy();

  return (
    <AdminShell
      sections={staffNavFor(role)}
      activeKey="users"
      userName={name}
      profileTo="/staff/profile"
      onLogout={() => {
        console.log("log out");
        navigate({ to: "/" });
      }}
    >
      <AdminPage
        title={t("users.title")}
        extra={
          canView ? (
            <>
              <Input
                allowClear
                prefix={<SearchOutlined />}
                placeholder={t("users.searchPlaceholder")}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                style={styles.search}
              />
              {canManage ? (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setCreating(true)}
                >
                  {t("users.new")}
                </Button>
              ) : null}
            </>
          ) : null
        }
      >
        {!canView ? (
          // Presentation of a state, not a guard: nothing redirects, the page
          // simply says what this role is allowed to see. The real restriction
          // is a route guard, and that is Dev's, in /app.
          <Card>
            <Result
              icon={<EmptyScene variant="noAccess" scale="page" />}
              title={t("access.deniedTitle")}
              subTitle={t("access.deniedDescription")}
              extra={
                <Button
                  type="primary"
                  onClick={() => navigate({ to: "/staff/borrowers" })}
                >
                  {t("access.goToBorrowers")}
                </Button>
              }
            />
          </Card>
        ) : (
          <Card style={page.tableCard} styles={{ body: page.tableCardBody }}>
            <Table<UserRow>
              rowKey="id"
              // Fixed, so the column widths above are honoured: with the
              // default auto layout a truncated cell lets its column collapse
              // and the neighbours take the room.
              tableLayout="fixed"
              // Name/role/status/password/actions are fixed at 842px plus a
              // flexible email column; scroll horizontally on a narrow screen
              // rather than crushing email to nothing.
              scroll={{ x: 1060 }}
              columns={decorateColumns(columns)}
              dataSource={visible}
              locale={{
                emptyText: (
                  <EmptyState
                    variant="notFound"
                    title={t("users.empty")}
                    description={t("users.emptyHint")}
                    minHeight={TABLE_EMPTY_MIN_HEIGHT}
                  />
                ),
              }}
              pagination={{
                pageSize: 6,
                hideOnSinglePage: true,
                showSizeChanger: false,
                style: page.pagination,
              }}
            />
          </Card>
        )}
      </AdminPage>

      <UserFormModal
        open={creating || editing !== null}
        mode={editing ? "edit" : "create"}
        initialValues={
          editing
            ? { name: editing.name, email: editing.email, role: editing.role }
            : undefined
        }
        /* True only while editing the sole remaining admin — the Role field
           then refuses to move off "admin" and says why under itself. */
        isLastAdmin={
          editing?.role === "admin" &&
          rows.filter((row) => row.role === "admin").length === 1
        }
        onSubmit={saveUser}
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
