// src/features/Applications/ui/UnderwritingActions.tsx
//
// Everything an Underwriter can do to an application, in the right-hand column
// the wireframe draws for it. Five WBS stories, in the wireframe's order:
//
//   Request additional information   — inline note + Send request
//   Decline / Approve                — the decision
//   Override automated decision      — only when the rules already decided
//   Update the requested amount      — Current, New amount, Reason, and the
//                                      change history underneath
//
// WHY SOME OF THIS IS INLINE AND SOME IS A DIALOG. The wireframe puts the
// note and the amount panel on the page, and they belong there: both are
// things an underwriter composes while reading the application beside them,
// and a modal would cover the evidence they are writing about. Approve,
// Decline and Override stay dialogs, because each has to capture something
// before it happens and two of them are irreversible:
//
//   Approve  — "Approval reason and timestamp are recorded."   optional note
//   Decline  — "Decline reason is mandatory."                  REQUIRED
//   Override — "Override reason is mandatory and recorded for audit
//               purposes."                                     REQUIRED
//
// The wireframe's Decline and Approved buttons carry no reason field, which is
// the one place it is missing something the WBS requires. So they open the
// dialogs that ask.
//
// OPA STAFF SEES NONE OF THIS. The WBS: "OPA Staff has read-only access to
// application information and cannot modify application data or PERFORM
// BUSINESS ACTIONS." The column is not rendered for them rather than rendered
// and disabled — a disabled panel of five controls reads as a page that is
// waiting for something.
//
// Dumb: local form state, and every action reports out by callback.

import { Button, Collapse, Divider, Flex, Form, Input, Typography, theme } from "antd";
import { useT } from "../../../shared/ui/i18n/useT";
import { useAuthRules } from "../../Auth/ui/validation";
import { RangeField } from "../../LoanApplication/ui/RangeField";
import { ChangeHistory } from "./ChangeHistory";
import { getStyles, styles } from "./UnderwritingActions.styles";
import type { AuditEntry, Decision } from "./types";

export type AmountChange = { amount: number; reason: string };

export type UnderwritingActionsProps = {
  /** What the borrower asked for, and what stands now. */
  requestedAmount: number;
  approvedAmount?: number;
  /** Set once the rules or a person has decided. Drives Override vs decide. */
  decision?: Decision;
  /** The trail, for the amount panel's change history. */
  audit: AuditEntry[];
  /** WBS: the loan amount may be changed "before the final approval decision". */
  canChangeAmount?: boolean;
  onRequestInfo?: (note: string) => void;
  onApprove?: () => void;
  onDecline?: () => void;
  onOverride?: () => void;
  onChangeAmount?: (change: AmountChange) => void;
};

const money = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" });

export function UnderwritingActions({
  requestedAmount,
  approvedAmount,
  decision,
  audit,
  canChangeAmount = true,
  onRequestInfo,
  onApprove,
  onDecline,
  onOverride,
  onChangeAmount,
}: UnderwritingActionsProps) {
  const t = useT();
  const rules = useAuthRules();
  const { token } = theme.useToken();
  const s = getStyles(token);
  const [requestForm] = Form.useForm<{ note: string }>();
  const [amountForm] = Form.useForm<{ amount: number; reason: string }>();

  const current = approvedAmount ?? requestedAmount;

  return (
    <Flex vertical gap={20}>
      {/* WBS: "Underwriter shall be able to request additional documents or
          information from the borrower." Its note: "Assuming the underwriter
          should provide a text note with the required details" — so the note
          is the story, and it is required. */}
      <div style={s.block}>
        <Typography.Text style={s.blockTitle}>{t("appAction.requestInfo")}</Typography.Text>
        <Form
          form={requestForm}
          layout="vertical"
          validateTrigger={["onBlur", "onChange"]}
          onFinish={({ note }) => {
            onRequestInfo?.(note);
            requestForm.resetFields();
          }}
          style={styles.form}
        >
          <Form.Item name="note" rules={[rules.required()]} style={styles.field}>
            <Input.TextArea rows={4} placeholder={t("requestModal.notePlaceholder")} />
          </Form.Item>
          <Button block onClick={() => requestForm.submit()}>
            {t("requestModal.send")}
          </Button>
        </Form>
      </div>

      {/* The decision. An application the rules have already settled is
          OVERRIDDEN, not decided again: the WBS keeps them as separate stories
          and only the override demands a reason for audit. */}
      {decision ? (
        <div style={s.block}>
          <Typography.Text style={styles.autoLine}>
            {t(
              decision.source === "automated"
                ? "appAction.autoDecided"
                : "appAction.alreadyDecided",
              { outcome: t(`appAction.outcome.${decision.outcome}`) }
            )}
          </Typography.Text>
          <Button block onClick={onOverride} style={styles.overrideButton}>
            {t("appAction.override")}
          </Button>
        </div>
      ) : (
        <Flex gap={12}>
          <Button danger size="large" style={styles.half} onClick={onDecline}>
            {t("appAction.decline")}
          </Button>
          <Button type="primary" size="large" style={styles.half} onClick={onApprove}>
            {t("appAction.approve")}
          </Button>
        </Flex>
      )}

      {/* WBS: "The Underwriter may reduce or adjust the requested loan amount
          BEFORE THE FINAL APPROVAL DECISION", so it closes once decided. */}
      {canChangeAmount ? (
        <Collapse
          style={s.panel}
          items={[
            {
              key: "amount",
              label: (
                <Typography.Text style={s.blockTitle}>
                  {t("appAction.editAmount")}
                </Typography.Text>
              ),
              children: (
                <Form
                  form={amountForm}
                  layout="vertical"
                  validateTrigger={["onBlur", "onChange"]}
                  initialValues={{ amount: current }}
                  onFinish={(values) => onChangeAmount?.(values)}
                  style={styles.form}
                >
                  <Flex gap={12} wrap>
                    <Flex vertical gap={4} style={styles.half}>
                      <Typography.Text type="secondary" style={styles.label}>
                        {t("amountPanel.current")}
                      </Typography.Text>
                      {/* Read-only, and not an input: a disabled field beside
                          an enabled one invites a try at the wrong box. */}
                      <Typography.Text style={styles.currentValue}>
                        {money(current)}
                      </Typography.Text>
                    </Flex>
                    <Form.Item
                      label={t("amountPanel.newAmount")}
                      name="amount"
                      rules={[rules.amount()]}
                      required
                      style={styles.half}
                    >
                      <RangeField compact min={0} max={requestedAmount} step={10} prefix="$" />
                    </Form.Item>
                  </Flex>

                  <Form.Item
                    label={t("amountModal.reason")}
                    name="reason"
                    rules={[rules.required()]}
                    required
                    extra={t("amountModal.reasonHint")}
                  >
                    <Input placeholder={t("amountPanel.reasonPlaceholder")} />
                  </Form.Item>

                  <Button type="primary" block onClick={() => amountForm.submit()}>
                    {t("amountModal.save")}
                  </Button>

                  <Divider />
                  <Typography.Text style={s.blockTitle}>
                    {t("amountPanel.history")}
                  </Typography.Text>
                  <div style={styles.history}>
                    <ChangeHistory entries={audit} />
                  </div>
                </Form>
              ),
            },
          ]}
        />
      ) : null}
    </Flex>
  );
}

export default UnderwritingActions;
