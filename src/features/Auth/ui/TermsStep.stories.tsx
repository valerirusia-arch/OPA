// The consent step. The summary panel is the point of review here: the
// applicant has to be able to see what they are accepting before the
// checkboxes mean anything.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { TermsStep } from "./TermsStep";

const meta = {
  title: "Auth/Terms step",
  component: TermsStep,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div style={{ width: 660 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TermsStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Submitting: Story = { args: { submitting: true } };
