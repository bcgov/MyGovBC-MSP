const ensureFields = [
  'firstName',
  'secondName',
  'lastName',
  'addressLine1',
  'city',
  'postalCode',
  'provinceOrState',
  'country',
  'taxYear',
  'assistanceYear',
  'numberOfTaxYears',
  'netIncome',
  'totalNetIncome',
  'sixtyFiveDeduction',
  'childDeduction',
  'deductions',
  'totalDeductions',
  'adjustedNetIncome',
  'phn',
  'SIN',
  'powerOfAttorney'
];

const spouseFields = [
  'firstName',
  'secondName',
  'lastName',
  'birthDate',
  'phn',
  'SIN',
  'spouseDeduction',
  'spouseNetIncome',
  'spouseSixtyFiveDeduction'
];

const childrenFields = ['childDeduction', 'childCareExpense', 'uccb'];

export abstract class ValidateAssistance {
  static exportAssistance(xml: string, fields: string[]) {
    let valid = true;
    for (const field of fields) {
      let reg = new RegExp(`(${field})`);
      if (!xml.match(reg)) {
        console.log(field);
        return (valid = false);
      }
    }
    console.log('valid', valid);
    return valid;
  }

  static validate(xml: string) {
    const childReg = new RegExp('(numChildren)');
    if (xml.match(childReg)) {
      if (!this.exportAssistance(xml, childrenFields)) {
        console.log('invalid children');
        return false;
      }
    }
    const spouseReg = new RegExp(`(spouse)`);

    return xml.match(spouseReg)
      ? this.exportAssistance(xml, spouseFields) &&
          this.exportAssistance(xml, ensureFields)
      : this.exportAssistance(xml, ensureFields);
  }
}

// check ensure fields

// what does the spouse object look like?

// if spouse exists check spouse fields
