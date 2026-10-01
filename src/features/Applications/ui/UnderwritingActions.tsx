// src/features/Applications/ui/UnderwritingActions.tsx
//
// The right-hand card on the application-details page. Its title is now
// "Request information", and its body IS that form: a note the underwriter
// writes while reading the application, and a Send request button under it —
// *"ღილაკი კი არა, სრული ფორმა... და თაითლი request information."*
//
// The DECISION (Approve / Decline / Override) lives in the page header; the
// AMOUNT is changed from the application card's own head, in a dialog. What is
// left here is the one thing an underwriter composes on the page — a request to
// the borrower — because a modal would cover the evidence they are writing
// about. Once a decision stands, requesting more is moot, so the card carries
// the one line that EXPLAINS an automated decision instead — the context the
// Override button refers to.
//
// OPA STAFF SEES NONE OF THIS. The column is absent for them, not disabled.
//
// Dumb: local form state, and the note reported out by callback.

import { Button, Form, Input, Typography } from "antd";
import { useT } from "../../../shared/ui/i18n/useT";
import { useAuthRules } from "../../Auth/ui/validation";
import { styles } from "./UnderwritingActions.styles";
import type { Decision } from "./types";

export type UnderwritingActionsProps = {
  /** Set once the rules or a person has decided. Drives the auto line. */
  decision?: Decision;
  /** WBS: "a text note with the required details." Reported when sent. */
  onRequestInfo?: (note: string) => void;
};

export function UnderwritingActions({ decision, onRequestInfo }: UnderwritingActionsProps) {
  const t = useT();
  const rules = useAuthRules();
  const [form] = Form.useForm<{ note: string }>();

  if (decision) {
    return (
      <Typography.Text style={styles.autoLine}>
        {t(
          decision.source === "automated"
            ? "appAction.autoDecided"
            : "appAction.alreadyDecided",
          { outcome: t(`appAction.outcome.${decision.outcome}`) }
        )}
      </Typography.Text>
    );
  }

  // The card title already says what this is, so the field takes no second
  // label: the note, then the button under it.
  return (
    <Form
      form={form}
      layout="vertical"
      validateTrigger={["onBlur", "onChange"]}
      onFinish={({ note }) => {
        onRequestInfo?.(note);
        form.resetFields();
      }}
    >
      <Form.Item name="note" rules={[rules.required()]} style={styles.field}>
        <Input.TextArea rows={4} placeholder={t("requestModal.notePlaceholder")} />
      </Form.Item>
      <Button block onClick={() => form.submit()}>
        {t("requestModal.send")}
      </Button>
    </Form>
  );
}

export default UnderwritingActions;
