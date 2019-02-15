import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BenefitSendingComponent } from './sending.component';

describe('BenefitSendingComponent', () => {
  let component: BenefitSendingComponent;
  let fixture: ComponentFixture<BenefitSendingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BenefitSendingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BenefitSendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
