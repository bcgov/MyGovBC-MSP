import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonDeductionCalculatorComponent } from './common-deduction-calculator.component';

describe('CommonDeductionCalculatorComponent', () => {
  let component: CommonDeductionCalculatorComponent;
  let fixture: ComponentFixture<CommonDeductionCalculatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonDeductionCalculatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonDeductionCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
