import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BenefitEligibilityCardComponent } from './eligibility-card.component';

describe('EligibilityCardComponent', () => {
  let component: BenefitEligibilityCardComponent;
  let fixture: ComponentFixture<BenefitEligibilityCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BenefitEligibilityCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BenefitEligibilityCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
