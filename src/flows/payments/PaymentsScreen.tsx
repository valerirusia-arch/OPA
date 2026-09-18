// src/flows/payments/PaymentsScreen.tsx
//
// Epic 6 — the borrower's and co-borrower's Payments page. The nav has carried
// a "Payments" entry since Epic 1 and it went nowhere; this is where it goes,
// and it was the last dead link on the borrower's side.
//
// Everything on the page is PaymentsOverview, a dumb component with a story
// per state, for the reason the last two epics both ran into: the route
// renders ONE state. This screen puts it on the page, filters the cards to
// whoever is reading, and owns the pay dialog — because a payment is
// irreversible and the result of one is not the overview's to decide.
//
// WBS STORY 7 IS ENFORCED HERE, not in the component: "They cannot see each
// others card information. Borrower/Co-borrower should see only the cards that
// the current user added." The panel is handed the reader's own cards and
// never the full list, so there is no state of the component in which the
// other party's card could be rendered.
//
// Dumb: mock default, local state for the dialog, console.log for the rest.

import { useState } from "react";
import { Typography } from "antd";
import { useNavigate } from "@tanstack/react-router";
import { AppHeader } from "../../shared/ui/AppHeader";
import { HeroBackdrop } from "../../shared/ui/HeroBackdrop";
import { borrowerNav } from "../../shared/ui/navigation";
import { BorrowerInbox } from "../notifications/BorrowerInbox";
import { useUnreadCount } from "../notifications/notifications";
import { useT } from "../../shared/ui/i18n/useT";
import { useCustomerViewer } from "../../shared/ui/viewerRole";
import { SessionTimeoutModal } from "../../features/Auth/ui/SessionTimeoutModal";
import { useIdleTimer, DEFAULT_IDLE_MS } from "../../features/Auth/ui/useIdleTimer";
import { PaymentsOverview } from "../../features/Payments/ui/PaymentsOverview";
import {
  MakePaymentModal,
  type PaymentAttempt,
} from "../../features/Payments/ui/MakePaymentModal";
import type { Installment, PaymentsRecord } from "../../features/Payments/ui/types";
import {
  applyPayment,
  hasOpenApplication,
  useLoanRecord,
  usePaymentsRecord,
} from "../loan/loanRecord";
import { styles } from "./PaymentsScreen.styles";

export type PaymentsScreenProps = {
  /**
   * Overrides what the page shows. Left off, the page follows the same record
   * /loan does: there is nothing to repay until a loan is funded, and a
   * cancelled loan leaves nothing behind — a schedule on this page for a loan
   * the borrower cancelled on the last one is the prototype contradicting
   * itself.
   */
  record?: PaymentsRecord;
  userName?: string;
  idleMs?: number;
};

