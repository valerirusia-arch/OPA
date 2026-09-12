// src/shared/ui/StatusPill.tsx
//
// A STATE, drawn as a state.
//
// Every status in this product was an antd `Tag` with a pale fill and coloured
// words — "Pending action" in amber on amber, "Overdue" in red on red. At a
// glance that is a coloured label, and the product is full of coloured labels
// that are not statuses: a document type, a role, a card brand. The designer's
// note was that the statuses should read better than that.
//
// So a status gets a DOT. It is the oldest convention there is for "this thing
// is in a state" — a filled circle in the state's own colour, ahead of the
// word — and it does three things the fill alone could not:
//
//   · it separates statuses from labels at a glance, without a second colour;
//   · it survives the fill being pale, which is what keeps these readable
//     against AA (see the note on `success` in tokens.ts);
//   · it gives the neutral states — "Scheduled", "Submitted" — something to
//     be, instead of looking like unstyled text in a box.
//
// The pill itself is unchanged: same antd Tag, same preset colours, same
// rounding. Only statuses use this; a type or a role keeps the plain Tag,
// because a dot in front of "consent" would be claiming it is a state.

import type { ReactNode } from "react";
import { Flex, Tag, theme } from "antd";
import { pill } from "./tag.styles";
import { getStyles } from "./StatusPill.styles";

export type StatusPillProps = {
  /**
   * An antd preset colour name — "success", "error", "warning",
   * "processing" — or nothing for the neutral state.
   */
  color?: string;
  /** Shown instead of the dot: a stop sign, a tick. */
  icon?: ReactNode;
  children: ReactNode;
};

export function StatusPill({ color, icon, children }: StatusPillProps) {
  const { token } = theme.useToken();
  const s = getStyles(token);

  /* The dot takes the state's own colour at full strength — the fill behind
     it is that colour at about a tenth, which is why the dot reads. */
  const dot =
    color === "success"
      ? s.dotSuccess
      : color === "error"
        ? s.dotError
        : color === "warning"
          ? s.dotWarning
          : color === "processing"
            ? s.dotProcessing
            : s.dotNeutral;

  /* …and every pill takes the same neutral hairline, so the shape reads and
     the colour stays the fill's job. See the note in the styles. */

  return (
    <Tag color={color} variant="filled" style={{ ...pill, ...s.tag, ...s.edge }}>
      <Flex align="center" gap={7} style={s.inner}>
        {icon ?? <span style={dot} />}
        {children}
      </Flex>
    </Tag>
  );
}

export default StatusPill;
