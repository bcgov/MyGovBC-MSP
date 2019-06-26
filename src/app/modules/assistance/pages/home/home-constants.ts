export interface IRateBracket {
  netIncome: string;
  onePerson: number;
  twoFamily: number;
  threeFamily?: number;
}

export class PremiumRatesYear {
  brackets: IRateBracket[][] = [];

  netIncomeOptionsStd = [
    '$0 - $22,000',
    '$22,001 - $24,000',
    '$24,001 - $26,000',
    '$26,0001 - $28,000',
    '$28,0001 - $30,000',
    'Over $30,000'
  ];

  netIncomeOptions2018 = [
    '$0 - $26,000',
    '$26,001 - $28,000',
    '$28,001 - $30,000',
    '$30,001 - $34,000',
    '$34,001 - $38,000',
    '$38,001 - $42,000',
    'Over $42,000'
  ];

  netIncomeOptions2017 = [
    '$0 - $24,000',
    '$24,001 - $26,000',
    '$26,001 - $28,000',
    '$28,001 - $30,000',
    '$30,001 - $34,000',
    '$34,001 - $38,000',
    '$38,001 - $42,000',
    'Over $42,000'
  ];

  baseRates2018 = [0, 11.5, 17.5, 23, 28, 32.5, 37.5];
  baseRates2017 = [0, 11, 23, 35, 46, 56, 65, 75];

  options = {
    2018: this.netIncomeOptions2018,
    2017: this.netIncomeOptions2017,
    2016: this.netIncomeOptionsStd,
    2015: this.netIncomeOptionsStd,
    2014: this.netIncomeOptionsStd,
    2013: this.netIncomeOptionsStd
  };

  constructor() {
    for (let opt in this.options) {
      console.log(opt);
      const num = parseInt(opt);
      if (num === 2018) {
        this.brackets.push(
          this.genBracketsToo(this.netIncomeOptions2018, this.baseRates2018)
        );
        continue;
      }
      if (num === 2017) {
        this.brackets.push(
          this.genBracketsToo(this.netIncomeOptions2017, this.baseRates2017)
        );
        continue;
      } else {
        const brackets = [];
        for (let opt of this.netIncomeOptionsStd) {
          const i = this.netIncomeOptionsStd.indexOf(opt);
          brackets.push(this.genBrackets(this.netIncomeOptionsStd, i));
        }
        this.brackets.push(brackets);
      }
    }
    console.log(this.brackets);
  }

  genBracketsToo(incomeOpts: string[], baseRatesOpts: number[]) {
    const brackets = [];
    for (let income of incomeOpts) {
      const i = incomeOpts.indexOf(income);
      console.log(i);

      const baseRate = baseRatesOpts[i];
      brackets.push({
        netIncome: income,
        onePerson: baseRate * 1,
        twoFamily: baseRate * 2
      });
    }

    return brackets;
  }

  genBrackets(netIncome, index): IRateBracket {
    const base1 = 12.8;
    const base2 = 23.2;
    const base3 = 25.6;
    return {
      netIncome,
      onePerson: base1 * index,
      twoFamily: base2 * index,
      threeFamily: base3 * index
    };
  }
}