export default function PaymentsScreen({
  record,
  userName,
  idleMs = DEFAULT_IDLE_MS,
}: PaymentsScreenProps) {
  const navigate = useNavigate();
  const viewer = useCustomerViewer();
  /** WBS Notifications: what the bell's badge counts. */
  const unreadCount = useUnreadCount(viewer.role);
  const person = userName ?? viewer.name;
  const t = useT();
  const { idle, reset: staySignedIn } = useIdleTimer(idleMs);

  const role = viewer.role;

  /* Whether there is an application in play — the empty page reads
     differently when there is nothing to wait for. A cancelled loan counts as
     nothing, the same way /loan and /application read it. */
  const application = useLoanRecord();

  /*
    NOTHING TO REPAY UNTIL THERE IS A FUNDED LOAN.

    The page follows the record /loan holds: cancel the loan there and this
    page empties too, because a repayment schedule for a loan that no longer
    exists is the prototype disagreeing with itself. A caller that passes
    `record` still gets exactly what it asked for.
  */
  const staged = usePaymentsRecord();
  const shown = record ?? staged;

  /** `undefined` = closed. Anything else opens the dialog on that line. */
  const [paying, setPaying] = useState<{ installment?: Installment }>();

  /**
   * The next line owed. The schedule is in date order, so the first line that
   * is not paid is the next one, and an overdue line is still the next one.
   */
  const nextInstallment = shown?.schedule.find((row) => row.status !== "paid");
  const [attempt, setAttempt] = useState<PaymentAttempt>();
  const [submitting, setSubmitting] = useState(false);

  const closePay = () => {
    setPaying(undefined);
    setAttempt(undefined);
    setSubmitting(false);
  };

  /** WBS story 7, in one line. */
  const ownCards = shown?.cards.filter((card) => card.owner === role) ?? [];
  const activeCard = ownCards.find((card) => card.active);
  const visible = shown ? { ...shown, cards: ownCards } : undefined;

  /**
   * The attempt, simulated.
   *
   * It always succeeds. A prototype that fails at random turns every other
   * review into a retry, and the outcomes that need looking at — pending,
   * failed, refunded, reversed — are all reachable without gambling: the
   * dialog has a story for each, and the "all outcomes" record puts the five
   * of them in one history.
   */
  const submit = (amount: string) => {
    setSubmitting(true);
    console.log("take a payment through Repay", { amount, card: activeCard?.last4 });
    window.setTimeout(() => {
      setSubmitting(false);
      setAttempt({
        status: "succeeded",
        amount,
        reference: `RPY-${Date.now().toString().slice(-6)}`,
      });
      /* AND THE PAGE HAS TO AGREE. The receipt used to be the only thing that
         changed: the row behind the dialog still said "Pay now" and the
         balance was the same figure. The instalment is marked paid, the
         balance comes down, the transaction joins the history — and if that
         was the last one, the loan is paid off and the prototype says so. */
      applyPayment(paying?.installment, amount);
    }, 900);
  };

  return (
    <>
      <AppHeader
        navItems={borrowerNav}
        notifications={<BorrowerInbox />}
        notificationCount={unreadCount}
        activeKey="payments"
        userName={person}
        profileTo="/profile"
        onLogout={() => {
          console.log("log out");
          navigate({ to: "/" });
        }}
      />

      <HeroBackdrop tone="plain" paddingBlock={0}>
        <div style={styles.page}>
          <div style={styles.column}>
            <Typography.Title level={3} style={styles.title}>
              {t("payments.title")}
            </Typography.Title>

            <PaymentsOverview
              record={visible}
              hasApplication={hasOpenApplication(application)}
              role={role}
              /* From the balance card there is no row, so the next line owed
                 stands in for it. Without that the dialog labelled the payoff
                 figure "next scheduled payment". */
              onPay={(installment) => setPaying({ installment: installment ?? nextInstallment })}
              /* WBS story 13: a retry is a NEW attempt at the same money, so
                 it opens the same dialog rather than editing a history row. */
              onRetry={(transaction) => {
                const installment = shown?.schedule.find(
                  (row) => row.id === transaction.installmentId
                );
                setPaying({ installment: installment ?? nextInstallment });
              }}
              onViewLoan={() => navigate({ to: "/loan" })}
              /* The Application TAB, not the wizard. Every other Start in the
                 product lands there — it is the page that decides whether an
                 application can be started at all (one at a time, the DO NOT
                 LOAN list) and it is where the first step belongs. Dropping
                 someone straight into step 1 from here would be the only
                 door in the product that skipped it. */
              onStartApplication={() => navigate({ to: "/application" })}
            />
          </div>
        </div>
      </HeroBackdrop>

      {shown ? (
        <MakePaymentModal
          open={paying !== undefined}
          balance={shown.balance}
          installments={shown.schedule}
          installment={paying?.installment}
          card={activeCard}
          attempt={attempt}
          submitting={submitting}
          onSubmit={submit}
          onRetry={() => setAttempt(undefined)}
          onAddCard={closePay}
          onClose={closePay}
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
    </>
  );
}
