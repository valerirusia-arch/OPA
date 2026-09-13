// src/features/Dashboard/ui/StageTrack.tsx
//
// THE APPLICATION'S STEPS, ACROSS THE WHOLE BAND.
//
// The dashboard has tried four arrangements of this and the designer has
// thrown out three. A half-width horizontal rail was four labels adrift on
// three enormous connectors. A vertical timeline fixed the width and spent
// four rows on a loan. A single current-stage panel fixed that and lost the
// road. This is the fourth and it is the designer's own brief: *"ზემოთ ჩასვავ
// ტრეკერს აპლიკაციის სტეპებზე, მთლიანად სიგრძეზე გაუშვებ ლამაზად, ქვემოთ
// იქნება იმ კონკრეტულ სტეპზე ინფორმაცია."*
//
// What made the first attempt fail was not the direction — it was the width
// it was given. Five steps across 1216px is a step every 243px, which is a
// label, a date and a node with room around all three. Four steps across 600
// was not.
//
// TWO VARIANTS, ON PURPOSE, and they are being compared rather than kept:
//
//   `nodes`  Numbered discs on a continuous rail, a tick behind you, a caret
//            over where you are, label and date centred under each. Reads as
//            a JOURNEY: one road, five places on it.
//
//   `bars`   Five capsules with their label and date above them, the live one
//            half filled. Reads as WORK: five pieces, some finished, one under
//            way. Left-aligned, so the eye travels the row rather than
//            bouncing between centres.
//
// Neither invents a number. The half-filled capsule is a convention for "under
// way", not a percentage — nothing on this component prints a figure the
// record does not hold, and a step ahead of the reader carries no date because
// there is nothing yet to report.
//
// Dumb: steps in, nothing out.

import { Flex, Typography, theme } from "antd";
import { CheckOutlined, CloseOutlined, DownOutlined } from "@ant-design/icons";
import { getStyles, styles } from "./StageTrack.styles";

export type TrackVariant = "nodes" | "bars";

export type TrackStep = {
  key: string;
  /** What the step is called. One or two words: five share a line. */
  title: string;
  /** The date it happened. Absent for anything the reader has not reached. */
  meta?: string;
};

export type StageTrackProps = {
  steps: TrackStep[];
  /** 0-based. Everything before it is done; everything after is ahead. */
  current: number;
  /** The step the reader is standing on is an outcome nobody wanted. */
  failed?: boolean;
  variant?: TrackVariant;
};

/** Holds the date line open in the `bars` variant so five capsules sit on one
 *  baseline whether or not the step above them has a date. */
const BLANK = " ";

export function StageTrack({
  steps,
  current,
  failed = false,
  variant = "nodes",
}: StageTrackProps) {
  const { token } = theme.useToken();
  const s = getStyles(token);
  const last = steps.length - 1;

  if (variant === "bars") {
    return (
      <div style={styles.scroller}>
        <Flex align="flex-start" gap={8} style={styles.track}>
          {steps.map((step, index) => {
            const done = index < current;
            const isCurrent = index === current;

            return (
              <Flex vertical gap={10} key={step.key} style={styles.cell}>
                {/* THE WORDS ABOVE THE MEASURE, which is what separates this
                  variant from the other one. A capsule with nothing over it
                  is a progress bar; a capsule under its own name and date is
                  a step. */}
                <Flex vertical gap={2} style={styles.barCopy}>
                  <Typography.Text
                    style={
                      failed && isCurrent
                        ? s.labelFailed
                        : isCurrent
                          ? s.labelCurrent
                          : done
                            ? s.labelDone
                            : s.labelAhead
                    }
                  >
                    {step.title}
                  </Typography.Text>
                  <Typography.Text style={s.meta}>
                    {step.meta ?? BLANK}
                  </Typography.Text>
                </Flex>

                <div
                  style={
                    failed && isCurrent
                      ? s.barFailed
                      : done
                        ? s.barDone
                        : isCurrent
                          ? s.barCurrent
                          : s.barAhead
                  }
                >
                  {/* UNDER WAY, not 50% done. The record holds no progress
                    inside a step, so the fill is a convention and never a
                    figure — nothing beside it prints a percentage. */}
                  {isCurrent && !failed ? <div style={s.barFill} /> : null}
                </div>
              </Flex>
            );
          })}
        </Flex>
      </div>
    );
  }

  return (
    <div style={styles.scroller}>
      <Flex align="flex-start" style={styles.track}>
        {steps.map((step, index) => {
          const done = index < current;
          const isCurrent = index === current;

          return (
            <Flex vertical align="center" key={step.key} style={styles.cell}>
              {/* YOU ARE HERE. The caret's slot is held open on every cell, so
                the rail sits at one height across the band instead of
                stepping down wherever the marker is not. */}
              <div style={styles.caretSlot}>
                {isCurrent ? (
                  <DownOutlined style={failed ? s.caretFailed : s.caret} />
                ) : null}
              </div>

              {/*
              THE NODE AND ITS TWO HALF-LINES.

              Each cell draws the half of the connector on either side of its
              own node, so the line meets the node exactly and the rail
              divides evenly however many steps there are. The first cell's
              left half and the last cell's right half are drawn in nothing,
              which keeps the rail from starting and ending in mid air.
            */}
              <Flex align="center" style={styles.rail}>
                {/* The half BEFORE a node is travelled once the reader has
                  reached that node — the one they are standing on included.
                  The half after it only once they have left. Read the other
                  way, the leg into the current step came out grey, as though
                  they had never got there. */}
                <span
                  style={
                    index === 0
                      ? s.lineNone
                      : index <= current
                        ? s.lineDone
                        : s.lineAhead
                  }
                />
                <Flex
                  align="center"
                  justify="center"
                  style={
                    failed && isCurrent
                      ? s.nodeFailed
                      : done
                        ? s.nodeDone
                        : isCurrent
                          ? s.nodeCurrent
                          : s.nodeAhead
                  }
                >
                  {failed && isCurrent ? (
                    <CloseOutlined style={s.glyph} />
                  ) : done ? (
                    <CheckOutlined style={s.glyph} />
                  ) : (
                    index + 1
                  )}
                </Flex>
                <span
                  style={
                    index === last
                      ? s.lineNone
                      : done
                        ? s.lineDone
                        : s.lineAhead
                  }
                />
              </Flex>

              <Flex vertical align="center" gap={2} style={styles.copy}>
                <Typography.Text
                  style={
                    failed && isCurrent
                      ? s.labelFailed
                      : isCurrent
                        ? s.labelCurrent
                        : done
                          ? s.labelDone
                          : s.labelAhead
                  }
                >
                  {step.title}
                </Typography.Text>
                {/* The date it happened, under the node it happened at. A step
                  still ahead gets none: there is nothing to report yet, and a
                  placeholder would be reporting it anyway. */}
                {step.meta ? (
                  <Typography.Text style={s.meta}>{step.meta}</Typography.Text>
                ) : null}
              </Flex>
            </Flex>
          );
        })}
      </Flex>
    </div>
  );
}

export default StageTrack;
