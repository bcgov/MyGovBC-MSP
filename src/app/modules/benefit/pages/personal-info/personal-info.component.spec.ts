import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ProcessService } from '../../../../services/process.service';
import { MspBenefitDataService } from '../../services/msp-benefit-data.service';
import { BenefitPersonalInfoComponent } from './personal-info.component';
import { FormsModule } from '@angular/forms';

describe('BenefitPersonalInfoComponent', () => {
  let component: BenefitPersonalInfoComponent;
  let fixture: ComponentFixture<BenefitPersonalInfoComponent>;
  beforeEach(() => {
    const changeDetectorRefStub = () => ({});
    const routerStub = () => ({ navigate: array => ({}) });
    const processServiceStub = () => ({
      setStep: (processStepNum, arg) => ({})
    });
    const mspBenefitDataServiceStub = () => ({
      benefitApp: { isUniquePhns: {}, isUniqueSin: {}, mailingAddress: {} },
      saveBenefitApplication: () => ({})
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [BenefitPersonalInfoComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: Router, useFactory: routerStub },
        { provide: ProcessService, useFactory: processServiceStub },
        {
          provide: MspBenefitDataService,
          useFactory: mspBenefitDataServiceStub
        }
      ],
      imports: [FormsModule]
    });
    fixture = TestBed.createComponent(BenefitPersonalInfoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have default ProcessStepNum value`, () => {
    expect(BenefitPersonalInfoComponent.ProcessStepNum).toEqual(1);
  });

  describe('onChange', () => {
    it('makes expected calls', () => {
      const mspBenefitDataServiceStub: MspBenefitDataService = fixture.debugElement.injector.get(
        MspBenefitDataService
      );
      spyOn(
        mspBenefitDataServiceStub,
        'saveBenefitApplication'
      ).and.callThrough();
      component.onChange();
      expect(
        mspBenefitDataServiceStub.saveBenefitApplication
      ).toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {
    it('makes expected calls', () => {
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      const processServiceStub: ProcessService = fixture.debugElement.injector.get(
        ProcessService
      );
      spyOn(routerStub, 'navigate').and.callThrough();
      spyOn(processServiceStub, 'setStep').and.callThrough();
      component.onSubmit();
      expect(routerStub.navigate).toHaveBeenCalled();
      expect(processServiceStub.setStep).toHaveBeenCalled();
    });
  });
});
