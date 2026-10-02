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

import { Button, Card, ConfigProvider, Flex, Result, Typography, theme } from "antd";
import { brand } from "../../../theme/tokens";
import { useT } from "../../../shared/ui/i18n/useT";
import { JourneyScene } from "./JourneyScene";
import { getStyles, styles } from "./ApplicationGate.styles";

/** Where a borrower's application has got to, as far as they need to know. */
export type ApplicationGateState =
  | "open"
  | "invited"
  | "assignedDone"
  /**
   * WHERE THE CO-BORROWER'S SIDE ENDS UP — three outcomes it did not have.
   *
   * `assignedDone` was the catch-all for every record that was not an
   * invitation or an information request, and it says "OPA is reviewing the
   * application now". So a co-borrower on a loan that had been APPROVED,
   * DECLINED, or paid off in full read that it was still under review —
   * measured on a repaid loan, where the sentence had been wrong for a
   * year. *"ქო-ბოროვერის მხარეს, როცა აპლიკაცია მორჩება, საერთოდ უნდა რამე
   * სტეიტი."*
   *
   * THE WBS ASKS FOR THIS, which is why they are states and not a nicety.
   * "View application status and details" carries Borrower/Co-borrower in its
   * role column and lists the statuses owed: "Submitted, Under Review,
   * Pending action, APPROVED, DECLINED". Two of the five had nowhere to show.
   */
  | "assignedActive"
  | "assignedClosed"
  | "assignedSettled"
  /**
   * APPROVED, AND REFUSED — the borrower's own two, which it did not have.
   *
   * `gateFor` sent a declined application to `open`, so the page that should
   * have broken the news offered to start another as though nothing had
   * happened; and everything past the decision fell to `hasActive`, whose
   * words are "OPA is reviewing your application now" — said to somebody
   * whose loan was already approved and being set up.
   *
   * The co-borrower has had both since their own pass. They carry the same
   * marks on both sides, which is the point: a green check on approval and
   * the amber cross on a refusal, whoever is reading. *"ეს უნდა იყოს ორივეგან
   * ერთი და იგივე, ბოროვერზეც და ქო-ბოროვერზეც."* What differs is the way
   * out, because only the borrower has one.
   */
  | "approved"
  | "declined"
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

  /*
    THE ONE GREEN BUTTON IN THE PRODUCT, and both states that end a loan use
    it.

    Every primary action here is the site's burnt orange, which is the colour
    of "do the thing" — apply, sign, pay. This one is not asking for anything:
    it acknowledges that the loan is over. *"მინდა რომ ღილაკი მწვანე ფერი
    იყოს, ან რამე Done."*

    Themed through `ConfigProvider` rather than styled with a background,
    because a solid button needs a hover and an active state as well, and antd
    derives all three from `colorPrimary` once it is told what green means
    here.

    The co-borrower's settled state takes the same one. It used the ordinary
    outline button and "See the application", which made the end of a loan
    look like a link on a page rather than the end of something — and the two
    sides were saying the same news two ways: *"ქო-ბოროვერზე იგივე CTA
    მინდა."*
  */
  const closeButton = (
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
  );

  /*
    EVERY WAY FORWARD IS THE ORANGE BUTTON.

    Four of these were the outline button, on the reasoning that a state with
    nothing much to do should not shout. On the page it read as the opposite:
    the one control on an otherwise empty screen, drawn as the quiet
    alternative to a primary that was not there — a dead end with a disabled
    look. *"CTA იყოს სულ ნარინჯისფერი, რა იქნება ეს თეთრი."*

    The only exception stays green, and it is not an exception to this rule:
    `closeButton` is a primary too, themed rather than demoted, because it
    acknowledges an ending instead of asking for anything.
  */
  const content = {
    /* EVERY STATE GETS THE DRAWING, and it is the same packet in all of them
       — what differs is the badge on it, which is exactly the difference
       between these states. Four of them used to be a 56px antd icon in a
       grey avatar, so half the page's states looked like a different product
       from the other half.

       In COLOUR, unlike the empty states, and the line is drawn deliberately:
       an empty state is a place where nothing has happened and its picture
       must not compete with the way out, but every state on this page is a
       journey somebody is already on. See JourneyScene. */
    open: {
      icon: <JourneyScene variant="act" size={MARK} />,
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
      icon: <JourneyScene variant="done" size={MARK} />,
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
      action: closeButton,
    },
    /*
      INVITED, AND NOT STARTED. The invitation is an email, and an email is
      easy to lose — so the site says the same thing the email said. Who it
      belongs to, that it is theirs to do, and the deadline, which is the one
      fact nobody can work out for themselves: "a co-borrower invitation
      expires 5 calendar days after it is sent."
    */
    invited: {
      /* THE PERSON WHO ASKED, not the loan's paperwork. This is the first
         thing a co-borrower ever sees, and what it is about is somebody
         inviting them — a document with a "+" on it said "start a form".
         *"აი ბოროვერი უნდა იყოს ილუსტრაციაზე, ვინმე კაცუნა რომელმაც მოწვევა
         გამოგიგზავნა."* */
      icon: <JourneyScene variant="invite" size={MARK} />,
      title: t("application.invitedTitle", { name: invitation?.invitedBy ?? "" }),
      /*
        TWO LINES, AND THE SECOND IS THE DEADLINE.

        It was one sentence, and it came out one line: it wants 476px against
        the 480 measure these Results are set to, so it cleared the cap by
        four pixels and never broke — *"ჩამოდროპე ცოტა საბთაითლი."* Narrowing
        the measure would have fixed this string and broken on the Spanish,
        which runs longer; splitting at the full stop that is already there
        holds whatever either language does.

        It is also the better break. The date is the one thing on this screen
        a reader comes back to look for, and on its own line with the sentence
        that frames it, it can be found without reading. A shade darker than
        that sentence, too — in the subtitle's grey it read as the least
        important word in the line. Set as its own run rather than markup
        inside the string, so no translator has to carry it.
      */
      subTitle: (
        <>
          <Typography.Text style={styles.subLine}>
            {t("application.invitedBody")}
          </Typography.Text>
          <Typography.Text style={styles.subLine}>
            {t("application.invitedExpires")}{" "}
            <Typography.Text style={s.emphasis}>
              {invitation?.expiresOn ?? ""}
            </Typography.Text>
          </Typography.Text>
        </>
      ),
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
      /* THE CLOCK TOO, and that is a judgement worth stating. The title
         congratulates the co-borrower — their part IS in — but the drawing is
         of the APPLICATION, and the application is being read. Its own body
         says so in the same words `hasActive` uses, so the two screens cannot
         carry different badges over the same sentence. */
      icon: <JourneyScene variant="review" size={MARK} />,
      title: t("application.assignedDoneTitle"),
      subTitle: t("application.assignedDoneBody"),
      action: (
        <Button type="primary" size="large" onClick={onViewStatus}>
          {t("application.assignedDoneAction")}
        </Button>
      ),
    },
    /* APPROVED, and the co-borrower is told so rather than left on
       "reviewing". They do not own the loan's controls — signing, the card,
       cancelling are the borrower's — so this says where it got to and
       points at the page that keeps saying. */
    assignedActive: {
      icon: <JourneyScene variant="done" size={MARK} />,
      title: t("application.assignedActiveTitle"),
      subTitle: t("application.assignedActiveBody"),
      action: (
        <Button type="primary" size="large" onClick={onViewStatus}>
          {t("application.assignedDoneAction")}
        </Button>
      ),
    },
    /* DECLINED, or cancelled by the borrower. One state for the two because
       what the co-borrower has to do about either is the same — nothing —
       and a sentence that guessed between them would be the page claiming to
       know something it is not told. No badge: an ending with nothing to act
       on is not an alert. */
    assignedClosed: {
      /* The same cross the borrower's `declined` wears — one refusal, drawn
         one way, whichever side is reading it. */
      icon: <JourneyScene variant="declined" size={MARK} />,
      /* THE BORROWER'S OWN WORDS. It had a pair of its own saying the same
         thing differently — "This application is closed. OPA is not going
         ahead with it. There is nothing left for you to do here." One piece
         of news, one way of saying it, whichever side is reading: *"ესენი
         უნდა იყოს ბოროვერშიც და ქო-ბოროვერშიც იგივე."* Only the button
         differs, because only the borrower can start another. */
      title: t("application.declinedTitle"),
      subTitle: t("application.declinedBody"),
      /* ACKNOWLEDGING IT ENDS IT. "See the application" sent them to look at
         a refusal they had just been told about; nothing there changes
         anything. Pressing this closes the record, and with it the only
         thing that made this reader a co-borrower — so the next screen they
         get is the one any signed-in person with no application gets. */
      action: (
        <Button type="primary" size="large" onClick={onCloseApplication}>
          {t("application.acknowledge")}
        </Button>
      ),
    },
    /* PAID OFF. The borrower's own `repaid` cannot be reused here: it offers
       to close the file and start another, and neither is the co-borrower's
       to do. What is theirs is knowing it is over. */
    assignedSettled: {
      icon: <JourneyScene variant="done" size={MARK} />,
      title: t("application.assignedSettledTitle"),
      subTitle: t("application.assignedSettledBody"),
      action: closeButton,
    },
    /* APPROVED. The green check, the same one the co-borrower's side shows
       for this, because it is the same news. */
    approved: {
      icon: <JourneyScene variant="done" size={MARK} />,
      title: t("application.approvedTitle"),
      subTitle: t("application.approvedBody"),
      action: (
        <Button type="primary" size="large" onClick={onViewStatus}>
          {t("application.approvedAction")}
        </Button>
      ),
    },
    /* REFUSED. It went to `open` before, which offered a new application
       without ever saying the last one had been turned down — and the WBS
       does not stop them applying again, so the way out stays. It is the
       news that was missing, not the action. */
    declined: {
      icon: <JourneyScene variant="declined" size={MARK} />,
      title: t("application.declinedTitle"),
      subTitle: t("application.declinedBody"),
      action: (
        <Button type="primary" size="large" onClick={onStart}>
          {t("application.declinedAction")}
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
      /* A CLOCK, NOT A GREEN CHECK. This page says "OPA is reviewing your
         application now", and it was wearing the mark a loan repaid in full
         wears. Green and a tick mean finished; nothing here is. */
      icon: <JourneyScene variant="review" size={MARK} />,
      title: t("application.blockedActiveTitle"),
      subTitle: t("application.blockedActiveBody"),
      action: (
        <Button type="primary" size="large" onClick={onResume}>
          {t("application.resume")}
        </Button>
      ),
    },
    notEligible: {
      icon: <JourneyScene variant="waiting" size={MARK} />,
      title: t("application.blockedFlagTitle"),
      subTitle: t("application.blockedFlagBody"),
      action: (
        <Button type="primary" size="large" onClick={onContact}>
          {t("nav.contact")}
        </Button>
      ),
    },
    needsInfo: {
      /* AMBER, NOT THE NO-BADGE WAIT. `waiting` means filed and not your
         move, and this is the opposite: somebody has asked for something,
         there is a primary button to go and send it, and the body says in
         as many words that "your application waits here until it arrives".
         An application stalled on the reader is the definition of a state
         that wants attention — *"რატომ არ ჩანს აქ ნარინჯისფერი, როცა
         ეუბნება რომ სხვებიც უნდა?"*

         Both sides get it: the borrower and the co-borrower share this
         state, and the request lands on whichever of them is reading. */
      icon: <JourneyScene variant="attention" size={MARK} />,
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
          /* A FIGURE, NOT A WARNING. What this page is waiting for is a
             PERSON — nothing has gone wrong and nothing is asked of the
             borrower — and an exclamation mark over that alarms a reader
             about a state that is simply in progress. */
          icon: <JourneyScene variant="person" size={MARK} />,
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
          icon: <JourneyScene variant="act" size={MARK} />,
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
      /* A CROSS: this one WAS reviewed and did not pass, which the "!" it
         shared with the waiting state was too mild to say. Still amber and
         not red — nothing filled in is lost and another invitation carries
         it on, and red would make a detour read as a dead end. */
      icon: <JourneyScene variant="failed" size={MARK} />,
      title: t("application.coBorrowerFailedTitle"),
      subTitle: t("application.coBorrowerFailedBody", { name: coBorrowerFailed ?? "" }),
      action: (
        <Button type="primary" size="large" onClick={onInviteCoBorrower}>
          {t("application.coBorrowerFailedAction")}
        </Button>
      ),
    },
    invitationClosed: {
      /* THE SAME CROSS THE BORROWER SEES for this. It wore the "+" the start
         screen wears, which offered to add something to a page whose own
         sentence says there is nothing left to do — and then, briefly, no
         badge at all, which said nothing where something had happened. One
         event, one mark: their co-borrower did not qualify, which from this
         side is an invitation that is over. */
      icon: <JourneyScene variant="failed" size={MARK} />,
      title: t("application.invitationClosedTitle"),
      subTitle: t("application.invitationClosedBody"),
      /*
        ACKNOWLEDGE FIRST, ASK SECOND.

        "Contact us" was the only button, which made getting in touch the
        thing this page wanted — and for most readers it is not: the
        invitation is over, they have been told, and that is the end of it.
        The same "Got it" the refused application has takes the primary slot
        and does the same work, closing the record and releasing them.

        Contact drops to a line of text under it, where a second option
        belongs: available to the reader who wants it, and not in the way of
        the one who does not.
      */
      action: (
        <Flex vertical align="center" gap={12}>
          <Button type="primary" size="large" onClick={onCloseApplication}>
            {t("application.acknowledge")}
          </Button>
          <Button type="link" style={styles.secondaryLink} onClick={onContact}>
            {t("application.invitationClosedAction")}
          </Button>
        </Flex>
      ),
    },
    /* A check did not answer. The WBS is explicit that this is not a refusal,
       so the screen says so and offers nothing to do about it: there is
       nothing the borrower can do, and a button that pretends otherwise would
       be a lie. The way out goes somewhere else in the product. */
    checkPaused: {
      icon: <JourneyScene variant="waiting" size={MARK} />,
      title: t("application.checkPausedTitle"),
      subTitle: t("application.checkPausedBody"),
      action: (
        <Button type="primary" size="large" onClick={onProfile}>
          {t("application.checkPausedAction")}
        </Button>
      ),
    },
    /* WBS: "the user is unable to proceed, they receive a message to call
       customer service." A phone number, not an explanation: the reason is a
       sanctions screening, which is neither the borrower's to argue with on a
       screen nor ours to publish on one. */
    stopped: {
      icon: <JourneyScene variant="waiting" size={MARK} />,
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
