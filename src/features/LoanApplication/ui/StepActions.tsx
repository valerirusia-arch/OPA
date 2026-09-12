// src/features/LoanApplication/ui/StepActions.tsx
//
// The footer every step ends with. Back is always offered once there is a step
// to go back to — WBS story 13 makes moving backwards part of the product, not
// an escape hatch.

import { Button, Flex } from "antd";
import { useT } from "../../../shared/ui/i18n/useT";
import { styles } from "./StepShared.styles";

/**
 * Overrides for the two buttons, for when a step is not being walked through.
 *
 * Opened from the review in a dialog, "Back / Continue" describe a journey the
 * reader is not on — they came to change one answer and go straight back.
 * "Cancel / Save changes" describes what the buttons actually do there.
 */
export type StepActionLabels = {
  backLabel?: string;
  submitLabel?: string;
};

export type StepActionsProps = StepActionLabels & {
  onBack?: () => void;
  /**
   * For steps that are not a Form — signing and the card hand off to someone
   * else, so there is no form to submit. Given, the button becomes an ordinary
   * one; omitted, it submits the form it sits in.
   */
  onContinue?: () => void;
  disabled?: boolean;
};

export function StepActions({
  onBack,
  onContinue,
  backLabel,
  submitLabel,
  disabled,
}: StepActionsProps) {
  const t = useT();

  return (
    <Flex gap={12} style={styles.actions}>
      {onBack ? (
        <Button size="large" onClick={onBack}>
          {backLabel ?? t("common.back")}
        </Button>
      ) : null}
      <Button
        type="primary"
        htmlType={onContinue ? "button" : "submit"}
        size="large"
        disabled={disabled}
        onClick={onContinue}
      >
        {submitLabel ?? t("common.continue")}
      </Button>
    </Flex>
  );
}

export default StepActions;
