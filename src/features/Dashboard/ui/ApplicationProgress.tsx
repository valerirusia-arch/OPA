// src/features/Dashboard/ui/ApplicationProgress.tsx
//
// THE BAND, REBUILT: the road on top, the place you are standing under it.
//
// What used to be here was a statement — APPLIED FOR, the amount, the
// reference and the USCIS service — and the designer threw the whole premise
// out rather than the styling: *"დაივიწყე ამ კონტენერის ეს არსი, სხვა რაღაც
// მინდა იჯდეს აქ."* They were right twice over. The amount is already on the
// tile directly below this card, the reference and the service are on
// /application, and none of the four answers the question somebody opens this
// page with, which is not "how much did I ask for" but "what is happening".
//
// So the band now answers exactly that, in two parts that do different jobs:
//
//   THE RAIL says where this sits in the whole journey. Five steps, the dates
//   behind you, nothing invented ahead of you.
//
//   THE STEP says what is happening at the one that is live, and WHY it is
//   like that — *"ინფორმაცია თუ რა ხდება, რატომ არის ესე"*. Whose move it is
//   comes first, because that is the only distinction a borrower scans for:
//   "somebody is working on it" and "I am the hold-up" are different days.
//
// NO CARD HEAD. A bar reading "Application progress" over a visible progress
// rail is the panel introducing itself. The band gets a title only in the one
// state where it has nothing else to name it — an empty frame before there is
// an application.
//
// Dumb: one track in, one callback out.

import { Button, Card, Flex, Tag, Typography, theme } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useT } from "../../../shared/ui/i18n/useT";
import { pill } from "../../../shared/ui/tag.styles";
import { StageTrack, type TrackStep, type TrackVariant } from "./StageTrack";
import { getStyles, styles } from "./ApplicationProgress.styles";

export type ApplicationProgressProps = {
  steps: TrackStep[];
  /** 0-based position on the rail. */
  current: number;
  /** The live step is an outcome nobody wanted — declined, cancelled. */
  failed?: boolean;
  /** What the live step is called. */
  title: string;
  /** What is happening there, and why. */
  body: string;
  /** Whose move it is. Suppressed when the journey has failed: there is no
   *  move left for either side to make, and a pill saying so is furniture. */
  owner: "you" | "opa";
  action?: { label: string; onClick: () => void };
  variant?: TrackVariant;
};

export function ApplicationProgress({
  steps,
  current,
  failed = false,
  title,
  body,
  owner,
  action,
  variant,
}: ApplicationProgressProps) {
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);

  return (
    <Card styles={{ body: styles.body }}>
      <StageTrack steps={steps} current={current} failed={failed} variant={variant} />

      {/* The rule the band turns on. Inset rather than full bleed, because
          every other divider in this product is — the balance card's and the
          statement's both stop at the card's own inset. */}
      <div style={s.rule} />

      {/* THE WORDS LEFT, THE MOVE RIGHT.

          Stacked, all three sat in the left third of a 1216px card and the
          band read as half empty — the arrangement this dashboard has already
          been sent back over once. Across, the sentence keeps a reading
          measure AND the width is spoken for, and the control lands level
          with the heading that says why it is there. */}
      <Flex align="flex-start" justify="space-between" gap={32} style={styles.detail}>
        <Flex vertical gap={8} style={styles.copyBlock}>
          <Flex align="center" gap={10} wrap>
            <Typography.Title level={5} style={styles.title}>
              {title}
            </Typography.Title>
            {failed ? null : (
              <Tag
                color={owner === "you" ? "processing" : undefined}
                variant="filled"
                style={pill}
              >
                {t(owner === "you" ? "dashboard.stageYou" : "dashboard.stageOpa")}
              </Tag>
            )}
          </Flex>

          {/* Held to a reading measure. Across a band this wide an
              unconstrained sentence is one long line the eye has to travel
              twice to re-find the start of. */}
          <Typography.Text type="secondary" style={styles.copy}>
            {body}
          </Typography.Text>
        </Flex>

        {/* THE WAY TO MAKE THE MOVE, where there is one. A step that is with
            OPA gets no button: a control whose only effect is to take you
            somewhere to wait is worse than none.

            OUTLINED, not filled. The rail above it is already the accent, and
            two saturated blues in one card make the band argue with itself. */}
        {action ? (
          <Button
            size="large"
            onClick={action.onClick}
            style={styles.action}
            icon={<ArrowRightOutlined />}
            iconPosition="end"
          >
            {action.label}
          </Button>
        ) : null}
      </Flex>
    </Card>
  );
}

export default ApplicationProgress;
