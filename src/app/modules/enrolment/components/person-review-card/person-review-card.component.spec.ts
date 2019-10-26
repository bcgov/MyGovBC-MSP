import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonReviewCardComponent } from './person-review-card.component';

describe('PersonReviewCardComponent', () => {
  let component: PersonReviewCardComponent;
  let fixture: ComponentFixture<PersonReviewCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonReviewCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonReviewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
