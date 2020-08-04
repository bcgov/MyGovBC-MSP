import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { MspBenefitDataService } from '../../services/msp-benefit-data.service';
import { AssistanceYear } from '../../../assistance/models/assistance-year.model';
import { CommonImage } from 'moh-common-lib';
import { Router } from '@angular/router';
import { ProcessService } from 'app/services/process.service';
import { ISpaEnvResponse } from 'moh-common-lib/lib/components/consent-modal/consent-modal.component';
import { FormsModule } from '@angular/forms';
import { BenefitPrepareComponent } from './prepare.component';

describe('BenefitPrepareComponent', () => {
  let component: BenefitPrepareComponent;
  let fixture: ComponentFixture<BenefitPrepareComponent>;
  beforeEach(() => {
    const changeDetectorRefStub = () => ({});
    const mspBenefitDataServiceStub = () => ({
      saveBenefitApplication: () => ({}),
      benefitApp: {
        attendantCareExpenseReceipts: [],
        applicantEligibleForDisabilityCredit: {},
        applicantClaimForAttendantCareExpense: {}
      }
    });
    const routerStub = () => ({ navigate: array => ({}) });
    const processServiceStub = () => ({
      setStep: (processStepNum, arg) => ({})
    });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [BenefitPrepareComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        {
          provide: MspBenefitDataService,
          useFactory: mspBenefitDataServiceStub
        },
        { provide: Router, useFactory: routerStub },
        { provide: ProcessService, useFactory: processServiceStub }
      ]
    });
    fixture = TestBed.createComponent(BenefitPrepareComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`_showDisabilityInfo has default value`, () => {
    expect(component._showDisabilityInfo).toEqual(false);
  });

  it(`chldCountExceededError has default value`, () => {
    expect(component.chldCountExceededError).toEqual(false);
  });

  it(`isDisabled has default value`, () => {
    expect(component.isDisabled).toEqual(false);
  });

  it(`qualifiedForAssistance has default value`, () => {
    expect(component.qualifiedForAssistance).toEqual(false);
  });

  it(`requireAttendantCareReceipts has default value`, () => {
    expect(component.requireAttendantCareReceipts).toEqual(false);
  });

  it(`taxYearInfoMissing has default value`, () => {
    expect(component.taxYearInfoMissing).toEqual(false);
  });

  it(`qualificationThreshhold has default value`, () => {
    expect(component.qualificationThreshhold).toEqual(42000);
  });

  it(`pastYears has default value`, () => {
    expect(component.pastYears).toEqual([]);
  });

  describe('deleteReceipts', () => {
    it('makes expected calls', () => {
      const mspBenefitDataServiceStub: MspBenefitDataService = fixture.debugElement.injector.get(
        MspBenefitDataService
      );
      const commonImageStub: CommonImage = <any>{};
      spyOn(
        mspBenefitDataServiceStub,
        'saveBenefitApplication'
      ).and.callThrough();
      component.deleteReceipts(commonImageStub);
      expect(
        mspBenefitDataServiceStub.saveBenefitApplication
      ).toHaveBeenCalled();
    });
  });

  describe('navigateToPersonalInfo', () => {
    it('makes expected calls', () => {
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      const processServiceStub: ProcessService = fixture.debugElement.injector.get(
        ProcessService
      );
      spyOn(routerStub, 'navigate').and.callThrough();
      spyOn(processServiceStub, 'setStep').and.callThrough();
      component.navigateToPersonalInfo();
      expect(routerStub.navigate).toHaveBeenCalled();
      expect(processServiceStub.setStep).toHaveBeenCalled();
    });
  });
});
