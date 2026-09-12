// src/features/LoanApplication/ui/ReviewStep.tsx
//
// The last step: everything the applicant answered, and the button that sends
// it.
//
// Its own screen rather than a box under the household questions, because the
// WBS says "submission initiates the Loan Decisioning process" — the button is
// the end of the reversible part of the product. By the time somebody reaches
// it they are six screens past choosing a loan size, and a summary squeezed
// under two more questions is a summary nobody reads.
//
// One card, sections divided by hairlines, one under the other. Six framed
// boxes gave six equal objects and a lot of chrome for what is really one list
// of answers; read top to bottom it is the application in the order it was
// filled in.
//
// Each section names the step it came from and carries its own way back — a
// dialog, so the list you are checking stays on screen behind it. Story 13 —
// "move back and forth through the application process" — is what makes
// changing an answer at this point safe.
//
// Dumb: it renders sections it is given and reports which one to return to.

import { Button, Divider, Flex, Typography, theme } from "antd";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useT } from "../../../shared/ui/i18n/useT";
import { StepActions } from "./StepActions";
import { styles as shared } from "./StepShared.styles";
import { getStyles, styles } from "./ReviewStep.styles";

export type ReviewRow = {
  key: string;
  /** Omit when the value says what it is on its own. */
  label?: string;
  value: string;
  /** Set on the one figure being agreed to, so it is not read as another fact. */
  emphasis?: boolean;
};

export type ReviewSection = {
  key: string;
  title: string;
  /** The wizard step this section's answers were given on. */
  step: number;
  /**
   * Nothing on this step can be changed any more, so its button opens the
   * step to be LOOKED at.
   *
   * Signed documents are the case: DocuSign has them, they cannot be edited
   * (the step says so itself), and there is no second signature to give. An
   * "Edit" button over them promises something the product cannot do, and the
   * dialog it opened ended in "Save changes" with nothing to save.
   */
  readOnly?: boolean;
  rows: ReviewRow[];
};

export type ReviewStepProps = {
  sections: ReviewSection[];
  onEdit?: (step: number) => void;
  onSubmit?: () => void;
  onBack?: () => void;
};

export function ReviewStep({ sections, onEdit, onSubmit, onBack }: ReviewStepProps) {
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);

  return (
    <Flex vertical>
      {sections.map((section, index) => (
        <Flex vertical key={section.key}>
          {/* No rule above the first section. */}
          {index > 0 ? <Divider style={s.rule} /> : null}

          <Flex vertical style={s.section}>
            <Flex align="center" justify="space-between" gap={12}>
              <Typography.Text style={s.sectionTitle}>{section.title}</Typography.Text>
              {/* Beside the answers it returns to, not collected at the bottom.
                  A section nothing can change any more opens to be READ. */}
              <Button
                type="link"
                size="small"
                icon={section.readOnly ? <EyeOutlined /> : <EditOutlined />}
                style={styles.edit}
                onClick={() => onEdit?.(section.step)}
              >
                {t(section.readOnly ? "review.view" : "review.edit")}
              </Button>
            </Flex>

            {section.rows.map((row) =>
              row.label ? (
                <Flex key={row.key} justify="space-between" gap={16} style={styles.row}>
                  <Typography.Text type="secondary" style={styles.label}>
                    {row.label}
                  </Typography.Text>
                  <Typography.Text style={row.emphasis ? s.amount : styles.value}>
                    {row.value}
                  </Typography.Text>
                </Flex>
              ) : (
                <Typography.Text
                  key={row.key}
                  style={{ ...styles.row, ...styles.soleValue }}
                >
                  {row.value}
                </Typography.Text>
              )
            )}
          </Flex>
        </Flex>
      ))}

      <Flex style={shared.actions}>
        <StepActions
          onBack={onBack}
          onContinue={onSubmit}
          submitLabel={t("review.submit")}
        />
      </Flex>
    </Flex>
  );
}

export default ReviewStep;
