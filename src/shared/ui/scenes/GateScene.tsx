// src/shared/ui/scenes/GateScene.tsx
//
// The application gate's illustrations — the designer's own Figma exports.
// The processing is fixed and the same for every file: strip the white
// export-card background and the baked pack label, recolour onto one of the
// four illustration ramps in src/theme/tokens.ts, scale the subject (the
// sheet, what is on it and its badge) by 1.05 about the sheet's own centre,
// crop the viewBox. The blob behind, the shadow under, the three + sparkles
// and the three specks are left exactly where the designer put them.
//
// ONE DRAWING, A BADGE, AND A COLOUR. Every state is the same sheet of paper
// at the same size; what changes is the badge in its corner and the ramp the
// whole drawing is coloured in. A reader moving between states sees one thing
// change, which is what the state IS.
//
//   teal  #42869A — neutral: in progress, waiting, an ending nobody refused
//   green #3E9370 — a good ending: approved, repaid
//   amber #C08A2E — fixable: something is needed, something is locked
//   red   #C0392B — a refusal: declined
//
// The ramp colours the WHOLE drawing, not just the badge: *"ერორზე ყველაფერი
// წითელი, ვორნინგზე ყვითელი"*. Earlier the document stayed teal under a
// coloured badge; it does not any more.
//
// It was orange first (the designer's own export, briefly also in a
// half-strength twin). Both are gone: *"არ მომწონს ეს ნარინჯისფერი მაინც"*.

import { getGateStyle } from "./GateScene.styles";
import start from "../../../assets/gate/start.svg";
import review from "../../../assets/gate/review.svg";
import approved from "../../../assets/gate/approved.svg";
import declined from "../../../assets/gate/declined.svg";
import attention from "../../../assets/gate/attention.svg";
import blocked from "../../../assets/gate/blocked.svg";
import person from "../../../assets/gate/person.svg";
import paused from "../../../assets/gate/paused.svg";
import personAttention from "../../../assets/gate/personAttention.svg";
import expired from "../../../assets/gate/expired.svg";

export type GateSceneName =
  /** A sheet and a pencil, teal. Nothing has been filled in yet. */
  | "start"
  /** A sheet under a magnifier, teal. Somebody is reading it. */
  | "review"
  /** A tick, green. The application was approved; the loan was repaid. */
  | "approved"
  /** A cross, red. OPA will not go ahead. */
  | "declined"
  /** An exclamation, amber. Something is needed, and it can be given. */
  | "attention"
  /** A padlock, amber. This door is shut, and support can open it. */
  | "blocked"
  /** Two figures, teal. The application is waiting on a person. */
  | "person"
  /** A clock, teal. Nobody is acting: a check has not answered yet. */
  | "paused"
  /** The same two figures, amber. The person is what did not work out. */
  | "personAttention"
  /** An opened envelope, amber. An invitation that is over. */
  | "expired";

const ASSETS: Record<GateSceneName, string> = {
  start,
  review,
  approved,
  declined,
  attention,
  blocked,
  person,
  paused,
  personAttention,
  expired,
};

/** The cropped viewBox the exports share: width 171, height 119. */
const VB_HEIGHT = 119;

export type GateSceneProps = {
  name: GateSceneName;
  /** Rendered width in px. */
  size?: number;
};

export function GateScene({ name, size = 200 }: GateSceneProps) {
  return (
    <div
      role="presentation"
      aria-hidden
      style={getGateStyle(ASSETS[name], size, VB_HEIGHT)}
    />
  );
}

export default GateScene;
