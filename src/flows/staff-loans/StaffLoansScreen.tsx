// src/flows/staff-loans/StaffLoansScreen.tsx
//
// Epic 5, the internal side. The `Loans` entry in the staff rail has pointed
// nowhere since Epic 1; this is where it points.
//
// WBS stories 10 and 11 of Manage Loan are written about ONE loan — "review
// all loan information, funding status and related documents", "manually
// update loan details" — and the wireframe supplies what those stories need
// and do not name: a way to reach a loan that is not by way of its borrower.
// Columns, search and filter are all off the wireframe.
//
// THREE OF THE FOUR FILTERS BELONG TO ANOTHER EPIC, and they are here anyway.
// "Search Loans by Acquisition Attributes" — Admin/Underwriter, priority 2, in
// Acquisition Channels, Referrals & Campaign Management — is what the
// acquisition source, referral partner and campaign filters are, and its
// comment names exactly those three: "Supported search criteria, filters:
// acquisition source, partner, campaign." A filter row that is drawn with four
// controls and ships with one is not the screen the designer reviewed.
//
// Their role list is SHORTER than this page's: every acquisition story is
// Admin/Underwriter, with no OPA Staff, so an OPA Staff member gets the loan
// status filter and nothing else.
//
// Dumb: mock rows, filtering in local state, no fetching.

import { useMemo, useState } from "react";
import { Card, Input, Table, Typography, theme } from "antd";
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined } from "@ant-design/icons";
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
import {
  ALL,
  FacetFilterChips,
  FacetFilters,
  type Facet,
} from "../../shared/ui/FacetFilters";
import { useT } from "../../shared/ui/i18n/useT";
import { SessionTimeoutModal } from "../../features/Auth/ui/SessionTimeoutModal";
import { useIdleTimer, DEFAULT_IDLE_MS } from "../../features/Auth/ui/useIdleTimer";
import { LoanStatusTag } from "../../features/Borrowers/ui/StatusTags";
import type { LoanStatus } from "../../features/Borrowers/ui/types";
import { allLoans, type LoanRow } from "./mockStaffLoans";
import { styles } from "./StaffLoansScreen.styles";

export type StaffLoansScreenProps = {
  loans?: LoanRow[];
  viewerName?: string;
  idleMs?: number;
};

/** Every state a loan can be in, so the filter can reach every row. */
const STATUSES: LoanStatus[] = ["funded", "repaying", "closed", "cancelled"];

/**
 * What this list can be filtered by. A plain record of strings, because that
 * is the contract `FacetFilters` is generic over — the same one the borrower
 * list and the application queue satisfy.
 */
type LoanFilterValues = {
  status: string;
  source: string;
  partner: string;
  campaign: string;
};

const emptyLoanFilters: LoanFilterValues = {
  status: ALL,
  source: ALL,
  partner: ALL,
  campaign: ALL,
};

