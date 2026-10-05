// src/flows/staff-borrowers/StaffBorrowersScreen.tsx
//
// Epic 2 — "View the list of borrower/co-borrowers" and "Search and filter
// borrowers/co-borrowers".
//
// The WBS names the columns: "name, email, phone number, address, state,
// application status (in progress/approved/declined)", and caps the table at
// eight. Seven are used — the seventh is the DO NOT LOAN marker, which story 10
// asks to be "a visible ui element" with "an ability to filter the list based
// on this marker". That is the third filter.
//
// Search covers name, email AND phone, because that is what the WBS says here
// (the internal-users list is the one that searches name/email only).
//
// The list is the same for every internal role — Admin, Underwriter and OPA
// Staff all see it. What differs is what they can do once they open a record,
// which is the detail screen's business.
//
// Dumb: mock rows, filtering in local state, no fetching.

import { useMemo, useState } from "react";
import { Card, Input, Table, Typography, theme } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "@tanstack/react-router";
import { AdminShell } from "../../shared/ui/AdminShell";
import { searchIcon } from "../../shared/ui/searchField";
import { AdminPage } from "../../shared/ui/AdminPage";
import { getStyles as getPageStyles } from "../../shared/ui/AdminPage.styles";
import { EmptyState } from "../../shared/ui/EmptyState";
import { TABLE_EMPTY_MIN_HEIGHT } from "../../shared/ui/EmptyState.styles";
import { staffNavFor } from "../../shared/ui/navigation";
import { useStaffViewer } from "../../shared/ui/viewerRole";
import { buildPopinTable, useMeasuredWidth } from "../../shared/ui/tableColumns";
import type { PriorityColumn } from "../../shared/ui/tableColumns";
import { useT } from "../../shared/ui/i18n/useT";
import { SessionTimeoutModal } from "../../features/Auth/ui/SessionTimeoutModal";
import {
  useIdleTimer,
  DEFAULT_IDLE_MS,
} from "../../features/Auth/ui/useIdleTimer";
import {
  BorrowerFilters,
  BorrowerFilterChips,
} from "../../features/Borrowers/ui/BorrowerFilters";
import {
  ApplicationStatusTag,
  DoNotLoanTag,
} from "../../features/Borrowers/ui/StatusTags";
import type {
  ApplicationStatus,
  Borrower,
  BorrowerFilterValues,
} from "../../features/Borrowers/ui/types";
import {
  ALL,
  emptyBorrowerFilters,
  fullName,
} from "../../features/Borrowers/ui/types";
import { mockBorrowers } from "./mockBorrowers";
import { getStyles, styles } from "./StaffBorrowersScreen.styles";

export type StaffBorrowersScreenProps = {
  borrowers?: Borrower[];
  viewerName?: string;
  idleMs?: number;
};

