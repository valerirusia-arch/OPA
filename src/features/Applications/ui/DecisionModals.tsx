// src/features/Applications/ui/DecisionModals.tsx
//
// The five things an Underwriter can do to an application, each behind a
// dialog that asks for what the WBS says must be recorded.
//
// WHICH REASONS ARE MANDATORY is not a design preference — the WBS says it
// outright, once per story:
//
//   Approve  — "Approval reason and timestamp are recorded."   → optional note
//   Decline  — "Decline reason is mandatory."                   → REQUIRED
//   Override — "Override reason is mandatory and recorded for audit purposes."
//                                                               → REQUIRED
//   Amount   — "All changes shall be logged with the previous value, updated
//              value, user, date, and reason for the modification."
//                                                               → REQUIRED
//   Request  — "Assuming the underwriter should provide a text note with the
//              required details."                               → REQUIRED
//
// So four of the five refuse to submit without a reason, and the one that does
// not says so on the field rather than leaving the reader to guess.
//
// Dumb: each reports what was entered. Nothing is sent.

import { Alert, Form, Input, Modal, Radio, Typography } from "antd";
import { useT } from "../../../shared/ui/i18n/useT";
import { useAuthRules } from "../../Auth/ui/validation";
import { RangeField } from "../../LoanApplication/ui/RangeField";
import { styles } from "./DecisionModals.styles";

/** One shell for all five, so they cannot drift into five different dialogs. */
type ShellProps = {
  open: boolean;
  title: string;
  body: string;
  submitLabel: string;
  danger?: boolean;
  onCancel?: () => void;
  children?: React.ReactNode;
  onFinish: (values: Record<string, unknown>) => void;
};

function ActionModal({
  open,
  title,
  body,
  submitLabel,
  danger,
  onCancel,
  children,
  onFinish,
}: ShellProps) {
  const [form] = Form.useForm();

  return (
    <Modal
      open={open}
      title={title}
      onCancel={onCancel}
      okText={submitLabel}
      okButtonProps={{ danger }}
      onOk={() => form.submit()}
      destroyOnHidden
      width={520}
      afterClose={() => form.resetFields()}
    >
      <Typography.Text type="secondary" style={styles.body}>
        {body}
      </Typography.Text>
      <Form
        form={form}
        layout="vertical"
        validateTrigger={["onBlur", "onChange"]}
        onFinish={onFinish}
        style={styles.form}
      >
        {children}
      </Form>
    </Modal>
  );
}

export type ApproveModalProps = {
  open: boolean;
  onCancel?: () => void;
  onApprove?: (note?: string) => void;
};

export function ApproveModal({ open, onCancel, onApprove }: ApproveModalProps) {
  const t = useT();

  return (
    <ActionModal
      open={open}
      title={t("approveModal.title")}
      body={t("approveModal.body")}
      submitLabel={t("appAction.approve")}
      onCancel={onCancel}
      onFinish={(values) => onApprove?.(values.note as string | undefined)}
    >
      {/* The one reason the WBS does NOT make mandatory. The hint says what
          happens to it, so an empty box is a choice and not an oversight. */}
      <Form.Item
        label={t("approveModal.reason")}
        name="note"
        extra={t("approveModal.reasonHint")}
      >
        <Input.TextArea rows={3} />
      </Form.Item>
    </ActionModal>
  );
}

export type DeclineModalProps = {
  open: boolean;
  onCancel?: () => void;
  onDecline?: (reason: string) => void;
};

export function DeclineModal({ open, onCancel, onDecline }: DeclineModalProps) {
  const t = useT();
  const rules = useAuthRules();

  return (
    <ActionModal
      open={open}
      title={t("declineModal.title")}
      body={t("declineModal.body")}
      submitLabel={t("appAction.decline")}
      danger
      onCancel={onCancel}
      onFinish={(values) => onDecline?.(values.reason as string)}
    >
      <Form.Item
        label={t("declineModal.reason")}
        name="reason"
        rules={[rules.required()]}
        required
        extra={t("declineModal.reasonHint")}
      >
        <Input.TextArea rows={3} autoFocus />
      </Form.Item>
    </ActionModal>
  );
}

