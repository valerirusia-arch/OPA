// src/flows/application/ApplicationStartScreen.tsx
//
// The Application tab: the page the borrower lands on, whatever state their
// application is in.
//
// All seven states live in ApplicationGate, a dumb component with a story per
// state — they come from two epics and only one of them is reachable by
// walking the app, so they would otherwise be unreviewable. This screen puts
// that card on the page and connects its buttons to somewhere.
//
// Presentation of a state, not a guard: nothing redirects. Which state shows
// is a prop, and during integration Dev feeds it from the real application
// record.
//
// Dumb: mock default, navigation only.

import { useNavigate } from "@tanstack/react-router";
import { AppHeader } from "../../shared/ui/AppHeader";
import { HeroBackdrop } from "../../shared/ui/HeroBackdrop";
import { borrowerNav } from "../../shared/ui/navigation";
import { BorrowerInbox } from "../notifications/BorrowerInbox";
import { useUnreadCount } from "../notifications/notifications";
import { useCustomerViewer } from "../../shared/ui/viewerRole";
import {
  ApplicationGate,
  type ApplicationGateState,
} from "../../features/LoanApplication/ui/ApplicationGate";
import { SessionTimeoutModal } from "../../features/Auth/ui/SessionTimeoutModal";
import { useIdleTimer, DEFAULT_IDLE_MS } from "../../features/Auth/ui/useIdleTimer";
import { coBorrowerGateFor, gateFor, setStage, useLoanRecord } from "../loan/loanRecord";
import { styles } from "./ApplicationStartScreen.styles";

/** Kept as the screen's own name for the prop Dev will feed. */
export type ApplicationGateProp = ApplicationGateState;

export type ApplicationStartScreenProps = {
  /**
   * Forces one state on screen. Left off, the page reads the same record
   * /loan and /payments read, so a borrower who has just cancelled is offered
   * a new application and one who is mid-review is not.
   */
  gate?: ApplicationGateState;
  userName?: string;
  idleMs?: number;
};

export default function ApplicationStartScreen({
  gate,
  userName,
  idleMs = DEFAULT_IDLE_MS,
}: ApplicationStartScreenProps) {
  const navigate = useNavigate();
  const record = useLoanRecord();
  // Whoever the DevBar is pointed at, unless the caller names someone.
  const viewer = useCustomerViewer();
  /** WBS Notifications: what the bell's badge counts. */
  const unreadCount = useUnreadCount(viewer.role);
  /**
   * A CO-BORROWER IS SOMEBODY WITH AN APPLICATION TO BE A CO-BORROWER OF.
   *
   * It is not an account type. The WBS registers them as an ordinary personal
   * account, and the INVITATION "securely associates the co-borrower with the
   * corresponding loan application" — which is also how one person can
   * "sponsor up to 3 borrowers". So the whole distinction only exists inside
   * an application:
   *
   *   no application  — nobody is a co-borrower yet, so this is the ordinary
   *                     tab, offering the ordinary way in;
   *   an application  — "the co-borrower has access only to the ASSIGNED
   *                     application", so none of the borrower's blocked and
   *                     decisioning states is theirs to be in. Invited and
   *                     not started, they get the invitation itself — the
   *                     same thing the email said, because the email is easy
   *                     to lose and this tab is where they look instead.
   *                     Afterwards: where its status lives.
   *
   * The `gate` prop still wins, so Storybook can draw any state.
   */
  const state =
    gate ??
    /* The co-borrower's side has its own answer and it now lives in one
       place — this screen and /co-application were each deriving it, and
       they had already drifted apart. See `coBorrowerGateFor`. */
    (viewer.role === "coBorrower" ? coBorrowerGateFor(record) : gateFor(record));
  const person = userName ?? viewer.name;
  const { idle, reset: staySignedIn } = useIdleTimer(idleMs);

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

      {/* One card on an otherwise empty page — the same ground the contact
          page stands on, and centred rather than dropped at the top. */}
      {/* `plain`: the same ground every other borrower page stands on. The
          coloured wash was this page's alone, and one screen with its own
          background reads as a different product rather than a different page.
          `center` stays — the card is still placed in the window, not dropped
          at the top of it. */}
      <HeroBackdrop tone="plain" center paddingBlock={64}>
        <div style={{ ...styles.column, ...styles.lift }}>
          <ApplicationGate
            state={state}
            onStart={() => navigate({ to: "/application/new" })}
            /* The application has been sent by the time this state shows, so
               "review" means the loan page, where its status lives — sending
               them back into an empty wizard would be offering to start the
               thing they were just told they cannot start. */
            invitation={record?.invitation}
            coBorrowerFailed={record?.coBorrowerFailed}
            onOpenInvitation={() => navigate({ to: "/co-application" })}
            onViewStatus={() => navigate({ to: "/loan" })}
            onResume={() => navigate({ to: "/loan" })}
            onContact={() => navigate({ to: "/contact" })}
            onSendInformation={() => navigate({ to: "/application/information" })}
            /* NOT the seven-step wizard. Their application is already in;
               the thing they came to do is three fields. */
            onInviteCoBorrower={() => navigate({ to: "/application/co-borrower" })}
            onProfile={() => navigate({ to: "/profile" })}
            /*
              CLOSING THE FILE IS WHAT LETS THEM COME BACK.

              In the product this is a record being closed. In the prototype
              it is the same thing: the staged record goes back to "no
              application", which is what every page reads, so /loan,
              /payments and this one all return to their empty states
              together — *"თუ დააწვები, უბრალოდ გაქრება ეს ყველაფერი და
              დაბრუნდები ისევ იმ სქრინზე სადაც ყველგან ემფთი სტეიტებია."*

              NOT a dev control dressed as a product one: what the borrower
              presses is the same door Dev will wire to the real close. It
              stays in /flows because the record it moves is /flows' own mock.
            */
            onCloseApplication={() => setStage("none")}
          />
        </div>
      </HeroBackdrop>

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
