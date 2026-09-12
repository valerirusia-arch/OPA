// src/features/Payments/ui/money.ts
//
// Amounts travel through this epic as formatted strings — "$126.67" — because
// that is what every screen displays and what the mock data holds. One place
// needs them as numbers: the "another amount" field, which has to be typed
// into and compared against the payoff figure.
//
// FORMATTING ONLY. There is no arithmetic here beyond reading a figure out of
// a string and putting it back. What an installment costs, what a late fee
// comes to and what closes the loan are all decided elsewhere — the WBS puts
// those rules in the system, not in the interface.

/** "$1,234.56" -> 1234.56. Anything unparseable comes back as 0. */
export const toAmount = (formatted: string): number => {
  const digits = formatted.replace(/[^\d.]/g, "");
  const value = Number(digits);
  return Number.isFinite(value) ? value : 0;
};

/** 1234.5 -> "$1,234.50". US dollars, because only US cards are supported. */
export const formatAmount = (value: number): string =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
