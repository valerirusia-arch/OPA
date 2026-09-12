// src/features/Auth/ui/SessionTimeoutModal.tsx
//
// WBS, under "Logout": "Includes session timeout. The system shall
// automatically terminate an inactive user session after a configurable period
// of inactivity."
//
// Warning first, then sign-out — an unannounced logout in the middle of a loan
// application loses the applicant's work and their trust.
//
// Dumb: the countdown is local UI state; deciding what "sign out" and "stay
// signed in" actually do is the caller's job. The countdown lives in a child
// that only mounts while the modal is open, so it always starts fresh.

import { useEffect, useState } from "react";
import { Button, Flex, Modal, Progress, Typography } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { useT } from "../../../shared/ui/i18n/useT";
import { styles } from "./SessionTimeoutModal.styles";

export type SessionTimeoutModalProps = {
  open: boolean;
  /** Seconds the user has to respond before being signed out. */
  graceSeconds?: number;
  onStaySignedIn?: () => void;
  onSignOut?: () => void;
};

type CountdownProps = Required<Pick<SessionTimeoutModalProps, "graceSeconds">> &
  Pick<SessionTimeoutModalProps, "onStaySignedIn" | "onSignOut">;

function Countdown({ graceSeconds, onStaySignedIn, onSignOut }: CountdownProps) {
  const t = useT();
  const [secondsLeft, setSecondsLeft] = useState(graceSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onSignOut?.();
      return;
    }
    const timer = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [secondsLeft, onSignOut]);

  return (
    <Flex vertical align="center" style={styles.wrap}>
      <ClockCircleOutlined style={styles.icon} />
      <Typography.Title level={4} style={styles.title}>
        {t("session.title")}
      </Typography.Title>
      <Typography.Text type="secondary" style={styles.description}>
        {secondsLeft === 1
          ? t("session.descriptionOne")
          : t("session.description", { seconds: secondsLeft })}
      </Typography.Text>

      <Progress
        percent={Math.round((secondsLeft / graceSeconds) * 100)}
        showInfo={false}
        size="small"
        status={secondsLeft <= 10 ? "exception" : "active"}
      />

      <Flex gap={12} style={styles.actions}>
        <Button onClick={onSignOut}>{t("session.signOutNow")}</Button>
        <Button type="primary" onClick={onStaySignedIn}>
          {t("session.staySignedIn")}
        </Button>
      </Flex>
    </Flex>
  );
}

export function SessionTimeoutModal({
  open,
  graceSeconds = 60,
  onStaySignedIn,
  onSignOut,
}: SessionTimeoutModalProps) {
  return (
    <Modal
      open={open}
      closable={false}
      mask={{ closable: false }}
      keyboard={false}
      centered
      destroyOnHidden
      footer={null}
      width={420}
    >
      <Countdown
        graceSeconds={graceSeconds}
        onStaySignedIn={onStaySignedIn}
        onSignOut={onSignOut}
      />
    </Modal>
  );
}

export default SessionTimeoutModal;
