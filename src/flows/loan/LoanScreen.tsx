// src/flows/loan/LoanScreen.tsx
//
// Epic 5 — the borrower's Loan tab. The nav has carried a "Loan" entry since
// Epic 1 and it went nowhere; this is where it goes.
//
// Everything on the page is LoanOverview, a dumb component with a story per
// lifecycle stage — the route renders one state and the rest would otherwise
// be unreachable. This screen puts it on the page, connects its buttons, and
// owns the two confirmations, because both are irreversible and neither is the
// component's to decide.
//
// CONFIRMING SOMETHING IRREVERSIBLE HAS TO CHANGE THE PAGE. Withdrawing an
// application and cancelling a loan both used to log, show a toast and leave
// the screen exactly as it was, which is unreviewable: the designer's words
// were "ქენსლ რომ ვუკეთებ დაქენსელდეს". So the record the page renders lives
// in local state and the two confirmations move it — withdraw leaves no
// application at all, cancel leaves a cancelled loan. Both are still
// SIMULATED: nothing is fetched, nothing is written, and Dev replaces the
// state with a mutation.
//
// Dumb: mock default, local state for the dialogs and the simulated outcome,
// console.log for the rest.

import { useState } from "react";
import { App, Flex, Typography } from "antd";
import { useNavigate } from "@tanstack/react-router";
import { AppHeader } from "../../shared/ui/AppHeader";
import { ConfirmModal } from "../../shared/ui/ConfirmModal";
import { HeroBackdrop } from "../../shared/ui/HeroBackdrop";
import { borrowerNav } from "../../shared/ui/navigation";
import { BorrowerInbox } from "../notifications/BorrowerInbox";
import { useUnreadCount } from "../notifications/notifications";
import { useT } from "../../shared/ui/i18n/useT";
import { useCustomerViewer } from "../../shared/ui/viewerRole";
import { SessionTimeoutModal } from "../../features/Auth/ui/SessionTimeoutModal";
import { useIdleTimer, DEFAULT_IDLE_MS } from "../../features/Auth/ui/useIdleTimer";
import { LoanOverview } from "../../features/Loan/ui/LoanOverview";
import { stageLabelKeys } from "../../features/Loan/ui/stages";
import { ApplicationStatusTag } from "../../features/Borrowers/ui/StatusTags";
import { StatusPill } from "../../shared/ui/StatusPill";
import { VirtualCardModal } from "../../features/Loan/ui/VirtualCardModal";
import type { ApplicationSummary } from "../../features/Loan/ui/types";
import {
  hasOpenApplication,
  setStage,
  useHasSigned,
  useLoanRecord,
} from "./loanRecord";
import { styles } from "./LoanScreen.styles";

export type LoanScreenProps = {
  /**
   * Overrides the record the prototype is holding. Only a caller that wants a
   * specific state on screen passes it — normally the page reads the shared
   * one, so that cancelling here is still cancelled after a walk to Payments.
   */
  application?: ApplicationSummary;
  userName?: string;
  idleMs?: number;
};

