import { BenefitModule } from './benefit.module';

describe('BenefitModule', () => {
  let benefitModule: BenefitModule;

  beforeEach(() => {
    benefitModule = new BenefitModule();
  });

  it('should create an instance', () => {
    expect(benefitModule).toBeTruthy();
  });
});
