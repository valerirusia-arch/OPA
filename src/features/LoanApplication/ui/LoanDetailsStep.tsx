// src/features/LoanApplication/ui/LoanDetailsStep.tsx
//
// WBS story 4 — "the system shall present the loan information to the
// borrower. The borrowers should select their application details and confirm
// the application: their USCIS application (single select from a list of
// predefined values); the application type, WHICH DEFINES THE SIZE OF THE LOAN
// (single select from a list of predefined values)".
//
// Two selects, therefore, not one — and the amount is not typed by anyone. It
// is read off the application type, because OPA lends the USCIS filing fee and
// nothing else. The values are predefined and not configurable here; changing
// an amount when USCIS raises a fee is an Admin story of its own.

import { Flex, Form, Select, Typography, theme } from "antd";
import { useT } from "../../../shared/ui/i18n/useT";
import { useAuthRules } from "../../Auth/ui/validation";
import {
  findApplicationType,
  useApplicationTypeOptions,
  useUscisOptions,
} from "./options";
import { StepActions, type StepActionLabels } from "./StepActions";
import { styles as shared } from "./StepShared.styles";
import { getStyles, styles } from "./LoanDetailsStep.styles";
import type { LoanDetailsValues } from "./types";

const money = (amount: number) =>
  `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

export type LoanDetailsStepProps = {
  /** Button wording, overridden when the step opens in the review's dialog. */
  labels?: StepActionLabels;
  initialValues?: Partial<LoanDetailsValues>;
  onSubmit?: (values: LoanDetailsValues) => void;
  /**
   * The applicant has touched a field.
   *
   * The review's dialog reads this: untouched, its footer is "Done" and
   * closing changes nothing; edited, it becomes "Save changes" and goes
   * through the confirmation. The step does not decide that — it reports.
   */
  onDirty?: () => void;
  onBack?: () => void;
};

export function LoanDetailsStep({
  labels,
  initialValues,
  onSubmit,
  onDirty,
  onBack,
}: LoanDetailsStepProps) {
  const t = useT();
  const rules = useAuthRules();
  const { token } = theme.useToken();
  const s = getStyles(token);
  const uscisOptions = useUscisOptions();
  const typeOptions = useApplicationTypeOptions();
  const [form] = Form.useForm<LoanDetailsValues>();

  // The amount follows the choice, so it has to re-read on every change.
  const applicationType = Form.useWatch("applicationType", form);
  const selected = findApplicationType(applicationType);

  return (
    <Form
      form={form}
      layout="vertical"
      style={shared.form}
      initialValues={initialValues}
      validateTrigger={["onBlur", "onChange"]}
      onValuesChange={() => onDirty?.()}
      onFinish={(values: LoanDetailsValues) => {
        console.log("loan details step", values);
        onSubmit?.(values);
      }}
    >
      <Form.Item
        label={t("loanDetails.uscis")}
        name="uscisApplication"
        rules={[rules.required()]}
        required
      >
        <Select
          size="large"
          options={uscisOptions}
          placeholder={t("loanDetails.uscisPlaceholder")}
        />
      </Form.Item>

      <Form.Item
        label={t("loanDetails.type")}
        name="applicationType"
        rules={[rules.required()]}
        required
      >
        <Select
          size="large"
          options={typeOptions}
          placeholder={t("loanDetails.typePlaceholder")}
        />
      </Form.Item>

      <Flex vertical style={s.amount}>
        <Typography.Text type="secondary" style={styles.amountLabel}>
          {t("loanDetails.amountLabel")}
        </Typography.Text>
        {selected ? (
          <>
            <Typography.Title level={2} className="opa-figure" style={s.amountValue}>
              {money(selected.amount)}
            </Typography.Title>
            <Typography.Text type="secondary" style={styles.amountTerms}>
              {t("loanDetails.terms")}
            </Typography.Text>
          </>
        ) : (
          <Typography.Title
            level={2}
            className="opa-figure"
            style={{ ...s.amountValue, ...s.amountEmpty }}
          >
            —
          </Typography.Title>
        )}
        {!selected ? (
          <Typography.Text type="secondary" style={styles.amountTerms}>
            {t("loanDetails.pending")}
          </Typography.Text>
        ) : null}
      </Flex>

      <Form.Item style={shared.actions}>
        <StepActions {...labels} onBack={onBack} />
      </Form.Item>
    </Form>
  );
}

export default LoanDetailsStep;
