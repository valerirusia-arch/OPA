// Nothing to show, in the six shapes it takes — the whole set on one page,
// because the point of this component is that they are the same page furniture
// with a different glyph, and that is only checkable side by side.

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

/** The default: nothing has been put here yet. No height reserved — a tab of a
 *  record that does not exist is not a table that shrank. */
export const Records: Story = {
  args: {
    title: "No co-borrower",
    description: "This application has no co-borrower.",
  },
};

/** There IS something; the filters just do not reach it. Inside a table, so
 *  the height is reserved and the card keeps the size it had a moment ago. */
export const Search: Story = {
  args: {
    variant: "search",
    title: "No borrowers match these filters",
    description: "Try a different search, or clear the filters.",
    minHeight: TABLE_EMPTY_MIN_HEIGHT,
  },
};

/** Nothing left, and that is the good outcome. */
export const Done: Story = {
  args: {
    variant: "done",
    title: "This loan is settled",
    description: "Every instalment has been paid.",
  },
};

/** No messages. One line, no follow-up — there is nothing to suggest. */
export const Inbox: Story = {
  args: { variant: "inbox", title: "No notifications yet" },
};

/* The last two are page-sized in the product — they replace antd's 403 and 404
   artwork and sit in a `Result`, not in a card. Shown here at the card size
   because this component is the card one; what is under review is the motif. */

/** It exists, and this reader may not see it. */
export const Denied: Story = {
  args: {
    variant: "denied",
    title: "You don't have access to this page",
    description: "Your role doesn't have access to this page.",
  },
};

/** Asked for by id, and there is no such record. */
export const Missing: Story = {
  args: { variant: "missing", title: "That borrower does not exist" },
};
