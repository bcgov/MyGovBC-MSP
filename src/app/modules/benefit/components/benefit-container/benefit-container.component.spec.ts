import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BenefitContainerComponent } from './benefit-container.component';

describe('BenefitContainerComponent', () => {
  let component: BenefitContainerComponent;
  let fixture: ComponentFixture<BenefitContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BenefitContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BenefitContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
