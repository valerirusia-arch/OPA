// src/features/Acquisition/ui/entityDates.ts
//
// Turn a stored `[from, to]` ISO string pair into the Dayjs pair antd's
// RangePicker wants, and back. Kept out of the modal so that file exports only
// a component (Fast Refresh).

import dayjs, { type Dayjs } from "dayjs";

export const toDayjsRange = (range?: [string, string]): [Dayjs, Dayjs] | undefined =>
  range ? [dayjs(range[0]), dayjs(range[1])] : undefined;

export const fromDayjsRange = (range: unknown): [string, string] | undefined => {
  if (!Array.isArray(range) || range.length !== 2) return undefined;
  const [from, to] = range as [Dayjs, Dayjs];
  return [from.format("YYYY-MM-DD"), to.format("YYYY-MM-DD")];
};
