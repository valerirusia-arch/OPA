// src/features/Auth/ui/WizardActions.tsx
//
// The footer every step of the registration wizard ends with.
//
// Back is always available once there is somewhere to go back to: a form this
// long is only comfortable if changing your mind is cheap. It is a plain
// button next to the primary one rather than a link somewhere else on the
// page, so the two live where the hand already is.
//
// The pair sits at the END of the row, both at their natural width. Continue
// used to be `block`, so it stretched across whatever was left — a button the
// width of the card for a one-word label, which reads as a banner rather than
// as a control and makes Back look like an afterthought pinned beside it. It
// also put the two buttons at opposite ends of the row, so the hand had to
// travel between them. Right-aligned and self-sized is what the loan
// application wizard does, and the two wizards should not disagree.

import { Button, Flex, theme } from "antd";
import { useT } from "../../../shared/ui/i18n/useT";
import { getStyles } from "./WizardStep.styles";

export type WizardActionsProps = {
  /** Overridden when the step opens in a dialog, where Back means Cancel. */
  backLabel?: string;
  onBack?: () => void;
  submitting?: boolean;
  /** Nothing filled in yet — the button is there but not ready. */
  disabled?: boolean;
  /** Defaults to "Continue". */
  submitLabel?: string;
};

export function WizardActions({
  backLabel,
  onBack,
  submitting,
  disabled,
  submitLabel,
}: WizardActionsProps) {
  const t = useT();
  const { token } = theme.useToken();
  const styles = getStyles(token);

  return (
    <Flex gap={12} justify="flex-end">
      {onBack && (
        <Button size="large" onClick={onBack}>
          {backLabel ?? t("common.back")}
        </Button>
      )}
      <Button
        type="primary"
        htmlType="submit"
        size="large"
        loading={submitting}
        disabled={disabled}
        style={disabled ? styles.submitIdle : undefined}
      >
        {submitLabel ?? t("common.continue")}
      </Button>
    </Flex>
  );
}

export default WizardActions;
