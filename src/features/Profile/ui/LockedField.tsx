// src/features/Profile/ui/LockedField.tsx
//
// WBS: "Personal information used for identity verification, underwriting or
// regulatory compliance (e.g., name, date of birth, SSN) cannot be updated
// through self-service." The lock is the explanation, so it is visible on the
// field rather than buried in a footnote.

import { Form, Input, Tooltip } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useT } from "../../../shared/ui/i18n/useT";

export type LockedFieldProps = {
  label: string;
  value: string;
  /** Why this one is locked. Defaults to the borrower's reason. */
  reason?: string;
};

export function LockedField({ label, value, reason }: LockedFieldProps) {
  const t = useT();

  return (
    <Form.Item label={label}>
      <Tooltip title={reason ?? t("profile.lockReason")}>
        <Input value={value} readOnly suffix={<LockOutlined />} />
      </Tooltip>
    </Form.Item>
  );
}

export default LockedField;
