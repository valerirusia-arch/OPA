// Nothing to show, in the two shapes it takes — plus the one that is not an
// empty state at all. On one page, because the point of this component is that
// they are the same page furniture with a different drawing, and that is only
// checkable side by side.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { EmptyState } from "./EmptyState";
import { TABLE_EMPTY_MIN_HEIGHT } from "./EmptyState.styles";

const meta = {
  title: "Shared/Empty state",
  component: EmptyState,
  parameters: { layout: "padded" },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The default, and most of them: nothing has been put here yet. No height
 *  reserved — a tab of a record that does not exist is not a table that
 *  shrank. */
export const Empty: Story = {
  args: {
    title: "No co-borrower",
    description: "This application has no co-borrower.",
  },
};

/** There IS something; the filters just do not reach it. Inside a table, so
 *  the height is reserved and the card keeps the size it had a moment ago. */
export const NotFound: Story = {
  args: {
    variant: "notFound",
    title: "No borrowers match these filters",
    description: "Try a different search, or clear the filters.",
    minHeight: TABLE_EMPTY_MIN_HEIGHT,
  },
};

/** Not an empty state: the page exists and this role may not open it. It gets
 *  its own drawing because blank rows under these words would say the page is
 *  empty, which is both wrong and the more alarming of the two readings. In
 *  the product it is page-sized and sits in a Result. */
export const NoAccess: Story = {
  args: {
    variant: "noAccess",
    title: "You don't have access to this page",
    description: "Your role doesn't have access to this page.",
  },
};

/** One line, no follow-up — when there is nothing to suggest, the second line
 *  is furniture. */
export const TitleOnly: Story = {
  args: { title: "No notifications yet" },
};
