import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressReviewPartComponent } from './address-review-part.component';
import { ReviewPartComponent } from '../review-part/review-part.component';

describe('AddressReviewPartComponent', () => {
  let component: AddressReviewPartComponent;
  let fixture: ComponentFixture<AddressReviewPartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressReviewPartComponent, ReviewPartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressReviewPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
