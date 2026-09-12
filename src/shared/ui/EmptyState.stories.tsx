// Nothing to show, in the two places it happens: a table whose filters match
// nothing, and a tab of a record that does not exist yet.

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

/** Inside a table: the height is reserved so the card keeps its size. */
export const NoSearchResults: Story = {
  args: {
    title: "No borrowers match these filters",
    description: "Try a different search, or clear the filters.",
    minHeight: TABLE_EMPTY_MIN_HEIGHT,
  },
};

/** Inside a tab: nothing has gone wrong, that part of the record is just
 *  not there yet, so no height is reserved. */
export const NoCoBorrower: Story = {
  args: {
    title: "No co-borrower",
    description: "This application has no co-borrower.",
  },
};
