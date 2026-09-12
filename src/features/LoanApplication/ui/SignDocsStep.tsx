// src/features/LoanApplication/ui/SignDocsStep.tsx
//
// WBS story 1 (and story 11, which is the same thing for a co-borrower).
//
// Three things the WBS insists on, and each of them shows on this screen:
//
//   The package is GENERATED — "based on the borrower's state of residence and
//   applicant role" — so the documents are listed before anything is signed,
//   with the state named. A borrower in New York and a co-borrower in Texas do
//   not sign the same set, and hiding that behind one anonymous box would make
//   the rule invisible.
//
//   Only what UNDERWRITING needs is signed here. The loan documents come after
//   approval, so the subtitle says so — otherwise this reads like the moment
//   the borrower commits to the loan, which it is not.
//
//   Signing is DOCUSIGN'S, and nothing about the documents can be changed
//   there: the signature is the only thing the signer provides, and the date is
//   applied automatically. That is why it sits inside an ExternalPanel.
//
// Dumb: "signing" flips local state after a console.log.

import { Button, Divider, Flex, Typography, theme } from "antd";
import { CheckOutlined, ExportOutlined, FileTextOutlined } from "@ant-design/icons";
import { useT } from "../../../shared/ui/i18n/useT";
import { useDocumentPackage } from "./options";
import { ExternalPanel } from "./ExternalPanel";
import { StepActions, type StepActionLabels } from "./StepActions";
import { styles as shared } from "./StepShared.styles";
import { getStyles, styles } from "./SignDocsStep.styles";

export type SignDocsStepProps = {
  /** Button wording, overridden when the step opens in the review's dialog. */
  labels?: StepActionLabels;
  /** Drives which documents the package contains, with story 1's other input. */
  state: string;
  role: "borrower" | "coBorrower";
  /** The date DocuSign stamped, once it has been signed. */
  signedOn?: string;
  onSign?: () => void;
  onSubmit?: () => void;
  onBack?: () => void;
};

export function SignDocsStep({
  labels,
  state,
  role,
  signedOn,
  onSign,
  onSubmit,
  onBack,
}: SignDocsStepProps) {
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);
  const documents = useDocumentPackage(state, role);

  return (
    <Flex vertical>
      <Typography.Text type="secondary" style={styles.packageLabel}>
        {t("sign.package")}
      </Typography.Text>

      {/*
        Flex and Dividers rather than antd's List.
        
        `List` is deprecated in antd 6 and warns on every render. Its
        replacement, `Listy`, is a VIRTUALISED list — a different component for
        a different job, with no `size` and no `Listy.Item` — and reaching for
        it to draw four document names would be using a windowing engine as a
        rename. Four rows in a frame is what Flex plus a hairline does
        everywhere else in this product, so the package now reads exactly like
        the loan's document list and the co-borrower's invitation rows.
      */}
      <Flex vertical style={s.listFrame}>
        {documents.map((document, index) => (
          <Flex vertical key={document}>
            {index > 0 ? <Divider style={styles.rule} /> : null}
            <Flex align="center" gap={10} style={styles.row}>
              <FileTextOutlined style={s.documentIcon} />
              <Typography.Text>{document}</Typography.Text>
            </Flex>
          </Flex>
        ))}
      </Flex>

      <ExternalPanel provider={t("sign.external")} note={t("sign.externalNote")}>
        {signedOn ? (
          <Flex align="center" gap={12} style={s.receipt}>
            <Flex align="center" justify="center" style={s.signedBadge}>
              <CheckOutlined />
            </Flex>
            <Flex vertical>
              <Typography.Text style={styles.signedTitle}>
                {t("sign.signedTitle")}
              </Typography.Text>
              <Typography.Text type="secondary" style={styles.signedMeta}>
                {t("sign.signedOn", { date: signedOn })}
              </Typography.Text>
            </Flex>
          </Flex>
        ) : (
          /*
            NO DASHED "SIGN HERE" ZONE. It was the wireframe's, and it was a
            picture of the wrong thing: the signature is not given on this
            page, it is given in DocuSign — which is exactly what the sentence
            above it says. A field nobody can sign in, with the real button
            parked beside it, made the button look like the smaller half of
            the moment. The loan-agreement page dropped the same zone for the
            same reason.

            What is left is the one control, at full width, saying where it
            goes: press it and DocuSign opens.
          */
          <Button
            type="primary"
            size="large"
            block
            icon={<ExportOutlined />}
            iconPlacement="end"
            onClick={() => {
              console.log("open DocuSign envelope");
              onSign?.();
            }}
          >
            {t("sign.open")}
          </Button>
        )}
      </ExternalPanel>

      <Flex style={shared.actions}>
        <StepActions {...labels} onBack={onBack} onContinue={onSubmit} disabled={!signedOn} />
      </Flex>
    </Flex>
  );
}

export default SignDocsStep;
