import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonReviewCardComponent, IPersonReviewCard } from './person-review-card.component';
import { MspCoreModule } from '../../../msp-core/msp-core.module';

describe('PersonReviewCardComponent', () => {
  let component: PersonReviewCardComponent<IPersonReviewCard>;
  let fixture: ComponentFixture<PersonReviewCardComponent<IPersonReviewCard>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonReviewCardComponent ],
      imports: [MspCoreModule]
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
