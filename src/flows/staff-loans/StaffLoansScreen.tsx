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
import { Card, Flex, Input, Select, Table, Typography, theme } from "antd";
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "@tanstack/react-router";
import { AdminShell } from "../../shared/ui/AdminShell";
import { AdminPage } from "../../shared/ui/AdminPage";
import { getStyles as getPageStyles } from "../../shared/ui/AdminPage.styles";
import { EmptyState } from "../../shared/ui/EmptyState";
import { TABLE_EMPTY_MIN_HEIGHT } from "../../shared/ui/EmptyState.styles";
import { staffNavFor } from "../../shared/ui/navigation";
import { useStaffViewer } from "../../shared/ui/viewerRole";
import { decorateColumns } from "../../shared/ui/tableColumns";
import { ALL } from "../../shared/ui/FacetFilters";
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

const STATUSES: LoanStatus[] = ["funded", "repaying", "closed"];

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
  const [status, setStatus] = useState<string>(ALL);
  const [source, setSource] = useState<string>(ALL);
  const [partner, setPartner] = useState<string>(ALL);
  const [campaign, setCampaign] = useState<string>(ALL);

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

  const columns: ColumnsType<LoanRow> = [
    {
      title: t("loans.col.borrower"),
      key: "borrower",
      render: (_v, row) => (
        <Typography.Text ellipsis={{ tooltip: row.borrowerName }}>
          <Link to={`/staff/loans/${row.loan.loanId}`}>{row.borrowerName}</Link>
        </Typography.Text>
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
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder={t("loans.searchPlaceholder")}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            style={styles.search}
          />
        }
      >
        <Card style={page.tableCard} styles={{ body: page.tableCardBody }}>
          {/* The wireframe's filter row: the loan's own state, then the three
              acquisition ones. */}
          <Flex wrap gap={12} style={page.cardBlock}>
            <Select
              value={status}
              onChange={setStatus}
              style={styles.filter}
              options={[
                { value: ALL, label: t("loans.allStatuses") },
                ...STATUSES.map((value) => ({ value, label: t(`loan.${value}`) })),
              ]}
            />

            {canSeeAcquisition ? (
              <>
                <Select
                  value={source}
                  onChange={setSource}
                  style={styles.filter}
                  options={optionsFor(
                    (row) => row.loan.acquisition?.source,
                    t("acquisition.allSources")
                  )}
                />
                <Select
                  value={partner}
                  onChange={setPartner}
                  style={styles.filter}
                  options={optionsFor(
                    (row) => row.loan.acquisition?.referralPartner,
                    t("acquisition.allPartners")
                  )}
                />
                <Select
                  value={campaign}
                  onChange={setCampaign}
                  style={styles.filter}
                  options={optionsFor(
                    (row) => row.loan.acquisition?.campaign,
                    t("acquisition.allCampaigns")
                  )}
                />
              </>
            ) : null}
          </Flex>

          <Table<LoanRow>
            rowKey={(row) => row.loan.loanId}
            tableLayout="fixed"
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
