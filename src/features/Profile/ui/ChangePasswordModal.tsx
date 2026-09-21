// src/features/Profile/ui/ChangePasswordModal.tsx
//
// WBS: "Change password — the system shall allow authenticated users to change
// their password." An authenticated change asks for the current password; the
// emailed-link route is the separate "Reset password" story on the sign-in
// page, for people who cannot get in at all.
//
// Dumb: the modal owns the form, the caller owns what "save" means.

import { Alert, Button, Divider, Form, Input, Modal, Typography } from "antd";
import { useT } from "../../../shared/ui/i18n/useT";
import { useAuthRules } from "../../Auth/ui/validation";
import { styles } from "./ChangePasswordModal.styles";
import { passwordField } from "../../Auth/ui/passwordField.styles";

export type ChangePasswordValues = {
  currentPassword: string;
  password: string;
  confirmPassword: string;
};

export type ChangePasswordModalProps = {
  open: boolean;
  onCancel?: () => void;
  onSubmit?: (values: ChangePasswordValues) => void;
  submitting?: boolean;
  errorMessage?: string;
};

export function ChangePasswordModal({
  open,
  onCancel,
  onSubmit,
  submitting,
  errorMessage,
}: ChangePasswordModalProps) {
  const [form] = Form.useForm<ChangePasswordValues>();
  const t = useT();
  const rules = useAuthRules();

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title={t("changePassword.title")}
      destroyOnHidden
      footer={null}
    >
      <Typography.Text type="secondary" style={styles.subtitle}>
        {t("changePassword.subtitle")}
      </Typography.Text>

      <Form
        form={form}
        layout="vertical"
      // Both triggers are offered; each RULE picks the one it needs.
      // "Required" listens for changes, so an error clears the moment the
      // field is filled. Format rules listen for blur, so half a typed email
      // is never flagged mid-word. See useAuthRules.
      validateTrigger={["onBlur", "onChange"]}
        onFinish={(values) => onSubmit?.(values)}
      >
        <Form.Item
          label={t("changePassword.current")}
          name="currentPassword"
          rules={[rules.required(t("validation.currentPassword"))]}
        >
          <Input.Password styles={{ input: passwordField }} autoComplete="current-password" />
        </Form.Item>

        <Divider style={styles.divider} />

        <Form.Item
          label={t("reset.newPassword")}
          name="password"
          rules={rules.password}
        >
          <Input.Password
            styles={{ input: passwordField }}
            placeholder={t("reset.newPasswordPlaceholder")}
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item
          label={t("reset.confirmPassword")}
          name="confirmPassword"
          dependencies={["password"]}
          rules={rules.confirmPassword("password")}
        >
          <Input.Password
            styles={{ input: passwordField }}
            placeholder={t("reset.confirmPasswordPlaceholder")}
            autoComplete="new-password"
          />
        </Form.Item>

        {errorMessage && (
          <Alert type="error" showIcon style={styles.alert} title={errorMessage} />
        )}

        <Form.Item style={styles.submit}>
          <Button type="primary" htmlType="submit" block loading={submitting}>
            {t("reset.submit")}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ChangePasswordModal;
