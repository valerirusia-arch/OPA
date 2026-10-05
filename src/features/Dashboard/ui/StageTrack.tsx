// src/features/Dashboard/ui/StageTrack.tsx
//
// THE APPLICATION'S STEPS, ACROSS THE WHOLE BAND.
//
// Five capsules, each under its own name. The numbered-disc rail
// that was built beside it is gone — both were put in the running app on a
// switch so the designer could walk the journey in each, and this is the one
// that survived. The discarded one is at the tag `tracker-both` if it is ever
// wanted back.
//
// A CAPSULE IS FULL OR IT IS EMPTY. It used to draw the live step at half,
// as a convention for "under way", and the designer took it out for a reason
// the product cannot argue with: *"ეს ნახევარი ვერ იქნება, ვერსად, არ ვართ
// დარწმუნებული რა როდის მოხდება — როცა მოხდება უნდა შევსოს მთლიანად ან
// ვაფშე არა."* Nothing in this system knows how far through underwriting an
// application is, and a bar at 50% is a claim that something does. So the
// fill means one thing only: this step has happened.
//
// GREEN IS A STEP THAT CLOSED, and grey is everything that has not — the one
// you are standing on included, because being in the middle of something is
// not having finished it.
//
// WHERE YOU ARE IS IN THE TYPE: the live step's label is the only word on the
// rail set in the accent at 600. Weight alone was carrying it before and that
// is a difference a reader has to go looking for; a colour among four greys
// and inks is not.
//
// AND THERE ARE NO MARKS. A line icon was put beside each label — a document,
// a magnifier, a pen, a bank, a flag — and the designer's verdict was
// immediate: *"ეს აიქონებმა დაამძიმა, დააბრუნე როგორც იყო."* They were right,
// and the reason is worth keeping: five glyphs across a rail add five shapes
// to a row whose whole job is to be scanned in one pass, and none of them
// said anything the word beneath it did not.
//
// Dumb: steps in, nothing out.

import { Flex, Typography, theme } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { getStyles, styles } from "./StageTrack.styles";

export type TrackStep = {
  key: string;
  /** What the step is called. One word where it can be: five share a line,
   *  and the same string is the heading of the panel below. */
  title: string;
  /** The date it happened. Absent for anything the reader has not reached. */
  meta?: string;
  /**
   * What the step WAS, in one past-tense line. The rail itself never draws
   * this — five sentences across a row would be a paragraph pretending to be
   * a diagram — but the drawer of finished steps below it does.
   */
  note?: string;
};

export type StageTrackProps = {
  steps: TrackStep[];
  /** 0-based. Everything before it is done; everything after is ahead. */
  current: number;
  /** The step the reader is standing on is an outcome nobody wanted. */
  failed?: boolean;
  /**
   * WHERE THE ROAD LEADS, drawn beside the rail and never on it.
   *
   * Only the four-step model uses this. It exists because ending the rail at
   * Funding takes the word "repayment" off the picture a borrower looks at
   * while deciding to sign — and a lender should not draw a road that ends
   * with the money arriving.
   *
   * It sits on the LABEL row and gets no capsule of its own, which is the
   * whole argument: the four things under capsules are measured stages, and
   * this is a destination. Give it a bar and it becomes the fifth step again,
   * with all the trouble that brought.
   */
  goal?: string;
};

export function StageTrack({
  steps,
  current,
  failed = false,
  goal,
}: StageTrackProps) {
  const { token } = theme.useToken();
  const s = getStyles(token);

  return (
    <div style={styles.scroller}>
      <Flex align="flex-start" gap={8} style={styles.track}>
        {steps.map((step, index) => {
          const done = index < current;
          const isCurrent = index === current;
          const tone =
            failed && isCurrent
              ? "failed"
              : isCurrent
                ? "current"
                : done
                  ? "done"
                  : "ahead";

          return (
            <Flex vertical gap={10} key={step.key} style={styles.cell}>
              {/* THE WORDS ABOVE THE MEASURE. A capsule with nothing over it
                  is a progress bar; a capsule under its own name, mark and
                  date is a step. */}
              {/* THE NAME, AND NOT THE DATE. Five dates across the rail were
                  a second row of figures on a diagram whose job is to be read
                  in one pass, and every one of them is in the drawer below
                  with the step it belongs to — *"აქ თარიღები არ ვანახოთ, რომ
                  ჩამოდროპავს, მანდ ნახავს."* It also takes the rail's second
                  line away, which is what used to put dated columns and
                  undated ones on different baselines. */}
              <Typography.Text
                style={
                  tone === "failed"
                    ? s.labelFailed
                    : tone === "current"
                      ? s.labelCurrent
                      : tone === "done"
                        ? s.labelDone
                        : s.labelAhead
                }
              >
                {step.title}
              </Typography.Text>

              {/* Green once it has closed, grey until then — including the
                  step you are standing on. See the styles. */}
              <div
                style={
                  tone === "failed" ? s.barFailed : done ? s.barDone : s.barAhead
                }
              />
            </Flex>
          );
        })}

        {goal ? (
          /* NO CAPSULE, and it was tried: a bar under this label was built
             and taken straight back out — *"წაშალე ეგ, უბრალოდ მინდა ეგ
             ტექსტი მანდ ყოფილიყო"*. The words alone are the point. */
          <Flex align="center" gap={6} style={styles.goalCell}>
            <ArrowRightOutlined style={s.goalMark} />
            <Typography.Text style={s.goal}>{goal}</Typography.Text>
          </Flex>
        ) : null}
      </Flex>
    </div>
  );
}

export default StageTrack;
