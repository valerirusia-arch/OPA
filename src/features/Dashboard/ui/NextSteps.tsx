// src/features/Dashboard/ui/NextSteps.tsx
//
// What happens next, and by when.
//
// THE WIREFRAME LEFT THIS PANEL EMPTY and said so on it: *"need to think about
// what would fit here."* This is the answer, and it is the one thing this
// product has that no other screen says out loud.
//
// A borrower here is somebody who could not cover a USCIS filing fee. What
// they are anxious about is never "how much" — the amount is fixed and on
// every page — it is TIMING. When will I hear. How long do I have. What
// happens if I am late. The WBS is full of those answers and every one of them
// is currently invisible:
//
//   · repayment begins within 45 days of approval, on the 1st
//   · a co-borrower invitation expires 5 calendar days after it is sent
//   · a late fee lands on the 16th day after a due date, once per missed payment
//   · 90 days past due is default, and then 30 days to avoid acceleration
//   · 120 days past due accelerates the whole balance, 30 days from the notice
//
// Each is a rule the borrower is held to. A product that enforces a deadline
// and never states it is not being neutral, it is being quiet in its own
// favour — PRODUCT.md's second principle is to say the consequence.
//
// SO: A DATED LIST, ordered soonest first, of what OPA will do and what will
// be asked of the reader. Nothing here is invented and nothing is a forecast:
// every line is a WBS rule applied to a date the record already holds.
//
// NOT A TIMELINE GRAPHIC. The steps are not evenly spaced in time and drawing
// them on a rail would imply they are. They are rows: what, when, and whose
// move it is.
//
// Dumb: steps in, nothing out.

import type { ReactNode } from "react";
import { Card, Flex, Tag, Tooltip, Typography, theme } from "antd";
import { ClockCircleFilled } from "@ant-design/icons";
import { useT } from "../../../shared/ui/i18n/useT";
import { pill } from "../../../shared/ui/tag.styles";
import { getStyles, styles } from "./NextSteps.styles";

/** Whose move it is. The reader's own steps are the ones they can act on. */
export type StepOwner = "you" | "opa";

export type NextStep = {
  key: string;
  /** What happens. */
  title: string;
  /** The rule behind it, in the lender's own words. */
  body: string;
  /** When, already formatted. Absent where the WBS gives no date. */
  when?: string;
  owner: StepOwner;
  /** Marks the one step that is overdue or running out. */
  urgent?: boolean;
};

export type NextStepsProps = {
  steps: NextStep[];
  title?: string;
  /**
   * The drawing for an empty panel.
   *
   * Passed in rather than antd's `Empty`: its grey tray is a different
   * illustration system from the marks this product draws everywhere else,
   * and two systems on one page is one too many.
   */
  emptyIcon?: ReactNode;
  emptyText?: string;
};

export function NextSteps({ steps, title, emptyIcon, emptyText }: NextStepsProps) {
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);

  return (
    <Card title={title ?? t("dashboard.nextTitle")} style={styles.card}>
      {steps.length === 0 ? (
        <Flex vertical align="center" gap={12} style={styles.empty}>
          {emptyIcon}
          <Typography.Text type="secondary" style={styles.emptyCopy}>
            {emptyText ?? t("dashboard.nextNone")}
          </Typography.Text>
        </Flex>
      ) : (
        /* ONE RULED ROW PER STEP.
           Stacked 20px apart they ran together: a date, a line, a sentence,
           another date — and at a glance the panel was a paragraph rather than
           a list of separate things a borrower is being held to. A hairline
           and real padding make each step a record with its own edges, which
           is what it is. */
        <Flex vertical>
          {steps.map((step, index) => (
            <Flex
              key={step.key}
              align="flex-start"
              gap={16}
              style={index === 0 ? styles.firstRow : s.row}
            >
              {/*
                THE DATE IS THE LEFT COLUMN, not a tag at the end of the line.
                The reader is scanning for "when", so when is what the eye
                lands on first and every row's date starts at the same x.
              */}
              <Flex align="center" gap={6} style={styles.whenColumn}>
                {/* NOT COLOUR ALONE. A red date is the only mark on the one
                    row that is running out, and colour by itself is not a
                    signal for a reader who cannot see it (WCAG 1.4.1). The
                    clock carries the same meaning, and its label says it in
                    words for a screen reader. */}
                {step.urgent ? (
                  <Tooltip title={t("dashboard.urgent")}>
                    <ClockCircleFilled style={s.urgentMark} aria-label={t("dashboard.urgent")} />
                  </Tooltip>
                ) : null}
                <Typography.Text style={step.urgent ? s.whenUrgent : s.when}>
                  {step.when ?? t("dashboard.whenUnset")}
                </Typography.Text>
              </Flex>

              <Flex vertical gap={4} style={styles.copy}>
                <Flex align="center" gap={8} wrap>
                  <Typography.Text style={s.stepTitle}>{step.title}</Typography.Text>
                  {/* Whose move. A borrower reading this wants to separate
                      "I have to do something" from "somebody is working on
                      it", and that is the only distinction the tag draws. */}
                  <Tag
                    color={step.owner === "you" ? "processing" : undefined}
                    variant="filled"
                    style={pill}
                  >
                    {t(step.owner === "you" ? "dashboard.ownerYou" : "dashboard.ownerOpa")}
                  </Tag>
                </Flex>
                <Typography.Text type="secondary" style={styles.body}>
                  {step.body}
                </Typography.Text>
              </Flex>
            </Flex>
          ))}
        </Flex>
      )}
    </Card>
  );
}

export default NextSteps;
