// src/flows/application/co-borrower/InviteCoBorrowerScreen.tsx
//
// Inviting a co-borrower ONTO AN APPLICATION THAT IS ALREADY IN.
//
// Two WBS moments arrive here and they are the same job:
//
//   Loan Decisioning — "the system shall determine whether a co-borrower is
//   required for the application", and an application that requires one
//   "cannot proceed to underwriting until a qualified co-borrower has
//   accepted the invitation and completed all required application steps."
//
//   Story 14 — "The Borrower shall be able to REPLACE the invited co-borrower
//   if the invitation expires, is not accepted within five days, or the
//   co-borrower does not satisfy the underwriting requirements."
//
// WHY THIS SCREEN EXISTS AT ALL. Both used to point at `/application/new`,
// which is the seven-step wizard — so a borrower whose application was
// submitted last week, and who needs to do one thing, was dropped on "Step 1
// of 7: Income verification" and asked to upload a pay stub again. The thing
// they came to do is three fields.
//
// So it is the wizard's own co-borrower step, on its own page, with nothing
// else on it. Same component, same rules, same sponsorship limit and the same
// refusal when it is hit — this is not a second implementation of the invite,
// it is the one implementation somewhere else.
//
// Dumb: sending is local state plus a console.log, and it moves the shared
// stage so the rest of the prototype agrees that an invitation is out.

import { useState } from "react";
import { App, Card, Typography } from "antd";
import { useNavigate } from "@tanstack/react-router";
import { AppHeader } from "../../../shared/ui/AppHeader";
import { borrowerNav } from "../../../shared/ui/navigation";
import { BorrowerInbox } from "../../notifications/BorrowerInbox";
import { useUnreadCount } from "../../notifications/notifications";
import { useT } from "../../../shared/ui/i18n/useT";
import { useCustomerViewer } from "../../../shared/ui/viewerRole";
import { SessionTimeoutModal } from "../../../features/Auth/ui/SessionTimeoutModal";
import { useIdleTimer, DEFAULT_IDLE_MS } from "../../../features/Auth/ui/useIdleTimer";
import { CoBorrowerStep } from "../../../features/LoanApplication/ui/CoBorrowerStep";
import { ConfirmModal } from "../../../shared/ui/ConfirmModal";
import type { CoBorrowerInvitation } from "../../../features/LoanApplication/ui/types";
import { applyInvitation, setStage, useLoanRecord } from "../../loan/loanRecord";
import { styles } from "./InviteCoBorrowerScreen.styles";

/** WBS: an invitation expires five calendar days after it is sent. */
const INVITATION_DAYS = 5;
const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "short",
  year: "numeric",
};

export type InviteCoBorrowerScreenProps = {
  userName?: string;
  idleMs?: number;
};

export default function InviteCoBorrowerScreen({
  userName,
  idleMs = DEFAULT_IDLE_MS,
}: InviteCoBorrowerScreenProps) {
  const navigate = useNavigate();
  const viewer = useCustomerViewer();
  /** WBS Notifications: what the bell's badge counts. */
  const unreadCount = useUnreadCount(viewer.role);
  const person = userName ?? viewer.name;
  const t = useT();
  const { message } = App.useApp();
  const { idle, reset: staySignedIn } = useIdleTimer(idleMs);

  const record = useLoanRecord();

  /**
   * The invitation currently out, if any.
   *
   * Seeded from the record so somebody arriving to REPLACE one sees who they
   * are replacing, rather than an empty form that says nothing about the
   * person who did not answer.
   */
  const [invitation, setInvitation] = useState<CoBorrowerInvitation | undefined>(
    record?.invitation
      ? {
          firstName: record.invitation.invitee.split(" ")[0] ?? "",
          lastName: record.invitation.invitee.split(" ").slice(1).join(" "),
          email: record.invitation.inviteeEmail,
          status: "pending",
          expiresOn: record.invitation.expiresOn,
        }
      : undefined
  );

  /** Replacing cancels an invitation somebody may be about to answer. */
  const [replacing, setReplacing] = useState(false);

  const expiryFromToday = () => {
    const date = new Date();
    date.setDate(date.getDate() + INVITATION_DAYS);
    return date.toLocaleDateString("en-US", DATE_FORMAT);
  };

  return (
    <>
      <AppHeader
        navItems={borrowerNav}
        notifications={<BorrowerInbox />}
        notificationCount={unreadCount}
        activeKey="application"
        userName={person}
        profileTo="/profile"
        onLogout={() => {
          console.log("log out");
          navigate({ to: "/" });
        }}
      />

      <div style={styles.page}>
        <div style={styles.column}>
          <Card>
            <Typography.Title level={4} style={styles.title}>
              {t("inviteCoBorrower.title")}
            </Typography.Title>
            <Typography.Text type="secondary" style={styles.subtitle}>
              {t("inviteCoBorrower.subtitle")}
            </Typography.Text>

            {/* `required`: they are not being offered a co-borrower, they are
                being asked for one — the opt-in checkbox the wizard shows is
                not a choice at this point. */}
            <CoBorrowerStep
              required
              invitation={invitation}
              labels={{
                backLabel: t("common.back"),
                submitLabel: t("inviteCoBorrower.done"),
              }}
              onSend={(values) => {
                const sent: CoBorrowerInvitation = {
                  ...values,
                  status: "pending",
                  expiresOn: expiryFromToday(),
                };
                setInvitation(sent);
                message.success(t("coBorrowerStep.sent"));
                /* The application now has an invitation out, and every page
                   that reports on it has to say so — who it went to as well as
                   that it exists. */
                applyInvitation({
                  /* The invited person is shown whose application it is. */
                  invitedBy: person,
                  invitee: `${values.firstName} ${values.lastName}`.trim(),
                  inviteeEmail: values.email,
                  expiresOn: sent.expiresOn,
                });
                setStage("coBorrower");
              }}
              onReplace={() => setReplacing(true)}
              onBack={() => navigate({ to: "/application" })}
              onSubmit={() => navigate({ to: "/application" })}
            />
          </Card>
        </div>
      </div>

      {/* WBS story 14: replacing makes the previous invitation inactive, and
          the person it went to may be halfway through their part. It is not
          undoable, so it is asked — the same question the wizard asks. */}
      <ConfirmModal
        open={replacing}
        title={t("coBorrowerStep.replaceTitle")}
        body={t("coBorrowerStep.replaceBody", {
          name: `${invitation?.firstName ?? ""} ${invitation?.lastName ?? ""}`.trim(),
        })}
        confirmLabel={t("coBorrowerStep.replace")}
        danger
        onConfirm={() => {
          console.log("replace co-borrower", invitation?.email);
          setInvitation(undefined);
          /* The previous invitation stops working the moment this is
             confirmed — WBS story 14 — so it leaves the record too, and the
             Application tab goes back to asking for one. */
          applyInvitation(null);
          setReplacing(false);
          message.success(t("coBorrowerStep.replaced"));
        }}
        onCancel={() => setReplacing(false)}
      />

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
