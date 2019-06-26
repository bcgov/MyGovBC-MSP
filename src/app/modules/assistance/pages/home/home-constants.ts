export interface IRateBracket {
  netIncome: string;
  onePerson: number;
  twoFamily: number;
  threeFamily?: number;
}

export class PremiumRatesYear {
  brackets: IRateBracket[] = [];

  netIncomeOptions = [
    '$0 - $22,000',
    '$22,001 - $24,000',
    '$24,001 - $26,000',
    '$26,0001 - $28,000',
    '$28,0001 - $30,000',
    'Over $30,000'
  ];

  constructor() {
    const opts = this.netIncomeOptions;
    let index = 0;
    for (let opt of opts) {
      this.brackets.push(this.genBrackets(opt, index));
      index++;
    }
    console.log(this.brackets);
  }
  genBrackets(
    netIncome,
    index,
    base1 = 12.8,
    base2 = 23.2,
    base3?
  ): IRateBracket {
    return base3
      ? {
          netIncome,
          onePerson: base1 * index,
          twoFamily: base2 * index,
          threeFamily: base3 * index
        }
      : {
          netIncome,
          onePerson: base1 * index,
          twoFamily: base3 * index
        };
  }
}
