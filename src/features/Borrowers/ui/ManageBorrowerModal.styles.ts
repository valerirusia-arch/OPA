// src/features/Borrowers/ui/ManageBorrowerModal.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  title: { marginTop: 0, marginBottom: 24 },
  actions: { justifyContent: "flex-end", marginTop: 8 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /**
     * Nine fields in one run is a wall, so the name and the address are two
     * blocks — but they are named by the fields themselves, and a heading over
     * "First name / Middle name / Last name" only says it twice. A quiet rule
     * marks the break and adds no words.
     */
    groupRule: { marginBlock: `${token.marginXS}px ${token.marginLG}px` },
  }) satisfies Record<string, CSSProperties>;
