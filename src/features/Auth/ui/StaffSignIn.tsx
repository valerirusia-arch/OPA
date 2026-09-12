// src/features/Auth/ui/StaffSignIn.tsx
//
// OPA staff do not have a password in this system: WBS routes internal users
// through Microsoft Entra ID ("Authenticate internal users"), and staff
// accounts are created by an Admin rather than self-registered.
//
// Dumb: the click is handed straight back to the caller.

import { Button, Flex, Typography } from "antd";
import { WindowsOutlined } from "@ant-design/icons";
import { useT } from "../../../shared/ui/i18n/useT";
import { styles } from "./StaffSignIn.styles";

export type StaffSignInProps = {
  onSignIn?: () => void;
  submitting?: boolean;
};

export function StaffSignIn({ onSignIn, submitting }: StaffSignInProps) {
  const t = useT();

  return (
    <Flex vertical gap={16} style={styles.root}>
      <Button
        type="primary"
        size="large"
        block
        icon={<WindowsOutlined />}
        onClick={onSignIn}
        loading={submitting}
      >
        {t("staff.signIn")}
      </Button>
      <Typography.Text type="secondary" style={styles.note}>
        {t("staff.note")}
      </Typography.Text>
    </Flex>
  );
}

export default StaffSignIn;
