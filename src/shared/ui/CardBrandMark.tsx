// src/shared/ui/CardBrandMark.tsx
//
// The payment network's mark, top left on the card face.
//
// WHY IT IS A FACT AND NOT DECORATION: the brand is one of the four things
// the WBS says OPA actually holds about a card — "a token, a brand, four
// digits and an expiry" — and it is the one a person recognises before they
// read anything. Somebody checking which card is on file looks for the mark
// first and the last four second.
//
// ─────────────────────────────────────────────────────────────────────────
// THE REAL ARTWORK, NOT A RECREATION. The designer's instruction, and it is
// the right one: *"მე მინდა ზუსტად ვიზას ლოგოები … და არა რეკრეატი."*
//
// So this component's FIRST choice is always the official file. Those files
// are licensed trademarks distributed by the networks' own brand centres
// under terms OPA accepts — they are not something a designer or an agent may
// draw, trace or approximate into the repo. `src/assets/brand/README.md` says
// which files, under which names, from where.
//
// THEY ARE PICKED UP AT BUILD TIME, from `src/assets/brand/`, not requested
// from `public/`. It matters: a file that is not there is then simply not
// referenced, and the card falls straight through to its fallback. Served as
// a URL instead, the same miss becomes a request — and Vite answers an
// unknown path with the app's own HTML at 200, so the browser tries to decode
// a web page as an image and the card wears a broken-image icon. That is
// exactly what it did before this was moved.
//
// WHAT HAPPENS UNTIL THEY ARRIVE: the mark falls back to what this file can
// honestly draw, so no card face is ever blank —
//
//   · Mastercard is AUTHORED GEOMETRY and is not an approximation of
//     anything: two circles of equal radius with the intersection in its own
//     third colour. That is what the symbol is.
//   · Visa is a STAND-IN and is meant to look like one — the name in the
//     card's own face at the mark's size. Its wordmark is bespoke lettering,
//     and a hand-traced imitation of a registered logotype would be both
//     wrong to ship and visibly off.
//
// The fallback is a courtesy for the prototype, never the shipping answer.
//
// Dumb: it takes a brand name and draws it.

import { useId } from "react";
import { Image, Typography } from "antd";
import { brand as palette } from "../../theme/tokens";
import { getStyles, MARK_HEIGHT } from "./CardBrandMark.styles";

/**
 * Whatever official artwork is actually in the folder, resolved when the app
 * is built. An empty folder gives an empty map and nothing is requested.
 */
const FILES = import.meta.glob("../../assets/brand/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const fileUrl = (name: string): string | undefined =>
  FILES[`../../assets/brand/${name}`];

/**
 * Which file each network wants, per ground.
 *
 * Two entries for Visa because the wordmark is ink: the blue one vanishes on
 * the navy card and the reversed one vanishes on the pale card. One for
 * Mastercard because the full-colour symbol reads on both.
 */
const ASSETS: Record<string, { onDark: string; onLight: string }> = {
  visa: { onDark: "visa-on-dark.svg", onLight: "visa-on-light.svg" },
  mastercard: { onDark: "mastercard.svg", onLight: "mastercard.svg" },
};

export type CardBrandMarkProps = {
  /** The network, as the product stores it: "Visa", "Mastercard", … */
  brand: string;
  /** Which ink the card face is using: picks the asset and the fallback's ink. */
  onDark?: boolean;
};

export function CardBrandMark({ brand: network, onDark = true }: CardBrandMarkProps) {
  /* The clip path is referenced by id, and the mark is drawn more than once
     on a page — two cards, or a card and its dialog. A shared id would make
     the second one clip against the first's shape. */
  const clipId = useId();
  const s = getStyles(onDark);
  const name = network.trim().toLowerCase();

  const asset = ASSETS[name];
  const src = asset ? fileUrl(onDark ? asset.onDark : asset.onLight) : undefined;

  if (src) {
    return (
      <Image
        src={src}
        alt={network}
        height={MARK_HEIGHT}
        preview={false}
        style={s.artwork}
        styles={{ root: s.artworkWrapper }}
      />
    );
  }

  if (name === "mastercard") {
    return (
      <svg
        width={(MARK_HEIGHT * 32) / 20}
        height={MARK_HEIGHT}
        viewBox="0 0 32 20"
        role="img"
        aria-label={network}
        style={s.mark}
      >
        <defs>
          <clipPath id={clipId}>
            <circle cx="12" cy="10" r="10" />
          </clipPath>
        </defs>
        <circle cx="12" cy="10" r="10" fill={palette.mcRed} />
        <circle cx="20" cy="10" r="10" fill={palette.mcAmber} />
        {/* The lens where they cross, clipped to the left circle so it is
            exactly the intersection and not an approximation of it. */}
        <g clipPath={`url(#${clipId})`}>
          <circle cx="20" cy="10" r="10" fill={palette.mcOverlap} />
        </g>
      </svg>
    );
  }

  /* Visa without its file, and anything else the product is ever handed. */
  return (
    <Typography.Text style={name === "visa" ? s.wordmark : s.word} aria-label={network}>
      {network}
    </Typography.Text>
  );
}

export default CardBrandMark;
