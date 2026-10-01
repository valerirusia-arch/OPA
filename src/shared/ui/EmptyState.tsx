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
// was the one that never did. The picture is now EmptyScene's business and the
// size is nobody's, so the only decision left at a call site is WHICH OF TWO
// situations this is: nothing is here, or nothing was found. *"სადაც ინფო არ
// არის ერთი ილუსტრაცია იყოს, სადაც მსგავსი რამ არ მოიძებნა ერთი
// ილუსტრაცია."*
//
// Those two are the whole set. An earlier pass had six — records, search,
// done, inbox, denied, missing — which is six names for what the reader
// experiences as two moments, and a sixth name is how a seventh gets added.
//
// The page-sized moments — an application that has not been started, a loan
// that does not exist yet — are NOT this. Those are antd's `Result`, with room
// for a heading and an action, and they keep their own larger artwork.
//
// `minHeight` is what stops a card collapsing to a strip when its table
// empties out.

import { Empty, Flex, Typography, theme } from "antd";
import { EmptyScene, type EmptySceneVariant } from "./empty/EmptyScene";
import { getStyles, styles } from "./EmptyState.styles";

export type EmptyStateProps = {
  title: string;
  /** The follow-up line: what to try, or why this is normal. */
  description?: string;
  /** Nothing here, or nothing found. See EmptyScene. */
  variant?: EmptySceneVariant;
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
        image={<EmptyScene variant={variant} />}
        /* The scene sizes itself; antd's fixed image slot would crop it. */
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
