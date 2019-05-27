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

export abstract class ValidateAssistance {
  static exportAssistance(xml: string) {
    let valid = true;
    for (const field of ensureFields) {
      let reg = new RegExp(`(${field})`);
      if (!xml.match(reg)) {
        console.log(field);
        return (valid = false);
      }
    }
    console.log('valid', valid);
    return valid;
  }
  static exportSpouseAssistance(xml: string) {
    let valid = true;
    for (const field of spouseFields) {
      const reg = new RegExp(`(${spouseFields})`);
      if (!xml.match(reg)) return (valid = false);
    }
    return valid;
  }

  static validate(xml: string) {
    const spouseReg = new RegExp(`(spouse)`);
    let valid;
    return xml.match(spouseReg)
      ? this.exportSpouseAssistance(xml) && this.exportAssistance(xml)
      : this.exportAssistance(xml);
  }
}

// check ensure fields

// what does the spouse object look like?

// if spouse exists check spouse fields
