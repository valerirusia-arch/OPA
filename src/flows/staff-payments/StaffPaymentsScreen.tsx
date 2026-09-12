// src/flows/staff-payments/StaffPaymentsScreen.tsx
//
// Epic 6, the internal side. WBS story 14 (view the repayment schedule
// "including... any fees applied") and story 15 (view the payment history),
// both for Admin / Underwriter / OPA Staff.
//
// This is a PAGE and not a tab on a borrower's record. The wireframe is
// explicit about it: the back-office Payment screen is one table across every
// borrower, with a Borrower column, a "Filter by borrower" box and a pager. It
// answers "what has been collected and what is late" — a question about the
// book, not about one person — and it is what the `Payment` entry in the rail
// has always pointed at. (A Payments tab on the borrower record was built
// first and has been removed: two homes for one table is how they drift.)
//
// NOBODY HERE HAS A BUTTON. Stories 14 and 15 are both VIEW stories, and no
// story in Manage Payments gives an internal user the ability to take a
// payment, refund one, waive a fee or edit the schedule. So "OPA Staff - read
// only" is satisfied by the page being read-only outright rather than by
// hiding a control from one of the three roles. If OPA wants an internal user
// to act on a payment, that is a new story, not a button.
//
// NOT BUILT, ON PURPOSE: the wireframe opens with three figures — Total
// collected, Payments recorded, Scheduled installments. No WBS story in this
// epic asks for them; they are reporting, and Reporting & Audit is its own
// epic further down the list. Flagged to the designer rather than carried over.
//
// Dumb: mock rows, filtering in local state, no fetching.

import { useMemo, useState } from "react";
import { Card, Input, Tabs, theme } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "@tanstack/react-router";
import { AdminShell } from "../../shared/ui/AdminShell";
import { AdminPage } from "../../shared/ui/AdminPage";
import { getStyles as getPageStyles } from "../../shared/ui/AdminPage.styles";
import { staffNavFor } from "../../shared/ui/navigation";
import { useStaffViewer } from "../../shared/ui/viewerRole";
import { useT } from "../../shared/ui/i18n/useT";
import { SessionTimeoutModal } from "../../features/Auth/ui/SessionTimeoutModal";
import { useIdleTimer, DEFAULT_IDLE_MS } from "../../features/Auth/ui/useIdleTimer";
import { PaymentSchedule } from "../../features/Payments/ui/PaymentSchedule";
import { PaymentHistory } from "../../features/Payments/ui/PaymentHistory";
import type { Installment, PaymentTransaction } from "../../features/Payments/ui/types";
import { allInstallments, allTransactions } from "./mockStaffPayments";
import { styles } from "./StaffPaymentsScreen.styles";

export type StaffPaymentsScreenProps = {
  installments?: Installment[];
  transactions?: PaymentTransaction[];
  viewerName?: string;
  idleMs?: number;
};

export default function StaffPaymentsScreen({
  installments = allInstallments,
  transactions = allTransactions,
  viewerName,
  idleMs = DEFAULT_IDLE_MS,
}: StaffPaymentsScreenProps) {
  const viewer = useStaffViewer();
  const name = viewerName ?? viewer.name;
  const navigate = useNavigate();
  const t = useT();
  const { token } = theme.useToken();
  const page = getPageStyles(token);
  const { idle, reset: staySignedIn } = useIdleTimer(idleMs);

  const [query, setQuery] = useState("");

  /** One box, both tables. The wireframe filters by borrower and nothing else. */
  const needle = query.trim().toLowerCase();
  const schedule = useMemo(
    () =>
      needle
        ? installments.filter((row) => row.borrower?.toLowerCase().includes(needle))
        : installments,
    [installments, needle]
  );
  const history = useMemo(
    () =>
      needle
        ? transactions.filter((row) => row.borrower?.toLowerCase().includes(needle))
        : transactions,
    [transactions, needle]
  );

  return (
    <AdminShell
      sections={staffNavFor(viewer.role)}
      activeKey="payment"
      userName={name}
      profileTo="/staff/profile"
      onLogout={() => {
        console.log("log out");
        navigate({ to: "/" });
      }}
    >
      <AdminPage
        title={t("payments.title")}
        extra={
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder={t("payments.filterByBorrower")}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            style={styles.search}
          />
        }
      >
        <Card style={page.tableCard} styles={{ body: page.tableCardBody }}>
          <Tabs
            defaultActiveKey="schedule"
            tabBarStyle={page.cardBlock}
            items={[
              {
                key: "schedule",
                label: t("loanPage.schedule"),
                children: (
                  <PaymentSchedule installments={schedule} showBorrower pageSize={10} />
                ),
              },
              {
                key: "history",
                label: t("payments.history"),
                children: <PaymentHistory transactions={history} showBorrower pageSize={10} />,
              },
            ]}
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
