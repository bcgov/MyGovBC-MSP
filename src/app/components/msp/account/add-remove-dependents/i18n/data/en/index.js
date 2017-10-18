module.exports = {
  sectionTitle: [
    '', //0 indice is for the Applicant, but it doesn't make sense to have an applicant field here as it's about modifying dependents on on the plan.
    'Add Spouse',
    'Add Child (0-18)',
    'Add Child (19-24)'
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
  isExistingBeneficiaryQuestion: [
    '',
    'Is the spouse an existing MSP Beneficiary?',
    'Is the child an existing MSP Beneficiary?',
    'Is the child an existing MSP Beneficiary?',
  ],

  //Spouse only? Maybe remove the array format?
  previousName: 'Spouse\'s Previous Last Name (if applicable)',
  marriageDate: 'Marriage Date (if applicable)'
}
