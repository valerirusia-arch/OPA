// src/features/LoanApplication/ui/ApplicationWizard.tsx
//
// The frame both application wizards sit in: the card the current step renders
// into, with its progress at the head of it.
//
// Six numbered chips in a row is six things to read before you can start
// typing, and five of them are about somewhere you are not. A filled bar and a
// count answer the only question anyone actually has — "how much is left?" —
// in one glance.
//
// The progress lives INSIDE the card, at the head of it.
//
// The alternatives were tried and each cost something: full-bleed under the
// top bar it read as a second header and the form started a third of the way
// down the page; above the card it was a third floating object between the two
// that were already there; flush on the card's top edge it was too quiet to
// answer "how much is left?" without hunting for it. On the card's first line
// it is where the reader starts anyway.
//
// WBS story 13 — "move back and forth through the application process" — is
// carried by the Back button in each step's own footer rather than by the
// rail. Nothing is lost from a step when you leave it, so stepping back and
// forward again costs a click and keeps what was typed.
//
// `context` is drawn above the progress on EVERY step, for the wizard that
// needs it: a co-borrower lands here seconds after finishing registration, and
// a first step asking for an address reads as more sign-up. Told whose
// application this is, and told it on every step rather than once, they can
// see they are not in a loop.
//
// Dumb: it draws the progress it is given.

import type { ReactNode } from "react";
import { Card, ConfigProvider, Divider, Flex, Progress, Typography, theme } from "antd";
import { useT } from "../../../shared/ui/i18n/useT";
import { styles } from "./ApplicationWizard.styles";

export type WizardStep = {
  key: string;
  label: string;
};

export type ApplicationWizardProps = {
  steps: WizardStep[];
  current: number;
  /** Standing context above the progress — whose application this is. */
  context?: ReactNode;
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
};

/**
 * The wizard's own field rhythm, tighter than the app's 24.
 *
 * These steps are queues — you fill one field and move to the next — and the
 * whole step has to be reachable without scrolling, or the Continue button
 * that the reader already decided to press has to be hunted for. Scoped here,
 * so the profile and the modals keep their own spacing.
 */
const fieldTheme = {
  components: { Form: { itemMarginBottom: 16 } },
};

export function ApplicationWizard({
  steps,
  current,
  context,
  title,
  subtitle,
  children,
}: ApplicationWizardProps) {
  const { token } = theme.useToken();
  const t = useT();

  const stepNumber = Math.min(current + 1, steps.length);
  const percent = Math.round((stepNumber / steps.length) * 100);

  return (
    <>
      <div style={styles.page}>
        <div style={styles.column}>
          <Card style={styles.card}>
            {context ? (
              <>
                {context}
                <Divider style={styles.contextDivider} />
              </>
            ) : null}

            {/* The bar carries the progress and the line above it carries the
                number; the card's own heading names the step, so nothing is
                repeated. Spelled out rather than "1 / 6", which on its own
                means nothing to a screen reader. */}
            <div style={styles.progress}>
              <Typography.Text type="secondary" style={styles.stepCount}>
                {t("wizard.stepCount", {
                  current: stepNumber,
                  total: steps.length,
                })}
              </Typography.Text>
              <Progress
                percent={percent}
                showInfo={false}
                size="small"
                strokeColor={token.colorPrimary}
                railColor={token.colorFillSecondary}
                style={styles.stepsBar}
              />
            </div>

            <Typography.Title level={4} style={styles.title}>
              {title}
            </Typography.Title>
            {subtitle ? (
              <Typography.Text type="secondary" style={styles.subtitle}>
                {subtitle}
              </Typography.Text>
            ) : null}
            <ConfigProvider theme={fieldTheme}>
              <Flex vertical>{children}</Flex>
            </ConfigProvider>
          </Card>
        </div>
      </div>
    </>
  );
}

export default ApplicationWizard;