export default function LoanScreen({
  application,
  userName,
  idleMs = DEFAULT_IDLE_MS,
}: LoanScreenProps) {
  const navigate = useNavigate();
  const viewer = useCustomerViewer();
  /** WBS Notifications: what the bell's badge counts. */
  const unreadCount = useUnreadCount(viewer.role);
  const person = userName ?? viewer.name;
  const t = useT();
  const { message } = App.useApp();
  const { idle, reset: staySignedIn } = useIdleTimer(idleMs);

  /**
   * What the page is showing.
   *
   * The shared record, so a confirmed withdrawal or cancellation is still
   * true when the borrower comes back from another page. A prop still wins,
   * for a caller that wants one particular state drawn.
   */
  const shared = useLoanRecord();
  const record = application ?? shared;

  const [confirm, setConfirm] = useState<"withdraw" | "cancel">();
  const close = () => setConfirm(undefined);
  /** WBS story 7's modal: OPA's frame around USIO's card. */
  const [cardOpen, setCardOpen] = useState(false);

  /** WBS story 7: the card belongs to the borrower, never the co-borrower. */
  const role = viewer.role;
  /** WBS story 2: two signatures before funding — has this one been given? */
  const signedByReader = useHasSigned(role);

  return (
    <>
      <AppHeader
        navItems={borrowerNav}
        notifications={<BorrowerInbox />}
        notificationCount={unreadCount}
        activeKey="loan"
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
            {/* The wireframe's own arrangement: the application's status and
                the loan's stage beside the title. They were replaced for a
                while by a rail under it, and the rail moved to the Dashboard
                where the designer wants that overview — so the two facts about
                the whole page are back where the wireframe puts them, beside
                the heading rather than inside a card on it. */}
            <Flex align="center" justify="space-between" gap={16} wrap style={styles.titleRow}>
              <Typography.Title level={3} style={styles.title}>
                {t("loanPage.title")}
              </Typography.Title>
              {/* NO PILLS OVER AN EMPTY PAGE. A cancelled loan still leaves a
                  record behind, so the heading went on reporting "Approved ·
                  Cancelled" above a page whose whole body says there is no
                  application and no loan. The pills describe what is on the
                  page; when nothing is, they describe nothing. */}
              {hasOpenApplication(record) && record ? (
                <Flex align="center" gap={8}>
                  <ApplicationStatusTag status={record.status} />
                  {record.loan ? (
                    <StatusPill
                      /* Funded is the state the loan is meant to reach, so it
                         is the one worth a colour; the others are the middle
                         of the process. */
                      color={record.loan.stage === "funded" ? "success" : undefined}
                    >
                      {/* The same stage reads differently once this person
                          has signed: they are not being waited on any more,
                          somebody else is. */}
                      {record.loan.stage === "awaitingSignature" && signedByReader
                        ? t("loanPage.stageAwaitingOther", {
                            name:
                              (role === "borrower"
                                ? record.coBorrower
                                : record.applicant) ?? "",
                          })
                        : t(stageLabelKeys[record.loan.stage])}
                    </StatusPill>
                  ) : null}
                </Flex>
              ) : null}
            </Flex>

            <LoanOverview
              application={record}
              role={role}
              /* Two signatures before funding, so the page has to know which
                 of them this reader has already given. */
              signedByReader={signedByReader}
              onStartApplication={() => navigate({ to: "/application" })}
              onWithdraw={() => setConfirm("withdraw")}
              onCancelLoan={() => setConfirm("cancel")}
              onSign={() => navigate({ to: "/loan/sign" })}
              onOpenCard={() => setCardOpen(true)}
              cardholder={person}
              onViewSchedule={() => navigate({ to: "/payments" })}
              onDownload={(document) => console.log("download document", document.name)}
            />
          </div>
        </div>
      </HeroBackdrop>

      {/* Both are irreversible, and they are different stories at different
          moments: story 5 withdraws an application before any decision, story 9
          cancels a funded loan before the card is used. */}
      <ConfirmModal
        open={confirm === "withdraw"}
        title={t("withdraw.title")}
        body={t("withdraw.body")}
        confirmLabel={t("withdraw.confirm")}
        danger
        onConfirm={() => {
          console.log("withdraw application", record?.id);
          /* Withdrawn before any decision: there is no application left, so
             the page falls back to the same empty state a borrower who never
             applied sees. */
          setStage("none");
          message.success(t("withdraw.done"));
          close();
        }}
        onCancel={close}
      />

      <ConfirmModal
        open={confirm === "cancel"}
        title={t("cancelLoan.title")}
        body={t("cancelLoan.body")}
        confirmLabel={t("cancelLoan.confirm")}
        danger
        onConfirm={() => {
          console.log("cancel loan", record?.id);
          /* WBS story 9: "The card is closed and nothing is paid out." The
             application stays approved — it happened — and the loan on it is
             cancelled. */
          setStage("cancelled");
          message.success(t("cancelLoan.done"));
          close();
        }}
        onCancel={close}
      />

      {/* WBS story 7. Nothing in it is a secret being withheld: the number and
          the CVV are USIO's and never reach OPA, so the button is a hand-off
          rather than a reveal. */}
      {record?.loan?.card ? (
        <VirtualCardModal
          open={cardOpen}
          brand={record.loan.card.brand}
          last4={record.loan.card.last4}
          cardholder={person}
          expiry={record.loan.card.expiry}
          used={record.loan.card.used}
          onOpenAtIssuer={() => console.log("open the USIO card view")}
          onCancel={() => setCardOpen(false)}
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
