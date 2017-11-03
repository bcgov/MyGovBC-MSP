module.exports = {
  sectionTitle: [
    '', //0 indice is for the Applicant, but it doesn't make sense to have an applicant field here as it's about modifying dependents on on the plan.
    'Add Spouse',
    'Add Child (0-18)',
    'Add Child (19-24)'
  ],
  sectionBody: [
    '',
    'A spouse is a resident of B.C. who is married to or is living and cohabiting in a marriage-like relationship with the applicant.','',''
  ],
  clearButton: [
    '',
    'Clear Spouse',
    'Clear Child',
    'Clear Child'
  ],
  isExistingBeneficiaryQuestion: [
    '',
    'Is the spouse an existing MSP Beneficiary (has MSP coverage)?',
    'Is the child an existing MSP Beneficiary (has MSP coverage)?',
    'Is the child an existing MSP Beneficiary (has MSP coverage)?',
  ],

  //Spouse only? Maybe remove the array format?
  previousName: 'Spouse\'s Previous Last Name (if applicable)',
  previousNameErrorPattern: 'Must begin with a letter followed by a letters, hyphen, period, apostrophe, or blank character',
  marriageDate: 'Marriage Date (if applicable)',
  schoolAddressLabel: "School Address",
  studiesBegin: "Date studies will begin",
  studiesFinish: "Date studies will finish",
  schoolOutsideBC: "Is this school located outside of BC?",
  schoolName: "School Name",
  departureDate: "Departure Date",
  schoolNameRequired: "School name is required",
}
