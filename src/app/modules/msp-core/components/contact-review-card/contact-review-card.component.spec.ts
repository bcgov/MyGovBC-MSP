import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ContactReviewCardComponent } from './contact-review-card.component';
import { ReviewCardComponent } from '../review-card/review-card.component';
import { AddressReviewPartComponent } from '../address-review-part/address-review-part.component';
import { ReviewPartComponent } from '../review-part/review-part.component';

describe('ContactReviewCardComponent', () => {
  let component: ContactReviewCardComponent;
  let fixture: ComponentFixture<ContactReviewCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ContactReviewCardComponent,
        ReviewCardComponent,
        AddressReviewPartComponent,
        ReviewPartComponent
      ],
      imports: [
        RouterTestingModule
      ]
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
