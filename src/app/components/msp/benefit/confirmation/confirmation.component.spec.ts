import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BenefitConfirmationComponent } from './confirmation.component';

describe('BenefitConfirmationComponent', () => {
  let component: BenefitConfirmationComponent;
  let fixture: ComponentFixture<BenefitConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BenefitConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BenefitConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
