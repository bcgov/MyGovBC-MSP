import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { CompletenessCheckService } from '../../../../services/completeness-check.service';
import { ProcessService } from '../../../../services/process.service';
import { MspBenefitDataService } from '../../services/msp-benefit-data.service';
import { CommonImage } from 'moh-common-lib';
import { BenefitAuthorizeSubmitComponent } from './authorize-submit.component';
import { FormsModule } from '@angular/forms';
import { BenefitApplication } from '../../models/benefit-application.model';

describe('BenefitAuthorizeSubmitComponent', () => {
  let component: BenefitAuthorizeSubmitComponent;
  let fixture: ComponentFixture<BenefitAuthorizeSubmitComponent>;

  beforeEach(async(() => {
    const routerStub = () => ({ navigate: array => ({}) });
    const completenessCheckServiceStub = () => ({});
    const processServiceStub = () => ({
      setStep: (processStepNum, arg) => ({})
    });
    const mspBenefitDataServiceStub = () => ({
      benefitApp: new BenefitApplication,
      saveBenefitApplication: () => ({})
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [BenefitAuthorizeSubmitComponent],
      providers: [
        { provide: Router, useFactory: routerStub },
        {
          provide: CompletenessCheckService,
          useFactory: completenessCheckServiceStub
        },
        { provide: ProcessService, useFactory: processServiceStub },
        {
          provide: MspBenefitDataService,
          useFactory: mspBenefitDataServiceStub
        }
      ],
      imports: [FormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BenefitAuthorizeSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`ProcessStepNum has default value`, () => {
    expect(BenefitAuthorizeSubmitComponent.ProcessStepNum).toEqual(5);
  });

  describe('addDocument', () => {
    it('makes expected calls', () => {
      const mspBenefitDataServiceStub: MspBenefitDataService = fixture.debugElement.injector.get(
        MspBenefitDataService
      );
      const commonImageStub: CommonImage = <any>{};
      spyOn(
        mspBenefitDataServiceStub,
        'saveBenefitApplication'
      ).and.callThrough();
      component.addDocument(commonImageStub);
      expect(
        mspBenefitDataServiceStub.saveBenefitApplication
      ).toHaveBeenCalled();
    });
  });

  describe('deleteDocument', () => {
    it('makes expected calls', () => {
      const mspBenefitDataServiceStub: MspBenefitDataService = fixture.debugElement.injector.get(
        MspBenefitDataService
      );
      const commonImageStub: CommonImage = <any>{};
      spyOn(
        mspBenefitDataServiceStub,
        'saveBenefitApplication'
      ).and.callThrough();
      component.deleteDocument(commonImageStub);
      expect(
        mspBenefitDataServiceStub.saveBenefitApplication
      ).toHaveBeenCalled();
    });
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
