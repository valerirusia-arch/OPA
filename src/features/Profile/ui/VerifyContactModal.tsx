// src/features/Profile/ui/VerifyContactModal.tsx
//
// WBS: "When phone number/email are updated - the verification process should
// re-occur." Same one-time-code step as registration, shown as a modal over
// the profile so the user never loses their place.

import { Modal } from "antd";
import { VerifyCodeStep } from "../../Auth/ui/VerifyCodeStep";

export type VerifyContactModalProps = {
  open: boolean;
  channel: "email" | "phone";
  target: string;
  onCancel?: () => void;
  onVerified?: () => void;
  errorMessage?: string;
};

export function VerifyContactModal({
  open,
  channel,
  target,
  onCancel,
  onVerified,
  errorMessage,
}: VerifyContactModalProps) {
  return (
    <Modal open={open} onCancel={onCancel} footer={null} destroyOnHidden width={420}>
      <VerifyCodeStep
        channel={channel}
        target={target}
        errorMessage={errorMessage}
        onVerify={(code) => {
          console.log(`verify ${channel} code`, code);
          onVerified?.();
        }}
        onResend={() => console.log(`resend ${channel} code`)}
      />
    </Modal>
  );
}

export default VerifyContactModal;
