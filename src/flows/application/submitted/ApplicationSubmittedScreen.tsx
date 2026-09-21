// src/flows/application/submitted/ApplicationSubmittedScreen.tsx
//
// Epic 3, WBS story 7 — "see the confirmation of application submission" — and
// the note the WBS leaves under story 8: "the confirmation page with the
// contact details of OPA should be displayed to a borrower as soon as they
// finish their application". So the contacts are on this page, not only on
// the Contact page, and they are here because this is the moment a borrower is
// most likely to have a question and least likely to go looking.
//
// Story 14 puts a third state here: "IF the co-borrower fails to meet
// underwriting requirements, system will be able to reset borrower application
// and allow new co-borrower to receive an invitation to apply." That is not a
// rejection of the borrower and must not read like one — their application is
// intact and waiting, and the only thing missing is a different co-borrower.
// So it is not a submitted-and-waiting screen at all: it is a screen with one
// action on it, back to the invitation step.
//
// The other thing the WBS puts here is the wait: "applications requiring a
// co-borrower cannot proceed to underwriting until a qualified co-borrower has
// accepted the invitation and completed all required application steps". A
// borrower whose application is really waiting on somebody else should not be
// told it is being reviewed.

import { Button, Card, Flex, Result, Tag, Typography, theme } from "antd";
import { useNavigate } from "@tanstack/react-router";
import { AppHeader } from "../../../shared/ui/AppHeader";
import { borrowerNav } from "../../../shared/ui/navigation";
import { BorrowerInbox } from "../../notifications/BorrowerInbox";
import { useUnreadCount } from "../../notifications/notifications";
import { useT } from "../../../shared/ui/i18n/useT";
import { useCustomerViewer } from "../../../shared/ui/viewerRole";
import { pill } from "../../../shared/ui/tag.styles";
import { useLoanRecord } from "../../loan/loanRecord";
import { ContactDetails } from "../../../features/LoanApplication/ui/ContactDetails";
import { InvitationMark } from "../../../features/LoanApplication/ui/InvitationMark";
import { SubmittedMark } from "../../../features/LoanApplication/ui/SubmittedMark";
import { getStyles, styles } from "./ApplicationSubmittedScreen.styles";

export type ApplicationSubmittedScreenProps = {
  userName?: string;
  /** WBS: underwriting waits for the co-borrower to finish their part. */
  /** Left off, the record decides. */
  waitingOnCoBorrower?: boolean;
  /**
   * Story 14: the co-borrower failed underwriting, so the application has been
   * reset and is waiting for a replacement to be invited.
   */
  coBorrowerFailed?: boolean;
  /** Who did not qualify. Named, because "your co-borrower" is not who. */
  coBorrowerName?: string;
};

export default function ApplicationSubmittedScreen({
  userName,
  waitingOnCoBorrower,
  coBorrowerFailed,
  coBorrowerName,
}: ApplicationSubmittedScreenProps) {
  const navigate = useNavigate();
  // Whoever the DevBar is pointed at, unless the caller names someone.
  const viewer = useCustomerViewer();
  /** WBS Notifications: what the bell's badge counts. */
  const unreadCount = useUnreadCount(viewer.role);
  const person = userName ?? viewer.name;
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);

  /**
   * Whether underwriting is actually waiting on somebody else.
   *
   * Read from the record rather than assumed false: an application submitted
   * with an invitation out "cannot proceed to underwriting until a qualified
   * co-borrower has accepted the invitation and completed all required
   * application steps", and this is the screen where the borrower learns it.
   * A prop still wins, for Storybook.
   */
  const record = useLoanRecord();
  /* THIS SCREEN'S STORY-14 STATE WAS UNREACHABLE. `coBorrowerFailed` defaulted
     to false and this is a route component, so no caller ever set it — the
     variant below was written, translated, and could not be walked to. It
     reads the record now, like `waiting` beside it and like /application's own
     gate, so one fact drives every screen that mentions it. A prop still wins,
     for Storybook. */
  const waiting = waitingOnCoBorrower ?? record?.status === "coBorrower";
  const failed = coBorrowerFailed ?? Boolean(record?.coBorrowerFailed);
  const failedName = coBorrowerName ?? record?.coBorrowerFailed ?? "";

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

      <div style={s.page}>
        <div style={styles.column}>
          <Card style={s.card}>
            {failed ? (
              <Result
                style={styles.result}
                icon={<InvitationMark />}
                title={t("submitted.coBorrowerFailedTitle")}
                subTitle={t("submitted.coBorrowerFailedBody", {
                  name: failedName,
                })}
                styles={{ title: s.title, subTitle: s.subTitle, extra: s.extra }}
                extra={
                  /* One action, and it is the only useful one: back to the step
                     that invites somebody. No "In review" tag — nothing is. */
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => navigate({ to: "/application/co-borrower" })}
                  >
                    {t("submitted.inviteAnother")}
                  </Button>
                }
              />
            ) : (
              <Result
                style={styles.result}
                icon={<SubmittedMark />}
                /* THE CO-BORROWER SENT THEIR PART, NOT AN APPLICATION. They
                   joined somebody else's, and "your application is submitted"
                   claims something that is not theirs to claim. Same screen,
                   same tag, the sentence adjusted to who pressed the button —
                   the wording their own Application tab uses afterwards. */
                title={t(
                  viewer.role === "coBorrower" ? "submitted.partTitle" : "submitted.title"
                )}
                /* WAITING ON SOMEBODY IS NOT "UNDER REVIEW". The card used
                   to say "OPA is reviewing it now" over an alert saying
                   underwriting had not started — one card, two answers. The
                   sentence that was in the alert is the true one, so it is
                   the card's own now and the alert is gone. */
                subTitle={t(
                  waiting
                    ? "submitted.waitingCoBorrower"
                    : viewer.role === "coBorrower"
                      ? "submitted.partDescription"
                      : "submitted.description"
                )}
                styles={{ title: s.title, subTitle: s.subTitle, extra: s.extra }}
                extra={
                  <Flex vertical align="center" gap={16}>
                    <Tag variant="filled" style={pill}>
                      {t(waiting ? "submitted.tagWaiting" : "submitted.tag")}
                    </Tag>
                    <Button
                      type="primary"
                      size="large"
                      onClick={() => navigate({ to: "/loan" })}
                    >
                      {t(
                        viewer.role === "coBorrower"
                          ? "application.assignedDoneAction"
                          : "submitted.dashboard"
                      )}
                    </Button>
                  </Flex>
                }
              />
            )}


          </Card>

          <Card>
            <Typography.Title level={5} style={styles.contactTitle}>
              {t("submitted.contactTitle")}
            </Typography.Title>
            <ContactDetails />
          </Card>
        </div>
      </div>
    </>
  );
}
