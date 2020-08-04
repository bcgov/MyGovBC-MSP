import { TestBed } from '@angular/core/testing';
import { ProcessService } from '../../services/process.service';
import { BenefitModule } from './benefit.module';
import { BenefitApplication } from './models/benefit-application.model';
import { BenefitApplicationDto } from './models/benefit-application.dto';

describe('BenefitModule', () => {
  let benefitModule: BenefitModule;
  beforeEach(() => {
    const processServiceStub = () => ({ init: array => ({}) });
    TestBed.configureTestingModule({
      providers: [
        BenefitModule,
        { provide: ProcessService, useFactory: processServiceStub }
      ]
    });
    benefitModule = TestBed.get(BenefitModule);
  });

  it('should create', () => {
    expect(benefitModule).toBeTruthy();
  });
});
