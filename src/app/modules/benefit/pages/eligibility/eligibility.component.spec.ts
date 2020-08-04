import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { MspBenefitDataService } from '../../services/msp-benefit-data.service';
import { Router } from '@angular/router';
import { EligibilityComponent } from './eligibility.component';

describe('EligibilityComponent', () => {
  let component: EligibilityComponent;
  let fixture: ComponentFixture<EligibilityComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({});
    const mspBenefitDataServiceStub = () => ({
      benefitApp: { infoCollectionAgreement: {}, isEligible: {} }
    });
    const routerStub = () => ({ navigate: array => ({}) });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [EligibilityComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        {
          provide: MspBenefitDataService,
          useFactory: mspBenefitDataServiceStub
        },
        { provide: Router, useFactory: routerStub }
      ]
    });
    fixture = TestBed.createComponent(EligibilityComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('navigate', () => {
    it('makes expected calls', () => {
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      spyOn(routerStub, 'navigate').and.callThrough();
      component.navigate();
      expect(routerStub.navigate).toHaveBeenCalled();
    });
  });
});
