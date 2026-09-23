// src/features/Auth/ui/VerifyCodeStep.tsx
//
// WBS: "Verify email" and "Verify phone number" — a one-time code sent to the
// address or number the user just entered. One component serves both, and the
// profile screens reuse it when contact details change (WBS: "When phone
// number/email are updated - the verification process should re-occur").
//
// Dumb: it owns the code the user is typing and the resend countdown, nothing
// else. Sending and checking the code are the caller's job.

import { useEffect, useState } from "react";
import { Alert, Button, Flex, Input, Typography } from "antd";
import { useT } from "../../../shared/ui/i18n/useT";
import { digitsOnly } from "./masks";
import { styles } from "./VerifyCodeStep.styles";

export const CODE_LENGTH = 6;

export type VerifyCodeStepProps = {
  /** "email" | "phone" — only used for the wording. */
  channel: "email" | "phone";
  /** The masked address or number the code went to. */
  target: string;
  onVerify?: (code: string) => void;
  onResend?: () => void;
  onBack?: () => void;
  verifying?: boolean;
  /** e.g. "That code is invalid or has expired." */
  errorMessage?: string;
  /** Seconds before "Resend" becomes available again. */
  resendSeconds?: number;
};

export function VerifyCodeStep({
  channel,
  target,
  onVerify,
  onResend,
  onBack,
  verifying,
  errorMessage,
  resendSeconds = 45,
}: VerifyCodeStepProps) {
  const t = useT();
  const [code, setCode] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(resendSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [secondsLeft]);

  const handleResend = () => {
    setSecondsLeft(resendSeconds);
    setCode("");
    onResend?.();
  };

  return (
    <Flex vertical style={styles.wrap}>
      <Typography.Title level={3} style={styles.title}>
        {channel === "email" ? t("verify.emailTitle") : t("verify.phoneTitle")}
      </Typography.Title>
      <Typography.Text type="secondary" style={styles.description}>
        {t("verify.sentTo", { length: CODE_LENGTH })}{" "}
        <Typography.Text strong>{target}</Typography.Text>.
      </Typography.Text>

      <Flex style={styles.otp}>
        <Input.OTP
          length={CODE_LENGTH}
          value={code}
          onChange={setCode}
          // onChange only fires once every box is filled; onInput keeps the
          // Verify button in step with what the user has typed so far.
          onInput={(digits) => setCode(digitsOnly(digits.join("")))}
          // The code is six digits. A letter is not a wrong code, it is not a
          // code at all — so it never lands in the field rather than being
          // accepted and rejected a click later. Covers pasting too.
          formatter={digitsOnly}
          // Numeric keypad on phones, without the spinners type="number" adds.
          type="tel"
          status={errorMessage ? "error" : undefined}
          styles={{ input: styles.otpInput }}
          autoFocus
        />
      </Flex>

      {errorMessage && (
        <Alert type="error" showIcon style={styles.alert} title={errorMessage} />
      )}

      <Button
        type="primary"
        size="large"
        block
        loading={verifying}
        disabled={code.length < CODE_LENGTH}
        onClick={() => onVerify?.(code)}
      >
        {t("verify.submit")}
      </Button>

      {/*
        STACKED UNDER THE BUTTON, CENTRED ON IT — *"ღილაკის ქვემოთ ჩაშალო, რომ
        იყოს ერთმანეთის ქვემოთ, აი ამ ღილაკს გაუცენტრე."* Side by side they sat
        at the two far edges of a 480px card, which reads as two unrelated
        controls rather than as the two ways out of one screen. In a column
        under the thing they are alternatives to, they are one short list.

        Change email first: it is the one somebody reaches for when the code is
        not coming at all, and resending to a wrong address never helps.
      */}
      <Flex vertical align="center" gap={4} style={styles.actions}>
        {onBack ? (
          <Button type="link" onClick={onBack}>
            {channel === "email" ? t("verify.changeEmail") : t("verify.changeNumber")}
          </Button>
        ) : null}
        <Button type="link" disabled={secondsLeft > 0} onClick={handleResend}>
          {secondsLeft > 0
            ? t("verify.resendIn", { seconds: secondsLeft })
            : t("verify.resend")}
        </Button>
      </Flex>
    </Flex>
  );
}

export default VerifyCodeStep;
