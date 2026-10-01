// src/features/Auth/ui/PasswordField.tsx
//
// The one password box in the product, so every field that takes a password —
// sign-in, registration, change / reset / set — is the same control and none
// of them can drift.
//
// IT DOES NOT RESIZE ON TOGGLE. An earlier version enlarged the MASKED discs,
// because Montserrat's security disc is small and faint at 14px. But that made
// the field jump every time the reveal eye was pressed: the discs (18px) gave
// way to the 14px text and the input's own line box changed with them —
// *"როცა თვალს ვაწვები უცებ ინფუთი იზრდება და ტექსტიც პატარავდება."* The
// revealed text has to stay at the form's ordinary 14px, the size of every
// other field, so the only way the toggle can change nothing is for the masked
// discs to be that size too. Both states render at 14px now and the field is
// perfectly still.
//
// Dumb: a thin wrapper, every prop passing straight through to antd.

import { Input } from "antd";
import type { PasswordProps } from "antd/es/input/Password";

export function PasswordField(props: PasswordProps) {
  return <Input.Password {...props} />;
}

export default PasswordField;
