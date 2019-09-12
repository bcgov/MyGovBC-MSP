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
