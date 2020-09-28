import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { MspBenefitDataService } from '../../services/msp-benefit-data.service';
import { Router } from '@angular/router';
import { ProcessService } from 'app/services/process.service';
import { FormsModule } from '@angular/forms';
import { BenefitPrepareComponent } from './prepare.component';
import { MspImageErrorModalComponent } from '../../../msp-core/components/image-error-modal/image-error-modal.component';
import { ConsentModalComponent } from 'moh-common-lib';
import { ModalModule } from 'ngx-bootstrap/modal';

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
        applicantClaimForAttendantCareExpense: {},
        eligibility: {}
      }
    });
    const routerStub = () => ({ navigate: array => ({}) });
    const processServiceStub = () => ({
      setStep: (processStepNum, arg) => ({})
    });
    TestBed.configureTestingModule({
      imports: [FormsModule, ModalModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [BenefitPrepareComponent, ConsentModalComponent, MspImageErrorModalComponent],
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
});
