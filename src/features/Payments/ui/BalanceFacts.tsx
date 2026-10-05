// src/features/Payments/ui/BalanceFacts.tsx
//
// THE THREE FACTS ABOUT THE BALANCE — the second half of the "What you owe"
// card, beside the figure rather than under it.
//
// THE ARITHMETIC THAT DECIDED THIS. They were tried as their own card in a
// third of the row, the way /loan sets its virtual card beside the statement.
// A third is ~400px, "FINAL PAYMENT DUE" does not set in a third of that, so
// the facts had to stack — three rows and two rules, ~190px tall. The balance
// beside them is a label, a figure and a caption, ~100px. The designer wants
// the pair level (*"ეს მარცხნივ გაუსწორე, აბა სიგრძეში"*), so the shorter
// card stretched and carried 90px of nothing. No ratio fixes that: whichever
// side is narrow becomes the tall one.
//
// So the two cards became ONE, split by a rule — *"ეს ინფორმაცია, არსებული
// რაც მქონდა, მინდოდა უფრო კარგად გადაგენაწილებინა"*. Across half a card
// each fact gets ~200px, which is room for its label on one line, so the
// three go SIDE BY SIDE and the block is ~70px: shorter than the figure it
// belongs to, which is the right way round. Nothing stretches and nothing is
// left over.
//
// Three facts across is also what this product already does with the loan's
// four contract facts along the statement's foot — *"მინდა რომ ეს 2 არ იყოს
// ჩამოდროპილი და 4 ივე გასწორებული იყოს ჰორიზონტალურად"*. One way of setting
// out small print, on both money pages.
//
// Dumb: it renders the list it is handed. The list is built once, by
// `balanceDetails`, so this block and the figure beside it cannot disagree
// about one loan.

import { Flex, Typography, theme } from "antd";
import type { BalanceDetail } from "./balanceDetails";
import { getStyles, styles } from "./BalanceFacts.styles";

export type BalanceFactsProps = {
  details: BalanceDetail[];
  /**
   * Stacked instead of side by side.
   *
   * Three labels across need the width of half a card. Below that — a phone —
   * they go down the column, where each gets the full measure.
   */
  stacked?: boolean;
};

export function BalanceFacts({ details, stacked = false }: BalanceFactsProps) {
  const { token } = theme.useToken();
  const s = getStyles(token);

  return (
    <Flex
      vertical={stacked}
      gap={stacked ? token.margin : token.marginXS}
      wrap={!stacked}
      style={styles.block}
    >
      {details.map((detail) => (
        /* An even share each, rather than three gaps and a tail of empty
           space — the same thing the loan statement does with its four. */
        <Flex vertical gap={4} key={detail.key} style={stacked ? undefined : styles.cell}>
          <Typography.Text style={s.label}>{detail.label}</Typography.Text>
          <Typography.Text style={detail.alarm ? s.valueAlarm : s.value}>
            {detail.value}
          </Typography.Text>
        </Flex>
      ))}
    </Flex>
  );
}

export default BalanceFacts;
