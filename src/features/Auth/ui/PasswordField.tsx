// src/features/Auth/ui/PasswordField.tsx
//
// A password box whose DOTS are legible and whose TEXT is the size of every
// other field's.
//
// THE PROBLEM IS ONLY THE MASKED STATE. A masked field does not draw the font's
// characters, it draws the browser's security disc, and Montserrat's is small
// and sits low — at the 14px the rest of the form uses it reads as a faint
// dotted rule rather than as a typed answer. Someone typing a password cannot
// see what they typed; the count of marks is the only feedback there is.
//
// But the first fix applied the larger type unconditionally, so pressing the
// reveal eye showed the password at 18px with 2px between the letters, three
// sizes up from the field above it: *"ეს რა არის რატომ არის ტექტსი ამხელა? …
// მხოლოდ წერტილებზე გიტხარი."* Exactly the right correction — the discs are
// the only thing that needed help.
//
// So the enlargement is tied to visibility, which means owning the toggle:
// antd's `visibilityToggle` takes `{ visible, onVisibleChange }`, and this
// holds that one boolean. Local UI state, nothing else — the field stays dumb,
// and every prop it is given passes straight through to antd.
//
// Every password box in the product uses this, so none of them can drift.

import { useState } from "react";
import { Input } from "antd";
import type { PasswordProps } from "antd/es/input/Password";
import { maskedText } from "./PasswordField.styles";

/* `styles` is omitted on purpose: this component owns `styles.input`, which is
   how the masked size reaches the element that draws the discs. A caller
   passing its own would be silently fighting it, so the type says no. */
export function PasswordField({ visibilityToggle, ...rest }: Omit<PasswordProps, "styles">) {
  const [visible, setVisible] = useState(false);

  return (
    <Input.Password
      {...rest}
      visibilityToggle={
        /* `false` hides the eye altogether, and a field that cannot be revealed
           is always masked — so it passes straight through and `visible` stays
           false, which is already the right answer. */
        visibilityToggle === false
          ? false
          : {
              /* Spread first so a caller keeps its own `tabIndex` and still
                 hears about the change. */
              ...(typeof visibilityToggle === "object" ? visibilityToggle : null),
              visible,
              onVisibleChange: (next) => {
                setVisible(next);
                if (typeof visibilityToggle === "object") {
                  visibilityToggle.onVisibleChange?.(next);
                }
              },
            }
      }
      /* Revealed, it is ordinary text and takes the form's ordinary size. */
      styles={{ input: visible ? undefined : maskedText }}
    />
  );
}

export default PasswordField;
