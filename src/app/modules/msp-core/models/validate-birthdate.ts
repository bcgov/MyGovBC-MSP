import { SimpleDate } from 'moh-common-lib';

const validMonths = {
  29: [2],
  30: [4, 5, 9, 11],
  31: [1, 3, 6, 7, 8, 10, 12]
};

const date = new Date();

export const validateBirthdate = (date: SimpleDate): boolean => {
  return checkYear(date.year)
    ? checkDate(validMonths, date.month, num => {
        return date.day <= num;
      })
    : checkFutureDate(date.month, date.day);
};

const checkDate = (
  validMonths: { 29: number[]; 30: number[]; 31: number[] },
  month: number,
  fn: (num: number) => boolean
) => {
  for (let key in validMonths) {
    if (validMonths[key].indexOf(month) > -1) return fn(parseInt(key));
  }
};

const checkFutureDate = (month: number, day: number) => {
  return checkDate(validMonths, month, num => {
    if (day > num) return false;
    return checkMonth(month) ? true : checkDay(day);
  });
};

const checkYear = (year: number): boolean => {
  return year < date.getFullYear();
};

const checkMonth = (month: number): boolean => {
  return month < date.getMonth() - 1;
};

const checkDay = (day: number): boolean => {
  return day < date.getDate();
};
