import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PersonReviewCardComponent, IPersonReviewCard } from './person-review-card.component';
import { MspCoreModule } from '../../../msp-core/msp-core.module';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';
import { Relationship } from '../../../../models/relationship.enum';

describe('PersonReviewCardComponent', () => {
  let component: PersonReviewCardComponent<IPersonReviewCard>;
  let fixture: ComponentFixture<PersonReviewCardComponent<IPersonReviewCard>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonReviewCardComponent ],
      imports: [
        MspCoreModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonReviewCardComponent);
    component = fixture.componentInstance;
    component.person = new MspPerson(Relationship.Applicant)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
