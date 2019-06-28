import { MspPerson } from 'app/modules/account/models/account.model';
import { Address } from 'moh-common-lib';

export const validateContact = (address: Address) => {
  const requiredFields = [
    'country',
    'province',
    'city',
    'addressLine1',
    'postal'
  ];
  const optionalFields = ['addressLine2', 'addressLine3'];
  for (let field of optionalFields) {
    if (address[field] !== undefined) requiredFields.push(field);
  }
  for (let field of requiredFields) {
    if (!address[field] || address[field].length < 1) {
      return false;
    }
  }
  return true;
};
