// src/flows/staff-applications/StaffApplicationsScreen.tsx
//
// Epic 4, WBS "Route application for manual review" — "The system shall route
// applications requiring manual review to the underwriting queue."
//
// This is that queue. The nav has carried a "Review queue" entry with a count
// on it since Epic 2 and it went nowhere; this is where it goes.
//
// WHAT THE COLUMNS ARE, and why:
//   Application, Applicant, USCIS service, Amount and Submitted come from
//   "View application details", which lists what an internal user must be able
//   to see.
//   FLAGGED BY is this list's own column, from "Applications may be routed to
//   manual review from any automated verification step". Somebody working a
//   queue needs to know why a row is in front of them before they open it, and
//   it is what makes "work through everything the credit check stopped" a way
//   to spend an afternoon.
//
// WHAT IS DELIBERATELY ABSENT, and each for a reason:
//
//   An ASSIGNEE. "Any underwriter can review any application", and the WBS's
//   own note is "Assuming that there is no process of assigning underwriter to
//   the application in this phase". A column for it would invent a workflow.
//
//   SEARCH AND FILTERS. They were here and have been removed. There is no
//   story for them: Manage Loan's borrower list has an explicit "Search and
//   filter borrowers/co-borrowers" story with its own hours, and this queue
//   has only "Route application for manual review" — costed at 1-2 UI/UX
//   hours, i.e. a table. The wireframe draws a table. Inventing a filter bar
//   here also invents the vocabulary it filters by.
//
//   STATUS and SUBMITTED columns. Also removed. Every row here is an
//   application waiting on a person, so a status column is almost a constant,
//   and the wireframe carries neither. The status is on the record itself,
//   which is where "View application details" puts it.
//
// The columns that remain are the wireframe's: name, what routed it here, the
// amount, the income and the USCIS type, then a way in.
//
// The list is the same for every internal role — Admin, Underwriter and OPA
// Staff all see it. What differs is what they can do once they open a record,
// which is the detail screen's business.
//
// ONE CONTROL HERE BELONGS TO ANOTHER EPIC: Export. See `canExport` below —
// Reporting & Audit owns the story, and its role list does not match this
// page's.
//
// Dumb: mock rows, no fetching.

import { App, Button, Card, Dropdown, Result, Table, Typography, theme } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DownloadOutlined } from "@ant-design/icons";
import { useNavigate } from "@tanstack/react-router";
import { AdminShell } from "../../shared/ui/AdminShell";
import { AdminPage } from "../../shared/ui/AdminPage";
import { getStyles as getPageStyles } from "../../shared/ui/AdminPage.styles";
import { EmptyState } from "../../shared/ui/EmptyState";
import { TABLE_EMPTY_MIN_HEIGHT } from "../../shared/ui/EmptyState.styles";
import { staffNavFor } from "../../shared/ui/navigation";
import { useStaffViewer } from "../../shared/ui/viewerRole";
import { decorateColumns, TABLE_NAME_WIDTH } from "../../shared/ui/tableColumns";
import { NameCell } from "../../shared/ui/NameCell";
import { StatusPill } from "../../shared/ui/StatusPill";
import { useT } from "../../shared/ui/i18n/useT";
import { SessionTimeoutModal } from "../../features/Auth/ui/SessionTimeoutModal";
import { useIdleTimer, DEFAULT_IDLE_MS } from "../../features/Auth/ui/useIdleTimer";
import { CheckNameTag } from "../../features/Applications/ui/CheckTags";
import { awaitsReview } from "../../features/Applications/ui/checks";
import type { ApplicationRecord } from "../../features/Applications/ui/types";
import { mockApplications } from "./mockApplications";
import { getStyles, styles } from "./StaffApplicationsScreen.styles";
import { EmptyScene } from "../../shared/ui/scenes/EmptyScene";

