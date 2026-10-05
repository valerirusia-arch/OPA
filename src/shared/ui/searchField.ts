// src/shared/ui/searchField.ts
//
// The magnifier that sits inside a list's search box.
//
// It took the input's TEXT colour, warm ink at 88%, while the placeholder
// beside it is `quiet` at 66% — so the one control carried two greys, and the
// darker of them was the decoration rather than the words. The icon is a
// label for an empty field, not content, so it reads at the placeholder's
// weight and steps aside the moment somebody types.
//
// Shared because all four admin lists draw the same box, and the pair only
// stays a pair if the number is written once. See AdminPage.styles.ts's
// `toolbarTheme`, which does the same for the "Filters" button on that line.

import type { CSSProperties } from "react";
import { brand } from "../../theme/tokens";

export const searchIcon: CSSProperties = { color: brand.quiet };
