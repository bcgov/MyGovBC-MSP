import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { MspLogService } from '../../../../services/log.service';
import { MspBenefitDataService } from '../../services/msp-benefit-data.service';
import { MspApiBenefitService } from '../../services/msp-api-benefit.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BenefitSendingComponent } from './sending.component';
import { MspPersonCardComponent } from '../../../msp-core/components/person-card/person-card.component';

describe('BenefitSendingComponent', () => {
  let component: BenefitSendingComponent;
  let fixture: ComponentFixture<BenefitSendingComponent>;
  beforeEach(() => {
    const routerStub = () => ({ url: {}, navigate: (array, object) => ({}) });
    const mspLogServiceStub = () => ({ log: (object, arg) => ({}) });
    const mspBenefitDataServiceStub = () => ({
      benefitApp: { isCutoffDate: {}, cutoffYear: {}, taxYear: {} },
      removeMspBenefitApp: () => ({}),
      saveBenefitApplication: () => ({})
    });
    const mspApiBenefitServiceStub = () => ({
      sendRequest: application => ({ then: () => ({}) })
    });
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [BenefitSendingComponent, MspPersonCardComponent],
      providers: [
        { provide: Router, useFactory: routerStub },
        { provide: MspLogService, useFactory: mspLogServiceStub },
        {
          provide: MspBenefitDataService,
          useFactory: mspBenefitDataServiceStub
        },
        { provide: MspApiBenefitService, useFactory: mspApiBenefitServiceStub }
      ]
    });
    fixture = TestBed.createComponent(BenefitSendingComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
 
  describe('retrySubmission', () => {
    it('makes expected calls', () => {
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      spyOn(routerStub, 'navigate').and.callThrough();
      component.retrySubmission();
      expect(routerStub.navigate).toHaveBeenCalled();
    });
  });
});