export type OverrideModalProps = {
  open: boolean;
  /** What the rules decided, so the dialog can offer the other answer first. */
  current?: "approved" | "declined";
  onCancel?: () => void;
  onOverride?: (outcome: "approved" | "declined", reason: string) => void;
};

export function OverrideModal({
  open,
  current,
  onCancel,
  onOverride,
}: OverrideModalProps) {
  const t = useT();
  const rules = useAuthRules();

  return (
    <ActionModal
      open={open}
      title={t("overrideModal.title")}
      body={t("overrideModal.body")}
      submitLabel={t("appAction.override")}
      onCancel={onCancel}
      onFinish={(values) =>
        onOverride?.(values.outcome as "approved" | "declined", values.reason as string)
      }
    >
      <Form.Item
        label={t("overrideModal.outcome")}
        name="outcome"
        rules={[rules.requiredValue()]}
        required
        // The opposite of what the rules said: overriding to the same answer
        // is possible and sometimes right, but it is not the common case.
        initialValue={current === "approved" ? "declined" : "approved"}
      >
        <Radio.Group
          options={[
            { value: "approved", label: t("application.approved") },
            { value: "declined", label: t("application.declined") },
          ]}
        />
      </Form.Item>
      <Form.Item
        label={t("overrideModal.reason")}
        name="reason"
        rules={[rules.required()]}
        required
        extra={t("overrideModal.reasonHint")}
      >
        <Input.TextArea rows={3} />
      </Form.Item>
    </ActionModal>
  );
}

export type RequestInfoModalProps = {
  open: boolean;
  onCancel?: () => void;
  onRequest?: (note: string) => void;
};

export function RequestInfoModal({ open, onCancel, onRequest }: RequestInfoModalProps) {
  const t = useT();
  const rules = useAuthRules();

  return (
    <ActionModal
      open={open}
      title={t("requestModal.title")}
      body={t("requestModal.body")}
      submitLabel={t("requestModal.send")}
      onCancel={onCancel}
      onFinish={(values) => onRequest?.(values.note as string)}
    >
      <Form.Item
        label={t("requestModal.note")}
        name="note"
        rules={[rules.required()]}
        required
      >
        <Input.TextArea
          rows={4}
          autoFocus
          placeholder={t("requestModal.notePlaceholder")}
        />
      </Form.Item>
    </ActionModal>
  );
}

export type AmountModalProps = {
  open: boolean;
  requested: number;
  current?: number;
  onCancel?: () => void;
  onSave?: (amount: number, reason: string) => void;
};

export function AmountModal({
  open,
  requested,
  current,
  onCancel,
  onSave,
}: AmountModalProps) {
  const t = useT();
  const rules = useAuthRules();
  const money = `$${requested.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

  return (
    <ActionModal
      open={open}
      title={t("amountModal.title")}
      body={t("amountModal.body")}
      submitLabel={t("amountModal.save")}
      onCancel={onCancel}
      onFinish={(values) =>
        onSave?.(values.amount as number, values.reason as string)
      }
    >
      {/* What was asked for, kept on screen: the whole point of this dialog is
          the difference between the two numbers. */}
      <Alert
        type="info"
        showIcon
        style={styles.alert}
        title={`${t("amountModal.requested")}: ${money}`}
      />
      <Form.Item
        label={t("amountModal.newAmount")}
        name="amount"
        rules={[rules.amount()]}
        required
        initialValue={current ?? requested}
      >
        {/* The same field the borrower chose an amount with, so the two sides
            of the product speak about money the same way. */}
        <RangeField compact max={5_000} step={10} openEnded={false} />
      </Form.Item>
      <Form.Item
        label={t("amountModal.reason")}
        name="reason"
        rules={[rules.required()]}
        required
        extra={t("amountModal.reasonHint")}
      >
        <Input.TextArea rows={3} />
      </Form.Item>
    </ActionModal>
  );
}

