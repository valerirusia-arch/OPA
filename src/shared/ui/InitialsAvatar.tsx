// src/shared/ui/InitialsAvatar.tsx
//
// One person, one mark. The signed-in user is drawn the same way everywhere —
// the top bar, the back-office bar, the profile page — so the small circle in
// the corner is recognisably the big one on the profile, not a stock icon that
// happens to sit where a face should be.
//
// Dumb: it takes a name and a size and draws initials.

import { Avatar, theme } from "antd";
import { brand } from "../../theme/tokens";

export type InitialsAvatarProps = {
  /** The person's full name. Blank falls back to antd's own placeholder. */
  name?: string;
  size?: number;
  /**
   * A ring in the page's background colour, for an avatar that overlaps
   * something behind it. Flush on a plain surface it just looks inset.
   */
  ringed?: boolean;
};

/**
 * The first letter of the first two words. Two is the convention people read
 * as initials; a third starts looking like an acronym.
 */
const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");

export function InitialsAvatar({ name, size = 32, ringed = false }: InitialsAvatarProps) {
  const { token } = theme.useToken();
  const initials = name ? initialsOf(name) : "";

  return (
    <Avatar
      size={size}
      style={{
        background: brand.avatarTint,
        color: token.colorWhite,
        flex: "none",
        // Scaled off the circle rather than fixed, so one component serves the
        // 28px corner mark and the 88px profile head without a second style.
        fontSize: Math.round(size * 0.34),
        fontWeight: 500,
        letterSpacing: "0.02em",
        ...(ringed ? { border: `4px solid ${token.colorBgContainer}` } : null),
      }}
    >
      {initials}
    </Avatar>
  );
}

export default InitialsAvatar;
