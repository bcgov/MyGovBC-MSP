export abstract class AssistMapping {
  // home index
  static zero = [
    'financials',
    'adjustedNetIncome',
    'assistanceYear',
    'childDeduction',
    'deductions',
    'netIncome',
    'numberOfTaxYears',
    'sixtyFiveDeduction',
    'taxYear',
    'totalDeductions',
    'totalNetIncome',
    'uuid'
  ];

  // personal info index
  static one = [
    'attachmentUuids',
    'attachments',
    'applicant',
    'name',
    'birthDate',
    'firstName',
    'lastName',
    'secondName',
    'phn',
    'sin'
  ];

  // spouse index
  static two = [];

  // contact index
  static three = [
    'mailingAddress',
    'addressLine1',
    'addressLine2',
    'addressLine3',
    'city',
    'country',
    'postalCode',
    'provinceOrState',
    'telephone'
  ];

  static get items() {
    return [this.zero, this.one, this.two, this.three];
  }
}
