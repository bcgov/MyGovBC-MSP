module.exports = {
  sectionTitle: [
    '', //0 indice is for the Applicant, but it doesn't make sense to have an applicant field here as it's about modifying dependents on on the plan.
    'Remove Spouse',
    'Remove Child (0-18)',
    'Remove Child (19-24)'
  ],
  sectionBody: [
    '',
    'A spouse is a resident of B.C. who is married to or is living and cohabiting in a marriage-like relationship with the applicant.'
  ],
  clearButton: [
    '',
    'Clear Spouse',
    'Clear Child',
    'Clear Child'
  ],
  cancellationDate: "Cancellation Date",
  reason: "Reason for Cancellation",
  reasonDetailed: "Please enter Reason for Cancellation",
  reasonDetailedRequired: "Reason for cancellation is required.",

  cancellationReasons: [
    // "Please select",
    "No longer in full time studies",
    "Deceased",
    "Out of Province / Out of Country",
    "Incarcerated",
    "Armed Forces",
    "Other",
  ],
  pleaseSelect: "Please select",

  // isExistingBeneficiaryQuestion: [
  //   '',
  //   'Is the spouse an existing MSP Beneficiary?',
  //   'Is the child an existing MSP Beneficiary?',
  //   'Is the child an existing MSP Beneficiary?',
  // ],

  //Spouse only? Maybe remove the array format?
  // previousName: 'Spouse\'s Previous Last Name (if applicable)',
  // previousNameErrorPattern: 'Must begin with a letter followed by a letters, hyphen, period, apostrophe, or blank character',
  // marriageDate: 'Marriage Date (if applicable)',
}
