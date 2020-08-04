import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MspBenefitDataService } from '../../services/msp-benefit-data.service';
import { ActivatedRoute } from '@angular/router';
import { BenefitConfirmationComponent } from './confirmation.component';

describe('BenefitConfirmationComponent', () => {
  let component: BenefitConfirmationComponent;
  let fixture: ComponentFixture<BenefitConfirmationComponent>;
  beforeEach(() => {
    const mspBenefitDataServiceStub = () => ({});
    const activatedRouteStub = () => ({
      queryParams: { subscribe: f => f({}) }
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
