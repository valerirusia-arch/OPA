// src/features/LoanApplication/ui/IncomeStep.tsx
//
// WBS story 3 — "the borrower shall provide employment and income information
// required for loan processing: provide the annual income; upload documents
// that prove the income (select document type and upload a document)".
//
// The upload is REQUIRED for both. The borrower's story says "upload
// documents that prove the income (select document type and upload a
// document)" with no exemption, and the co-borrower's says "shall upload all
// required supporting documents to prove their income".
//
// It was optional for the borrower here for a while, with a note saying that
// skipping it would make a co-borrower necessary. Neither half of that is in
// the WBS: the co-borrower requirement is decided by the Loan Decisioning
// epic from the CREDIT SCORE ("if credit score is between XXX and XXX, then
// email is sent about requiring a co-borrower"), not by a missing file.
//
// The WBS's own note on this story: "The system accepts income verification
// documents in supported file formats. Uploaded documents are available for
// manual review by Underwriters or OCR."
//
// Dumb: nothing is uploaded. The file list is names in local state, which is
// what makes the step clickable; Dev swaps it for a real upload.

import { Form, Select, Typography, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useT } from "../../../shared/ui/i18n/useT";
import { useAuthRules } from "../../Auth/ui/validation";
import { RangeField } from "./RangeField";
import { useDocumentTypeOptions } from "./options";
import { StepActions, type StepActionLabels } from "./StepActions";
import { styles as shared } from "./StepShared.styles";
import { styles } from "./IncomeStep.styles";
import type { IncomeValues } from "./types";

export type IncomeStepProps = {
  /** Button wording, overridden when the step opens in the review's dialog. */
  labels?: StepActionLabels;
  initialValues?: Partial<IncomeValues>;
  onSubmit?: (values: IncomeValues) => void;
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

export function IncomeStep({
  labels,
  initialValues,
  onSubmit,
  onDirty,
  onBack,
}: IncomeStepProps) {
  const t = useT();
  const rules = useAuthRules();
  const documentTypes = useDocumentTypeOptions();

  return (
    <Form
      layout="vertical"
      style={shared.form}
      initialValues={initialValues}
      validateTrigger={["onBlur", "onChange"]}
      onValuesChange={() => onDirty?.()}
      onFinish={(values: IncomeValues) => {
        console.log("income step", values);
        onSubmit?.(values);
      }}
    >
      <Form.Item
        label={t("income.annual")}
        name="annualIncome"
        rules={[rules.amount()]}
        required
      >
        {/* The number underwriting reads first, at the size that says so. */}
        <RangeField />
      </Form.Item>

      <Form.Item
        label={t("income.docType")}
        name="documentType"
        rules={[rules.required()]}
        required
      >
        <Select
          size="large"
          options={documentTypes}
          placeholder={t("income.docTypePlaceholder")}
          allowClear
        />
      </Form.Item>

      <Form.Item
        label={t("income.uploadRequired")}
        name="documents"
        valuePropName="fileList"
        getValueFromEvent={(event) => event?.fileList}
        /* requiredValue, not required: the value here is a file LIST, and
           antd's built-in required rule rejects non-strings. */
        rules={[rules.requiredValue()]}
        required
        extra={t("income.uploadHelp")}
      >
        {/* beforeUpload returns false: the file is kept in the list and never
            sent anywhere, which is all a prototype should do with someone's
            pay stub. */}
        <Upload.Dragger
          multiple
          beforeUpload={() => false}
          accept=".pdf,.jpg,.jpeg,.png"
          styles={{ item: styles.uploadItem }}
        >
          <Typography.Text type="secondary">
            <InboxOutlined /> {t("income.choose")}
          </Typography.Text>
        </Upload.Dragger>
      </Form.Item>


      <Form.Item style={shared.actions}>
        <StepActions {...labels} onBack={onBack} />
      </Form.Item>
    </Form>
  );
}

export default IncomeStep;
