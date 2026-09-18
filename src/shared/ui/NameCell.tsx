// src/shared/ui/NameCell.tsx
//
// A PERSON'S NAME IN A TABLE, drawn the same way in every table.
//
// Four back-office lists put a name in their first column and each had grown
// its own version of it: the queue drew the name over the application's id,
// the loans list drew a bare link, the dashboard's two tabs drew a bare link
// with no width, and the borrower list drew the name in ink until the link
// colour was settled. Same object, four drawings — *"თებლები უნდა იყოს ძაან
// კონსისტენტური."*
//
// One cell instead: the name as a link in the link colour, and under it the
// reference support would be asked for. The reference is optional because not
// every list has one to give.
//
// It is also why the name column always carries a WIDTH. antd's fixed layout
// hands every spare pixel to the one column that has none, so a flexible name
// column opened a 600px hole between the person and their first fact. The
// column without a width is the longest free-text field in the table, never
// the name — see TABLE_NAME_WIDTH.
//
// Dumb: a name, a link target, and a line under it.

import type { ReactNode } from "react";
import { Flex, Typography } from "antd";
import { Link } from "@tanstack/react-router";
import { styles } from "./NameCell.styles";

export type NameCellProps = {
  name: string;
  /** Where the row goes. The whole row usually goes there too; this is what
   *  makes it reachable by keyboard and openable in a new tab. */
  to: string;
  /** The reference under the name — an application id, a loan id. */
  meta?: ReactNode;
};

export function NameCell({ name, to, meta }: NameCellProps) {
  return (
    <Flex vertical style={styles.root}>
      <Typography.Text ellipsis={{ tooltip: name }}>
        <Link to={to}>{name}</Link>
      </Typography.Text>
      {meta ? (
        <Typography.Text type="secondary" ellipsis style={styles.meta}>
          {meta}
        </Typography.Text>
      ) : null}
    </Flex>
  );
}

export default NameCell;
