// WBS: staff may correct a borrower's personal data by hand. Email and phone
// are plain inputs here — no format rule, and no re-verification.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { ManageBorrowerModal } from "./ManageBorrowerModal";

const meta = {
  title: "Borrowers/Manage account",
  component: ManageBorrowerModal,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ManageBorrowerModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Filled: Story = {
  args: {
    open: true,
    initialValues: {
      firstName: "Maria",
      middleName: "Elena",
      lastName: "Gonzalez",
      email: "maria.gonzalez@example.com",
      phone: "(213) 555-0101",
      street: "712 Cesar Chavez Ave",
      city: "Los Angeles",
      state: "CA",
      zip: "90033",
    },
  },
};
