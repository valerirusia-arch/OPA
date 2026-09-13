// src/flows/_devbar/StageDock.tsx
//
// The demo control: walk the borrower's whole journey, one stage at a time,
// from wherever you are standing.
//
// The DevBar already has a stage picker, and a picker is the wrong tool for
// this job — the designer's ask was to WALK it: *"რამე დემო ღილაკი უნდა
// მქონდეს, რაც სტეპებზე გადამიყვანს, ფლოატედ ღილაკი, რომელიც არ იქნება UI-ის
// ნაწილი."* One press forward, one press back, and the page under it becomes
// the next state — which is how you find out that a screen says nothing about
// where the money went, or that two states look identical.
//
// NOT PART OF THE PRODUCT, and it has to look like it: it floats over the
// page in the dev toolbar's own dark, carries a DEMO tag, and it renders only
// in development — `import.meta.env.DEV` is statically replaced at build time,
// so this whole file is tree-shaken out of production. It is also the reason
// it stays when the DevBar is hidden: hiding the bar is for looking at the
// design, and this is how you get to the state you want to look at.
//
// Borrower and co-borrower only. The back office reads its own lists and none
// of these stages would change them.

import { Button, Flex, Segmented, Tag, Tooltip, Typography, theme } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import type { TrackVariant } from "../../features/Dashboard/ui/StageTrack";
import { setStage, stageLabel, stagesForPath, useBorrowerStage } from "../loan/loanRecord";
import { setTrackerVariant, useTrackerVariant } from "../dashboard/trackerVariant";
import { getStyles, styles } from "./StageDock.styles";

/** Dev-tool copy, so it is not translated — same rule as the DevBar's own
 *  "view as" switch. */
const TRACKERS: { label: string; value: TrackVariant }[] = [
  { label: "Nodes", value: "nodes" },
  { label: "Bars", value: "bars" },
];

export type StageDockProps = {
  /** Which page is under the dock: it only offers that page's own states. */
  pathname: string;
};

export function StageDock({ pathname }: StageDockProps) {
  const { token } = theme.useToken();
  const s = getStyles(token);
  const stage = useBorrowerStage();
  const tracker = useTrackerVariant();
  /* Only the dashboard draws a tracker, so only the dashboard offers the
     switch. A control that changes nothing on the page under it is worse
     than a missing one. */
  const onDashboard = pathname.startsWith("/dashboard");

  const order = stagesForPath(pathname);
  const index = order.indexOf(stage);
  const step = (delta: number) => {
    /* Standing on a stage this page does not list — walk in from its start
       rather than doing nothing. */
    const next = index === -1 ? order[0] : order[index + delta];
    if (next) setStage(next);
  };

  return (
    <div style={s.dock}>
      <Flex align="center" gap={12}>
        <Tag color="processing" style={styles.tag}>
          DEMO
        </Tag>

        <Tooltip title="Previous stage">
          <Button
            size="small"
            type="text"
            icon={<LeftOutlined />}
            style={s.arrow}
            disabled={index <= 0}
            onClick={() => step(-1)}
          />
        </Tooltip>

        {/* The label is the point of the control, so it gets the room: a
            fixed width, so pressing through the journey does not make the
            dock jump about under the cursor. */}
        <Flex vertical style={styles.readout}>
          {/* Off-list: the prototype is in a stage this page does not draw
              differently — say so rather than counting it as zero. */}
          <Typography.Text style={s.counter}>
            {index >= 0
              ? `Stage ${index + 1} of ${order.length}`
              : `Stage — of ${order.length}`}
          </Typography.Text>
          <Typography.Text style={s.label}>{stageLabel(stage)}</Typography.Text>
        </Flex>

        <Tooltip title="Next stage">
          <Button
            size="small"
            type="text"
            icon={<RightOutlined />}
            style={s.arrow}
            disabled={index >= order.length - 1}
            onClick={() => step(1)}
          />
        </Tooltip>

        {/* THE TWO TRACKERS, SIDE BY SIDE IN TIME RATHER THAN IN SPACE.
            Walking the stages with this switch is how you find out that one
            of them holds up when a step has failed and a date is missing,
            which is not a thing two screenshots can tell you. */}
        {onDashboard ? (
          <>
            <span style={s.split} />
            <Segmented<TrackVariant>
              size="small"
              value={tracker}
              onChange={setTrackerVariant}
              options={TRACKERS}
            />
          </>
        ) : null}
      </Flex>
    </div>
  );
}

export default StageDock;
