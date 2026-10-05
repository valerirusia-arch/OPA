// src/features/Auth/ui/IdentityStep.tsx
//
// The automated identity check that runs between "personal info" and account
// creation. The verification itself belongs to the Loan Decisioning epic
// (LexisNexis InstantID + OFAC); this is only the screen the applicant sees.
//
// WBS wording drives the three outcomes:
// - checking   — in progress
// - mismatch   — "the borrower should either update their data or leave"
// - unavailable — a technical failure BEFORE the account exists: try again
//   later or contact OPA Staff, no account and no application is created.
//
// Dumb: the status is a prop; this component never calls a service.

import { Alert, Button, Flex, Result, Spin, Typography, theme } from "antd";
import { useT } from "../../../shared/ui/i18n/useT";
import { GateScene } from "../../../shared/ui/scenes/GateScene";
import { getStyles, styles } from "./IdentityStep.styles";

export type IdentityStatus = "checking" | "verified" | "mismatch" | "unavailable";

export type IdentityStepProps = {
  status: IdentityStatus;
  onContinue?: () => void;
  onEditDetails?: () => void;
  onRetry?: () => void;
  /**
   * Leave and come back to this exact point.
   *
   * WBS: after a technical failure "the application shall remain in its
   * current state, OPA Staff shall be notified, and the borrower shall be
   * able to resume the application from the point where the failure occurred
   * once the issue is resolved". That promise needs a door: without one the
   * only thing on screen is a retry against a service that is down.
   */
  onFinishLater?: () => void;
  /** Back to the previous step — every step in the wizard offers one. */
  onBack?: () => void;
};

export function IdentityStep({
  status,
  onContinue,
  onEditDetails,
  onRetry,
  onFinishLater,
  onBack,
}: IdentityStepProps) {
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);

  if (status === "checking") {
    return (
      <Flex vertical align="center" style={styles.wrap}>
        <Spin size="large" />
        <Typography.Title level={3} style={styles.title}>
          {t("identity.checkingTitle")}
        </Typography.Title>
        <Typography.Text type="secondary" style={styles.description}>
          {t("identity.checkingDescription")}
        </Typography.Text>
      </Flex>
    );
  }

  if (status === "verified") {
    return (
      <Result
        icon={<GateScene name="identityVerified" />}
        title={t("identity.verifiedTitle")}
        subTitle={
          /* Two blocks, not one wrapping paragraph: the confirmation and what
             happens next are separate thoughts, and left to wrap on measure
             the break fell mid-clause. */
          <>
            <Typography.Text type="secondary" style={styles.line}>
              {t("identity.verifiedDescription")}
            </Typography.Text>
            <Typography.Text type="secondary" style={styles.line}>
              {t("identity.verifiedNext")}
            </Typography.Text>
          </>
        }
        styles={{
          title: s.resultTitle,
          subTitle: s.resultSubTitle,
          extra: s.resultExtra,
        }}
        extra={
          <Flex gap={12} justify="center">
            {onBack && (
              <Button size="large" onClick={onBack}>
                {t("common.back")}
              </Button>
            )}
            <Button
              type="primary"
              size="large"
              style={s.primaryAction}
              onClick={onContinue}
            >
              {t("common.continue")}
            </Button>
          </Flex>
        }
      />
    );
  }

  /* THE ONE REFUSAL IN REGISTRATION, and the only red state the WBS leaves
     room for. "No account was created" is NOT one: the WBS first wrote that a
     technical failure before account creation creates nothing, then updated
     itself — "The account should be created before the Identity verification
     is passed" — so by the time anything can fail, the account exists. What
     can fail is the person behind it, which is this.

     It reads as an outcome, like the verified state above and like the gate's
     own states, rather than as a banner over a form that is no longer there.

     It wears the SAME drawing as the verified state, in red: what succeeded or
     failed here is one person, and showing the same person either way is what
     makes the two screens one moment with two endings. */
  if (status === "mismatch") {
    return (
      <Result
        icon={<GateScene name="identityDeclined" />}
        title={t("identity.mismatchTitle")}
        subTitle={
          <Typography.Text type="secondary" style={styles.line}>
            {t("identity.mismatchDescription")}
          </Typography.Text>
        }
        styles={{
          title: s.resultTitle,
          subTitle: s.resultSubTitle,
          extra: s.resultExtra,
        }}
        extra={
          <Flex gap={12} justify="center">
            <Button type="primary" size="large" onClick={onEditDetails}>
              {t("identity.reviewDetails")}
            </Button>
            <Button size="large" href="mailto:support@opa.example">
              {t("identity.contactSupport")}
            </Button>
          </Flex>
        }
      />
    );
  }

  return (
    <Flex vertical style={styles.wrap}>
      <Alert
        type="warning"
        showIcon
        style={styles.alert}
        title={t("identity.errorTitle")}
        description={t("identity.errorDescription")}
      />
      <Flex gap={12} justify="center" style={styles.actions}>
        <Button type="primary" size="large" onClick={onRetry}>
          {t("identity.tryAgain")}
        </Button>
        {onFinishLater ? (
          <Button size="large" onClick={onFinishLater}>
            {t("identity.finishLater")}
          </Button>
        ) : null}
        <Button size="large" href="mailto:support@opa.example">
          {t("identity.contactStaff")}
        </Button>
      </Flex>
    </Flex>
  );
}

export default IdentityStep;
