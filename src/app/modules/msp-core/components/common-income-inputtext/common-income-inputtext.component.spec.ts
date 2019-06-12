import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonIncomeInputtextComponent } from './common-income-inputtext.component';

describe('CommonIncomeInputtextComponent', () => {
  let component: CommonIncomeInputtextComponent;
  let fixture: ComponentFixture<CommonIncomeInputtextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonIncomeInputtextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonIncomeInputtextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
