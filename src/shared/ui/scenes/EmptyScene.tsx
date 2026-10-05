// src/shared/ui/scenes/EmptyScene.tsx
//
// THE EMPTY-STATE DRAWINGS — the designer's own exported illustration set, used
// everywhere via a variant → asset map, so every call site is unchanged. The
// files live in src/assets/empty-states/ (white background stripped, baked label
// cropped out); the screen supplies the OPA copy around them. The coloured
// journey scenes (JourneyScene) are the application gate's status states.

import { AssetScene, type AssetSceneName } from "./AssetScene";

export type EmptySceneVariant =
  | "empty"
  | "notFound"
  | "noAccess"
  | "noLoan"
  | "noPayment"
  | "noMessages";

/** Which supplied illustration stands for each empty moment. */
const ASSET: Record<EmptySceneVariant, AssetSceneName> = {
  empty: "noData",
  notFound: "noResult",
  noAccess: "noAccess",
  noLoan: "emptyWallet",
  noPayment: "noCreditCards",
  noMessages: "noNotifications",
};

export type EmptySceneProps = {
  variant?: EmptySceneVariant;
  /** "card" is an empty inside a panel, "page" a whole screen. */
  scale?: "card" | "page";
};

export function EmptyScene({ variant = "empty", scale = "card" }: EmptySceneProps) {
  return <AssetScene name={ASSET[variant]} scale={scale} />;
}

export default EmptyScene;
