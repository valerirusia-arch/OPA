// src/flows/reset-password/ResetPasswordScreen.tsx
//
// Where the emailed reset link lands. Also the shape the Users management epic
// reuses for "Set password" from an invitation link.
//
// Dumb: the token in the URL is read but never validated here — an expired or
// already-used link is a server answer that Dev feeds in during integration.

import { useState } from "react";
import { Avatar, Button, Card, Form, Result, Typography, theme } from "antd";
import { ArrowLeftOutlined, CheckOutlined } from "@ant-design/icons";
import { useNavigate } from "@tanstack/react-router";
import { useT } from "../../shared/ui/i18n/useT";
import { AuthLayout } from "../../features/Auth/ui/AuthLayout";
import { useAuthRules } from "../../features/Auth/ui/validation";
import { getStyles, styles } from "./ResetPasswordScreen.styles";
import { PasswordField } from "../../features/Auth/ui/PasswordField";

type ResetValues = { password: string; confirmPassword: string };

export default function ResetPasswordScreen() {
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
            title={t("reset.doneTitle")}
            subTitle={t("reset.doneDescription")}
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
      {/* Top-left, like every other auth screen — a way back belongs before
          the form, not after the commit button. */}
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        style={styles.back}
        onClick={() => navigate({ to: "/" })}
      >
        {t("common.backToSignIn")}
      </Button>

      <Typography.Title level={2} style={styles.heading}>
        {t("reset.title")}
      </Typography.Title>
      <Typography.Text type="secondary" style={styles.subheading}>
        {t("reset.subtitle")}
      </Typography.Text>

      <Form
        layout="vertical"
      // Both triggers are offered; each RULE picks the one it needs.
      // "Required" listens for changes, so an error clears the moment the
      // field is filled. Format rules listen for blur, so half a typed email
      // is never flagged mid-word. See useAuthRules.
      validateTrigger={["onBlur", "onChange"]}
        onFinish={(values: ResetValues) => {
          console.log("set new password", values);
          setDone(true);
        }}
      >
        <Form.Item
          label={t("reset.newPassword")}
          name="password"
          rules={rules.password}
        >
          <PasswordField
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
          <PasswordField
              placeholder={t("reset.confirmPasswordPlaceholder")}
            autoComplete="new-password"
            size="large"
          />
        </Form.Item>

        <Form.Item style={styles.submit}>
          <Button type="primary" htmlType="submit" size="large" block>
            {t("reset.submit")}
          </Button>
        </Form.Item>
      </Form>
    </AuthLayout>
  );
}
