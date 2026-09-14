// src/features/Dashboard/ui/StageFoot.tsx
//
// WHERE THE JOURNEY IS, ALONG THE FOOT OF THE CARD THAT REPLACED IT.
//
// THE PROBLEM. The dashboard's wide band is the application tracker before
// funding and the balance card after it, and the hand-over reads as a skip:
// the rail is on screen promising a step called Repayment, and the moment
// that step arrives the whole thing vanishes and something else is there.
// *"ესე რომ ისკიპება, თითქოს არასწორია."*
//
// THE ANSWER THAT WAS TRIED FIRST, AND CUT. A five-segment mini rail with the
// live step's name beside it — the tracker at a tenth of its size. It lasted
// one look: *"რელი ვარიანტი არ მომწონს."* Worth recording why it deserved to
// go. A rail is a measure, and by this point the measure is finished: four of
// five steps are closed and the fifth runs for a year. Drawing it again at
// the foot of the card was a picture of a road nobody is travelling any more,
// directly under a card whose whole job is to say what is left to pay.
//
// THE ANSWER THAT STAYS is the half of the band that was still true: the
// STEP'S NAME and the RECORD BEHIND IT. *"რომელ სტეპზეც არის, და ქვემოთ
// დროპდაუნი, რომ გავიარეთ ფანდინგი და ეხლა აქ ვართ."* One line naming where
// the loan is, whose move it is, and an arrow that opens everything already
// done. No second picture of a schedule the card above draws properly.
//
// AND THE SENTENCE DOES NOT COME WITH IT. The band pairs every step with a
// line explaining what happens there; here that line would sit under a card
// that has just given the balance, the fees, the payoff figure and the final
// date — every concrete fact the sentence gestures at, already stated better.
// *"ამ ტექსტის ნაცვლად."*
//
// Dumb: what it is given is what it draws.

import { Flex, Tag, Typography, theme } from "antd";
import { useT } from "../../../shared/ui/i18n/useT";
import { pill } from "../../../shared/ui/tag.styles";
import type { TrackStep } from "./StageTrack";
import { StepsDrawer } from "./StepsDrawer";
import { getStyles, styles } from "./StageFoot.styles";

export type StageFootProps = {
  steps: TrackStep[];
  /** 0-based position on the rail. */
  current: number;
  /** What the live step is called — the rail's own label, word for word. */
  title: string;
  /** Whose move it is. */
  owner: "you" | "opa";
  /** The journey is over rather than paused on a step. Reachable only in the
   *  four-step model, where funding ends the application instead of handing
   *  it to a fifth step called Repayment. */
  complete?: boolean;
};

export function StageFoot({
  steps,
  current,
  title,
  owner,
  complete = false,
}: StageFootProps) {
  const { token } = theme.useToken();
  const s = getStyles(token);
  const t = useT();

  /* What is actually behind the reader — never the live step, never one
     ahead. Same rule as the band's own drawer. */
  const behind = steps.slice(0, current);

  return (
    <div style={styles.root}>
      {/* Inset rather than full bleed, like every other divider in this
          product — the statement's and the balance card's both stop at the
          card's own inset. */}
      <div style={s.rule} />

      <Flex align="center" gap={10} wrap style={styles.head}>
        <Typography.Title level={5} style={styles.title}>
          {title}
        </Typography.Title>
        {/* NOBODY'S MOVE WHEN IT IS FINISHED. "Application complete · Your
            move" would be asking the reader for something that is not there;
            the heading already says the whole of it. */}
        {complete ? null : (
          <Tag
            color={owner === "you" ? "processing" : undefined}
            variant="filled"
            style={{ ...pill, ...s.ownerTag }}
          >
            {t(owner === "you" ? "dashboard.stageYou" : "dashboard.stageOpa")}
          </Tag>
        )}
      </Flex>

      {/* Everything already done, behind the same arrow it has in the band —
          so a reader who learned it before funding finds it unchanged after. */}
      <StepsDrawer
        behind={behind}
        label={
          <Typography.Text style={s.historyLabel}>
            {t("dashboard.stepsBehind")}
          </Typography.Text>
        }
      />
    </div>
  );
}

export default StageFoot;
