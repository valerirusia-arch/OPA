// src/features/Auth/ui/LoginForm.tsx
//
// WBS: "Login with email and password", including 'Remember me' and
// "Lock account after consecutive unsuccessful attempts to login".
//
// Dumb: every state it can be in — the error text, how many attempts remain,
// whether the account is locked, whether it is submitting — arrives as props.
// It reports the attempt through onSubmit and nothing else.

import { Alert, Button, Checkbox, Flex, Form, Input, Typography } from "antd";
import { useT } from "../../../shared/ui/i18n/useT";
import { useAuthRules } from "./validation";
import { styles } from "./LoginForm.styles";

export type LoginValues = {
  email: string;
  password: string;
  remember: boolean;
};

export type LoginFormProps = {
  onSubmit?: (values: LoginValues) => void;
  /** Navigation is emitted as callbacks so the form stays router-free. */
  onForgotPassword?: () => void;
  onCreateAccount?: () => void;
  submitting?: boolean;
  /** Failed attempt feedback, e.g. after a wrong password. */
  errorMessage?: string;
  /** WBS: the account locks after consecutive failed attempts. */
  locked?: boolean;
};

export function LoginForm({
  onSubmit,
  onForgotPassword,
  onCreateAccount,
  submitting,
  errorMessage,
  locked,
}: LoginFormProps) {
  const [form] = Form.useForm<LoginValues>();
  const t = useT();
  const rules = useAuthRules();
  const hasNotice = Boolean(locked || errorMessage);

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
      initialValues={{ remember: false }}
      onFinish={(values) => onSubmit?.(values)}
      disabled={locked}
    >
      <Form.Item label={t("field.email")} name="email" rules={rules.email}>
        <Input
          placeholder={t("field.emailPlaceholder")}
          autoComplete="email"
          size="large"
        />
      </Form.Item>

      <Form.Item
        label={t("field.password")}
        name="password"
        rules={[rules.required()]}
        style={styles.optionsRow}
      >
        <Input.Password
          placeholder={t("field.passwordPlaceholder")}
          autoComplete="current-password"
          size="large"
        />
      </Form.Item>

      <Flex
        align="center"
        justify="space-between"
        style={hasNotice ? styles.optionsToNotice : styles.optionsToSubmit}
      >
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>{t("login.rememberMe")}</Checkbox>
        </Form.Item>
        <Typography.Link onClick={onForgotPassword} style={{ whiteSpace: "nowrap" }}>
          {t("login.forgotPassword")}
        </Typography.Link>
      </Flex>

      {locked ? (
        <Alert
          type="warning"
          showIcon
          style={styles.alert}
          title={t("login.lockedTitle")}
          description={t("login.lockedDescription")}
        />
      ) : (
        errorMessage && (
          <Alert
            type="error"
            showIcon
            style={styles.alert}
            title={errorMessage}
          />
        )
      )}

      <Form.Item style={styles.submit}>
        <Button type="primary" htmlType="submit" size="large" block loading={submitting}>
          {t("login.submit")}
        </Button>
      </Form.Item>

      <Flex justify="center" gap={4} wrap style={styles.footer}>
        <Typography.Text type="secondary">{t("login.noAccount")}</Typography.Text>
        <Typography.Link onClick={onCreateAccount} style={{ whiteSpace: "nowrap" }}>
          {t("login.createAccount")}
        </Typography.Link>
      </Flex>
    </Form>
  );
}

export default LoginForm;
