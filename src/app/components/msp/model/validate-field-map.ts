export abstract class AssistanceFieldMap {
  prepare = [
    'taxYear',
    'assistanceYear',
    'numberOfTaxYears',
    'netIncome',
    'spouseNetIncome',
    'totalNetIncome',
    'sixtyFiveDeduction',
    'numChildren',
    'childDeduction',
    'childCareExpense',
    'deductions',
    'uccb',
    'totalDeductions',
    'adjustedNetIncome'
  ];

  retro = [
    'firstName',
    'secondName',
    'lastName',
    'birthDate',
    'addressLine1',
    'city',
    'postalCode',
    'provinceOrState',
    'mailingAddress',
    'phn',
    'SIN'
  ];

  review = [];

  authorizeSubmit = ['powerOfAttorney'];

  sending = [];

  // urls located somewhere
}
