import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BenefitPrepareComponent } from './prepare.component';

describe('PrepareComponent', () => {
  let component: BenefitPrepareComponent;
  let fixture: ComponentFixture<BenefitPrepareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BenefitPrepareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BenefitPrepareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
