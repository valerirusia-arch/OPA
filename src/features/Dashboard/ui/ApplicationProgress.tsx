// src/features/Dashboard/ui/ApplicationProgress.tsx
//
// THE BAND: the road on top, the place you are standing under it.
//
// What used to be here was a statement — APPLIED FOR, the amount, the
// reference and the USCIS service — and the designer threw the whole premise
// out rather than the styling: *"დაივიწყე ამ კონტენერის ეს არსი."* The amount
// is on the tile directly below this card, the reference and the service are
// on /application, and none of the four answers the question somebody opens
// this page with, which is not "how much did I ask for" but "what is
// happening".
//
// ONE NAME PER STEP. The rail says "Review" and the panel under it used to
// say "Under review" — the same moment under two names, three inches apart.
// *"სახელი ზუსტად იდენტური უნდა იყოს."* So the heading IS the live step's
// own label, and everything that separates one review from another — an
// underwriter waiting on a document, a co-borrower who has not finished —
// lives in the sentence and in the pill that says whose move it is. The only
// headings that are not a step name are the two outcomes that end the
// journey, because a step that failed is no longer that step.
//
// ONE SURFACE, DIVIDED BY A LINE. The live step was given a tinted recess of
// its own for a while, to lift it off the band; it came back out — *"ჩარჩოს
// გარეშე უფრო მომწონს."* A panel inside a card makes the card look like two
// cards, which is the thing this dashboard has been taken apart twice to
// avoid. The rule does the separating and costs one pixel.
//
// THE DRAWER ALONG THE FOOT stays: the designer kept it. It opens the steps
// already behind the reader, each with its date and a green tick, and it is
// shut by default because a history is the one thing on this card nobody
// needs at a glance.
//
// Dumb: one track in, one callback out.

import { useState } from "react";
import { Button, Card, Flex, Tag, Typography, theme } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useT } from "../../../shared/ui/i18n/useT";
import { pill } from "../../../shared/ui/tag.styles";
import { StageTrack, type TrackStep } from "./StageTrack";
import { StepsDrawer } from "./StepsDrawer";
import { getStyles, styles } from "./ApplicationProgress.styles";

/**
 * THE DRAWING OF THE JOURNEY.
 *
 * Four capsules under four names ending at Funding (see StageTrack), with a
 * trailing marker naming where the road leads — "Repayment begins" — so the
 * word does not vanish from the picture a borrower reads before signing,
 * without putting a state back on a rail of events. See `goal` in
 * flows/dashboard/applicationTrack.ts.
 *
 * Three alternatives were built and compared in the running app on a dev
 * switch — five capsules, numbered discs, and a bare four-step rail — and this
 * is the one that survived. They were deleted once the choice was made; git
 * history holds them if ever wanted back.
 */
export type ApplicationProgressProps = {
  steps: TrackStep[];
  /** 0-based position on the rail. */
  current: number;
  /** The live step is an outcome nobody wanted — declined, cancelled. */
  failed?: boolean;
  /** Nothing left to report: every step is behind the reader. Suppresses the
   *  owner pill, the same as `failed` — a finished journey is nobody's move. */
  complete?: boolean;
  /** What the live step is called. The rail's own label, word for word. */
  title: string;
  /** What is happening there, and why. */
  body: string;
  /** Whose move it is. Suppressed when the journey has failed: there is no
   *  move left for either side to make, and a pill saying so is furniture. */
  owner: "you" | "opa";
  action?: { label: string; onClick: () => void };
  /** Where the road leads, named beside the rail. See StageTrack. */
  goal?: string;
};

export function ApplicationProgress({
  steps,
  current,
  failed = false,
  complete = false,
  title,
  body,
  owner,
  action,
  goal,
}: ApplicationProgressProps) {
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);
  /* antd would paint the link's hover in the accent through CSS, and an
     inline colour beats it — so the state is held here instead. Same
     mechanism the dashboard tiles use for the same reason. */
  const [hovered, setHovered] = useState(false);

  /* What is actually behind the reader. Never the live step, even when it has
     a date on it, and never a step ahead — the drawer is a record of what has
     happened, so an empty one simply does not open. */
  const behind = steps.slice(0, current);

  return (
    <Card styles={{ body: styles.body }}>
      <StageTrack steps={steps} current={current} failed={failed} goal={goal} />

      {/* The rule the band turns on. Inset rather than full bleed, because
          every other divider in this product is — the balance card's and the
          statement's both stop at the card's own inset. */}
      <div style={s.rule} />

      {/* `wrap`, and a real basis on the copy block below.

          Without them this row only ever shrank: the link keeps its width, so
          at 375px the sentence was squeezed into the ~135px left over and came
          out eight lines tall in a column half the card wide, with the other
          half empty beside it. Wrapping puts the link under the sentence
          instead, and the sentence gets the card. */}
      <Flex
        align="flex-start"
        justify="space-between"
        gap={32}
        wrap
        style={styles.detail}
      >
        <Flex vertical gap={8} style={styles.copyBlock}>
          <Flex align="center" gap={10} wrap>
            <Typography.Title level={5} style={styles.title}>
              {title}
            </Typography.Title>
            {failed || complete ? null : (
              <Tag
                color={owner === "you" ? "processing" : undefined}
                variant="filled"
                style={{ ...pill, ...s.ownerTag }}
              >
                {t(
                  owner === "you" ? "dashboard.stageYou" : "dashboard.stageOpa",
                )}
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

        {/* THE WAY TO MAKE THE MOVE, where there is one. A step that is
              with OPA and needs nothing gets none.

              A LINK, NOT A BUTTON. It was an outlined button, which put a
              white box with a border inside a tinted box with a radius —
              *"ამეებში არაა საჭირო ღილაკი, მხოლოდ ტექსტი იყოს."* The step is
              not asking anybody to commit to anything; it is offering a way
              to the page that has the detail, and a way somewhere is a link.
              The page's real actions — Make a payment, Review and sign —
              stay buttons, which is what keeps them readable as actions. */}
        {action ? (
          <Button
            type="link"
            onClick={action.onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setHovered(true)}
            onBlur={() => setHovered(false)}
            style={hovered ? s.actionHover : s.action}
            icon={<ArrowRightOutlined />}
            iconPosition="end"
          >
            {action.label}
          </Button>
        ) : null}
      </Flex>

      {/*
        WHAT IS ALREADY BEHIND YOU, folded away — see StepsDrawer. The same
        drawer, under the same words, appears at the foot of the balance card
        once funding has replaced this band, so the record does not disappear
        with the picture. See StageFoot.
      */}
      <StepsDrawer
        behind={behind}
        label={
          <Typography.Text style={s.historyLabel}>
            {t("dashboard.stepsBehind")}
          </Typography.Text>
        }
      />

    </Card>
  );
}

export default ApplicationProgress;
