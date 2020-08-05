import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MspBenefitDataService } from '../../services/msp-benefit-data.service';
import { ActivatedRoute } from '@angular/router';
import { BenefitConfirmationComponent } from './confirmation.component';
import { Subscription } from 'rxjs';

describe('BenefitConfirmationComponent', () => {
  let component: BenefitConfirmationComponent;
  let fixture: ComponentFixture<BenefitConfirmationComponent>;
  beforeEach(() => {
    const unsubscribeStub = () => { };
    const mspBenefitDataServiceStub = () => ({ benefitApp: {}});
    const activatedRouteStub = () => ({
      queryParams: { subscribe: f => new Subscription(unsubscribeStub) }
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [BenefitConfirmationComponent],
      providers: [
        {
          provide: MspBenefitDataService,
          useFactory: mspBenefitDataServiceStub
        },
        { provide: ActivatedRoute, useFactory: activatedRouteStub }
      ]
    });
    fixture = TestBed.createComponent(BenefitConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
