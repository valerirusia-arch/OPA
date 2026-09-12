// src/features/Auth/ui/RegistrationDone.tsx
//
// Registration step 6. The account exists; the next thing the WBS expects a
// borrower to do is start a loan application (Loan Application epic).
//
// The subtitle is two lines on purpose, not two lines by accident: the news
// ("your account is ready") and the invitation ("you can start") are separate
// thoughts, and letting them wrap wherever the measure ran out split one of
// them across the break.

import { Button, Result, Typography, theme } from "antd";
import { useT } from "../../../shared/ui/i18n/useT";
import { AccountReadyMark } from "./AccountReadyMark";
import { getStyles, styles } from "./RegistrationDone.styles";

export type RegistrationDoneProps = {
  email: string;
  onPrimary?: () => void;
  primaryLabel?: string;
};

export function RegistrationDone({
  email,
  onPrimary,
  primaryLabel,
}: RegistrationDoneProps) {
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);

  return (
    <Result
      icon={<AccountReadyMark />}
      title={t("done.title")}
      subTitle={
        <>
          <Typography.Text type="secondary" style={styles.line}>
            {t("done.description", { email })}
          </Typography.Text>
          <Typography.Text type="secondary" style={styles.line}>
            {t("done.next")}
          </Typography.Text>
        </>
      }
      styles={{ title: s.resultTitle, subTitle: s.resultSubTitle, extra: s.resultExtra }}
      extra={
        <Button type="primary" size="large" onClick={onPrimary}>
          {primaryLabel ?? t("done.primary")}
        </Button>
      }
    />
  );
}

export default RegistrationDone;
