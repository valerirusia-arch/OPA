// src/flows/set-password/SetPasswordScreen.tsx
//
// Epic 2 — "Set password": "When a new user is registered, the system shall
// send them an email with a link that allows the user to set their password."
//
// This is where that link lands. It is deliberately NOT the same screen as
// "Set a new password" (the forgotten-password flow): nobody arriving here has
// ever signed in, so there is no "back to sign in" to offer and the copy names
// the account they are about to activate.
//
// Dumb: the token in the URL is never validated here. An expired or already
// used invitation is a server answer Dev feeds in during integration.

import { useState } from "react";
import { Avatar, Button, Card, Form, Input, Result, Typography, theme } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { useNavigate } from "@tanstack/react-router";
import { useT } from "../../shared/ui/i18n/useT";
import { AuthLayout } from "../../features/Auth/ui/AuthLayout";
import { useAuthRules } from "../../features/Auth/ui/validation";
import { getStyles, styles } from "./SetPasswordScreen.styles";

type SetPasswordValues = { password: string; confirmPassword: string };

export type SetPasswordScreenProps = {
  /** The address the invitation was sent to — theirs to sign in with. */
  email?: string;
};

export default function SetPasswordScreen({
  email = "alex.goldbarg@opa.example",
}: SetPasswordScreenProps) {
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const s = getStyles(token);
  const t = useT();
  const rules = useAuthRules();
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <AuthLayout>
        <Card style={styles.panel}>
          <Result
            style={styles.result}
            icon={<Avatar size={56} icon={<CheckOutlined />} style={s.doneBadge} />}
            title={t("setPassword.doneTitle")}
            subTitle={t("setPassword.doneDescription")}
            styles={{
              title: s.resultTitle,
              subTitle: s.resultSubTitle,
              extra: s.resultExtra,
            }}
            extra={
              <Button type="primary" size="large" onClick={() => navigate({ to: "/" })}>
                {t("reset.goToSignIn")}
              </Button>
            }
          />
        </Card>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <Typography.Title level={2} style={styles.heading}>
        {t("setPassword.title")}
      </Typography.Title>
      <Typography.Text type="secondary" style={styles.subheading}>
        {t("setPassword.subtitle")}
      </Typography.Text>
      <Typography.Text type="secondary" style={styles.account}>
        {t("setPassword.forAccount", { email })}
      </Typography.Text>

      <Form
        layout="vertical"
        // Both triggers are offered; each RULE picks the one it needs — see
        // useAuthRules.
        validateTrigger={["onBlur", "onChange"]}
        onFinish={(values: SetPasswordValues) => {
          console.log("set password from invitation", values);
          setDone(true);
        }}
      >
        <Form.Item label={t("reset.newPassword")} name="password" rules={rules.password}>
          <Input.Password
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
            placeholder={t("reset.confirmPasswordPlaceholder")}
            autoComplete="new-password"
            size="large"
          />
        </Form.Item>

        <Form.Item style={styles.submit}>
          <Button type="primary" htmlType="submit" size="large" block>
            {t("setPassword.submit")}
          </Button>
        </Form.Item>
      </Form>
    </AuthLayout>
  );
}
