// src/flows/register/RegisterScreen.tsx
//
// Epic 1 — "Register", plus the verification and consent stories that the WBS
// makes part of the same flow:
//   1 Account  2 About you  3 Address  4 Identity  5 Email  6 Phone
//   7 Terms    8 Done
//
// The WBS fixes WHAT has to be collected before an account exists; it says
// nothing about how many screens that takes. Everything it lists is still
// here — it is split across three short screens instead of one long one,
// because fourteen fields in a single column is where applicants give up.
//
// The wireframes only drew the personal-details screen and its validation
// states; the rest is filled in from the WBS.
//
// Dumb screen: the wizard position, the collected values and the simulated
// identity check are local UI state. Nothing is fetched, stored or guarded.

import { useEffect, useState } from "react";
import { App, Card, Flex, Progress, Typography, theme } from "antd";
import { Link, useNavigate } from "@tanstack/react-router";
import { LanguageSwitcher } from "../../shared/ui/LanguageSwitcher";
import { useT } from "../../shared/ui/i18n/useT";
import { NEXT_PARAM, useNextDestination } from "../../shared/ui/nextDestination";
import {
  PersonalInfoStep,
  type PersonalInfoValues,
} from "../../features/Auth/ui/PersonalInfoStep";
import { AccountStep, type AccountValues } from "../../features/Auth/ui/AccountStep";
import { ContactStep, type ContactValues } from "../../features/Auth/ui/ContactStep";
import { IdentityStep, type IdentityStatus } from "../../features/Auth/ui/IdentityStep";
import { RegistrationDone } from "../../features/Auth/ui/RegistrationDone";
import { TermsStep } from "../../features/Auth/ui/TermsStep";
import { VerifyCodeStep } from "../../features/Auth/ui/VerifyCodeStep";
import { Logo } from "../../shared/ui/Logo";
import {
  footer,
  getStyles,
  page,
  stepsBar,
} from "./RegisterScreen.styles";

/** Everything the wizard has collected so far. */
type RegistrationValues = Partial<AccountValues & PersonalInfoValues & ContactValues>;

const STEP = {
  personal: 0,
  contact: 1,
  account: 2,
  identity: 3,
  email: 4,
  phone: 5,
  terms: 6,
  done: 7,
} as const;

/** Eight of them, and the count is the only thing the rail needs. */
const TOTAL_STEPS = Object.keys(STEP).length;


/** How long the simulated InstantID check "runs" in the prototype. */
const IDENTITY_CHECK_MS = 1400;

