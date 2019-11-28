import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactReviewCardComponent } from './contact-review-card.component';

describe('ContactReviewCardComponent', () => {
  let component: ContactReviewCardComponent;
  let fixture: ComponentFixture<ContactReviewCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactReviewCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactReviewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
