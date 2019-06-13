import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BenefitDeductionCalculatorComponent } from './benefit-deduction-calculator.component';

describe('BenefitDeductionCalculatorComponent', () => {
  let component: BenefitDeductionCalculatorComponent;
  let fixture: ComponentFixture<BenefitDeductionCalculatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BenefitDeductionCalculatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BenefitDeductionCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