const money = (amount: number) =>
  `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

export type StaffApplicationsScreenProps = {
  applications?: ApplicationRecord[];
  viewerName?: string;
  idleMs?: number;
};

export default function StaffApplicationsScreen({
  applications = mockApplications,
  viewerName,
  idleMs = DEFAULT_IDLE_MS,
}: StaffApplicationsScreenProps) {
  const viewer = useStaffViewer();
  const { message } = App.useApp();
  const name = viewerName ?? viewer.name;
  const navigate = useNavigate();
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);
  const page = getPageStyles(token);
  const { idle, reset: staySignedIn } = useIdleTimer(idleMs);

  /**
   * WBS: Loan Decisioning names "Underwriter / OPA Staff" on "View application
   * details" and nobody else. An Admin is not named on any story in the epic,
   * so they are not shown one.
   *
   * A state, not a guard: nothing redirects. The real restriction is a route
   * guard, and that is Dev's, in /app. Same reading, and the same 403 card,
   * that keeps an Underwriter off the Users page.
   */
  const canView = viewer.role !== "admin";

  /**
   * Exporting the queue. NOT this epic.
   *
   * **Reporting & Audit** has the story: "Export application data — Export
   * list of applications in xlsx/csv", and its role column is **Admin / OPA
   * Staff**. Two things follow, and the second is a question for OPA:
   *
   *   The UNDERWRITER is not on that story, so the person who works this queue
   *   every day cannot export it while an OPA Staff member can. That is what
   *   the WBS says; it may not be what OPA meant.
   *
   *   The ADMIN is on that story and, per Loan Decisioning, has no access to
   *   this queue at all — the WBS names them on not one story in that epic. So
   *   their export cannot live here. It belongs on the Reporting screen, which
   *   is that epic's to build.
   *
   * Which leaves OPA Staff as the only role who can both reach this page and
   * export from it.
   */
  const canExport = viewer.role === "staff";


  /**
   * The rows: what still needs an underwriter, and nothing else.
   *
   * "The system shall route applications REQUIRING MANUAL REVIEW to the
   * underwriting queue" — so the queue IS the filter, and an application the
   * rules already decided is not in it. Listing every application put two
   * settled ones here with a dash in the Source column, which is the column
   * that names which step routed a row: nothing had. They stay reachable from
   * the dashboard's recent list, which is where an override starts.
   */
  const visible = applications.filter(awaitsReview);

  const columns: ColumnsType<ApplicationRecord> = [
    {
      /* The wireframe's NAME. The application's id goes underneath rather than
         into a column of its own: it is what support is asked for, not what an
         underwriter picks a row by. */
      title: t("queue.col.name"),
      key: "name",
      /* CAPPED, and it was the flexible column.
         With `tableLayout="fixed"` the one column without a width absorbs
         every spare pixel, so on a wide screen the name sat in a 600px cell
         and an empty half-column opened between the applicant and the step
         that flagged them — the row stopped reading as a row. 260 fits the
         longest name over its id; the slack moves to the USCIS service, which
         was the column actually short of room. *"როუები ცოტა მარცხნივ
         გამოიწიე."* */
      width: TABLE_NAME_WIDTH,
      render: (_value, row) => (
        <NameCell
          name={row.borrower.name}
          to={`/staff/applications/${row.id}`}
          /* A second applicant is twice the work, and worth knowing before you
             open it. */
          meta={`${row.id}${row.coBorrower ? ` · ${t("queue.coBorrowerTag")}` : ""}`}
        />
      ),
    },
    {
      /* The wireframe's SOURCE: which automated step sent it here. WBS —
         "Applications may be routed to manual review from any automated
         verification step (Identity Verification, Income Verification, Credit
         Check or Business Rule Evaluation)." */
      title: t("queue.col.source"),
      key: "source",
      width: 190,
      /* An application the system decided automatically shows its decision here
         instead of a routing step — it was not routed by a check, it was decided
         and is waiting for a human to confirm or override it. This is also what
         keeps the column from showing a dash on those rows. */
      render: (_value, row) =>
        row.decision?.source === "automated" ? (
          <StatusPill color={row.decision.outcome === "approved" ? "success" : "error"}>
            {t(
              row.decision.outcome === "approved"
                ? "queue.autoApproved"
                : "queue.autoDeclined"
            )}
          </StatusPill>
        ) : (
          <Typography.Text style={s.routedBy}>
            <CheckNameTag check={row.routedBy} />
          </Typography.Text>
        ),
    },
    {
      title: t("queue.col.amount"),
      key: "amount",
      width: 130,
      align: "end",
      render: (_value, row) => (
        <Typography.Text style={styles.amount}>
          {money(row.approvedAmount ?? row.requestedAmount)}
        </Typography.Text>
      ),
    },
    {
      /* The wireframe's INCOME. WBS runs income as its own check and weighs it
         in "Determine loan eligibility", so it belongs beside the amount: the
         two together are what the decision turns on. */
      title: t("queue.col.income"),
      key: "income",
      width: 130,
      align: "end",
      render: (_value, row) => (
        <Typography.Text type="secondary">{money(row.annualIncome)}</Typography.Text>
      ),
    },
    {
      title: t("queue.col.uscis"),
      key: "uscis",
      /* THE FLEXIBLE COLUMN NOW. "I-485 · Adjust Status / Register Permanent
         Residence" is the longest value in the table and it was the one being
         truncated, while the name column held the air. */
      render: (_value, row) => (
        <Typography.Text ellipsis={{ tooltip: row.uscisType }}>
          {row.uscisType}
        </Typography.Text>
      ),
    },
  ];

  return (
    <AdminShell
      sections={staffNavFor(viewer.role)}
      activeKey="review-queue"
      userName={name}
      profileTo="/staff/profile"
      onLogout={() => {
        console.log("log out");
        navigate({ to: "/" });
      }}
    >
      <AdminPage
        title={t("queue.title")}
        extra={
          canView ? (
          <>
            {canExport ? (
              <Dropdown
                trigger={["click"]}
                placement="bottomRight"
                menu={{
                  items: [
                    { key: "xlsx", label: t("queue.exportXlsx") },
                    { key: "csv", label: t("queue.exportCsv") },
                  ],
                  onClick: ({ key }) => {
                    console.log("export applications", { format: key, rows: visible.length });
                    message.success(t("queue.exported", { count: String(visible.length) }));
                  },
                }}
              >
                <Button icon={<DownloadOutlined />}>{t("queue.export")}</Button>
              </Dropdown>
            ) : null}
          </>
          ) : null
        }
      >
        {canView ? (
        <Card style={page.tableCard} styles={{ body: page.tableCardBody }}>
          <Table<ApplicationRecord>
            rowKey="id"
            tableLayout="fixed"
            // Four fixed columns at 710px plus the flexible USCIS service; on a
            // narrow screen that column would collapse to nothing, so the table
            // scrolls horizontally below ~980px and every column keeps its
            // width.
            scroll={{ x: 980 }}
            columns={decorateColumns(columns)}
            dataSource={visible}
            // The whole row opens the application; the id stays a real link so
            // the row is reachable by keyboard and can be opened in a new tab.
            onRow={(row) => ({
              style: styles.row,
              onClick: (event) => {
                if ((event.target as HTMLElement).closest("a")) return;
                navigate({ to: `/staff/applications/${row.id}` });
              },
            })}
            locale={{
              emptyText: (
                <EmptyState
                  variant="notFound"
                  title={t("queue.empty")}
                  description={t("queue.emptyBody")}
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
              <Button
                type="primary"
                onClick={() => navigate({ to: "/staff/borrowers" })}
              >
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
