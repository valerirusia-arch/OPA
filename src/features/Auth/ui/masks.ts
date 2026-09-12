// src/features/Auth/ui/masks.ts
//
// Input masks the WBS calls for: "Phone number field - US number with a mask"
// and the 123-45-6789 SSN format. Pure string formatting — presentation only.

/** 5550101010 -> (555) 010-1010 */
export const formatUsPhone = (raw: string) => {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

/** 123456789 -> 123-45-6789 */
export const formatSsn = (raw: string) => {
  const digits = raw.replace(/\D/g, "").slice(0, 9);
  if (digits.length <= 3) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
};

/** Strips everything that is not a digit. `max` caps the length when given. */
export const digitsOnly = (raw: string, max?: number) =>
  max === undefined ? raw.replace(/\D/g, "") : raw.replace(/\D/g, "").slice(0, max);
