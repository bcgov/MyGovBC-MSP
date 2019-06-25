import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewCardWrapperComponent } from './review-card-wrapper.component';

describe('ReviewCardWrapperComponent', () => {
  let component: ReviewCardWrapperComponent;
  let fixture: ComponentFixture<ReviewCardWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewCardWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewCardWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
