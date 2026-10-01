// src/shared/ui/EmptyState.tsx
//
// Nothing to show, said the same way every time: one mark, a line that names
// what is missing, and — when there is one — a line that says what to do.
//
// ONE COMPONENT FOR EVERY EMPTY INSIDE A CARD, because they are the same
// moment to the reader whether it is a table the filters emptied out, a tab of
// a record that does not exist yet, or a list nobody has added to.
//
// IT TAKES A `variant`, NOT AN `image`. It used to take the picture itself,
// and that is how a product ends up with the thing this was meant to fix:
// fourteen call sites each passing a drawing at a size of its own — 112 here,
// 120 there — so the one state that is supposed to look identical everywhere
// was the one that never did. The picture is now EmptyMark's business and the
// size is nobody's, so the only decision left at a call site is which of four
// things is missing. *"ყველგან ერთ სტილში, რომელიც ქლინ იქნება, მარტივი,
// სუფთა."*
//
// The page-sized moments — an application that has not been started, a loan
// that does not exist yet — are NOT this. Those are antd's `Result`, with room
// for a heading and an action, and they keep their own larger artwork.
//
// `minHeight` is what stops a card collapsing to a strip when its table
// empties out.

import { Empty, Flex, Typography, theme } from "antd";
import { EmptyMark, type EmptyMarkVariant } from "./empty/EmptyMark";
import { getStyles, styles } from "./EmptyState.styles";

export type EmptyStateProps = {
  title: string;
  /** The follow-up line: what to try, or why this is normal. */
  description?: string;
  /** Which of the four things is missing. See EmptyMark. */
  variant?: EmptyMarkVariant;
  /** Reserve a height so the surrounding card keeps its size. */
  minHeight?: number;
};

export function EmptyState({ title, description, variant, minHeight }: EmptyStateProps) {
  const { token } = theme.useToken();
  const s = getStyles(token);

  return (
    <Flex align="center" justify="center" style={minHeight ? { minHeight } : undefined}>
      <Empty
        style={s.empty}
        image={<EmptyMark variant={variant} />}
        /* The mark sizes itself; antd's fixed image slot would crop it. */
        imageStyle={styles.image}
        description={
          <>
            <Typography.Text style={styles.title}>{title}</Typography.Text>
            {description ? (
              <Typography.Text style={s.description}>{description}</Typography.Text>
            ) : null}
          </>
        }
      />
    </Flex>
  );
}

export default EmptyState;
