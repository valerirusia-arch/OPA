// src/features/LoanApplication/ui/SubmitStep.tsx
//
// WBS story 7 — "the borrower should be able to: see the confirmation of
// application submission; provide their household info (income, size), if they
// are veterans and select how they heard about OPA".
//
// The wireframe's last step is a Submit button and nothing else. The WBS asks
// for four answers before that button, so they are here — and they are here
// rather than earlier because none of them decides anything about the loan.
// They are asked once the work is done, when a few more questions cost the
// applicant the least.
//
// It does NOT submit. "Submission initiates the Loan Decisioning process", so
// the button that does that lives on a review step of its own (ReviewStep),
// where the applicant can see every answer first. This step only collects.

import { Col, Form, Radio, Row, Select } from "antd";
import { useT } from "../../../shared/ui/i18n/useT";
import { useAuthRules } from "../../Auth/ui/validation";
import { useHeardAboutOptions } from "./options";
import { RangeField } from "./RangeField";
import { StepActions, type StepActionLabels } from "./StepActions";
import { styles as shared } from "./StepShared.styles";
import type { HouseholdValues } from "./types";

export type SubmitStepProps = {
  /** Button wording, overridden when the step opens in the review's dialog. */
  labels?: StepActionLabels;
  initialValues?: Partial<HouseholdValues>;
  onSubmit?: (values: HouseholdValues) => void;
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

export function SubmitStep({
  labels,
  initialValues,
  onSubmit,
  onDirty,
  onBack,
}: SubmitStepProps) {
  const t = useT();
  const rules = useAuthRules();
  const heardAbout = useHeardAboutOptions();

  return (
    <Form
      layout="vertical"
      style={shared.form}
      /**
       * The household starts at one: the applicant.
       *
       * The field's empty state DREW a 1 — the slider's own minimum, shown as
       * a placeholder — so somebody who does live alone read their answer on
       * screen, pressed Continue and was told to choose something. Whether a
       * field is answered and what it looks like have to agree, and of the two
       * ways to make them agree, one is a real default and the other is
       * greying out the only sensible answer.
       */
      initialValues={{ householdSize: 1, ...initialValues }}
      validateTrigger={["onBlur", "onChange"]}
      onValuesChange={() => onDirty?.()}
      onFinish={(values: HouseholdValues) => {
        console.log("submit application", values);
        onSubmit?.(values);
      }}
    >
      <Row gutter={16}>
        <Col xs={24} md={14}>
          <Form.Item
            label={t("submitStep.householdIncome")}
            name="householdIncome"
            rules={[rules.amount()]}
            required
          >
            <RangeField compact />
          </Form.Item>
        </Col>
        <Col xs={24} md={10}>
          <Form.Item
            label={t("submitStep.householdSize")}
            name="householdSize"
            rules={[rules.requiredValue()]}
            required
          >
            {/* Same field, counting people instead of dollars: no prefix, a
                closed scale, and whole steps. */}
            <RangeField
              compact
              prefix=""
              min={1}
              max={10}
              step={1}
              placeholder="1"
              openEnded={false}
              formatScale={(size) => String(size)}
            />
          </Form.Item>
        </Col>
      </Row>

      {/* Two answers, both short: radios say them out loud instead of hiding
          them behind a menu. */}
      <Form.Item
        label={t("submitStep.veteran")}
        name="veteran"
        rules={[rules.requiredValue()]}
        required
      >
        <Radio.Group
          options={[
            { value: true, label: t("common.yes") },
            { value: false, label: t("common.no") },
          ]}
        />
      </Form.Item>

      <Form.Item
          label={t("submitStep.heardAbout")}
          name="heardAbout"
          rules={[rules.required()]}
          required
        >
        <Select
          size="large"
          options={heardAbout}
          placeholder={t("submitStep.heardAboutPlaceholder")}
        />
      </Form.Item>

      <Form.Item style={shared.actions}>
        <StepActions {...labels} onBack={onBack} />
      </Form.Item>
    </Form>
  );
}

export default SubmitStep;
