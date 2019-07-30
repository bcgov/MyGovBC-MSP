export class FieldPageMap {

  financialInfo = [
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
    'totalDeductions'
  ];

  personalInfo = [
    'applicantFirstName',
    'applicantSecondName',
    'applicantLastName',
    'applicantBirthdate',
    'applicantPHN',
    'applicantSIN'
  ];

  spouseInfo = [
      'spouseFirstName',
      'spouseSecondName',
      'spouseLastName',
      'spouseBirthdate',
      'spousePHN',
      'spouseSIN'
    ];

  contactInfo = [
    'applicantAddressLine1',
    'applicantCity',
    'applicantCountry',
    'applicantPostalCode',
    'applicantProvinceOrState',
    'mailingAddress',
    'applicantTelephone'
  ];


  review = [];

  authorizeSubmit = [
    'authorizedByApplicant',
    'authorizedByApplicantDate',
    'authorizedBySpouse',
    'powerOfAttorney'
  ];

  sending = [];
  url: string[];
  fields: any[][];

  constructor() {
    this.fields = [
      this.financialInfo,
      this.personalInfo,
      this.spouseInfo,
      this.contactInfo,
      this.review,
      this.authorizeSubmit,
      this.sending
    ];
  }

  findStep(field: string) {
    for (const list of this.fields) {
      const val = list.indexOf(field);
      console.log(val);
      if (val >= 0) return this.fields.indexOf(list);
    }
  }
}