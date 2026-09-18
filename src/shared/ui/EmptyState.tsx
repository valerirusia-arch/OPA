// src/shared/ui/EmptyState.tsx
//
// Nothing to show, said properly: antd's illustration, a line that names what
// is missing, and a line that says what to do about it.
//
// One component for both cases, because they are the same moment to the reader:
// a table whose filters match nothing, and a tab of a borrower's record that
// does not exist yet. The `minHeight` is what stops a card collapsing to a
// strip when its table empties out.

import type { ReactNode } from "react";
import { Empty, Flex, Typography, theme } from "antd";
import { getStyles, styles } from "./EmptyState.styles";

export type EmptyStateProps = {
  title: string;
  /** The follow-up line: what to try, or why this is normal. */
  description?: string;
  /** Reserve a height so the surrounding card keeps its size. */
  minHeight?: number;
  /**
   * A custom illustration in place of antd's default "no data" glyph — one of
   * the product's own marks, for an empty that wants to read as part of the
   * app rather than as a system placeholder. antd pins its image slot to a
   * fixed height, so a mark is let out to its own size.
   */
  image?: ReactNode;
};

export function EmptyState({ title, description, minHeight, image }: EmptyStateProps) {
  const { token } = theme.useToken();
  const s = getStyles(token);

  return (
    <Flex align="center" justify="center" style={minHeight ? { minHeight } : undefined}>
      <Empty
        style={s.empty}
        image={image ?? undefined}
        imageStyle={image ? { height: "auto" } : undefined}
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
