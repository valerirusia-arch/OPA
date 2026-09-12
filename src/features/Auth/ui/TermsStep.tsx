// src/features/Auth/ui/TermsStep.tsx
//
// WBS: "During registration the user shall acknowledge the Terms of Use and
// Privacy Policy" — required before the account is created, and with no
// document versioning for the MVP.
//
// Dumb: the two acknowledgements live in local state; the caller decides what
// creating the account means.

import { useState } from "react";
import { Button, Checkbox, Flex, Typography, theme } from "antd";
import type { TranslationKey } from "../../../shared/ui/i18n/dictionary";
import { useT } from "../../../shared/ui/i18n/useT";
import { getStyles, styles } from "./TermsStep.styles";
import { getStyles as getWizardStyles } from "./WizardStep.styles";

const TERMS_POINTS: TranslationKey[] = [
  "terms.termsPoint1",
  "terms.termsPoint2",
  "terms.termsPoint3",
  "terms.termsPoint4",
];

const PRIVACY_POINTS: TranslationKey[] = [
  "terms.privacyPoint1",
  "terms.privacyPoint2",
  "terms.privacyPoint3",
  "terms.privacyPoint4",
];

export type TermsStepProps = {
  onAccept?: () => void;
  submitting?: boolean;
  termsHref?: string;
  privacyHref?: string;
};

export function TermsStep({
  onAccept,
  submitting,
  termsHref = "#terms",
  privacyHref = "#privacy",
}: TermsStepProps) {
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);
  const wizard = getWizardStyles(token);
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);

  return (
    <Flex vertical style={styles.wrap}>
      <Typography.Title level={3} style={styles.title}>
        {t("terms.title")}
      </Typography.Title>
      <Typography.Text type="secondary" style={styles.description}>
        {t("terms.description")}
      </Typography.Text>

      {/* You cannot meaningfully accept a document you were never shown. The
          full text lives behind the links; this is what it says in plain
          language, so the consent is informed rather than reflexive. */}
      <div style={s.document}>
        <Typography.Title level={5} style={s.docTitle}>
          {t("terms.docTerms")}
        </Typography.Title>
        {TERMS_POINTS.map((key) => (
          <Typography.Paragraph key={key} type="secondary" style={s.point}>
            {t(key)}
          </Typography.Paragraph>
        ))}

        <Typography.Title level={5} style={s.docTitleSpaced}>
          {t("terms.docPrivacy")}
        </Typography.Title>
        {PRIVACY_POINTS.map((key) => (
          <Typography.Paragraph key={key} type="secondary" style={s.point}>
            {t(key)}
          </Typography.Paragraph>
        ))}
      </div>

      <Typography.Text type="secondary" style={s.note}>
        {t("terms.summaryNote")}
      </Typography.Text>

      <Checkbox
        checked={terms}
        onChange={(e) => setTerms(e.target.checked)}
        style={styles.consent}
      >
        {t("terms.acceptPrefix")}{" "}
        <Typography.Link href={termsHref} target="_blank">
          {t("terms.termsOfUse")}
        </Typography.Link>
      </Checkbox>

      <Checkbox
        checked={privacy}
        onChange={(e) => setPrivacy(e.target.checked)}
        style={styles.consent}
      >
        {t("terms.acceptPrefix")}{" "}
        <Typography.Link href={privacyHref} target="_blank">
          {t("terms.privacyPolicy")}
        </Typography.Link>
      </Checkbox>

      <Button
        type="primary"
        size="large"
        block
        style={terms && privacy ? styles.submit : { ...styles.submit, ...wizard.submitIdle }}
        loading={submitting}
        disabled={!terms || !privacy}
        onClick={onAccept}
      >
        {t("terms.submit")}
      </Button>
    </Flex>
  );
}

export default TermsStep;
