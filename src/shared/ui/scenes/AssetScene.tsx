// src/shared/ui/scenes/AssetScene.tsx
//
// Renders a designer-supplied empty-state illustration (an SVG the designer
// exported into src/assets/empty-states/). The white card background is
// stripped and the baked label cropped out, so the screen supplies the OPA copy.

import { getStyle } from "./AssetScene.styles";
import emptyWallet from "../../../assets/empty-states/empty-wallet.svg";
import noCreditCards from "../../../assets/empty-states/no-credit-cards.svg";
import noData from "../../../assets/empty-states/no-data.svg";
import noResult from "../../../assets/empty-states/no-result.svg";
import noNotifications from "../../../assets/empty-states/no-notifications.svg";
import noCallRecord from "../../../assets/empty-states/no-call-record.svg";
import notLoggedIn from "../../../assets/empty-states/not-logged-in.svg";
import noAccess from "../../../assets/empty-states/no-access.svg";

export type AssetSceneName =
  | "emptyWallet"
  | "noCreditCards"
  | "noData"
  | "noResult"
  | "noNotifications"
  | "noCallRecord"
  | "notLoggedIn"
  | "noAccess";

const ASSETS: Record<AssetSceneName, string> = {
  emptyWallet,
  noCreditCards,
  noData,
  noResult,
  noNotifications,
  noCallRecord,
  notLoggedIn,
  noAccess,
};

/** Every file shares the same cropped viewBox height (width is 171). */
const VB_HEIGHT = 119;

/** Two sizes, like EmptyScene: a card-sized empty and a page-sized one. */
const WIDTH = { card: 164, page: 200 } as const;

export type AssetSceneProps = {
  name: AssetSceneName;
  scale?: "card" | "page";
  /** Centre the drawing in its slot (default). Off for a flex row, where auto
   *  margins fight the row's own alignment. */
  center?: boolean;
};

export function AssetScene({ name, scale = "card", center = true }: AssetSceneProps) {
  return (
    <div
      role="presentation"
      aria-hidden
      style={getStyle(ASSETS[name], WIDTH[scale], VB_HEIGHT, center)}
    />
  );
}

export default AssetScene;
