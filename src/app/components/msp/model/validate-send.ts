const primaryFields = [
  'firstName',
  // 'secondName',
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
  // 'secondName',
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
  static validateFields(xml: string, fields: string[]): boolean | string {
    let valid = true;
    for (const field of fields) {
      // change this to Object.hasOwnProperty(field) for a JSON validation
      //  regex statement can go away
      let reg = new RegExp(`(${field})`);
      if (!xml.match(reg)) {
        return field;
      }
    }
    return valid;
  }

  // TODO: replace these with a json validation instead of XML at the appropriate time. Change teh match fields to be an object.keys validation
  static validate(xml: string) {
    /*
      @Future developer - to change this to a function to validate the JSON object instead of an XML object
      instead of passing in an XML psas in an object of the appropriate type
    */
    for (const reg of regexes) {
      /*
        instead of a regex xml match do Object.hasOwnProperty(prop)
        if it has that value the same code below applies
      */
      if (xml.match(reg)) {
        const index = regexes.indexOf(reg);
        const valid = this.validateFields(xml, fields[index]);
        if (typeof valid === 'string') {
          return valid;
        }
      }
    }
    const valid = this.validateFields(xml, primaryFields);
    return valid;
  }
}
