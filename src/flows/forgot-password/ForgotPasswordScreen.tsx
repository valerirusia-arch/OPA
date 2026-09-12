// src/flows/forgot-password/ForgotPasswordScreen.tsx
//
// Epic 1 — "Reset password": the system shall allow users to reset forgotten
// passwords through a verification process (email).
//
// Two states in one screen: ask for the address, then confirm we sent the link.
// The confirmation is deliberately worded so it does not reveal whether an
// account exists for that address.

import { useEffect, useState } from "react";
import { Avatar, Button, Card, Flex, Form, Input, Result, Typography, theme } from "antd";
import { ArrowLeftOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate } from "@tanstack/react-router";
import { useT } from "../../shared/ui/i18n/useT";
import { AuthLayout } from "../../features/Auth/ui/AuthLayout";
import { useAuthRules } from "../../features/Auth/ui/validation";
import { getStyles, styles } from "./ForgotPasswordScreen.styles";

const RESEND_SECONDS = 45;

export default function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const s = getStyles(token);
  const t = useT();
  const rules = useAuthRules();
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (!sentTo || secondsLeft <= 0) return;
    const timer = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [sentTo, secondsLeft]);

  if (sentTo) {
    return (
      <AuthLayout>
        {/* Outside the card, where every other auth screen keeps its way back. */}
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          style={styles.back}
          onClick={() => navigate({ to: "/" })}
        >
          {t("common.backToSignIn")}
        </Button>

        <Card style={styles.panel}>
          <Result
            style={styles.result}
            icon={<Avatar size={56} icon={<MailOutlined />} style={s.mailBadge} />}
            title={t("forgot.sentTitle")}
            subTitle={
              <>
                {t("forgot.sentBefore")}{" "}
                <Typography.Text strong>{sentTo}</Typography.Text>
                {t("forgot.sentAfter")}
              </>
            }
            styles={{
              title: s.resultTitle,
              subTitle: s.resultSubTitle,
              extra: s.resultExtra,
            }}
            extra={
              <Button
                type="primary"
                size="large"
                disabled={secondsLeft > 0}
                onClick={() => {
                  setSecondsLeft(RESEND_SECONDS);
                  console.log("resend reset link", sentTo);
                }}
              >
                {secondsLeft > 0
                  ? t("forgot.sendAgainIn", { seconds: secondsLeft })
                  : t("forgot.sendAgain")}
              </Button>
            }
          />
        </Card>

        {/* Prototype shortcut: there is no mailbox here, so this stands in for
            the applicant opening the link we just "sent". Outside the card and
            dashed, so it reads as scaffolding for the review — not a feature. */}
        <Flex justify="center" style={s.demoRow}>
          <Button
            type="dashed"
            icon={<MailOutlined />}
            onClick={() => navigate({ to: "/reset-password" })}
          >
            {t("forgot.openLinkDemo")}
          </Button>
        </Flex>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        style={styles.back}
        onClick={() => navigate({ to: "/" })}
      >
        {t("common.backToSignIn")}
      </Button>

      <Typography.Title level={2} style={styles.heading}>
        {t("forgot.title")}
      </Typography.Title>
      <Typography.Text type="secondary" style={styles.subheading}>
        {t("forgot.subtitle")}
      </Typography.Text>

      <Form
        layout="vertical"
      // Both triggers are offered; each RULE picks the one it needs.
      // "Required" listens for changes, so an error clears the moment the
      // field is filled. Format rules listen for blur, so half a typed email
      // is never flagged mid-word. See useAuthRules.
      validateTrigger={["onBlur", "onChange"]}
        onFinish={({ email }: { email: string }) => {
          console.log("request password reset", email);
          setSecondsLeft(RESEND_SECONDS);
          setSentTo(email);
        }}
      >
        <Form.Item label={t("field.email")} name="email" rules={rules.email}>
          <Input
            placeholder={t("field.emailPlaceholder")}
            autoComplete="email"
            size="large"
          />
        </Form.Item>
        <Form.Item style={styles.submit}>
          <Button type="primary" htmlType="submit" size="large" block>
            {t("forgot.submit")}
          </Button>
        </Form.Item>
      </Form>
    </AuthLayout>
  );
}
