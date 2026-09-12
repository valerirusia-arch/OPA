// src/shared/ui/RequiredAsterisk.tsx
//
// The "this field is required" marker.
//
// It lives here rather than inside ThemeProvider because a label is not always
// a plain string: where a field's label carries something after it — a
// "Verified" tag, a badge — the asterisk has to sit between the words and that
// something, which means the label has to place it itself.

import { Typography, theme } from "antd";
import { getStyles } from "./RequiredAsterisk.styles";

export function RequiredAsterisk() {
  const { token } = theme.useToken();

  return (
    <Typography.Text type="danger" style={getStyles(token).mark}>
      *
    </Typography.Text>
  );
}

export default RequiredAsterisk;
