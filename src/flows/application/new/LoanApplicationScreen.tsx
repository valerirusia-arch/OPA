// src/flows/application/new/LoanApplicationScreen.tsx
//
// Epic 3 — the borrower's application, the six steps the wireframes lay out:
// Income · Loan details · Co-borrower · Sign docs · Debit card · Submit.
//
// The order is not arbitrary and the WBS is what makes it so:
//
//   Income comes first because whether a co-borrower is REQUIRED depends on it
//   — a borrower who uploads nothing is told, on the co-borrower step, that the
//   choice has been made for them.
//
//   Loan details comes before signing because the document package the
//   borrower signs is generated per state and role, and signing before the loan
//   is chosen would sign for the wrong thing.
//
//   Submit is last, and story 7's household questions sit on it rather than
//   earlier: none of them decides anything about the loan, so they are asked
//   when they cost the applicant least.
//
// WBS story 13 — "move back and forth through the application process" — is why
// every step's answers live here rather than inside the step. Going back and
// forward again finds the form exactly as it was left.
//
// Dumb: local state, console.log, mock defaults. No fetching, no persistence.

import { useState, type ReactNode } from "react";
import { App, Modal } from "antd";
import { useNavigate } from "@tanstack/react-router";
import { AppHeader } from "../../../shared/ui/AppHeader";
import { borrowerNav } from "../../../shared/ui/navigation";
import { BorrowerInbox } from "../../notifications/BorrowerInbox";
import { useUnreadCount } from "../../notifications/notifications";
import { useT } from "../../../shared/ui/i18n/useT";
import { useCustomerViewer } from "../../../shared/ui/viewerRole";
import { SessionTimeoutModal } from "../../../features/Auth/ui/SessionTimeoutModal";
import {
  useIdleTimer,
  DEFAULT_IDLE_MS,
} from "../../../features/Auth/ui/useIdleTimer";
import { ConfirmModal } from "../../../shared/ui/ConfirmModal";
import { ApplicationWizard } from "../../../features/LoanApplication/ui/ApplicationWizard";
import { IncomeStep } from "../../../features/LoanApplication/ui/IncomeStep";
import { LoanDetailsStep } from "../../../features/LoanApplication/ui/LoanDetailsStep";
import {
  CoBorrowerStep,
  type CoBorrowerFormValues,
} from "../../../features/LoanApplication/ui/CoBorrowerStep";
import { SignDocsStep } from "../../../features/LoanApplication/ui/SignDocsStep";
import { DebitCardStep } from "../../../features/LoanApplication/ui/DebitCardStep";
import { SubmitStep } from "../../../features/LoanApplication/ui/SubmitStep";
import { ReviewStep } from "../../../features/LoanApplication/ui/ReviewStep";
import { useApplicationReview } from "../../../features/LoanApplication/ui/summary";
import {
  findApplicationType,
  useUscisOptions,
} from "../../../features/LoanApplication/ui/options";
import type {
  CardToken,
  CoBorrowerInvitation,
  HouseholdValues,
  IncomeValues,
  LoanDetailsValues,
} from "../../../features/LoanApplication/ui/types";
import {
  applyApplication,
  applyCard,
  applyInvitation,
  setStage,
} from "../../loan/loanRecord";

const STEP = {
  income: 0,
  loan: 1,
  coBorrower: 2,
  sign: 3,
  card: 4,
  household: 5,
  review: 6,
} as const;

/** WBS: an invitation expires five calendar days after it is sent. */
const INVITATION_DAYS = 5;
const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "short",
  year: "numeric",
};

export type LoanApplicationScreenProps = {
  userName?: string;
  /** Story 1: the package is generated from where the borrower lives. */
  state?: string;
  /**
   * Story 5: a co-borrower is invited "when required or desired". Which of the
   * two it is comes from Loan Decisioning, so it arrives as a prop.
   */
  requireCoBorrower?: boolean;
  /** The invited person already co-signs three applications — the WBS cap. */
  atSponsorLimit?: boolean;
  /**
   * Which step to open on. The wizard's rail only walks backwards, so without
   * this a reviewer has to fill four forms to look at the fifth — and a
   * Storybook story of one step could not exist at all.
   */
  initialStep?: number;
  idleMs?: number;
};

