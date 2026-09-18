// src/shared/ui/PageNotice.tsx
//
// A PAGE'S ONE NOTICE — a soft, rounded, light panel.
//
// It has been three things. First an antd Alert as antd draws it: a tinted
// slab, a 1px ring in the state's hue, a bold title over a paragraph. Then the
// opposite — the box taken off entirely, down to a bare icon and a sentence —
// which read as unfinished, thrown onto the page. Now the middle: the panel is
// back, but as the product's own soft surface — the state's pale tint, a very
// light neutral hairline (so its edge reads on the page), the app's large
// radius, and the bare per-type glyph with nothing behind it. *"ამ ალერტებს
// უნდა ვუშველოთ... უფრო შევალამაზოთ, უფრო საინტერესო, მაგრამ მსუბუქი."* See
// notice.styles.ts for how each part earns "light".
//
// AND ONE SENTENCE, NOT TWO STACKED. Half of them had a bold title with a
// paragraph under it, which is a heading for a single line of text — *"ეს
// თაითლი არაა საჭირო, უბრალოდ გააერთიანე ტექსტი."* The callers hand over one
// message; the colour says what kind of news it is and the words say what it
// is.
//
// STILL AN antd ALERT. It keeps the role, the live-region behaviour and the
// per-type icon and tint; only the chrome is restyled. Composing this out of a
// Flex and an icon would mean hand-rolling something antd provides, and it
// would drop the alert semantics with the border.

import type { ReactNode } from "react";
import { Alert, theme } from "antd";
import { getNoticeStyles } from "./notice.styles";

export type PageNoticeProps = {
  /** Which kind of news it is. Drives the icon and its colour, nothing else. */
  tone: "success" | "info" | "warning" | "error";
  /** The whole message, as one sentence or two. No heading. */
  children: ReactNode;
  /** Sites that need a different gap below than the page rhythm's 24. */
  style?: React.CSSProperties;
};

export function PageNotice({ tone, children, style }: PageNoticeProps) {
  const { token } = theme.useToken();
  const s = getNoticeStyles(token);
  return (
    <Alert
      type={tone}
      showIcon
      style={style ? { ...s.notice, ...style } : s.notice}
      styles={{ icon: s.icon, title: s.message }}
      title={children}
    />
  );
}

export default PageNotice;
