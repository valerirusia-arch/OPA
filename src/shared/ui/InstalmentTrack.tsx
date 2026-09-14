// src/shared/ui/InstalmentTrack.tsx
//
// THE SCHEDULE, DRAWING ITSELF.
//
// One capsule per instalment instead of one bar with a percentage on it. The
// bar reported "25%", and on a freshly funded loan it reported "0%" over an
// empty grey line — a card whose one piece of colour was a statement that
// nothing had happened. A percentage is the wrong unit for this as well:
// nobody repays a percentage, they repay twelve payments, and the thing they
// want to see is how many are left.
//
// So the schedule draws itself. Twelve segments, the paid ones filled, the
// rest waiting — countable at a glance, honest at zero (twelve to go is a
// fact; 0% is a void), and the same capsule the application rail is built
// from, so every progress on the borrower's side speaks one visual language.
//
// SHARED, because two pages show this same schedule: the balance card on the
// dashboard and on /payments, and the loan page's statement. They were a
// segmented row and a percentage bar respectively, which is two pictures of
// one fact.
//
// Dumb: two counts in, nothing out.

import { Flex, theme } from "antd";
import { getStyles, styles } from "./InstalmentTrack.styles";

export type InstalmentTrackProps = {
  /** How many are behind the borrower. */
  paid: number;
  /** How many there are. The schedule's own length, never a rounded figure. */
  total: number;
  /** For screen readers, which cannot count capsules. */
  ariaLabel?: string;
};

export function InstalmentTrack({ paid, total, ariaLabel }: InstalmentTrackProps) {
  const { token } = theme.useToken();
  const s = getStyles(token);

  return (
    <Flex
      /* 6, not 4. Twelve capsules at 4px apart read as one dashed bar rather
         than as twelve things you can count, which is the whole point of
         drawing the schedule instead of a percentage. *"სულ ოდნავ მეტი
         სფეისი ერთმანეთს შორის უკეთესი იქნება."* */
      gap={6}
      style={styles.track}
      role="img"
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    >
      {Array.from({ length: total }, (_, index) => (
        <div key={index} style={index < paid ? s.paid : s.due} />
      ))}
    </Flex>
  );
}

export default InstalmentTrack;