export default function StaffBorrowersScreen({
  borrowers = mockBorrowers,
  viewerName,
  idleMs = DEFAULT_IDLE_MS,
}: StaffBorrowersScreenProps) {
  const viewer = useStaffViewer();
  const name = viewerName ?? viewer.name;
  const navigate = useNavigate();
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);
  const page = getPageStyles(token);
  const { idle, reset: staySignedIn } = useIdleTimer(idleMs);

  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<BorrowerFilterValues>(emptyBorrowerFilters);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return borrowers.filter((borrower) => {
      const { profile } = borrower;
      const applicationStatus: ApplicationStatus =
        borrower.application?.status ?? "none";

      // WBS: search by name, email or phone number. The phone is matched on
      // digits alone so "2135550101" finds "(213) 555-0101" — but only when
      // the query actually contains digits: every number contains "".
      const digits = needle.replace(/\D/g, "");
      const matchesQuery =
        !needle ||
        fullName(profile).toLowerCase().includes(needle) ||
        profile.email.toLowerCase().includes(needle) ||
        (digits.length > 0 &&
          profile.phone.replace(/\D/g, "").includes(digits));

      const matchesState = filters.state === ALL || profile.state === filters.state;
      const matchesStatus =
        filters.status === ALL || applicationStatus === filters.status;
      const matchesFlag =
        filters.flag === ALL ||
        (filters.flag === "flagged" ? borrower.doNotLoan : !borrower.doNotLoan);

      return matchesQuery && matchesState && matchesStatus && matchesFlag;
    });
  }, [borrowers, query, filters]);

  const columns: PriorityColumn<Borrower>[] = [
    {
      title: t("users.col.name"),
      key: "name",
      width: 148,
      // The identifier — SAP's responsive-table guidance keeps this on
      // screen at every width, alongside the one key attribute below.
      priority: "high",
      // Cut with an ellipsis rather than wrapped; antd only raises the tooltip
      // when the text is actually truncated, so short names get no stray hover.
      render: (_value, row) => (
        <Typography.Text ellipsis={{ tooltip: fullName(row.profile) }}>
          {/* THE LINK COLOUR, like every other name in the back office.
              It was pinned to ink on the argument that the whole row navigates
              anyway — but the loans list and the underwriting queue both draw
              the same object, a person's name that opens their record, in the
              brand teal, and one of three tables disagreeing is not a
              decision, it is a drift. The colour is also what tells a reader
              the name is the thing to aim at. *"სახელები გააკეთე ლურჯად."* */}
          <Link to={`/staff/borrowers/${row.id}`}>{fullName(row.profile)}</Link>
        </Typography.Text>
      ),
    },
    {
      title: t("users.col.email"),
      key: "email",
      width: 238,
      // The in-table render dims this to secondary text to sit quietly next
      // to Name; popped into its own line it IS the fact being shown, so it
      // prints in the ordinary dark text SAP's own pop-in examples use.
      popinText: (row) => row.profile.email,
      render: (_value, row) => (
        <Typography.Text style={s.secondary} ellipsis={{ tooltip: row.profile.email }}>
          {row.profile.email}
        </Typography.Text>
      ),
    },
    {
      title: t("borrowers.col.phone"),
      key: "phone",
      width: 138,
      // Lowest priority to keep in the grid — it's in the search box
      // already, so the row itself doesn't need to carry it at every width.
      priority: "low",
      popinText: (row) => row.profile.phone,
      // Ellipsised like the rest: a wrapped number would push its row taller
      // than every other one in the table.
      render: (_value, row) => (
        <Typography.Text style={s.secondary} ellipsis={{ tooltip: row.profile.phone }}>
          {row.profile.phone}
        </Typography.Text>
      ),
    },
    {
      title: t("borrowers.col.address"),
      key: "address",
      // No width: the name, email and phone are sized to what they hold, so
      // the address — the one value that varies in length — takes the slack
      // instead of being the column that gets squeezed.
      // The street only. Nobody scans a list by city and ZIP — and printing
      // the whole address here means half of every one of them is an ellipsis,
      // which is worse than showing less on purpose. Hovering gives the rest,
      // and the record itself has it in full.
      //
      // Two things at once, and they pull against each other. The extra room
      // on the end breaks a long address about four characters sooner, so the
      // ellipsis stops running into the column beside it. But padding alone
      // would leave State stranded on the right, so the column also gives up
      // half that width to the email — the gap grows, and State comes back
      // with it instead of drifting.
      onHeaderCell: () => ({ style: { paddingInlineEnd: 34 } }),
      onCell: () => ({ style: { paddingInlineEnd: 34 } }),
      // Street only, same as the in-table cell — State is its own popped
      // field already, so the rest of the address stays on the record.
      popinText: (row) => row.profile.street,
      render: (_value, row) => {
        const full = `${row.profile.street}, ${row.profile.city}, ${row.profile.state} ${row.profile.zip}`;
        return (
          <Typography.Text style={s.secondary} ellipsis={{ tooltip: full }}>
            {row.profile.street}
          </Typography.Text>
        );
      },
    },
    {
      title: t("borrowers.col.state"),
      key: "state",
      width: 58,
      // Pops with Address, which it's read alongside — a state on its own,
      // without the street it qualifies, isn't worth a grid column.
      priority: "low",
      // A two-letter value under a five-letter heading: at the table's usual
      // 16px it drifts away from the address it belongs to. 8 pulls the pair
      // back together without touching any other column.
      onHeaderCell: () => ({ style: { paddingInlineStart: 4 } }),
      onCell: () => ({ style: { paddingInlineStart: 4 } }),
      render: (_value, row) => row.profile.state,
    },
    {
      title: t("borrowers.col.application"),
      key: "application",
      // Enough for the longest status, "Co-borrower required", to sit in its
      // pill without being clipped.
      width: 180,
      // The key attribute this list exists to show — stays with Name at
      // every width.
      priority: "high",
      render: (_value, row) => (
        <ApplicationStatusTag status={row.application?.status ?? "none"} />
      ),
    },
    {
      title: t("borrowers.col.flag"),
      key: "flag",
      // Wide enough for the whole DO NOT LOAN marker plus the table's 24px
      // outer inset — a flag that runs off the card's edge is not a flag.
      width: 165,
      // Story 10 calls this marker out by name as something that must stay
      // "a visible ui element" — it doesn't get to be the thing that pops.
      priority: "high",
      render: (_value, row) => (row.doNotLoan ? <DoNotLoanTag /> : null),
    },
  ];

  const [tableRef, tableWidth] = useMeasuredWidth<HTMLDivElement>();
  const popin = buildPopinTable(columns, tableWidth);

  return (
    <AdminShell
      sections={staffNavFor(viewer.role)}
      activeKey="borrowers"
      userName={name}
      profileTo="/staff/profile"
      onLogout={() => {
        console.log("log out");
        navigate({ to: "/" });
      }}
    >
      <AdminPage
        title={t("borrowers.title")}
        extra={
          <>
            <Input
              allowClear
              prefix={<SearchOutlined style={searchIcon} />}
              placeholder={t("filters.search")}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              style={styles.search}
            />
            <BorrowerFilters value={filters} onChange={setFilters} />
          </>
        }
        toolbarBelow={<BorrowerFilterChips value={filters} onChange={setFilters} />}
      >
        <Card style={page.tableCard} styles={{ body: page.tableCardBody }}>
          {/* SEVEN WBS COLUMNS DO NOT FIT A NARROW SCREEN. This used to mean
              a horizontal scroll; now the lowest-priority columns (Phone,
              State, and below ~891px also Email and Address) print inline
              under the name instead — SAP's responsive-table pop-in
              pattern. The wrapping div is only here to measure the width
              actually available to the table (see buildPopinTable). */}
          <div ref={tableRef}>
          <Table<Borrower>
            rowKey="id"
            // Fixed, so the column widths above are honoured: with the
            // default auto layout a truncated cell lets its column collapse
            // and the neighbours take the room.
            tableLayout="fixed"
            columns={popin.columns}
            dataSource={visible}
            // The whole row opens the record — a 1000px-wide row with one
            // 90px-wide place you are allowed to click is a target hunt. The
            // name stays a real link so the row is still reachable by keyboard
            // and can be opened in a new tab; the guard below keeps that click
            // from navigating twice.
            onRow={(row) => ({
              style: styles.row,
              onClick: (event) => {
                if ((event.target as HTMLElement).closest("a")) return;
                navigate({ to: `/staff/borrowers/${row.id}` });
              },
            })}
            locale={{
              emptyText: (
                <EmptyState
                  variant="notFound"
                  title={t("borrowers.empty")}
                  description={t("borrowers.emptyHint")}
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
          </div>
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
