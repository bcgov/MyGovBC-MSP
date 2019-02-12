import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BenefitPersonalDetailComponent } from './personal-detail.component';

describe('PersonalDetailComponent', () => {
  let component: BenefitPersonalDetailComponent;
  let fixture: ComponentFixture<BenefitPersonalDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BenefitPersonalDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BenefitPersonalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
