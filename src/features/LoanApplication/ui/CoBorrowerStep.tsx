// src/features/LoanApplication/ui/CoBorrowerStep.tsx
//
// Three WBS stories meet on this one step:
//
//   5  — invite a co-borrower "when required or desired", giving first and
//        last name and email, and submit the application.
//   9  — the invitation expires five calendar days after it is sent, and the
//        system tracks its status: Pending, Accepted, Expired.
//   14 — the borrower may REPLACE the co-borrower if the invitation expires,
//        is not accepted in five days, or the co-borrower fails underwriting.
//        Previous invitations become inactive once a replacement is invited,
//        and this may happen as many times as it takes.
//
// "When required or desired" is why the opt-in is a checkbox and not a step
// you must complete — unless Loan Decisioning has already decided one is
// necessary, in which case the choice is no longer the borrower's and the
// checkbox arrives locked.
//
// Dumb: sending an invitation is local state plus a console.log.

import {
  Alert,
  Button,
  Checkbox,
  Col,
  Flex,
  Form,
  Input,
  Row,
  Typography,
  theme,
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useT } from "../../../shared/ui/i18n/useT";
import { PersonPanel } from "../../../shared/ui/PersonPanel";
import { StatusPill } from "../../../shared/ui/StatusPill";
import { useAuthRules } from "../../Auth/ui/validation";
import { StepActions, type StepActionLabels } from "./StepActions";
import { getStyles as getSharedStyles, styles as shared } from "./StepShared.styles";
import { styles } from "./CoBorrowerStep.styles";
import type { CoBorrowerInvitation } from "./types";

export type CoBorrowerFormValues = {
  wantsCoBorrower?: boolean;
  firstName?: string;
  lastName?: string;
  email?: string;
};

export type CoBorrowerStepProps = {
  /** Button wording, overridden when the step opens in the review's dialog. */
  labels?: StepActionLabels;
  initialValues?: Partial<CoBorrowerFormValues>;
  /**
   * The invitation was refused, and why.
   *
   * The WBS caps sponsorship: "Co-borrowers can sponsor up to 3 borrowers."
   * Printing that rule under the email field was not enough — a rule with no
   * refusal behind it is a rule the borrower discovers by being ignored. Only
   * the server knows how many applications an address already co-signs, so the
   * refusal arrives as a prop.
   */
  sendError?: string;
  /** The invitation already sent, if there is one. */
  invitation?: CoBorrowerInvitation;
  /**
   * Whether a co-borrower is compulsory rather than optional.
   *
   * Story 5 says "when required OR desired"; which of the two it is comes from
   * Loan Decisioning, which weighs the credit score. It is never decided here.
   */
  required?: boolean;
  /**
   * The co-borrower underwriting turned down, when this step is being redone
   * because of story 14's reset.
   *
   * `required` alone cannot say this. Its note gives a reason, and after a
   * rejection that reason is out of date: the borrower has just been told
   * somebody did not qualify, and would arrive here reading a different
   * explanation for why they are standing in front of this form again.
   */
  replacing?: string;
  onSend?: (values: Required<Omit<CoBorrowerFormValues, "wantsCoBorrower">>) => void;
  onReplace?: () => void;
  /**
   * The footer button. It carries the form's values, because in the review's
   * dialog pressing it SAVES them — the wizard only walks on.
   */
  onSubmit?: (values: CoBorrowerFormValues) => void;
  /**
   * The applicant has touched a field.
   *
   * The dialog's footer reads this: nothing edited is "Done", an edit turns it
   * into "Save changes". The step does not decide that — it only reports.
   */
  onDirty?: () => void;
  onBack?: () => void;
};

const statusTag = {
  pending: { color: undefined, key: "invitation.pending" },
  accepted: { color: "success", key: "invitation.accepted" },
  expired: { color: "error", key: "invitation.expired" },
} as const;

