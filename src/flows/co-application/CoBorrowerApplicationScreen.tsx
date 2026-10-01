// src/flows/co-application/CoBorrowerApplicationScreen.tsx
//
// Epic 3 — the co-borrower's half: Account · Income · Sign docs · Debit card ·
// Submit. Five steps, not the borrower's six, and the two that are missing are
// missing for a reason the WBS gives:
//
//   No LOAN DETAILS — the loan was chosen by the borrower. Story 10 says the
//   co-borrower provides "all required personal and financial information
//   associated with the borrower's application"; they join an application,
//   they do not start one.
//
//   No CO-BORROWER step — a co-borrower does not invite a co-borrower.
//
// What is different rather than absent:
//
//   Nothing about the income step, in the end. Story 12 makes the upload
//   required — "the co-borrower SHALL upload all required supporting documents
//   to prove their income" — and so does the borrower's own story, so the step
//   is the same one.
//
//   The document package is the co-borrower's, not the borrower's. Story 1:
//   "different document packages are generated for Borrowers and Co-borrowers".
//
// The contact step confirms what the borrower already told OPA about them and
// collects the rest; the registration itself happened on the invitation link,
// through Epic 1's flow — which is exactly why the wizard carries a standing
// line naming whose application this is. Somebody who has just finished
// registering and is then asked for an address again will assume they are in a
// loop unless the screen says, plainly and on every step, that they are not.
//
// Dumb: local state, console.log, mock defaults.

import { useState, type ReactNode } from "react";
import { Flex, Modal, Typography } from "antd";
import { useNavigate } from "@tanstack/react-router";
import { AppHeader } from "../../shared/ui/AppHeader";
import { borrowerNav } from "../../shared/ui/navigation";
import { BorrowerInbox } from "../notifications/BorrowerInbox";
import { useUnreadCount } from "../notifications/notifications";
import { useT } from "../../shared/ui/i18n/useT";
import { useCustomerViewer } from "../../shared/ui/viewerRole";
import { SessionTimeoutModal } from "../../features/Auth/ui/SessionTimeoutModal";
import { useIdleTimer, DEFAULT_IDLE_MS } from "../../features/Auth/ui/useIdleTimer";
import { ApplicationWizard } from "../../features/LoanApplication/ui/ApplicationWizard";
import { ApplicationGate } from "../../features/LoanApplication/ui/ApplicationGate";
import { HeroBackdrop } from "../../shared/ui/HeroBackdrop";
import { InitialsAvatar } from "../../shared/ui/InitialsAvatar";
import { styles } from "./CoBorrowerApplicationScreen.styles";
import { ContactStep } from "../../features/Auth/ui/ContactStep";
import { IncomeStep } from "../../features/LoanApplication/ui/IncomeStep";
import { SignDocsStep } from "../../features/LoanApplication/ui/SignDocsStep";
import { DebitCardStep } from "../../features/LoanApplication/ui/DebitCardStep";
import { SubmitStep } from "../../features/LoanApplication/ui/SubmitStep";
import { ReviewStep } from "../../features/LoanApplication/ui/ReviewStep";
import { ConfirmModal } from "../../shared/ui/ConfirmModal";
import { useApplicationReview } from "../../features/LoanApplication/ui/summary";
import { applyCard, coBorrowerGateFor, setStage, useLoanRecord } from "../loan/loanRecord";
import type {
  CardToken,
  HouseholdValues,
  IncomeValues,
} from "../../features/LoanApplication/ui/types";

const STEP = { account: 0, income: 1, sign: 2, card: 3, household: 4, review: 5 } as const;

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "short",
  year: "numeric",
};

export type CoBorrowerApplicationScreenProps = {
  userName?: string;
  /** The borrower whose application this is — the co-borrower joined theirs. */
  invitedBy?: string;
  /** Story 1: the package follows where the CO-BORROWER lives. */
  state?: string;
  /**
   * Which step to open on. The wizard's rail only walks backwards, so without
   * this a reviewer has to fill four forms to look at the fifth — and a
   * Storybook story of one step could not exist at all.
   */
  initialStep?: number;
  idleMs?: number;
};

