// src/features/Dashboard/ui/StepsDrawer.tsx
//
// THE STEPS ALREADY BEHIND THE READER, folded away.
//
// Shut by default, because a history is the one thing on these cards nobody
// needs at a glance. Open, it is the journey in rows: what each finished step
// was, when it closed, and a green tick against it.
//
// Green here and nowhere else on the band: the rail is drawn in green for
// what has closed and the accent for where you are, but a tick against a step
// behind you is the product's ordinary "done", which is green on every other
// screen in it.
//
// IT TAKES ITS OWN LABEL. On the application band that is the words "Steps so
// far"; on the balance card it is a five-segment rail with the live step
// named beside it, because there the collapsed state has to answer "where am
// I" as well as offer the history. Same drawer, two handles.
//
// Dumb: steps in, nothing out.

import type { ReactNode } from "react";
import { Collapse, Flex, Typography, theme } from "antd";
import { CheckCircleFilled, RightOutlined } from "@ant-design/icons";
import { useT } from "../../../shared/ui/i18n/useT";
import type { TrackStep } from "./StageTrack";
import { getStyles, styles } from "./StepsDrawer.styles";

export type StepsDrawerProps = {
  /** Everything behind the reader, in journey order. */
  behind: TrackStep[];
  /** What the collapsed drawer shows. */
  label: ReactNode;
  /** Pulls the ghost Collapse's own header padding back out, so its arrow
   *  lines up with whatever sits above it. */
  flush?: boolean;
};

export function StepsDrawer({ behind, label, flush = true }: StepsDrawerProps) {
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);

  if (behind.length === 0) return null;

  return (
    <Collapse
      ghost
      size="small"
      style={flush ? styles.flush : undefined}
      /*
        OUR OWN ARROW, because antd's did not turn. Measured with the panel
        open: the item carried `ant-collapse-item-active` and the default
        expand icon's computed transform was still the identity matrix, so the
        only thing telling a reader whether the drawer was open or shut was
        the drawer. A disclosure control that looks the same in both states is
        not one.
      */
      expandIcon={({ isActive }) => (
        <RightOutlined style={isActive ? s.arrowOpen : s.arrow} />
      )}
      items={[
        {
          key: "behind",
          label,
          children: (
            <Flex vertical style={styles.list}>
              {/* NEWEST FIRST — *"ფუნდინგი სულ მაღლა, პირველი სტეპი სულ
                  დაბლა."* The rail above reads left to right in journey
                  order, and this list used to repeat that order downwards,
                  which put the step that happened five minutes ago at the
                  bottom of the drawer and the one from three weeks back at
                  the top. This is a log, not a road: the reader opens it to
                  see what just happened, and every other log in this product
                  — the payment history, the notifications — puts the latest
                  entry first.

                  `toReversed` rather than `reverse`: the array is the
                  caller's, and reversing in place would silently re-order the
                  rail that shares it. */}
              {behind.toReversed().map((step) => (
                <Flex
                  key={step.key}
                  align="flex-start"
                  justify="space-between"
                  gap={24}
                  style={s.row}
                >
                  <Flex vertical gap={2} style={styles.copy}>
                    <Typography.Text style={s.step}>{step.title}</Typography.Text>
                    {step.note ? (
                      <Typography.Text style={s.note}>{step.note}</Typography.Text>
                    ) : null}
                  </Flex>
                  <Flex align="center" gap={12} style={styles.end}>
                    <Typography.Text style={s.date}>
                      {step.meta ?? t("dashboard.whenUnset")}
                    </Typography.Text>
                    <CheckCircleFilled style={s.tick} />
                  </Flex>
                </Flex>
              ))}
            </Flex>
          ),
        },
      ]}
    />
  );
}

export default StepsDrawer;
