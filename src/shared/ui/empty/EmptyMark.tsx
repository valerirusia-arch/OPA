// src/shared/ui/empty/EmptyMark.tsx
//
// THE MARK THAT SITS ABOVE EVERY "NOTHING HERE" SENTENCE.
//
// WHY THERE IS NO ILLUSTRATION PACK BEHIND THIS. The product had one — flat
// cornflower-blue drawings on a periwinkle disc — and on a page of warm
// off-white, deep teal and burnt orange it was the only saturated blue in
// sight, so the one thing that read as imported from somewhere else was the
// thing that appears when there is nothing to look at. That is the failure
// mode of EVERY illustration library, unDraw and Storyset included: the pack
// has a palette and a drawing style of its own, you re-tint it once, and it
// drifts the next time anyone adds a screen.
//
// So the mark is built from what the product already owns and cannot drift
// from: an antd `Avatar` — the same circle the people in this product are
// drawn as — holding an `@ant-design/icons` glyph, in theme tokens. The icon
// set is the one in the sidebar, the table headers and every button, so an
// empty state is the only thing on screen that could NOT look foreign. A
// recolour of the theme recolours this, with no asset to re-export.
//
// THE RULE FOR PICKING A MOTIF IS WHAT IS MISSING, NOT WHAT THE PICTURE SHOWS
// — a motif named after its drawing is how a set grows a seventh that means
// the same as the second:
//
//   records  — nothing has been put here yet (documents, comments, a tab of a
//              record that does not exist). The default.
//   search   — there IS something, and the filters just do not reach it.
//   done     — there is nothing left, and that is the good outcome.
//   inbox    — no messages.
//   denied   — it exists, and this reader may not see it.
//   missing  — it was asked for by id and there is no such record.
//
// The last two replace antd's own 403 and 404 artwork, which
// was the loudest thing in the product: full-colour cartoon characters on nine
// staff screens, shipped with the library and recognisable as such. They had
// to be swapped by DROPPING `status` rather than by passing an `icon`, because
// Result ignores a given icon whenever the status is one it has a drawing for.
//
// Nothing else is exported. A caller cannot hand in its own picture, which is
// the whole point: `EmptyState` is the only thing that decides how an empty
// state looks.

import { Avatar, theme } from "antd";
import {
  BellOutlined,
  CheckOutlined,
  FileSearchOutlined,
  FileTextOutlined,
  LockOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { getStyles } from "./EmptyMark.styles";

export type EmptyMarkVariant =
  | "records"
  | "search"
  | "done"
  | "inbox"
  | "denied"
  | "missing";

const GLYPHS = {
  records: <FileTextOutlined />,
  search: <SearchOutlined />,
  done: <CheckOutlined />,
  inbox: <BellOutlined />,
  denied: <LockOutlined />,
  missing: <FileSearchOutlined />,
} satisfies Record<EmptyMarkVariant, React.ReactNode>;

export type EmptyMarkProps = {
  variant?: EmptyMarkVariant;
  /**
   * TWO SIZES, AND NO THIRD. "card" is an empty inside a panel, "page" is a
   * whole screen the reader cannot use. Call sites pick which of the two
   * situations they are in — never a number, which is how the illustrations
   * this replaces ended up at 112 on one screen and 120 on the next.
   */
  scale?: "card" | "page";
};

const SIZE = { card: 72, page: 96 } as const;

export function EmptyMark({ variant = "records", scale = "card" }: EmptyMarkProps) {
  const { token } = theme.useToken();
  const s = getStyles(token);

  /* `Avatar` rather than a styled div: it is antd's circle, it centres the
     glyph for us, and it is already the shape this product draws a person and
     an auth outcome as — so there is one round mark, not three that are nearly
     the same. */
  return (
    <Avatar
      size={SIZE[scale]}
      icon={GLYPHS[variant]}
      style={scale === "page" ? s.markPage : s.mark}
    />
  );
}

export default EmptyMark;
