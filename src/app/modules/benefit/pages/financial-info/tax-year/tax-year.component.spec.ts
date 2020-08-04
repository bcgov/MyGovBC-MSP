import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { MspBenefitDataService } from '../../../services/msp-benefit-data.service';
import { TaxYearComponent } from './tax-year.component';

describe('TaxYearComponent', () => {
  let component: TaxYearComponent;
  let fixture: ComponentFixture<TaxYearComponent>;
  beforeEach(() => {
    const changeDetectorRefStub = () => ({});
    const mspBenefitDataServiceStub = () => ({
      benefitApp: { cutoffYear: {}, isCutoffDate: {} }
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [TaxYearComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        {
          provide: MspBenefitDataService,
          useFactory: mspBenefitDataServiceStub
        }
      ]
    });
    fixture = TestBed.createComponent(TaxYearComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'cutOffDate').and.callThrough();
      spyOn(component, 'getTaxYears').and.callThrough();
      spyOn(component, 'assistanceYearsList').and.callThrough();
      component.ngOnInit();
      expect(component.cutOffDate).toHaveBeenCalled();
      expect(component.getTaxYears).toHaveBeenCalled();
      expect(component.assistanceYearsList).toHaveBeenCalled();
    });
  });

  describe('assistanceYearsList', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getTaxYears').and.callThrough();
      component.assistanceYearsList();
      expect(component.getTaxYears).toHaveBeenCalled();
    });
  });
});
