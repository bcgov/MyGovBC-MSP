import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {BenefitReviewComponent} from './review.component';

describe('BenefitReviewComponent', () => {
  let component: BenefitReviewComponent;
  let fixture: ComponentFixture<BenefitReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BenefitReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BenefitReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
