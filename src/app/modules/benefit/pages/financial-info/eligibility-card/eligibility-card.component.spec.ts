import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BenefitEligibilityCardComponent } from './eligibility-card.component';

describe('BenefitEligibilityCardComponent', () => {
  let component: BenefitEligibilityCardComponent;
  let fixture: ComponentFixture<BenefitEligibilityCardComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [BenefitEligibilityCardComponent]
    });
    fixture = TestBed.createComponent(BenefitEligibilityCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
