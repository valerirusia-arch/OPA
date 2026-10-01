// src/features/Users/ui/UserFormModal.tsx
//
// WBS: "Assuming that admin should provide name and email to create an
// admin/underwriter and then the system shall send an email to the new user
// that would allow them to set their password."
//
// So the form is exactly name, email and role — there is no password field
// here, by design, and the same three fields are what an edit changes.
//
// Dumb: it collects values and hands them back. Sending the invitation is the
// caller's business.

import { useEffect } from "react";
import { Button, Flex, Form, Input, Modal, Select, Typography } from "antd";
import { useT } from "../../../shared/ui/i18n/useT";
import { useAuthRules } from "../../Auth/ui/validation";
import { useRoleOptions, type UserRole } from "./roles";
import { styles } from "./UserFormModal.styles";

export type UserFormValues = {
  name: string;
  email: string;
  role: UserRole;
};

export type UserFormModalProps = {
  open: boolean;
  /** "create" also explains the invitation; "edit" needs no explaining. */
  mode: "create" | "edit";
  initialValues?: UserFormValues;
  /**
   * True when this edit is on the ONLY admin left. The system must never be
   * left with no admin, so the Role field refuses to move off "admin" and says
   * why, under the field itself, rather than as a toast after the fact —
   * *"ერორი ინფუთის ქვემოთ დამიწეროს, რომ ბოლო ადმინია."*
   */
  isLastAdmin?: boolean;
  onSubmit?: (values: UserFormValues) => void;
  onCancel?: () => void;
};

export function UserFormModal({
  open,
  mode,
  initialValues,
  isLastAdmin = false,
  onSubmit,
  onCancel,
}: UserFormModalProps) {
  const t = useT();
  const rules = useAuthRules();
  const roleOptions = useRoleOptions();
  const [form] = Form.useForm<UserFormValues>();

  // The modal is reused for every row, so the fields are refilled each time it
  // opens rather than keeping whatever the previous user left behind.
  useEffect(() => {
    if (!open) return;
    form.resetFields();
    if (initialValues) form.setFieldsValue(initialValues);
  }, [open, initialValues, form]);

  return (
    <Modal open={open} onCancel={onCancel} footer={null} destroyOnHidden width={480}>
      {mode === "create" ? (
        <>
          <Typography.Title level={4} style={styles.title}>
            {t("users.newTitle")}
          </Typography.Title>
          <Typography.Text type="secondary" style={styles.subtitle}>
            {t("users.newSubtitle")}
          </Typography.Text>
        </>
      ) : (
        <Typography.Title level={4} style={styles.titleOnly}>
          {t("users.editTitle")}
        </Typography.Title>
      )}

      <Form
        form={form}
        layout="vertical"
        // Both triggers are offered; each RULE picks the one it needs — see
        // useAuthRules. "Required" clears on change, format checks on blur.
        validateTrigger={["onBlur", "onChange"]}
        onFinish={(values) => onSubmit?.(values)}
      >
        <Form.Item label={t("users.col.name")} name="name" rules={[rules.required()]} required>
          <Input size="large" autoComplete="off" />
        </Form.Item>

        <Form.Item label={t("field.email")} name="email" rules={rules.email} required>
          <Input
            size="large"
            placeholder={t("field.emailPlaceholder")}
            autoComplete="off"
          />
        </Form.Item>

        <Form.Item
          label={t("field.role")}
          name="role"
          rules={[
            rules.required(),
            {
              // The last admin cannot be moved off "admin". The error prints
              // under the field, and submit is blocked while it stands.
              validator: (_rule, value: UserRole) =>
                isLastAdmin && value && value !== "admin"
                  ? Promise.reject(new Error(t("users.lastAdmin")))
                  : Promise.resolve(),
            },
          ]}
          required
        >
          <Select size="large" options={roleOptions} placeholder={t("field.role")} />
        </Form.Item>

        <Flex gap={12} style={styles.actions}>
          <Button onClick={onCancel}>{t("common.cancel")}</Button>
          <Button type="primary" htmlType="submit">
            {t("users.save")}
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
}

export default UserFormModal;
