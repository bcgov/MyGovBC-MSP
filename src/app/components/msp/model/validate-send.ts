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

const disabilityFields = [
  'numDisabled',
  'disabilityDeduction',
  'disabilitySavingsPlan'
];

const fields = [spouseFields, childrenFields, disabilityFields];
const spouseReg = new RegExp(`(spouse)`);
const childReg = new RegExp('(numChildren)');
const disabilityReg = new RegExp('(disablityReg)');

const regexes = [spouseReg, childReg, disabilityReg];

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

  // TODO: replace these with a json validation instead of XML at the appropriate time. Change teh match fields to be an object.keys validation
  static validate(xml: string) {
    for (const reg of regexes) {
      if (xml.match(reg)) {
        const index = regexes.indexOf(reg);
        if (!this.exportAssistance(xml, fields[index])) {
          console.log('invalid', reg);
          return false;
        }
      }
    }
    return this.exportAssistance(xml, ensureFields);
  }
}
