import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BenefitPersonalInfoComponent } from './personal-info.component';

describe('PersonalInfoComponent', () => {
  let component: BenefitPersonalInfoComponent;
  let fixture: ComponentFixture<BenefitPersonalInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BenefitPersonalInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BenefitPersonalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
