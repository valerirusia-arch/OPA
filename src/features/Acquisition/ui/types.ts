// src/features/Acquisition/ui/types.ts
//
// The presentation contract for the Acquisition management screens (Epic 10).
// Attributes are taken from the WBS's own comments — kept deliberately simple,
// as the epic asks ("simple available attributes").

/** Lifecycle, shared by every acquisition object. WBS: "active/inactive". */
export type AcquisitionStatus = "active" | "inactive";

/**
 * An acquisition source. WBS comment: "the acquisition source list, simple
 * available attributes (name, partner, code, status), lifecycle
 * (active/inactive)".
 */
export type AcquisitionSource = {
  id: string;
  name: string;
  /** The referral partner this source is associated with. */
  partner: string;
  /** The tracking code used to attribute a loan to this source. */
  code: string;
  status: AcquisitionStatus;
};

/**
 * A partner group. WBS comment: "the CRUD partner groups, simple list of
 * supported attributes is expected (up to 5 attributes)". Kept to three:
 * name, code, status.
 */
export type PartnerGroup = {
  id: string;
  name: string;
  code: string;
  status: AcquisitionStatus;
};

/**
 * A referral partner. WBS: "referral partners and partner groups used for loan
 * acquisition management" — a partner belongs to a group.
 */
export type ReferralPartner = {
  id: string;
  name: string;
  /** The partner group this partner belongs to. */
  group: string;
  status: AcquisitionStatus;
};

/**
 * A marketing campaign. WBS comment: "campaign attributes (up to 10 simple
 * attributes), statuses (active/inactive), validity periods". Kept simple:
 * name, the source it drives, a validity period, and status.
 */
export type Campaign = {
  id: string;
  name: string;
  /** The acquisition source/channel the campaign runs on. */
  source: string;
  /** Validity period, `[from, to]` as ISO dates. WBS: "validity periods". */
  period: [string, string];
  status: AcquisitionStatus;
};
