// src/features/Applications/ui/CheckTags.tsx
//
// How a verification result is drawn, everywhere it appears.
//
// The distinction that matters is between "failed" and "unavailable". One says
// something about the applicant; the other says the integration did not answer,
// and the WBS is explicit that it must not count against them: "Technical
// failures during credit check shall NOT cause the application to be rejected."
// So the technical failure is drawn in the warning colour with a plug icon,
// never in red — an underwriter skimming a column must not read a broken
// Equifax call as a bad credit report.

import { Tag } from "antd";
import {
  ApiOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import type { TranslationKey } from "../../../shared/ui/i18n/dictionary";
import { useT } from "../../../shared/ui/i18n/useT";
import { pill } from "../../../shared/ui/tag.styles";
import { checkLabelKeys } from "./checks";
import type { CheckKey, CheckOutcome } from "./types";

const outcomeKeys: Record<CheckOutcome, TranslationKey> = {
  pending: "check.pending",
  passed: "check.passed",
  review: "check.review",
  failed: "check.failed",
  unavailable: "check.unavailable",
};

const outcomeColors: Partial<Record<CheckOutcome, string>> = {
  passed: "success",
  review: "warning",
  failed: "error",
  // Warning, not error: the applicant did nothing wrong.
  unavailable: "warning",
};

const outcomeIcons: Record<CheckOutcome, React.ReactNode> = {
  pending: <ClockCircleOutlined />,
  passed: <CheckCircleOutlined />,
  review: <ExclamationCircleOutlined />,
  failed: <CloseCircleOutlined />,
  unavailable: <ApiOutlined />,
};

export function CheckOutcomeTag({ outcome }: { outcome: CheckOutcome }) {
  const t = useT();

  return (
    <Tag
      color={outcomeColors[outcome]}
      variant="filled"
      icon={outcomeIcons[outcome]}
      style={pill}
    >
      {t(outcomeKeys[outcome])}
    </Tag>
  );
}

/**
 * Which automated step routed a row here. The queue's Source column.
 *
 * A tag, because the wireframe draws one and because the four values are a
 * closed set the WBS names: "Applications may be routed to manual review from
 * any automated verification step (Identity Verification, Income
 * Verification, Credit Check or Business Rule Evaluation)."
 *
 * Nothing to name means nothing routed it — a dash, the same mark every other
 * numeric or categorical "not applicable" uses in this product.
 */
export function CheckNameTag({ check }: { check?: CheckKey }) {
  const t = useT();
  if (!check) return <>{"—"}</>;
  return (
    <Tag variant="filled" style={pill}>
      {t(checkLabelKeys[check])}
    </Tag>
  );
}
