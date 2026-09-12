// Creating an internal account, and editing one. WBS: name, email and role —
// never a password, because the invited user sets that themselves.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { UserFormModal } from "./UserFormModal";

const meta = {
  title: "Users/User form",
  component: UserFormModal,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof UserFormModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NewUser: Story = { args: { open: true, mode: "create" } };

export const EditUser: Story = {
  args: {
    open: true,
    mode: "edit",
    initialValues: {
      name: "Alex Goldbarg",
      email: "alex.goldbarg@opa.example",
      role: "admin",
    },
  },
};
