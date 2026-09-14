// src/shared/ui/PageNotice.tsx
//
// A PAGE'S ONE NOTICE, with its chrome taken off.
//
// These were antd Alerts as antd draws them: a tinted panel, a 1px ring in
// the state's own hue, a title in bold and a paragraph under it, full width
// above the page's first card. Four of them across the borrower's side, each
// one a coloured slab sitting over a white card that has its own border and
// its own heading — so the page opened with two boxes before it said
// anything.
//
// The designer took the box away and kept the signal: *"ამ ალერტებს არც
// ბექგრაუნდი და არც სტროუკი სჭირდებათ — მხოლოდ იყოს ეს მწვანე ან წითელი ან
// ნარინჯისფერი, მაგ ფერის ალერტი და გვერდზე ტექსტი."* What is left is the
// state's own mark and a sentence beside it, which is all a notice was ever
// carrying: the colour says what kind of news it is and the words say what
// the news is.
//
// AND ONE SENTENCE, NOT TWO STACKED. Half of them had a bold title with a
// paragraph under it, which is a heading for a single line of text — *"ეს
// თაითლი არაა საჭირო, უბრალოდ გააერთიანე ტექსტი."* The callers now hand over
// one message.
//
// STILL AN antd ALERT. It keeps the role, the live-region behaviour and the
// per-type icon; only the panel is removed. Composing this out of a Flex and
// an icon would mean hand-rolling something antd provides, and it would drop
// the semantics with the border.

import type { ReactNode } from "react";
import { Alert } from "antd";
import { pageNotice, pageNoticeIcon } from "./notice.styles";

export type PageNoticeProps = {
  /** Which kind of news it is. Drives the icon and its colour, nothing else. */
  tone: "success" | "info" | "warning" | "error";
  /** The whole message, as one sentence or two. No heading. */
  children: ReactNode;
  /** Sites that need a different gap below than the page rhythm's 24. */
  style?: React.CSSProperties;
};

export function PageNotice({ tone, children, style }: PageNoticeProps) {
  return (
    <Alert
      type={tone}
      showIcon
      style={style ? { ...pageNotice, ...style } : pageNotice}
      styles={{ icon: pageNoticeIcon }}
      title={children}
    />
  );
}

export default PageNotice;