export default function RegisterScreen() {
  const { token } = theme.useToken();
  const styles = getStyles(token);
  const navigate = useNavigate();
  /** A co-borrower registering from an invitation goes back to it, not to
   *  their profile. Everyone else lands where they always did. */
  /* Same landing as sign-in, and for the same reason: a brand-new account
     opening on a details form is the page answering a question nobody asked.
     The dashboard's empty state is written for exactly this reader — nothing
     here yet, and here is how you start. */
  const next = useNextDestination("/dashboard");
  const { message } = App.useApp();
  const t = useT();

  const [step, setStep] = useState<number>(STEP.personal);
  const [values, setValues] = useState<RegistrationValues>({});
  const [identity, setIdentity] = useState<IdentityStatus>("checking");

  // Simulates the automated check so the flow is clickable end to end.
  useEffect(() => {
    if (step !== STEP.identity || identity !== "checking") return;
    const timer = window.setTimeout(() => setIdentity("verified"), IDENTITY_CHECK_MS);
    return () => window.clearTimeout(timer);
  }, [step, identity]);

  /** Keeps what was typed when the applicant steps back and forward again. */
  const advance = (next: Partial<RegistrationValues>, to: number) => {
    setValues((current) => ({ ...current, ...next }));
    setStep(to);
  };

  /**
   * The verification and consent steps are short; a narrow column reads better
   * than one stretched across the card. The form steps and the terms step use
   * the full width — they have fields and a document to show.
   */
  const narrow = step >= STEP.identity && step !== STEP.terms;

  const stepNumber = step + 1;
  const stepProgress = Math.round((stepNumber / TOTAL_STEPS) * 100);
  /** Blue while there is still road ahead; green once there is none. */
  const complete = stepProgress === 100;

  return (
    <Flex vertical style={page}>
      <Flex style={styles.header}>
        <div style={styles.headerInner}>
          <Link to="/">
            <Logo height={28} />
          </Link>


          <LanguageSwitcher size="small" />
        </div>
      </Flex>

      {/* Column: the card, then the way out underneath it. */}
      <Flex vertical align="center" style={styles.body}>
        <Card style={styles.card}>
          {/* The rail sits INSIDE the card, over the step it measures.
              In the header it was a third thing on a bar shared with the logo
              and the language switcher, floating above a card it had no visible
              relationship to. Here it reads as that card's own head — the same
              shape the loan application wizard uses, so a borrower meets one
              progress rail, not two.

              The step's NAME went with the move: the bar carries how far along,
              the count carries the number, and the card's own heading already
              says which step this is. In the header it was needed because the
              heading was too far away to do that job. */}
          <div style={styles.progress}>
            <Typography.Text type="secondary" style={styles.stepCount}>
              {t("register.stepCount", { current: stepNumber, total: TOTAL_STEPS })}
            </Typography.Text>
            <Progress
              percent={stepProgress}
              showInfo={false}
              size="small"
              strokeColor={complete ? token.colorSuccess : token.colorPrimary}
              railColor={token.colorFillSecondary}
              style={stepsBar}
            />
          </div>

          <div style={narrow ? styles.narrowInner : undefined}>
            {step === STEP.personal && (
              <PersonalInfoStep
                initialValues={values}
                onSubmit={(next) => advance(next, STEP.contact)}
              />
            )}

            {step === STEP.contact && (
              <ContactStep
                initialValues={values}
                onSubmit={(next) => advance(next, STEP.account)}
                onBack={() => setStep(STEP.personal)}
              />
            )}

            {step === STEP.account && (
              <AccountStep
                initialValues={values}
                onSubmit={(next) => {
                  /*
                    THE ACCOUNT IS CREATED HERE, before the identity check runs.

                    WBS, "Verify borrower identity", comments column: OPA asked
                    themselves "Applicant would need to create an account to be
                    able to resume. What is solution?" and answered it in the
                    same cell — "The description was updated. The account
                    should be created before the Identity verification is
                    passed."

                    The reason is the failure case beside it: "If a technical
                    failure occurs AFTER the borrower account has been created,
                    the application shall remain in its current state... and the
                    borrower shall be able to resume the application from the
                    point where the failure occurred." Nothing can be resumed
                    into an account that does not exist yet.

                    This is the second sentence of the story text, not a
                    contradiction of it: "identity verification happens on the
                    first step, before the account is created" describes when
                    the check STARTS. The account has to exist before it
                    RESOLVES, which is what the revision settles.
                  */
                  console.log("create account", { ...values, ...next });
                  setIdentity("checking");
                  advance(next, STEP.identity);
                }}
                onBack={() => setStep(STEP.contact)}
              />
            )}

            {step === STEP.identity && (
              <IdentityStep
                status={identity}
                onContinue={() => setStep(STEP.email)}
                onEditDetails={() => setStep(STEP.personal)}
                onRetry={() => setIdentity("checking")}
                onBack={() => setStep(STEP.account)}
                /* WBS: after a technical failure "the borrower shall be able
                   to resume the application from the point where the failure
                   occurred once the issue is resolved". Leaving is therefore a
                   real option here, not an abandonment. */
                onFinishLater={() => {
                  console.log("leave registration after a technical failure");
                  navigate({ to: "/" });
                }}
              />
            )}

            {step === STEP.email && (
              <VerifyCodeStep
                channel="email"
                target={values.email ?? t("verify.fallbackEmail")}
                onVerify={(code) => {
                  console.log("verify email code", code);
                  // A toast, not a banner on the next screen: it confirms the
                  // code worked — which the near-identical phone screen would
                  // otherwise leave in doubt — and then gets out of the way.
                  message.success(t("verify.emailVerified"));
                  setStep(STEP.phone);
                }}
                onResend={() => console.log("resend email code")}
                onBack={() => setStep(STEP.account)}
              />
            )}

            {step === STEP.phone && (
              <VerifyCodeStep
                channel="phone"
                target={values.phone ?? t("verify.fallbackPhone")}
                onVerify={(code) => {
                  console.log("verify phone code", code);
                  message.success(t("verify.phoneVerified"));
                  setStep(STEP.terms);
                }}
                onResend={() => console.log("resend phone code")}
                onBack={() => setStep(STEP.contact)}
              />
            )}

            {step === STEP.terms && (
              <TermsStep
                onAccept={() => {
                  // The account already exists — it was created before the
                  // identity check. This is the consent being recorded on it.
                  console.log("accept terms", values);
                  setStep(STEP.done);
                }}
              />
            )}

            {step === STEP.done && (
              <RegistrationDone
                email={values.email ?? ""}
                onPrimary={() => navigate({ to: next })}
              />
            )}
          </div>
        </Card>

        {/*
          The way out, on every step.

          It sat under step 1 only, on the assumption that somebody who already
          has an account would notice before they started typing. They do not:
          the moment it dawns on you is usually the moment a field asks for
          something you know you have already given. Registration is eight
          screens; realising it on the fifth should not mean five clicks back.

          Not on the last step, where the account has just been created and the
          button beside it goes to that account.
        */}
        {step !== STEP.done ? (
          <Flex justify="center" gap={4} style={footer}>
            <Typography.Text type="secondary">
              {t("register.haveAccount")}
            </Typography.Text>
            {/* A Typography.Link inside a router Link would nest one <a>
                inside another, so navigation goes through the callback. */}
            <Typography.Link
              onClick={() => navigate({ to: "/", search: { [NEXT_PARAM]: next } })}
            >
              {t("login.submit")}
            </Typography.Link>
          </Flex>
        ) : null}
      </Flex>
    </Flex>
  );
}
