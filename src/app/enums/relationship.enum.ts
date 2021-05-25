/**
 * Various relationships
 */
export enum Relationship {
  Applicant,
  Spouse,
  Child,
  ChildUnder19,
  Child19To24,
  ChildUnder24,
  AllAgeApplicant,
  Unknown = undefined // Used to determine whether Status in Canada options should be displayed
}
