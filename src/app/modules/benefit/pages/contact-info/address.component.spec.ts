import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { MspBenefitDataService } from '../../services/msp-benefit-data.service';
import { ProcessService } from '../../../../services/process.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BenefitAddressComponent } from './address.component';

describe('BenefitAddressComponent', () => {
  let component: BenefitAddressComponent;
  let fixture: ComponentFixture<BenefitAddressComponent>;
  beforeEach(() => {
    const changeDetectorRefStub = () => ({});
    const mspBenefitDataServiceStub = () => ({
      benefitApp: { mailingAddress: { hasValue: {}, province: {} } },
      saveBenefitApplication: () => ({})
    });
    const processServiceStub = () => ({
      setStep: (processStepNum, arg) => ({})
    });
    const routerStub = () => ({ navigate: array => ({}) });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [BenefitAddressComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        {
          provide: MspBenefitDataService,
          useFactory: mspBenefitDataServiceStub
        },
        { provide: ProcessService, useFactory: processServiceStub },
        { provide: Router, useFactory: routerStub }
      ]
    });
    fixture = TestBed.createComponent(BenefitAddressComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`outsideBCFor30DaysLabel has default value`, () => {
    expect(component.outsideBCFor30DaysLabel).toEqual(
      `Have you or any family member been outside BC for more than 30 days in total during the past 12 months?`
    );
  });

  it(`addAnotherOutsideBCPersonButton has default value`, () => {
    expect(component.addAnotherOutsideBCPersonButton).toEqual(
      `Add Another Person`
    );
  });

  it(`sameMailingAddress has default value`, () => {
    expect(component.sameMailingAddress).toEqual(
      `Use this as my mailing address.`
    );
  });

  it(`provideDifferentMailingAddress has default value`, () => {
    expect(component.provideDifferentMailingAddress).toEqual(
      `I want to provide a mailing address that is different from the residential address above.`
    );
  });

  it(`ProcessStepNum has default value`, () => {
    expect(BenefitAddressComponent.ProcessStepNum).toEqual(3);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const processServiceStub: ProcessService = fixture.debugElement.injector.get(
        ProcessService
      );
      spyOn(processServiceStub, 'setStep').and.callThrough();
      component.ngOnInit();
      expect(processServiceStub.setStep).toHaveBeenCalled();
    });
  });

  describe('continue', () => {
    it('makes expected calls', () => {
      const processServiceStub: ProcessService = fixture.debugElement.injector.get(
        ProcessService
      );
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      spyOn(processServiceStub, 'setStep').and.callThrough();
      spyOn(routerStub, 'navigate').and.callThrough();
      component.continue();
      expect(processServiceStub.setStep).toHaveBeenCalled();
      expect(routerStub.navigate).toHaveBeenCalled();
    });
  });
});
