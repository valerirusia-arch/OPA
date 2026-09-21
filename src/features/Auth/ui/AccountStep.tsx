// src/features/Auth/ui/AccountStep.tsx
//
// Registration step 3 of 3: the credentials.
//
// The email lives here rather than with the phone and address. It is not a
// contact channel in this product — it is what the borrower signs in with,
// and it is what the very next step verifies. Pairing it with the password
// is what makes the screen mean something.
//
// It comes last on purpose. Choosing a password is the only thing the form
// asks you to invent rather than recall, so it lands once the applicant has
// already invested two screens of effort.
//
// WBS: part of "Register" — email address and set password.
//
// Dumb: values in through `initialValues`, the completed step out through
// `onSubmit`. Server-decided errors ("this email is already registered")
// arrive as `fieldErrors`.

import { useEffect } from "react";
import { Alert, Form, Input, Typography } from "antd";
import { useT } from "../../../shared/ui/i18n/useT";
import { useAuthRules } from "./validation";
import { WizardActions } from "./WizardActions";
import { styles } from "./WizardStep.styles";
import { passwordField } from "./passwordField.styles";

export type AccountValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type AccountStepProps = {
  initialValues?: Partial<AccountValues>;
  onSubmit?: (values: AccountValues) => void;
  onBack?: () => void;
  submitting?: boolean;
  fieldErrors?: { name: keyof AccountValues; errors: string[] }[];
  formError?: string;
};

/** Everything that must be filled in before the step can be submitted. */
const REQUIRED = ["email", "password", "confirmPassword"] as const;

export function AccountStep({
  initialValues,
  onSubmit,
  onBack,
  submitting,
  fieldErrors,
  formError,
}: AccountStepProps) {
  const [form] = Form.useForm<AccountValues>();
  // Watching the form (rather than validating in an effect) keeps this a
  // plain render-time answer: has every required field been filled in?
  const watched = Form.useWatch([], form);
  const t = useT();
  const rules = useAuthRules();

  useEffect(() => {
    if (fieldErrors?.length) form.setFields(fieldErrors);
  }, [fieldErrors, form]);

  const ready = REQUIRED.every((name) => {
    const value = watched?.[name];
    return value !== undefined && value !== null && value !== "";
  });

  return (
    <Form
      form={form}
      layout="vertical"
      // Both triggers are offered; each RULE picks the one it needs.
      // "Required" listens for changes, so an error clears the moment the
      // field is filled. Format rules listen for blur, so half a typed email
      // is never flagged mid-word. See useAuthRules.
      validateTrigger={["onBlur", "onChange"]}
      style={styles.form}
      initialValues={initialValues}
      onFinish={(values) => onSubmit?.(values)}
    >
      <Typography.Title level={2} style={styles.title}>
        {t("register.accountTitle")}
      </Typography.Title>
      <Typography.Text type="secondary" style={styles.description}>
        {t("register.accountSubtitle")}
      </Typography.Text>

      <Form.Item label={t("field.email")} name="email" rules={rules.email}>
        <Input
          placeholder={t("field.emailPlaceholder")}
          autoComplete="email"
          size="large"
          autoFocus
        />
      </Form.Item>

      <Form.Item
        label={t("field.password")}
        name="password"
        rules={rules.password}
      >
        <Input.Password
          styles={{ input: passwordField }}
          placeholder={t("reset.newPasswordPlaceholder")}
          autoComplete="new-password"
          size="large"
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
          size="large"
        />
      </Form.Item>

      {formError && <Alert type="error" showIcon style={styles.alert} title={formError} />}

      <Form.Item style={styles.actions}>
        <WizardActions onBack={onBack} submitting={submitting} disabled={!ready} />
      </Form.Item>
    </Form>
  );
}

export default AccountStep;
