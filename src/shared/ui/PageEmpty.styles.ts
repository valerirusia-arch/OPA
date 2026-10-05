// src/shared/ui/PageEmpty.styles.ts

import type { CSSProperties } from "react";
import { brand } from "../../theme/tokens";

export const styles = {
  /** The vertical air a page-sized empty stands in. One value everywhere it is
   *  used, so the dashboard band, the loan page and the payments page cannot
   *  drift to three different heights. */
  /* 48 top and bottom — the same block padding antd's Result gives the loan and
     payments empties, so inside their cards all three sit identically. */
  wrap: {
    paddingBlock: 48,
    textAlign: "center",
    width: "100%",
  },
  /** 24px, regular weight — matched to the loan page's antd Result title, which
   *  read lighter than this one at 500. *"24 პიქსელი, ლოანის სისქე."* */
  title: { fontSize: 24, fontWeight: 400 },
  /** The sentence that explains it, in the caption grey, held to a readable
   *  measure. */
  subtitle: { maxWidth: 420, color: brand.sceneCaption },
} satisfies Record<string, CSSProperties>;
