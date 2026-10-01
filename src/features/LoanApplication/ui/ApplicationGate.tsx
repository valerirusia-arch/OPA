// src/features/LoanApplication/ui/ApplicationGate.tsx
//
// What a borrower is told when they open the Application tab: the invitation
// to start one, or the reason they cannot, or where their application has got
// to while Loan Decisioning runs.
//
// Seven states, from two epics:
//
//   Epic 3, "start a new loan application"
//     open              — nothing in the way
//     hasActive         — "One active application per borrower is assumed"
//     notEligible       — "If the user is on the DO NOT lend list, the
//                          applicant is not allowed to create a new
//                          application"
//   Epic 3, the co-borrower's half
//     invited           — somebody has been asked onto an application and has
//                          not started their part. It exists because the
//                          invitation arrives by EMAIL and the site has to be
//                          able to say the same thing: open the tab and you
//                          are told whose application it is, that it is
//                          yours to start, and the date it expires.
//     assignedDone      — a co-borrower whose part is in. Story 4's "view the
//                          current application status" is all that is left
//                          for them to do with it. Only this one: being a
//                          co-borrower is a relationship to an application,
//                          not an account type, so with no application the
//                          reader is an ordinary borrower on `open`.
//   Epic 4, Loan Decisioning
//     needsInfo         — an underwriter asked for something (story 12's door)
//     coBorrowerNeeded  — "email is sent about requiring a co-borrower"
//     checkPaused       — a check could not run; explicitly NOT a refusal
//     stopped           — "unable to proceed, they receive a message to call
//                          customer service"
//
// A component rather than seven blocks inside the screen, because six of them
// are otherwise unreachable: the route renders one state and there is no way
// to walk the app into the others. Here each is a story, and the whole set can
// be judged side by side.
//
// Dumb: it takes a state and reports which button was pressed. It navigates
// nowhere — ApplicationStartScreen does that.

import { Button, Card, ConfigProvider, Result, theme } from "antd";
import { brand } from "../../../theme/tokens";
import { useT } from "../../../shared/ui/i18n/useT";
import { EmptyArt } from "../../../shared/ui/empty/EmptyArt";
import { getStyles, styles } from "./ApplicationGate.styles";

/** Where a borrower's application has got to, as far as they need to know. */
export type ApplicationGateState =
  | "open"
  | "invited"
  | "assignedDone"
  | "hasActive"
  /**
   * THE LOAN IS REPAID AND THE FILE CAN BE CLOSED.
   *
   * NOT IN THE WBS, and it should be read as a proposal rather than a
   * requirement. What the WBS has is the rule this state exists because of:
   * "One active application per borrower is assumed... If a user already has
   * a loan application, the new application should not be allowed", and the
   * check that enforces it looks for "an open application OR LOAN". It never
   * says what makes a repaid loan stop counting as one — so as written, a
   * borrower who has paid OPA back in full can never apply again, which for
   * a filing-fee lender whose customers file more than one petition cannot be
   * what is meant.
   *
   * So this state offers the closing act the rule implies and the document
   * omits: the loan is settled, the application can be closed, and closing it
   * is what frees the next one. OPA has to confirm it.
   */
  | "repaid"
  | "notEligible"
  | "needsInfo"
  | "coBorrowerNeeded"
  | "coBorrowerFailed"
  /**
   * THE CO-BORROWER'S SIDE of the same reset.
   *
   * It says the invitation is over and nothing else. The WBS gives the
   * co-borrower no story here — the "did not pass underwriting" notification
   * is the BORROWER's, and this feed already treats it as borrower-only — and
   * a lender telling somebody it turned them down for credit is an adverse
   * action with its own legal handling, not a line of UI copy to invent. So
   * this states the fact they need (there is nothing left for you to do) and
   * points at the two people who may explain it.
   */
  | "invitationClosed"
  | "checkPaused"
  | "stopped";

export type ApplicationGateProps = {
  state?: ApplicationGateState;
  onStart?: () => void;
  /** The invited person's way into their own part of the application. */
  onOpenInvitation?: () => void;
  /** …and, once it is submitted, the way to where its status lives. */
  onViewStatus?: () => void;
  /**
   * Who asked them, and when the invitation lapses. WBS: five calendar days
   * from sending, and the status is tracked, so the date is stated rather
   * than left to the email they may not have open.
   */
  invitation?: {
    invitedBy: string;
    invitee: string;
    inviteeEmail: string;
    expiresOn: string;
  };
  onResume?: () => void;
  onContact?: () => void;
  onSendInformation?: () => void;
  onInviteCoBorrower?: () => void;
  /**
   * The co-borrower underwriting turned down, for the `coBorrowerFailed`
   * state. Named, because "somebody did not qualify" is not something to make
   * the borrower guess at when they invited the person themselves.
   */
  coBorrowerFailed?: string;
  onProfile?: () => void;
  /** WBS-adjacent — see `repaid` on ApplicationGateState. Closing the file is
   *  what lets the borrower start another application. */
  onCloseApplication?: () => void;
};

