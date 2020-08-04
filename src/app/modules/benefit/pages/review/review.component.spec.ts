import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MspLogService } from '../../../../services/log.service';
import { ProcessService } from '../../../../services/process.service';
import { MspBenefitDataService } from '../../services/msp-benefit-data.service';
import { BenefitReviewComponent } from './review.component';

describe('BenefitReviewComponent', () => {
  let component: BenefitReviewComponent;
  let fixture: ComponentFixture<BenefitReviewComponent>;
  beforeEach(() => {
    const changeDetectorRefStub = () => ({});
    const routerStub = () => ({ navigate: array => ({}) });
    const mspLogServiceStub = () => ({});
    const processServiceStub = () => ({
      setStep: (processStepNum, arg) => ({})
    });
    const mspBenefitDataServiceStub = () => ({ benefitApp: {} });

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [BenefitReviewComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: Router, useFactory: routerStub },
        { provide: MspLogService, useFactory: mspLogServiceStub },
        { provide: ProcessService, useFactory: processServiceStub },
        {
          provide: MspBenefitDataService,
          useFactory: mspBenefitDataServiceStub
        }
      ]
    });
    fixture = TestBed.createComponent(BenefitReviewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have default ProcessStepNum value`, () => {
    expect(BenefitReviewComponent.ProcessStepNum).toEqual(4);
  });

  describe('continue', () => {
    it('makes expected calls', () => {
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      const processServiceStub: ProcessService = fixture.debugElement.injector.get(
        ProcessService
      );
      spyOn(routerStub, 'navigate').and.callThrough();
      spyOn(processServiceStub, 'setStep').and.callThrough();
      component.continue();
      expect(routerStub.navigate).toHaveBeenCalled();
      expect(processServiceStub.setStep).toHaveBeenCalled();
    });
  });
});
