/**
 * Various statuses in Canada
 */
export enum StatusInCanada {
  CitizenAdult, // adult
  PermanentResident,
  TemporaryResident
}

/**
 * Dropdown selections associated with StatusInCanada enums
 */
export const CanadianStatusStrings = {
  CitizenAdult: 'Canadian citizen',
  PermanentResident: 'Permanent resident',
  TemporaryResident: 'Temporary permit holder or diplomat'
};

/**
 * Reasons for returning to Canada
 */
export enum CanadianStatusReason {
  LivingInBCWithoutMSP,
  MovingFromProvince,
  MovingFromCountry,
  WorkingInBC,
  StudyingInBC,
  ReligiousWorker,
  Diplomat,
  Visiting
}

/**
 * Dropdown selections associated with reasons for return to Canada enums
 */
export const CanadianStatusReasonStrings = {
  LivingInBCWithoutMSP: 'Not new to B.C. but need to apply for Medical Services Plan',
  MovingFromProvince: 'Moved to B.C. from another province',
  MovingFromCountry: 'Moved to B.C. from another country',
  WorkingInBC: 'Working in B.C.',
  StudyingInBC: 'Studying in B.C.',
  ReligiousWorker: 'Religious worker',
  Diplomat: 'Diplomat',
  Visiting: 'Visiting'
};