export default function CoBorrowerApplicationScreen({
  userName,
  invitedBy,
  state = "IL",
  initialStep,
  idleMs = DEFAULT_IDLE_MS,
}: CoBorrowerApplicationScreenProps) {
  const navigate = useNavigate();
  // Whoever the DevBar is pointed at, unless the caller names someone.
  const viewer = useCustomerViewer();
  /** WBS Notifications: what the bell's badge counts. */
  const unreadCount = useUnreadCount(viewer.role);
  const person = userName ?? viewer.name;
  const t = useT();
  const { idle, reset: staySignedIn } = useIdleTimer(idleMs);

  /**
   * THE APPLICATION IS ALREADY IN — so this is not a wizard any more.
   *
   * Finishing here used to change nothing outside this screen: /loan stayed
   * empty, and coming back to the Application tab dropped the co-borrower on
   * step 1 of a form they had just filled in, as if none of it had happened.
   * *"აპლიკაციაში რომ ვბრუნდები თავიდან მაწყებინებს ქო-ბოროვერის აპლიკაციას
   * რატომ?"*
   *
   * The borrower's side has always had this: `ApplicationGate` tells them
   * they already have one instead of offering the wizard again. This is the
   * same rule for the other half of the WBS's role column — with the state
   * that is theirs, because what they get back is not "you cannot start
   * another", it is story 4's "view the current application status".
   *
   * `initialStep` still wins, so Storybook and the DevBar can open any step.
   */
  const record = useLoanRecord();
  /**
   * Whose application this is.
   *
   * Read off the record rather than defaulted to a name of its own: a second
   * copy is a second answer, and this screen and the invitation card were
   * giving two. A prop still wins, for Storybook.
   */
  const borrowerName =
    invitedBy ?? record?.invitation?.invitedBy ?? record?.applicant ?? "";

  /**
   * WHICH STATE THIS TAB IS IN, and therefore whether there is a wizard at all.
   *
   * The demo dock walks the three application stages on this page, and all
   * three have to draw something different or the control is a lie:
   *
   *   no application  — NOBODY IS A CO-BORROWER YET. Being one is a
   *                     relationship to one application, and there is none,
   *                     so this reader is an ordinary borrower and gets the
   *                     ordinary offer: start one of your own. The wizard on
   *                     this route belongs to an invitation, and there isn't
   *                     one to belong to.
   *   waiting on them — THE INVITATION ITSELF, and then the wizard. The
   *                     invitation arrives by email and an email is easy to
   *                     lose, so opening this tab has to say the same thing
   *                     it said: whose application it is, that it is theirs
   *                     to start, and the date it lapses — "a co-borrower
   *                     invitation expires 5 calendar days after it is sent".
   *                     Dropping somebody straight into "Step 1 of 6" of
   *                     somebody else's application answers none of that.
   *                     *"სანამ ამას გავხსნი, რომ ვიცოდე სად ვარ."*
   *   under review    — their part is in, and story 4 leaves them the right
   *                     to see where it has got to.
   *   more info needed— an underwriter has asked for something.
   *
   * ON THAT LAST ONE the WBS's role column is worth reading carefully.
   * "Submit additional information" is written against the Borrower. But the
   * co-borrower's own stories give them the income documents and the card,
   * "Evaluate co-borrower eligibility" runs "the same checks for a co-borrower
   * as for a borrower", and the assumption note says they use "the same
   * document management functionality as the borrower". A request can
   * therefore be about THEIR paperwork, and a co-borrower who can see that
   * something is needed but cannot send it would be a dead end for the whole
   * application. So they get the state and the way to answer it.
   */
  /** Pressed "Start my part": the invitation stands down and the wizard opens. */
  const [started, setStarted] = useState(false);

  /* One derivation, shared with /application — this screen used to have its
     own, which is how a declined co-borrower ended up being handed the
     invitation screen again with the inviter's name blank. `started` is the
     one thing that is this screen's: the invitation turns into the wizard
     here, and nowhere else. */
  const base = coBorrowerGateFor(record);
  const gateState = base === "invited" && started ? undefined : base;
  const submitted = gateState !== undefined && initialStep === undefined;

  const [step, setStep] = useState<number>(initialStep ?? STEP.account);
  const [income, setIncome] = useState<IncomeValues>();
  const [signedOn, setSignedOn] = useState<string>();
  const [card, setCard] = useState<CardToken>();
  const [household, setHousehold] = useState<HouseholdValues>();
  /**
   * Which step the review has opened in a dialog, if any.
   *
   * A dialog keeps the review on screen behind it: change the figure, save,
   * and the row updates in place. "Edit" is not "start again", and moving the
   * wizard back to that step made it feel like it was.
   */
  const [editing, setEditing] = useState<number>();
  /**
   * What Repay handed back in the dialog, before it has been saved.
   *
   * Same reasoning as the borrower's screen: the card step's own control
   * returns a token the moment its form is submitted, and only the footer
   * puts it on the application.
   */
  const [cardDraft, setCardDraft] = useState<CardToken>();
  /**
   * A CARD ENTERED HERE IS ON FILE FROM THIS MOMENT.
   *
   * Repay tokenises it during the application on purpose — the integration
   * story collects it "during the loan application process… to support
   * subsequent loan repayment transactions" — so this token IS the saved
   * repayment method the payments page shows later. It used to stop at this
   * screen's `useState`, which left the co-borrower being asked to add,
   * on a payments page that said they had none,
   * a card that had already been given.
   */
  const saveCard = (token: CardToken) => {
    setCard(token);
    applyCard(token, "coBorrower");
  };

  /**
   * THE OPEN EDITOR HAS BEEN TOUCHED — one flag, every dialog.
   *
   * The rule the designer set for the borrower's review, and the same on this
   * side: untouched, the footer says Done, pressing it closes and nothing is
   * written and nothing is asked; touched, it says Save changes and goes
   * through the confirmation.
   */
  const [editorDirty, setEditorDirty] = useState(false);
  const closeEditor = () => {
    setEditing(undefined);
    setCardDraft(undefined);
    setEditorDirty(false);
  };

  /**
   * A change the applicant has made in the dialog but not yet agreed to save.
   *
   * The question belongs on SAVE, not on "Edit": pressing Edit has changed
   * nothing yet, so asking there is a toll on the way to a form. Pressing Save
   * is the moment an answer already on the application gets written over, and
   * that is what is worth a second look.
   *
   * Held as an object rather than a bare function so `setPendingSave` stores
   * it instead of running it as a state updater.
   */
  const [pendingSave, setPendingSave] = useState<{ apply: () => void }>();

  /** No loan or co-borrower section: neither was theirs to decide. */
  const review = useApplicationReview({
    steps: {
      income: STEP.income,
      sign: STEP.sign,
      card: STEP.card,
      household: STEP.household,
    },
    income,
    signedOn,
    card,
    household,
  });


  const formatDate = (date: Date) => date.toLocaleDateString("en-US", DATE_FORMAT);

  const steps = [
    { key: "account", label: t("appStep.account") },
    { key: "income", label: t("appStep.income") },
    { key: "sign", label: t("appStep.sign") },
    { key: "card", label: t("appStep.card") },
    { key: "household", label: t("appStep.household") },
    { key: "review", label: t("appStep.review") },
  ];

  /**
   * One definition per step, rendered in EITHER place — the wizard or the
   * review's dialog — so the two can never drift apart.
   */
  const stepConfig = (done: (next: number) => void, dialog = false) => {
    /** In the dialog the buttons end an edit; in the wizard they move you on. */
    const labels = dialog
      ? {
          backLabel: t("common.cancel"),
          submitLabel: editorDirty ? t("review.saveChanges") : t("common.done"),
        }
      : undefined;
    /** Back leaves the dialog rather than walking the wizard backwards. */
    const back = (previous?: number) =>
      dialog
        ? closeEditor
        : previous === undefined
          ? undefined
          : () => setStep(previous);

    /**
     * Finishing a step: the wizard moves on, the dialog asks first.
     *
     * The setter is deferred rather than run now — the whole point is that the
     * answer on the application is untouched until the applicant says so.
     */
    const commit =
      <T,>(save: (values: T) => void, next: number) =>
      (values: T) => {
        if (!dialog) {
          save(values);
          done(next);
          return;
        }
        /* Nothing touched: the footer was a way out, and it is used as one. */
        if (!editorDirty) {
          closeEditor();
          return;
        }
        setPendingSave({
          apply: () => {
            save(values);
            closeEditor();
          },
        });
      };

    /**
     * The steps whose dialog has nothing to SAVE.
     *
     * Inviting a co-borrower, signing and handing a card to Repay all take
     * effect the moment they happen, on their own button inside the step —
     * there is no pending edit for the footer to commit and none for Cancel to
     * throw away. "Cancel / Save changes" over them offers two choices that do
     * the same thing, and the confirmation would be asking about a change that
     * was made a moment ago. One button that closes, and it says so.
     */
    const doneOnly = dialog ? { submitLabel: t("common.done") } : labels;

    return {
    [STEP.account]: {
      title: t("coApp.accountTitle"),
      subtitle: t("coApp.accountSubtitle", { name: borrowerName }),
      // The same contact form the borrower filled at registration — story 10
      // says the co-borrower provides the same information.
      body: <ContactStep
          showHeading={false}
          backLabel={labels?.backLabel}
          submitLabel={labels?.submitLabel}
          onBack={back()} onSubmit={() => done(STEP.income)} />,
    },
    [STEP.income]: {
      title: t("income.title"),
      subtitle: t("income.subtitle"),
      body: (
        <IncomeStep
          labels={labels}
          onDirty={dialog ? () => setEditorDirty(true) : undefined}
          initialValues={income}
          onBack={back(STEP.account)}
          onSubmit={commit(setIncome, STEP.sign)}
        />
      ),
    },
    [STEP.sign]: {
      title: t("sign.title"),
      subtitle: t("sign.subtitle", { state }),
      body: (
        <SignDocsStep
          labels={doneOnly}
          state={state}
          role="coBorrower"
          signedOn={signedOn}
          onSign={() => setSignedOn(formatDate(new Date()))}
          onBack={dialog ? undefined : back(STEP.income)}
          onSubmit={() => done(STEP.card)}
        />
      ),
    },
    [STEP.card]: {
      title: t("card.title"),
      subtitle: t("card.subtitle"),
      body: (
        <DebitCardStep
          labels={labels}
          card={dialog ? (cardDraft ?? card) : card}
          onEnterCard={
            dialog
              ? (token) => {
                  setCardDraft(token);
                  setEditorDirty(true);
                }
              : saveCard
          }
          onReplaceCard={() => console.log("replace card")}
          onBack={dialog ? undefined : back(STEP.sign)}
          onSubmit={
            dialog
              ? () => {
                  if (!cardDraft) {
                    closeEditor();
                    return;
                  }
                  const saved = cardDraft;
                  setPendingSave({
                    apply: () => {
                      saveCard(saved);
                      closeEditor();
                    },
                  });
                }
              : () => done(STEP.household)
          }
        />
      ),
    },
    [STEP.household]: {
      title: t("submitStep.title"),
      subtitle: t("submitStep.subtitle"),
      body: (
        <SubmitStep
          labels={labels}
          onDirty={dialog ? () => setEditorDirty(true) : undefined}
          initialValues={household}
          onBack={back(STEP.card)}
          onSubmit={commit(setHousehold, STEP.review)}
        />
      ),
    },
    [STEP.review]: {
      title: t("review.title"),
      subtitle: t("review.subtitle"),
      body: (
        <ReviewStep
          sections={review}
          onEdit={setEditing}
          onBack={back(STEP.household)}
          onSubmit={() => {
            console.log("co-borrower application submitted", {
              income,
              card,
              household,
            });
            /* The rest of the prototype has to agree, exactly as it does when
               the borrower submits: from here there IS an application under
               review, so /loan shows it and this page stops offering the
               wizard. Simulated, like the submit itself — nothing is sent. */
            setStage("review");
            navigate({ to: "/application/submitted" });
          }}
        />
      ),
    },
    } as Record<number, { title: string; subtitle: string; body: ReactNode }>;
  };

  const content = stepConfig((next) => setStep(next))[step];
  const editor =
    editing === undefined ? undefined : stepConfig(closeEditor, true)[editing];

  const header = (
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
  );

  const timeout = (
    <SessionTimeoutModal
      open={idle}
      onStaySignedIn={staySignedIn}
      onSignOut={() => {
        console.log("session ended after inactivity");
        navigate({ to: "/" });
      }}
    />
  );

  if (submitted) {
    return (
      <>
        {header}
        {/* The same card the borrower's Application tab stands on, on the
            same ground: one state on an otherwise empty page. */}
        {/* `plain`, like every other borrower page — the coloured wash is gone
            from its twin on /application too, so the two gates match each other
            and the rest of the product. `center` stays: the card is placed in
            the window, not dropped at the top of it. */}
        <HeroBackdrop tone="plain" center paddingBlock={64}>
          <div style={{ ...styles.column, ...styles.lift }}>
            <ApplicationGate
              state={gateState}
              invitation={record?.invitation}
              onStart={() => navigate({ to: "/application/new" })}
              onOpenInvitation={() => setStarted(true)}
              onViewStatus={() => navigate({ to: "/loan" })}
              onSendInformation={() => navigate({ to: "/application/information" })}
            />
          </div>
        </HeroBackdrop>
        {timeout}
      </>
    );
  }

  return (
    <>
      {header}

      <ApplicationWizard
        steps={steps}
        current={step}
        context={
          <Flex align="center" gap={12}>
            <InitialsAvatar name={borrowerName} size={40} />
            <Flex vertical>
              <Typography.Text style={styles.contextTitle}>
                {t("coApp.contextTitle", { name: borrowerName })}
              </Typography.Text>
              <Typography.Text type="secondary" style={styles.contextBody}>
                {t("coApp.contextBody")}
              </Typography.Text>
            </Flex>
          </Flex>
        }
        title={content.title}
        subtitle={content.subtitle}
      >
        {content.body}
      </ApplicationWizard>

      {/* The review's editor: the same step, reworded for a dialog. */}
      <Modal
        open={editor !== undefined}
        title={editor?.title}
        onCancel={closeEditor}
        footer={null}
        width={640}
        destroyOnHidden
      >
        {editor?.body}
      </Modal>

      {/* Saving a change asks first.
          The summary is the applicant's last look at what they are about to
          send, and Save here writes over an answer that is already on the
          application. The question names the section, because the dialog was
          opened from a list of six. */}
      <ConfirmModal
        open={pendingSave !== undefined}
        title={t("review.confirmSaveTitle")}
        /* No section name in the sentence: the titles are proper names — "The
           loan", "Income" — and none of them survives being dropped into
           "your new … answers". The dialog is opened from inside a named
           editor, which is where the reader already is. */
        body={t("review.confirmSaveBody")}
        confirmLabel={t("review.saveChanges")}
        onConfirm={() => {
          pendingSave?.apply();
          setPendingSave(undefined);
        }}
        onCancel={() => setPendingSave(undefined)}
      />

      {timeout}
    </>
  );
}
