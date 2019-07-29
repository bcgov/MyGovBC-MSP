import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxYearComponent } from './tax-year.component';

describe('TaxYearComponent', () => {
  let component: TaxYearComponent;
  let fixture: ComponentFixture<TaxYearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxYearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
