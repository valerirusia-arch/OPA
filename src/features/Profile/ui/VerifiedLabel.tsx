// src/features/Profile/ui/VerifiedLabel.tsx
//
// A field label that also says whether the value behind it has been confirmed.
//
// WBS: email and phone are verified during registration, and "when phone
// number/email are updated - the verification process should re-occur". The
// note under those fields already warns that changing them costs a code; this
// says what the current state IS, which is the half that was missing.
//
// Dumb: the state is a prop.

import { Flex, theme } from "antd";
import { CheckCircleFilled, ExclamationCircleOutlined } from "@ant-design/icons";
import { useT } from "../../../shared/ui/i18n/useT";
import { RequiredAsterisk } from "../../../shared/ui/RequiredAsterisk";
import { getStyles } from "./VerifiedLabel.styles";

export type VerifiedLabelProps = {
  label: string;
  verified?: boolean;
  /**
   * Drawn here rather than by antd, which appends it after the whole label —
   * i.e. after the tag, where it reads as if the tag were the required part.
   * The Form.Item passes `required={false}` so there is only ever one.
   */
  required?: boolean;
};

export function VerifiedLabel({ label, verified, required }: VerifiedLabelProps) {
  const t = useT();
  const { token } = theme.useToken();
  const styles = getStyles(token);

  return (
    <Flex align="center" gap={8}>
      <span>
        {label}
        {required && <RequiredAsterisk />}
      </span>
      <Flex
        align="center"
        gap={4}
        style={verified ? styles.verified : styles.unverified}
      >
        {verified ? <CheckCircleFilled /> : <ExclamationCircleOutlined />}
        {verified ? t("profile.verified") : t("profile.unverified")}
      </Flex>
    </Flex>
  );
}

export default VerifiedLabel;
