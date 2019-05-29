import { ProcessStep } from '../service/process.service';

export class AssistanceFieldMap {
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
    'adjustedNetIncome',
    'numDisabled',
    'disabilityDeduction',
    'disabilitySavingsPlan',
    'totalDeductions',
    'adjustedNetIncome',
    'taco'
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

  authorizeSubmit = [
    'powerOfAttorney',
    'authorizedByApplicant',
    'authorizedByApplicantDate',
    'authorizedBySpouse'
  ];

  sending = [];
  url: string[];
  fields: any[][];

  constructor() {
    this.fields = [
      this.prepare,
      this.retro,
      this.review,
      this.authorizeSubmit,
      this.sending
    ];
  }

  findStep(field: string) {
    for (const list of this.fields) {
      const val = list.indexOf(field);
      console.log(val);
      if (val >= 0) return val;
    }
  }

  // urls located somewhere
}
