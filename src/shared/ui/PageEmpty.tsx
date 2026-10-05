// src/shared/ui/PageEmpty.tsx
//
// A PAGE-SIZED EMPTY STATE, drawn one way everywhere.
//
// The dashboard band, the loan page with no loan and the payments page with
// nothing to repay are the same moment: a drawing, the state named, a sentence,
// and the way forward. They were set three different ways — the dashboard by
// hand, the other two as antd `Result` at a larger title and illustration — so
// the designer asked for one size across all three: *"ზუსტად ამხელა კონტეინერი,
// ამხელა ილუსტრაცია, ამხელა თაითლი, რომ კონსისტენტური იყოს."*
//
// This is that one layout. The illustration DIFFERS per page — the loan's card,
// the payments' receipt, the dashboard's record — because each page says what IS
// missing; the size, the type and the spacing do not.
//
// Dumb: it takes the drawing, the words and the action, and arranges them. The
// caller wraps it in its own Card.

import type { ReactNode } from "react";
import { Flex, Typography } from "antd";
import { styles } from "./PageEmpty.styles";

export type PageEmptyProps = {
  /** The drawing — usually an <EmptyScene variant=… />. Sized by the scene. */
  illustration: ReactNode;
  title: string;
  subtitle?: string;
  /** The one way forward, when there is one. */
  action?: ReactNode;
};

export function PageEmpty({ illustration, title, subtitle, action }: PageEmptyProps) {
  return (
    <Flex vertical align="center" gap={24} style={styles.wrap}>
      {illustration}
      {/* Title and sentence are one element — the state named, then explained —
          so they sit tight together; the button is held apart below. */}
      <Flex vertical align="center" gap={4}>
        <Typography.Text style={styles.title}>{title}</Typography.Text>
        {subtitle ? (
          <Typography.Text type="secondary" style={styles.subtitle}>
            {subtitle}
          </Typography.Text>
        ) : null}
      </Flex>
      {/* A direct flex child, so it sits the same 24 below the text as the loan
          and payments pages put their button. */}
      {action}
    </Flex>
  );
}

export default PageEmpty;