export function CoBorrowerStep({
  labels,
  initialValues,
  invitation,
  sendError,
  required = false,
  replacing,
  onSend,
  onReplace,
  onSubmit,
  onDirty,
  onBack,
}: CoBorrowerStepProps) {
  const t = useT();
  const rules = useAuthRules();
  const { token } = theme.useToken();
  const sharedStyles = getSharedStyles(token);
  const [form] = Form.useForm<CoBorrowerFormValues>();

  const wants = Form.useWatch("wantsCoBorrower", form) ?? required;
  const status = invitation ? statusTag[invitation.status] : null;

  // Once accepted there is nothing left to send; before that the button either
  // sends the first invitation or replaces a spent one.
  const canSend = wants && invitation?.status !== "accepted";

  return (
    <Form
      form={form}
      layout="vertical"
      style={shared.form}
      initialValues={{ wantsCoBorrower: required, ...initialValues }}
      validateTrigger={["onBlur", "onChange"]}
      onValuesChange={() => onDirty?.()}
      onFinish={(values) => onSubmit?.(values)}
    >
      {required ? (
        <Flex gap={8} style={{ ...sharedStyles.hint, ...styles.optIn }}>
          <InfoCircleOutlined style={sharedStyles.hintIcon} />
          <Typography.Text type="secondary" style={shared.note}>
            {replacing
              ? t("coBorrowerStep.replacingNote", { name: replacing })
              : t("coBorrowerStep.requiredNote")}
          </Typography.Text>
        </Flex>
      ) : (
        <Form.Item name="wantsCoBorrower" valuePropName="checked" style={styles.optIn}>
          <Checkbox>{t("coBorrowerStep.optIn")}</Checkbox>
        </Form.Item>
      )}

      {wants ? (
        <>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label={t("field.firstName")}
                name="firstName"
                rules={[rules.required()]}
                required
              >
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label={t("field.lastName")}
                name="lastName"
                rules={[rules.required()]}
                required
              >
                <Input size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={t("field.email")}
            name="email"
            rules={rules.email}
            required
            extra={t("coBorrowerStep.sponsorLimit")}
          >
            <Input size="large" placeholder={t("field.emailPlaceholder")} />
          </Form.Item>

          {invitation ? (
            /* THE PERSON, in the shared drawing — `selected`, because this one
               the borrower chose. The underwriting screen draws the same
               co-borrower with the same component in its quiet tone. */
            <div style={styles.invitation}>
              <PersonPanel
                tone="selected"
                name={`${invitation.firstName} ${invitation.lastName}`}
                meta={`${invitation.email} · ${t(
                  invitation.status === "accepted"
                    ? "coBorrowerStep.acceptedOn"
                    : invitation.status === "expired"
                      ? "coBorrowerStep.expiredOn"
                      : "coBorrowerStep.expiresOn",
                  { date: invitation.expiresOn }
                )}`}
                /* Pending / Accepted / Expired is a state, and a state in this
                   product is a dotted pill. */
                trailing={
                  <StatusPill color={status?.color}>
                    {t(status?.key ?? "invitation.pending")}
                  </StatusPill>
                }
              />
            </div>
          ) : null}

          {sendError ? (
            <Alert
              type="error"
              showIcon
              style={styles.sendError}
              title={sendError}
            />
          ) : null}

          <Flex gap={12} style={styles.inviteActions}>
            {canSend ? (
              <Button
                onClick={() => {
                  const values = form.getFieldsValue();
                  if (!values.firstName || !values.lastName || !values.email) return;
                  console.log("send co-borrower invitation", values);
                  onSend?.({
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                  });
                }}
              >
                {invitation ? t("coBorrowerStep.resend") : t("coBorrowerStep.send")}
              </Button>
            ) : null}
            {invitation ? (
              <Button type="text" onClick={onReplace}>
                {t("coBorrowerStep.replace")}
              </Button>
            ) : null}
          </Flex>
        </>
      ) : null}

      <Form.Item style={shared.actions}>
        <StepActions {...labels} onBack={onBack} />
      </Form.Item>
    </Form>
  );
}

export default CoBorrowerStep;