export function ApplicationGate({
  state = "open",
  onStart,
  onOpenInvitation,
  onViewStatus,
  invitation,
  coBorrowerFailed,
  onResume,
  onContact,
  onSendInformation,
  onInviteCoBorrower,
  onProfile,
  onCloseApplication,
}: ApplicationGateProps) {
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);

  /**
   * ONE SIZE FOR THE ARTWORK, whichever drawing a state uses.
   *
   * The three marks carry their own defaults — 140 for the application
   * packet, 112 for the invitation and the submitted sheet — because each was
   * sized for the page it was drawn for. Here they are alternatives in the
   * SAME slot on the same card, so a state that happened to use one of the
   * smaller two came out visibly lighter than its neighbours: same card, same
   * words, smaller picture. The gate names the size and the defaults stay
   * for the screens that own them.
   */
  const MARK = 140;

  const content = {
    /* EVERY STATE GETS THE DRAWING. Four of them used to be a 56px antd icon
       in a grey avatar, so half the page's states looked like a different
       product from the other half. The packet is the same packet in all of
       them; what differs is the badge on it and the tint behind it, which is
       exactly the difference between these states. */
    open: {
      icon: <EmptyArt variant="plus" size={MARK} />,
      title: t("application.startTitle"),
      subTitle: t("application.startSubtitle"),
      action: (
        <Button type="primary" size="large" onClick={onStart}>
          {t("application.start")}
        </Button>
      ),
    },
    /*
      REPAID. The one state on this page that is an ending rather than a
      waiting room, and the only one whose drawing is not this epic's sheet of
      paper: what is being marked is twelve payments made and not a document
      filed. See RepaidMark.
    */
    repaid: {
      icon: <EmptyArt variant="check" size={MARK} />,
      title: t("application.repaidTitle"),
      subTitle: t("application.repaidBody"),
      /*
        THE ONE GREEN BUTTON IN THE PRODUCT.

        Every primary action here is the site's burnt orange, which is the
        colour of "do the thing" — apply, sign, pay. This one is not asking
        for anything: it acknowledges that the loan is over.
        *"მინდა რომ ღილაკი მწვანე ფერი იყოს, ან რამე Done."*

        Themed through `ConfigProvider` rather than styled with a background,
        because a solid button needs a hover and an active state as well, and
        antd derives all three from `colorPrimary` once it is told what green
        means here.
      */
      action: (
        <ConfigProvider
          theme={{
            components: {
              Button: {
                colorPrimary: brand.success,
                colorPrimaryHover: brand.successMark,
                colorPrimaryActive: brand.successActive,
              },
            },
          }}
        >
          <Button type="primary" size="large" onClick={onCloseApplication}>
            {t("application.closeApplication")}
          </Button>
        </ConfigProvider>
      ),
    },
    /*
      INVITED, AND NOT STARTED. The invitation is an email, and an email is
      easy to lose — so the site says the same thing the email said. Who it
      belongs to, that it is theirs to do, and the deadline, which is the one
      fact nobody can work out for themselves: "a co-borrower invitation
      expires 5 calendar days after it is sent."
    */
    invited: {
      icon: <EmptyArt variant="plus" size={MARK} />,
      title: t("application.invitedTitle", { name: invitation?.invitedBy ?? "" }),
      subTitle: t("application.invitedBody", { date: invitation?.expiresOn ?? "" }),
      action: (
        <Button type="primary" size="large" onClick={onOpenInvitation}>
          {t("application.invitedAction")}
        </Button>
      ),
    },
    /* THEIR PART IS IN. Not the borrower's "you already have an application"
       — that sentence is about a door being closed, and this one is about a
       job being finished. The application carries on without them; what they
       keep is the right to see where it has got to. */
    assignedDone: {
      icon: <EmptyArt variant="check" size={MARK} />,
      title: t("application.assignedDoneTitle"),
      subTitle: t("application.assignedDoneBody"),
      action: (
        <Button type="primary" size="large" onClick={onViewStatus}>
          {t("application.assignedDoneAction")}
        </Button>
      ),
    },
    /*
      THE BORROWER HAS JUST FINISHED ONE, and that is what this is.

      It used to be drawn as a refusal — a waiting badge and "OPA takes one
      application at a time" — which is the WBS rule ("If a user already has a
      loan application, the new application should not be allowed") but not
      what brought them here. Almost nobody arrives on this tab trying to open
      a second application; they arrive having just sent the first one and
      wanting to know what happens next. So it is the same sheet-with-a-tick
      the confirmation screen uses, and the same news the co-borrower gets:
      it is in, OPA has it, here is where to watch it. The one-at-a-time rule
      is still said, in the sentence, where it belongs.
    */
    hasActive: {
      icon: <EmptyArt variant="check" size={MARK} />,
      title: t("application.blockedActiveTitle"),
      subTitle: t("application.blockedActiveBody"),
      action: (
        <Button type="primary" size="large" onClick={onResume}>
          {t("application.resume")}
        </Button>
      ),
    },
    notEligible: {
      icon: <EmptyArt variant="doc" size={MARK} />,
      title: t("application.blockedFlagTitle"),
      subTitle: t("application.blockedFlagBody"),
      action: (
        <Button size="large" onClick={onContact}>
          {t("nav.contact")}
        </Button>
      ),
    },
    needsInfo: {
      icon: <EmptyArt variant="doc" size={MARK} />,
      title: t("application.needsInfoTitle"),
      subTitle: t("application.needsInfoBody"),
      action: (
        <Button type="primary" size="large" onClick={onSendInformation}>
          {t("application.needsInfoAction")}
        </Button>
      ),
    },
    /*
      THE SAME STATE, WORDED FOR WHAT HAS ACTUALLY HAPPENED.

      "Your application needs a co-borrower — invite one" is true right up to
      the moment one is invited, and then it is not: the WBS has the system
      send the invitation itself when decisioning requires one, and the
      borrower may have sent it in the wizard. Telling somebody to invite
      a person they have already invited is the page failing to read its own
      record. So when an invitation is out it says whose it is and when it
      lapses — which is also what makes story 14's replace an informed choice
      rather than a guess.
    */
    coBorrowerNeeded: invitation
      ? {
          icon: <EmptyArt variant="plus" size={MARK} />,
          title: t("application.coBorrowerWaitingTitle"),
          subTitle: t("application.coBorrowerWaitingBody", {
            name: invitation.invitee,
            date: invitation.expiresOn,
          }),
          action: (
            <Button type="primary" size="large" onClick={onInviteCoBorrower}>
              {t("coBorrowerStep.replace")}
            </Button>
          ),
        }
      : {
          icon: <EmptyArt variant="plus" size={MARK} />,
          title: t("application.coBorrowerNeededTitle"),
          subTitle: t("application.coBorrowerNeededBody"),
          action: (
            <Button type="primary" size="large" onClick={onInviteCoBorrower}>
              {t("application.coBorrowerNeededAction")}
            </Button>
          ),
        },
    /*
      STORY 14, THE STATE THE BORROWER COMES BACK TO.

      "IF the co-borrower fails to meet underwriting requirements, system will
      be able to reset borrower application and allow new co-borrower to
      receive an invitation to apply."

      It is `coBorrowerNeeded` again in every mechanical sense, and it is a
      different message to receive. The person they picked was turned down,
      the application did not die with them, and the way on is somebody else.
      All three have to be said, because a borrower who is only told "invite a
      co-borrower" will reasonably think the first invitation failed to send.

      HOW FAR THE RESET GOES IS SETTLED, and not by the WBS, which says only
      "reset borrower application" and stops. The rest of the application
      survives; the co-borrower step is the only part redone. Confirmed on the
      project by the designer, and it is what the neighbouring story points at
      anyway ("they should be able to return to the PREVIOUS STEPS of their
      application process") — resetting a borrower's whole file over somebody
      else's credit would punish the wrong person.

      Recorded here because the document still does not say it: anybody reading
      the WBS alone will not find this, and the copy below depends on it.
    */
    coBorrowerFailed: {
      icon: <EmptyArt variant="plus" size={MARK} />,
      title: t("application.coBorrowerFailedTitle"),
      subTitle: t("application.coBorrowerFailedBody", { name: coBorrowerFailed ?? "" }),
      action: (
        <Button type="primary" size="large" onClick={onInviteCoBorrower}>
          {t("application.coBorrowerFailedAction")}
        </Button>
      ),
    },
    invitationClosed: {
      icon: <EmptyArt variant="plus" size={MARK} />,
      title: t("application.invitationClosedTitle"),
      subTitle: t("application.invitationClosedBody"),
      action: (
        <Button size="large" onClick={onContact}>
          {t("application.invitationClosedAction")}
        </Button>
      ),
    },
    /* A check did not answer. The WBS is explicit that this is not a refusal,
       so the screen says so and offers nothing to do about it: there is
       nothing the borrower can do, and a button that pretends otherwise would
       be a lie. The way out goes somewhere else in the product. */
    checkPaused: {
      icon: <EmptyArt variant="doc" size={MARK} />,
      title: t("application.checkPausedTitle"),
      subTitle: t("application.checkPausedBody"),
      action: (
        <Button size="large" onClick={onProfile}>
          {t("application.checkPausedAction")}
        </Button>
      ),
    },
    /* WBS: "the user is unable to proceed, they receive a message to call
       customer service." A phone number, not an explanation: the reason is a
       sanctions screening, which is neither the borrower's to argue with on a
       screen nor ours to publish on one. */
    stopped: {
      icon: <EmptyArt variant="doc" size={MARK} />,
      title: t("application.stoppedTitle"),
      subTitle: t("application.stoppedBody"),
      action: (
        <Button type="primary" size="large" href="tel:+18005550142">
          {t("application.stoppedAction")}
        </Button>
      ),
    },
  }[state];

  return (
    <Card style={s.card}>
      <Result
        style={styles.result}
        icon={content.icon}
        title={content.title}
        subTitle={content.subTitle}
        styles={{ title: s.title, subTitle: s.subTitle, extra: s.extra }}
        extra={content.action}
      />
    </Card>
  );
}

export default ApplicationGate;