export default function LoanApplicationScreen({
  userName,
  state = "TX",
  requireCoBorrower = false,
  atSponsorLimit = false,
  initialStep,
  idleMs = DEFAULT_IDLE_MS,
}: LoanApplicationScreenProps) {
  const navigate = useNavigate();
  // Whoever the DevBar is pointed at, unless the caller names someone.
  const viewer = useCustomerViewer();
  /** WBS Notifications: what the bell's badge counts. */
  const unreadCount = useUnreadCount(viewer.role);
  const person = userName ?? viewer.name;
  const { message } = App.useApp();
  const t = useT();
  const { idle, reset: staySignedIn } = useIdleTimer(idleMs);

  const [step, setStep] = useState<number>(initialStep ?? STEP.income);
  const [income, setIncome] = useState<IncomeValues>();
  const [loan, setLoan] = useState<LoanDetailsValues>();
  const [coBorrower, setCoBorrower] = useState<CoBorrowerFormValues>();
  const [invitation, setInvitation] = useState<CoBorrowerInvitation>();
  const [replacing, setReplacing] = useState(false);
  const [signedOn, setSignedOn] = useState<string>();
  /**
   * Why the last invitation was refused, if it was.
   *
   * WBS assumption: "Co-borrowers can sponsor up to 3 borrowers." Only the
   * server can count somebody's existing sponsorships, so in the prototype
   * `atSponsorLimit` stands in for that answer and the refusal is rendered
   * from it — a reviewer can see the state without a back end.
   */
  const [sendError, setSendError] = useState<string>();
  const [card, setCard] = useState<CardToken>();
  const [household, setHousehold] = useState<HouseholdValues>();
  /**
   * Which step the review has opened in a dialog, if any.
   *
   * "Edit" used to move the wizard to that step, which meant correcting one
   * figure cost a walk back through every screen after it — and even returning
   * straight to the review left the reader looking at a different page, with
   * the list they were checking gone from under them.
   *
   * A dialog keeps the review on screen behind it. Change the figure, save,
   * and the row updates in place: the reader never leaves the thing they came
   * here to check.
   */
  const [editing, setEditing] = useState<number>();
  /**
   * A card entered INSIDE the review's dialog, before it has been saved.
   *
   * The card step is the one dialog where the change happens on a control of
   * its own — Repay hands a token back the moment its form is submitted — so
   * writing it straight onto the application made the dialog's footer a lie:
   * it still said "Done", nothing asked, and Cancel could not undo what had
   * already been written. The token lands here instead, and only the footer
   * moves it onto the application. Repay has still tokenised the card either
   * way; what is being agreed to is OPA STORING it.
   */
  const [cardDraft, setCardDraft] = useState<CardToken>();
  /**
   * A CARD ENTERED HERE IS ON FILE FROM THIS MOMENT.
   *
   * Repay tokenises it during the application on purpose — the integration
   * story collects it "during the loan application process… to support
   * subsequent loan repayment transactions" — so this token IS the saved
   * repayment method the payments page shows later. It used to stop at this
   * screen's `useState`, which left the borrower being asked to add,
   * on a payments page that said they had none,
   * a card that had already been given.
   */
  const saveCard = (token: CardToken) => {
    setCard(token);
    applyCard(token, "borrower");
  };

  /**
   * THE OPEN EDITOR HAS BEEN TOUCHED — one flag, every dialog.
   *
   * The rule the designer set, and it holds for all of them: *"save changes
   * არ უნდა მქონდეს იქამდე სანამ რაიმეს არ შევცვლი — უნდა იყოს Done ღილაკი და
   * არც ალერტს უნდა მიგდებდეს; როგორც კი დეტალს შევცვლი, Done უნდა გადაიქცეს
   * save changes ღილაკად."*
   *
   * So: untouched, the footer says Done, pressing it closes and nothing is
   * written and nothing is asked. Touched, it says Save changes and goes
   * through the confirmation. Every step reports its own edits through
   * `onDirty`; the card reports by handing over a token.
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

  /**
   * Reviewed on its own step, so nobody submits a figure they cannot see.
   * Each section knows which step to send them back to.
   */
  /* The label for what they chose to file, for the record the rest of the
     product reads. */
  const uscisOptions = useUscisOptions();

  const review = useApplicationReview({
    steps: {
      income: STEP.income,
      loan: STEP.loan,
      coBorrower: STEP.coBorrower,
      sign: STEP.sign,
      card: STEP.card,
      household: STEP.household,
    },
    income,
    loan,
    invitation,
    signedOn,
    card,
    household,
  });


  /**
   * Whether a co-borrower is compulsory. A PROP, not a derivation.
   *
   * It used to be computed here from "no income documents uploaded", which
   * was an invention: the WBS decides this in the Loan Decisioning epic, from
   * the credit score — "if credit score is between XXX and XXX, then email is
   * sent about requiring a co-borrower" — and that answer arrives long after
   * this screen. Story 5 gives this step "when required OR desired", so the
   * screen shows whichever state it is told about.
   */
  const coBorrowerRequired = requireCoBorrower;

  const today = () => new Date();
  const formatDate = (date: Date) => date.toLocaleDateString("en-US", DATE_FORMAT);

  const steps = [
    { key: "income", label: t("appStep.income") },
    { key: "loan", label: t("appStep.loan") },
    { key: "coBorrower", label: t("appStep.coBorrower") },
    { key: "sign", label: t("appStep.sign") },
    { key: "card", label: t("appStep.card") },
    { key: "household", label: t("appStep.household") },
    { key: "review", label: t("appStep.review") },
  ];

  const sendInvitation = (values: Required<Omit<CoBorrowerFormValues, "wantsCoBorrower">>) => {
    // WBS: "Co-borrowers can sponsor up to 3 borrowers." The count is the
    // server's to keep; the screen only renders the answer.
    if (atSponsorLimit) {
      setCoBorrower({ ...values, wantsCoBorrower: true });
      setSendError(
        t("coBorrowerStep.limitReached", {
          name: `${values.firstName} ${values.lastName}`,
        })
      );
      return;
    }

    const expires = today();
    expires.setDate(expires.getDate() + INVITATION_DAYS);
    setSendError(undefined);
    setCoBorrower({ ...values, wantsCoBorrower: true });
    setInvitation({ ...values, status: "pending", expiresOn: formatDate(expires) });
    message.success(t("coBorrowerStep.sent"));
  };

  /**
   * One definition per step, rendered in EITHER place.
   *
   * `done` is what happens when the step is finished: the wizard moves on, the
   * dialog closes. Keeping one definition means the review can never show a
   * form that has drifted from the one the wizard walks through.
   */
  const stepConfig = (done: (next: number) => void, dialog = false) => {
    /** In the dialog the buttons end an edit; in the wizard they move you on. */
    const labels = dialog
      ? {
          backLabel: t("common.cancel"),
          submitLabel: editorDirty ? t("review.saveChanges") : t("common.done"),
        }
      : undefined;
    /**
     * Back leaves the dialog rather than walking the wizard backwards — and
     * the FIRST step, which has nowhere to go back to in the wizard, still
     * needs a way out of the dialog.
     */
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
        /* Nothing was touched, so there is nothing to write over and nothing
           worth asking about: the footer was a way out, and it is used as
           one. */
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
    [STEP.income]: {
      title: t("income.title"),
      subtitle: t("income.subtitle"),
      body: (
        <IncomeStep
          labels={labels}
          onDirty={dialog ? () => setEditorDirty(true) : undefined}
          initialValues={income}
          onBack={back()}
          onSubmit={commit(setIncome, STEP.loan)}
        />
      ),
    },
    [STEP.loan]: {
      title: t("loanDetails.title"),
      subtitle: t("loanDetails.subtitle"),
      body: (
        <LoanDetailsStep
          labels={labels}
          onDirty={dialog ? () => setEditorDirty(true) : undefined}
          initialValues={loan}
          onBack={back(STEP.income)}
          onSubmit={commit(setLoan, STEP.coBorrower)}
        />
      ),
    },
    [STEP.coBorrower]: {
      title: t("coBorrowerStep.title"),
      subtitle: t("coBorrowerStep.subtitle"),
      body: (
        <CoBorrowerStep
          labels={labels}
          initialValues={coBorrower}
          invitation={invitation}
          required={coBorrowerRequired}
          sendError={sendError}
          onSend={sendInvitation}
          onReplace={() => setReplacing(true)}
          onDirty={dialog ? () => setEditorDirty(true) : undefined}
          onBack={dialog ? undefined : back(STEP.loan)}
          onSubmit={
            dialog
              ? commit(setCoBorrower, STEP.sign)
              : (values) => {
                  /* The wizard keeps what was typed even if no invitation was
                     sent from this step — the review has to show it. */
                  setCoBorrower(values);
                  done(STEP.sign);
                }
          }
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
          role="borrower"
          signedOn={signedOn}
          onSign={() => setSignedOn(formatDate(today()))}
          onBack={dialog ? undefined : back(STEP.coBorrower)}
          onSubmit={() => done(STEP.card)}
        />
      ),
    },
    /*
      THE ONE DIALOG WHOSE FOOTER CHANGES AS YOU USE IT.

      Nothing edited: "Done", and pressing it just closes — there is nothing to
      agree to. Enter a different card and the same button becomes "Save
      changes" and goes through the confirmation every other edit goes
      through, because at that point an answer already on the application is
      about to be written over. Cancel drops the new token and leaves the card
      that was there.
    */
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
                  /* The card's own control already handed a token over; the
                     footer is what puts it on the application. */
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
            console.log("application submitted", {
              income,
              loan,
              coBorrower,
              card,
              household,
            });
            /* The rest of the prototype has to agree: from here the borrower
               HAS an application under review, so /application stops offering
               a new one, /loan shows the application state instead of an
               empty page, and /payments stays empty until it is funded.
               Simulated, like the submit itself — nothing is sent.

               AND IT AGREES ABOUT WHICH LOAN. What they filed for and what it
               costs are their answers, not the mock's, so they go on the
               record and every figure derived from the amount follows. */
            const type = findApplicationType(loan?.applicationType);
            if (type) {
              applyApplication({
                amount: type.amount,
                uscisType:
                  uscisOptions.find((o) => o.value === loan?.uscisApplication)?.label ??
                  "",
                submittedOn: new Date().toLocaleDateString("en-US", DATE_FORMAT),
              });
            }
            /*
              AND IT AGREES ABOUT WHO ELSE IS ON IT.

              Submitting used to send every application to "under review",
              including one with an invitation out — so a borrower who had
              just invited somebody switched to that person and was told
              "Your part is done" about a form they had never opened.

              The WBS puts the application somewhere else in that case:
              "Applications requiring a co-borrower CANNOT PROCEED to
              underwriting until a qualified co-borrower has accepted the
              invitation and completed all required application steps." So it
              waits on them, and their own tab is the invitation. Underwriting
              starts when they submit their half.
            */
            if (invitation) {
              applyInvitation({
                invitedBy: person,
                invitee: `${invitation.firstName} ${invitation.lastName}`.trim(),
                inviteeEmail: invitation.email,
                expiresOn: invitation.expiresOn,
              });
              setStage("coBorrower");
            } else {
              setStage("review");
            }
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

      <ApplicationWizard
        steps={steps}
        current={step}
        title={content.title}
        subtitle={content.subtitle}
      >
        {content.body}
      </ApplicationWizard>

      {/* The review's editor. The step is the SAME component the wizard walks
          through — only its buttons are reworded, because here they end an
          edit rather than continue a journey. */}
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

      {/* WBS story 14: the previous invitation becomes inactive the moment a
          replacement is invited, so this asks before throwing it away. */}
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
          setCoBorrower({ wantsCoBorrower: true });
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