export default function StaffLoansScreen({
  loans = allLoans,
  viewerName,
  idleMs = DEFAULT_IDLE_MS,
}: StaffLoansScreenProps) {
  const viewer = useStaffViewer();
  const name = viewerName ?? viewer.name;
  const navigate = useNavigate();
  const t = useT();
  const { token } = theme.useToken();
  const page = getPageStyles(token);
  const { idle, reset: staySignedIn } = useIdleTimer(idleMs);

  const [query, setQuery] = useState("");
  /* ONE OBJECT, not four states: the facet control hands back the whole set,
     and four separate setters was the shape the row of Selects needed. */
  const [filters, setFilters] = useState<LoanFilterValues>(emptyLoanFilters);
  const { status, source, partner, campaign } = filters;

  /** Admin and Underwriter. No acquisition story names OPA Staff. */
  const canSeeAcquisition = viewer.role === "admin" || viewer.role === "underwriter";

  /**
   * The options come from the loans on the list rather than from a fixed set.
   *
   * The real lists are maintained by the Admin — "Manage Acquisition Sources",
   * "Manage Referral Partners", "Manage Marketing Campaigns" are three stories
   * of their own — so hard-coding them here would invent data that screen owns.
   */
  const optionsFor = (pick: (row: LoanRow) => string | undefined, allLabel: string) => [
    { value: ALL, label: allLabel },
    ...[...new Set(loans.map(pick).filter((value): value is string => Boolean(value)))]
      .sort()
      .map((value) => ({ value, label: value })),
  ];

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return loans.filter((row) => {
      const matchesQuery =
        !needle ||
        row.borrowerName.toLowerCase().includes(needle) ||
        row.borrowerEmail.toLowerCase().includes(needle);
      const matchesStatus = status === ALL || row.loan.status === status;
      const acquisition = row.loan.acquisition;
      const matchesSource = source === ALL || acquisition?.source === source;
      const matchesPartner = partner === ALL || acquisition?.referralPartner === partner;
      const matchesCampaign = campaign === ALL || acquisition?.campaign === campaign;
      return (
        matchesQuery && matchesStatus && matchesSource && matchesPartner && matchesCampaign
      );
    });
  }, [loans, query, status, source, partner, campaign]);

  /*
    THE FACETS, described once so the panel and the chips cannot disagree.

    It was a row of four Selects sitting inside the table's own card, above
    the header — *"აქ ესე რატომ გვაქვს ფილტრები? როგორც გვაქვს, მაღლა მარჯვნივ
    სერჩის გვერდზე, დროპდაუნზე, ეგრე გააკეთე."* The borrower list and the
    application queue have done it that way since they were built, and
    shared/ui/FacetFilters exists for exactly this reason: search is the
    control people reach for on every list, so it keeps the same place in the
    toolbar, and facets — which differ in number from list to list — go behind
    one button that carries a count. Four selects on this screen and none on
    the next is what makes two tables stop looking alike.

    Nothing is hidden by folding them: what is set shows as a chip under the
    toolbar, removable in one click.
  */
  const facets = useMemo<Facet<LoanFilterValues>[]>(() => {
    const own: Facet<LoanFilterValues>[] = [
      {
        key: "status",
        label: t("loans.col.status"),
        options: [
          { value: ALL, label: t("loans.allStatuses") },
          ...STATUSES.map((value) => ({ value, label: t(`loan.${value}`) })),
        ],
      },
    ];
    /* Every acquisition story is Admin/Underwriter with no OPA Staff, so an
       OPA Staff member gets the loan's own state and nothing else. */
    if (!canSeeAcquisition) return own;
    return [
      ...own,
      {
        key: "source",
        label: t("acquisition.source"),
        options: optionsFor((row) => row.loan.acquisition?.source, t("acquisition.allSources")),
      },
      {
        key: "partner",
        label: t("acquisition.partner"),
        options: optionsFor(
          (row) => row.loan.acquisition?.referralPartner,
          t("acquisition.allPartners")
        ),
      },
      {
        key: "campaign",
        label: t("acquisition.campaign"),
        options: optionsFor(
          (row) => row.loan.acquisition?.campaign,
          t("acquisition.allCampaigns")
        ),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loans, canSeeAcquisition, t]);

  const columns: ColumnsType<LoanRow> = [
    {
      title: t("loans.col.borrower"),
      key: "borrower",
      /* A WIDTH, and it had none — so it took every spare pixel and opened a
         hole between the borrower and their loan's first fact. This table has
         no long free-text column, so every column is sized and the browser
         shares the slack out proportionally. See TABLE_NAME_WIDTH. */
      width: TABLE_NAME_WIDTH,
      render: (_v, row) => (
        <NameCell
          name={row.borrowerName}
          to={`/staff/loans/${row.loan.loanId}`}
          meta={t("loanAdmin.loanId", { id: row.loan.loanId })}
        />
      ),
    },
    {
      title: t("loans.col.amount"),
      key: "amount",
      width: 140,
      render: (_v, row) => row.loan.amount,
    },
    { title: t("loans.col.rate"), key: "rate", width: 120, render: (_v, row) => row.loan.rate },
    {
      title: t("loans.col.status"),
      key: "status",
      width: 160,
      render: (_v, row) => <LoanStatusTag status={row.loan.status} />,
    },
    {
      title: t("loans.col.agreement"),
      key: "agreement",
      width: 150,
      render: (_v, row) => (
        <Typography.Text type={row.loan.agreementSigned ? undefined : "secondary"}>
          {t(row.loan.agreementSigned ? "loans.agreementSigned" : "loans.agreementUnsigned")}
        </Typography.Text>
      ),
    },
    {
      title: t("loans.col.funded"),
      key: "funded",
      width: 160,
      render: (_v, row) => (
        <Typography.Text type="secondary">{row.loan.fundedOn ?? "—"}</Typography.Text>
      ),
    },
  ];

  return (
    <AdminShell
      sections={staffNavFor(viewer.role)}
      activeKey="loans"
      userName={name}
      profileTo="/staff/profile"
      onLogout={() => {
        console.log("log out");
        navigate({ to: "/" });
      }}
    >
      <AdminPage
        title={t("loans.title")}
        extra={
          <>
            <Input
              allowClear
              prefix={<SearchOutlined />}
              placeholder={t("loans.searchPlaceholder")}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              style={styles.search}
            />
            <FacetFilters facets={facets} value={filters} onChange={setFilters} empty={emptyLoanFilters} />
          </>
        }
        toolbarBelow={
          <FacetFilterChips facets={facets} value={filters} onChange={setFilters} />
        }
      >
        <Card style={page.tableCard} styles={{ body: page.tableCardBody }}>
          <Table<LoanRow>
            rowKey={(row) => row.loan.loanId}
            tableLayout="fixed"
            // Six columns (borrower + five fixed at 730px) crush on a narrow
            // screen: without this the width-less borrower column collapses and
            // its header stacks. Scroll horizontally below ~960px instead.
            scroll={{ x: 960 }}
            columns={decorateColumns(columns)}
            dataSource={visible}
            onRow={(row) => ({
              style: styles.row,
              onClick: (event) => {
                if ((event.target as HTMLElement).closest("a")) return;
                navigate({ to: `/staff/loans/${row.loan.loanId}` });
              },
            })}
            locale={{
              emptyText: (
                <EmptyState
                  variant="notFound"
                  title={t("loans.empty")}
                  description={t("loans.emptyHint")}
                  minHeight={TABLE_EMPTY_MIN_HEIGHT}
                />
              ),
            }}
            pagination={{
              pageSize: 8,
              hideOnSinglePage: true,
              showSizeChanger: false,
              style: page.pagination,
            }}
          />
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
