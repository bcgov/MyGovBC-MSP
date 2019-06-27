import { SimpleDate } from 'moh-common-lib';

export const validateBirthdate = (date: SimpleDate) => {
  const validMonths = {
    29: [2],
    30: [4, 5, 9, 11],
    31: [1, 3, 6, 7, 8, 10, 12]
  };
  const month = date.month;

  const checkDate = (
    validMonths,
    month: number,
    fn: (num: number) => boolean
  ) => {
    for (let key in validMonths) {
      let arr = validMonths[key];
      const num = parseInt(key);
      if (arr.indexOf(month) > -1) return fn(num);
    }
  };

  let isValid = checkDate(validMonths, date.month, num => {
    return date.day <= num;
  });

  console.log('is valid?', isValid);
  return isValid;
};
